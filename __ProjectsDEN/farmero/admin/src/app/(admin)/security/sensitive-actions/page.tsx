'use client'

/**
 * Sensitive Actions Page
 * 
 * Acțiuni sensibile: suspendare user, aprobare producător, refund, schimbare roluri, etc.
 */

import { useState, useEffect } from 'react'
import { Search, Filter, Calendar, ExternalLink } from 'lucide-react'
import { DataTable, Pagination, type Column } from '@/components/ui/DataTable'
import { Drawer } from '@/components/ui/Drawer'
import { AccessDenied } from '@/components/auth/AccessDenied'
import { useAdminAuth } from '@/lib/auth/admin-auth-context'
import { hasPermission } from '@/lib/permissions'
import {
  getSensitiveActions,
  type SensitiveActionEntry,
  type SensitiveActionTargetType,
} from '@/lib/api/security'
import Link from 'next/link'

type TimeRange = 1 | 7 | 30

export default function SensitiveActionsPage() {
  const { admin } = useAdminAuth()
  const [actions, setActions] = useState<SensitiveActionEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAction, setSelectedAction] = useState<SensitiveActionEntry | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [actionTypeFilter, setActionTypeFilter] = useState<string>('all')
  const [targetTypeFilter, setTargetTypeFilter] = useState<SensitiveActionTargetType | 'all'>('all')
  const [timeRange, setTimeRange] = useState<TimeRange>(7)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Get unique action types for filter dropdown
  const [availableActionTypes, setAvailableActionTypes] = useState<string[]>([])

  const loadActions = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getSensitiveActions({
        search: searchQuery || undefined,
        actionType: actionTypeFilter !== 'all' ? actionTypeFilter : undefined,
        targetType: targetTypeFilter,
        days: timeRange,
        page,
        limit: 20,
      })
      setActions(response.data)
      setTotalPages(response.pagination.totalPages)

      // Extract unique action types for filter
      const uniqueTypes = Array.from(
        new Set(response.data.map((a) => a.actionType))
      ).sort()
      setAvailableActionTypes(uniqueTypes)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea acțiunilor')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadActions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionTypeFilter, targetTypeFilter, timeRange, page])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        setPage(1)
        loadActions()
      } else {
        loadActions()
      }
    }, 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  // RBAC checks - after hooks
  const canView =
    hasPermission(admin, 'view_security') || hasPermission(admin, 'view_access_logs')

  if (!canView) {
    return (
      <AccessDenied
        requiredPermission="view_security"
        message="Accesul la acțiunile sensibile este restricționat. Doar superadmin sau admin cu permisiunea 'view_security' pot accesa această secțiune."
      />
    )
  }

  const getTargetTypeLabel = (type: SensitiveActionTargetType) => {
    const labels: Record<SensitiveActionTargetType, string> = {
      USER: 'Utilizator',
      PRODUCER: 'Producător',
      ORDER: 'Comandă',
      SYSTEM: 'Sistem',
      JOURNAL: 'Journal',
      OTHER: 'Altele',
    }
    return labels[type] || type
  }

  const getTargetLink = (action: SensitiveActionEntry) => {
    if (!action.targetId && !action.targetSummary) return null

    switch (action.targetType) {
      case 'USER':
        return `/users?search=${action.targetSummary || action.targetId}`
      case 'PRODUCER':
        return `/producers?search=${action.targetSummary || action.targetId}`
      case 'ORDER':
        return `/orders?search=${action.targetId || action.targetSummary}`
      case 'JOURNAL':
        return `/jurnal?search=${action.targetId || action.targetSummary}`
      default:
        return null
    }
  }

  const columns: Column<SensitiveActionEntry>[] = [
    {
      key: 'createdAt',
      header: 'Data & ora',
      render: (a) => (
        <span className="text-sm text-foreground">
          {new Date(a.createdAt).toLocaleString('ro-RO')}
        </span>
      ),
    },
    {
      key: 'adminEmail',
      header: 'Admin email',
      render: (a) => (
        <span className="text-sm text-foreground">{a.adminEmail || '-'}</span>
      ),
    },
    {
      key: 'actionType',
      header: 'Tip acțiune',
      render: (a) => (
        <span className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {a.actionType}
        </span>
      ),
    },
    {
      key: 'targetSummary',
      header: 'Țintă',
      render: (a) => (
        <div>
          <div className="text-sm font-medium text-foreground">
            {a.targetSummary || a.targetId || '-'}
          </div>
          <div className="text-xs text-muted-foreground">
            {getTargetTypeLabel(a.targetType)}
          </div>
        </div>
      ),
    },
    {
      key: 'reason',
      header: 'Reason',
      render: (a) => (
        <div className="flex items-center gap-1">
          {a.reason ? (
            <>
              <span
                className="truncate text-sm text-muted-foreground"
                title={a.reason}
              >
                {a.reason.length > 30 ? `${a.reason.slice(0, 30)}...` : a.reason}
              </span>
            </>
          ) : (
            <span className="text-xs text-muted-foreground">-</span>
          )}
        </div>
      ),
    },
    {
      key: 'ip',
      header: 'IP',
      render: (a) => (
        <span className="font-mono text-xs text-foreground">{a.ip || '-'}</span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Sensitive Changes</h1>
        <p className="text-muted-foreground">
          Acțiuni sensibile: suspendare user, aprobare producător, refund, schimbare roluri, etc.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      {actions.length === 0 && !loading && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <p className="text-sm text-yellow-800 dark:text-yellow-400">
            Backend-ul nu expune încă acțiuni sensibile detaliate. Poți verifica sistemul de audit
            log sau Sentry direct.
          </p>
          <p className="mt-2 text-xs text-yellow-700 dark:text-yellow-500">
            Endpoint-ul <code>GET /admin/security/sensitive-actions</code> nu este implementat. Vezi{' '}
            <code>docs/ADMIN_BACKEND_GAPS.md</code> pentru detalii.
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
              placeholder="Caută după email admin, țintă sau ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={actionTypeFilter}
              onChange={(e) => {
                setActionTypeFilter(e.target.value)
                setPage(1)
              }}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">Toate tipurile</option>
              {availableActionTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={targetTypeFilter}
              onChange={(e) => {
                setTargetTypeFilter(e.target.value as SensitiveActionTargetType | 'all')
                setPage(1)
              }}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">Toate tipurile</option>
              <option value="USER">Utilizator</option>
              <option value="PRODUCER">Producător</option>
              <option value="ORDER">Comandă</option>
              <option value="SYSTEM">Sistem</option>
              <option value="JOURNAL">Journal</option>
              <option value="OTHER">Altele</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <select
              value={timeRange}
              onChange={(e) => {
                setTimeRange(parseInt(e.target.value) as TimeRange)
                setPage(1)
              }}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value={1}>24 ore</option>
              <option value={7}>7 zile</option>
              <option value={30}>30 zile</option>
            </select>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={actions}
        loading={loading}
        onRowClick={(action) => {
          setSelectedAction(action)
          setDrawerOpen(true)
        }}
        emptyMessage="Nu am găsit acțiuni sensibile după criteriile alese."
      />

      {!loading && actions.length > 0 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}

      {/* Detail Drawer */}
      {selectedAction && (
        <Drawer
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false)
            setSelectedAction(null)
          }}
          title={`Sensitive Action: ${selectedAction.actionType}`}
        >
          <div className="space-y-6">
            {/* Action Info */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">Tip acțiune</h3>
              <span className="rounded bg-red-100 px-3 py-1 text-sm font-medium text-red-800 dark:bg-red-900/20 dark:text-red-400">
                {selectedAction.actionType}
              </span>
            </div>

            {/* Admin Info */}
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Admin</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Admin ID</dt>
                  <dd className="text-sm font-mono text-foreground">{selectedAction.adminId}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Email</dt>
                  <dd className="text-sm text-foreground">{selectedAction.adminEmail || '-'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">IP Address</dt>
                  <dd className="text-sm font-mono text-foreground">{selectedAction.ip || '-'}</dd>
                </div>
              </dl>
            </div>

            {/* Target Info */}
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Țintă</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Tip</dt>
                  <dd className="text-sm text-foreground">
                    {getTargetTypeLabel(selectedAction.targetType)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">ID</dt>
                  <dd className="text-sm font-mono text-foreground">
                    {selectedAction.targetId || '-'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Summary</dt>
                  <dd className="text-sm text-foreground">
                    {selectedAction.targetSummary || '-'}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Reason */}
            {selectedAction.reason && (
              <div>
                <h3 className="mb-2 text-sm font-semibold text-foreground">Motiv</h3>
                <div className="rounded-lg border border-border bg-muted/50 p-4">
                  <p className="text-sm text-foreground">{selectedAction.reason}</p>
                </div>
              </div>
            )}

            {/* Date */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">Data & ora</h3>
              <p className="text-sm text-foreground">
                {new Date(selectedAction.createdAt).toLocaleString('ro-RO')}
              </p>
            </div>

            {/* Actions */}
            {getTargetLink(selectedAction) && (
              <div className="flex gap-2 border-t border-border pt-4">
                <Link
                  href={getTargetLink(selectedAction)!}
                  className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <ExternalLink className="h-4 w-4" />
                  Vezi {getTargetTypeLabel(selectedAction.targetType).toLowerCase()} în admin
                </Link>
              </div>
            )}
          </div>
        </Drawer>
      )}
    </div>
  )
}

