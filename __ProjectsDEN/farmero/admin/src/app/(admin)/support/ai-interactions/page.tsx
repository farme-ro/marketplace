/**
 * AI Interactions Monitor Page
 * 
 * Admin page for monitoring AI Assistant interactions
 */

'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Search, Filter, Clock } from 'lucide-react'
import { DataTable, Pagination, type Column } from '@/components/ui/DataTable'
import { AccessDenied } from '@/components/auth/AccessDenied'
import { useAdminAuth } from '@/lib/auth/admin-auth-context'
import { hasPermission, hasAnyPermission } from '@/lib/permissions'
import { getAiInteractions, type AiInteraction, type AiRole } from '@/lib/api/ai-assistant'
import { useAdminI18n } from '@/lib/i18n/context'

export default function AiInteractionsPage() {
  const { admin } = useAdminAuth()
  const { t } = useAdminI18n()
  const [interactions, setInteractions] = useState<AiInteraction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<AiRole | ''>('')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  })

  const loadInteractions = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await getAiInteractions({
        role: roleFilter || undefined,
        search: search || undefined,
        page: pagination.page,
        limit: pagination.limit,
      })

      setInteractions(response.data)
      setPagination((prev) => ({
        ...prev,
        total: response.pagination.total,
        totalPages: response.pagination.totalPages,
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea interacțiunilor')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInteractions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, search, roleFilter])

  // RBAC checks - after hooks
  const canView =
    hasPermission(admin, 'view_support') ||
    hasAnyPermission(admin, ['view_support', 'view_users', 'view_marketing'])

  if (!canView) {
    return <AccessDenied requiredPermission="view_support" />
  }

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }))
    loadInteractions()
  }

  const getRoleLabel = (role: AiRole): string => {
    const labels: Record<AiRole, string> = {
      client: 'Client',
      producer: 'Producător',
      support: 'Support',
      admin: 'Admin',
    }
    return labels[role] || role
  }

  const getRoleColor = (role: AiRole): string => {
    const colors: Record<AiRole, string> = {
      client: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      producer: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      support: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      admin: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    }
    return colors[role] || 'bg-muted text-muted-foreground'
  }

  const columns: Column<AiInteraction>[] = [
    {
      key: 'user',
      header: 'Utilizator',
      render: (interaction) => (
        <div>
          <p className="text-sm font-medium text-foreground">
            {interaction.userId ? `ID: ${interaction.userId.substring(0, 8)}...` : 'Anonim'}
          </p>
          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getRoleColor(interaction.role)}`}>
            {getRoleLabel(interaction.role)}
          </span>
        </div>
      ),
    },
    {
      key: 'question',
      header: 'Întrebare',
      render: (interaction) => (
        <p className="max-w-md truncate text-sm text-foreground" title={interaction.question}>
          {interaction.question}
        </p>
      ),
    },
    {
      key: 'answer',
      header: 'Răspuns',
      render: (interaction) => (
        <p className="max-w-md truncate text-sm text-muted-foreground" title={interaction.answer}>
          {interaction.answer}
        </p>
      ),
    },
    {
      key: 'suggestedLinks',
      header: 'Link-uri sugerate',
      render: (interaction) => (
        <div className="flex flex-wrap gap-1">
          {interaction.suggestedLinks && interaction.suggestedLinks.length > 0 ? (
            interaction.suggestedLinks.map((link, idx) => (
              <span
                key={idx}
                className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
              >
                {link.label}
              </span>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">-</span>
          )}
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Data',
      render: (interaction) => (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          {new Date(interaction.createdAt).toLocaleString('ro-RO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">AI Interactions Monitor</h1>
        <p className="text-muted-foreground">
          Monitorizează interacțiunile cu AI Assistant pentru a îmbunătăți răspunsurile
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 md:flex-row md:items-center">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Caută în întrebări/răspunsuri..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full rounded-md border border-border bg-background pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value as AiRole | '')
              setPagination((prev) => ({ ...prev, page: 1 }))
            }}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Toate rolurile</option>
            <option value="client">Client</option>
            <option value="producer">Producător</option>
            <option value="support">Support</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          onClick={handleSearch}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Caută
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Table */}
      <DataTable
        data={interactions}
        columns={columns}
        loading={loading}
        emptyMessage="Nu există interacțiuni AI înregistrate."
      />
      
      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={(newPage) => setPagination((prev) => ({ ...prev, page: newPage }))}
        />
      )}
    </div>
  )
}

