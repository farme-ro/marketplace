/**
 * Business Contract Details Page
 * 
 * Pagină pentru detalii despre un contract specific
 */

'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, Button, Skeleton } from 'farme-ui'
import { RequireAuth } from '@/components/auth/require-auth'
import { getContractById } from '@/lib/api/farmero-contracts'
import type { FarmeroContractInstance } from '@/lib/types/farmero-contracts'
import { formatDate } from '@/lib/utils/format'
import { useI18n } from '@/lib/i18n/context'
import { FileCheck, ArrowLeft, Download, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function BusinessContractDetailsPage() {
  const { t, locale } = useI18n()
  const params = useParams()
  const contractId = params?.id as string
  const [contract, setContract] = useState<FarmeroContractInstance | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadContract() {
      if (!contractId) return

      try {
        setIsLoading(true)
        setError(null)
        const data = await getContractById(contractId)
        setContract(data)
      } catch (err: any) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('Error loading contract:', err)
        }
        setError(err.message || t('contracts.errorLoading', 'Eroare la încărcarea contractului'))
      } finally {
        setIsLoading(false)
      }
    }

    loadContract()
  }, [contractId, t])

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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return t('contracts.status.active', 'Activ')
      case 'suspended':
        return t('contracts.status.suspended', 'Suspendat')
      case 'terminated':
        return t('contracts.status.terminated', 'Terminat')
      case 'draft':
        return t('contracts.status.draft', 'Draft')
      default:
        return status
    }
  }

  if (isLoading) {
    return (
      <RequireAuth role="business" fallbackRedirect="/login?returnUrl=/business-portal/contracts">
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

  if (error || !contract) {
    return (
      <RequireAuth role="business" fallbackRedirect="/login?returnUrl=/business-portal/contracts">
        <div className="min-h-screen bg-background text-foreground">
          <div className="max-w-6xl mx-auto px-4 py-10 md:py-16">
            <Card className="border border-border rounded-2xl shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <p className="text-base text-foreground mb-2 font-medium">
                    {error || t('contracts.notFound', 'Contractul nu a fost găsit')}
                  </p>
                  <Link href="/business-portal/documents">
                    <Button variant="outline" className="mt-4">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      {t('contracts.backToList', 'Înapoi la listă')}
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
    <RequireAuth role="business" fallbackRedirect="/login?returnUrl=/business-portal/contracts">
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <Link href="/business-portal/documents">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('contracts.backToList', 'Înapoi la listă')}
              </Button>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
              {getContractTypeLabel(contract.type)}
            </h1>
            {contract.referenceNumber && (
              <p className="text-base text-muted-foreground font-mono">
                {contract.referenceNumber}
              </p>
            )}
          </motion.div>

          <div className="space-y-6">
            {/* Contract Details */}
            <Card className="border border-border rounded-2xl shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                      {t('contracts.details.status', 'Status')}
                    </h3>
                    <p className="text-base text-foreground">{getStatusLabel(contract.status)}</p>
                  </div>

                  {contract.parties.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                        {t('contracts.details.parties', 'Părți contractante')}
                      </h3>
                      <div className="space-y-2">
                        {contract.parties.map((party) => (
                          <div key={party.id} className="flex items-center gap-2">
                            <FileCheck className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">{party.displayName}</span>
                            {party.vatId && (
                              <span className="text-xs text-muted-foreground">
                                (CUI: {party.vatId})
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {contract.signedAt && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                        {t('contracts.details.signedAt', 'Data semnării')}
                      </h3>
                      <p className="text-base text-foreground">
                        {formatDate(contract.signedAt, locale, {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  )}

                  {contract.validFrom && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                        {t('contracts.details.validFrom', 'Valabil de la')}
                      </h3>
                      <p className="text-base text-foreground">
                        {formatDate(contract.validFrom, locale, {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  )}

                  {contract.validUntil && (
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                        {t('contracts.details.validUntil', 'Valabil până la')}
                      </h3>
                      <p className="text-base text-foreground">
                        {formatDate(contract.validUntil, locale, {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  )}
                </div>

                {contract.downloadUrl && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <a href={contract.downloadUrl} download>
                      <Button variant="outline" className="w-full sm:w-auto">
                        <Download className="w-4 h-4 mr-2" />
                        {t('contracts.download', 'Descarcă contractul')}
                      </Button>
                    </a>
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
                      {t('contracts.details.infoTitle', 'Informații')}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(
                        'contracts.details.infoDescription',
                        'Acest contract este momentan doar pentru consultare. Pentru întrebări sau modificări, contactează echipa de suport.'
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

