'use client'

/**
 * Content & SEO Journal Page
 * 
 * Status SEO pentru articole din Jurnal + performance metrics
 */

import { useState, useEffect } from 'react'
import { Search, Filter, ExternalLink, CheckCircle, AlertTriangle, XCircle, Clock, Eye, MousePointerClick } from 'lucide-react'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { Drawer } from '@/components/ui/Drawer'
import { AccessDenied } from '@/components/auth/AccessDenied'
import { useAdminAuth } from '@/lib/auth/admin-auth-context'
import { hasPermission, hasAnyPermission } from '@/lib/permissions'
import {
  getSeoArticles,
  SEO_ISSUE_EXPLANATIONS,
  type SeoArticleMeta,
  type SeoStatus,
} from '@/lib/api/content-seo'
import Link from 'next/link'

type StatusFilter = SeoStatus | 'all'

export default function ContentSeoJournalPage() {
  const { admin } = useAdminAuth()
  const [articles, setArticles] = useState<SeoArticleMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<SeoArticleMeta | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const loadArticles = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getSeoArticles({
        search: searchQuery || undefined,
        status: statusFilter,
      })
      setArticles(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea articolelor')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadArticles()
  }, [statusFilter, searchQuery])
  
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

  const getStatusIcon = (status: SeoStatus) => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'missing':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'stale':
        return <Clock className="h-4 w-4 text-gray-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status: SeoStatus) => {
    switch (status) {
      case 'ok':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'missing':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'stale':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusLabel = (status: SeoStatus) => {
    switch (status) {
      case 'ok':
        return 'OK'
      case 'warning':
        return 'Poate fi îmbunătățit'
      case 'missing':
        return 'Lipsesc elemente critice'
      case 'stale':
        return 'Nefăcut update de mult timp'
      default:
        return status
    }
  }

  const columns: Column<SeoArticleMeta>[] = [
    {
      key: 'title',
      header: 'Titlu articol',
      render: (a) => (
        <span className="font-medium text-foreground">
          {a.title.length > 50 ? `${a.title.slice(0, 50)}...` : a.title}
        </span>
      ),
    },
    {
      key: 'producerName',
      header: 'Producător',
      render: (a) => (
        <span className="text-sm text-foreground">{a.producerName || '-'}</span>
      ),
    },
    {
      key: 'seoStatus',
      header: 'SEO Status',
      render: (a) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(a.seoStatus)}
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
              a.seoStatus
            )}`}
          >
            {getStatusLabel(a.seoStatus)}
          </span>
        </div>
      ),
    },
    {
      key: 'views30d',
      header: 'Views (30 zile)',
      render: (a) => (
        <div className="flex items-center gap-1 text-sm text-foreground">
          <Eye className="h-3 w-3" />
          {a.views30d != null ? a.views30d.toLocaleString() : '-'}
        </div>
      ),
    },
    {
      key: 'ctr30d',
      header: 'CTR (30 zile)',
      render: (a) => (
        <div className="flex items-center gap-1 text-sm text-foreground">
          <MousePointerClick className="h-3 w-3" />
          {a.ctr30d != null ? `${a.ctr30d.toFixed(2)}%` : '-'}
        </div>
      ),
    },
    {
      key: 'publishedAt',
      header: 'Publicat la',
      render: (a) => (
        <span className="text-sm text-muted-foreground">
          {a.publishedAt
            ? new Date(a.publishedAt).toLocaleDateString('ro-RO')
            : 'Nepublicat'}
        </span>
      ),
    },
  ]

  const frontendBaseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://farme.ro'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Jurnal & Articole</h1>
        <p className="text-muted-foreground">Status SEO pentru articole din Jurnal + performance metrics</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      {articles.length === 0 && !loading && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <p className="text-sm text-yellow-800 dark:text-yellow-400">
            SEO insights pentru Jurnal nu sunt încă expuse complet prin backend. Vezi pagina{' '}
            <Link href="/jurnal" className="underline">
              /jurnal
            </Link>{' '}
            și{' '}
            <Link href="/jurnal/metrics" className="underline">
              /jurnal/metrics
            </Link>{' '}
            pentru detalii.
          </p>
          <p className="mt-2 text-xs text-yellow-700 dark:text-yellow-500">
            Endpoint-ul <code>GET /admin/content-seo/journal</code> nu este implementat. Vezi{' '}
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
              placeholder="Caută după titlu sau producător..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as StatusFilter)
              }}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">Toate statusurile</option>
              <option value="ok">OK</option>
              <option value="warning">Warning</option>
              <option value="missing">Missing</option>
              <option value="stale">Stale</option>
            </select>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={articles}
        loading={loading}
        onRowClick={(article) => {
          setSelectedArticle(article)
          setDrawerOpen(true)
        }}
        emptyMessage="Nu am găsit articole după criteriile alese."
      />

      {/* Detail Drawer */}
      {selectedArticle && (
        <Drawer
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false)
            setSelectedArticle(null)
          }}
          title={`SEO Details: ${selectedArticle.title}`}
        >
          <div className="space-y-6">
            {/* Article Info */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">Articol</h3>
              <div className="space-y-2">
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Titlu</dt>
                  <dd className="text-sm text-foreground">{selectedArticle.title}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Slug</dt>
                  <dd className="text-sm font-mono text-foreground">{selectedArticle.slug}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Producător</dt>
                  <dd className="text-sm text-foreground">{selectedArticle.producerName || '-'}</dd>
                </div>
              </div>
            </div>

            {/* SEO Status */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">SEO Status</h3>
              <div className="flex items-center gap-2">
                {getStatusIcon(selectedArticle.seoStatus)}
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                    selectedArticle.seoStatus
                  )}`}
                >
                  {getStatusLabel(selectedArticle.seoStatus)}
                </span>
              </div>
            </div>

            {/* Metrics */}
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Metrici (30 zile)</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Views</dt>
                  <dd className="text-sm text-foreground">
                    {selectedArticle.views30d != null
                      ? selectedArticle.views30d.toLocaleString()
                      : '-'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Clicks</dt>
                  <dd className="text-sm text-foreground">
                    {selectedArticle.clicks30d != null
                      ? selectedArticle.clicks30d.toLocaleString()
                      : '-'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">CTR</dt>
                  <dd className="text-sm text-foreground">
                    {selectedArticle.ctr30d != null
                      ? `${selectedArticle.ctr30d.toFixed(2)}%`
                      : '-'}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Dates */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">Date</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Publicat la</dt>
                  <dd className="text-sm text-foreground">
                    {selectedArticle.publishedAt
                      ? new Date(selectedArticle.publishedAt).toLocaleString('ro-RO')
                      : 'Nepublicat'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Ultima actualizare</dt>
                  <dd className="text-sm text-foreground">
                    {selectedArticle.lastUpdatedAt
                      ? new Date(selectedArticle.lastUpdatedAt).toLocaleString('ro-RO')
                      : 'Necunoscută'}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Issues */}
            {selectedArticle.issues.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">Probleme identificate</h3>
                <ul className="space-y-2">
                  {selectedArticle.issues.map((issue) => (
                    <li key={issue} className="flex items-start gap-2">
                      <AlertTriangle className="mt-0.5 h-4 w-4 text-yellow-500" />
                      <div>
                        <div className="text-sm font-medium text-foreground">{issue}</div>
                        <div className="text-xs text-muted-foreground">
                          {SEO_ISSUE_EXPLANATIONS[issue] || 'Problema nu are explicație definită.'}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2 border-t border-border pt-4">
              <a
                href={`${frontendBaseUrl}/jurnal-de-farmero/${selectedArticle.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <ExternalLink className="h-4 w-4" />
                Vezi articol în site
              </a>
              {selectedArticle.producerName && (
                <Link
                  href={`/producers?search=${selectedArticle.producerName}`}
                  className="flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  Vezi producător în admin
                </Link>
              )}
              <Link
                href={`/jurnal?search=${selectedArticle.id}`}
                className="flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Vezi articol în modul Jurnal
              </Link>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  )
}

