/**
 * Products Page Client Component
 * 
 * Client component pentru pagina de produse cu useSearchParams
 */

'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { getProducts } from '@/lib/api/public/products'
import { getRegions, type Region } from '@/lib/api/public/regions'
import type { ProductSummary, PaginatedResponse } from '@/types/public'
import { ProductCard } from '@/components/ui/product-card'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent } from 'farme-ui'
import { Button } from 'farme-ui'
import { Skeleton } from 'farme-ui'
import { Alert } from 'farme-ui'
import { useCartStore } from '@/lib/store/cart'
import { useI18n } from '@/lib/i18n/context'
import { routes } from '@/lib/routes'
import { ProductsHeaderSection } from './_components/products-header-section'
import { ProductsFiltersSection } from './_components/products-filters-section'
import { getCategoryColor } from '@/lib/categories/category-colors'

// Map category slugs to dropdown values (if needed)
const CATEGORY_SLUG_TO_ID: Record<string, string> = {
  'legume-fructe': 'vegetables', // Map to dropdown value
  'lactate': 'dairy',
  'carne-mezeluri': 'meat',
  'dulciuri': 'honey',
  'bauturi-locale': 'mixed', // Approximate mapping
  'altele': 'mixed',
}

export default function ProductsPageClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { addItem } = useCartStore()
  const { t } = useI18n()
  const [products, setProducts] = useState<ProductSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [regions, setRegions] = useState<Region[]>([])
  
  // Category slug from URL (from homepage links)
  const categorySlugFromUrl = searchParams.get('category') || ''
  
  // Initialize category from URL if present
  const initialCategory = categorySlugFromUrl 
    ? (CATEGORY_SLUG_TO_ID[categorySlugFromUrl] || categorySlugFromUrl)
    : (searchParams.get('categoryId') || '')
  
  // Filters
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [selectedRegion, setSelectedRegion] = useState(searchParams.get('regionId') || '')
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  
  // Get active category slug for color theming
  const activeCategorySlug = useMemo(() => {
    if (categorySlugFromUrl) return categorySlugFromUrl
    // Reverse lookup: find slug from selectedCategory
    const foundSlug = Object.entries(CATEGORY_SLUG_TO_ID).find(([_, id]) => id === selectedCategory)?.[0]
    return foundSlug || null
  }, [categorySlugFromUrl, selectedCategory])
  
  // Get category colors for button theming
  const categoryColors = useMemo(() => {
    if (activeCategorySlug) {
      return getCategoryColor(activeCategorySlug)
    }
    return null
  }, [activeCategorySlug])
  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  })

  // Sync category from URL when it changes
  useEffect(() => {
    const urlCategory = searchParams.get('category')
    if (urlCategory) {
      const mappedCategory = CATEGORY_SLUG_TO_ID[urlCategory] || urlCategory
      setSelectedCategory(mappedCategory)
    }
  }, [searchParams])

  // Fetch regions
  useEffect(() => {
    async function fetchRegions() {
      try {
        // IMPORTANT: Apelează direct backend-ul (api.farme.ro), NU Next.js API route
        const regionsList = await getRegions()
        setRegions(regionsList)
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('Error fetching regions:', err)
        }
        setRegions([])
      }
    }
    fetchRegions()
  }, [])

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true)
        setError(null)
        const params: {
          page: number
          pageSize: number
          q?: string
          regionId?: string
          category?: string
          categoryId?: string
        } = {
          page: pagination.page,
          pageSize: pagination.limit,
        }
        if (search) params.q = search
        if (selectedRegion) params.regionId = selectedRegion
        // Use category slug if available, otherwise use categoryId
        if (categorySlugFromUrl) {
          params.category = categorySlugFromUrl
        } else if (selectedCategory) {
          params.categoryId = selectedCategory
        }
        
        const response = await getProducts(params)
        
        // Map products to ensure all required ProductSummary fields are present
        const mappedProducts = response.data.map(p => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          price: p.price,
          unit: p.unit || 'buc',
          producerName: p.producerName || '',
          producerSlug: p.producerSlug || '',
          regionName: p.regionName,
          regionId: p.regionId,
          isTraditional: p.isTraditional ?? false,
          isBio: p.isBio ?? false,
          imageUrl: p.imageUrl,
          stock: p.stock ?? 0,
          status: p.status || 'APPROVED',
        }))
        
        // Filter by price on client side (if backend doesn't support it)
        let filteredProducts = mappedProducts
        if (minPrice || maxPrice) {
          filteredProducts = filteredProducts.filter(p => {
            if (minPrice && p.price < parseFloat(minPrice)) return false
            if (maxPrice && p.price > parseFloat(maxPrice)) return false
            return true
          })
        }
        
        setProducts(filteredProducts)
        setPagination(prev => ({
          ...prev,
          total: response.pagination.total,
          totalPages: response.pagination.totalPages,
        }))
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('Error fetching products:', err)
        }
        setError(err instanceof Error ? err.message : t('products.errors.loadFailed', 'Eroare la încărcarea produselor'))
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, search, selectedRegion, selectedCategory, minPrice, maxPrice])

  function handleApplyFilters() {
    const params = new URLSearchParams()
    if (search) params.set('q', search)
    if (selectedRegion) params.set('regionId', selectedRegion)
    // If we have a category slug, use it; otherwise use categoryId
    if (activeCategorySlug) {
      params.set('category', activeCategorySlug)
    } else if (selectedCategory) {
      params.set('categoryId', selectedCategory)
    }
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    router.push(`/products?${params.toString()}`)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  function handleClearFilters() {
    setSearch('')
    setSelectedRegion('')
    setSelectedCategory('')
    setMinPrice('')
    setMaxPrice('')
    router.push(routes.products.list)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  function handleAddToCart(product: ProductSummary) {
    addItem({
      productId: product.id,
      name: product.name,
      producerId: product.producerSlug,
      producerName: product.producerName,
      price: product.price,
      quantity: 1,
      image: product.imageUrl,
      unit: product.unit,
      slug: product.slug,
    })
  }

  const hasActiveFilters = !!(search || selectedRegion || selectedCategory || minPrice || maxPrice)

  return (
    <div className="min-h-screen bg-background text-foreground py-10 md:py-16">
      <PageContainer>
        {/* Header Section */}
        <ProductsHeaderSection />

        {/* Filters Section */}
        <div className="mb-10">
          <ProductsFiltersSection
            search={search}
            setSearch={setSearch}
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            regions={regions}
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
            activeCategorySlug={activeCategorySlug}
            categoryColors={categoryColors}
          />
        </div>

        {/* Products Grid */}
        <div>
          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} variant="default" padding="none">
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent padding="md">
                    <Skeleton variant="text" width="80%" className="mb-2" />
                    <Skeleton variant="text" width="60%" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <Alert variant="destructive" title={t('products.errors.title', 'Eroare')}>
              {error}
            </Alert>
          )}

          {/* Products Grid */}
          {!isLoading && !error && products.length > 0 && (
            <>
              <div className="mb-6">
                <p className="text-sm md:text-base text-muted-foreground">
                  {pagination.total === 1 
                    ? t('products.results.product', '1 produs găsit')
                    : `${pagination.total} ${t('products.results.products', 'produse găsite')}`
                  }
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    slug={product.slug}
                    name={product.name}
                    price={product.price}
                    unit={product.unit}
                    producerName={product.producerName}
                    producerSlug={product.producerSlug}
                    regionName={product.regionName}
                    isTraditional={product.isTraditional}
                    isBio={product.isBio}
                    imageUrl={product.imageUrl}
                    onAddToCart={() => handleAddToCart(product)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                    disabled={pagination.page === 1}
                  >
                    {t('pagination.previous', 'Anterior')}
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {t('pagination.page', 'Pagina {current} din {total}').replace('{current}', String(pagination.page)).replace('{total}', String(pagination.totalPages))}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.totalPages, prev.page + 1) }))}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    {t('pagination.next', 'Următor')}
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!isLoading && !error && products.length === 0 && (
            <Card className="rounded-[32px] border border-border bg-card shadow-premium">
              <CardContent className="p-8 md:p-12">
                <div className="text-center py-8">
                  <p className="text-base md:text-lg text-muted-foreground mb-4">
                    {t('emptyStates.products.title', 'Nu există produse disponibile.')}
                  </p>
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      onClick={handleClearFilters}
                      className="rounded-full"
                    >
                      {t('products.filters.clearFilters', 'Șterge filtre')}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </PageContainer>
    </div>
  )
}

