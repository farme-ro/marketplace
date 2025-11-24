/**
 * Business Documents Page
 * 
 * Pagină pentru gestionarea documentelor pentru clienții business
 * Include: facturi, contracte
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, Button } from 'farme-ui'
import { RequireAuth } from '@/components/auth/require-auth'
import { useI18n } from '@/lib/i18n/context'
import { typography } from '@/lib/design-system/typography'
import { cn } from '@/lib/utils/cn'
import { FileText, FileCheck, Download, AlertCircle, DollarSign } from 'lucide-react'
import type { FarmeroGeneratedContract } from '@/lib/types/farmero-documents'
import { getMyContracts } from '@/lib/api/farmero-contracts'
import type { FarmeroContractInstance } from '@/lib/types/farmero-contracts'
import { formatDate } from '@/lib/utils/format'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { DocumentCenter } from '@/components/documents/document-center'

export default function BusinessDocumentsPage() {
  const { t, locale } = useI18n()
  const [contracts, setContracts] = useState<FarmeroContractInstance[]>([])
  const [isLoadingContracts, setIsLoadingContracts] = useState(true)

  useEffect(() => {
    async function loadContracts() {
      try {
        setIsLoadingContracts(true)
        const data = await getMyContracts()
        setContracts(data)
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('Error loading contracts:', err)
        }
        setContracts([])
      } finally {
        setIsLoadingContracts(false)
      }
    }

    loadContracts()
  }, [])

  const getContractTypeLabel = (type: string) => {
    switch (type) {
      case 'producer_platform':
        return t('contracts.types.producerPlatform', 'Contract producător – Farmero')
      case 'logistics_platform':
        return t('contracts.types.logisticsPlatform', 'Contract logistică – Farmero')
      case 'business_platform':
        return t('contracts.types.businessPlatform', 'Contract business – Farmero')
      case 'producer_business':
        return t('contracts.types.producerBusiness', 'Contract producător – Business')
      case 'donor_platform':
        return t('contracts.types.donorPlatform', 'Contract donator – Farmero')
      default:
        return type
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            {t('contracts.status.active', 'Activ')}
          </span>
        )
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
            {t('contracts.status.suspended', 'Suspendat')}
          </span>
        )
      case 'terminated':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            {t('contracts.status.terminated', 'Terminat')}
          </span>
        )
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            {t('contracts.status.draft', 'Draft')}
          </span>
        )
      default:
        return null
    }
  }

  return (
    <RequireAuth role="business" fallbackRedirect="/login?returnUrl=/business-portal/documents">
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-16">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className={cn(typography.pageTitle.base, 'mb-2')}>
              {t('business.documents.title', 'Documente')}
            </h1>
            <p className="text-base md:text-lg text-foreground-body max-w-3xl leading-relaxed">
              {t(
                'business.documents.subtitle',
                'Gestionează-ți facturile și contractele pentru comenzile tale Farmero.'
              )}
            </p>
          </motion.div>

          <div className="space-y-6">
            {/* All Documents Section */}
            <Card className="border border-border rounded-2xl shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className={typography.sectionTitle.base}>
                    {t('business.documents.allDocuments', 'Toate documentele')}
                  </h2>
                </div>

                <DocumentCenter
                  emptyStateMessage={t('business.documents.noDocuments', 'Nu ai documente încă')}
                  showFilters={true}
                />
              </CardContent>
            </Card>

            {/* Section: Payments & Billing */}
            <Card className="border border-border rounded-2xl shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className={typography.sectionTitle.base}>
                    {t('business.payments.title', 'Plăți & Facturare')}
                  </h2>
                </div>

                <div className="text-center py-12">
                  <DollarSign className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-base text-foreground mb-2 font-medium">
                    {t(
                      'business.payments.comingSoon',
                      'În curând vei putea vedea aici extrasele cu facturile plătite și comisioanele.'
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t(
                      'business.payments.comingSoonDescription',
                      'Funcționalitatea este în curs de dezvoltare. Vom anunța când va fi disponibilă.'
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 2: Contracts */}
            <Card className="border border-border rounded-2xl shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <FileCheck className="w-5 h-5 text-secondary" />
                  </div>
                  <h2 className={typography.sectionTitle.base}>
                    {t('business.documents.contracts', 'Contracte')}
                  </h2>
                </div>

                {isLoadingContracts ? (
                  <div className="text-center py-12">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">
                      {t('common.loading', 'Se încarcă...')}
                    </p>
                  </div>
                ) : contracts.length === 0 ? (
                  <div className="text-center py-12">
                    <FileCheck className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-base text-foreground mb-2 font-medium">
                      {t('business.documents.noContracts', 'Nu ai contracte încă')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t(
                        'business.documents.contractsDescription',
                        'Contractele generate pentru parteneriatul tău cu Farmero vor apărea aici.'
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {contracts.map((contract) => (
                      <div
                        key={contract.id}
                        className="p-4 rounded-lg border border-border bg-muted/30 flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">
                            {getContractTypeLabel(contract.type)}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusBadge(contract.status)}
                            {contract.signedAt && (
                              <p className="text-xs text-muted-foreground">
                                {t('business.documents.signedAt', 'Semnat la')}{' '}
                                {formatDate(contract.signedAt, locale, {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                })}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {contract.downloadUrl && (
                            <a href={contract.downloadUrl} download>
                              <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                {t('common.download', 'Descarcă')}
                              </Button>
                            </a>
                          )}
                          <Link href={`/business-portal/contracts/${contract.id}`}>
                            <Button variant="outline" size="sm">
                              {t('contracts.viewDetails', 'Vezi detalii')}
                              <ExternalLink className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Info Box */}
            <Card className="border border-border rounded-2xl shadow-sm bg-muted/30">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {t('business.documents.infoTitle', 'Informații importante')}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(
                        'business.documents.infoDescription',
                        'Toate funcționalitățile de documente sunt în curs de dezvoltare. Vom anunța când vor fi disponibile. Pentru întrebări, contactează echipa de suport.'
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RequireAuth>
  )
}

