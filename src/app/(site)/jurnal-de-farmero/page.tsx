/**
 * Journal List Page
 * 
 * Public page displaying all published journal articles
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Skeleton } from 'farme-ui'
import { JournalHero } from '@/components/journal/journal-hero'
import { JournalCard } from '@/components/journal/journal-card'
import { JournalLayout } from '@/components/journal/journal-layout'
import { getJournalArticles } from '@/lib/api/journal'
import type { DomainJournalArticle } from '@/lib/types/domain'
import { useI18n } from '@/lib/i18n/context'
import { Leaf } from 'lucide-react'

export default function JournalListPage() {
  const { t } = useI18n()
  const [articles, setArticles] = useState<DomainJournalArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadArticles() {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getJournalArticles({ limit: 50 })
        setArticles(data)
      } catch (err: any) {
        setError(err.message || t('journal.error.loading', 'Eroare la încărcarea articolelor'))
      } finally {
        setIsLoading(false)
      }
    }

    loadArticles()
  }, [t])

  return (
    <>
      <JournalHero variant="landing" />

      <JournalLayout className="py-12 md:py-16">
        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && articles.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-16 text-center"
          >
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-farmero-olive/10 p-6">
                <Leaf className="h-12 w-12 text-farmero-olive" />
              </div>
            </div>
            <h2 className="mb-3 font-heading text-2xl font-semibold text-foreground">
              {t('journal.empty.title', 'Pregătim povești noi')}
            </h2>
            <p className="mx-auto max-w-md text-muted-foreground">
              {t(
                'journal.empty.description',
                'Pregătim povești noi în Jurnal de farme.ro 🌱'
              )}
            </p>
          </motion.div>
        )}

        {/* Articles Grid */}
        {!isLoading && !error && articles.length > 0 && (
          <div className="space-y-8">
            {/* Featured Article (First) - Large Card */}
            {articles.length > 0 && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="md:col-span-2 lg:col-span-2">
                  <JournalCard article={articles[0]} featured={true} />
                </div>
                {articles.length > 1 && (
                  <div className="hidden lg:block">
                    <JournalCard article={articles[1]} featured={false} />
                  </div>
                )}
              </div>
            )}

            {/* Rest of Articles - Grid */}
            {articles.length > 1 && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {articles.slice(1).map((article) => (
                  <JournalCard key={article.id} article={article} featured={false} />
                ))}
              </div>
            )}
          </div>
        )}
      </JournalLayout>
    </>
  )
}

