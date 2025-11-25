/**
 * Logistics Commissions Page
 * 
 * Pagină pentru vizualizarea cursei și comisioanelor pentru partenerii de logistică
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, Button, Skeleton } from 'farme-ui'
import { RequireAuth } from '@/components/auth/require-auth'
import {
  getMyStatements,
  getCurrentPeriodSummary,
} from '@/lib/api/farmero-statements'
import type { FarmeroStatementSummary } from '@/lib/types/farmero-fees'
import { formatDate, formatCurrency } from '@/lib/utils/format'
import { useI18n } from '@/lib/i18n/context'
import { Truck, FileText, ExternalLink, AlertCircle, DollarSign } from 'lucide-react'
import Link from 'next/link'

export default function LogisticsCommissionsPage() {
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
    <RequireAuth role="logistics" fallbackRedirect="/login?returnUrl=/logistics-portal/commissions">
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-16">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
              {t('logistics.commissions.title', 'Curse & Comisioane')}
            </h1>
            <p className="text-base md:text-lg text-foreground-body max-w-3xl leading-relaxed">
              {t(
                'logistics.commissions.subtitle',
                'Vizualizează rezumatul cursei tale și comisioanele Farmero.'
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
            </div>
          ) : !currentSummary && statements.length === 0 ? (
            <Card className="border border-border rounded-2xl shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Truck className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-base text-foreground mb-2 font-medium">
                    {t(
                      'logistics.commissions.comingSoon',
                      'În curând vei putea vedea aici un rezumat clar al cursei tale și al comisioanelor Farmero.'
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Current Period Summary */}
              {currentSummary && (
                <Card className="border border-border rounded-2xl shadow-sm bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center">
                        <Truck className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="text-xl font-semibold text-foreground">
                        {t('logistics.commissions.currentPeriod', 'Rezumat perioadă curentă')}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-muted/30 border border-border">
                        <p className="text-sm text-muted-foreground mb-1">
                          {t('logistics.commissions.totalGross', 'Total brut')}
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                          {formatCurrency(currentSummary.totalGross, locale, currentSummary.currency)}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-muted/30 border border-border">
                        <p className="text-sm text-muted-foreground mb-1">
                          {t('logistics.commissions.totalFees', 'Total comisioane')}
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                          {formatCurrency(currentSummary.totalFees, locale, currentSummary.currency)}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                        <p className="text-sm text-muted-foreground mb-1">
                          {t('logistics.commissions.totalNet', 'Total de încasat (net)')}
                        </p>
                        <p className="text-2xl font-bold text-primary">
                          {formatCurrency(currentSummary.totalNet, locale, currentSummary.currency)}
                        </p>
                      </div>
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
                      {t('logistics.commissions.statements', 'Extrase')}
                    </h2>
                  </div>

                  {statements.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-sm text-muted-foreground">
                        {t('logistics.commissions.noStatements', 'Nu ai extrase încă')}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                              {t('logistics.commissions.table.period', 'Perioadă')}
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">
                              {t('logistics.commissions.table.totalGross', 'Total brut')}
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">
                              {t('logistics.commissions.table.totalFees', 'Total comision')}
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">
                              {t('logistics.commissions.table.totalNet', 'Total net')}
                            </th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">
                              {t('logistics.commissions.table.actions', 'Acțiuni')}
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
                                <Link href={`/logistics-portal/statements/${statement.id}`}>
                                  <Button variant="outline" size="sm">
                                    {t('logistics.commissions.viewDetails', 'Vezi detalii')}
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
        </div>
      </div>
    </RequireAuth>
  )
}

