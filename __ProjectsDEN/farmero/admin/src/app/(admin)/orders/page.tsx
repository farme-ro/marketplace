'use client'

/**
 * Orders Management Page
 * 
 * List orders with filters, search, and refund/cancel actions
 */

import { useState, useEffect } from 'react'
import { Search, Filter, Calendar } from 'lucide-react'
import { DataTable, Pagination, type Column } from '@/components/ui/DataTable'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { AccessDenied } from '@/components/auth/AccessDenied'
import { getOrders, getOrder, updateOrder } from '@/lib/api/admin'
import { useAdminAuth } from '@/lib/auth/admin-auth-context'
import { hasPermission, hasAnyPermission } from '@/lib/permissions'
import { logAdminAction } from '@/lib/utils/admin-audit'
import type { OrderSummary, OrderDetail } from '@/lib/api/admin'

type OrderStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELED'
  | 'REFUNDED'
  | 'all'

export default function OrdersPage() {
  const { admin } = useAdminAuth()
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
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
  const [statusFilter, setStatusFilter] = useState<OrderStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [producerSearch, setProducerSearch] = useState('')
  const [clientEmailSearch, setClientEmailSearch] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getOrders({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        dateFrom: startDate || undefined,
        dateTo: endDate || undefined,
        clientEmail: clientEmailSearch || undefined,
        search: searchQuery || producerSearch || undefined,
        page,
        limit: 20,
      })
      setOrders(response.orders)
      setTotalPages(response.pagination.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea comenzilor')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, startDate, endDate, producerSearch, clientEmailSearch, page])

  // RBAC checks - after hooks
  const canView = hasPermission(admin, 'view_orders')
  const canRefund = hasPermission(admin, 'refund_orders')
  const canCancel = hasPermission(admin, 'cancel_orders')
  const canManageFinancials = hasAnyPermission(admin, ['refund_orders', 'cancel_orders'])

  // Show access denied if no view permission
  if (!canView) {
    return <AccessDenied requiredPermission="view_orders" />
  }

  const handleRowClick = async (order: OrderSummary) => {
    try {
      const detail = await getOrder(order.id)
      setSelectedOrder(detail)
      setModalOpen(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea detaliilor')
    }
  }

  const handleRefund = async () => {
    if (!selectedOrder || !canRefund) return

    setConfirmDialog({
      open: true,
      title: 'Marchează ca refundat',
      message: `Ești sigur că vrei să marchezi comanda #${selectedOrder.id.slice(0, 8)} ca refundată?`,
      requireReason: true,
      reasonLabel: 'Motiv refundare',
      reasonPlaceholder: 'Introduceți motivul refundării comenzii...',
      onConfirm: async (reason?: string) => {
        try {
          await updateOrder(selectedOrder.id, { status: 'REFUNDED' })
          
          // Log audit action
          await logAdminAction({
            action: 'ORDER_REFUNDED',
            targetType: 'order',
            targetId: selectedOrder.id,
            reason: reason || undefined,
            metadata: {
              orderTotal: selectedOrder.totalAmount,
              customerId: selectedOrder.customerId,
              previousStatus: selectedOrder.status,
            },
          }, admin)
          
          await loadOrders()
          if (selectedOrder) {
            const updated = await getOrder(selectedOrder.id)
            setSelectedOrder(updated)
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Eroare la actualizare')
        }
      },
    })
  }

  const handleCancel = async () => {
    if (!selectedOrder || !canCancel) return

    setConfirmDialog({
      open: true,
      title: 'Anulează comandă',
      message: `Ești sigur că vrei să anulezi comanda #${selectedOrder.id.slice(0, 8)}?`,
      requireReason: true,
      reasonLabel: 'Motiv anulare',
      reasonPlaceholder: 'Introduceți motivul anulării comenzii...',
      onConfirm: async (reason?: string) => {
        try {
          await updateOrder(selectedOrder.id, { status: 'CANCELED' })
          
          // Log audit action
          await logAdminAction({
            action: 'ORDER_CANCELED',
            targetType: 'order',
            targetId: selectedOrder.id,
            reason: reason || undefined,
            metadata: {
              orderTotal: selectedOrder.totalAmount,
              customerId: selectedOrder.customerId,
              previousStatus: selectedOrder.status,
            },
          }, admin)
          
          await loadOrders()
          if (selectedOrder) {
            const updated = await getOrder(selectedOrder.id)
            setSelectedOrder(updated)
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Eroare la actualizare')
        }
      },
    })
  }

  // Filter orders by search query (client-side)
  const filteredOrders = orders.filter((o) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      o.id.toLowerCase().includes(query) ||
      o.customer?.email.toLowerCase().includes(query) ||
      o.customer?.fullName.toLowerCase().includes(query) ||
      o.vendors?.some((v) => v.producer.name.toLowerCase().includes(query))
    )
  })

  const columns: Column<OrderSummary>[] = [
    {
      key: 'id',
      header: 'ID Comandă',
      render: (o) => (
        <span className="font-mono text-xs">{o.id.slice(0, 8)}...</span>
      ),
    },
    {
      key: 'customer',
      header: 'Client',
      render: (o) => (
        <div>
          <div className="font-medium">{o.customer?.fullName || '-'}</div>
          <div className="text-xs text-muted-foreground">
            {o.customer?.email || '-'}
          </div>
        </div>
      ),
    },
    {
      key: 'vendors',
      header: 'Producător',
      render: (o) => (
        <div>
          {o.vendors && o.vendors.length > 0 ? (
            <span className="text-sm">
              {o.vendors.map((v) => v.producer.name).join(', ')}
            </span>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (o) => {
        const statusLabels: Record<string, string> = {
          NEW: 'Nouă',
          PLACED: 'Plasată',
          CONFIRMED: 'Confirmată',
          PREPARING: 'În pregătire',
          SHIPPED: 'Expediată',
          DELIVERED: 'Livrată',
          CANCELED: 'Anulată',
          REFUNDED: 'Rambursată',
        }
        const statusColors: Record<string, string> = {
          NEW: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
          PLACED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
          CONFIRMED: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
          PREPARING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
          SHIPPED: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
          DELIVERED: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
          CANCELED: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
          REFUNDED: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
        }
        return (
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
              statusColors[o.status] || 'bg-muted text-muted-foreground'
            }`}
          >
            {statusLabels[o.status] || o.status}
          </span>
        )
      },
    },
    {
      key: 'paymentMethod',
      header: 'Plată',
      render: (o) => (
        <span className="text-sm text-muted-foreground">
          {o.paymentMethod || '-'}
        </span>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Total',
      render: (o) => (
        <div>
          <span className="font-medium">
            {parseFloat(o.totalAmount).toFixed(2)} RON
          </span>
          {o.commissionAmount && (
            <div className="text-xs text-muted-foreground">
              Comision: {parseFloat(o.commissionAmount).toFixed(2)} RON
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Data',
      render: (o) => new Date(o.createdAt).toLocaleDateString('ro-RO'),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Comenzi</h1>
        <p className="text-muted-foreground">Gestionare comenzi</p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="space-y-4 rounded-lg border border-border bg-muted/50 p-4">
        <h3 className="text-sm font-semibold text-foreground">Filtre</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Caută după ID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(1)
              }}
              className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          {/* Producer Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Caută după producător..."
              value={producerSearch}
              onChange={(e) => {
                setProducerSearch(e.target.value)
                setPage(1)
              }}
              className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          {/* Client Email Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Caută după email client..."
              value={clientEmailSearch}
              onChange={(e) => {
                setClientEmailSearch(e.target.value)
                setPage(1)
              }}
              className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as OrderStatus)
                setPage(1)
              }}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">Toate statusurile</option>
              <option value="PLACED">Plasată</option>
              <option value="CONFIRMED">Confirmată</option>
              <option value="PREPARING">În pregătire</option>
              <option value="SHIPPED">Expediată</option>
              <option value="DELIVERED">Livrată</option>
              <option value="CANCELED">Anulată</option>
              <option value="REFUNDED">Rambursată</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value)
                setPage(1)
              }}
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <span className="text-sm text-muted-foreground">-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value)
                setPage(1)
              }}
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setStatusFilter('all')
                setSearchQuery('')
                setProducerSearch('')
                setClientEmailSearch('')
                setStartDate('')
                setEndDate('')
                setPage(1)
              }}
              className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
            >
              Șterge filtre
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredOrders}
        onRowClick={handleRowClick}
        loading={loading}
        emptyMessage="Nu am găsit nicio comandă după criteriile alese."
      />

      {/* Pagination */}
      {!loading && filteredOrders.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Detail Modal */}
      {selectedOrder && (
        <Modal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false)
            setSelectedOrder(null)
          }}
          title={`Comandă #${selectedOrder.id.slice(0, 8)}`}
          size="xl"
        >
          <div className="space-y-6">
            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="mb-2 text-sm font-semibold text-foreground">Client</h3>
                <p className="text-sm">{selectedOrder.customer?.fullName}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedOrder.customer?.email}
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold text-foreground">Status</h3>
                <p className="text-sm">{selectedOrder.status}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedOrder.paymentStatus}
                </p>
              </div>
            </div>

            {/* Order Items */}
            {selectedOrder.vendors && selectedOrder.vendors.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">
                  Produse comandate
                </h3>
                <div className="space-y-4">
                  {selectedOrder.vendors.map((vendor) => (
                    <div
                      key={vendor.id}
                      className="rounded-lg border border-border bg-muted/50 p-4"
                    >
                      <div className="mb-2 font-medium">
                        {vendor.producer.name}
                      </div>
                      <div className="space-y-2">
                        {vendor.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <span>
                              {item.product.name} x {item.quantity}
                            </span>
                            <span className="font-medium">
                              {parseFloat(item.price).toFixed(2)} RON
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Financial Section */}
            <div className="border-t border-border pt-4">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Financiar</h3>
              <div className="space-y-2 rounded-lg border border-border bg-muted/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total comandă</span>
                  <span className="font-medium">
                    {parseFloat(selectedOrder.totalAmount).toFixed(2)} RON
                  </span>
                </div>
                {selectedOrder.totalCommission && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Comision Farmero</span>
                    <span className="font-medium text-orange-600 dark:text-orange-400">
                      {parseFloat(selectedOrder.totalCommission).toFixed(2)} RON
                    </span>
                  </div>
                )}
                {selectedOrder.totalPayout && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Sumă către producător</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {parseFloat(selectedOrder.totalPayout).toFixed(2)} RON
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-border pt-2">
                  <span className="text-sm font-semibold text-foreground">Stare plată</span>
                  <span
                    className={`text-sm font-medium ${
                      selectedOrder.paymentStatus === 'PAID'
                        ? 'text-green-600 dark:text-green-400'
                        : selectedOrder.paymentStatus === 'REFUNDED'
                        ? 'text-orange-600 dark:text-orange-400'
                        : 'text-yellow-600 dark:text-yellow-400'
                    }`}
                  >
                    {selectedOrder.paymentStatus || 'PENDING'}
                  </span>
                </div>
                {selectedOrder.paymentMethod && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Metodă plată</span>
                    <span className="text-sm">{selectedOrder.paymentMethod}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Commissions Breakdown */}
            {selectedOrder.commissions && selectedOrder.commissions.length > 0 && (
              <div className="border-t border-border pt-4">
                <h3 className="mb-3 text-sm font-semibold text-foreground">Comisioane</h3>
                <div className="space-y-2">
                  {selectedOrder.commissions.map((commission) => (
                    <div
                      key={commission.id}
                      className="rounded-lg border border-border bg-muted/50 p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {commission.producer.name}
                        </span>
                        <span className="text-sm font-medium">
                          {parseFloat(commission.commissionAmount).toFixed(2)} RON
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          Bază: {parseFloat(commission.baseAmount).toFixed(2)} RON (
                          {(parseFloat(commission.commissionRate) * 100).toFixed(2)}%)
                        </span>
                        <span
                          className={`${
                            commission.status === 'PAID'
                              ? 'text-green-600 dark:text-green-400'
                              : commission.status === 'ISSUED'
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-yellow-600 dark:text-yellow-400'
                          }`}
                        >
                          {commission.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            {selectedOrder.timeline && selectedOrder.timeline.length > 0 && (
              <div className="border-t border-border pt-4">
                <h3 className="mb-3 text-sm font-semibold text-foreground">Timeline</h3>
                <div className="space-y-3">
                  {selectedOrder.timeline.map((entry, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{entry.status}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(entry.timestamp).toLocaleString('ro-RO')}
                        </div>
                        {entry.note && (
                          <div className="mt-1 text-xs text-muted-foreground">
                            {entry.note}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Admin Actions */}
            {canManageFinancials && (
              <div className="border-t border-border pt-4">
                <h3 className="mb-3 text-sm font-semibold text-foreground">Acțiuni</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedOrder.status !== 'REFUNDED' &&
                    selectedOrder.status !== 'CANCELED' && (
                      <>
                        {canRefund && (
                          <button
                            onClick={handleRefund}
                            className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-700"
                          >
                            Marchează ca refundat
                          </button>
                        )}
                        {canCancel && (
                          <button
                            onClick={handleCancel}
                            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                          >
                            Anulează comandă
                          </button>
                        )}
                      </>
                    )}
                </div>
              </div>
            )}
          </div>
        </Modal>
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
