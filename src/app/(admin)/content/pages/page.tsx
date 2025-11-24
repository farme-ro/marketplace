'use client'

/**
 * Content Pages Management Page
 * 
 * Manage static pages (legal, info, help, donations) with multi-language support
 */

import { useState, useEffect } from 'react'
import { Search, Filter, FileText, Save, Eye, X } from 'lucide-react'
import { DataTable, Pagination, type Column } from '@/components/ui/DataTable'
import { Drawer } from '@/components/ui/Drawer'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { AccessDenied } from '@/components/auth/AccessDenied'
import { useAdminAuth } from '@/lib/auth/admin-auth-context'
import { hasPermission, hasAnyPermission } from '@/lib/permissions'
import { logAdminAction } from '@/lib/utils/admin-audit'
import {
  getAdminPages,
  getAdminPageById,
  updateAdminPage,
  type AdminPage,
  type AdminPageType,
  type AdminPageStatus,
  type AdminLocalizedContent,
} from '@/lib/api/content'

const LOCALES = [
  { code: 'ro', name: 'Română' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'it', name: 'Italiano' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' },
  { code: 'uk', name: 'Українська' },
  { code: 'hu', name: 'Magyar' },
]

type PageTypeFilter = AdminPageType | 'all'
type PageStatusFilter = AdminPageStatus | 'all'

export default function ContentPagesPage() {
  const { admin } = useAdminAuth()
  const [pages, setPages] = useState<AdminPage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPage, setSelectedPage] = useState<AdminPage | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingContent, setEditingContent] = useState<Record<string, AdminLocalizedContent>>({})
  const [activeLocale, setActiveLocale] = useState<string>('ro')
  const [hasChanges, setHasChanges] = useState(false)

  // Filters
  const [typeFilter, setTypeFilter] = useState<PageTypeFilter>('all')
  const [statusFilter, setStatusFilter] = useState<PageStatusFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const loadPages = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getAdminPages({
        type: typeFilter !== 'all' ? typeFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchQuery || undefined,
        page,
        limit: 20,
      })
      setPages(response.data)
      setTotalPages(response.pagination.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea paginilor')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPages()
  }, [typeFilter, statusFilter, page, searchQuery])

  // RBAC checks
  const canView = hasPermission(admin, 'view_content') || hasPermission(admin, 'manage_content')
  const canManage = hasPermission(admin, 'manage_content') || hasPermission(admin, 'manage_journal')

  if (!canView) {
    return <AccessDenied requiredPermission="view_content" />
  }

  const handlePageClick = async (pageItem: AdminPage) => {
    try {
      const fullPage = await getAdminPageById(pageItem.id)
      if (fullPage) {
        setSelectedPage(fullPage)
        // Initialize editing content
        const contentMap: Record<string, AdminLocalizedContent> = {}
        fullPage.contents.forEach((content) => {
          contentMap[content.locale] = { ...content }
        })
        setEditingContent(contentMap)
        setDrawerOpen(true)
        setHasChanges(false)
      } else {
        // Fallback: use the summary data
        setSelectedPage(pageItem)
        const contentMap: Record<string, AdminLocalizedContent> = {}
        pageItem.contents.forEach((content) => {
          contentMap[content.locale] = { ...content }
        })
        setEditingContent(contentMap)
        setDrawerOpen(true)
        setHasChanges(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea paginii')
    }
  }

  const handleContentChange = (locale: string, field: 'title' | 'body', value: string) => {
    setEditingContent((prev) => {
      const updated = { ...prev }
      if (!updated[locale]) {
        updated[locale] = { locale, title: '', body: '' }
      }
      updated[locale] = { ...updated[locale], [field]: value }
      setHasChanges(true)
      return updated
    })
  }

  const handleSaveDraft = async () => {
    if (!selectedPage || !canManage) return

    try {
      const contents = Object.values(editingContent)
      await updateAdminPage(selectedPage.id, {
        contents,
        status: 'draft',
      })
      await logAdminAction(
        {
          action: 'CONTENT_PAGE_UPDATED',
          targetType: 'content_page',
          targetId: selectedPage.id,
          metadata: { status: 'draft', slug: selectedPage.slug },
        },
        admin
      )
      setHasChanges(false)
      await loadPages()
      // Refresh selected page
      const updated = await getAdminPageById(selectedPage.id)
      if (updated) {
        setSelectedPage(updated)
        const contentMap: Record<string, AdminLocalizedContent> = {}
        updated.contents.forEach((content) => {
          contentMap[content.locale] = { ...content }
        })
        setEditingContent(contentMap)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la salvarea paginii')
    }
  }

  const handlePublish = async () => {
    if (!selectedPage || !canManage) return

    try {
      const contents = Object.values(editingContent)
      await updateAdminPage(selectedPage.id, {
        contents,
        status: 'published',
      })
      await logAdminAction(
        {
          action: 'CONTENT_PAGE_STATUS_CHANGED',
          targetType: 'content_page',
          targetId: selectedPage.id,
          metadata: {
            oldStatus: selectedPage.status,
            newStatus: 'published',
            slug: selectedPage.slug,
          },
        },
        admin
      )
      setHasChanges(false)
      await loadPages()
      // Refresh selected page
      const updated = await getAdminPageById(selectedPage.id)
      if (updated) {
        setSelectedPage(updated)
        const contentMap: Record<string, AdminLocalizedContent> = {}
        updated.contents.forEach((content) => {
          contentMap[content.locale] = { ...content }
        })
        setEditingContent(contentMap)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la publicarea paginii')
    }
  }

  const getTypeLabel = (type: AdminPageType) => {
    const labels: Record<AdminPageType, string> = {
      info: 'Informații',
      legal: 'Legal',
      help: 'Ajutor',
      donations: 'Donații',
    }
    return labels[type] || type
  }

  const getStatusColor = (status: AdminPageStatus) => {
    const colors: Record<AdminPageStatus, string> = {
      draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      published: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      archived: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    }
    return colors[status] || 'bg-muted text-muted-foreground'
  }

  const getStatusLabel = (status: AdminPageStatus) => {
    const labels: Record<AdminPageStatus, string> = {
      draft: 'Draft',
      published: 'Publicat',
      archived: 'Arhivat',
    }
    return labels[status] || status
  }

  const columns: Column<AdminPage>[] = [
    {
      key: 'slug',
      header: 'Slug',
      render: (p) => (
        <span className="font-mono text-xs text-foreground">{p.slug}</span>
      ),
    },
    {
      key: 'title',
      header: 'Titlu',
      render: (p) => {
        const roContent = p.contents.find((c) => c.locale === 'ro')
        return <span className="text-foreground">{roContent?.title || '-'}</span>
      },
    },
    {
      key: 'type',
      header: 'Tip',
      render: (p) => (
        <span className="text-sm text-foreground">{getTypeLabel(p.type)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (p) => (
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
            p.status
          )}`}
        >
          {getStatusLabel(p.status)}
        </span>
      ),
    },
    {
      key: 'updatedAt',
      header: 'Ultima actualizare',
      render: (p) => (
        <span className="text-sm text-muted-foreground">
          {new Date(p.updatedAt).toLocaleDateString('ro-RO')}
        </span>
      ),
    },
  ]

  const currentContent = editingContent[activeLocale] || {
    locale: activeLocale,
    title: '',
    body: '',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Pagini & Legal</h1>
        <p className="text-muted-foreground">Gestionare pagini statice și conținut legal</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      {pages.length === 0 && !loading && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <p className="text-sm text-yellow-800 dark:text-yellow-400">
            Nu există pagini disponibile. Endpoint-ul backend pentru pagini nu este încă
            implementat.
          </p>
          <p className="mt-2 text-xs text-yellow-700 dark:text-yellow-500">
            Vezi <code>docs/ADMIN_BACKEND_GAPS.md</code> pentru detalii.
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
              placeholder="Caută după slug sau titlu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value as PageTypeFilter)
                setPage(1)
              }}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">Toate tipurile</option>
              <option value="info">Informații</option>
              <option value="legal">Legal</option>
              <option value="help">Ajutor</option>
              <option value="donations">Donații</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as PageStatusFilter)
                setPage(1)
              }}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">Toate statusurile</option>
              <option value="draft">Draft</option>
              <option value="published">Publicat</option>
              <option value="archived">Arhivat</option>
            </select>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={pages}
        loading={loading}
        onRowClick={handlePageClick}
        emptyMessage="Nu am găsit pagini după criteriile alese."
      />

      {!loading && pages.length > 0 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}

      {/* Detail Drawer */}
      {selectedPage && (
        <Drawer
          open={drawerOpen}
          onClose={() => {
            if (hasChanges) {
              if (
                confirm(
                  'Ai modificări nesalvate. Ești sigur că vrei să închizi fără să salvezi?'
                )
              ) {
                setDrawerOpen(false)
                setSelectedPage(null)
                setEditingContent({})
                setHasChanges(false)
              }
            } else {
              setDrawerOpen(false)
              setSelectedPage(null)
              setEditingContent({})
            }
          }}
          title={`Pagina: ${selectedPage.slug}`}
        >
          <div className="space-y-6">
            {/* Meta Info */}
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Meta informații</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Slug</dt>
                  <dd className="text-sm font-mono text-foreground">{selectedPage.slug}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Tip</dt>
                  <dd className="text-sm text-foreground">{getTypeLabel(selectedPage.type)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Status</dt>
                  <dd className="text-sm text-foreground">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                        selectedPage.status
                      )}`}
                    >
                      {getStatusLabel(selectedPage.status)}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">
                    Ultima actualizare
                  </dt>
                  <dd className="text-sm text-foreground">
                    {new Date(selectedPage.updatedAt).toLocaleString('ro-RO')}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Language Tabs */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-foreground">Conținut multi-limbă</h3>
              <div className="mb-4 flex flex-wrap gap-2 border-b border-border">
                {LOCALES.map((locale) => {
                  const hasContent = editingContent[locale.code]
                  const isActive = activeLocale === locale.code
                  return (
                    <button
                      key={locale.code}
                      onClick={() => setActiveLocale(locale.code)}
                      className={`rounded-t-md px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? 'border-b-2 border-farmero-olive-600 bg-farmero-olive-50 text-farmero-olive-900 dark:bg-farmero-olive-900/20 dark:text-farmero-olive-200'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {locale.name}
                      {!hasContent && (
                        <span className="ml-1 text-xs text-yellow-600">⚠️</span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Content Editor */}
              <div className="space-y-4">
                {!currentContent.title && !currentContent.body && (
                  <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20">
                    <p className="text-xs text-yellow-800 dark:text-yellow-400">
                      Fără traducere — va cădea pe limba implicită (RO)
                    </p>
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Titlu ({LOCALES.find((l) => l.code === activeLocale)?.name})
                  </label>
                  <input
                    type="text"
                    value={currentContent.title}
                    onChange={(e) =>
                      handleContentChange(activeLocale, 'title', e.target.value)
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Titlul paginii"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Conținut ({LOCALES.find((l) => l.code === activeLocale)?.name})
                  </label>
                  <textarea
                    value={currentContent.body}
                    onChange={(e) =>
                      handleContentChange(activeLocale, 'body', e.target.value)
                    }
                    rows={12}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Conținutul paginii (HTML sau Markdown)"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            {canManage && (
              <div className="flex gap-2 border-t border-border pt-4">
                <button
                  onClick={handleSaveDraft}
                  disabled={!hasChanges}
                  className="flex items-center gap-2 rounded-md bg-yellow-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-yellow-700 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  Salvează draft
                </button>
                <button
                  onClick={handlePublish}
                  disabled={!hasChanges}
                  className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                >
                  <Eye className="h-4 w-4" />
                  Publică
                </button>
                <button
                  onClick={() => {
                    setDrawerOpen(false)
                    setSelectedPage(null)
                    setEditingContent({})
                    setHasChanges(false)
                  }}
                  className="flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                  Anulează
                </button>
              </div>
            )}
          </div>
        </Drawer>
      )}
    </div>
  )
}

