/**
 * Internal Status Dashboard
 * 
 * Pagină internă pentru verificarea stării feature flags și conectivității backend.
 * Accesibilă doar în development sau pentru roluri speciale.
 */

'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth/context'
import { useI18n } from '@/lib/i18n/context'
import { BackendSyncStatus, type BackendSyncFeature } from '@/lib/backend-sync/status'
import { Card, CardContent, CardHeader, CardTitle } from 'farme-ui'
import { Badge } from 'farme-ui'
import { Button } from 'farme-ui'
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Server,
  Code,
  Package,
  Shield,
} from 'lucide-react'

/**
 * Get runtime environment
 */
function getRuntimeEnv(): string {
  if (typeof window === 'undefined') {
    return 'server'
  }
  if (process.env.NODE_ENV === 'development') {
    return 'development'
  }
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
    return 'preview'
  }
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') {
    return 'production'
  }
  return 'unknown'
}

/**
 * Check backend health
 */
async function checkBackendHealth(): Promise<{ online: boolean; status?: number; error?: string }> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'
    const response = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(5000), // 5 second timeout
    })
    return {
      online: response.ok,
      status: response.status,
    }
  } catch (error) {
    return {
      online: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Check if user has access to this page
 */
function hasAccess(user: { role?: string } | null, env: string): boolean {
  // In development, always allow
  if (env === 'development') {
    return true
  }
  
  // Check env flag
  if (process.env.NEXT_PUBLIC_ENABLE_INTERNAL_STATUS === 'true') {
    return true
  }
  
  // Check role (if admin role exists)
  if (user?.role === 'admin') {
    return true
  }
  
  return false
}

export default function InternalStatusPage() {
  const { user } = useAuth()
  const { t } = useI18n()
  const [backendHealth, setBackendHealth] = useState<{
    online: boolean
    status?: number
    error?: string
  } | null>(null)
  const [isCheckingHealth, setIsCheckingHealth] = useState(false)
  const [appVersion, setAppVersion] = useState<string>('unknown')

  const env = getRuntimeEnv()
  const hasAccessToPage = hasAccess(user, env)

  useEffect(() => {
    // Get app version from env or package.json
    const version = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
    setAppVersion(version)

    // Check backend health on mount
    checkBackendHealth().then(setBackendHealth)
  }, [])

  const handleRefreshHealth = async () => {
    setIsCheckingHealth(true)
    const health = await checkBackendHealth()
    setBackendHealth(health)
    setIsCheckingHealth(false)
  }

  // Access control
  if (!hasAccessToPage) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-xl font-bold mb-2">
              {t('internal.status.accessDenied', 'Acces restricționat')}
            </h1>
            <p className="text-muted-foreground text-sm">
              {t(
                'internal.status.accessDeniedDescription',
                'Această pagină este disponibilă doar în modul development sau pentru utilizatori cu rol special.'
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const features = Object.entries(BackendSyncStatus) as [BackendSyncFeature, boolean][]
  const enabledCount = features.filter(([_, enabled]) => enabled).length
  const disabledCount = features.filter(([_, enabled]) => !enabled).length

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-8xl mx-auto px-4 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {t('internal.status.title', 'Status Dashboard Intern')}
          </h1>
          <p className="text-muted-foreground">
            {t(
              'internal.status.subtitle',
              'Vizualizare rapidă a stării feature flags și conectivității backend.'
            )}
          </p>
        </div>

        {/* Build Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              {t('internal.status.buildInfo', 'Informații Build')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {t('internal.status.environment', 'Mediu')}
                </p>
                <Badge variant={env === 'production' ? 'default' : 'secondary'}>
                  {env}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {t('internal.status.version', 'Versiune')}
                </p>
                <Badge variant="outline">{appVersion}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Backend Connectivity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              {t('internal.status.backendConnectivity', 'Conectivitate Backend')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {backendHealth === null ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">
                    {t('internal.status.checking', 'Se verifică...')}
                  </span>
                </div>
              ) : backendHealth.online ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-semibold">
                      {t('internal.status.backendOnline', 'Backend online')}
                    </span>
                    {backendHealth.status && (
                      <Badge variant="outline" className="ml-2">
                        {backendHealth.status}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefreshHealth}
                    disabled={isCheckingHealth}
                  >
                    <RefreshCw
                      className={`w-4 h-4 mr-2 ${isCheckingHealth ? 'animate-spin' : ''}`}
                    />
                    {t('internal.status.refresh', 'Reîmprospătează')}
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-red-600">
                    <XCircle className="w-5 h-5" />
                    <span className="font-semibold">
                      {t('internal.status.backendOffline', 'Backend offline')}
                    </span>
                  </div>
                  {backendHealth.error && (
                    <p className="text-sm text-muted-foreground ml-7">
                      {backendHealth.error}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground ml-7">
                    {t(
                      'internal.status.backendOfflineNote',
                      'Endpoint-ul /health nu este disponibil sau nu răspunde. Verifică configurația backend-ului.'
                    )}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefreshHealth}
                    disabled={isCheckingHealth}
                    className="ml-7"
                  >
                    <RefreshCw
                      className={`w-4 h-4 mr-2 ${isCheckingHealth ? 'animate-spin' : ''}`}
                    />
                    {t('internal.status.retry', 'Încearcă din nou')}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Feature Flags Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              {t('internal.status.featureFlags', 'Feature Flags')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">
                  {t('internal.status.total', 'Total')}
                </p>
                <p className="text-2xl font-bold">{features.length}</p>
              </div>
              <div className="p-4 bg-green-500/10 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">
                  {t('internal.status.active', 'Active')}
                </p>
                <p className="text-2xl font-bold text-green-600">{enabledCount}</p>
              </div>
              <div className="p-4 bg-orange-500/10 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">
                  {t('internal.status.fallback', 'Fallback')}
                </p>
                <p className="text-2xl font-bold text-orange-600">{disabledCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Flags Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t('internal.status.allFeatures', 'Toate Feature-urile')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-semibold">
                      {t('internal.status.feature', 'Feature')}
                    </th>
                    <th className="text-left p-2 font-semibold">
                      {t('internal.status.status', 'Status')}
                    </th>
                    <th className="text-left p-2 font-semibold">
                      {t('internal.status.mode', 'Mod')}
                    </th>
                    <th className="text-left p-2 font-semibold">
                      {t('internal.status.documentation', 'Documentație')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {features.map(([feature, enabled]) => (
                    <tr key={feature} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-mono text-xs">{feature}</td>
                      <td className="p-2">
                        <Badge variant={enabled ? 'default' : 'secondary'}>
                          {enabled
                            ? t('internal.status.active', 'Active')
                            : t('internal.status.fallback', 'Fallback')}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          {enabled ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-orange-600" />
                          )}
                          <span className="text-xs text-muted-foreground">
                            {enabled
                              ? t('internal.status.backend', 'Backend')
                              : t('internal.status.mock', 'Mock')}
                          </span>
                        </div>
                      </td>
                      <td className="p-2">
                        <a
                          href={`/docs/FARMERO_BACKENDSYNC_ACTIVATION_PLAN.md#${feature}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-xs flex items-center gap-1"
                        >
                          {t('internal.status.viewDocs', 'Vezi docs')}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground text-center">
              {t(
                'internal.status.footerNote',
                'Această pagină este disponibilă doar în modul development sau când NEXT_PUBLIC_ENABLE_INTERNAL_STATUS=true. Nu este accesibilă pentru utilizatori normali în producție.'
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

