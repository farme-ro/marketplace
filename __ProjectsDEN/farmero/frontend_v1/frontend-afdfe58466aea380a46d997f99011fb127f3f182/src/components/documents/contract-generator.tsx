/**
 * Contract Generator Component
 * 
 * UI for creating contract drafts
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, Button, Input } from 'farme-ui'
import { useI18n } from '@/lib/i18n/context'
import { createContractDraft, getContractTemplates } from '@/lib/api/documents'
import type { DomainContractDraft, DomainContractTemplate, ContractTemplateType } from '@/lib/types/domain'
import { FileCheck, Calendar, DollarSign, Users, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useToast } from '@/components/ui/toast'

interface ContractGeneratorProps {
  /**
   * Default contract type (if creating from context)
   */
  defaultType?: ContractTemplateType
  /**
   * Callback when contract draft is created
   */
  onDraftCreated?: (draft: DomainContractDraft & { id: string }) => void
  /**
   * Show as modal or full page
   */
  variant?: 'modal' | 'page'
  /**
   * Close handler (for modal variant)
   */
  onClose?: () => void
}

export function ContractGenerator({
  defaultType,
  onDraftCreated,
  variant = 'page',
  onClose,
}: ContractGeneratorProps) {
  const { t } = useI18n()
  const { showToast } = useToast()
  const [templates, setTemplates] = useState<DomainContractTemplate[]>([])
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [contractType, setContractType] = useState<ContractTemplateType>(defaultType || 'producer_platform')
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [duration, setDuration] = useState<string>('12')
  const [commissionRate, setCommissionRate] = useState<string>('')
  const [paymentTerms, setPaymentTerms] = useState<string>('')
  const [notes, setNotes] = useState<string>('')

  useEffect(() => {
    async function loadTemplates() {
      try {
        setIsLoadingTemplates(true)
        const data = await getContractTemplates()
        setTemplates(data)
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('[ContractGenerator] Failed to load templates:', error)
        }
      } finally {
        setIsLoadingTemplates(false)
      }
    }

    loadTemplates()
  }, [])

  const getContractTypeLabel = (type: ContractTemplateType) => {
    return t(`contracts.types.${type}`, {
      producer_platform: 'Contract Producător – Farmero',
      logistics_platform: 'Contract Logistică – Farmero',
      business_platform: 'Contract Business – Farmero',
      producer_business: 'Contract Producător – Business',
      donor_platform: 'Contract Donator – Farmero',
      other: 'Alt contract',
    }[type] || type)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!startDate) {
      showToast(
        t('contracts.errors.invalidDateDescription', 'Te rugăm să selectezi o dată de început.'),
        'error'
      )
      return
    }

    try {
      setIsSubmitting(true)

      const draft: DomainContractDraft = {
        type: contractType,
        parties: {
          farmero: true,
          producer: contractType === 'producer_platform' || contractType === 'producer_business',
          logistics: contractType === 'logistics_platform',
          business: contractType === 'business_platform' || contractType === 'producer_business',
          client: false,
        },
        startDate,
        duration: duration ? parseInt(duration, 10) : undefined,
        commissionRate: commissionRate ? parseFloat(commissionRate) : undefined,
        paymentTerms: paymentTerms || undefined,
        notes: notes || undefined,
      }

      const created = await createContractDraft(draft)

      showToast(
        t(
          'contracts.draftCreatedDescription',
          'Draft-ul contractului a fost creat. În curând vei putea semna digital acest contract.'
        ),
        'success'
      )

      if (onDraftCreated) {
        onDraftCreated(created)
      }

      if (onClose) {
        onClose()
      }
    } catch (error) {
      showToast(
        t('contracts.errors.createFailedDescription', 'A apărut o eroare. Te rugăm să încerci din nou.'),
        'error'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const content = (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contract Type */}
      <div>
        <label htmlFor="contract-type" className="block text-sm font-medium text-foreground mb-2">
          {t('contracts.form.type', 'Tip contract')}
        </label>
        <select
          id="contract-type"
          value={contractType}
          onChange={(e) => setContractType(e.target.value as ContractTemplateType)}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          required
        >
          {templates.length > 0 ? (
            templates.map((template) => (
              <option key={template.id} value={template.type}>
                {template.name}
              </option>
            ))
          ) : (
            <>
              <option value="producer_platform">{getContractTypeLabel('producer_platform')}</option>
              <option value="logistics_platform">{getContractTypeLabel('logistics_platform')}</option>
              <option value="business_platform">{getContractTypeLabel('business_platform')}</option>
              <option value="producer_business">{getContractTypeLabel('producer_business')}</option>
            </>
          )}
        </select>
      </div>

      {/* Start Date */}
      <div>
        <label htmlFor="start-date" className="block text-sm font-medium text-foreground mb-2">
          <Calendar className="w-4 h-4 inline mr-1" />
          {t('contracts.form.startDate', 'Data început')}
        </label>
        <Input
          id="start-date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          className="w-full"
        />
      </div>

      {/* Duration */}
      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-foreground mb-2">
          {t('contracts.form.duration', 'Durată (luni)')}
        </label>
        <Input
          id="duration"
          type="number"
          min="1"
          max="120"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder={t('contracts.form.durationPlaceholder', 'ex: 12')}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground mt-1">
          {t('contracts.form.durationHint', 'Lăsat gol pentru contract fără termen')}
        </p>
      </div>

      {/* Commission Rate */}
      <div>
        <label htmlFor="commission-rate" className="block text-sm font-medium text-foreground mb-2">
          <DollarSign className="w-4 h-4 inline mr-1" />
          {t('contracts.form.commissionRate', 'Comision standard (%)')}
        </label>
        <Input
          id="commission-rate"
          type="number"
          min="0"
          max="100"
          step="0.01"
          value={commissionRate}
          onChange={(e) => setCommissionRate(e.target.value)}
          placeholder={t('contracts.form.commissionRatePlaceholder', 'ex: 10.5')}
          className="w-full"
        />
      </div>

      {/* Payment Terms */}
      <div>
        <label htmlFor="payment-terms" className="block text-sm font-medium text-foreground mb-2">
          {t('contracts.form.paymentTerms', 'Termeni de plată')}
        </label>
        <Input
          id="payment-terms"
          type="text"
          value={paymentTerms}
          onChange={(e) => setPaymentTerms(e.target.value)}
          placeholder={t('contracts.form.paymentTermsPlaceholder', 'ex: Net 30 zile')}
          className="w-full"
        />
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-foreground mb-2">
          {t('contracts.form.notes', 'Note (opțional)')}
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          placeholder={t('contracts.form.notesPlaceholder', 'Adaugă note sau observații...')}
        />
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-lg bg-muted/30 border border-border">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground mb-1 font-medium">
              {t('contracts.form.infoTitle', 'Informații importante')}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t(
                'contracts.form.infoDescription',
                'Acest formular creează un draft de contract. După creare, vei putea revizui și semna digital contractul când funcționalitatea va fi disponibilă.'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center gap-3 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              {t('common.processing', 'Se procesează...')}
            </>
          ) : (
            <>
              <FileCheck className="w-5 h-5 mr-2" />
              {t('contracts.form.createDraft', 'Creează draft')}
            </>
          )}
        </Button>
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose} size="lg">
            {t('common.cancel', 'Anulează')}
          </Button>
        )}
      </div>
    </form>
  )

  if (variant === 'modal') {
    return (
      <Card className="border border-border rounded-2xl shadow-lg bg-card max-w-2xl w-full mx-4">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              {t('contracts.generator.title', 'Generator Contract')}
            </h2>
          </div>
          {isLoadingTemplates ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">{t('common.loading', 'Se încarcă...')}</p>
            </div>
          ) : (
            content
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-border rounded-2xl shadow-sm bg-card">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <FileCheck className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            {t('contracts.generator.title', 'Generator Contract')}
          </h2>
        </div>
        {isLoadingTemplates ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">{t('common.loading', 'Se încarcă...')}</p>
          </div>
        ) : (
          content
        )}
      </CardContent>
    </Card>
  )
}

