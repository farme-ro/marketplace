'use client'

/**
 * Marketing & Growth Overview Page
 * 
 * Dashboard compact pentru growth metrics
 */

import { useState, useEffect } from 'react'
import { Store, Users, BookOpen, MousePointerClick, TrendingUp, DollarSign } from 'lucide-react'
import { AccessDenied } from '@/components/auth/AccessDenied'
import { useAdminAuth } from '@/lib/auth/admin-auth-context'
import { hasPermission, hasAnyPermission } from '@/lib/permissions'
import { getMarketingOverview, type MarketingOverviewStats } from '@/lib/api/marketing-growth'

export default function MarketingOverviewPage() {
  const { admin } = useAdminAuth()
  const [stats, setStats] = useState<MarketingOverviewStats | null>(null)
  const [readOnly, setReadOnly] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getMarketingOverview()
      setStats(response.stats)
      setReadOnly(response.readOnly)
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

  // RBAC checks - after hooks
  const canView =
    hasPermission(admin, 'view_marketing') ||
    hasAnyPermission(admin, ['view_marketing', 'view_journal', 'view_subscriptions'])

  if (!canView) {
    return <AccessDenied requiredPermission="view_marketing" />
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Marketing & Growth Overview</h1>
          <p className="text-muted-foreground">Dashboard pentru growth metrics</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-6">
              <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
              <div className="mt-4 h-8 w-16 animate-pulse rounded bg-muted"></div>
            </div>
          ))}
        </div>
        <div className="text-center text-muted-foreground">Încărcăm datele de marketing...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Marketing & Growth Overview</h1>
          <p className="text-muted-foreground">Dashboard pentru growth metrics</p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-400">
            Nu putem încărca datele acum. Verifică /system/status sau încearcă din nou.
          </p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Marketing & Growth Overview</h1>
          <p className="text-muted-foreground">Dashboard pentru growth metrics</p>
        </div>
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <p className="text-sm text-yellow-800 dark:text-yellow-400">
            Nu avem încă toate datele din backend pentru acest dashboard. Până atunci, poți folosi
            paginile de jurnal, abonamente și promotions pentru detalii.
          </p>
        </div>
      </div>
    )
  }

  const totalProducers = stats.promoPlanMix.free + stats.promoPlanMix.promo + (stats.promoPlanMix.premium || 0)
  const promoPercentage =
    totalProducers > 0
      ? ((stats.promoPlanMix.promo / totalProducers) * 100).toFixed(1)
      : '0.0'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Marketing & Growth Overview</h1>
        <p className="text-muted-foreground">Dashboard pentru growth metrics</p>
      </div>

      {readOnly && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <p className="text-sm text-yellow-800 dark:text-yellow-400">
            Datele afișate sunt compuse din endpoint-uri parțiale sau demo. Endpoint-ul complet{' '}
            <code>GET /admin/marketing/overview</code> nu este încă implementat.
          </p>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Producători activi</h3>
            <Store className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {stats.activePromotedProducers}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">cu plan promo plătit</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Clienți cu abonamente</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {stats.activeRecurringClients}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">recurente active</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Articole Jurnal</h3>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {stats.newJournalArticles30d}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">publicate luna aceasta</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">CTR Jurnal → Profil</h3>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {stats.journalProducerCtr30d.toFixed(2)}%
          </p>
          <p className="mt-1 text-xs text-muted-foreground">ultimele 30 zile</p>
        </div>
      </div>

      {/* Two Main Zones */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Jurnal & Storytelling */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Jurnal & Storytelling</h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Articole noi (30 zile)</div>
              <div className="text-2xl font-bold text-foreground">
                {stats.newJournalArticles30d}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">CTR mediu Jurnal → profil producător</div>
              <div className="text-2xl font-bold text-foreground">
                {stats.journalProducerCtr30d.toFixed(2)}%
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <div className="text-xs text-muted-foreground">
                * Datele despre producători cu articole vor fi disponibile când backend-ul va
                expune aceste metrici.
              </div>
            </div>
          </div>
        </div>

        {/* Promo & Abonamente */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Promo & Abonamente</h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Distribuție planuri producători</div>
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Gratis</span>
                  <span className="text-sm font-medium text-foreground">
                    {stats.promoPlanMix.free}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Promo</span>
                  <span className="text-sm font-medium text-foreground">
                    {stats.promoPlanMix.promo} ({promoPercentage}%)
                  </span>
                </div>
                {stats.promoPlanMix.premium !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Premium</span>
                    <span className="text-sm font-medium text-foreground">
                      {stats.promoPlanMix.premium}
                    </span>
                  </div>
                )}
              </div>
            </div>
            {stats.monthlyPromoRevenueEstimate !== null && (
              <div className="pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Venit lunar estimat</div>
                    <div className="text-xl font-bold text-foreground">
                      {stats.monthlyPromoRevenueEstimate.toFixed(2)} RON
                    </div>
                  </div>
                </div>
              </div>
            )}
            {stats.monthlyPromoRevenueEstimate === null && (
              <div className="pt-4 border-t border-border">
                <div className="text-xs text-muted-foreground">
                  * Venitul lunar estimat nu este încă disponibil din backend.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

