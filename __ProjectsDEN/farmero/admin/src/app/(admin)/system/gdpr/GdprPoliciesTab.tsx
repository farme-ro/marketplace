'use client'

/**
 * GDPR Policies & Retention Tab Component
 * 
 * Tabel configurabil pentru politici de retenție
 */

import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, FileText } from 'lucide-react'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { getRetentionPolicies, type RetentionPolicy, type DataType } from '@/lib/api/gdpr'

export function GdprPoliciesTab() {
  const [policies, setPolicies] = useState<RetentionPolicy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPolicies()
  }, [])

  const loadPolicies = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getRetentionPolicies()
      setPolicies(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea politicilor')
    } finally {
      setLoading(false)
    }
  }

  const getDataTypeLabel = (type: DataType) => {
    const labels: Record<DataType, string> = {
      USERS: 'Utilizatori',
      ORDERS: 'Comenzi',
      JOURNAL: 'Jurnal',
      MARKETING: 'Marketing',
      PAYMENTS: 'Plăți',
    }
    return labels[type] || type
  }

  const getStatusColor = (status: 'COMPLIANT' | 'NEEDS_REVIEW') => {
    return status === 'COMPLIANT'
      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
  }

  const getStatusIcon = (status: 'COMPLIANT' | 'NEEDS_REVIEW') => {
    return status === 'COMPLIANT' ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <AlertCircle className="h-4 w-4 text-yellow-500" />
    )
  }

  const columns: Column<RetentionPolicy>[] = [
    {
      key: 'dataType',
      header: 'Tip date',
      render: (p) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{getDataTypeLabel(p.dataType)}</span>
        </div>
      ),
    },
    {
      key: 'retentionMonths',
      header: 'Retenție curentă',
      render: (p) => (
        <span className="text-sm text-foreground">{p.retentionMonths} luni</span>
      ),
    },
    {
      key: 'lastUpdated',
      header: 'Ultim update',
      render: (p) => (
        <span className="text-sm text-muted-foreground">
          {new Date(p.lastUpdated).toLocaleDateString('ro-RO')}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (p) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(p.status)}
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
              p.status
            )}`}
          >
            {p.status === 'COMPLIANT' ? 'Compliant' : 'Necesită revizuire'}
          </span>
        </div>
      ),
    },
    {
      key: 'notes',
      header: 'Note',
      render: (p) => (
        <span className="text-sm text-muted-foreground">{p.notes || '-'}</span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      {policies.length === 0 && !loading && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <p className="text-sm text-yellow-800 dark:text-yellow-400">
            Nu există politici de retenție disponibile. Endpoint-ul backend pentru politici nu este încă
            implementat.
          </p>
          <p className="mt-2 text-xs text-yellow-700 dark:text-yellow-500">
            Vezi <code>docs/ADMIN_BACKEND_GAPS.md</code> pentru detalii.
          </p>
        </div>
      )}

      <DataTable
        columns={columns}
        data={policies}
        loading={loading}
        emptyMessage="Nu există politici de retenție configurate."
      />
    </div>
  )
}

