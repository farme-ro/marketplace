'use client'

/**
 * Audit Log Page
 * 
 * View admin action audit logs
 */

import { useState, useEffect } from 'react'
import { Search, Filter, Calendar, ChevronDown, ChevronUp } from 'lucide-react'
import { DataTable, Pagination, type Column } from '@/components/ui/DataTable'
import { AccessDenied } from '@/components/auth/AccessDenied'
import { useAdminAuth } from '@/lib/auth/admin-auth-context'
import { hasPermission } from '@/lib/permissions'
import { getAuditLogs, type AuditLogEntry, type AuditLogFilters } from '@/lib/utils/admin-audit'

export default function AuditLogPage() {
  const { admin } = useAdminAuth()
  
  // All hooks must be called before any conditional returns
  const [entries, setEntries] = useState<AuditLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  
  // Filters
  const [actionFilter, setActionFilter] = useState('')
  const [targetTypeFilter, setTargetTypeFilter] = useState('')
  const [performedByFilter, setPerformedByFilter] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  
  // Expanded metadata
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const loadAuditLogs = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const filters: AuditLogFilters = {
        page,
        limit: 20,
      }
      
      if (actionFilter) filters.action = actionFilter
      if (targetTypeFilter) filters.targetType = targetTypeFilter as any
      if (performedByFilter) filters.performedBy = performedByFilter
      if (startDate) filters.startDate = startDate
      if (endDate) filters.endDate = endDate
      
      const response = await getAuditLogs(filters)
      setEntries(response.entries)
      setTotalPages(response.pagination.totalPages)
      setTotal(response.pagination.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea audit log-ului')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAuditLogs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, actionFilter, targetTypeFilter, performedByFilter, startDate, endDate])
  
  // RBAC check - after all hooks
  const canView = hasPermission(admin, 'view_audit_log')
  
  if (!canView) {
    return <AccessDenied requiredPermission="view_audit_log" />
  }

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  const formatMetadata = (metadata?: Record<string, unknown>): string => {
    if (!metadata || Object.keys(metadata).length === 0) return '-'
    return JSON.stringify(metadata, null, 2)
  }

  const truncateReason = (reason?: string, maxLength = 50): string => {
    if (!reason) return '-'
    if (reason.length <= maxLength) return reason
    return reason.substring(0, maxLength) + '...'
  }

  const columns: Column<AuditLogEntry>[] = [
    {
      key: 'performedAt',
      header: 'Data',
      render: (entry) => (
        <div>
          <div className="text-sm font-medium">
            {new Date(entry.performedAt).toLocaleDateString('ro-RO')}
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date(entry.performedAt).toLocaleTimeString('ro-RO')}
          </div>
        </div>
      ),
    },
    {
      key: 'performedBy',
      header: 'Admin',
      render: (entry) => (
        <div>
          <div className="text-sm font-medium">{entry.performedBy.fullName}</div>
          <div className="text-xs text-muted-foreground">{entry.performedBy.email}</div>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Acțiune',
      render: (entry) => (
        <span className="inline-flex rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
          {entry.action}
        </span>
      ),
    },
    {
      key: 'targetType',
      header: 'Tip țintă',
      render: (entry) => (
        <span className="text-sm capitalize">{entry.targetType}</span>
      ),
    },
    {
      key: 'targetId',
      header: 'ID țintă',
      render: (entry) => (
        <span className="font-mono text-xs">{entry.targetId.slice(0, 8)}...</span>
      ),
    },
    {
      key: 'reason',
      header: 'Motiv',
      render: (entry) => (
        <div className="max-w-xs">
          <p className="text-sm text-muted-foreground">
            {truncateReason(entry.reason)}
          </p>
        </div>
      ),
    },
    {
      key: 'metadata',
      header: 'Detalii',
      render: (entry) => {
        const hasMetadata = entry.metadata && Object.keys(entry.metadata).length > 0
        if (!hasMetadata) return <span className="text-muted-foreground">-</span>
        
        const isExpanded = expandedRows.has(entry.id)
        return (
          <button
            onClick={() => toggleExpand(entry.id)}
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Ascunde
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Vezi detalii
              </>
            )}
          </button>
        )
      },
    },
  ]

  // Check if backend endpoint is available
  const isBackendAvailable = entries.length > 0 || !loading

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Audit Log</h1>
        <p className="text-muted-foreground">Istoric acțiuni admin</p>
      </div>

      {/* Backend not available message */}
      {!isBackendAvailable && !loading && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <p className="text-sm text-yellow-800 dark:text-yellow-400">
            Audit log-ul nu este încă disponibil în backend. Vezi{' '}
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Action Filter */}
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Acțiune
            </label>
            <input
              type="text"
              placeholder="ex: PRODUCER_APPROVED"
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value)
                setPage(1)
              }}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          {/* Target Type Filter */}
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Tip țintă
            </label>
            <select
              value={targetTypeFilter}
              onChange={(e) => {
                setTargetTypeFilter(e.target.value)
                setPage(1)
              }}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Toate</option>
              <option value="producer">Producător</option>
              <option value="user">Utilizator</option>
              <option value="order">Comandă</option>
              <option value="journal_article">Articol jurnal</option>
              <option value="subscription">Abonament</option>
              <option value="promotion">Promoție</option>
              <option value="system">Sistem</option>
            </select>
          </div>

          {/* Performed By Filter */}
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Admin (ID)
            </label>
            <input
              type="text"
              placeholder="ID admin"
              value={performedByFilter}
              onChange={(e) => {
                setPerformedByFilter(e.target.value)
                setPage(1)
              }}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          {/* Date Range */}
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Data început
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value)
                setPage(1)
              }}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Data sfârșit
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value)
                setPage(1)
              }}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setActionFilter('')
                setTargetTypeFilter('')
                setPerformedByFilter('')
                setStartDate('')
                setEndDate('')
                setPage(1)
              }}
              className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
            >
              Șterge filtre
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      {!loading && (
        <div className="text-sm text-muted-foreground">
          Total: {total} înregistrări
        </div>
      )}

      {/* Table */}
      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={entries}
          loading={loading}
          emptyMessage="Nu am găsit nicio înregistrare de audit după criteriile alese."
        />

        {/* Expanded metadata rows */}
        {entries.map((entry) => {
          if (!expandedRows.has(entry.id)) return null
          if (!entry.metadata || Object.keys(entry.metadata).length === 0) return null

          return (
            <div
              key={`metadata-${entry.id}`}
              className="rounded-lg border border-border bg-muted/30 p-4"
            >
              <div className="mb-2 text-xs font-semibold text-muted-foreground">
                Metadata pentru {entry.action}
              </div>
              <pre className="overflow-x-auto text-xs">
                {formatMetadata(entry.metadata)}
              </pre>
              {entry.reason && (
                <div className="mt-3 border-t border-border pt-3">
                  <div className="mb-1 text-xs font-semibold text-muted-foreground">
                    Motiv complet:
                  </div>
                  <p className="text-sm text-foreground">{entry.reason}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      {!loading && entries.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}

