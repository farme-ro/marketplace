/**
 * Products Toolbar Component
 * 
 * Toolbar îmbunătățit cu search avansat, filtre multiple și sortare
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Input } from 'farme-ui'
import { Select } from 'farme-ui'
import { Button } from 'farme-ui'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '@/lib/i18n/context'

interface ProductsToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  stockFilter?: string
  onStockFilterChange?: (value: string) => void
  sortBy?: string
  onSortChange?: (value: string) => void
  categoryFilter?: string
  onCategoryFilterChange?: (value: string) => void
  totalProducts?: number
  filteredCount?: number
}

export function ProductsToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  stockFilter = 'all',
  onStockFilterChange,
  sortBy = 'name',
  onSortChange,
  categoryFilter = 'all',
  onCategoryFilterChange,
  totalProducts,
  filteredCount,
}: ProductsToolbarProps) {
  const { t } = useI18n()
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const handleResetFilters = () => {
    onSearchChange('')
    onStatusFilterChange('all')
    onStockFilterChange?.('all')
    onCategoryFilterChange?.('all')
    onSortChange?.('name')
  }

  const hasActiveFilters = search || statusFilter !== 'all' || stockFilter !== 'all' || categoryFilter !== 'all'

  return (
    <section className="mb-6 space-y-4">
      {/* Main Toolbar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 flex-1 flex-wrap">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <svg 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <Input
              type="text"
              placeholder={t('producer.products.searchPlaceholder', 'Caută după nume, descriere...')}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 flex-1 max-w-md"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Filter */}
            <Select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="w-36"
            >
              <option value="all">{t('producer.products.statusAll', 'Toate statusurile')}</option>
              <option value="active">{t('producer.products.statusActive', '✅ Active')}</option>
              <option value="inactive">{t('producer.products.statusInactive', '⏸️ Inactive')}</option>
              <option value="low-stock">{t('producer.products.statusLowStock', '⚠️ Stoc scăzut')}</option>
            </Select>

            {/* Stock Filter */}
            {onStockFilterChange && (
              <Select
                value={stockFilter}
                onChange={(e) => onStockFilterChange(e.target.value)}
                className="w-36"
              >
                <option value="all">{t('producer.products.stockAll', 'Toate stocurile')}</option>
                <option value="in-stock">{t('producer.products.stockInStock', 'În stoc')}</option>
                <option value="low-stock">{t('producer.products.stockLowStock', 'Stoc scăzut (<5)')}</option>
                <option value="out-of-stock">{t('producer.products.stockOutOfStock', 'Stoc epuizat')}</option>
              </Select>
            )}

            {/* Sort */}
            {onSortChange && (
              <Select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="w-40"
              >
                <option value="name">{t('producer.products.sortName', 'Sortează: Nume A-Z')}</option>
                <option value="name-desc">{t('producer.products.sortNameDesc', 'Sortează: Nume Z-A')}</option>
                <option value="price">{t('producer.products.sortPrice', 'Sortează: Preț ↑')}</option>
                <option value="price-desc">{t('producer.products.sortPriceDesc', 'Sortează: Preț ↓')}</option>
                <option value="stock">{t('producer.products.sortStock', 'Sortează: Stoc ↑')}</option>
                <option value="stock-desc">{t('producer.products.sortStockDesc', 'Sortează: Stoc ↓')}</option>
                <option value="recent">{t('producer.products.sortRecent', 'Cele mai recente')}</option>
              </Select>
            )}

            {/* Advanced Filters Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="whitespace-nowrap"
            >
              {showAdvancedFilters ? '▼' : '▶'} {t('producer.products.advancedFilters', 'Filtre avansate')}
            </Button>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="whitespace-nowrap text-xs"
              >
                {t('producer.products.resetFilters', 'Resetează')}
              </Button>
            )}
          </div>
        </div>

        {/* Add Product Button */}
        <Link href="/portal-producatori/produse/adauga">
          <Button className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-full px-6 py-3 font-semibold shadow-md hover:shadow-lg whitespace-nowrap">
            {t('producer.products.addProduct', '+ Adaugă produs')}
          </Button>
        </Link>
      </div>

      {/* Results Count */}
      {(totalProducts !== undefined || filteredCount !== undefined) && (
        <div className="text-sm text-muted-foreground">
          {hasActiveFilters && filteredCount !== undefined ? (
            <span>
              {t('producer.products.showing', 'Afișez {filtered} din {total} produse').replace('{filtered}', filteredCount.toString()).replace('{total}', (totalProducts || 0).toString())}
            </span>
          ) : (
            <span>
              {t('producer.products.total', '{total} produse în total').replace('{total}', (totalProducts || 0).toString())}
            </span>
          )}
        </div>
      )}

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border border-border rounded-2xl bg-card p-4 space-y-3">
              <h3 className="text-sm font-semibold text-foreground mb-3">{t('producer.products.advancedFilters', 'Filtre avansate')}</h3>
              
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {/* Category Filter */}
                {onCategoryFilterChange && (
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">{t('common.category', 'Categorie')}</label>
                    <Select
                      value={categoryFilter}
                      onChange={(e) => onCategoryFilterChange(e.target.value)}
                      className="w-full"
                    >
                      <option value="all">{t('producer.products.categoryAll', 'Toate categoriile')}</option>
                      <option value="lactate">{t('producer.products.categoryLactate', 'Lactate')}</option>
                      <option value="carne">{t('producer.products.categoryCarne', 'Carne')}</option>
                      <option value="legume">{t('producer.products.categoryLegume', 'Legume')}</option>
                      <option value="fructe">{t('producer.products.categoryFructe', 'Fructe')}</option>
                      <option value="miere">{t('producer.products.categoryMiere', 'Miere')}</option>
                      <option value="oua">{t('producer.products.categoryOua', 'Ouă')}</option>
                    </Select>
                  </div>
                )}

                {/* Price Range (placeholder) */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">{t('producer.products.priceRange', 'Interval preț')}</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder={t('producer.products.priceMin', 'Min')}
                      className="w-full"
                      disabled
                    />
                    <span className="text-muted-foreground">-</span>
                    <Input
                      type="number"
                      placeholder={t('producer.products.priceMax', 'Max')}
                      className="w-full"
                      disabled
                    />
                  </div>
                </div>

                {/* Bio/Traditional Filters */}
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">{t('producer.products.productType', 'Tip produs')}</label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      disabled
                    >
                      {t('producer.products.productTypeBio', 'Bio')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      disabled
                    >
                      {t('producer.products.productTypeTraditional', 'Tradițional')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

