'use client'

/**
 * Security Overview Page
 * 
 * Dashboard pentru statusul autentificărilor și activității de administrare
 */

import { useState, useEffect } from 'react'
import { Shield, AlertTriangle, Lock, Globe } from 'lucide-react'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { AccessDenied } from '@/components/auth/AccessDenied'
import { useAdminAuth } from '@/lib/auth/admin-auth-context'
import { hasPermission } from '@/lib/permissions'
import {
  getSecurityOverview,
  getAccessLogs,
  getSensitiveActions,
  type SecurityOverview as SecurityOverviewType,
  type AccessLogEntry,
  type SensitiveActionEntry,
  ACCESS_LOG_EVENT_LABELS,
} from '@/lib/api/security'

export default function SecurityOverviewPage() {
  const { admin } = useAdminAuth()
  const [overview, setOverview] = useState<SecurityOverviewType | null>(null)
  const [readOnly, setReadOnly] = useState(false)
  const [recentLogins, setRecentLogins] = useState<AccessLogEntry[]>([])
  const [recentSensitiveActions, setRecentSensitiveActions] = useState<SensitiveActionEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [overviewResponse, logsResponse, actionsResponse] = await Promise.all([
        getSecurityOverview(),
        getAccessLogs({ limit: 10, days: 1 }),
        getSensitiveActions({ limit: 10, days: 1 }),
      ])

      setOverview(overviewResponse.overview)
      setReadOnly(overviewResponse.readOnly)
      setRecentLogins(logsResponse.data)
      setRecentSensitiveActions(actionsResponse.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea datelor')
    } finally {
      setLoading(false)
    }
  }

  const getEventTypeColor = (eventType: string) => {
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

  const recentLoginsColumns: Column<AccessLogEntry>[] = [
    {
      key: 'userEmail',
      header: 'Email',
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
      key: 'createdAt',
      header: 'Data',
      render: (e) => (
        <span className="text-sm text-muted-foreground">
          {new Date(e.createdAt).toLocaleString('ro-RO')}
        </span>
      ),
    },
  ]

  const recentActionsColumns: Column<SensitiveActionEntry>[] = [
    {
      key: 'adminEmail',
      header: 'Admin',
      render: (a) => (
        <span className="text-sm text-foreground">{a.adminEmail || '-'}</span>
      ),
    },
    {
      key: 'actionType',
      header: 'Acțiune',
      render: (a) => (
        <span className="text-sm font-medium text-foreground">{a.actionType}</span>
      ),
    },
    {
      key: 'targetSummary',
      header: 'Țintă',
      render: (a) => (
        <span className="text-sm text-muted-foreground">{a.targetSummary || '-'}</span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Data',
      render: (a) => (
        <span className="text-sm text-muted-foreground">
          {new Date(a.createdAt).toLocaleString('ro-RO')}
        </span>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Security Overview</h1>
          <p className="text-muted-foreground">
            Statusul autentificărilor și activității de administrare
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-6">
              <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
              <div className="mt-4 h-8 w-16 animate-pulse rounded bg-muted"></div>
            </div>
          ))}
        </div>
        <div className="text-center text-muted-foreground">Încărcăm datele de securitate...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Security Overview</h1>
          <p className="text-muted-foreground">
            Statusul autentificărilor și activității de administrare
          </p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-400">
            Nu putem încărca datele acum. Verifică /system/status sau încearcă din nou.
          </p>
        </div>
      </div>
    )
  }

  if (!overview) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Security Overview</h1>
          <p className="text-muted-foreground">
            Statusul autentificărilor și activității de administrare
          </p>
        </div>
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <p className="text-sm text-yellow-800 dark:text-yellow-400">
            Nu avem date disponibile pentru acest dashboard.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Security Overview</h1>
        <p className="text-muted-foreground">
          Statusul autentificărilor și activității de administrare
        </p>
      </div>

      {readOnly && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <p className="text-sm text-yellow-800 dark:text-yellow-400">
            Datele afișate sunt fallback static. Endpoint-ul <code>GET /admin/security/overview</code>{' '}
            nu este încă implementat.
          </p>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">
              Login-uri admin reușite (24h)
            </h3>
            <Shield className="h-4 w-4 text-green-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {overview.successfulAdminLogins24h}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">
              Login-uri eșuate (24h)
            </h3>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">
            {overview.failedLogins24h}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Conturi blocate</h3>
            <Lock className="h-4 w-4 text-orange-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">{overview.lockedAccounts}</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">
              IP-uri suspecte (24h)
            </h3>
            <Globe className="h-4 w-4 text-yellow-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {overview.suspiciousIpCount24h !== null
              ? overview.suspiciousIpCount24h
              : 'N/A'}
          </p>
        </div>
      </div>

      {/* Recent Admin Logins */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Recent admin logins</h2>
        {recentLogins.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nu există date de securitate expuse încă de backend sau nu au avut loc evenimente
            recente.
          </p>
        ) : (
          <DataTable
            columns={recentLoginsColumns}
            data={recentLogins}
            loading={false}
            emptyMessage="Nu există login-uri recente."
          />
        )}
      </div>

      {/* Recent Sensitive Actions */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Ultimele acțiuni sensibile</h2>
        {recentSensitiveActions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nu există date de securitate expuse încă de backend sau nu au avut loc evenimente
            recente.
          </p>
        ) : (
          <DataTable
            columns={recentActionsColumns}
            data={recentSensitiveActions}
            loading={false}
            emptyMessage="Nu există acțiuni sensibile recente."
          />
        )}
      </div>
    </div>
  )
}

