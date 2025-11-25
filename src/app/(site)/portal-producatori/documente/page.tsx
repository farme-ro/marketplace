/**
 * Producer Documents & Invoicing Page
 * 
 * Pagină pentru gestionarea documentelor legale și facturare
 * Include: facturi, avize de însoțire, AWB & livrări
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, Button } from 'farme-ui'
import { ProducerDashboardLayout } from '@/components/producer-portal/producer-dashboard-layout'
import { DocumentCenter } from '@/components/documents/document-center'
import { ContractGenerator } from '@/components/documents/contract-generator'
import { useI18n } from '@/lib/i18n/context'
import { FileText, FileCheck, Plus, X } from 'lucide-react'

export default function ProducerDocumentsPage() {
  const { t } = useI18n()
  const [showContractGenerator, setShowContractGenerator] = useState(false)

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
          {t('producer.documents.title', 'Documente & Facturare')}
        </h1>
        <p className="text-base md:text-lg text-foreground-body max-w-3xl leading-relaxed">
          {t(
            'producer.documents.subtitle',
            'Gestionează-ți facturile, avizele de însoțire și documentele de livrare.'
          )}
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Contract Generator Section */}
        <Card className="border border-border rounded-2xl shadow-sm bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileCheck className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  {t('producer.documents.contracts', 'Contracte')}
                </h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowContractGenerator(!showContractGenerator)}
              >
                {showContractGenerator ? (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    {t('common.close', 'Închide')}
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    {t('producer.documents.createContract', 'Creează contract')}
                  </>
                )}
              </Button>
            </div>

            {showContractGenerator && (
              <div className="mb-6">
                <ContractGenerator
                  defaultType="producer_platform"
                  variant="page"
                  onDraftCreated={() => {
                    setShowContractGenerator(false)
                  }}
                />
              </div>
            )}

            {/* Documents List */}
            <DocumentCenter
              filterByType={['contract']}
              emptyStateMessage={t('producer.documents.noContracts', 'Nu ai contracte încă')}
              showFilters={true}
            />
          </CardContent>
        </Card>

        {/* All Documents Section */}
        <Card className="border border-border rounded-2xl shadow-sm bg-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                {t('producer.documents.allDocuments', 'Toate documentele')}
              </h2>
            </div>

            <DocumentCenter
              emptyStateMessage={t('producer.documents.noDocuments', 'Nu ai documente încă')}
              showFilters={true}
            />
          </CardContent>
        </Card>
      </div>
    </ProducerDashboardLayout>
  )
}

