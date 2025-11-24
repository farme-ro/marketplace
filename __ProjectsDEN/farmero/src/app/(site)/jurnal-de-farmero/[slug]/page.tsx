/**
 * Journal Article Detail Page
 * 
 * Public page displaying a single journal article
 */

'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button, Skeleton } from 'farme-ui'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, BookOpen, ArrowLeft, Store } from 'lucide-react'
import { JournalHero } from '@/components/journal/journal-hero'
import { JournalLayout } from '@/components/journal/journal-layout'
import { JournalSchema } from '@/components/journal/journal-schema'
import { getJournalArticleBySlug, trackJournalMetrics } from '@/lib/api/journal'
import type { DomainJournalArticle } from '@/lib/types/domain'
import { useI18n } from '@/lib/i18n/context'
import { routes } from '@/lib/routes'
import { formatDate } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'

export default function JournalArticlePage() {
  const params = useParams()
  const router = useRouter()
  const { t, locale } = useI18n()
  const slug = params?.slug as string

  const [article, setArticle] = useState<DomainJournalArticle | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    async function loadArticle() {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getJournalArticleBySlug(slug)
        setArticle(data)
        
        // Track view metric
        if (data.id) {
          trackJournalMetrics(data.id, 'view').catch(() => {
            // Fail silently
          })
        }
      } catch (err: any) {
        if (err.status === 404) {
          setError(t('journal.article.notFound', 'Articolul nu a fost găsit.'))
        } else if (err.status === 503) {
          setError(err.message || t('journal.article.comingSoon', 'Articolul este în pregătire.'))
        } else {
          setError(err.message || t('journal.article.error', 'Eroare la încărcarea articolului'))
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadArticle()
  }, [slug, t])

  if (isLoading) {
    return (
      <>
        <JournalHero variant="article" />
        <JournalLayout maxWidth="2xl" className="py-12">
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </JournalLayout>
      </>
    )
  }

  if (error || !article) {
    return (
      <>
        <JournalHero variant="article" />
        <JournalLayout maxWidth="2xl" className="py-12">
          <div className="text-center">
            <p className="mb-6 text-muted-foreground">{error}</p>
            <Button onClick={() => router.push(routes.journal.list)} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('journal.article.backToList', 'Înapoi la jurnal')}
            </Button>
          </div>
        </JournalLayout>
      </>
    )
  }

  return (
    <>
      {/* Schema.org JSON-LD */}
      <JournalSchema article={article} />

      {/* Hero with Cover Image */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        {article.coverImageUrl ? (
          <Image
            src={article.coverImageUrl}
            alt={article.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-farmero-olive/20 via-farmero-terracotta/10 to-farmero-olive/20" />
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
        
        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-end">
          <JournalLayout maxWidth="2xl" className="pb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Badge */}
              <div className="mb-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-farmero-terracotta/90 px-3 py-1 text-xs font-semibold text-white shadow-md backdrop-blur-sm">
                  <BookOpen className="h-3 w-3" />
                  {t('journal.badge', 'Jurnal de farme.ro')}
                </span>
              </div>

              {/* Producer Name */}
              <p className="mb-2 text-sm font-medium text-farmero-terracotta">
                {article.producerName}
              </p>

              {/* Title */}
              <h1 className="mb-4 font-heading text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                {article.title}
              </h1>

              {/* Meta */}
              {article.publishedAt && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={article.publishedAt}>
                    {formatDate(article.publishedAt, locale)}
                  </time>
                </div>
              )}
            </motion.div>
          </JournalLayout>
        </div>
      </section>

      {/* Article Content */}
      <JournalLayout maxWidth="2xl" className="py-12">
        <div className="space-y-8">
          {/* Back Button */}
          <div className="mb-4 flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push(routes.journal.list)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('journal.article.backToList', 'Înapoi la jurnal')}
            </Button>
            <Link
              href={routes.producers.detail(article.producerSlug)}
              className="text-sm text-farmero-terracotta hover:underline"
            >
              {t('journal.article.viewProducer', 'Vezi producătorul')} →
            </Link>
          </div>

          {/* Excerpt */}
          {article.excerpt && (
            <div className="rounded-lg border-l-4 border-farmero-terracotta bg-muted/50 p-6">
              <p className="text-lg font-medium italic text-foreground">{article.excerpt}</p>
            </div>
          )}

          {/* Content */}
          <article
            className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-heading prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-farmero-terracotta prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-blockquote:border-l-farmero-terracotta prose-blockquote:bg-muted/30 prose-blockquote:py-2 prose-blockquote:pl-4"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* About Producer Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-lg border border-border bg-card p-6 shadow-sm"
          >
            <h3 className="mb-4 font-heading text-xl font-semibold text-foreground">
              {t('journal.article.aboutProducer', 'Despre producător')}
            </h3>
            <p className="mb-4 text-muted-foreground">
              {t(
                'journal.article.aboutProducerDescription',
                'Acest articol face parte din Jurnal de farme.ro, o secțiune editorială premium dedicată producătorilor care au planuri de promovare. Aici descoperi oamenii, procesele și poveștile din spatele produselor.'
              )}
            </p>
            <div className="mb-4 flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-farmero-terracotta/10 px-3 py-1 text-xs font-medium text-farmero-terracotta">
                {t('journal.article.promotedProducer', 'Producător promovat')}
              </span>
            </div>
            <Link 
              href={routes.producers.detail(article.producerSlug)}
              onClick={() => {
                if (article.id) {
                  trackJournalMetrics(article.id, 'click_producer').catch(() => {
                    // Fail silently
                  })
                }
              }}
            >
              <Button variant="outline" className="w-full sm:w-auto">
                <Store className="mr-2 h-4 w-4" />
                {t('journal.article.viewProducer', 'Vezi pagina producătorului')}
              </Button>
            </Link>
          </motion.div>

          {/* Products from this Journal Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-lg border border-border bg-muted/30 p-6"
          >
            <h3 className="mb-4 font-heading text-xl font-semibold text-foreground">
              {t('journal.article.products.title', 'Produse din acest jurnal')}
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              {t(
                'journal.article.products.description',
                'Descoperă toate produsele disponibile pe pagina producătorului.'
              )}
            </p>
            <Link href={routes.producers.products(article.producerSlug)}>
              <Button variant="outline" className="w-full sm:w-auto">
                {t('journal.article.products.cta', 'Vezi toate produsele')}
                <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
              </Button>
            </Link>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-lg bg-gradient-to-r from-farmero-olive/10 to-farmero-terracotta/10 p-8 text-center"
          >
            <h3 className="mb-2 font-heading text-xl font-semibold text-foreground">
              {t('journal.article.cta.title', 'Descoperă produsele acestui producător')}
            </h3>
            <p className="mb-6 text-muted-foreground">
              {t(
                'journal.article.cta.description',
                'Vizitează magazinul producătorului pentru a vedea toate produsele disponibile.'
              )}
            </p>
            <Link 
              href={routes.producers.products(article.producerSlug)}
              onClick={() => {
                if (article.id) {
                  trackJournalMetrics(article.id, 'click_product').catch(() => {
                    // Fail silently
                  })
                }
              }}
            >
              <Button size="lg" className="bg-farmero-terracotta hover:bg-farmero-terracotta/90">
                <Store className="mr-2 h-5 w-5" />
                {t('journal.article.cta.button', 'Vezi produsele acestui producător')}
              </Button>
            </Link>
          </motion.div>
        </div>
      </JournalLayout>
    </>
  )
}

