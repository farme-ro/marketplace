/**
 * Visibility Suggestions Section
 * 
 * Secțiune bazată pe Growth Engine pentru sugestii de creștere a vizibilității
 */

'use client'

import { useGrowthNudges } from '@/lib/growth/growth-hooks'
import { useI18n } from '@/lib/i18n/context'
import { Card, CardContent, CardHeader, CardTitle } from 'farme-ui'
import { Lightbulb, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function VisibilitySuggestionsSection() {
  const { t } = useI18n()
  const { nudges, loading } = useGrowthNudges({ page: 'portal', role: 'PRODUCER' })

  if (loading || nudges.length === 0) {
    return null
  }

  // Filter nudges specific to producers
  const producerNudges = nudges.filter(n => 
    n.code === 'journal_activation' || 
    n.code === 'subscription_prompt' ||
    n.code.includes('promo')
  )

  if (producerNudges.length === 0) {
    return null
  }

  const topNudge = producerNudges.sort((a, b) => b.priority - a.priority)[0]

  return (
    <Card className="border-2 border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="w-5 h-5 text-primary" />
          {t('growth.visibilitySuggestions.title', 'Sugestii pentru vizibilitate')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-foreground">
          {topNudge.message || topNudge.description || t('growth.visibilitySuggestions.defaultMessage', 'Îmbunătățește-ți vizibilitatea')}
        </p>
        {topNudge.actionUrl && (
          <Link
            href={topNudge.actionUrl}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            {t('growth.visibilitySuggestions.learnMore', 'Află mai multe')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </CardContent>
    </Card>
  )
}

