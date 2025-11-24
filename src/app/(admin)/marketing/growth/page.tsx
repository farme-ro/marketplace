/**
 * Growth Engine Dashboard Page
 * 
 * Dashboard pentru Growth Engine: KPI, timeline, nudges
 */

'use client'

import { useState, useEffect } from 'react'
import { Activity, TrendingUp, Target, Zap, Clock, AlertCircle } from 'lucide-react'
import { AccessDenied } from '@/components/auth/AccessDenied'
import { useAdminAuth } from '@/lib/auth/admin-auth-context'
import { hasPermission, hasAnyPermission } from '@/lib/permissions'
import {
  getGrowthOverview,
  getUserTimeline,
  type GrowthOverview,
  type UserTimelineEntry,
} from '@/lib/api/growth'
import { useAdminI18n } from '@/lib/i18n/context'

export default function GrowthEnginePage() {
  const { admin } = useAdminAuth()
  const { t } = useAdminI18n()
  const [overview, setOverview] = useState<GrowthOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const [userTimeline, setUserTimeline] = useState<UserTimelineEntry[]>([])
  const [loadingTimeline, setLoadingTimeline] = useState(false)

  const loadOverview = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getGrowthOverview()
      setOverview(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea datelor')
    } finally {
      setLoading(false)
    }
  }

  const loadUserTimeline = async (userId: string) => {
    try {
      setLoadingTimeline(true)
      const timeline = await getUserTimeline(userId, 20, 0)
      setUserTimeline(timeline)
    } catch (err) {
      console.error('Failed to load user timeline:', err)
      setUserTimeline([])
    } finally {
      setLoadingTimeline(false)
    }
  }

  useEffect(() => {
    loadOverview()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (selectedUserId) {
      loadUserTimeline(selectedUserId)
    } else {
      setUserTimeline([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUserId])

  // RBAC checks - after hooks
  const canView =
    hasPermission(admin, 'view_marketing') ||
    hasAnyPermission(admin, ['view_marketing', 'view_journal', 'view_subscriptions'])

  if (!canView) {
    return <AccessDenied requiredPermission="view_marketing" />
  }

  const getEventTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      page_view: 'Vizualizare pagină',
      cart_abandoned: 'Coș abandonat',
      subscription_started: 'Abonament început',
      subscription_cancelled: 'Abonament anulat',
      journal_viewed: 'Jurnal vizualizat',
      journal_article_viewed: 'Articol vizualizat',
      producer_profile_viewed: 'Profil producător vizualizat',
      product_viewed: 'Produs vizualizat',
      order_placed: 'Comandă plasată',
      order_completed: 'Comandă finalizată',
      checkout_started: 'Checkout început',
      checkout_completed: 'Checkout finalizat',
    }
    return labels[type] || type
  }

  const getSourceLabel = (source: string): string => {
    const labels: Record<string, string> = {
      homepage: 'Homepage',
      checkout: 'Checkout',
      portal: 'Portal',
      journal: 'Jurnal',
      products: 'Produse',
      producers: 'Producători',
      profile: 'Profil',
    }
    return labels[source] || source
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Growth Engine</h1>
          <p className="text-muted-foreground">Dashboard pentru tracking, campanii și nudges</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-6">
              <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
              <div className="mt-4 h-8 w-16 animate-pulse rounded bg-muted"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Growth Engine</h1>
          <p className="text-muted-foreground">Dashboard pentru tracking, campanii și nudges</p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Growth Engine</h1>
        <p className="text-muted-foreground">Dashboard pentru tracking, campanii și nudges</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Evenimente (7 zile)</p>
              <p className="mt-2 text-3xl font-bold text-foreground">
                {overview?.eventsLast7Days.toLocaleString() || '0'}
              </p>
            </div>
            <Activity className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Campanii active</p>
              <p className="mt-2 text-3xl font-bold text-foreground">
                {overview?.activeCampaigns.toLocaleString() || '0'}
              </p>
            </div>
            <Target className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Rata activare abonamente</p>
              <p className="mt-2 text-3xl font-bold text-foreground">
                {overview?.subscriptionActivationRate !== null && overview?.subscriptionActivationRate !== undefined
                  ? `${overview.subscriptionActivationRate.toFixed(1)}%`
                  : 'N/A'}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nudges disponibile</p>
              <p className="mt-2 text-3xl font-bold text-foreground">
                {overview?.nudges.length.toLocaleString() || '0'}
              </p>
            </div>
            <Zap className="h-8 w-8 text-primary" />
          </div>
        </div>
      </div>

      {/* Timeline Sample */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Timeline Sample</h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="User ID (UUID)"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
            <button
              onClick={() => selectedUserId && loadUserTimeline(selectedUserId)}
              disabled={!selectedUserId || loadingTimeline}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {loadingTimeline ? 'Se încarcă...' : 'Încarcă'}
            </button>
          </div>
        </div>

        {userTimeline.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {selectedUserId
              ? 'Nu există evenimente pentru acest utilizator sau ID-ul este invalid.'
              : 'Introdu un User ID pentru a vedea timeline-ul.'}
          </div>
        ) : (
          <div className="space-y-2">
            {userTimeline.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between rounded-md border border-border bg-background p-3"
              >
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {getEventTypeLabel(event.type)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getSourceLabel(event.source)} •{' '}
                      {new Date(event.createdAt).toLocaleString('ro-RO')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Nudges / Rules */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold text-foreground">Nudges / Rules</h2>

        {overview?.nudges.length === 0 ? (
          <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <p className="text-sm text-yellow-800 dark:text-yellow-400">
                Nu există nudges configurate sau backend-ul nu expune endpoint-ul. Consultă
                ADMIN_BACKEND_GAPS.md pentru detalii.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {overview?.nudges?.map((nudge) => (
              <div
                key={nudge.code}
                className="flex items-center justify-between rounded-md border border-border bg-background p-3"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{nudge.code}</p>
                  <p className="text-xs text-muted-foreground">
                    {nudge.description || nudge.message || 'Fără descriere'}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Prioritate: {nudge.priority}
                  </p>
                </div>
                {nudge.actionUrl && (
                  <a
                    href={nudge.actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Vezi →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

