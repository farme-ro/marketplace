'use client'

/**
 * Users Management Page
 * 
 * List users with filters, search, and suspend/reactivate actions
 */

import { useState, useEffect } from 'react'
import { Search, Filter } from 'lucide-react'
import { DataTable, Pagination, type Column } from '@/components/ui/DataTable'
import { Drawer } from '@/components/ui/Drawer'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { AccessDenied } from '@/components/auth/AccessDenied'
import { getUsers, getUser, updateUser } from '@/lib/api/admin'
import { useAdminAuth } from '@/lib/auth/admin-auth-context'
import { hasPermission } from '@/lib/permissions'
import { logAdminAction } from '@/lib/utils/admin-audit'
import type { UserSummary, UserDetail } from '@/lib/api/admin'

type UserRole = 'ADMIN' | 'PRODUCER' | 'CUSTOMER' | 'all'

export default function UsersPage() {
  const { admin } = useAdminAuth()
  const [users, setUsers] = useState<UserSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    title: string
    message: string
    onConfirm: (reason?: string) => void
    requireReason?: boolean
    reasonLabel?: string
    reasonPlaceholder?: string
  }>({ 
    open: false, 
    title: '', 
    message: '', 
    onConfirm: () => {},
    requireReason: false,
  })

  // Filters
  const [roleFilter, setRoleFilter] = useState<UserRole>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getUsers({
        role: roleFilter !== 'all' ? roleFilter : undefined,
        search: searchQuery || undefined,
        page,
        limit: 20,
      })
      setUsers(response.users)
      setTotalPages(response.pagination.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea utilizatorilor')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter, page])

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      if (searchQuery || roleFilter !== 'all') {
        setPage(1)
        loadUsers()
      }
    }, 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  // RBAC checks - after all hooks
  const canView = hasPermission(admin, 'view_users')
  const canManage = hasPermission(admin, 'manage_users')

  // Show access denied if no view permission
  if (!canView) {
    return <AccessDenied requiredPermission="view_users" />
  }

  const handleRowClick = async (user: UserSummary) => {
    try {
      const detail = await getUser(user.id)
      setSelectedUser(detail)
      setDrawerOpen(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea detaliilor')
    }
  }

  const handleSuspend = async () => {
    if (!selectedUser || !canManage) return

    setConfirmDialog({
      open: true,
      title: 'Suspendă utilizator',
      message: `Ești sigur că vrei să suspendezi utilizatorul "${selectedUser.fullName}"?`,
      requireReason: true,
      reasonLabel: 'Motiv suspendare',
      reasonPlaceholder: 'Introduceți motivul suspendării utilizatorului...',
      onConfirm: async (reason?: string) => {
        try {
          // TODO: Backend needs PATCH /admin/users/:id/status endpoint
          // For now, we'll document this in ADMIN_BACKEND_GAPS.md
          // await updateUserStatus(selectedUser.id, { status: 'SUSPENDED' })
          
          // Log audit action even if backend endpoint doesn't exist yet
          await logAdminAction({
            action: 'USER_SUSPENDED',
            targetType: 'user',
            targetId: selectedUser.id,
            reason: reason || undefined,
            metadata: {
              userEmail: selectedUser.email,
              userRole: selectedUser.role,
            },
          }, admin)
          
          setError('Funcționalitatea de suspendare necesită endpoint-ul PATCH /admin/users/:id/status')
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Eroare la suspendare')
        }
      },
    })
  }

  const handleReactivate = async () => {
    if (!selectedUser || !canManage) return

    setConfirmDialog({
      open: true,
      title: 'Reactivează utilizator',
      message: `Ești sigur că vrei să reactivezi utilizatorul "${selectedUser.fullName}"?`,
      requireReason: false, // Reactivate doesn't require reason
      onConfirm: async (reason?: string) => {
        try {
          // TODO: Backend needs PATCH /admin/users/:id/status endpoint
          // await updateUserStatus(selectedUser.id, { status: 'ACTIVE' })
          
          // Log audit action
          await logAdminAction({
            action: 'USER_REACTIVATED',
            targetType: 'user',
            targetId: selectedUser.id,
            reason: reason || undefined,
            metadata: {
              userEmail: selectedUser.email,
              userRole: selectedUser.role,
            },
          }, admin)
          
          setError('Funcționalitatea de reactivare necesită endpoint-ul PATCH /admin/users/:id/status')
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Eroare la reactivare')
        }
      },
    })
  }

  const columns: Column<UserSummary>[] = [
    {
      key: 'fullName',
      header: 'Nume',
      render: (u) => (
        <div>
          <div className="font-medium">{u.fullName}</div>
          <div className="text-xs text-muted-foreground">{u.email}</div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Rol',
      render: (u) => {
        const roleLabels = {
          ADMIN: 'Admin',
          PRODUCER: 'Producător',
          CUSTOMER: 'Client',
        }
        return (
          <span className="inline-flex rounded-full bg-muted px-2 py-1 text-xs font-medium">
            {roleLabels[u.role]}
          </span>
        )
      },
    },
    {
      key: 'producer',
      header: 'Producător',
      render: (u) => u.producer?.name || '-',
    },
    {
      key: 'createdAt',
      header: 'Data înregistrării',
      render: (u) => new Date(u.createdAt).toLocaleDateString('ro-RO'),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Utilizatori</h1>
        <p className="text-muted-foreground">Gestionare utilizatori</p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Caută după nume sau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value as UserRole)
                setPage(1)
              }}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">Toate rolurile</option>
              <option value="ADMIN">Admin</option>
              <option value="PRODUCER">Producător</option>
              <option value="CUSTOMER">Client</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={users}
        onRowClick={handleRowClick}
        loading={loading}
        emptyMessage="Nu am găsit niciun utilizator după criteriile alese."
      />

      {/* Pagination */}
      {!loading && users.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Detail Drawer */}
      {selectedUser && (
        <Drawer
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false)
            setSelectedUser(null)
          }}
          title={selectedUser.fullName}
        >
          <div className="space-y-6">
            {/* User Info */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                Informații utilizator
              </h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Email</dt>
                  <dd className="text-sm text-foreground">{selectedUser.email}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Rol</dt>
                  <dd className="text-sm text-foreground">{selectedUser.role}</dd>
                </div>
                {selectedUser.producer && (
                  <div>
                    <dt className="text-xs font-medium text-muted-foreground">
                      Producător
                    </dt>
                    <dd className="text-sm text-foreground">
                      {selectedUser.producer.name} ({selectedUser.producer.status})
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">
                    Data înregistrării
                  </dt>
                  <dd className="text-sm text-foreground">
                    {new Date(selectedUser.createdAt).toLocaleDateString('ro-RO')}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Stats */}
            {(selectedUser.orders || selectedUser.carts) && (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">Statistici</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedUser.orders && (
                    <div className="rounded-lg border border-border bg-muted/50 p-3">
                      <div className="text-xs text-muted-foreground">Comenzi</div>
                      <div className="text-lg font-semibold">
                        {selectedUser.orders.length}
                      </div>
                    </div>
                  )}
                  {selectedUser.carts && (
                    <div className="rounded-lg border border-border bg-muted/50 p-3">
                      <div className="text-xs text-muted-foreground">Coșuri active</div>
                      <div className="text-lg font-semibold">
                        {selectedUser.carts.length}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Moderation Actions */}
            {canManage && (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">Acțiuni</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleSuspend}
                    className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                  >
                    Suspendă utilizator
                  </button>
                  <button
                    onClick={handleReactivate}
                    className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                  >
                    Reactivează utilizator
                  </button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Notă: Funcționalitatea de suspendare/reactivare necesită endpoint-ul{' '}
                  <code>PATCH /admin/users/:id/status</code> (vezi{' '}
                  <code>docs/ADMIN_BACKEND_GAPS.md</code>).
                </p>
              </div>
            )}
          </div>
        </Drawer>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Confirmă"
        cancelText="Anulează"
        requireReason={confirmDialog.requireReason}
        reasonLabel={confirmDialog.reasonLabel}
        reasonPlaceholder={confirmDialog.reasonPlaceholder}
      />
    </div>
  )
}
