/**
 * Status Page
 * 
 * Diagnostic page that checks if backend API and database are reachable
 * Accessible to everyone (no authentication required)
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button } from 'farme-ui'
import { Alert } from 'farme-ui'
import { checkBackendHealth } from '@/lib/api/health'
import type { HealthStatus } from '@/lib/api/health'
import { getApiBaseUrlForDisplay } from '@/lib/api/config'
import { PageContainer } from '@/components/layout/page-container'
import { cn } from '@/lib/utils/cn'
import { useI18n } from '@/lib/i18n/context'
import { formatDateTime } from '@/lib/utils/format'

interface StatusCheck {
  backend: 'checking' | 'ok' | 'error'
  database: 'checking' | 'ok' | 'error'
  error?: string
  timestamp?: string
  responseTime?: number
  httpStatus?: number
  apiUrl?: string
}

export default function StatusPage() {
  const { t, locale } = useI18n()
  const [status, setStatus] = useState<StatusCheck>({
    backend: 'checking',
    database: 'checking',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    async function checkStatus() {
      try {
        setIsLoading(true)
        setStatus({
          backend: 'checking',
          database: 'checking',
        })

        // Call backend health endpoint
        const health = await checkBackendHealth()

        // Determine status based on response (support both new and legacy formats)
        const backendOk = health.api === 'ok' || health.status === 'ok'
        const dbOk = health.db === 'ok' || health.database === 'connected'

        // Get API URL for display
        const apiUrl = getApiBaseUrlForDisplay()

        setStatus({
          backend: backendOk ? 'ok' : 'error',
          database: dbOk ? 'ok' : 'error',
          error: health.error,
          timestamp: health.timestamp || new Date().toISOString(),
          responseTime: health.responseTime,
          httpStatus: health.httpStatus,
          apiUrl,
        })
      } catch (err) {
        // Handle network errors, timeouts, etc.
        const errorMessage = err instanceof Error ? err.message : 'Eroare necunoscută'
        const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'
        
        setStatus({
          backend: 'error',
          database: 'error',
          error: `Nu s-a putut conecta la server: ${errorMessage}. Verifică că ${apiUrl} este accesibil.`,
          timestamp: new Date().toISOString(),
        })
      } finally {
        setIsLoading(false)
      }
    }

    checkStatus()
  }, [])

  // Auto-refresh logic
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(async () => {
        try {
          setIsLoading(true)
          const health = await checkBackendHealth()
          const backendOk = health.api === 'ok' || health.status === 'ok'
          const dbOk = health.db === 'ok' || health.database === 'connected'
          const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'
          
          setStatus({
            backend: backendOk ? 'ok' : 'error',
            database: dbOk ? 'ok' : 'error',
            error: health.error,
            timestamp: health.timestamp || new Date().toISOString(),
            responseTime: health.responseTime,
            httpStatus: health.httpStatus,
            apiUrl,
          })
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Eroare necunoscută'
          const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'
          
          setStatus({
            backend: 'error',
            database: 'error',
            error: `Nu s-a putut conecta la server: ${errorMessage}. Verifică că ${apiUrl} este accesibil.`,
            timestamp: new Date().toISOString(),
          })
        } finally {
          setIsLoading(false)
        }
      }, 30000) // Refresh every 30 seconds
      
      setRefreshInterval(interval)
      
      return () => {
        clearInterval(interval)
      }
    } else {
      if (refreshInterval) {
        clearInterval(refreshInterval)
        setRefreshInterval(null)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefresh])

  const getStatusColor = (status: 'checking' | 'ok' | 'error') => {
    switch (status) {
      case 'ok':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
      case 'checking':
        return 'text-yellow-600'
    }
  }

  const getStatusIcon = (status: 'checking' | 'ok' | 'error') => {
    switch (status) {
      case 'ok':
        return '✅'
      case 'error':
        return '❌'
      case 'checking':
        return '⏳'
    }
  }

  const getStatusText = (status: 'checking' | 'ok' | 'error') => {
    switch (status) {
      case 'ok':
        return 'OK'
      case 'error':
        return 'ERROR'
      case 'checking':
        return 'CHECKING...'
    }
  }

  return (
    <PageContainer maxWidth="2xl" className="py-10 md:py-16">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2 text-foreground">
            {t('status.title', 'System Status')}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            {t('status.subtitle', 'Diagnostic page to check backend API and database connectivity')}
          </p>
        </div>

        <Card variant="default" padding="lg" className="mb-4 border-border/60 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl">{t('status.serviceStatus', 'Service Status')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Backend Status */}
              <div className="flex items-center justify-between p-4 border border-border/60 rounded-xl bg-card">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{getStatusIcon(status.backend)}</div>
                  <div>
                    <p className="font-semibold text-foreground">{t('status.backendApi', 'Backend API')}</p>
                    <p className="text-sm text-muted-foreground">
                      {status.apiUrl || getApiBaseUrlForDisplay()}
                    </p>
                    {status.responseTime !== undefined && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('status.responseTime', 'Response time')}: {status.responseTime}ms
                        {status.httpStatus !== undefined && status.httpStatus > 0 && (
                          <span className="ml-2">• HTTP {status.httpStatus}</span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
                <span className={`font-bold text-lg ${getStatusColor(status.backend)}`}>
                  {getStatusText(status.backend)}
                </span>
              </div>

              {/* Database Status */}
              <div className="flex items-center justify-between p-4 border border-border/60 rounded-xl bg-card">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{getStatusIcon(status.database)}</div>
                  <div>
                    <p className="font-semibold text-foreground">{t('status.database', 'Database (Neon)')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('status.connectionStatus', 'Connection status from backend')}
                    </p>
                  </div>
                </div>
                <span className={`font-bold text-lg ${getStatusColor(status.database)}`}>
                  {getStatusText(status.database)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

      {/* Error Details */}
      {status.error && (
        <Alert variant="destructive" title={t('status.errorDetails', 'Error Details')} className="mb-4">
          <div className="space-y-2">
            <p className="text-sm">{status.error}</p>
            {status.httpStatus === 404 && (
              <div className="mt-3 pt-3 border-t border-destructive/20">
                <p className="text-sm font-semibold mb-2">Posibile soluții:</p>
                <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                  <li>Verifică că backend-ul rulează și este accesibil la {status.apiUrl || getApiBaseUrlForDisplay()}</li>
                  <li>Verifică că backend-ul are implementat un endpoint de health check (/status, /health sau /health/db)</li>
                  <li>Verifică configurația CORS pe backend pentru a permite request-uri de la frontend</li>
                  <li>Verifică în browser console (F12) pentru detalii despre eroarea de rețea</li>
                </ul>
              </div>
            )}
            {status.timestamp && (
              <p className="text-xs text-muted-foreground mt-2">
                Timestamp: {formatDateTime(status.timestamp, locale)}
              </p>
            )}
          </div>
        </Alert>
      )}

      {/* Success Message */}
      {!isLoading && status.backend === 'ok' && status.database === 'ok' && (
        <Alert variant="success" title={t('status.allSystemsOk', 'Toate sistemele funcționează')}>
          <p className="text-sm">
            {t('status.allSystemsOkDesc', 'Backend API și baza de date sunt accesibile și funcționează corect.')}
          </p>
          {status.responseTime !== undefined && (
            <p className="text-xs text-muted-foreground mt-1">
              Timp de răspuns: {status.responseTime}ms
            </p>
          )}
          {status.timestamp && (
            <p className="text-xs text-muted-foreground mt-2">
              Ultima verificare: {formatDateTime(status.timestamp, locale)}
            </p>
          )}
        </Alert>
      )}

        {/* Environment Info */}
        <Card variant="muted" padding="md" className="mt-4 border-border/60 rounded-2xl">
          <CardContent>
            <h3 className="font-semibold mb-4 text-foreground">{t('status.environmentInfo', 'Environment Info')}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Environment:</span>
                <span className="font-medium text-foreground">{process.env.NODE_ENV || 'development'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">API URL:</span>
                <span className="font-medium text-foreground font-mono text-xs">{getApiBaseUrlForDisplay()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frontend:</span>
                <span className="font-medium text-foreground">Next.js App Router</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Refresh Controls */}
        <div className="mt-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={async () => {
                setStatus({ backend: 'checking', database: 'checking' })
                setIsLoading(true)
                try {
                  const health = await checkBackendHealth()
                  const backendOk = health.api === 'ok' || health.status === 'ok'
                  const dbOk = health.db === 'ok' || health.database === 'connected'
                  const apiUrl = getApiBaseUrlForDisplay()
                  
                  setStatus({
                    backend: backendOk ? 'ok' : 'error',
                    database: dbOk ? 'ok' : 'error',
                    error: health.error,
                    timestamp: health.timestamp || new Date().toISOString(),
                    responseTime: health.responseTime,
                    httpStatus: health.httpStatus,
                    apiUrl,
                  })
                } catch (err) {
                  const errorMessage = err instanceof Error ? err.message : 'Eroare necunoscută'
                  const apiUrl = getApiBaseUrlForDisplay()
                  
                  setStatus({
                    backend: 'error',
                    database: 'error',
                    error: `Nu s-a putut conecta la server: ${errorMessage}. Verifică că ${apiUrl} este accesibil.`,
                    timestamp: new Date().toISOString(),
                  })
                } finally {
                  setIsLoading(false)
                }
              }}
              disabled={isLoading}
              variant="outline"
              className="w-full sm:w-auto"
              aria-label="Refresh status"
            >
              <svg
                className={cn('w-4 h-4 mr-2', isLoading && 'animate-spin')}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isLoading ? t('status.checkingStatus', 'Se verifică...') : t('status.refreshStatus', 'Refresh Status')}
            </Button>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4 rounded border-border"
                aria-label="Auto-refresh toggle"
              />
              <span className="text-sm text-muted-foreground">
                {t('status.autoRefresh', 'Auto-refresh (30s)')}
              </span>
            </label>
          </div>
          {autoRefresh && (
            <p className="text-xs text-center text-muted-foreground">
              Status-ul se va actualiza automat la fiecare 30 de secunde
            </p>
          )}
        </div>
    </PageContainer>
  )
}

