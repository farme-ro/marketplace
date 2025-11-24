/**
 * Products Filters Section
 * 
 * Secțiunea de filtrare într-un card modern
 */

'use client'

import { Card, CardContent } from 'farme-ui'
import { Input } from 'farme-ui'
import { Select } from 'farme-ui'
import { Button } from 'farme-ui'
import { Badge } from 'farme-ui'
import type { Region } from '@/lib/api/public/regions'
import { useI18n } from '@/lib/i18n/context'
import type { CategoryColorConfig } from '@/lib/categories/category-colors'

interface ProductsFiltersSectionProps {
  search: string
  setSearch: (value: string) => void
  selectedRegion: string
  setSelectedRegion: (value: string) => void
  selectedCategory: string
  setSelectedCategory: (value: string) => void
  minPrice: string
  setMinPrice: (value: string) => void
  maxPrice: string
  setMaxPrice: (value: string) => void
  regions: Region[]
  onApplyFilters: () => void
  onClearFilters: () => void
  hasActiveFilters: boolean
  activeCategorySlug?: string | null
  categoryColors?: CategoryColorConfig | null
}

export function ProductsFiltersSection({
  search,
  setSearch,
  selectedRegion,
  setSelectedRegion,
  selectedCategory,
  setSelectedCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  regions,
  onApplyFilters,
  onClearFilters,
  hasActiveFilters,
  activeCategorySlug,
  categoryColors,
}: ProductsFiltersSectionProps) {
  const { t, locale } = useI18n()
  
  // Helper function to get translated category label
  const getCategoryLabel = (categoryValue: string): string => {
    if (!categoryValue) return ''
    
    // Map of category values to translation keys
    const categoryTranslationMap: Record<string, string> = {
      'fruits': 'products.filters.category.fruits',
      'vegetables': 'products.filters.category.vegetables',
      'dairy': 'products.filters.category.dairy',
      'meat': 'products.filters.category.meat',
      'honey': 'products.filters.category.honey',
      'mixed': 'products.filters.category.mixed',
      // Also handle slugs that might come from URL
      'legume-fructe': 'products.filters.category.vegetables',
      'lactate': 'products.filters.category.dairy',
      'carne-mezeluri': 'products.filters.category.meat',
      'dulciuri': 'products.filters.category.honey',
      'bauturi-locale': 'products.filters.category.mixed',
      'altele': 'products.filters.category.mixed',
    }
    
    const translationKey = categoryTranslationMap[categoryValue]
    if (translationKey) {
      const translated = t(translationKey, categoryValue)
      // Return translation if it exists and is different from the key
      if (translated && translated !== translationKey) {
        return translated
      }
    }
    
    // Try direct translation as fallback
    const directTranslation = t(`products.filters.category.${categoryValue}`, categoryValue)
    // If direct translation returns something different from the key, use it
    if (directTranslation && directTranslation !== `products.filters.category.${categoryValue}`) {
      return directTranslation
    }
    
    // Last resort: return capitalized category value
    return categoryValue.charAt(0).toUpperCase() + categoryValue.slice(1)
  }
  
  return (
    <Card className="rounded-[32px] border border-border bg-card/80 backdrop-blur-sm shadow-premium">
      <CardContent className="p-4 md:p-6 space-y-4">
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-foreground mb-2">
            {t('products.filters.searchLabel', 'Caută produs / producător')}
          </label>
          <Input
            id="search"
            type="text"
            placeholder={t('products.filters.searchPlaceholder', 'Caută produs / producător...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
              {t('products.filters.categoryLabel', 'Categorie')}
            </label>
            <Select
              key={`category-select-${locale}`}
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full"
            >
              <option value="">{t('products.filters.allCategories', 'Toate categoriile')}</option>
              <option value="fruits">{t('products.filters.category.fruits', 'Fructe')}</option>
              <option value="vegetables">{t('products.filters.category.vegetables', 'Legume')}</option>
              <option value="dairy">{t('products.filters.category.dairy', 'Lactate')}</option>
              <option value="meat">{t('products.filters.category.meat', 'Carne')}</option>
              <option value="honey">{t('products.filters.category.honey', 'Miere & Dulcețuri')}</option>
              <option value="mixed">{t('products.filters.category.mixed', 'Pachet mixt')}</option>
            </Select>
          </div>

          {/* Region */}
          <div>
            <label htmlFor="region" className="block text-sm font-medium text-foreground mb-2">
              {t('products.filters.regionLabel', 'Regiune')}
            </label>
            <Select
              id="region"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full"
            >
              <option value="">{t('products.filters.allRegions', 'Toate regiunile')}</option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </Select>
          </div>

          {/* Min Price */}
          <div>
            <label htmlFor="minPrice" className="block text-sm font-medium text-foreground mb-2">
              {t('products.filters.minPriceLabel', 'Preț minim (RON)')}
            </label>
            <Input
              id="minPrice"
              type="number"
              placeholder={t('products.filters.minPricePlaceholder', 'Min')}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Max Price */}
          <div>
            <label htmlFor="maxPrice" className="block text-sm font-medium text-foreground mb-2">
              {t('products.filters.maxPriceLabel', 'Preț maxim (RON)')}
            </label>
            <Input
              id="maxPrice"
              type="number"
              placeholder={t('products.filters.maxPricePlaceholder', 'Max')}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            onClick={onApplyFilters}
            className="flex-1 rounded-full text-white transition-all duration-300"
            style={
              categoryColors
                ? {
                    backgroundColor: categoryColors.primary,
                    '--tw-shadow-color': categoryColors.shadow,
                  } as React.CSSProperties
                : undefined
            }
            onMouseEnter={(e) => {
              if (categoryColors) {
                e.currentTarget.style.backgroundColor = categoryColors.shadow
                e.currentTarget.style.boxShadow = `0 10px 25px -5px ${categoryColors.shadow}40, 0 0 0 2px ${categoryColors.primary}30`
              }
            }}
            onMouseLeave={(e) => {
              if (categoryColors) {
                e.currentTarget.style.backgroundColor = categoryColors.primary
                e.currentTarget.style.boxShadow = ''
              }
            }}
          >
            {t('products.filters.applyFilters', 'Aplică filtre')}
          </Button>
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="flex-1 rounded-full"
            >
              {t('products.filters.clearFilters', 'Șterge filtre')}
            </Button>
          )}
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="pt-4 border-t border-border">
            <p className="text-sm font-medium text-foreground mb-2">
              {t('products.filters.activeFilters', 'Filtre active:')}
            </p>
            <div className="flex flex-wrap gap-2">
              {search && (
                <Badge
                  variant="default"
                  className="cursor-pointer hover:bg-emerald-700 bg-emerald-600 text-white dark:bg-emerald-700 dark:text-emerald-50"
                  onClick={() => setSearch('')}
                >
                  {t('products.filters.searchBadgeLabel', 'Căutare')}: {search} ×
                </Badge>
              )}
              {selectedRegion && (
                <Badge
                  variant="default"
                  className="cursor-pointer hover:bg-emerald-700 bg-emerald-600 text-white dark:bg-emerald-700 dark:text-emerald-50"
                  onClick={() => setSelectedRegion('')}
                >
                  {regions.find((r) => r.id === selectedRegion)?.name || selectedRegion} ×
                </Badge>
              )}
              {selectedCategory && (
                <Badge
                  variant="default"
                  className="cursor-pointer hover:bg-emerald-700 bg-emerald-600 text-white dark:bg-emerald-700 dark:text-emerald-50"
                  onClick={() => setSelectedCategory('')}
                >
                  {getCategoryLabel(selectedCategory)} ×
                </Badge>
              )}
              {(minPrice || maxPrice) && (
                <Badge
                  variant="default"
                  className="cursor-pointer hover:bg-emerald-700 bg-emerald-600 text-white dark:bg-emerald-700 dark:text-emerald-50"
                  onClick={() => {
                    setMinPrice('')
                    setMaxPrice('')
                  }}
                >
                  {t('products.filters.priceRange', 'Preț')}: {minPrice || '0'} - {maxPrice || '∞'} {t('ui.currency.symbol', 'lei')} ×
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

