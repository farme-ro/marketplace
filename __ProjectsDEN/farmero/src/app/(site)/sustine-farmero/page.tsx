/**
 * Support Farmero Page
 * 
 * Pagină pentru donații către platforma Farmero
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, Button, Input } from 'farme-ui'
import { useI18n } from '@/lib/i18n/context'
import { getDonationSummary, createDonationIntent } from '@/lib/api/farmero-donations'
import type { FarmeroDonationSummary } from '@/lib/types/farmero-donations'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import { Heart, TrendingUp, Users, Leaf, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useToast } from '@/components/ui/toast'
import Link from 'next/link'

export default function SupportFarmeroPage() {
  const { t, locale } = useI18n()
  const { showToast } = useToast()
  const [summary, setSummary] = useState<FarmeroDonationSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [donationAmount, setDonationAmount] = useState<string>('')
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const presetAmounts = [10, 25, 50, 100]

  useEffect(() => {
    async function loadSummary() {
      try {
        setIsLoading(true)
        const data = await getDonationSummary()
        setSummary(data)
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('Error loading donation summary:', err)
        }
        // Don't show error, just use default summary
        const now = new Date()
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        setSummary({
          periodStart: firstDay.toISOString(),
          periodEnd: lastDay.toISOString(),
          totalAmount: 0,
          currency: 'RON',
          donorsCount: 0,
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadSummary()
  }, [])

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setDonationAmount(amount.toString())
  }

  const handleCustomAmountChange = (value: string) => {
    setDonationAmount(value)
    setSelectedAmount(null)
  }

  const handleDonate = async () => {
    const amount = parseFloat(donationAmount)
    if (!amount || amount <= 0) {
      showToast(
        t('donations.invalidAmountDescription', 'Te rugăm să introduci o sumă validă.'),
        'error'
      )
      return
    }

    try {
      setIsSubmitting(true)
      await createDonationIntent({
        amount,
        currency: summary?.currency || 'RON',
      })
      // If we get here, the intent was created successfully
      // In the future, this might redirect to a payment processor
      showToast(
        t(
          'donations.developmentMessage',
          'Sistemul de donații este în dezvoltare. Îți mulțumim că vrei să susții Farmero.'
        ),
        'info'
      )
      // Reset form
      setDonationAmount('')
      setSelectedAmount(null)
    } catch (err: any) {
      showToast(
        err.message || t('donations.errorDescription', 'A apărut o eroare. Te rugăm să încerci din nou.'),
        'error'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-10 md:py-16">
        {/* Header */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              {t('donations.title', 'Susține Farmero')}
            </h1>
            <p className="text-lg md:text-xl text-foreground-body max-w-2xl mx-auto leading-relaxed">
              {t(
                'donations.subtitle',
                'Ajută-ne să construim un sistem prin care produsele locale ajung mai ușor la oameni.'
              )}
            </p>
        </motion.div>

        {/* Why Support Section */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <Card className="border border-border rounded-2xl shadow-sm bg-card">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-6">
                  {t('donations.whySupport', 'De ce contează susținerea ta')}
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {t('donations.infrastructure', 'Infrastructură & dezvoltare')}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t(
                          'donations.infrastructureDescription',
                          'Susținem continuu dezvoltarea platformei pentru a oferi o experiență mai bună utilizatorilor și producătorilor.'
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {t('donations.smallProducers', 'Suport pentru producători mici')}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t(
                          'donations.smallProducersDescription',
                          'Ajutăm producătorii locali să-și găsească clienții și să-și dezvolte afacerea.'
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <Leaf className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {t('donations.socialProjects', 'Proiecte sociale & sustenabile')}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t(
                          'donations.socialProjectsDescription',
                          'În viitor, vom dezvolta proiecte care sprijină comunitatea și sustenabilitatea.'
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
        </motion.div>

        {/* Statistics Section */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <Card className="border border-border rounded-2xl shadow-sm bg-card">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-2xl font-semibold text-foreground mb-6">
                  {t('donations.statistics', 'Statistică donații')}
                </h2>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">
                      {t('common.loading', 'Se încarcă...')}
                    </p>
                  </div>
                ) : summary && summary.totalAmount > 0 ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                      <p className="text-base text-foreground mb-2">
                        {t('donations.thisMonth', 'Luna aceasta, comunitatea Farmero a donat')}{' '}
                        <span className="font-bold text-primary">
                          {formatCurrency(summary.totalAmount, locale, summary.currency)}
                        </span>
                        .
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/30 border border-border">
                      <p className="text-sm text-foreground">
                        <span className="font-semibold">{summary.donorsCount}</span>{' '}
                        {t('donations.donors', 'persoane au ales să contribuie')}.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-sm text-muted-foreground">
                      {t(
                        'donations.systemInPreparation',
                        'Sistemul de donații este în pregătire. Îți vom spune imediat ce este disponibil.'
                      )}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
        </motion.div>

        {/* Donation Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-0"
        >
          <Card className="border border-border rounded-2xl shadow-sm bg-card">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                {t('donations.wantToDonate', 'Vreau să donez')}
              </h2>

              <div className="space-y-6">
                {/* Preset Amounts */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    {t('donations.selectAmount', 'Selectează suma')}
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {presetAmounts.map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => handleAmountSelect(amount)}
                          className={`px-4 py-3 rounded-lg border transition-colors ${
                            selectedAmount === amount
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border bg-background hover:bg-muted'
                          }`}
                          aria-label={t('donations.selectAmountAria', 'Selectează suma de {{amount}} lei').replace('{{amount}}', amount.toString())}
                        >
                          {amount} {summary?.currency || 'RON'}
                        </button>
                      ))}
                    </div>
                  </div>

                {/* Custom Amount */}
                <div>
                  <label
                    htmlFor="custom-amount"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    {t('donations.customAmount', 'Sau introdu o sumă personalizată')}
                  </label>
                  <Input
                    id="custom-amount"
                    type="number"
                    min="1"
                    step="0.01"
                    value={donationAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    placeholder={t('donations.amountPlaceholder', 'Suma în RON')}
                    className="w-full"
                    aria-label={t('donations.customAmountAria', 'Sumă personalizată')}
                  />
                </div>

                {/* Donate Button */}
                <div className="pt-2">
                  <Button
                    onClick={handleDonate}
                    disabled={isSubmitting || !donationAmount || parseFloat(donationAmount) <= 0}
                    className="w-full"
                    size="lg"
                    aria-label={t('donations.donateAria', 'Donează')}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        {t('common.processing', 'Se procesează...')}
                      </>
                    ) : (
                      <>
                        <Heart className="w-5 h-5 mr-2" />
                        {t('donations.donate', 'Donează')}
                      </>
                    )}
                  </Button>
                </div>

                {/* Info Box */}
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-foreground mb-1 font-medium">
                          {t('donations.infoTitle', 'Informații importante')}
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {t(
                            'donations.infoDescription',
                            'Donațiile sunt anonime implicit și nu oferă beneficii comerciale. Ele susțin dezvoltarea platformei și comunitatea.'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                {/* Privacy Note */}
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                      {t(
                        'donations.privacyNote', 
                        'Donațiile sunt procesate în condiții de siguranță. Vom folosi datele tale doar pentru a procesa plata și pentru obligațiile legale. În mod implicit, donațiile tale nu sunt afișate public altor utilizatori.'
                      )}
                    </p>
                    <Link
                      href="/privacy"
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      {t('donations.privacyLink', 'Politica de confidențialitate')}
                    </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

