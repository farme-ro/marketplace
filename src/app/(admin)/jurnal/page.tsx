'use client'

/**
 * Journal Admin - Articles List Page
 * 
 * List all journal articles with filters and search
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Filter, Calendar, ExternalLink } from 'lucide-react'
import { DataTable, Pagination, type Column } from '@/components/ui/DataTable'
import { getJournalArticles } from '@/lib/api/journal'
import type { JournalArticle } from '@/lib/api/journal'

type ArticleStatus = 'draft' | 'review' | 'approved' | 'published' | 'archived' | 'all'

export default function JournalListPage() {
  const router = useRouter()
  const frontendBaseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://farme.ro'
  const [articles, setArticles] = useState<JournalArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [statusFilter, setStatusFilter] = useState<ArticleStatus>('all')
  const [producerSearch, setProducerSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    loadArticles()
  }, [statusFilter, producerSearch, page])

  const loadArticles = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getJournalArticles({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: producerSearch || undefined,
        page,
        limit: 20,
      })
      setArticles(response.data)
      setTotalPages(response.meta.totalPages)
      setTotal(response.meta.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea articolelor')
    } finally {
      setLoading(false)
    }
  }

  const handleRowClick = (article: JournalArticle) => {
    router.push(`/jurnal/${article.id}`)
  }

  const getStatusBadge = (status: JournalArticle['status']) => {
    const statusConfig = {
      draft: {
        label: 'Draft',
        className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      },
      review: {
        label: 'În review',
        className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      },
      approved: {
        label: 'Aprobat',
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      },
      published: {
        label: 'Publicat',
        className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      },
      archived: {
        label: 'Arhivat',
        className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      },
    }

    const config = statusConfig[status]
    return (
      <span
        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${config.className}`}
      >
        {config.label}
      </span>
    )
  }

  const columns: Column<JournalArticle>[] = [
    {
      key: 'title',
      header: 'Titlu',
      render: (a) => (
        <div>
          <div className="font-medium">{a.title}</div>
          <div className="text-xs text-muted-foreground">Slug: {a.slug}</div>
        </div>
      ),
    },
    {
      key: 'producerName',
      header: 'Producător',
      render: (a) => (
        <div>
          <div className="font-medium">{a.producerName}</div>
          {a.producerSlug && (
            <a
              href={`${frontendBaseUrl}/producatori/${a.producerSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-farmero-olive-600 hover:underline dark:text-farmero-olive-400"
            >
              Vezi producător <ExternalLink className="ml-1 inline h-3 w-3" />
            </a>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (a) => getStatusBadge(a.status),
    },
    {
      key: 'createdAt',
      header: 'Data creării',
      render: (a) => (
        <div className="text-sm">
          <div>{new Date(a.createdAt).toLocaleDateString('ro-RO')}</div>
          <div className="text-xs text-muted-foreground">
            {new Date(a.createdAt).toLocaleTimeString('ro-RO', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      ),
    },
    {
      key: 'updatedAt',
      header: 'Ultima actualizare',
      render: (a) => (
        <div className="text-sm">
          <div>{new Date(a.updatedAt).toLocaleDateString('ro-RO')}</div>
          <div className="text-xs text-muted-foreground">
            {new Date(a.updatedAt).toLocaleTimeString('ro-RO', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Jurnal de farme.ro</h1>
        <p className="text-muted-foreground">Moderare și workflow editorial</p>
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
          {/* Producer Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Caută după producător..."
              value={producerSearch}
              onChange={(e) => {
                setProducerSearch(e.target.value)
                setPage(1)
              }}
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

        {/* Total Count */}
        {!loading && (
          <div className="text-sm text-muted-foreground">
            {total} {total === 1 ? 'articol' : 'articole'}
          </div>
        )}
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
    </div>
  )
}

