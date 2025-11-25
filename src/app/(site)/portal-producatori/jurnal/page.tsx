/**
 * Producer Journal Page
 * 
 * Page for producers to view and manage their journal articles
 * Only visible for producers with paid promotion plans
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, Button, Skeleton, Badge } from 'farme-ui'
import { ProducerDashboardLayout } from '@/components/producer-portal/producer-dashboard-layout'
import {
  getProducerSubscriptionStatus,
  getProducerSubscriptionTiers,
} from '@/lib/api/farmero-subscriptions-producer'
import { getProducerJournalArticles, requestJournalArticle } from '@/lib/api/journal'
import type {
  FarmeroProducerSubscriptionStatus,
  FarmeroProducerTier,
} from '@/lib/types/subscriptions'
import type { DomainJournalArticle } from '@/lib/types/domain'
import { formatDate } from '@/lib/utils/format'
import { useI18n } from '@/lib/i18n/context'
import { routes } from '@/lib/routes'
import { BookOpen, Calendar, ExternalLink, ArrowRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export default function ProducerJournalPage() {
  const { t, locale } = useI18n()
  const [subscriptionStatus, setSubscriptionStatus] = useState<FarmeroProducerSubscriptionStatus | null>(null)
  const [tiers, setTiers] = useState<FarmeroProducerTier[]>([])
  const [articles, setArticles] = useState<DomainJournalArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        const [status, tiersData] = await Promise.all([
          getProducerSubscriptionStatus().catch(() => null),
          getProducerSubscriptionTiers().catch(() => []),
        ])
        setSubscriptionStatus(status)
        setTiers(tiersData)

        // Load articles if producer has a paid plan
        if (status?.tierId && status.tierId !== 'free') {
          try {
            const articlesData = await getProducerJournalArticles()
            setArticles(articlesData)
          } catch (err: any) {
            // If 403, producer doesn't have access
            if (err.status === 403) {
              setArticles([])
            } else {
              // Journal API might not be ready yet
              setArticles([])
            }
          }
        }
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('Error loading journal data:', err)
        }
        setSubscriptionStatus(null)
        setTiers([])
        setArticles([])
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Check if producer has a paid plan (not free tier)
  const hasPaidPlan = subscriptionStatus?.tierId && subscriptionStatus.tierId !== 'free'
  const currentTier = tiers.find((t) => t.id === subscriptionStatus?.tierId)

  return (
    <ProducerDashboardLayout>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-full bg-farmero-terracotta/10 p-3">
            <BookOpen className="h-6 w-6 text-farmero-terracotta" />
          </div>
          <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground md:text-4xl">
            {t('producer.journal.title', 'Jurnal de farme.ro')}
          </h1>
        </div>
        <p className="text-base text-muted-foreground max-w-3xl leading-relaxed md:text-lg">
          {t(
            'producer.journal.description',
            'Poveștile tale despre produse, proces și oameni. Articole lunare pentru producătorii cu planuri de promovare.'
          )}
        </p>
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-6">
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      )}

      {/* No Paid Plan State */}
      {!isLoading && !hasPaidPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-2 border-farmero-terracotta/20 bg-gradient-to-br from-farmero-terracotta/5 to-farmero-olive/5">
            <CardContent className="p-8 text-center">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-farmero-terracotta/10 p-6">
                  <Sparkles className="h-12 w-12 text-farmero-terracotta" />
                </div>
              </div>
              <h2 className="mb-4 font-heading text-2xl font-semibold text-foreground">
                {t('producer.journal.noPlan.title', 'Jurnal de farme.ro este disponibil pentru planurile de promovare')}
              </h2>
              <p className="mb-8 mx-auto max-w-2xl text-muted-foreground">
                {t(
                  'producer.journal.noPlan.description',
                  'Jurnal de farme.ro este disponibil pentru planurile de promovare Farmero. Upgradează planul pentru a începe să spui povestea ta.'
                )}
              </p>
              <Link href={routes.producerPortal.subscriptions}>
                <Button size="lg" className="bg-farmero-terracotta hover:bg-farmero-terracotta/90">
                  {t('producer.journal.noPlan.cta', 'Vezi planurile de promovare')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Has Paid Plan - Articles List */}
      {!isLoading && hasPaidPlan && (
        <div className="space-y-6">
          {/* Current Plan Info */}
          {currentTier && (
            <Card className="border border-farmero-terracotta/20 bg-farmero-terracotta/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('producer.journal.currentPlan', 'Plan curent')}
                    </p>
                    <p className="mt-1 font-heading text-xl font-semibold text-foreground">
                      {currentTier.name}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t(
                        'producer.journal.planIncludes',
                        'Include articol lunar în Jurnal de farme.ro'
                      )}
                    </p>
                  </div>
                  <Link href={routes.producerPortal.subscriptions}>
                    <Button variant="outline" size="sm">
                      {t('producer.journal.managePlan', 'Gestionează planul')}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Articles List */}
          {articles.length > 0 ? (
            <div className="space-y-4">
              <h2 className="font-heading text-xl font-semibold text-foreground">
                {t('producer.journal.articles.title', 'Articolele tale')}
              </h2>
              {articles.map((article) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-3">
                            <h3 className="font-heading text-lg font-semibold text-foreground">
                              {article.title}
                            </h3>
                            <Badge
                              variant={
                                article.status === 'published'
                                  ? 'success'
                                  : article.status === 'approved'
                                  ? 'success'
                                  : article.status === 'review'
                                  ? 'warning'
                                  : 'default'
                              }
                            >
                              {article.status === 'published'
                                ? t('producer.journal.status.published', 'Publicat')
                                : article.status === 'approved'
                                ? t('producer.journal.status.approved', 'Aprobat')
                                : article.status === 'review'
                                ? t('producer.journal.status.review', 'În revizie')
                                : t('producer.journal.status.draft', 'Ciornă')}
                            </Badge>
                          </div>
                          <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
                            {article.excerpt}
                          </p>
                          {article.publishedAt && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5" />
                              <time dateTime={article.publishedAt}>
                                {t('producer.journal.publishedOn', 'Publicat pe')}{' '}
                                {formatDate(article.publishedAt, locale)}
                              </time>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {article.status === 'published' && (
                            <Link href={routes.journal.detail(article.slug)} target="_blank">
                              <Button variant="outline" size="sm">
                                {t('producer.journal.viewArticle', 'Vezi articol')}
                                <ExternalLink className="ml-2 h-4 w-4" />
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-muted p-4">
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="mb-2 font-heading text-lg font-semibold text-foreground">
                  {t('producer.journal.noArticles.title', 'Nu ai articole încă')}
                </h3>
                <p className="mb-6 text-sm text-muted-foreground">
                  {t(
                    'producer.journal.noArticles.description',
                    'Vom reveni curând cu un flux complet de gestionare articole. Momentan, articolele sunt create de echipa Farmero.'
                  )}
                </p>
                <Button
                  variant="outline"
                  onClick={async () => {
                    // For now, redirect to support. In future, can open a modal with request form
                    window.location.href = routes.producerPortal.support
                    // TODO: Implement requestJournalArticle() call when backend is ready
                  }}
                >
                  {t('producer.journal.requestArticle', 'Solicită articol nou')}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </ProducerDashboardLayout>
  )
}

