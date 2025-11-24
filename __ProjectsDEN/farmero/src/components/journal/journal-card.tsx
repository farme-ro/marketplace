/**
 * Journal Card Component
 * 
 * Card component for displaying a journal article in the list view
 */

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import { BookOpen, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { routes } from '@/lib/routes'
import { useI18n } from '@/lib/i18n/context'
import type { DomainJournalArticle } from '@/lib/types/domain'
import { formatDate } from '@/lib/utils/format'

export interface JournalCardProps {
  article: DomainJournalArticle
  featured?: boolean
  className?: string
}

export function JournalCard({ article, featured = false, className }: JournalCardProps) {
  const { t, locale } = useI18n()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('group', className)}
    >
      <Link href={routes.journal.detail(article.slug)}>
        <Card
          className={cn(
            'h-full overflow-hidden transition-all duration-300',
            'hover:shadow-lg hover:-translate-y-1',
            featured && 'md:col-span-2'
          )}
        >
          {/* Cover Image */}
          <div className={cn('relative w-full overflow-hidden', featured ? 'h-64 md:h-80' : 'h-48')}>
            {article.coverImageUrl ? (
              <Image
                src={article.coverImageUrl}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes={featured ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 50vw'}
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-farmero-olive/20 via-farmero-terracotta/10 to-farmero-olive/20" />
            )}
            
            {/* Badge */}
            <div className="absolute left-4 top-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-farmero-terracotta/90 px-3 py-1 text-xs font-semibold text-white shadow-md backdrop-blur-sm">
                <BookOpen className="h-3 w-3" />
                {t('journal.badge', 'Jurnal de farme.ro')}
              </span>
            </div>
          </div>

          <CardContent className="p-6">
            {/* Producer Name */}
            <p className="mb-2 text-sm font-medium text-farmero-terracotta">
              {article.producerName}
            </p>

            {/* Title */}
            <h3
              className={cn(
                'mb-3 font-heading font-semibold text-foreground line-clamp-2',
                featured ? 'text-xl md:text-2xl' : 'text-lg'
              )}
            >
              {article.title}
            </h3>

            {/* Excerpt */}
            <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
              {article.excerpt}
            </p>

            {/* Meta Info */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {article.publishedAt && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <time dateTime={article.publishedAt}>
                    {formatDate(article.publishedAt, locale)}
                  </time>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

