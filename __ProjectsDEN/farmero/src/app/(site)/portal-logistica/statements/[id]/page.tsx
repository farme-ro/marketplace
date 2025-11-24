/**
 * Logistics Statement Details Page
 * 
 * Pagină pentru detalii despre un extras (statement) specific pentru logistică
 */

'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, Button, Skeleton } from 'farme-ui'
import { RequireAuth } from '@/components/auth/require-auth'
import { getStatementById } from '@/lib/api/farmero-statements'
import type { FarmeroStatementSummary } from '@/lib/types/farmero-fees'
import { formatDate, formatCurrency } from '@/lib/utils/format'
import { useI18n } from '@/lib/i18n/context'
import { FileText, ArrowLeft, Download, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function LogisticsStatementDetailsPage() {
  const { t, locale } = useI18n()
  const params = useParams()
  const statementId = params?.id as string
  const [statement, setStatement] = useState<FarmeroStatementSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadStatement() {
      if (!statementId) return

      try {
        setIsLoading(true)
        setError(null)
        const data = await getStatementById(statementId)
        setStatement(data)
      } catch (err: any) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('Error loading statement:', err)
        }
        setError(err.message || t('logistics.commissions.errorLoading', 'Eroare la încărcarea extrasului'))
      } finally {
        setIsLoading(false)
      }
    }

    loadStatement()
  }, [statementId, t])

  const getReferenceTypeLabel = (type: string) => {
    switch (type) {
      case 'order':
        return t('logistics.commissions.referenceType.order', 'Comandă')
      case 'subscription':
        return t('logistics.commissions.referenceType.subscription', 'Abonament')
      case 'delivery':
        return t('logistics.commissions.referenceType.delivery', 'Livrare')
      case 'marketing':
        return t('logistics.commissions.referenceType.marketing', 'Marketing')
      default:
        return type
    }
  }

  if (isLoading) {
    return (
      <RequireAuth role="logistics" fallbackRedirect="/login?returnUrl=/logistics-portal/commissions">
        <div className="min-h-screen bg-background text-foreground">
          <div className="max-w-6xl mx-auto px-4 py-10 md:py-16">
            <Card className="border border-border rounded-2xl shadow-sm bg-card">
              <CardContent className="p-6">
                <Skeleton variant="rectangular" height="400px" className="rounded-xl" />
              </CardContent>
            </Card>
          </div>
        </div>
      </RequireAuth>
    )
  }

  if (error || !statement) {
    return (
      <RequireAuth role="logistics" fallbackRedirect="/login?returnUrl=/logistics-portal/commissions">
        <div className="min-h-screen bg-background text-foreground">
          <div className="max-w-6xl mx-auto px-4 py-10 md:py-16">
            <Card className="border border-border rounded-2xl shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <p className="text-base text-foreground mb-2 font-medium">
                    {error || t('logistics.commissions.notFound', 'Extrasul nu a fost găsit')}
                  </p>
                  <Link href="/logistics-portal/commissions">
                    <Button variant="outline" className="mt-4">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      {t('logistics.commissions.backToList', 'Înapoi la listă')}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </RequireAuth>
    )
  }

  return (
    <RequireAuth role="logistics" fallbackRedirect="/login?returnUrl=/logistics-portal/commissions">
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <Link href="/logistics-portal/commissions">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('logistics.commissions.backToList', 'Înapoi la listă')}
              </Button>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
              {t('logistics.commissions.statementDetails', 'Detalii extras')}
            </h1>
            <p className="text-base text-muted-foreground">
              {formatDate(statement.periodStart, locale, {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}{' '}
              -{' '}
              {formatDate(statement.periodEnd, locale, {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </motion.div>

          <div className="space-y-6">
            {/* Summary */}
            <Card className="border border-border rounded-2xl shadow-sm bg-card">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">
                  {t('logistics.commissions.summary', 'Rezumat')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-muted/30 border border-border">
                    <p className="text-sm text-muted-foreground mb-1">
                      {t('logistics.commissions.totalGross', 'Total brut')}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatCurrency(statement.totalGross, locale, statement.currency)}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/30 border border-border">
                    <p className="text-sm text-muted-foreground mb-1">
                      {t('logistics.commissions.totalFees', 'Total comisioane')}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatCurrency(statement.totalFees, locale, statement.currency)}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-1">
                      {t('logistics.commissions.totalNet', 'Total de încasat (net)')}
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(statement.totalNet, locale, statement.currency)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statement Lines */}
            <Card className="border border-border rounded-2xl shadow-sm bg-card">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">
                  {t('logistics.commissions.lines', 'Detalii tranzacții')}
                </h2>

                {statement.lines.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">
                      {t('logistics.commissions.noLines', 'Nu există tranzacții în acest extras')}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                            {t('logistics.commissions.table.date', 'Data')}
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                            {t('logistics.commissions.table.reference', 'Referință')}
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                            {t('logistics.commissions.table.description', 'Descriere')}
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">
                            {t('logistics.commissions.table.gross', 'Brut')}
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">
                            {t('logistics.commissions.table.fee', 'Comision')}
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">
                            {t('logistics.commissions.table.net', 'Net')}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {statement.lines.map((line) => (
                          <tr
                            key={line.id}
                            className="border-b border-border/60 hover:bg-muted/30"
                          >
                            <td className="py-4 px-4">
                              <p className="text-sm text-foreground">
                                {formatDate(line.date, locale, {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </p>
                            </td>
                            <td className="py-4 px-4">
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  {getReferenceTypeLabel(line.referenceType)}
                                </p>
                                {line.referenceNumber && (
                                  <p className="text-xs text-muted-foreground font-mono">
                                    {line.referenceNumber}
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-sm text-foreground">{line.description || '—'}</p>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <p className="text-sm text-foreground">
                                {formatCurrency(line.grossAmount, locale, line.currency)}
                              </p>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <p className="text-sm text-foreground">
                                {formatCurrency(line.feeAmount, locale, line.currency)}
                              </p>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <p className="text-sm font-semibold text-foreground">
                                {formatCurrency(line.netAmount, locale, line.currency)}
                              </p>
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
        </div>
      </div>
    </RequireAuth>
  )
}

