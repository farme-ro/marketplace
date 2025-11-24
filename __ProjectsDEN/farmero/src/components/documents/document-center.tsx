/**
 * Document Center Component
 * 
 * Unified component for displaying and managing documents
 * Used across producer-portal, business-portal, and logistics-portal
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, Button } from 'farme-ui'
import { useI18n } from '@/lib/i18n/context'
import { getDocumentsForCurrentUser } from '@/lib/api/documents'
import type { DomainDocument, DocumentType, DocumentStatus } from '@/lib/types/domain'
import {
  FileText,
  FileCheck,
  Receipt,
  Package,
  Truck,
  Download,
  Eye,
  Calendar,
  Filter,
  X,
} from 'lucide-react'
import { formatDate } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'

interface DocumentCenterProps {
  /**
   * Filter documents by type (optional)
   */
  filterByType?: DocumentType[]
  /**
   * Filter documents by status (optional)
   */
  filterByStatus?: DocumentStatus[]
  /**
   * Show empty state message
   */
  emptyStateMessage?: string
  /**
   * Show filters UI
   */
  showFilters?: boolean
}

export function DocumentCenter({
  filterByType,
  filterByStatus,
  emptyStateMessage,
  showFilters = true,
}: DocumentCenterProps) {
  const { t, locale } = useI18n()
  const [documents, setDocuments] = useState<DomainDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<DocumentType | 'all'>('all')
  const [selectedStatus, setSelectedStatus] = useState<DocumentStatus | 'all'>('all')
  const [selectedDocument, setSelectedDocument] = useState<DomainDocument | null>(null)

  useEffect(() => {
    async function loadDocuments() {
      try {
        setIsLoading(true)
        const data = await getDocumentsForCurrentUser()
        setDocuments(data)
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('[DocumentCenter] Failed to load documents:', error)
        }
        setDocuments([])
      } finally {
        setIsLoading(false)
      }
    }

    loadDocuments()
  }, [])

  const getDocumentIcon = (type: DocumentType) => {
    switch (type) {
      case 'contract':
        return FileCheck
      case 'invoice':
        return Receipt
      case 'statement':
        return FileText
      case 'delivery_note':
        return Package
      case 'awb':
        return Truck
      default:
        return FileText
    }
  }

  const getDocumentTypeLabel = (type: DocumentType) => {
    return t(`documents.types.${type}`, {
      contract: 'Contract',
      invoice: 'Factură',
      statement: 'Extras',
      delivery_note: 'Aviz de însoțire',
      awb: 'AWB',
      other: 'Alt document',
    }[type] || 'Document')
  }

  const getStatusBadge = (status: DocumentStatus) => {
    const statusConfig = {
      draft: { label: t('documents.status.draft', 'Draft'), className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
      pending: { label: t('documents.status.pending', 'În așteptare'), className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
      active: { label: t('documents.status.active', 'Activ'), className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
      expired: { label: t('documents.status.expired', 'Expirat'), className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
      cancelled: { label: t('documents.status.cancelled', 'Anulat'), className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
      signed: { label: t('documents.status.signed', 'Semnat'), className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    }

    const config = statusConfig[status] || statusConfig.draft

    return (
      <span className={cn('inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium', config.className)}>
        {config.label}
      </span>
    )
  }

  // Filter documents
  const filteredDocuments = documents.filter((doc) => {
    if (selectedType !== 'all' && doc.type !== selectedType) return false
    if (selectedStatus !== 'all' && doc.status !== selectedStatus) return false
    if (filterByType && !filterByType.includes(doc.type)) return false
    if (filterByStatus && !filterByStatus.includes(doc.status)) return false
    return true
  })

  const documentTypes: DocumentType[] = ['contract', 'invoice', 'statement', 'delivery_note', 'awb', 'other']
  const documentStatuses: DocumentStatus[] = ['draft', 'pending', 'active', 'expired', 'cancelled', 'signed']

  if (isLoading) {
    return (
      <Card className="border border-border rounded-2xl shadow-sm bg-card">
        <CardContent className="p-6">
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">{t('common.loading', 'Se încarcă...')}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (filteredDocuments.length === 0) {
    return (
      <Card className="border border-border rounded-2xl shadow-sm bg-card">
        <CardContent className="p-6">
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-base text-foreground mb-2 font-medium">
              {emptyStateMessage || t('documents.empty', 'Nu ai documente încă')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t(
                'documents.emptyDescription',
                'În curând vei găsi aici contractele și documentele tale oficiale.'
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      {showFilters && (
        <Card className="border border-border rounded-2xl shadow-sm bg-card">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {t('documents.filters', 'Filtrează')}:
                </span>
              </div>

              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as DocumentType | 'all')}
                className="px-3 py-1.5 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">{t('documents.filters.allTypes', 'Toate tipurile')}</option>
                {documentTypes.map((type) => (
                  <option key={type} value={type}>
                    {getDocumentTypeLabel(type)}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as DocumentStatus | 'all')}
                className="px-3 py-1.5 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">{t('documents.filters.allStatuses', 'Toate statusurile')}</option>
                {documentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {t(`documents.status.${status}`, status)}
                  </option>
                ))}
              </select>

              {/* Clear Filters */}
              {(selectedType !== 'all' || selectedStatus !== 'all') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedType('all')
                    setSelectedStatus('all')
                  }}
                >
                  <X className="w-4 h-4 mr-1" />
                  {t('documents.filters.clear', 'Resetează')}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documents List */}
      <div className="space-y-3">
        {filteredDocuments.map((document) => {
          const Icon = getDocumentIcon(document.type)
          return (
            <Card key={document.id} className="border border-border rounded-2xl shadow-sm bg-card hover:shadow-md transition-shadow">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className={cn('text-base font-semibold text-foreground', 'mb-1')}>{document.title}</h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-muted-foreground">
                            {getDocumentTypeLabel(document.type)}
                          </span>
                          {getStatusBadge(document.status)}
                          {document.createdAt && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              {formatDate(document.createdAt, locale, { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {document.downloadUrl && (
                      <a href={document.downloadUrl} download>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          {t('common.download', 'Descarcă')}
                        </Button>
                      </a>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDocument(document)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {t('common.viewDetails', 'Vezi detalii')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Document Details Modal/Drawer */}
      {selectedDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelectedDocument(null)}>
          <Card
            className="max-w-2xl w-full mx-4 border border-border rounded-2xl shadow-lg bg-card"
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-bold text-foreground">{selectedDocument.title}</h2>
                <Button variant="ghost" size="sm" onClick={() => setSelectedDocument(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {t('documents.details.type', 'Tip')}:
                  </span>
                  <p className="text-foreground">{getDocumentTypeLabel(selectedDocument.type)}</p>
                </div>

                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {t('documents.details.status', 'Status')}:
                  </span>
                  <div className="mt-1">{getStatusBadge(selectedDocument.status)}</div>
                </div>

                {selectedDocument.createdAt && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      {t('documents.details.createdAt', 'Creat la')}:
                    </span>
                    <p className="text-foreground">
                      {formatDate(selectedDocument.createdAt, locale, {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                )}

                {selectedDocument.parties && selectedDocument.parties.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      {t('documents.details.parties', 'Părți implicate')}:
                    </span>
                    <p className="text-foreground">
                      {selectedDocument.parties.map((party) => t(`documents.parties.${party}`, party)).join(', ')}
                    </p>
                  </div>
                )}

                {selectedDocument.metadata && Object.keys(selectedDocument.metadata).length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      {t('documents.details.metadata', 'Detalii suplimentare')}:
                    </span>
                    <pre className="mt-2 p-3 bg-muted rounded-lg text-xs text-foreground overflow-auto">
                      {JSON.stringify(selectedDocument.metadata, null, 2)}
                    </pre>
                  </div>
                )}

                {selectedDocument.downloadUrl && (
                  <div className="pt-4 border-t border-border">
                    <a href={selectedDocument.downloadUrl} download className="w-full">
                      <Button className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        {t('common.download', 'Descarcă document')}
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

