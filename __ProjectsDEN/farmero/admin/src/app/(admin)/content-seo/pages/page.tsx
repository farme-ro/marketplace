'use client'

/**
 * Content & SEO Pages Page
 * 
 * Listă pagini cu status SEO și meta informații
 */

import { useState, useEffect } from 'react'
import { Search, Filter, ExternalLink, CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { Drawer } from '@/components/ui/Drawer'
import { AccessDenied } from '@/components/auth/AccessDenied'
import { useAdminAuth } from '@/lib/auth/admin-auth-context'
import { hasPermission, hasAnyPermission } from '@/lib/permissions'
import {
  getSeoPages,
  SEO_ISSUE_EXPLANATIONS,
  type SeoPageMeta,
  type SeoStatus,
} from '@/lib/api/content-seo'

type StatusFilter = SeoStatus | 'all'

export default function ContentSeoPagesPage() {
  const { admin } = useAdminAuth()
  const [pages, setPages] = useState<SeoPageMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPage, setSelectedPage] = useState<SeoPageMeta | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const loadPages = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getSeoPages({
        search: searchQuery || undefined,
        status: statusFilter,
      })
      setPages(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea paginilor')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPages()
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

  const columns: Column<SeoPageMeta>[] = [
    {
      key: 'path',
      header: 'Path',
      render: (p) => (
        <span className="font-mono text-xs text-foreground">{p.path || '/'}</span>
      ),
    },
    {
      key: 'title',
      header: 'Title',
      render: (p) => (
        <span className="text-sm text-foreground">
          {p.title ? (p.title.length > 50 ? `${p.title.slice(0, 50)}...` : p.title) : '-'}
        </span>
      ),
    },
    {
      key: 'seoStatus',
      header: 'SEO Status',
      render: (p) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(p.seoStatus)}
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
              p.seoStatus
            )}`}
          >
            {getStatusLabel(p.seoStatus)}
          </span>
        </div>
      ),
    },
    {
      key: 'issues',
      header: 'Issues',
      render: (p) => (
        <div className="flex flex-wrap gap-1">
          {p.issues.slice(0, 2).map((issue) => (
            <span
              key={issue}
              className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
            >
              {issue}
            </span>
          ))}
          {p.issues.length > 2 && (
            <span className="text-xs text-muted-foreground">+{p.issues.length - 2}</span>
          )}
        </div>
      ),
    },
    {
      key: 'lastUpdatedAt',
      header: 'Ultima actualizare',
      render: (p) => (
        <span className="text-sm text-muted-foreground">
          {p.lastUpdatedAt
            ? new Date(p.lastUpdatedAt).toLocaleDateString('ro-RO')
            : 'Necunoscută'}
        </span>
      ),
    },
  ]

  const frontendBaseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://farme.ro'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Pagini & Meta</h1>
        <p className="text-muted-foreground">Status SEO pentru pagini statice și conținut</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      {pages.length === 0 && !loading && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <p className="text-sm text-yellow-800 dark:text-yellow-400">
            Backend-ul nu expune încă un inventar complet de pagini. Momentan vedem doar câteva
            pagini critice hardcodate.
          </p>
          <p className="mt-2 text-xs text-yellow-700 dark:text-yellow-500">
            Endpoint-ul <code>GET /admin/content-seo/pages</code> nu este implementat. Vezi{' '}
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
              placeholder="Caută după path sau title..."
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
        data={pages.map(p => ({ ...p, id: p.path }))}
        loading={loading}
        onRowClick={(page) => {
          setSelectedPage(page)
          setDrawerOpen(true)
        }}
        emptyMessage="Nu am găsit pagini după criteriile alese."
      />

      {/* Detail Drawer */}
      {selectedPage && (
        <Drawer
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false)
            setSelectedPage(null)
          }}
          title={`SEO Details: ${selectedPage.path}`}
        >
          <div className="space-y-6">
            {/* Path */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">Path</h3>
              <code className="block rounded-md bg-muted p-2 text-sm text-foreground">
                {selectedPage.path}
              </code>
            </div>

            {/* SEO Status */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">SEO Status</h3>
              <div className="flex items-center gap-2">
                {getStatusIcon(selectedPage.seoStatus)}
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                    selectedPage.seoStatus
                  )}`}
                >
                  {getStatusLabel(selectedPage.seoStatus)}
                </span>
              </div>
            </div>

            {/* Meta Information */}
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Meta Informații</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Title</dt>
                  <dd className="text-sm text-foreground">{selectedPage.title || '-'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Description</dt>
                  <dd className="text-sm text-foreground">
                    {selectedPage.description || '-'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">OG Image</dt>
                  <dd className="text-sm text-foreground">
                    {selectedPage.ogImage ? (
                      <a
                        href={selectedPage.ogImage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-farmero-olive-600 hover:underline dark:text-farmero-olive-400"
                      >
                        {selectedPage.ogImage}
                      </a>
                    ) : (
                      '-'
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Canonical URL</dt>
                  <dd className="text-sm text-foreground">
                    {selectedPage.canonicalUrl || '-'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Last Updated</dt>
                  <dd className="text-sm text-foreground">
                    {selectedPage.lastUpdatedAt
                      ? new Date(selectedPage.lastUpdatedAt).toLocaleString('ro-RO')
                      : 'Necunoscută'}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Issues */}
            {selectedPage.issues.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">Probleme identificate</h3>
                <ul className="space-y-2">
                  {selectedPage.issues.map((issue) => (
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
            <div className="flex gap-2 border-t border-border pt-4">
              <a
                href={`${frontendBaseUrl}${selectedPage.path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <ExternalLink className="h-4 w-4" />
                Deschide pagina în site
              </a>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  )
}

