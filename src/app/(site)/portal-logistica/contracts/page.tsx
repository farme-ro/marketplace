/**
 * Logistics Contracts Page
 * 
 * Pagină pentru vizualizarea contractelor partenerului de logistică
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, Button, Skeleton } from 'farme-ui'
import { RequireAuth } from '@/components/auth/require-auth'
import { getMyContracts } from '@/lib/api/farmero-contracts'
import type { FarmeroContractInstance } from '@/lib/types/farmero-contracts'
import { formatDate } from '@/lib/utils/format'
import { useI18n } from '@/lib/i18n/context'
import { FileCheck, AlertCircle, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function LogisticsContractsPage() {
  const { t, locale } = useI18n()
  const [contracts, setContracts] = useState<FarmeroContractInstance[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadContracts() {
      try {
        setIsLoading(true)
        const data = await getMyContracts()
        setContracts(data)
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('Error loading contracts:', err)
        }
        setContracts([])
      } finally {
        setIsLoading(false)
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
    <RequireAuth role="logistics" fallbackRedirect="/login?returnUrl=/logistics-portal/contracts">
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
              {t('contracts.title', 'Contracte & Colaborare')}
            </h1>
            <p className="text-base md:text-lg text-foreground-body max-w-3xl leading-relaxed">
              {t(
                'contracts.subtitle',
                'Vizualizează și gestionează contractele tale cu Farmero și partenerii.'
              )}
            </p>
          </motion.div>

          {isLoading ? (
            <Card className="border border-border rounded-2xl shadow-sm bg-card">
              <CardContent className="p-6">
                <Skeleton variant="rectangular" height="300px" className="rounded-xl" />
              </CardContent>
            </Card>
          ) : contracts.length === 0 ? (
            <Card className="border border-border rounded-2xl shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <FileCheck className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-base text-foreground mb-2 font-medium">
                    {t('contracts.empty', 'Nu ai contracte încă')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t(
                      'contracts.emptyDescription',
                      'Contractele tale cu Farmero și partenerii vor apărea aici.'
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-border rounded-2xl shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                          {t('contracts.table.type', 'Tip contract')}
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                          {t('contracts.table.status', 'Status')}
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                          {t('contracts.table.signedAt', 'Data semnării')}
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                          {t('contracts.table.reference', 'Referință')}
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">
                          {t('contracts.table.actions', 'Acțiuni')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {contracts.map((contract) => (
                        <tr
                          key={contract.id}
                          className="border-b border-border/60 hover:bg-muted/30"
                        >
                          <td className="py-4 px-4">
                            <p className="text-sm font-medium text-foreground">
                              {getContractTypeLabel(contract.type)}
                            </p>
                            {contract.parties.length > 0 && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {contract.parties
                                  .map((p) => p.displayName)
                                  .filter((name) => name !== 'Farmero')
                                  .join(', ') || 'Farmero'}
                              </p>
                            )}
                          </td>
                          <td className="py-4 px-4">{getStatusBadge(contract.status)}</td>
                          <td className="py-4 px-4">
                            {contract.signedAt ? (
                              <p className="text-sm text-foreground">
                                {formatDate(contract.signedAt, locale, {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                })}
                              </p>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                {t('contracts.notSigned', 'Nesemnat')}
                              </p>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            {contract.referenceNumber ? (
                              <p className="text-sm text-foreground font-mono">
                                {contract.referenceNumber}
                              </p>
                            ) : (
                              <p className="text-sm text-muted-foreground">—</p>
                            )}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <Link href={`/logistics-portal/contracts/${contract.id}`}>
                              <Button variant="outline" size="sm">
                                {t('contracts.viewDetails', 'Vezi detalii')}
                                <ExternalLink className="w-4 h-4 ml-2" />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Box */}
          <Card className="border border-border rounded-2xl shadow-sm bg-muted/30 mt-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {t('contracts.infoTitle', 'Informații importante')}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(
                      'contracts.infoDescription',
                      'Contractele sunt momentan doar pentru consultare. Pentru întrebări despre contracte sau pentru a solicita modificări, contactează echipa de suport.'
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RequireAuth>
  )
}

