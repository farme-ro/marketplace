/**
 * Producer Sales & Commissions Page
 * 
 * Pagină pentru vizualizarea vânzărilor și comisioanelor Farmero
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, Button, Skeleton } from 'farme-ui'
import { ProducerDashboardLayout } from '@/components/producer-portal/producer-dashboard-layout'
import {
  getMyStatements,
  getStatementById,
  getCurrentPeriodSummary,
} from '@/lib/api/farmero-statements'
import type { FarmeroStatementSummary } from '@/lib/types/farmero-fees'
import { formatDate, formatCurrency } from '@/lib/utils/format'
import { useI18n } from '@/lib/i18n/context'
import { TrendingUp, FileText, ExternalLink, AlertCircle, DollarSign } from 'lucide-react'
import Link from 'next/link'

export default function ProducerSalesCommissionsPage() {
  const { t, locale } = useI18n()
  const [statements, setStatements] = useState<FarmeroStatementSummary[]>([])
  const [currentSummary, setCurrentSummary] = useState<FarmeroStatementSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        const [statementsData, currentSummaryData] = await Promise.all([
          getMyStatements(),
          getCurrentPeriodSummary().catch(() => null),
        ])
        setStatements(statementsData)
        setCurrentSummary(currentSummaryData)
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('Error loading statements:', err)
        }
        setStatements([])
        setCurrentSummary(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const formatPeriod = (start: string, end: string) => {
    const startDate = formatDate(start, locale, { day: 'numeric', month: 'long', year: 'numeric' })
    const endDate = formatDate(end, locale, { day: 'numeric', month: 'long', year: 'numeric' })
    return `${startDate} - ${endDate}`
  }

  return (
    <ProducerDashboardLayout>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
          {t('producer.salesCommissions.title', 'Vânzări & Comisioane')}
        </h1>
        <p className="text-base md:text-lg text-foreground-body max-w-3xl leading-relaxed">
          {t(
            'producer.salesCommissions.subtitle',
            'Vizualizează rezumatul vânzărilor tale și comisioanele Farmero.'
          )}
        </p>
      </motion.div>

      {isLoading ? (
        <div className="space-y-6">
          <Card className="border border-border rounded-2xl shadow-sm bg-card">
            <CardContent className="p-6">
              <Skeleton variant="rectangular" height="200px" className="rounded-xl" />
            </CardContent>
          </Card>
          <Card className="border border-border rounded-2xl shadow-sm bg-card">
            <CardContent className="p-6">
              <Skeleton variant="rectangular" height="300px" className="rounded-xl" />
            </CardContent>
          </Card>
        </div>
      ) : !currentSummary && statements.length === 0 ? (
        <Card className="border border-border rounded-2xl shadow-sm bg-card">
          <CardContent className="p-6">
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-base text-foreground mb-2 font-medium">
                {t(
                  'producer.salesCommissions.comingSoon',
                  'În curând vei putea vedea aici un rezumat clar al vânzărilor tale și al comisioanelor Farmero.'
                )}
              </p>
              <p className="text-sm text-muted-foreground">
                {t(
                  'producer.salesCommissions.comingSoonDescription',
                  'Funcționalitatea este în curs de dezvoltare. Vom anunța când va fi disponibilă.'
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Current Period Summary */}
          {currentSummary ? (
            <Card className="border border-border rounded-2xl shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">
                    {t('producer.salesCommissions.currentPeriod', 'Rezumat perioadă curentă')}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-muted/30 border border-border">
                    <p className="text-sm text-muted-foreground mb-1">
                      {t('producer.salesCommissions.totalGross', 'Total vânzări brute')}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatCurrency(currentSummary.totalGross, locale, currentSummary.currency)}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/30 border border-border">
                    <p className="text-sm text-muted-foreground mb-1">
                      {t('producer.salesCommissions.totalFees', 'Total comisioane Farmero')}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatCurrency(currentSummary.totalFees, locale, currentSummary.currency)}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-1">
                      {t('producer.salesCommissions.totalNet', 'Total de încasat (net)')}
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(currentSummary.totalNet, locale, currentSummary.currency)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    {t('producer.salesCommissions.period', 'Perioadă')}:{' '}
                    {formatPeriod(currentSummary.periodStart, currentSummary.periodEnd)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-border rounded-2xl shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-sm text-muted-foreground">
                    {t(
                      'producer.salesCommissions.noSummary',
                      'Nu există încă suficiente date pentru un rezumat.'
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Statements List */}
          <Card className="border border-border rounded-2xl shadow-sm bg-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-secondary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  {t('producer.salesCommissions.statements', 'Extrase')}
                </h2>
              </div>

              {statements.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-sm text-muted-foreground">
                    {t('producer.salesCommissions.noStatements', 'Nu ai extrase încă')}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                          {t('producer.salesCommissions.table.period', 'Perioadă')}
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">
                          {t('producer.salesCommissions.table.totalGross', 'Total brut')}
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">
                          {t('producer.salesCommissions.table.totalFees', 'Total comision')}
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">
                          {t('producer.salesCommissions.table.totalNet', 'Total net')}
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">
                          {t('producer.salesCommissions.table.actions', 'Acțiuni')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {statements.map((statement) => (
                        <tr
                          key={statement.id}
                          className="border-b border-border/60 hover:bg-muted/30"
                        >
                          <td className="py-4 px-4">
                            <p className="text-sm text-foreground">
                              {formatPeriod(statement.periodStart, statement.periodEnd)}
                            </p>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <p className="text-sm text-foreground">
                              {formatCurrency(statement.totalGross, locale, statement.currency)}
                            </p>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <p className="text-sm text-foreground">
                              {formatCurrency(statement.totalFees, locale, statement.currency)}
                            </p>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <p className="text-sm font-semibold text-foreground">
                              {formatCurrency(statement.totalNet, locale, statement.currency)}
                            </p>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <Link href={`/producer-portal/statements/${statement.id}`}>
                              <Button variant="outline" size="sm">
                                {t('producer.salesCommissions.viewDetails', 'Vezi detalii')}
                                <ExternalLink className="w-4 h-4 ml-2" />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </ProducerDashboardLayout>
  )
}

