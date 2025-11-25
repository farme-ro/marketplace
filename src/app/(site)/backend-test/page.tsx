/**
 * Backend Test Page
 * 
 * Test page that calls the backend API directly (not Next.js routes)
 * This verifies the full stack: Neon DB ⇄ Backend ⇄ Frontend
 * 
 * Accessible at: /backend-test
 */

'use client'

import type { Metadata } from 'next'

// Note: Metadata export doesn't work in client components
// This page should not be indexed

import { useState, useEffect } from 'react'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent, CardHeader, CardTitle } from 'farme-ui'
import { Button } from 'farme-ui'
import { getApiBaseUrlForDisplay } from '@/lib/api/config'
import { Skeleton } from 'farme-ui'
import { Alert } from 'farme-ui'
import { Badge } from 'farme-ui'
import { useI18n } from '@/lib/i18n/context'
import { formatCurrency } from '@/lib/utils/format'
import { getBackendProducts, type BackendProduct } from '@/lib/api/backend/products'

export default function BackendTestPage() {
  const { locale } = useI18n()
  const [products, setProducts] = useState<BackendProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFetch, setLastFetch] = useState<Date | null>(null)

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await getBackendProducts({ limit: 10 })
      setProducts(response.data || [])
      setLastFetch(new Date())
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Error fetching products from backend:', err)
      }
      setError(err instanceof Error ? err.message : 'Failed to fetch products from backend')
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Backend API Test</h1>
        <p className="text-[var(--color-muted-foreground)]">
          This page tests the full stack connection: Neon DB ⇄ Backend API ⇄ Frontend
        </p>
        <p className="text-sm text-[var(--color-muted-foreground)] mt-2">
          Endpoint: <code className="bg-[var(--color-muted)] px-2 py-1 rounded">
            {getApiBaseUrlForDisplay()}/api/products
          </code>
        </p>
      </div>

      {/* Status Card */}
      <Card variant="default" padding="lg" className="mb-4">
        <CardHeader>
          <CardTitle>Connection Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Backend API</p>
              <p className="text-sm text-[var(--color-muted-foreground)]">
                {isLoading ? 'Checking...' : error ? 'Error' : 'Connected'}
              </p>
            </div>
            <div className="text-right">
              {isLoading && <span className="text-yellow-600">⏳</span>}
              {!isLoading && error && <span className="text-red-600">❌</span>}
              {!isLoading && !error && <span className="text-green-600">✅</span>}
            </div>
          </div>
          {lastFetch && (
            <p className="text-xs text-[var(--color-muted-foreground)] mt-2">
              Last fetched: {lastFetch.toLocaleTimeString()}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" title="Error" className="mb-4">
          <p className="text-sm">{error}</p>
          <p className="text-xs text-[var(--color-muted-foreground)] mt-2">
            Make sure:
          </p>
          <ul className="text-xs text-[var(--color-muted-foreground)] mt-1 list-disc list-inside">
            <li>Backend service is running</li>
            <li>NEXT_PUBLIC_API_URL is set correctly</li>
            <li>Backend has a GET /api/products endpoint</li>
            <li>Backend is connected to Neon database</li>
          </ul>
        </Alert>
      )}

      {/* Refresh Button */}
      <div className="mb-4">
        <Button
          variant="primary"
          onClick={fetchProducts}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Refresh Data'}
        </Button>
      </div>

      {/* Products List */}
      <Card variant="default" padding="lg">
        <CardHeader>
          <CardTitle>
            Products from Backend ({products.length} {products.length === 1 ? 'product' : 'products'})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <Skeleton variant="text" width="60%" className="mb-2" />
                  <Skeleton variant="text" width="40%" />
                </div>
              ))}
            </div>
          )}

          {/* Products Table/List */}
          {!isLoading && !error && products.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <th className="text-left p-3 font-semibold">Name</th>
                    <th className="text-left p-3 font-semibold">Price</th>
                    <th className="text-left p-3 font-semibold">Unit</th>
                    <th className="text-left p-3 font-semibold">Stock</th>
                    <th className="text-left p-3 font-semibold">Producer</th>
                    <th className="text-left p-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-muted)]">
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          {product.description && (
                            <p className="text-sm text-[var(--color-muted-foreground)]">
                              {product.description.substring(0, 50)}...
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="font-semibold">{formatCurrency(product.price, locale)}</span>
                      </td>
                      <td className="p-3">{product.unit}</td>
                      <td className="p-3">{product.stock}</td>
                      <td className="p-3">
                        {product.producerName || product.producerId}
                      </td>
                      <td className="p-3">
                        {product.status && (
                          <Badge variant={product.status === 'APPROVED' ? 'success' : 'default'}>
                            {product.status}
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && products.length === 0 && (
            <div className="text-center py-8">
              <p className="text-[var(--color-muted-foreground)]">
                No products found in database.
              </p>
              <p className="text-sm text-[var(--color-muted-foreground)] mt-2">
                The backend is connected, but the database is empty.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Success Message */}
      {!isLoading && !error && products.length > 0 && (
        <Alert variant="success" title="Success!" className="mt-4">
          <p className="text-sm">
            Successfully fetched {products.length} product(s) from the backend API.
            This confirms that:
          </p>
          <ul className="text-xs text-[var(--color-muted-foreground)] mt-2 list-disc list-inside">
            <li>Frontend can reach the backend API</li>
            <li>Backend API is responding correctly</li>
            <li>Backend is connected to Neon database</li>
            <li>Database queries are working</li>
          </ul>
        </Alert>
      )}
    </PageContainer>
  )
}

