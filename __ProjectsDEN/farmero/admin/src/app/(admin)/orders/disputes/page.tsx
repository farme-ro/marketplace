'use client'

/**
 * Disputes Management Page
 * 
 * View and manage order disputes and refunds
 */

import { useState, useEffect } from 'react'
import { Search, Filter, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react'
import { DataTable, Pagination, type Column } from '@/components/ui/DataTable'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { AccessDenied } from '@/components/auth/AccessDenied'
import { useAdminAuth } from '@/lib/auth/admin-auth-context'
import { hasPermission, hasAnyPermission } from '@/lib/permissions'
import { logAdminAction } from '@/lib/utils/admin-audit'
import { getDisputes, updateDispute, createRefund, type Dispute } from '@/lib/api/commerce'

type DisputeStatus = 'open' | 'in_review' | 'resolved' | 'refunded' | 'all'
type DisputeType = 'quality' | 'delivery' | 'billing' | 'other' | 'all'

export default function DisputesPage() {
  const { admin } = useAdminAuth()
  
  // All hooks must be called before any conditional returns
  const [disputes, setDisputes] = useState<Dispute[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<DisputeStatus>('all')
  const [typeFilter, setTypeFilter] = useState<DisputeType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Confirm dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    title: string
    message: string
    onConfirm: (reason?: string) => void
    requireReason?: boolean
    reasonLabel?: string
    reasonPlaceholder?: string
  }>({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {},
    requireReason: false,
  })

  const loadDisputes = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getDisputes({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        type: typeFilter !== 'all' ? typeFilter : undefined,
        page,
        limit: 20,
      })
      setDisputes(response.disputes)
      setTotalPages(response.pagination?.totalPages || 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load disputes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDisputes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, typeFilter, page])
  
  // RBAC checks - after hooks
  const canView = hasPermission(admin, 'view_orders')
  const canManage = hasAnyPermission(admin, ['refund_orders', 'manage_financials'])
  
  if (!canView) {
    return <AccessDenied requiredPermission="view_orders" />
  }

  const handleStatusChange = async (
    dispute: Dispute,
    newStatus: 'in_review' | 'resolved' | 'refunded'
  ) => {
    if (!canManage) return

    const actionLabels = {
      in_review: 'Marchează ca în review',
      resolved: 'Marchează ca rezolvat',
      refunded: 'Creează refund',
    }

    const requiresReason = newStatus === 'resolved' || newStatus === 'refunded'

    setConfirmDialog({
      open: true,
      title: actionLabels[newStatus],
      message: `Ești sigur că vrei să ${actionLabels[newStatus].toLowerCase()} pentru disputa #${dispute.id.slice(0, 8)}?`,
      requireReason: requiresReason,
      reasonLabel: requiresReason ? 'Motiv/Rezoluție' : undefined,
      reasonPlaceholder: requiresReason
        ? 'Introduceți motivul sau rezoluția...'
        : undefined,
      onConfirm: async (reason?: string) => {
        try {
          if (newStatus === 'refunded' && dispute.orderId) {
            // Create refund
            await createRefund(dispute.orderId, {
              reason: reason || 'Refund pentru dispută',
            })
            
            // Update dispute status
            await updateDispute(dispute.id, {
              status: 'refunded',
              resolution: reason || undefined,
            })
          } else {
            await updateDispute(dispute.id, {
              status: newStatus,
              resolution: reason || undefined,
            })
          }

          // Log audit action
          await logAdminAction(
            {
              action: `DISPUTE_${newStatus.toUpperCase()}`,
              targetType: 'order',
              targetId: dispute.orderId,
              reason: reason || undefined,
              metadata: {
                disputeId: dispute.id,
                disputeType: dispute.type,
                previousStatus: dispute.status,
                newStatus,
              },
            },
            admin
          )

          await loadDisputes()
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Eroare la actualizare')
        } finally {
          setConfirmDialog({ ...confirmDialog, open: false })
        }
      },
    })
  }

  const getStatusIcon = (status: Dispute['status']) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
      case 'in_review':
        return <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
      case 'refunded':
        return <XCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
      default:
        return null
    }
  }

  const getStatusColor = (status: Dispute['status']) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'in_review':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'refunded':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getTypeLabel = (type: Dispute['type']) => {
    const labels = {
      quality: 'Calitate',
      delivery: 'Livrare',
      billing: 'Facturare',
      other: 'Altele',
    }
    return labels[type] || type
  }

  // Filter disputes by search query (client-side)
  const filteredDisputes = disputes.filter((d) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      d.id.toLowerCase().includes(query) ||
      d.orderId.toLowerCase().includes(query) ||
      d.description.toLowerCase().includes(query) ||
      d.order?.customer?.email.toLowerCase().includes(query)
    )
  })

  const columns: Column<Dispute>[] = [
    {
      key: 'id',
      header: 'ID Dispută',
      render: (d) => (
        <span className="font-mono text-xs">{d.id.slice(0, 8)}...</span>
      ),
    },
    {
      key: 'orderId',
      header: 'Comandă',
      render: (d) => (
        <div>
          <span className="font-mono text-xs">{d.orderId.slice(0, 8)}...</span>
          {d.order && (
            <div className="text-xs text-muted-foreground">
              {parseFloat(d.order.totalAmount).toFixed(2)} RON
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Tip',
      render: (d) => (
        <span className="text-sm capitalize">{getTypeLabel(d.type)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (d) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(d.status)}
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
              d.status
            )}`}
          >
            {d.status === 'open'
              ? 'Deschis'
              : d.status === 'in_review'
              ? 'În review'
              : d.status === 'resolved'
              ? 'Rezolvat'
              : 'Refundat'}
          </span>
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Client',
      render: (d) => (
        <div>
          {d.order?.customer ? (
            <>
              <div className="text-sm font-medium">{d.order.customer.fullName}</div>
              <div className="text-xs text-muted-foreground">{d.order.customer.email}</div>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">-</span>
          )}
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Descriere',
      render: (d) => (
        <div className="max-w-xs">
          <p className="truncate text-sm text-muted-foreground">{d.description}</p>
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Creată',
      render: (d) => (
        <div>
          <div className="text-sm">
            {new Date(d.createdAt).toLocaleDateString('ro-RO')}
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date(d.createdAt).toLocaleTimeString('ro-RO', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      ),
    },
    {
      key: 'updatedAt',
      header: 'Actualizată',
      render: (d) => (
        <div>
          <div className="text-sm">
            {new Date(d.updatedAt).toLocaleDateString('ro-RO')}
          </div>
          {d.resolvedAt && (
            <div className="text-xs text-muted-foreground">
              Rezolvată: {new Date(d.resolvedAt).toLocaleDateString('ro-RO')}
            </div>
          )}
        </div>
      ),
    },
  ]

  // Check if backend endpoint is available
  const isBackendAvailable = disputes.length > 0 || !loading

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dispute & Refunds</h1>
        <p className="text-muted-foreground">Gestionare dispute și refunduri</p>
      </div>

      {/* Backend not available message */}
      {!isBackendAvailable && !loading && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <p className="text-sm text-yellow-800 dark:text-yellow-400">
            Modulul de dispute nu este încă conectat la backend. Vezi{' '}
            <code className="rounded bg-yellow-100 px-1 py-0.5 text-xs dark:bg-yellow-900/40">
              docs/ADMIN_BACKEND_GAPS.md
            </code>{' '}
            pentru detalii despre endpoint-urile necesare.
          </p>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="space-y-4 rounded-lg border border-border bg-muted/50 p-4">
        <h3 className="text-sm font-semibold text-foreground">Filtre</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Caută după ID, comandă sau descriere..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as DisputeStatus)
                setPage(1)
              }}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">Toate statusurile</option>
              <option value="open">Deschise</option>
              <option value="in_review">În review</option>
              <option value="resolved">Rezolvate</option>
              <option value="refunded">Refundate</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value as DisputeType)
                setPage(1)
              }}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">Toate tipurile</option>
              <option value="quality">Calitate</option>
              <option value="delivery">Livrare</option>
              <option value="billing">Facturare</option>
              <option value="other">Altele</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredDisputes}
        loading={loading}
        emptyMessage="Nu am găsit nicio dispută după criteriile alese."
      />

      {/* Action Buttons for each dispute (if can manage) */}
      {canManage && filteredDisputes.length > 0 && (
        <div className="space-y-4">
          {filteredDisputes.map((dispute) => (
            <div
              key={dispute.id}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Dispută #{dispute.id.slice(0, 8)}</div>
                  <div className="text-sm text-muted-foreground">{dispute.description}</div>
                </div>
                <div className="flex gap-2">
                  {dispute.status === 'open' && (
                    <button
                      onClick={() => handleStatusChange(dispute, 'in_review')}
                      className="rounded-md bg-yellow-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-yellow-700"
                    >
                      Marchează în review
                    </button>
                  )}
                  {dispute.status === 'in_review' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(dispute, 'resolved')}
                        className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                      >
                        Marchează rezolvat
                      </button>
                      <button
                        onClick={() => handleStatusChange(dispute, 'refunded')}
                        className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-700"
                      >
                        Creează refund
                      </button>
                    </>
                  )}
                </div>
              </div>
              {dispute.resolution && (
                <div className="mt-2 rounded-lg border border-border bg-muted/50 p-2">
                  <div className="text-xs font-medium text-muted-foreground">Rezoluție:</div>
                  <div className="text-sm">{dispute.resolution}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && filteredDisputes.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Confirmă"
        cancelText="Anulează"
        requireReason={confirmDialog.requireReason}
        reasonLabel={confirmDialog.reasonLabel}
        reasonPlaceholder={confirmDialog.reasonPlaceholder}
      />
    </div>
  )
}

