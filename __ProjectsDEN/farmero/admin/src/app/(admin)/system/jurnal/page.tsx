'use client'

/**
 * Journal Admin Page
 * 
 * Management page for Jurnal de farme.ro articles
 */

import { useState, useEffect } from 'react'
import { Search, Filter, Eye, Calendar } from 'lucide-react'
import { DataTable, Pagination, type Column } from '@/components/ui/DataTable'
import { Drawer } from '@/components/ui/Drawer'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import {
  getJournalArticles,
  getJournalArticle,
  updateJournalArticle,
  publishJournalArticle,
} from '@/lib/api/system'
import { useAdminAuth } from '@/lib/auth/admin-auth-context'
import { hasPermission } from '@/lib/permissions'
import { logAdminAction } from '@/lib/utils/admin-audit'
import { AccessDenied } from '@/components/auth/AccessDenied'
import type { JournalArticle } from '@/lib/api/system'
import Link from 'next/link'

type ArticleStatus = 'draft' | 'review' | 'approved' | 'published' | 'archived' | 'all'

export default function JournalAdminPage() {
  const { admin } = useAdminAuth()
  const [articles, setArticles] = useState<JournalArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<JournalArticle | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    title: string
    message: string
    onConfirm: (reason?: string) => void
    requireReason?: boolean
    reasonLabel?: string
    reasonPlaceholder?: string
  }>({ 
    open: false, 
    title: '', 
    message: '', 
    onConfirm: () => {},
    requireReason: false,
  })

  // Filters
  const [statusFilter, setStatusFilter] = useState<ArticleStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const loadArticles = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getJournalArticles({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchQuery || undefined,
        page,
        limit: 20,
      })
      setArticles(response.data)
      setTotalPages(response.meta.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea articolelor')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadArticles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, page])

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      if (searchQuery || statusFilter !== 'all') {
        setPage(1)
        loadArticles()
      }
    }, 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  // RBAC checks - after all hooks
  const canView = hasPermission(admin, 'view_journal')
  const canManage = hasPermission(admin, 'manage_journal')
  
  // Show access denied if no view permission
  if (!canView) {
    return <AccessDenied requiredPermission="view_journal" />
  }

  const handleRowClick = async (article: JournalArticle) => {
    try {
      const detail = await getJournalArticle(article.id)
      setSelectedArticle(detail)
      setDrawerOpen(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea detaliilor')
    }
  }

  const handleStatusChange = async (
    newStatus: 'review' | 'approved' | 'published' | 'archived'
  ) => {
    if (!selectedArticle || !canManage) return

    const actionLabels = {
      review: 'Trimite în review',
      approved: 'Aprobă articol',
      published: 'Publică',
      archived: 'Arhivează',
    }
    
    const isReject = newStatus === 'archived' // Archive is like reject
    const actionMap: Record<string, string> = {
      review: 'JOURNAL_ARTICLE_SENT_TO_REVIEW',
      approved: 'JOURNAL_ARTICLE_APPROVED',
      published: 'JOURNAL_ARTICLE_PUBLISHED',
      archived: 'JOURNAL_ARTICLE_REJECTED',
    }

    setConfirmDialog({
      open: true,
      title: actionLabels[newStatus],
      message: `Ești sigur că vrei să ${actionLabels[newStatus].toLowerCase()} articolul "${selectedArticle.title}"?`,
      requireReason: isReject,
      reasonLabel: 'Motiv respingere',
      reasonPlaceholder: 'Introduceți motivul respingerii articolului...',
      onConfirm: async (reason?: string) => {
        try {
          if (newStatus === 'published') {
            // Try dedicated publish endpoint first
            try {
              await publishJournalArticle(selectedArticle.id)
            } catch (publishErr) {
              // Fallback to PATCH if publish endpoint doesn't exist
              await updateJournalArticle(selectedArticle.id, { status: 'published' })
            }
          } else {
            await updateJournalArticle(selectedArticle.id, { status: newStatus })
          }
          
          // Log audit action
          await logAdminAction({
            action: actionMap[newStatus],
            targetType: 'journal_article',
            targetId: selectedArticle.id,
            reason: reason || undefined,
            metadata: {
              articleTitle: selectedArticle.title,
              previousStatus: selectedArticle.status,
              newStatus,
            },
          }, admin)
          
          await loadArticles()
          if (selectedArticle) {
            const updated = await getJournalArticle(selectedArticle.id)
            setSelectedArticle(updated)
          }
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : 'Eroare la actualizare'
          setError(errorMsg)
          if (errorMsg.includes('404') || errorMsg.includes('not found')) {
            setError(
              'Endpoint backend încă nu este disponibil (vezi docs/ADMIN_BACKEND_GAPS.md)'
            )
          }
        }
      },
    })
  }

  const columns: Column<JournalArticle>[] = [
    {
      key: 'title',
      header: 'Titlu',
      render: (a) => (
        <div>
          <div className="font-medium">{a.title}</div>
          <div className="text-xs text-muted-foreground">{a.producerName}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (a) => {
        const statusLabels = {
          draft: 'Draft',
          review: 'În review',
          approved: 'Aprobat',
          published: 'Publicat',
          archived: 'Arhivat',
        }
        const statusColors = {
          draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
          review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
          approved: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
          published: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
          archived: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
        }
        return (
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusColors[a.status]}`}
          >
            {statusLabels[a.status]}
          </span>
        )
      },
    },
    {
      key: 'updatedAt',
      header: 'Ultima actualizare',
      render: (a) => new Date(a.updatedAt).toLocaleDateString('ro-RO'),
    },
    {
      key: 'metrics',
      header: 'Vizualizări',
      render: (a) => (a.metrics ? a.metrics.views : '-'),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Jurnal de farme.ro</h1>
        <p className="text-muted-foreground">
          Aici administrezi articolele din Jurnal de farme.ro și fluxul lor editorial.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-4">
          {/* Search */}
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

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as ArticleStatus)
                setPage(1)
              }}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">Toate statusurile</option>
              <option value="draft">Draft</option>
              <option value="review">În review</option>
              <option value="approved">Aprobate</option>
              <option value="published">Publicate</option>
              <option value="archived">Arhivate</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={articles}
        onRowClick={handleRowClick}
        loading={loading}
        emptyMessage="Nu am găsit niciun articol după criteriile alese."
      />

      {/* Pagination */}
      {!loading && articles.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Detail Drawer */}
      {selectedArticle && (
        <Drawer
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false)
            setSelectedArticle(null)
          }}
          title={selectedArticle.title}
        >
          <div className="space-y-6">
            {/* Article Info */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                Informații articol
              </h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Producător</dt>
                  <dd className="text-sm text-foreground">
                    <Link
                      href={`/producers?search=${selectedArticle.producerName}`}
                      className="text-farmero-olive-600 hover:underline dark:text-farmero-olive-400"
                    >
                      {selectedArticle.producerName}
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Status</dt>
                  <dd className="text-sm text-foreground">{selectedArticle.status}</dd>
                </div>
                {selectedArticle.publishedAt && (
                  <div>
                    <dt className="text-xs font-medium text-muted-foreground">
                      Data publicării
                    </dt>
                    <dd className="text-sm text-foreground">
                      {new Date(selectedArticle.publishedAt).toLocaleDateString('ro-RO')}
                    </dd>
                  </div>
                )}
                {selectedArticle.excerpt && (
                  <div>
                    <dt className="text-xs font-medium text-muted-foreground">Rezumat</dt>
                    <dd className="text-sm text-foreground">{selectedArticle.excerpt}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Metrics */}
            {selectedArticle.metrics && (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">Metrici</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-border bg-muted/50 p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      Vizualizări
                    </div>
                    <div className="mt-1 text-lg font-semibold">
                      {selectedArticle.metrics.views}
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/50 p-3">
                    <div className="text-xs text-muted-foreground">Vizualizări unice</div>
                    <div className="mt-1 text-lg font-semibold">
                      {selectedArticle.metrics.uniqueViews}
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/50 p-3">
                    <div className="text-xs text-muted-foreground">Click-uri producător</div>
                    <div className="mt-1 text-lg font-semibold">
                      {selectedArticle.metrics.clicksToProducer}
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/50 p-3">
                    <div className="text-xs text-muted-foreground">Click-uri produse</div>
                    <div className="mt-1 text-lg font-semibold">
                      {selectedArticle.metrics.clicksToProducts}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cover Image */}
            {selectedArticle.coverImageUrl && (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">Imagine copertă</h3>
                <img
                  src={selectedArticle.coverImageUrl}
                  alt={selectedArticle.title}
                  className="w-full rounded-lg border border-border"
                />
              </div>
            )}

            {/* Admin Actions */}
            {canManage && (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">Acțiuni</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedArticle.status === 'draft' && (
                    <button
                      onClick={() => handleStatusChange('review')}
                      className="rounded-md bg-yellow-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-yellow-700"
                    >
                      Trimite în review
                    </button>
                  )}
                  {selectedArticle.status === 'review' && (
                    <button
                      onClick={() => handleStatusChange('approved')}
                      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                    >
                      Aprobă articol
                    </button>
                  )}
                  {selectedArticle.status === 'approved' && (
                    <button
                      onClick={() => handleStatusChange('published')}
                      className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                    >
                      Publică
                    </button>
                  )}
                  {selectedArticle.status !== 'archived' && (
                    <button
                      onClick={() => handleStatusChange('archived')}
                      className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                    >
                      Arhivează
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </Drawer>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Confirmă"
        cancelText="Anulează"
        requireReason={confirmDialog.requireReason}
        reasonLabel={confirmDialog.reasonLabel}
        reasonPlaceholder={confirmDialog.reasonPlaceholder}
      />
    </div>
  )
}

