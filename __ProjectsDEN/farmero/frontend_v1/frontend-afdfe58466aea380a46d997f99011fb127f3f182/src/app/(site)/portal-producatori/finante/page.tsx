/**
 * Producer Finances Page
 * 
 * Pagină pentru facturi și finanțe producător
 * Integrat cu API pentru date reale
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, Button } from 'farme-ui'
import { ProducerDashboardLayout } from '@/components/producer-portal/producer-dashboard-layout'
import { getProducerFinances, getPayoutSummary, getPayouts, downloadInvoice } from '@/lib/api/producer/finances'
import type { ProducerFinances, ProducerPayment } from '@/lib/api/producer/finances'
import { FileText, Wallet, TrendingUp, Calendar, Download } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'
import { formatCurrency, formatDate } from '@/lib/utils/format'

export default function ProducerFinancesPage() {
  const { t, locale } = useI18n()
  const [finances, setFinances] = useState<ProducerFinances | null>(null)
  const [payoutSummary, setPayoutSummary] = useState<{
    totalIncomes: number
    totalCommission: number
    processingAmount: number
    currency: string
  } | null>(null)
  const [payouts, setPayouts] = useState<ProducerPayment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadFinances() {
      try {
        setIsLoading(true)
        setError(null)
        
        // Load finances, payout summary, and payouts in parallel
        const [financesData, summaryData, payoutsData] = await Promise.allSettled([
          getProducerFinances(),
          getPayoutSummary(),
          getPayouts(),
        ])
        
        if (financesData.status === 'fulfilled') {
          setFinances(financesData.value)
        } else {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.error('[Producer Finances] Failed to load finances:', financesData.reason)
          }
        }
        
        if (summaryData.status === 'fulfilled') {
          setPayoutSummary(summaryData.value)
        } else {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.error('[Producer Finances] Failed to load payout summary:', summaryData.reason)
          }
        }
        
        if (payoutsData.status === 'fulfilled') {
          setPayouts(payoutsData.value)
        } else {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.error('[Producer Finances] Failed to load payouts:', payoutsData.reason)
          }
        }
      } catch (err: any) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('Error loading finances:', err)
        }
        setError(err.message || t('producer.finances.errorLoading', 'Eroare la încărcarea datelor financiare'))
      } finally {
        setIsLoading(false)
      }
    }

    loadFinances()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDownloadInvoice = async (invoiceId: string, invoiceNumber: string) => {
    try {
      const url = await downloadInvoice(invoiceId)
      // Open invoice URL in new tab
      window.open(url, '_blank')
    } catch (err: any) {
      alert(err.message || t('producer.finances.errorDownload', 'Eroare la descărcarea facturii'))
    }
  }

  if (isLoading) {
    return (
      <ProducerDashboardLayout>
        <div className="max-w-8xl mx-auto px-4 py-10 space-y-6">
          <div className="text-center py-20">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
            <p className="text-muted-foreground">{t('producer.finances.loading', 'Se încarcă datele financiare...')}</p>
          </div>
        </div>
      </ProducerDashboardLayout>
    )
  }

  if (error && !finances) {
    return (
      <ProducerDashboardLayout>
        <div className="max-w-8xl mx-auto px-4 py-10 space-y-6">
          <Card className="border border-border rounded-2xl">
            <CardContent className="p-12 text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                {t('common.retry', 'Încearcă din nou')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </ProducerDashboardLayout>
    )
  }

  // If finances is null (endpoint doesn't exist), show placeholder
  if (!finances) {
    return (
      <ProducerDashboardLayout>
        <div className="max-w-8xl mx-auto px-4 py-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
              {t('producer.finances.title', 'Facturi & Finanțe')}
            </h1>
            <p className="text-base text-foreground-body">
              {t('producer.finances.description', 'Gestionează facturile, plățile și încasările tale')}
            </p>
          </motion.div>

          <Card className="border border-border rounded-2xl shadow-sm bg-card">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Wallet className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {t('producer.finances.inDevelopment', 'Secțiunea de finanțe este în curs de dezvoltare')}
              </h3>
              <p className="text-sm text-foreground-body max-w-md mx-auto mb-6">
                {t('producer.finances.inDevelopmentDescription', 'Vei putea vedea aici facturile, plățile și situația ta financiară detaliată.')}
              </p>
              <Link
                href="/portal-producatori/dashboard"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                {t('producer.finances.backToDashboard', 'Înapoi la dashboard')}
              </Link>
            </CardContent>
          </Card>
        </div>
      </ProducerDashboardLayout>
    )
  }

  return (
    <ProducerDashboardLayout>
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
            {t('producer.finances.title', 'Facturi & Finanțe')}
          </h1>
          <p className="text-base text-foreground-body">
            {t('producer.finances.description', 'Gestionează facturile, plățile și încasările tale')}
          </p>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="border border-border rounded-2xl shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('producer.finances.totalIncome', 'Total încasări luna curentă')}</p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatCurrency(payoutSummary ? payoutSummary.totalIncomes : finances?.thisMonthRevenue || 0, locale, payoutSummary?.currency || finances?.currency || 'RON')}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {finances?.currentBalance 
                    ? `${t('producer.finances.availableBalance', 'Sold disponibil')}: ${formatCurrency(finances.currentBalance, locale, finances.currency)}`
                    : t('producer.finances.fromCurrentMonth', 'Din vânzările lunii curente')}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="border border-border rounded-2xl shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('producer.finances.commissions', 'Comisioane reținute')}</p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatCurrency(payoutSummary ? payoutSummary.totalCommission : finances?.thisMonthCommission || 0, locale, payoutSummary?.currency || finances?.currency || 'RON')}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('producer.finances.fromCurrentMonth', 'Din vânzările lunii curente')}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card className="border border-border rounded-2xl shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('producer.finances.processing', 'Bani în procesare')}</p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatCurrency(payoutSummary ? payoutSummary.processingAmount : finances?.upcomingPayments || 0, locale, payoutSummary?.currency || finances?.currency || 'RON')}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('producer.finances.processingDescription', 'În curs de procesare')}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Payouts Table */}
        <Card className="border border-border rounded-2xl shadow-sm bg-card">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">
              {t('producer.finances.receivedPayments', 'Plăți primite')}
            </h2>
            {payouts.length === 0 && finances?.payments.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-foreground-body">{t('producer.finances.noPayments', 'Nu ai plăți încă')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {(payouts.length > 0 ? payouts : finances?.payments || []).map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {payment.invoiceNumber}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(payment.date, locale)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-base font-semibold text-foreground">
                        {formatCurrency(payment.amount, locale, payoutSummary?.currency || finances?.currency || 'RON')}
                      </p>
                      {payment.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {payment.description}
                        </p>
                      )}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          payment.status === 'paid'
                            ? 'bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'
                            : payment.status === 'pending'
                            ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                            : 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
                        }`}
                      >
                        {payment.status === 'paid' 
                          ? t('producer.finances.statusPaid', 'Plătită')
                          : payment.status === 'pending'
                          ? t('producer.finances.statusPending', 'În așteptare')
                          : payment.status === 'failed'
                          ? t('producer.finances.statusFailed', 'Eșuată')
                          : payment.status === 'refunded'
                          ? t('producer.finances.statusRefunded', 'Rambursată')
                          : t('producer.finances.statusUnknown', 'Necunoscut')}
                      </span>
                      {payment.invoiceUrl && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="gap-2"
                          onClick={() => handleDownloadInvoice(payment.id, payment.invoiceNumber)}
                        >
                          <Download className="w-4 h-4" />
                          {t('producer.finances.download', 'Descarcă')}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Link
            href="/portal-producatori/dashboard"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            {t('producer.finances.backToDashboard', 'Înapoi la dashboard')}
          </Link>
          <Link
            href="/portal-producatori/comisioane"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            {t('producer.finances.viewCommissions', 'Vezi comisioane')}
          </Link>
        </div>
      </div>
    </ProducerDashboardLayout>
  )
}
