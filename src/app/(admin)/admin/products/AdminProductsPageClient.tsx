/**
 * Admin Products Page Client Component
 * 
 * Client component pentru pagina de gestionare produse admin
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardHeader, CardTitle, CardContent } from 'farme-ui'
import { Button } from 'farme-ui'
import { Badge } from 'farme-ui'
import { Alert } from 'farme-ui'
import { Skeleton } from 'farme-ui'
import { Modal } from 'farme-ui'
import { Select } from 'farme-ui'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n/context'
import { formatCurrency } from '@/lib/utils/format'
import { formatUnit } from '@/lib/utils/format-units'

interface Product {
  id: string
  name: string
  description?: string
  price: number
  unit: string
  stock: number
  status: string
  producer: {
    name: string
  }
  region?: {
    name: string
  }
}

export default function AdminProductsPageClient() {
  const searchParams = useSearchParams()
  const statusFilter = searchParams.get('status') || 'PENDING_REVIEW'
  const { locale, t } = useI18n()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionModal, setActionModal] = useState<{ product: Product; action: 'approve' | 'reject' } | null>(null)
  const [updating, setUpdating] = useState(false)

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/admin/products?status=${statusFilter}`, {
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('Eroare la încărcarea produselor')
      }
      const data = await response.json()
      setProducts(data.products || [])
    } catch (err: any) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Error loading products:', err)
      }
      setError(err.message || 'Eroare la încărcarea produselor')
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  async function handleApprove(productId: string) {
    try {
      setUpdating(true)
      const response = await fetch(`/api/admin/products/${productId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('Eroare la aprobarea produsului')
      }
      await loadProducts()
      setActionModal(null)
    } catch (err: any) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Error approving product:', err)
      }
      setError(err.message || 'Eroare la aprobarea produsului')
    } finally {
      setUpdating(false)
    }
  }

  async function handleReject(productId: string) {
    try {
      setUpdating(true)
      const response = await fetch(`/api/admin/products/${productId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('Eroare la respingerea produsului')
      }
      await loadProducts()
      setActionModal(null)
    } catch (err: any) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Error rejecting product:', err)
      }
      setError(err.message || 'Eroare la respingerea produsului')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <PageContainer>
      <div className="mb-spacing-xl">
        <h1 className="text-4xl font-heading font-bold text-[var(--color-foreground)] mb-spacing-sm">
          Gestionare Produse
        </h1>
        <p className="text-[var(--color-muted-foreground)]">
          Aprobă sau respinge produsele trimise de producători
        </p>
      </div>

      {error && (
        <Alert variant="destructive" title="Eroare" className="mb-spacing-lg">
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card variant="default" padding="md" className="mb-spacing-lg">
        <CardContent>
          <div className="flex items-center gap-spacing-base">
            <label className="text-sm font-medium text-[var(--color-foreground)]">
              Filtrează după status:
            </label>
            <Select
              value={statusFilter}
              onChange={(e) => {
                const params = new URLSearchParams()
                params.set('status', e.target.value)
                window.location.href = `/dashboard/admin/products?${params.toString()}`
              }}
            >
              <option value="">Toate</option>
              <option value="PENDING_REVIEW">În așteptare</option>
              <option value="APPROVED">Aprobate</option>
              <option value="REJECTED">Respinse</option>
              <option value="DRAFT">Draft</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products List */}
      {loading ? (
        <div className="space-y-spacing-base">
          {[...Array(5)].map((_, i) => (
            <Card key={i} variant="default" padding="lg">
              <CardContent>
                <Skeleton variant="text" width="60%" className="mb-2" />
                <Skeleton variant="text" width="40%" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : products.length === 0 ? (
        <Card variant="default" padding="lg">
          <CardContent>
            <p className="text-center text-[var(--color-muted-foreground)]">
              Nu există produse cu statusul selectat.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-spacing-base">
          {products.map((product) => (
            <Card key={product.id} variant="default" padding="lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="mb-spacing-xs">{product.name}</CardTitle>
                    <div className="flex items-center gap-spacing-sm flex-wrap">
                      <Badge variant={product.status === 'APPROVED' ? 'success' : product.status === 'REJECTED' ? 'error' : 'warning'}>
                        {product.status}
                      </Badge>
                      <span className="text-sm text-[var(--color-muted-foreground)]">
                        {product.producer.name}
                      </span>
                      {product.region && (
                        <span className="text-sm text-[var(--color-muted-foreground)]">
                          {product.region.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[var(--color-primary)]">
                      {formatCurrency(Number(product.price), locale)} / {formatUnit(1, product.unit, locale, t)}
                    </p>
                    <p className="text-sm text-[var(--color-muted-foreground)]">
                      Stoc: {product.stock}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {product.description && (
                  <p className="text-sm text-[var(--color-muted-foreground)] mb-spacing-base">
                    {product.description}
                  </p>
                )}
                {product.status === 'PENDING_REVIEW' && (
                  <div className="flex gap-spacing-sm">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setActionModal({ product, action: 'approve' })}
                    >
                      Aprobă
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActionModal({ product, action: 'reject' })}
                    >
                      Respinge
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Action Modal */}
      {actionModal && (
        <Modal
          isOpen={!!actionModal}
          onClose={() => setActionModal(null)}
          title={actionModal.action === 'approve' ? 'Aprobă produs' : 'Respinge produs'}
        >
          <div className="space-y-spacing-base">
            <p>
              Ești sigur că vrei să {actionModal.action === 'approve' ? 'aprobezi' : 'respingi'} produsul{' '}
              <strong>{actionModal.product.name}</strong>?
            </p>
            <div className="flex gap-spacing-sm justify-end">
              <Button variant="outline" onClick={() => setActionModal(null)} disabled={updating}>
                Anulează
              </Button>
              <Button
                variant={actionModal.action === 'approve' ? 'primary' : 'destructive'}
                onClick={() => {
                  if (actionModal.action === 'approve') {
                    handleApprove(actionModal.product.id)
                  } else {
                    handleReject(actionModal.product.id)
                  }
                }}
                disabled={updating}
              >
                {updating ? 'Se procesează...' : actionModal.action === 'approve' ? 'Aprobă' : 'Respinge'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </PageContainer>
  )
}

