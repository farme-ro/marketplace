'use client'

/**
 * System Config Page
 * 
 * View and manage feature flags and environment configuration
 */

import { useState, useEffect } from 'react'
import { Search, Info, ExternalLink, Settings, AlertCircle } from 'lucide-react'
import { AccessDenied } from '@/components/auth/AccessDenied'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useAdminAuth } from '@/lib/auth/admin-auth-context'
import { hasPermission, getAdminRole } from '@/lib/permissions'
import { getFeatureFlags, updateFeatureFlag, getEnvInfo, type FeatureFlag, type EnvInfo } from '@/lib/api/system'

export default function SystemConfigPage() {
  const { admin } = useAdminAuth()
  
  // All hooks must be called before any conditional returns
  const [envInfo, setEnvInfo] = useState<EnvInfo | null>(null)
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([])
  const [readOnly, setReadOnly] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [scopeFilter, setScopeFilter] = useState<string>('')
  const [sourceFilter, setSourceFilter] = useState<string>('')
  
  // Confirm dialog for flag updates
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    flag: FeatureFlag | null
    newStatus: 'active' | 'fallback' | 'partial' | 'off'
    onConfirm: () => void
  }>({
    open: false,
    flag: null,
    newStatus: 'active',
    onConfirm: () => {},
  })

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [env, flags] = await Promise.all([
        getEnvInfo(),
        getFeatureFlags(),
      ])
      setEnvInfo(env)
      setFeatureFlags(flags.flags || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea datelor')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  // RBAC check - after all hooks
  const role = getAdminRole(admin)
  const canAccess = role === 'superadmin' || role === 'admin'
  
  if (!canAccess) {
    return (
      <AccessDenied
        message="Această secțiune este disponibilă doar pentru administratorii tehnici ai platformei."
      />
    )
  }

  const handleFlagToggle = (flag: FeatureFlag, newStatus: 'active' | 'fallback' | 'partial' | 'off') => {
    if (!flag.editable || readOnly) return

    setConfirmDialog({
      open: true,
      flag,
      newStatus,
      onConfirm: async () => {
        try {
          await updateFeatureFlag(flag.name, newStatus === 'active')
          await loadData()
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Eroare la actualizare flag')
        } finally {
          setConfirmDialog({ ...confirmDialog, open: false })
        }
      },
    })
  }

  // Filter flags
  const filteredFlags = featureFlags.filter((flag) => {
    const matchesSearch = !searchQuery || 
      flag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesScope = !scopeFilter || flag.scope === scopeFilter
    const matchesSource = !sourceFilter || flag.source === sourceFilter
    return matchesSearch && matchesScope && matchesSource
  })

  const getStatusColor = (status: FeatureFlag['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'partial':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'fallback':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      case 'off':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusLabel = (status: FeatureFlag['status']) => {
    switch (status) {
      case 'active':
        return 'ON'
      case 'partial':
        return 'PARTIAL'
      case 'fallback':
        return 'FALLBACK'
      case 'off':
        return 'OFF'
    }
  }

  const getScopeColor = (scope?: string) => {
    switch (scope) {
      case 'core commerce':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'experimental':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'beta':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      case 'internal':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getEnvLabel = (env: EnvInfo['environment']) => {
    switch (env) {
      case 'dev':
        return 'Development'
      case 'staging':
        return 'Staging'
      case 'prod':
        return 'Production'
      case 'local':
        return 'Local'
      default:
        return env
    }
  }

  const getEnvColor = (env: EnvInfo['environment']) => {
    switch (env) {
      case 'prod':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'staging':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'dev':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'local':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configurare Sistem</h1>
        <p className="text-muted-foreground">
          Gestionare feature flags și informații despre mediu
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Environment Info */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <Settings className="h-5 w-5 text-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Mediu</h2>
        </div>
        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-farmero-olive border-r-transparent"></div>
            Se încarcă...
          </div>
        ) : envInfo ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <dt className="text-xs font-medium text-muted-foreground">Environment</dt>
              <dd className="mt-1">
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getEnvColor(
                    envInfo.environment
                  )}`}
                >
                  {getEnvLabel(envInfo.environment)}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-muted-foreground">Backend URL</dt>
              <dd className="mt-1 flex items-center gap-2">
                <a
                  href={envInfo.backendUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {envInfo.backendUrl}
                </a>
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-muted-foreground">Frontend URL</dt>
              <dd className="mt-1 flex items-center gap-2">
                <a
                  href={envInfo.frontendUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {envInfo.frontendUrl}
                </a>
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-muted-foreground">Admin URL</dt>
              <dd className="mt-1 flex items-center gap-2">
                <a
                  href={envInfo.adminUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {envInfo.adminUrl}
                </a>
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              </dd>
            </div>
            {envInfo.version && (
              <div>
                <dt className="text-xs font-medium text-muted-foreground">Versiune</dt>
                <dd className="mt-1 text-sm text-foreground">{envInfo.version}</dd>
              </div>
            )}
            {envInfo.buildTime && (
              <div>
                <dt className="text-xs font-medium text-muted-foreground">Build Time</dt>
                <dd className="mt-1 text-sm text-foreground">
                  {new Date(envInfo.buildTime).toLocaleString('ro-RO')}
                </dd>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Feature Flags */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Feature Flags</h2>
          </div>
          {readOnly && (
            <div className="flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs dark:border-yellow-800 dark:bg-yellow-900/20">
              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-yellow-800 dark:text-yellow-400">
                Read-only / Static (configurabil doar prin code/deploy)
              </span>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="mb-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Caută după nume sau descriere..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          {/* Scope and Source Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[150px]">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Scop
              </label>
              <select
                value={scopeFilter}
                onChange={(e) => setScopeFilter(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Toate</option>
                <option value="core commerce">Core Commerce</option>
                <option value="experimental">Experimental</option>
                <option value="beta">Beta</option>
                <option value="internal">Internal</option>
              </select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Sursă
              </label>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Toate</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Info about feature flags */}
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs dark:border-blue-800 dark:bg-blue-900/20">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="text-blue-800 dark:text-blue-400">
              <p className="font-medium mb-1">Despre Feature Flags</p>
              <p>
                Feature flags controlează ce funcționalități sunt active în platformă. Majoritatea
                flag-urilor sunt controlate în{' '}
                <code className="rounded bg-blue-100 px-1 py-0.5 dark:bg-blue-900/40">
                  frontend/src/lib/backend-sync/status.ts
                </code>
                . Vezi{' '}
                <code className="rounded bg-blue-100 px-1 py-0.5 dark:bg-blue-900/40">
                  frontend/docs/FARMERO_BACKENDSYNC_ACTIVATION_PLAN.md
                </code>{' '}
                pentru detalii complete.
              </p>
            </div>
          </div>
        </div>

        {/* Flags Table */}
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
                    Nume
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Descriere
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Scop
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Sursă
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Locație
                  </th>
                  {!readOnly && (
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      Acțiuni
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredFlags.length === 0 ? (
                  <tr>
                    <td colSpan={readOnly ? 6 : 7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                      Nu am găsit feature flags după criteriile alese.
                    </td>
                  </tr>
                ) : (
                  filteredFlags.map((flag) => (
                    <tr key={flag.name}>
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{flag.name}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {flag.description || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                            flag.status
                          )}`}
                        >
                          {getStatusLabel(flag.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {flag.scope ? (
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getScopeColor(
                              flag.scope
                            )}`}
                          >
                            {flag.scope}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm capitalize">{flag.source}</span>
                      </td>
                      <td className="px-4 py-3">
                        {flag.location ? (
                          <code className="text-xs text-muted-foreground">{flag.location}</code>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </td>
                      {!readOnly && (
                        <td className="px-4 py-3">
                          {flag.editable ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleFlagToggle(flag, 'active')}
                                className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                                  flag.status === 'active'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-muted text-muted-foreground hover:bg-green-100'
                                }`}
                              >
                                ON
                              </button>
                              <button
                                onClick={() => handleFlagToggle(flag, 'off')}
                                className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                                  flag.status === 'off'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-muted text-muted-foreground hover:bg-red-100'
                                }`}
                              >
                                OFF
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">Read-only</span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        onConfirm={confirmDialog.onConfirm}
        title={`Modifică feature flag: ${confirmDialog.flag?.name}`}
        message={`Ești sigur că vrei să setezi flag-ul "${confirmDialog.flag?.name}" pe "${getStatusLabel(confirmDialog.newStatus)}"?`}
        confirmText="Confirmă"
        cancelText="Anulează"
        variant="warning"
      />
    </div>
  )
}

