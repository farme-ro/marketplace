'use client'

/**
 * Content & SEO Overview Page
 * 
 * Dashboard pentru status SEO și content governance
 */

import { useState, useEffect } from 'react'
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react'
import { AccessDenied } from '@/components/auth/AccessDenied'
import { useAdminAuth } from '@/lib/auth/admin-auth-context'
import { hasPermission, hasAnyPermission } from '@/lib/permissions'
import { getContentSeoOverview, type ContentSeoOverview } from '@/lib/api/content-seo'

export default function ContentSeoOverviewPage() {
  const { admin } = useAdminAuth()
  const [overview, setOverview] = useState<ContentSeoOverview | null>(null)
  const [readOnly, setReadOnly] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getContentSeoOverview()
      setOverview(response.overview)
      setReadOnly(response.readOnly)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea datelor')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // RBAC checks
  const canView =
    hasPermission(admin, 'view_seo') ||
    hasAnyPermission(admin, [
      'view_journal',
      'manage_journal',
      'view_system_status',
      'view_financials',
      'view_seo',
    ])

  if (!canView) {
    return <AccessDenied requiredPermission="view_seo" />
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Content & SEO Overview</h1>
          <p className="text-muted-foreground">
            Monitorizare status SEO și content governance pentru pagini și articole
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
        <div className="text-center text-muted-foreground">Încărcăm datele de SEO...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Content & SEO Overview</h1>
          <p className="text-muted-foreground">
            Monitorizare status SEO și content governance pentru pagini și articole
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
          <h1 className="text-3xl font-bold text-foreground">Content & SEO Overview</h1>
          <p className="text-muted-foreground">
            Monitorizare status SEO și content governance pentru pagini și articole
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

  const pagesOkPercentage =
    overview.totalPages > 0
      ? ((overview.pagesOk / overview.totalPages) * 100).toFixed(1)
      : '0.0'
  const articlesOkPercentage =
    overview.totalArticles > 0
      ? ((overview.articlesOk / overview.totalArticles) * 100).toFixed(1)
      : '0.0'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Content & SEO Overview</h1>
        <p className="text-muted-foreground">
          Monitorizare status SEO și content governance pentru pagini și articole
        </p>
      </div>

      {readOnly && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <div className="flex items-center gap-2">
            <span className="inline-flex rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
              Read-only / backend incomplet
            </span>
          </div>
          <p className="mt-2 text-sm text-yellow-800 dark:text-yellow-400">
            Datele afișate sunt fallback static. Endpoint-ul <code>GET /admin/content-seo/overview</code>{' '}
            nu este încă implementat.
          </p>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Pagini cu SEO OK</h3>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {overview.pagesOk} / {overview.totalPages}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{pagesOkPercentage}% din total</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Pagini cu probleme</h3>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">{overview.pagesWithIssues}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {overview.stalePages > 0 && `${overview.stalePages} expirate`}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Articole jurnal OK</h3>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {overview.articlesOk} / {overview.totalArticles}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{articlesOkPercentage}% din total</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Articole cu probleme</h3>
            <XCircle className="h-4 w-4 text-red-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {overview.articlesWithIssues}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {overview.avgJournalCtr30d !== null && overview.avgJournalCtr30d !== undefined && (
              <>CTR mediu: {overview.avgJournalCtr30d.toFixed(2)}%</>
            )}
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Rezumat</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-medium text-foreground">Pagini</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>Total: {overview.totalPages}</li>
              <li className="text-green-600 dark:text-green-400">
                OK: {overview.pagesOk} ({pagesOkPercentage}%)
              </li>
              <li className="text-yellow-600 dark:text-yellow-400">
                Cu probleme: {overview.pagesWithIssues}
              </li>
              {overview.stalePages > 0 && (
                <li className="text-gray-600 dark:text-gray-400">
                  Expirate: {overview.stalePages}
                </li>
              )}
            </ul>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-foreground">Articole Jurnal</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>Total: {overview.totalArticles}</li>
              <li className="text-green-600 dark:text-green-400">
                OK: {overview.articlesOk} ({articlesOkPercentage}%)
              </li>
              <li className="text-yellow-600 dark:text-yellow-400">
                Cu probleme: {overview.articlesWithIssues}
              </li>
              {overview.avgJournalCtr30d !== null && overview.avgJournalCtr30d !== undefined && (
                <li>CTR mediu (30 zile): {overview.avgJournalCtr30d.toFixed(2)}%</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

