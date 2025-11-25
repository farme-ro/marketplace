/**
 * Producer Journal Section
 * 
 * Displays journal articles for a producer
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookOpen, ArrowRight } from 'lucide-react'
import { getJournalArticles } from '@/lib/api/journal'
import type { DomainJournalArticle } from '@/lib/types/domain'
import { routes } from '@/lib/routes'
import { useI18n } from '@/lib/i18n/context'

interface ProducerJournalSectionProps {
  producerId: string
  producerSlug: string
}

export function ProducerJournalSection({ producerId, producerSlug }: ProducerJournalSectionProps) {
  const { t } = useI18n()
  const [articles, setArticles] = useState<DomainJournalArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadArticles() {
      try {
        setLoading(true)
        // Note: Backend needs to support producerId filter
        // For now, we'll fetch all and filter client-side
        const allArticles = await getJournalArticles({ limit: 50 })
        const producerArticles = allArticles.filter(
          (article) => article.producerId === producerId
        )
        setArticles(producerArticles.slice(0, 3)) // Show max 3 articles
      } catch (error) {
        // Fail silently - journal section is optional
        setArticles([])
      } finally {
        setLoading(false)
      }
    }

    if (producerId) {
      loadArticles()
    }
  }, [producerId])

  if (loading || articles.length === 0) {
    return null
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-heading text-lg font-semibold text-foreground">
          {t('producers.journal.title', 'În Jurnal de farme.ro')}
        </h3>
        <Link
          href={routes.journal.list}
          className="text-sm text-farmero-terracotta hover:underline"
        >
          {t('producers.journal.viewAll', 'Vezi toate')}
        </Link>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        {t(
          'producers.journal.description',
          'Povești despre acest producător din Jurnal de farme.ro'
        )}
      </p>
      <div className="space-y-3">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={routes.journal.detail(article.slug)}
            className="group flex items-start gap-3 rounded-lg border border-border bg-background p-3 transition-colors hover:border-farmero-terracotta hover:bg-muted/50"
          >
            <BookOpen className="mt-0.5 h-4 w-4 flex-shrink-0 text-farmero-terracotta" />
            <div className="flex-1">
              <h4 className="font-medium text-foreground group-hover:text-farmero-terracotta">
                {article.title}
              </h4>
              {article.excerpt && (
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {article.excerpt}
                </p>
              )}
            </div>
            <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground group-hover:text-farmero-terracotta" />
          </Link>
        ))}
      </div>
    </div>
  )
}

