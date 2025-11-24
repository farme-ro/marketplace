'use client'

/**
 * Status & Feature Flags Page
 * 
 * System health and feature flags overview
 */

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, Clock, Activity, Bug, ExternalLink, Send } from 'lucide-react'
import { 
  getHealthStatus, 
  getFeatureFlags, 
  getSystemHealth,
  getErrorSummary,
  sendTestEvent,
  type HealthStatus, 
  type FeatureFlag,
  type ServiceHealth,
  type ErrorSummary,
} from '@/lib/api/system'
import { useAdminAuth } from '@/lib/auth/admin-auth-context'
import { hasPermission } from '@/lib/permissions'
import { AccessDenied } from '@/components/auth/AccessDenied'

export default function SystemStatusPage() {
  const { admin } = useAdminAuth()
  
  // All hooks must be called before any conditional returns
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [services, setServices] = useState<ServiceHealth[]>([])
  const [errorSummary, setErrorSummary] = useState<ErrorSummary | null>(null)
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([])
  const [featureFlagsReadOnly, setFeatureFlagsReadOnly] = useState(false)
  const [loading, setLoading] = useState(true)
  const [healthError, setHealthError] = useState<string | null>(null)
  const [testEventLoading, setTestEventLoading] = useState(false)
  const [testEventResult, setTestEventResult] = useState<string | null>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      const [systemHealth, flagsResponse, errors] = await Promise.all([
        getSystemHealth(),
        getFeatureFlags(),
        getErrorSummary(),
      ])
      setHealth(systemHealth.overall)
      setServices(systemHealth.services)
      setFeatureFlags(flagsResponse.flags || [])
      setErrorSummary(errors)
      setHealthError(null)
    } catch (err) {
      setHealthError(err instanceof Error ? err.message : 'Eroare la încărcarea datelor')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // Refresh every 30 seconds
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  // RBAC check - after all hooks
  const canView = hasPermission(admin, 'view_system_status')
  
  if (!canView) {
    return <AccessDenied requiredPermission="view_system_status" />
  }

  const handleTestEvent = async () => {
    try {
      setTestEventLoading(true)
      setTestEventResult(null)
      const result = await sendTestEvent()
      if (result.success) {
        setTestEventResult('Eveniment de test trimis cu succes! Verifică Sentry/monitoring.')
      } else {
        setTestEventResult(result.message || 'Eroare la trimiterea evenimentului de test')
      }
    } catch (err) {
      setTestEventResult(err instanceof Error ? err.message : 'Eroare necunoscută')
    } finally {
      setTestEventLoading(false)
      // Clear message after 5 seconds
      setTimeout(() => setTestEventResult(null), 5000)
    }
  }

  const getServiceStatusIcon = (status: ServiceHealth['status']) => {
    switch (status) {
      case 'up':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'degraded':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'down':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getServiceStatusColor = (status: ServiceHealth['status']) => {
    switch (status) {
      case 'up':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'down':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getHealthIcon = () => {
    if (!health) return <AlertCircle className="h-5 w-5 text-yellow-500" />
    if (health.status === 'healthy') return <CheckCircle className="h-5 w-5 text-green-500" />
    if (health.status === 'degraded') return <AlertCircle className="h-5 w-5 text-yellow-500" />
    return <XCircle className="h-5 w-5 text-red-500" />
  }

  const getHealthLabel = () => {
    if (!health) return 'Necunoscut'
    if (health.status === 'healthy') return 'Operațional'
    if (health.status === 'degraded') return 'Degradat'
    return 'Neoperațional'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Status sistem & feature flags</h1>
        <p className="text-muted-foreground">
          Aici vezi statusul tehnic al platformei și feature-urile active.
        </p>
      </div>

      {/* Overall Health */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Status General</h2>
        </div>
        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-farmero-olive border-r-transparent"></div>
            Se încarcă...
          </div>
        ) : healthError ? (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
            <p className="text-sm text-yellow-800 dark:text-yellow-400">
              {healthError}
            </p>
            <p className="mt-2 text-xs text-yellow-700 dark:text-yellow-500">
              Endpoint-ul <code>GET /health</code> nu este implementat în backend. Vezi{' '}
              <code>docs/ADMIN_BACKEND_GAPS.md</code>.
            </p>
          </div>
        ) : health ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {getHealthIcon()}
              <div>
                <div className="font-medium text-foreground">{getHealthLabel()}</div>
                {health.version && (
                  <div className="text-sm text-muted-foreground">Versiune: {health.version}</div>
                )}
              </div>
            </div>
            {health.uptime && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Uptime: {Math.floor(health.uptime / 3600)}h{' '}
                {Math.floor((health.uptime % 3600) / 60)}m
              </div>
            )}
            {health.database && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">Bază de date:</span>
                <span
                  className={`text-sm ${
                    health.database.status === 'connected'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {health.database.status === 'connected' ? 'Conectată' : 'Deconectată'}
                </span>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Service Health Grid */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Service Health</h2>
        </div>
        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-farmero-olive border-r-transparent"></div>
            Se încarcă...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.name}
                className="rounded-lg border border-border bg-muted/50 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getServiceStatusIcon(service.status)}
                    <span className="font-medium text-foreground">{service.name}</span>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getServiceStatusColor(
                      service.status
                    )}`}
                  >
                    {service.status === 'up'
                      ? 'UP'
                      : service.status === 'degraded'
                      ? 'DEGRADED'
                      : 'DOWN'}
                  </span>
                </div>
                {service.responseTime !== undefined && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Response time: {service.responseTime}ms
                  </div>
                )}
                {service.message && (
                  <div className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
                    {service.message}
                  </div>
                )}
              </div>
            ))}
            {services.length === 0 && (
              <div className="col-span-full rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
                <p className="text-sm text-yellow-800 dark:text-yellow-400">
                  Nu sunt servicii disponibile pentru verificare. Endpoint-urile de health check
                  nu sunt implementate încă.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Stats */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <Bug className="h-5 w-5 text-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Error Stats</h2>
        </div>
        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-farmero-olive border-r-transparent"></div>
            Se încarcă...
          </div>
        ) : errorSummary ? (
          <div className="space-y-4">
            {/* Total Errors 24h */}
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <div className="text-sm text-muted-foreground">Erori în ultimele 24h</div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {errorSummary.totalErrors24h}
              </div>
            </div>

            {/* Top Endpoints with Errors */}
            {errorSummary.errorsByEndpoint.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-semibold text-foreground">
                  Top Endpoints cu erori
                </h3>
                <div className="space-y-2">
                  {errorSummary.errorsByEndpoint.slice(0, 5).map((endpoint, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3"
                    >
                      <div>
                        <div className="text-sm font-medium">
                          {endpoint.method} {endpoint.endpoint}
                        </div>
                        {endpoint.lastError && (
                          <div className="text-xs text-muted-foreground">
                            Ultima eroare: {new Date(endpoint.lastError).toLocaleString('ro-RO')}
                          </div>
                        )}
                      </div>
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900/20 dark:text-red-400">
                        {endpoint.errorCount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Errors */}
            {errorSummary.recentErrors.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-semibold text-foreground">Ultimele erori</h3>
                <div className="space-y-2">
                  {errorSummary.recentErrors.slice(0, 5).map((error) => (
                    <div
                      key={error.id}
                      className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20"
                    >
                      <div className="text-sm font-medium text-red-800 dark:text-red-400">
                        {error.message}
                      </div>
                      <div className="mt-1 flex items-center gap-4 text-xs text-red-700 dark:text-red-500">
                        {error.endpoint && (
                          <span>
                            {error.method} {error.endpoint}
                          </span>
                        )}
                        {error.statusCode && <span>Status: {error.statusCode}</span>}
                        <span>{new Date(error.timestamp).toLocaleString('ro-RO')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
            <p className="text-sm text-yellow-800 dark:text-yellow-400">
              Statistici de erori nu sunt încă expuse de backend. Consultă Sentry direct pentru
              detalii despre erori.
            </p>
            <p className="mt-2 text-xs text-yellow-700 dark:text-yellow-500">
              Endpoint-ul <code>GET /admin/system/errors-summary</code> nu este implementat. Vezi{' '}
              <code>docs/ADMIN_BACKEND_GAPS.md</code>.
            </p>
          </div>
        )}
      </div>

      {/* Test Monitoring */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <Send className="h-5 w-5 text-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Test Monitoring</h2>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Trimite un eveniment de test către sistemul de monitorizare (Sentry/Logger) pentru a
            verifica că pipeline-ul funcționează corect.
          </p>
          <button
            onClick={handleTestEvent}
            disabled={testEventLoading}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {testEventLoading ? (
              <>
                <div className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"></div>
                Se trimite...
              </>
            ) : (
              'Trimite eveniment de test'
            )}
          </button>
          {testEventResult && (
            <div
              className={`rounded-lg border p-3 text-sm ${
                testEventResult.includes('succes')
                  ? 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : 'border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
              }`}
            >
              {testEventResult}
            </div>
          )}
        </div>
      </div>

      {/* Uptime Notes */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <ExternalLink className="h-5 w-5 text-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Uptime & Status</h2>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            Status public (uptime):{' '}
            <span className="text-foreground">
              Status page public va fi disponibil în viitor
            </span>
          </p>
          <p className="text-xs">
            Această secțiune va conține link-uri către status page public și servicii de uptime
            monitoring când vor fi disponibile.
          </p>
        </div>
      </div>

      {/* Feature Flags */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Feature Flags</h2>
        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-farmero-olive border-r-transparent"></div>
            Se încarcă...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Feature
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Note
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {featureFlags.map((flag) => (
                  <tr key={flag.name}>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">
                      {flag.name}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          flag.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        }`}
                      >
                        {flag.status === 'active' ? 'Active' : 'Fallback'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {flag.description || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && featureFlags.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nu sunt feature flags disponibile.
          </p>
        )}
      </div>
    </div>
  )
}

