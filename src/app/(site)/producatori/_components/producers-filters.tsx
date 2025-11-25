/**
 * Producers Filters Component
 * 
 * Bară de filtre și sortare pentru producători
 */

'use client'

import { Input } from 'farme-ui'
import { Select } from 'farme-ui'
import { useI18n } from '@/lib/i18n/context'

interface ProducersFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  regionFilter: string
  onRegionFilterChange: (value: string) => void
  typeFilter: string
  onTypeFilterChange: (value: string) => void
  sortBy: string
  onSortChange: (value: string) => void
}

export function ProducersFilters({
  search,
  onSearchChange,
  regionFilter,
  onRegionFilterChange,
  typeFilter,
  onTypeFilterChange,
  sortBy,
  onSortChange,
}: ProducersFiltersProps) {
  const { t } = useI18n()
  
  return (
    <section aria-label={t('producers.filters.ariaLabel', 'Filtre producători')} className="bg-white dark:bg-[#0B1220] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm px-4 py-3 md:px-6 md:py-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <Input
            type="text"
            placeholder={t('producers.filters.searchPlaceholder', 'Caută producător sau produs…')}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-full"
          />
        </div>

        {/* Region Filter */}
        <Select
          value={regionFilter}
          onChange={(e) => onRegionFilterChange(e.target.value)}
          className="w-full md:w-auto"
        >
          <option value="">{t('producers.filters.allRegions', 'Toată țara')}</option>
          <option value="transilvania">{t('producers.filters.regions.transilvania', 'Transilvania')}</option>
          <option value="moldova">{t('producers.filters.regions.moldova', 'Moldova')}</option>
          <option value="muntenia">{t('producers.filters.regions.muntenia', 'Muntenia')}</option>
          <option value="oltenia">{t('producers.filters.regions.oltenia', 'Oltenia')}</option>
          <option value="dobrogea">{t('producers.filters.regions.dobrogea', 'Dobrogea')}</option>
        </Select>

        {/* Type Filter Tags */}
        <div className="flex flex-wrap gap-2">
          {[
            { label: t('producers.filters.types.bio', 'Bio'), value: 'bio' },
            { label: t('producers.filters.types.traditional', 'Tradițional'), value: 'traditional' },
            { label: t('producers.filters.types.artisanal', 'Artizanal'), value: 'artisanal' },
            { label: t('producers.filters.types.national', 'Livrare națională'), value: 'national' },
          ].map(({ label, value }) => {
            const isActive = typeFilter === value
            return (
              <button
                key={value}
                onClick={() => onTypeFilterChange(isActive ? '' : value)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-500 text-white dark:bg-emerald-500 dark:text-slate-900'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* Sort */}
        <Select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full md:w-auto"
        >
          <option value="relevance">{t('producers.filters.sort.relevance', 'Relevanță')}</option>
          <option value="rating">{t('producers.filters.sort.rating', 'Rating')}</option>
          <option value="popular">{t('producers.filters.sort.popular', 'Cele mai populare')}</option>
        </Select>
    </section>
  )
}

