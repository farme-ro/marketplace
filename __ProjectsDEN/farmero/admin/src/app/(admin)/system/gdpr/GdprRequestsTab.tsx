'use client'

/**
 * GDPR Requests Tab Component
 * 
 * Extended requests table with new columns and advanced export
 */

import { useState, useEffect, useCallback } from 'react'
import { Search, Filter, Download, FileText, Trash2, UserX, Edit, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { DataTable, Pagination, type Column } from '@/components/ui/DataTable'
import { Drawer } from '@/components/ui/Drawer'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { logAdminAction } from '@/lib/utils/admin-audit'
import {
  getGdprRequests,
  getGdprRequestById,
  updateGdprRequestStatus,
  generateGdprExport,
  type GdprRequest,
  type GdprRequestType,
  type GdprRequestStatus,
} from '@/lib/api/gdpr'
import Link from 'next/link'
import { useAdminAuth } from '@/lib/auth/admin-auth-context'

type TypeFilter = GdprRequestType | 'all'
type StatusFilter = GdprRequestStatus | 'all'

interface GdprRequestsTabProps {
  canManage: boolean
}

export function GdprRequestsTab({ canManage }: GdprRequestsTabProps) {
  const { admin } = useAdminAuth()
  const [requests, setRequests] = useState<GdprRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<GdprRequest | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [exportLoading, setExportLoading] = useState<string | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    title: string
    message: string
    onConfirm: (reason?: string) => void
    requireReason?: boolean
  }>({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {},
    requireReason: false,
  })

  // Filters
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    loadRequests()
  }, [typeFilter, statusFilter, page, dateFrom, dateTo])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        setPage(1)
        loadRequests()
      } else {
        loadRequests()
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const loadRequests = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getGdprRequests({
        type: typeFilter !== 'all' ? typeFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchQuery || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        page,
        limit: 20,
      })
      setRequests(response.data)
      setTotalPages(response.pagination.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea cererilor')
    } finally {
      setLoading(false)
    }
  }

  const handleRequestClick = async (request: GdprRequest) => {
    const fullRequest = await getGdprRequestById(request.id)
    setSelectedRequest(fullRequest || request)
    setDrawerOpen(true)
  }

  const handleStatusChange = async (
    requestId: string,
    newStatus: GdprRequestStatus,
    reason?: string
  ) => {
    try {
      await updateGdprRequestStatus(requestId, { status: newStatus, reason })
      // Audit logging for GDPR actions
      const auditAction =
        newStatus === 'EXPORT_GENERATED'
          ? 'GDPR_EXPORT_GENERATED'
          : newStatus === 'REJECTED'
            ? 'GDPR_REQUEST_REJECTED'
            : newStatus === 'COMPLETED' || newStatus === 'ARCHIVED'
              ? 'GDPR_REQUEST_PROCESSED'
              : 'GDPR_REQUEST_STATUS_CHANGED'

      await logAdminAction(
        {
          action: auditAction,
          targetType: 'gdpr_request',
          targetId: requestId,
          reason: reason || undefined,
          metadata: { newStatus, previousStatus: selectedRequest?.status },
        },
        admin
      )
      await loadRequests()
      if (selectedRequest?.id === requestId) {
        const updated = await getGdprRequestById(requestId)
        if (updated) setSelectedRequest(updated)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la actualizarea cererii')
    }
  }

  const handleGenerateExport = async (requestId: string, format: 'JSON' | 'CSV' | 'PDF') => {
    try {
      setExportLoading(requestId)
      const result = await generateGdprExport(requestId, format)
      // Update request with new download URL
      const updated = await getGdprRequestById(requestId)
      if (updated) {
        setSelectedRequest(updated)
        await loadRequests()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la generarea export-ului')
    } finally {
      setExportLoading(null)
    }
  }

  const getTypeLabel = (type: GdprRequestType) => {
    const labels: Record<GdprRequestType, string> = {
      EXPORT: 'Export date',
      DELETE: 'Ștergere',
      ANONYMIZE: 'Anonimizare',
      RECTIFY: 'Rectificare',
    }
    return labels[type] || type
  }

  const getTypeIcon = (type: GdprRequestType) => {
    switch (type) {
      case 'EXPORT':
        return <Download className="h-4 w-4" />
      case 'DELETE':
        return <Trash2 className="h-4 w-4" />
      case 'ANONYMIZE':
        return <UserX className="h-4 w-4" />
      case 'RECTIFY':
        return <Edit className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: GdprRequestStatus) => {
    const colors: Record<GdprRequestStatus, string> = {
      OPEN: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      EXPORT_GENERATED: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      ARCHIVED: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    }
    return colors[status] || 'bg-muted text-muted-foreground'
  }

  const getStatusLabel = (status: GdprRequestStatus) => {
    const labels: Record<GdprRequestStatus, string> = {
      OPEN: 'Deschisă',
      IN_PROGRESS: 'În procesare',
      COMPLETED: 'Finalizată',
      REJECTED: 'Respinsă',
      EXPORT_GENERATED: 'Export generat',
      ARCHIVED: 'Arhivată',
    }
    return labels[status] || status
  }

  const getUserTypeLabel = (type?: string) => {
    const labels: Record<string, string> = {
      CLIENT: 'Client',
      PRODUCER: 'Producător',
      ADMIN: 'Admin',
    }
    return labels[type || ''] || '-'
  }

  const getRequestMethodLabel = (method?: string) => {
    const labels: Record<string, string> = {
      EMAIL: 'Email',
      DASHBOARD: 'Dashboard',
      MANUAL: 'Manual',
    }
    return labels[method || ''] || '-'
  }

  const getSlaStatus = (request: GdprRequest): 'on-time' | 'at-risk' | 'overdue' => {
    if (!request.legalDeadline) return 'on-time'
    const deadline = new Date(request.legalDeadline)
    const now = new Date()
    const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (request.status === 'COMPLETED' || request.status === 'REJECTED') return 'on-time'
    if (daysRemaining < 0) return 'overdue'
    if (daysRemaining < 5) return 'at-risk'
    return 'on-time'
  }

  const getSlaBadge = (request: GdprRequest) => {
    const status = getSlaStatus(request)
    switch (status) {
      case 'on-time':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle className="h-3 w-3" />
            On time
          </span>
        )
      case 'at-risk':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
            <Clock className="h-3 w-3" />
            At risk
          </span>
        )
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900/20 dark:text-red-400">
            <AlertCircle className="h-3 w-3" />
            Overdue
          </span>
        )
    }
  }

  const calculateDeadline = (createdAt: string): string => {
    const created = new Date(createdAt)
    const deadline = new Date(created)
    deadline.setDate(deadline.getDate() + 30) // 30 days legal deadline
    return deadline.toISOString()
  }

  const columns: Column<GdprRequest>[] = [
    {
      key: 'id',
      header: 'ID',
      render: (r) => <span className="font-mono text-xs">{r.id.slice(0, 8)}...</span>,
    },
    {
      key: 'userEmail',
      header: 'Email utilizator',
      render: (r) => <span className="text-foreground">{r.userEmail}</span>,
    },
    {
      key: 'type',
      header: 'Tip',
      render: (r) => (
        <div className="flex items-center gap-2">
          {getTypeIcon(r.type)}
          <span className="text-sm text-foreground">{getTypeLabel(r.type)}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
            r.status
          )}`}
        >
          {getStatusLabel(r.status)}
        </span>
      ),
    },
    {
      key: 'legalDeadline',
      header: 'Deadline legal',
      render: (r) => {
        const deadline = r.legalDeadline || calculateDeadline(r.createdAt)
        return (
          <div className="flex flex-col gap-1">
            <span className="text-sm text-foreground">
              {new Date(deadline).toLocaleDateString('ro-RO')}
            </span>
            {getSlaBadge(r)}
          </div>
        )
      },
    },
    {
      key: 'userType',
      header: 'Tip utilizator',
      render: (r) => (
        <span className="text-sm text-muted-foreground">{getUserTypeLabel(r.userType)}</span>
      ),
    },
    {
      key: 'requestMethod',
      header: 'Metodă',
      render: (r) => (
        <span className="text-sm text-muted-foreground">{getRequestMethodLabel(r.requestMethod)}</span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Data creare',
      render: (r) => (
        <span className="text-sm text-muted-foreground">
          {new Date(r.createdAt).toLocaleDateString('ro-RO')}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      {requests.length === 0 && !loading && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <p className="text-sm text-yellow-800 dark:text-yellow-400">
            Nu există cereri GDPR disponibile. Endpoint-ul backend pentru cereri GDPR nu este încă
            implementat.
          </p>
          <p className="mt-2 text-xs text-yellow-700 dark:text-yellow-500">
            Vezi <code>docs/ADMIN_BACKEND_GAPS.md</code> pentru detalii.
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Caută după email sau ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value as TypeFilter)
                setPage(1)
              }}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">Toate tipurile</option>
              <option value="EXPORT">Export</option>
              <option value="DELETE">Ștergere</option>
              <option value="ANONYMIZE">Anonimizare</option>
              <option value="RECTIFY">Rectificare</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as StatusFilter)
                setPage(1)
              }}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">Toate statusurile</option>
              <option value="OPEN">Deschise</option>
              <option value="IN_PROGRESS">În procesare</option>
              <option value="COMPLETED">Finalizate</option>
              <option value="REJECTED">Respinse</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value)
                setPage(1)
              }}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="De la"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value)
                setPage(1)
              }}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Până la"
            />
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={requests}
        loading={loading}
        onRowClick={handleRequestClick}
        emptyMessage="Nu am găsit cereri GDPR după criteriile alese."
      />

      {!loading && requests.length > 0 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}

      {/* Detail Drawer */}
      {selectedRequest && (
        <Drawer
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false)
            setSelectedRequest(null)
          }}
          title={`Cerere GDPR: ${getTypeLabel(selectedRequest.type)}`}
        >
          <div className="space-y-6">
            {/* Request Info */}
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Informații cerere</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">ID</dt>
                  <dd className="text-sm font-mono text-foreground">{selectedRequest.id}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Email utilizator</dt>
                  <dd className="text-sm text-foreground">{selectedRequest.userEmail}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Tip utilizator</dt>
                  <dd className="text-sm text-foreground">{getUserTypeLabel(selectedRequest.userType)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Metodă solicitare</dt>
                  <dd className="text-sm text-foreground">{getRequestMethodLabel(selectedRequest.requestMethod)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Tip</dt>
                  <dd className="text-sm text-foreground">{getTypeLabel(selectedRequest.type)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Status</dt>
                  <dd className="text-sm text-foreground">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                        selectedRequest.status
                      )}`}
                    >
                      {getStatusLabel(selectedRequest.status)}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Data creare</dt>
                  <dd className="text-sm text-foreground">
                    {new Date(selectedRequest.createdAt).toLocaleString('ro-RO')}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Deadline legal</dt>
                  <dd className="text-sm text-foreground">
                    {new Date(selectedRequest.legalDeadline || calculateDeadline(selectedRequest.createdAt)).toLocaleString('ro-RO')}
                    {getSlaBadge(selectedRequest)}
                  </dd>
                </div>
                {selectedRequest.handledBy && (
                  <div>
                    <dt className="text-xs font-medium text-muted-foreground">Gestionat de</dt>
                    <dd className="text-sm text-foreground">
                      {selectedRequest.handledBy.fullName} ({selectedRequest.handledBy.email})
                    </dd>
                  </div>
                )}
                {selectedRequest.reason && (
                  <div>
                    <dt className="text-xs font-medium text-muted-foreground">Motiv</dt>
                    <dd className="text-sm text-foreground">{selectedRequest.reason}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Export Section */}
            {selectedRequest.type === 'EXPORT' && (
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <h3 className="mb-3 text-sm font-semibold text-foreground">Export date</h3>
                {selectedRequest.status === 'COMPLETED' && selectedRequest.downloadUrl ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-foreground">Export generat</p>
                        {selectedRequest.exportFormat && (
                          <p className="text-xs text-muted-foreground">Format: {selectedRequest.exportFormat}</p>
                        )}
                        {selectedRequest.exportGeneratedAt && (
                          <p className="text-xs text-muted-foreground">
                            Generat la: {new Date(selectedRequest.exportGeneratedAt).toLocaleString('ro-RO')}
                          </p>
                        )}
                      </div>
                      <a
                        href={selectedRequest.downloadUrl}
                        download
                        className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                      >
                        <Download className="h-4 w-4" />
                        Descarcă
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Selectează formatul pentru export:</p>
                    <div className="flex gap-2">
                      {(['JSON', 'CSV', 'PDF'] as const).map((format) => (
                        <button
                          key={format}
                          onClick={() => handleGenerateExport(selectedRequest.id, format)}
                          disabled={exportLoading === selectedRequest.id}
                          className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
                        >
                          {exportLoading === selectedRequest.id ? 'Generare...' : format}
                        </button>
                      ))}
                    </div>
                    {exportLoading === selectedRequest.id && (
                      <p className="text-xs text-muted-foreground">Se generează export-ul...</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            {canManage && (
              <div className="space-y-2 border-t border-border pt-4">
                {selectedRequest.status === 'OPEN' && (
                  <button
                    onClick={() =>
                      setConfirmDialog({
                        open: true,
                        title: 'Marchează ca "În procesare"',
                        message: `Ești sigur că vrei să marchezi cererea ca &quot;În procesare&quot;?`,
                        onConfirm: () => handleStatusChange(selectedRequest.id, 'IN_PROGRESS'),
                        requireReason: false,
                      })
                    }
                    className="w-full rounded-md bg-yellow-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-yellow-700"
                  >
                    Marchează ca &quot;În procesare&quot;
                  </button>
                )}
                {selectedRequest.status === 'IN_PROGRESS' && (
                  <>
                    <button
                      onClick={() =>
                        setConfirmDialog({
                          open: true,
                          title: 'Marchează ca &quot;Finalizată&quot;',
                          message: `Ești sigur că vrei să marchezi cererea ca &quot;Finalizată&quot;?`,
                          onConfirm: () => handleStatusChange(selectedRequest.id, 'COMPLETED'),
                          requireReason: false,
                        })
                      }
                      className="w-full rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                    >
                      Marchează ca &quot;Finalizată&quot;
                    </button>
                    <button
                      onClick={() =>
                        setConfirmDialog({
                          open: true,
                          title: 'Respinge cerere',
                          message: `Ești sigur că vrei să respingi această cerere?`,
                          onConfirm: (reason) =>
                            handleStatusChange(selectedRequest.id, 'REJECTED', reason),
                          requireReason: true,
                        })
                      }
                      className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                    >
                      Respinge cerere
                    </button>
                  </>
                )}
                <Link
                  href={`/support/users/${selectedRequest.userId}`}
                  className="block w-full rounded-md border border-border bg-background px-4 py-2 text-center text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  Vezi utilizator
                </Link>
              </div>
            )}
          </div>
        </Drawer>
      )}

      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        onConfirm={(reason) => {
          confirmDialog.onConfirm(reason)
          setConfirmDialog({ ...confirmDialog, open: false })
        }}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Confirmă"
        cancelText="Anulează"
        requireReason={confirmDialog.requireReason}
        reasonLabel="Motiv (obligatoriu pentru respingere)"
        reasonPlaceholder="Introduceți motivul respingerii..."
      />
    </div>
  )
}

