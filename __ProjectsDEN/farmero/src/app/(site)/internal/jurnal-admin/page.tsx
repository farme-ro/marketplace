/**
 * Internal Journal Admin Page
 * 
 * Admin/internal page for managing journal articles
 * Visible only in dev mode or for users with admin role
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, Button, Badge, Skeleton } from 'farme-ui'
import { RequireAuth } from '@/components/auth/require-auth'
import { useAuth } from '@/lib/auth/context'
import { useI18n } from '@/lib/i18n/context'
import { routes } from '@/lib/routes'
import { formatDate } from '@/lib/utils/format'
import { 
  BookOpen, 
  Search, 
  Filter, 
  Eye, 
  MousePointerClick,
  Calendar,
  User,
  ExternalLink
} from 'lucide-react'
import type { DomainJournalArticle } from '@/lib/types/domain'

// Mock data for development
const mockArticles: DomainJournalArticle[] = [
  {
    id: 'demo-1',
    slug: 'povestea-mierii-din-inima-maramuresului',
    title: 'Povestea mierii din inima Maramureșului',
    excerpt: 'În inima Maramureșului...',
    content: '<p>Content...</p>',
    coverImageUrl: null,
    producerId: 'demo-producer-1',
    producerName: 'Ferma Popescu',
    producerSlug: 'ferma-popescu',
    status: 'published',
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export default function InternalJournalAdminPage() {
  const { user } = useAuth()
  const { t, locale } = useI18n()
  const router = useRouter()
  const [articles, setArticles] = useState<DomainJournalArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Check access - only admin or dev mode
  const isAdmin = user?.role === 'ADMIN'
  const isDev = process.env.NODE_ENV === 'development'

  useEffect(() => {
    if (!isAdmin && !isDev) {
      router.push(routes.home)
      return
    }

    // Load articles (mock for now)
    async function loadArticles() {
      setIsLoading(true)
      // TODO: Replace with actual API call when backend is ready
      // const data = await getAdminJournalArticles()
      setArticles(mockArticles)
      setIsLoading(false)
    }

    loadArticles()
  }, [isAdmin, isDev, router])

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.producerName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'default'> = {
      published: 'success',
      approved: 'success',
      review: 'warning',
      draft: 'default',
    }
    return variants[status] || 'default'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      published: t('admin.journal.status.published', 'Publicat'),
      approved: t('admin.journal.status.approved', 'Aprobat'),
      review: t('admin.journal.status.review', 'În revizie'),
      draft: t('admin.journal.status.draft', 'Ciornă'),
    }
    return labels[status] || status
  }

  if (!isAdmin && !isDev) {
    return null
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-background py-12">
        <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-farmero-terracotta/10 p-3">
                <BookOpen className="h-6 w-6 text-farmero-terracotta" />
              </div>
              <h1 className="text-3xl font-heading font-bold text-foreground">
                {t('admin.journal.title', 'Gestionare Jurnal de farme.ro')}
              </h1>
            </div>
            <p className="text-muted-foreground">
              {t('admin.journal.description', 'Gestionează articolele editoriale pentru producătorii promovați')}
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder={t('admin.journal.search', 'Caută după titlu sau producător...')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-farmero-terracotta"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-farmero-terracotta"
                  >
                    <option value="all">{t('admin.journal.filter.all', 'Toate')}</option>
                    <option value="draft">{t('admin.journal.filter.draft', 'Ciornă')}</option>
                    <option value="review">{t('admin.journal.filter.review', 'În revizie')}</option>
                    <option value="approved">{t('admin.journal.filter.approved', 'Aprobat')}</option>
                    <option value="published">{t('admin.journal.filter.published', 'Publicat')}</option>
                  </select>
                </div>
                <Button
                  onClick={() => {
                    // TODO: Open create article modal/page
                    alert('Create article - TODO')
                  }}
                >
                  {t('admin.journal.create', 'Creează articol')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Articles List */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full rounded-lg" />
              ))}
            </div>
          ) : filteredArticles.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">
                  {t('admin.journal.noArticles', 'Nu există articole')}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredArticles.map((article) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-3">
                            <h3 className="font-heading text-lg font-semibold text-foreground">
                              {article.title}
                            </h3>
                            <Badge variant={getStatusBadge(article.status)}>
                              {getStatusLabel(article.status)}
                            </Badge>
                          </div>
                          <div className="mb-2 flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <User className="h-4 w-4" />
                              <span>{article.producerName}</span>
                            </div>
                            {article.publishedAt && (
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                <time dateTime={article.publishedAt}>
                                  {formatDate(article.publishedAt, locale)}
                                </time>
                              </div>
                            )}
                          </div>
                          <p className="line-clamp-2 text-sm text-muted-foreground">
                            {article.excerpt}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {article.status === 'published' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                window.open(routes.journal.detail(article.slug), '_blank')
                              }}
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              {t('admin.journal.view', 'Vezi')}
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // TODO: Open edit modal/page
                              alert(`Edit article ${article.id} - TODO`)
                            }}
                          >
                            {t('admin.journal.edit', 'Editează')}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </RequireAuth>
  )
}

