'use client'

/**
 * Commissions & Payout Summary Page
 * 
 * View commissions and payout summaries by producer
 */

import { useState, useEffect } from 'react'
import { Calendar, DollarSign, TrendingUp, AlertCircle } from 'lucide-react'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { AccessDenied } from '@/components/auth/AccessDenied'
import { useAdminAuth } from '@/lib/auth/admin-auth-context'
import { hasPermission } from '@/lib/permissions'
import {
  getCommissionsSummary,
  type CommissionSummary,
  type CommissionsSummaryResponse,
} from '@/lib/api/commerce'

export default function CommissionsPage() {
  const { admin } = useAdminAuth()
  
  const [summary, setSummary] = useState<CommissionsSummaryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filters
  const [startDate, setStartDate] = useState(() => {
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    return firstDayOfMonth.toISOString().split('T')[0]
  })
  const [endDate, setEndDate] = useState(() => {
    const now = new Date()
    return now.toISOString().split('T')[0]
  })

  const loadSummary = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getCommissionsSummary({
        from: startDate ? new Date(startDate).toISOString() : undefined,
        to: endDate ? new Date(endDate + 'T23:59:59').toISOString() : undefined,
      })
      setSummary(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea comisioanelor')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSummary()
  }, [startDate, endDate])

  // RBAC check
  const canView = hasPermission(admin, 'view_financials') || hasPermission(admin, 'view_finance')
  
  if (!canView) {
    return <AccessDenied requiredPermission="view_financials" />
  }

  const columns: Column<CommissionSummary>[] = [
    {
      key: 'producerName',
      header: 'Producător',
      render: (c) => <div className="font-medium">{c.producerName}</div>,
    },
    {
      key: 'totalSales',
      header: 'Total Vânzări',
      render: (c) => (
        <span className="font-medium">
          {parseFloat(c.totalSales).toFixed(2)} RON
        </span>
      ),
    },
    {
      key: 'totalCommissions',
      header: 'Total Comisioane',
      render: (c) => (
        <span className="font-medium text-orange-600 dark:text-orange-400">
          {parseFloat(c.totalCommissions).toFixed(2)} RON
        </span>
      ),
    },
    {
      key: 'netPayout',
      header: 'Net Payout',
      render: (c) => (
        <span className="font-medium text-green-600 dark:text-green-400">
          {parseFloat(c.netPayout).toFixed(2)} RON
        </span>
      ),
    },
    {
      key: 'payoutStatus',
      header: 'Status Payout',
      render: (c) => {
        const isPaid = c.payoutStatus === 'paid'
        return (
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
              isPaid
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
            }`}
          >
            {isPaid ? 'Plătit' : 'În așteptare'}
          </span>
        )
      },
    },
    {
      key: 'commissionCount',
      header: 'Nr. Comisioane',
      render: (c) => (
        <span className="text-sm text-muted-foreground">{c.commissionCount}</span>
      ),
    },
  ]

  // Check if backend endpoint is available
  const isBackendAvailable = summary && (summary.byProducer.length > 0 || !loading)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Comisioane & Payout</h1>
        <p className="text-muted-foreground">Rezumat comisioane și payout-uri producători</p>
      </div>

      {/* Backend not available message */}
      {!isBackendAvailable && !loading && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <p className="text-sm text-yellow-800 dark:text-yellow-400">
            Modulul de comisioane nu este încă conectat la backend. Vezi{' '}
            <code className="rounded bg-yellow-100 px-1 py-0.5 text-xs dark:bg-yellow-900/40">
              docs/ADMIN_BACKEND_GAPS.md
            </code>{' '}
            pentru detalii despre endpoint-urile necesare.
          </p>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-lg border border-border bg-muted/50 p-4">
        <div className="mb-4 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Filtrare perioadă</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">De la:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value)
              }}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Până la:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value)
              }}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <button
            onClick={loadSummary}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Actualizează
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {summary && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total GMV</div>
                <div className="text-2xl font-bold">
                  {parseFloat(summary.summary.totalGMV).toFixed(2)} RON
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900/20">
                <DollarSign className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Comisioane</div>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {parseFloat(summary.summary.totalCommissions).toFixed(2)} RON
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Payout Due</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {parseFloat(summary.summary.totalPayoutDue).toFixed(2)} RON
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Period Info */}
      {summary && (
        <div className="rounded-lg border border-border bg-muted/50 p-4">
          <div className="text-sm text-muted-foreground">
            Perioadă:{' '}
            {new Date(summary.summary.period.from).toLocaleDateString('ro-RO')} -{' '}
            {new Date(summary.summary.period.to).toLocaleDateString('ro-RO')}
          </div>
        </div>
      )}

      {/* Commissions by Producer Table */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Comisioane pe producător
        </h2>
        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-farmero-olive border-r-transparent"></div>
            Se încarcă...
          </div>
        ) : summary && summary.byProducer.length > 0 ? (
          <DataTable
            columns={columns}
            data={summary.byProducer.map(item => ({ ...item, id: item.producerId }))}
            loading={false}
            emptyMessage="Nu sunt comisioane pentru această perioadă."
          />
        ) : (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <p className="text-sm text-yellow-800 dark:text-yellow-400">
                Nu sunt date disponibile pentru această perioadă sau endpoint-ul backend nu este
                implementat.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

