'use client'

/**
 * Marketing Funnels Page
 * 
 * Funnels & activare pentru producători și clienți
 */

import { useState, useEffect } from 'react'
import { TrendingUp, Store, Users } from 'lucide-react'
import { AccessDenied } from '@/components/auth/AccessDenied'
import { useAdminAuth } from '@/lib/auth/admin-auth-context'
import { hasPermission, hasAnyPermission } from '@/lib/permissions'
import { getMarketingFunnels, type MarketingFunnels, type MarketingFunnelStep } from '@/lib/api/marketing-growth'

type TimeRange = 30 | 90

export default function MarketingFunnelsPage() {
  const { admin } = useAdminAuth()
  const [funnels, setFunnels] = useState<MarketingFunnels | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<TimeRange>(90)

  const loadFunnels = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getMarketingFunnels({ days: timeRange })
      setFunnels(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea funnel-urilor')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFunnels()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange])

  // RBAC checks - after hooks
  const canView =
    hasPermission(admin, 'view_marketing') ||
    hasAnyPermission(admin, ['view_marketing', 'view_journal', 'view_subscriptions'])

  if (!canView) {
    return <AccessDenied requiredPermission="view_marketing" />
  }

  const renderFunnelStep = (step: MarketingFunnelStep, index: number, maxValue: number) => {
    const widthPercentage = maxValue > 0 ? (step.value / maxValue) * 100 : 0

    return (
      <div key={index} className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">{step.label}</span>
          <div className="flex items-center gap-3">
            {step.conversionFromPrevious !== null && (
              <span className="text-xs text-muted-foreground">
                {step.conversionFromPrevious.toFixed(1)}% din anterior
              </span>
            )}
            <span className="text-sm font-bold text-foreground">{step.value.toLocaleString()}</span>
          </div>
        </div>
        <div className="h-8 w-full rounded-md bg-muted overflow-hidden">
          <div
            className="h-full bg-farmero-olive-600 transition-all duration-500 flex items-center justify-end pr-2"
            style={{ width: `${widthPercentage}%` }}
          >
            {widthPercentage > 10 && (
              <span className="text-xs font-medium text-white">
                {step.value.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Funnels & Activare</h1>
          <p className="text-muted-foreground">Funnel-uri de conversie pentru producători și clienți</p>
        </div>
        <div className="text-center text-muted-foreground">Încărcăm datele de marketing...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Funnels & Activare</h1>
          <p className="text-muted-foreground">Funnel-uri de conversie pentru producători și clienți</p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-400">
            Nu putem încărca datele acum. Verifică /system/status sau încearcă din nou.
          </p>
        </div>
      </div>
    )
  }

  if (!funnels) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Funnels & Activare</h1>
          <p className="text-muted-foreground">Funnel-uri de conversie pentru producători și clienți</p>
        </div>
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <p className="text-sm text-yellow-800 dark:text-yellow-400">
            Funnel-urile nu sunt încă expuse de backend. Acest ecran este pregătit pentru integrare.
          </p>
          <p className="mt-2 text-xs text-yellow-700 dark:text-yellow-500">
            Endpoint-ul <code>GET /admin/marketing/funnels</code> nu este implementat. Vezi{' '}
            <code>docs/ADMIN_BACKEND_GAPS.md</code> pentru detalii.
          </p>
        </div>
      </div>
    )
  }

  const producersMaxValue =
    funnels.producers.length > 0
      ? Math.max(...funnels.producers.map((s) => s.value))
      : 0
  const clientsMaxValue =
    funnels.clients.length > 0 ? Math.max(...funnels.clients.map((s) => s.value)) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Funnels & Activare</h1>
          <p className="text-muted-foreground">Funnel-uri de conversie pentru producători și clienți</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(parseInt(e.target.value) as TimeRange)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value={30}>30 zile</option>
            <option value={90}>90 zile</option>
          </select>
        </div>
      </div>

      {/* Producers Funnel */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="mb-6 flex items-center gap-2">
          <Store className="h-5 w-5 text-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Funnel Producători</h2>
        </div>
        <div className="space-y-4">
          {funnels.producers.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nu există date disponibile.</p>
          ) : (
            funnels.producers.map((step, index) =>
              renderFunnelStep(step, index, producersMaxValue)
            )
          )}
        </div>
      </div>

      {/* Clients Funnel */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="mb-6 flex items-center gap-2">
          <Users className="h-5 w-5 text-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Funnel Clienți</h2>
        </div>
        <div className="space-y-4">
          {funnels.clients.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nu există date disponibile.</p>
          ) : (
            funnels.clients.map((step, index) => renderFunnelStep(step, index, clientsMaxValue))
          )}
        </div>
      </div>
    </div>
  )
}

