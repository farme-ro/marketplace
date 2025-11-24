'use client'

/**
 * Access Logs Page
 * 
 * Istoric login / logout / fail / session expire
 */

import { useState, useEffect } from 'react'
import { Search, Filter, Calendar } from 'lucide-react'
import { DataTable, Pagination, type Column } from '@/components/ui/DataTable'
import { Drawer } from '@/components/ui/Drawer'
import { AccessDenied } from '@/components/auth/AccessDenied'
import { useAdminAuth } from '@/lib/auth/admin-auth-context'
import { hasPermission } from '@/lib/permissions'
import {
  getAccessLogs,
  type AccessLogEntry,
  type AccessLogEventType,
  ACCESS_LOG_EVENT_LABELS,
} from '@/lib/api/security'

type TimeRange = 1 | 7 | 30

export default function AccessLogsPage() {
  const { admin } = useAdminAuth()
  const [logs, setLogs] = useState<AccessLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedLog, setSelectedLog] = useState<AccessLogEntry | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [eventTypeFilter, setEventTypeFilter] = useState<AccessLogEventType | 'all'>('all')
  const [timeRange, setTimeRange] = useState<TimeRange>(7)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const loadLogs = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getAccessLogs({
        search: searchQuery || undefined,
        eventType: eventTypeFilter,
        days: timeRange,
        page,
        limit: 20,
      })
      setLogs(response.data)
      setTotalPages(response.pagination.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea logurilor')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLogs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventTypeFilter, timeRange, page])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        setPage(1)
        loadLogs()
      } else {
        loadLogs()
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
        message="Accesul la logurile de acces este restricționat. Doar superadmin sau admin cu permisiunea 'view_security' pot accesa această secțiune."
      />
    )
  }

  const getEventTypeColor = (eventType: AccessLogEventType) => {
    switch (eventType) {
      case 'LOGIN_SUCCESS':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'LOGIN_FAILED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'LOGOUT':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      case 'SESSION_EXPIRED':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const truncateUserAgent = (userAgent: string | null | undefined) => {
    if (!userAgent) return '-'
    return userAgent.length > 50 ? `${userAgent.slice(0, 50)}...` : userAgent
  }

  const columns: Column<AccessLogEntry>[] = [
    {
      key: 'createdAt',
      header: 'Data & ora',
      render: (e) => (
        <span className="text-sm text-foreground">
          {new Date(e.createdAt).toLocaleString('ro-RO')}
        </span>
      ),
    },
    {
      key: 'userEmail',
      header: 'Email utilizator',
      render: (e) => (
        <span className="text-sm text-foreground">{e.userEmail || 'guest'}</span>
      ),
    },
    {
      key: 'role',
      header: 'Rol',
      render: (e) => (
        <span className="text-sm text-muted-foreground">{e.role || '-'}</span>
      ),
    },
    {
      key: 'ip',
      header: 'IP',
      render: (e) => (
        <span className="font-mono text-xs text-foreground">{e.ip || '-'}</span>
      ),
    },
    {
      key: 'eventType',
      header: 'Tip eveniment',
      render: (e) => (
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getEventTypeColor(
            e.eventType
          )}`}
        >
          {ACCESS_LOG_EVENT_LABELS[e.eventType] || e.eventType}
        </span>
      ),
    },
    {
      key: 'userAgent',
      header: 'User Agent',
      render: (e) => (
        <span
          className="text-xs text-muted-foreground"
          title={e.userAgent || undefined}
        >
          {truncateUserAgent(e.userAgent)}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Access Logs</h1>
        <p className="text-muted-foreground">
          Istoric login / logout / fail / session expire
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      {logs.length === 0 && !loading && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <p className="text-sm text-yellow-800 dark:text-yellow-400">
            Backend-ul nu expune încă loguri de acces detaliate. Poți verifica sistemul de loguri
            server-side / Sentry direct.
          </p>
          <p className="mt-2 text-xs text-yellow-700 dark:text-yellow-500">
            Endpoint-ul <code>GET /admin/security/access-logs</code> nu este implementat. Vezi{' '}
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
              placeholder="Caută după email sau IP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={eventTypeFilter}
              onChange={(e) => {
                setEventTypeFilter(e.target.value as AccessLogEventType | 'all')
                setPage(1)
              }}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">Toate tipurile</option>
              <option value="LOGIN_SUCCESS">Login reușit</option>
              <option value="LOGIN_FAILED">Login eșuat</option>
              <option value="LOGOUT">Logout</option>
              <option value="SESSION_EXPIRED">Sesiune expirată</option>
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
        data={logs}
        loading={loading}
        onRowClick={(log) => {
          setSelectedLog(log)
          setDrawerOpen(true)
        }}
        emptyMessage="Nu am găsit loguri după criteriile alese."
      />

      {!loading && logs.length > 0 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}

      {/* Detail Drawer */}
      {selectedLog && (
        <Drawer
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false)
            setSelectedLog(null)
          }}
          title={`Access Log: ${ACCESS_LOG_EVENT_LABELS[selectedLog.eventType] || selectedLog.eventType}`}
        >
          <div className="space-y-6">
            {/* Event Info */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">Tip eveniment</h3>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getEventTypeColor(
                    selectedLog.eventType
                  )}`}
                >
                  {ACCESS_LOG_EVENT_LABELS[selectedLog.eventType] || selectedLog.eventType}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {selectedLog.eventType === 'LOGIN_SUCCESS' &&
                  'Autentificare reușită în sistemul de administrare.'}
                {selectedLog.eventType === 'LOGIN_FAILED' &&
                  'Tentativă eșuată de autentificare. Verifică dacă email-ul și parola sunt corecte.'}
                {selectedLog.eventType === 'LOGOUT' &&
                  'Utilizatorul s-a delogat din sistemul de administrare.'}
                {selectedLog.eventType === 'SESSION_EXPIRED' &&
                  'Sesiunea a expirat din cauza inactivității sau timeout-ului configurat.'}
              </p>
            </div>

            {/* User Info */}
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Informații utilizator</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">User ID</dt>
                  <dd className="text-sm font-mono text-foreground">
                    {selectedLog.userId || 'N/A'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Email</dt>
                  <dd className="text-sm text-foreground">{selectedLog.userEmail || 'guest'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Rol</dt>
                  <dd className="text-sm text-foreground">{selectedLog.role || '-'}</dd>
                </div>
              </dl>
            </div>

            {/* Connection Info */}
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Informații conexiune</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">IP Address</dt>
                  <dd className="text-sm font-mono text-foreground">{selectedLog.ip || '-'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">User Agent</dt>
                  <dd className="text-sm font-mono text-foreground break-all">
                    {selectedLog.userAgent || '-'}
                  </dd>
                </div>
                {selectedLog.location && (
                  <div>
                    <dt className="text-xs font-medium text-muted-foreground">Locație</dt>
                    <dd className="text-sm text-foreground">{selectedLog.location}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Data & ora</dt>
                  <dd className="text-sm text-foreground">
                    {new Date(selectedLog.createdAt).toLocaleString('ro-RO')}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  )
}

