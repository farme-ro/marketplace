'use client'

/**
 * Producers Management Page
 * 
 * List producers with filters, search, and moderation actions
 */

import { useState, useEffect } from 'react'
import { Search, Filter } from 'lucide-react'
import { DataTable, Pagination, type Column } from '@/components/ui/DataTable'
import { Drawer } from '@/components/ui/Drawer'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { AccessDenied } from '@/components/auth/AccessDenied'
import { getProducers, getProducer, updateProducer } from '@/lib/api/admin'
import { useAdminAuth } from '@/lib/auth/admin-auth-context'
import { hasPermission } from '@/lib/permissions'
import { logAdminAction } from '@/lib/utils/admin-audit'
import type { ProducerSummary, ProducerDetail } from '@/lib/api/admin'

type ProducerStatus = 'PENDING_VERIFICATION' | 'APPROVED' | 'REJECTED' | 'all'

export default function ProducersPage() {
  const { admin } = useAdminAuth()
  const [producers, setProducers] = useState<ProducerSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProducer, setSelectedProducer] = useState<ProducerDetail | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
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

  // Filters
  const [statusFilter, setStatusFilter] = useState<ProducerStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const loadProducers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getProducers({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        page,
        limit: 20,
      })
      setProducers(response.producers)
      setTotalPages(response.pagination.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea producătorilor')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, page])

  // RBAC checks - after hooks
  const canView = hasPermission(admin, 'view_producers')
  const canEdit = hasPermission(admin, 'edit_producers')

  // Show access denied if no view permission
  if (!canView) {
    return <AccessDenied requiredPermission="view_producers" />
  }

  const handleRowClick = async (producer: ProducerSummary) => {
    try {
      const detail = await getProducer(producer.id)
      setSelectedProducer(detail)
      setDrawerOpen(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea detaliilor')
    }
  }

  const handleStatusChange = async (newStatus: 'APPROVED' | 'REJECTED') => {
    if (!selectedProducer || !canEdit) return

    const action = newStatus === 'APPROVED' ? 'aprobă' : 'respinge'
    const isReject = newStatus === 'REJECTED'
    
    setConfirmDialog({
      open: true,
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} producător`,
      message: `Ești sigur că vrei să ${action} producătorul "${selectedProducer.name}"?`,
      requireReason: isReject, // Require reason for reject
      reasonLabel: 'Motiv respingere',
      reasonPlaceholder: 'Introduceți motivul respingerii producătorului...',
      onConfirm: async (reason?: string) => {
        try {
          await updateProducer(selectedProducer.id, { status: newStatus })
          
          // Log audit action
          await logAdminAction({
            action: newStatus === 'APPROVED' ? 'PRODUCER_APPROVED' : 'PRODUCER_REJECTED',
            targetType: 'producer',
            targetId: selectedProducer.id,
            reason: reason || undefined,
            metadata: {
              producerName: selectedProducer.name,
              previousStatus: selectedProducer.status,
              newStatus,
            },
          }, admin)
          
          await loadProducers()
          if (selectedProducer) {
            const updated = await getProducer(selectedProducer.id)
            setSelectedProducer(updated)
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Eroare la actualizare')
        }
      },
    })
  }

  // Filter producers by search query (client-side)
  const filteredProducers = producers.filter((p) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      p.name.toLowerCase().includes(query) ||
      p.mainRegion?.name.toLowerCase().includes(query) ||
      p.user?.email.toLowerCase().includes(query)
    )
  })

  const columns: Column<ProducerSummary>[] = [
    {
      key: 'name',
      header: 'Nume',
      render: (p) => (
        <div>
          <div className="font-medium">{p.name}</div>
          {p.user && (
            <div className="text-xs text-muted-foreground">{p.user.email}</div>
          )}
        </div>
      ),
    },
    {
      key: 'mainRegion',
      header: 'Regiune',
      render: (p) => p.mainRegion?.name || '-',
    },
    {
      key: 'status',
      header: 'Status',
      render: (p) => {
        const statusLabels = {
          PENDING_VERIFICATION: 'În așteptare',
          APPROVED: 'Aprobat',
          REJECTED: 'Respins',
        }
        const statusColors = {
          PENDING_VERIFICATION: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
          APPROVED: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
          REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
        }
        return (
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusColors[p.status]}`}
          >
            {statusLabels[p.status]}
          </span>
        )
      },
    },
    {
      key: 'createdAt',
      header: 'Data înregistrării',
      render: (p) => new Date(p.createdAt).toLocaleDateString('ro-RO'),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Producători</h1>
        <p className="text-muted-foreground">Gestionare producători</p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Caută după nume, regiune sau email..."
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
                setStatusFilter(e.target.value as ProducerStatus)
                setPage(1)
              }}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">Toate statusurile</option>
              <option value="PENDING_VERIFICATION">În așteptare</option>
              <option value="APPROVED">Aprobate</option>
              <option value="REJECTED">Respinse</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredProducers}
        onRowClick={handleRowClick}
        loading={loading}
        emptyMessage="Nu am găsit niciun producător după criteriile alese."
      />

      {/* Pagination */}
      {!loading && filteredProducers.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Detail Drawer */}
      {selectedProducer && (
        <Drawer
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false)
            setSelectedProducer(null)
          }}
          title={selectedProducer.name}
        >
          <div className="space-y-6">
            {/* Producer Info */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                Informații producător
              </h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Email</dt>
                  <dd className="text-sm text-foreground">
                    {selectedProducer.user?.email || '-'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Regiune</dt>
                  <dd className="text-sm text-foreground">
                    {selectedProducer.mainRegion?.name || '-'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Status</dt>
                  <dd className="text-sm text-foreground">{selectedProducer.status}</dd>
                </div>
                {selectedProducer.description && (
                  <div>
                    <dt className="text-xs font-medium text-muted-foreground">
                      Descriere
                    </dt>
                    <dd className="text-sm text-foreground">
                      {selectedProducer.description}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Stats */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-foreground">Statistici</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-border bg-muted/50 p-3">
                  <div className="text-xs text-muted-foreground">Produse</div>
                  <div className="text-lg font-semibold">
                    {selectedProducer.products?.length || 0}
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-muted/50 p-3">
                  <div className="text-xs text-muted-foreground">Comenzi</div>
                  <div className="text-lg font-semibold">
                    {selectedProducer.orderVendors?.length || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Moderation Actions */}
            {canEdit && (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">Acțiuni</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProducer.status === 'PENDING_VERIFICATION' && (
                    <>
                      <button
                        onClick={() => handleStatusChange('APPROVED')}
                        className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                      >
                        Aprobă producător
                      </button>
                      <button
                        onClick={() => handleStatusChange('REJECTED')}
                        className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                      >
                        Respinge producător
                      </button>
                    </>
                  )}
                  {selectedProducer.status === 'REJECTED' && (
                    <button
                      onClick={() => {
                        // Reactivate doesn't require reason
                        handleStatusChange('APPROVED')
                      }}
                      className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                    >
                      Reactivează
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </Drawer>
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
