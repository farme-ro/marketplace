'use client'

/**
 * Support Users Search Hub
 * 
 * Search and navigate to user 360° view
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { DataTable, Pagination, type Column } from '@/components/ui/DataTable'
import { AccessDenied } from '@/components/auth/AccessDenied'
import { useAdminAuth } from '@/lib/auth/admin-auth-context'
import { hasPermission, hasAnyPermission } from '@/lib/permissions'
import { searchUsers } from '@/lib/api/support'

export default function SupportUsersPage() {
  const { admin } = useAdminAuth()
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await searchUsers({
        query: searchQuery,
        page,
        limit: 20,
      })
      setUsers(response.data)
      setTotalPages(response.pagination.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la căutare')
    } finally {
      setLoading(false)
    }
  }

  const handleUserClick = (user: any) => {
    router.push(`/support/users/${user.id}`)
  }

  const columns: Column<any>[] = [
    {
      key: 'id',
      header: 'ID',
      render: (u) => <span className="font-mono text-xs">{u.id.slice(0, 8)}...</span>,
    },
    {
      key: 'email',
      header: 'Email',
      render: (u) => <span className="text-foreground">{u.email}</span>,
    },
    {
      key: 'fullName',
      header: 'Nume',
      render: (u) => <span className="text-foreground">{u.fullName || '-'}</span>,
    },
    {
      key: 'role',
      header: 'Rol',
      render: (u) => <span className="text-sm text-foreground">{u.role || '-'}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (u) => (
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
            u.status === 'active'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
          }`}
        >
          {u.status || 'active'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Data creare',
      render: (u) => (
        <span className="text-sm text-muted-foreground">
          {u.createdAt ? new Date(u.createdAt).toLocaleDateString('ro-RO') : '-'}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Utilizatori & Timeline</h1>
        <p className="text-muted-foreground">Căutare utilizatori pentru vedere 360°</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Caută după email, nume sau ID..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setPage(1)
          }}
          className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      {searchQuery && (
        <>
          <DataTable
            columns={columns}
            data={users}
            loading={loading}
            onRowClick={handleUserClick}
            emptyMessage="Nu am găsit utilizatori după criteriile alese."
          />

          {!loading && users.length > 0 && (
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          )}
        </>
      )}

      {!searchQuery && (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">
            Introdu un email, nume sau ID pentru a căuta utilizatori.
          </p>
        </div>
      )}
    </div>
  )
}

