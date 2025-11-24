'use client'

/**
 * GDPR History Tab Component
 * 
 * Timeline cronologic pentru cereri GDPR
 */

import { useState, useEffect, useCallback } from 'react'
import { Clock, User } from 'lucide-react'
import { DataTable, Pagination, type Column } from '@/components/ui/DataTable'
import { getGdprHistory, type GdprHistoryEntry } from '@/lib/api/gdpr'

export function GdprHistoryTab() {
  const [history, setHistory] = useState<GdprHistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [requestIdFilter, setRequestIdFilter] = useState('')

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getGdprHistory({
        requestId: requestIdFilter || undefined,
        page,
        limit: 20,
      })
      setHistory(response.data)
      setTotalPages(response.pagination.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea istoricului')
    } finally {
      setLoading(false)
    }
  }, [requestIdFilter, page])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      STATUS_CHANGED: 'Status schimbat',
      EXPORT_GENERATED: 'Export generat',
      REJECTED: 'Cerere respinsă',
      CREATED: 'Cerere creată',
      IN_PROGRESS: 'Marchează în procesare',
      COMPLETED: 'Marchează finalizată',
    }
    return labels[action] || action
  }

  const columns: Column<GdprHistoryEntry>[] = [
    {
      key: 'createdAt',
      header: 'Data & ora',
      render: (e) => (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-foreground">
            {new Date(e.createdAt).toLocaleString('ro-RO')}
          </span>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Acțiune',
      render: (e) => (
        <span className="text-sm font-medium text-foreground">{getActionLabel(e.action)}</span>
      ),
    },
    {
      key: 'performedBy',
      header: 'Efectuat de',
      render: (e) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="text-sm text-foreground">{e.performedBy.fullName}</div>
            <div className="text-xs text-muted-foreground">{e.performedBy.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'requestId',
      header: 'ID Cerere',
      render: (e) => (
        <span className="font-mono text-xs text-muted-foreground">{e.requestId.slice(0, 8)}...</span>
      ),
    },
    {
      key: 'details',
      header: 'Detalii',
      render: (e) => (
        <span className="text-sm text-muted-foreground">{e.details || '-'}</span>
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

      {history.length === 0 && !loading && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <p className="text-sm text-yellow-800 dark:text-yellow-400">
            Nu există istoric disponibil. Endpoint-ul backend pentru istoric GDPR nu este încă
            implementat.
          </p>
          <p className="mt-2 text-xs text-yellow-700 dark:text-yellow-500">
            Vezi <code>docs/ADMIN_BACKEND_GAPS.md</code> pentru detalii.
          </p>
        </div>
      )}

      {/* Filter */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-foreground">Filtrează după ID cerere:</label>
        <input
          type="text"
          placeholder="ID cerere..."
          value={requestIdFilter}
          onChange={(e) => {
            setRequestIdFilter(e.target.value)
            setPage(1)
          }}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      <DataTable
        columns={columns}
        data={history}
        loading={loading}
        emptyMessage="Nu am găsit istoric după criteriile alese."
      />

      {!loading && history.length > 0 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  )
}

