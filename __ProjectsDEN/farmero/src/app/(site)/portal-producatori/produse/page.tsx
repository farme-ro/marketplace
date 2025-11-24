/**
 * Producer Products Page
 * 
 * Pagină pentru gestionarea produselor: activare/dezactivare rapidă
 * 
 * Note: Backend integration required for:
 * - Fetching producer products list
 * - Toggling product active/inactive status
 * - Real-time product management
 */

'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, Button } from 'farme-ui'
import { ProducerDashboardLayout } from '@/components/producer-portal/producer-dashboard-layout'
import { ProducerProductsTable } from '@/components/producer-portal/products/producer-products-table'
import { MobileProductCard } from '@/components/producer-portal/mobile/mobile-product-card'
import { ToastNotification } from '@/components/producer-portal/mobile/toast-notification'
import { ProductsToolbar } from './_components/products-toolbar'
import { 
  getProducerProducts, 
  updateProduct, 
  toggleProductActive,
  deleteProduct,
  type ProducerProduct 
} from '@/lib/api/producer/products'
import { useI18n } from '@/lib/i18n/context'
import { typography } from '@/lib/design-system/typography'
import { cn } from '@/lib/utils/cn'

export default function ProducerProductsPage() {
  const { t } = useI18n()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false,
  })

  const [products, setProducts] = useState<ProducerProduct[]>([])
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set())

  // Load products on mount
  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true)
        setError(null)
        const productsData = await getProducerProducts()
        setProducts(productsData)
      } catch (err: unknown) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('Error loading products:', err)
        }
        const errorMessage = err instanceof Error ? err.message : t('producer.products.errorLoading', 'Eroare la încărcarea produselor')
        setError(errorMessage)
        
        // Handle 401 - redirect to login
        if (err instanceof Error && (err.message.includes('401') || err.message.includes('autentificat'))) {
          showToast(t('producer.products.errorAuth', 'Trebuie să fii autentificat pentru a vedea produsele.'), 'error')
          return
        }
        
        showToast(
          errorMessage || t('producer.products.errorGeneric', 'Nu s-au putut încărca produsele. Te rugăm să încerci din nou.'),
          'error'
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type, isVisible: true })
    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }))
    }, 3000)
  }

  const handleToggleActive = async (productId: string, currentIsActive: boolean) => {
    const newIsActive = !currentIsActive
    
    // Optimistic update
    setUpdatingIds(prev => new Set(prev).add(productId))
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, isActive: newIsActive } : p))
    )

    try {
      await toggleProductActive(productId, newIsActive)
      
      showToast(
        newIsActive 
          ? t('producer.products.successActivated', 'Produs activat cu succes!')
          : t('producer.products.successDeactivated', 'Produs dezactivat cu succes!'),
        'success'
      )
    } catch (error: unknown) {
      // Revert on error
      setProducts(prev =>
        prev.map(p => (p.id === productId ? { ...p, isActive: currentIsActive } : p))
      )
      
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Error toggling product:', error)
      }
      const errorMessage = error instanceof Error ? error.message : t('producer.products.errorUpdate', 'Eroare la actualizarea produsului')
      showToast(
        errorMessage || 
        t('producer.products.errorUpdateRetry', 'Eroare la actualizarea produsului. Te rugăm să încerci din nou.'),
        'error'
      )
    } finally {
      setUpdatingIds(prev => {
        const next = new Set(prev)
        next.delete(productId)
        return next
      })
    }
  }

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Search filter (name, description)
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        (p.description && p.description.toLowerCase().includes(searchLower))
      )
    }

    // Status filter
    if (statusFilter === 'active') {
      filtered = filtered.filter(p => p.isActive)
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter(p => !p.isActive)
    } else if (statusFilter === 'low-stock') {
      filtered = filtered.filter(p => (p.stock ?? 0) > 0 && (p.stock ?? 0) < 5)
    }

    // Stock filter
    if (stockFilter === 'in-stock') {
      filtered = filtered.filter(p => (p.stock ?? 0) > 0)
    } else if (stockFilter === 'low-stock') {
      filtered = filtered.filter(p => (p.stock ?? 0) > 0 && (p.stock ?? 0) < 5)
    } else if (stockFilter === 'out-of-stock') {
      filtered = filtered.filter(p => (p.stock ?? 0) === 0)
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.categoryId === categoryFilter || p.categoryName === categoryFilter)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        case 'price':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'stock':
          return a.stock - b.stock
        case 'stock-desc':
          return b.stock - a.stock
        default:
          return 0
      }
    })

    return filtered
  }, [products, search, statusFilter, stockFilter, categoryFilter, sortBy])

  if (isLoading) {
    return (
      <ProducerDashboardLayout>
        <div className="min-h-screen bg-background py-8">
          <div className="mx-auto max-w-8xl px-4">
            <div className="text-center py-20">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
              <p className="text-muted-foreground">Se încarcă produsele...</p>
            </div>
          </div>
        </div>
      </ProducerDashboardLayout>
    )
  }

  if (error && products.length === 0) {
    return (
      <ProducerDashboardLayout>
        <div className="min-h-screen bg-background py-8">
          <div className="mx-auto max-w-8xl px-4">
            <Card className="border border-border rounded-2xl">
              <CardContent className="p-12 text-center">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  Încearcă din nou
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProducerDashboardLayout>
    )
  }

  return (
    <ProducerDashboardLayout>
      {/* Mobile View */}
      <div className="md:hidden">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className={cn(typography.pageTitle.base, 'mb-1')}>
                {t('producer.products.title', 'Produse')}
              </h1>
              <p className="text-sm text-foreground-body">
                {t('producer.products.description', 'Gestionează produsele tale')}
              </p>
            </div>
            <Link href="/portal-producatori/produse/adauga">
              <Button size="sm" className="bg-primary hover:bg-primary-hover">
                + Adaugă
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-4">
          {filteredProducts.map((product) => (
            <MobileProductCard
              key={product.id}
              product={{
                ...product,
                stock: product.stock ?? 0,
                isUpdating: updatingIds.has(product.id),
              }}
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>

        {/* Toast Notification */}
        <ToastNotification
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
        />
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <h1 className={cn(typography.pageTitle.base, 'mb-2')}>
            Produsele tale
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-3xl">
            Actualizează rapid prețurile, stocurile și disponibilitatea. Poți dezactiva produsele pe care nu le mai ai pe stoc.
          </p>
        </motion.div>

        {/* Toolbar */}
        <ProductsToolbar
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          stockFilter={stockFilter}
          onStockFilterChange={setStockFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          totalProducts={products.length}
          filteredCount={filteredProducts.length}
        />

        {/* Products Table */}
        <ProducerProductsTable 
          products={filteredProducts.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            unit: p.unit,
            stock: p.stock ?? 0,
            isActive: p.isActive,
          }))}
          onToggleActive={handleToggleActive}
          updatingIds={updatingIds}
        />

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <Card className="border border-border rounded-2xl shadow-sm bg-card">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary-soft flex items-center justify-center text-2xl flex-shrink-0">
                  💡
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    Control total asupra stocului
                  </h3>
                  <p className="text-sm md:text-base text-foreground-body leading-relaxed">
                    Când dezactivezi un produs, acesta dispare imediat din listările publice. Clienții nu pot comanda ceva ce nu ai în stoc, iar tu eviți situații neplăcute.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </ProducerDashboardLayout>
  )
}

