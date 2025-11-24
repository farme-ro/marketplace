/**
 * Contracts & Billing Page
 * 
 * Admin page for managing contract templates and invoices
 */

'use client'

import { useState, useEffect } from 'react'
import { FileText, Receipt, FileCheck, Plus } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AccessDenied } from '@/components/auth/AccessDenied'
import { useAdminAuth } from '@/lib/auth/admin-auth-context'
import { hasPermission } from '@/lib/permissions'
import { useAdminI18n } from '@/lib/i18n/context'
import { DataTable, Pagination, type Column } from '@/components/ui/DataTable'
import {
  getContractTemplates,
  getInvoices,
  type ContractTemplate,
  type Invoice,
} from '@/lib/api/contracts'

export default function ContractsPage() {
  const { admin } = useAdminAuth()
  const { t } = useAdminI18n()
  const [activeTab, setActiveTab] = useState<'templates' | 'invoices'>('templates')
  const [templates, setTemplates] = useState<ContractTemplate[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    templates: { page: 1, limit: 20, total: 0, totalPages: 0 },
    invoices: { page: 1, limit: 20, total: 0, totalPages: 0 },
  })

  const loadTemplates = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await getContractTemplates({
        page: pagination.templates.page,
        limit: pagination.templates.limit,
      })
      setTemplates(response.data)
      setPagination(prev => ({
        ...prev,
        templates: {
          ...prev.templates,
          total: response.pagination?.total || 0,
          totalPages: response.pagination?.totalPages || 1,
        },
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea template-urilor')
    } finally {
      setLoading(false)
    }
  }

  const loadInvoices = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await getInvoices({
        page: pagination.invoices.page,
        limit: pagination.invoices.limit,
      })
      setInvoices(response.data)
      setPagination(prev => ({
        ...prev,
        invoices: {
          ...prev.invoices,
          total: response.pagination?.total || 0,
          totalPages: response.pagination?.totalPages || 1,
        },
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea facturilor')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'templates') {
      loadTemplates()
    } else {
      loadInvoices()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, pagination.templates.page, pagination.invoices.page])

  // RBAC check - after all hooks
  const canView = hasPermission(admin, 'view_orders') || hasPermission(admin, 'view_finance')

  if (!canView) {
    return <AccessDenied requiredPermission="view_orders" />
  }

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      producer: 'Producător',
      client: 'Client',
      b2b: 'B2B',
      logistics: 'Logistică',
      general: 'General',
    }
    return labels[category] || category
  }

  const getStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      draft: 'Draft',
      issued: 'Emisă',
      paid: 'Plătită',
      cancelled: 'Anulată',
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      issued: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      paid: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    }
    return colors[status] || 'bg-muted text-muted-foreground'
  }

  const templateColumns: Column<ContractTemplate>[] = [
    {
      key: 'code',
      header: 'Cod',
      render: (template) => (
        <p className="font-mono text-sm font-medium text-foreground">{template.code}</p>
      ),
    },
    {
      key: 'name',
      header: 'Nume',
      render: (template) => (
        <p className="text-sm font-medium text-foreground">{template.name}</p>
      ),
    },
    {
      key: 'category',
      header: 'Categorie',
      render: (template) => (
        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-muted text-foreground">
          {getCategoryLabel(template.category)}
        </span>
      ),
    },
    {
      key: 'version',
      header: 'Versiune',
      render: (template) => (
        <p className="text-sm text-muted-foreground">v{template.version}</p>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (template) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            template.isActive
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
          }`}
        >
          {template.isActive ? 'Activ' : 'Inactiv'}
        </span>
      ),
    },
    {
      key: 'updatedAt',
      header: 'Actualizat',
      render: (template) => (
        <p className="text-sm text-muted-foreground">
          {new Date(template.updatedAt).toLocaleDateString('ro-RO')}
        </p>
      ),
    },
  ]

  const invoiceColumns: Column<Invoice>[] = [
    {
      key: 'invoiceNumber',
      header: 'Număr',
      render: (invoice) => (
        <p className="font-mono text-sm font-medium text-foreground">{invoice.invoiceNumber}</p>
      ),
    },
    {
      key: 'type',
      header: 'Tip',
      render: (invoice) => (
        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-muted text-foreground">
          {invoice.type === 'customer' ? 'Client' : invoice.type === 'producer' ? 'Producător' : 'B2B'}
        </span>
      ),
    },
    {
      key: 'client',
      header: 'Client/Producător',
      render: (invoice) => (
        <p className="text-sm text-foreground">
          {invoice.client?.fullName || invoice.producer?.name || '-'}
        </p>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Total',
      render: (invoice) => (
        <p className="text-sm font-medium text-foreground">
          {invoice.totalAmount.toFixed(2)} {invoice.currency}
        </p>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (invoice) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(invoice.status)}`}
        >
          {getStatusLabel(invoice.status)}
        </span>
      ),
    },
    {
      key: 'issuedAt',
      header: 'Emisă',
      render: (invoice) => (
        <p className="text-sm text-muted-foreground">
          {invoice.issuedAt ? new Date(invoice.issuedAt).toLocaleDateString('ro-RO') : '-'}
        </p>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {t('contracts.title', 'Contracte & Facturi')}
        </h1>
        <p className="text-muted-foreground">
          {t('contracts.subtitle', 'Gestionează template-uri de contracte și facturi')}
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Simple tab navigation */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'templates'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
            }`}
          >
            <FileText className="mr-2 h-4 w-4 inline" />
            {t('contracts.tabs.templates', 'Template-uri Contracte')}
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'invoices'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
            }`}
          >
            <Receipt className="mr-2 h-4 w-4 inline" />
            {t('contracts.tabs.invoices', 'Facturi')}
          </button>
        </nav>
      </div>

      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              {t('contracts.actions.createTemplate', 'Creează Template')}
            </button>
          </div>

          <DataTable
            data={templates}
            columns={templateColumns}
            loading={loading}
            emptyMessage={t('contracts.empty.templates', 'Nu există template-uri de contracte.')}
          />
          
          {pagination.templates.totalPages > 1 && (
            <Pagination
              page={pagination.templates.page}
              totalPages={pagination.templates.totalPages}
              onPageChange={(newPage) =>
                setPagination((prev) => ({
                  ...prev,
                  templates: { ...prev.templates, page: newPage },
                }))}
            />
          )}
        </div>
      )}

      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              {t('contracts.actions.createInvoice', 'Creează Factură')}
            </button>
          </div>

          <DataTable
            data={invoices}
            columns={invoiceColumns}
            loading={loading}
            emptyMessage={t('contracts.empty.invoices', 'Nu există facturi.')}
          />
          
          {pagination.invoices.totalPages > 1 && (
            <Pagination
              page={pagination.invoices.page}
              totalPages={pagination.invoices.totalPages}
              onPageChange={(newPage) =>
                setPagination((prev) => ({
                  ...prev,
                  invoices: { ...prev.invoices, page: newPage },
                }))}
            />
          )}
        </div>
      )}
    </div>
  )
}

