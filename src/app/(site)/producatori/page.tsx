/**
 * Producers Page
 * 
 * Pagină cu lista de producători - redesign modern
 */

'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { getProducers, type ProducerSummary } from '@/lib/api/public/producers'
import { ProducerCard } from '@/components/producers/producer-card'
import { ProducerCardSkeleton } from './_components/producer-card-skeleton'
import { ProducersEmptyState } from './_components/producers-empty-state'
import { ProducersErrorState } from './_components/producers-error-state'
import { useI18n } from '@/lib/i18n/context'
import { PageContainer } from '@/components/layout/page-container'
import { Badge } from 'farme-ui'

export default function ProducersPage() {
  const { t } = useI18n()
  const [producers, setProducers] = useState<ProducerSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filter states
  const [search, setSearch] = useState('')
  const [regionFilter, setRegionFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [sortBy, setSortBy] = useState('relevance')

  // Fetch producers
  useEffect(() => {
    async function fetchProducers() {
      try {
        setIsLoading(true)
        setError(null)
        const response = await getProducers({ pageSize: 50 })
        setProducers(response.data || [])
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('[ProducersPage] Error fetching producers:', err)
        }
        setError(t('producers.errors.loadFailed', 'Eroare la încărcarea producătorilor'))
        setProducers([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Filter producers
  const filteredProducers = useMemo(() => {
    let filtered = [...producers]

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower) ||
        p.regionName?.toLowerCase().includes(searchLower) ||
        p.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    // Region filter
    if (regionFilter) {
      filtered = filtered.filter(p => {
        const regionLower = p.regionName?.toLowerCase() || ''
        return regionLower.includes(regionFilter.toLowerCase())
      })
    }

    // Type filter
    if (typeFilter) {
      filtered = filtered.filter(p => {
        if (typeFilter === 'bio') {
          return p.tags?.some(tag => tag.toLowerCase().includes('bio'))
        }
        if (typeFilter === 'traditional') {
          return p.tags?.some(tag => tag.toLowerCase().includes('tradițional'))
        }
        if (typeFilter === 'artisanal') {
          return p.tags?.some(tag => tag.toLowerCase().includes('artizanal'))
        }
        return true
      })
    }

    // Sort
    if (sortBy === 'rating') {
      // Note: Sort by rating will be available when rating data is provided by backend API
      filtered.sort((a, b) => (b.productCount || 0) - (a.productCount || 0))
    } else if (sortBy === 'popular') {
      filtered.sort((a, b) => (b.productCount || 0) - (a.productCount || 0))
    }

    return filtered
  }, [producers, search, regionFilter, typeFilter, sortBy])

  const handleResetFilters = () => {
    setSearch('')
    setRegionFilter('')
    setTypeFilter('')
    setSortBy('relevance')
  }

  // Check if there are active filters
  const hasActiveFilters = !!(search || regionFilter || typeFilter || (sortBy && sortBy !== 'relevance'))
  
  // Get translated filter labels for active filters display
  const getFilterLabel = (type: 'region' | 'type' | 'sort', value: string): string => {
    if (type === 'region') {
      return t(`producers.filters.regions.${value}`, value)
    }
    if (type === 'type') {
      return t(`producers.filters.types.${value}`, t(`producers.filters.${value}`, value))
    }
    if (type === 'sort') {
      return t(`producers.filters.sort.${value}`, t(`producers.filters.sort${value.charAt(0).toUpperCase() + value.slice(1)}`, value))
    }
    return value
  }

  // Map ProducerSummary to ProducerCardProps
  const mapToCardProps = (producer: ProducerSummary, index: number) => {
    // Generate consistent mock data based on index (pentru demo)
    // Note: Replace with real data when rating and review count are available from API
    const mockRating = 4.5 + (index % 5) * 0.1
    const mockRatingCount = 10 + (index % 40) * 2

    return {
      id: producer.id,
      name: producer.name,
      slug: producer.slug,
      regionName: producer.regionName || undefined,
      rating: mockRating,
      ratingCount: mockRatingCount,
      tags: producer.tags || [],
      isVerified: producer.status === 'APPROVED',
      isTopProducer: index < 3,
      thumbnailUrl: producer.avatarUrl || producer.imageUrl || undefined,
      featuredProducts: [
        { name: t('producers.card.exampleProduct1', 'Brânză maturată de capră'), priceText: `${t('ui.price.from', 'de la')} 25 ${t('ui.currency.symbol', 'lei')}` },
        { name: t('producers.card.exampleProduct2', 'Miere polifloră'), priceText: `${t('ui.price.from', 'de la')} 30 ${t('ui.currency.symbol', 'lei')}` },
      ],
      deliveryOptions: [
        t('producers.card.deliveryCourier', 'Livrare curier'),
        t('producers.card.deliveryLocal', 'Ridicare locală'),
      ],
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HERO */}
      <section className="border-b border-slate-200/60 bg-gradient-to-b from-emerald-50/80 via-transparent to-transparent py-12 md:py-16 lg:py-20 dark:border-slate-800/60 dark:from-[#050816] dark:via-transparent">
        <PageContainer>
          <div className="flex flex-col gap-8 md:grid md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl dark:text-slate-50">
              {t('producers.hero.title', 'Producători locali din toată România')}
            </h1>
            <p className="max-w-xl text-sm text-slate-600 md:text-base dark:text-slate-300">
              {t('producers.hero.description', 'Descoperă producători de încredere, cu prețuri direct de la sursă și produse atent selectate. Susții gospodăriile locale de fiecare dată când comanzi.')}
            </p>

            <ul className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600 dark:text-slate-300">
              <li className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>{t('producers.hero.badge1', 'Preț de producător')}</span>
              </li>
              <li className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>{t('producers.hero.badge2', 'Produse locale & tradiționale')}</span>
              </li>
              <li className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>{t('producers.hero.badge3', 'Sprijini direct gospodăriile din România')}</span>
              </li>
            </ul>

            {/* statistici mini */}
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  120+
                </p>
                <p>{t('producers.hero.stats.producers', 'producători')}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  20+
                </p>
                <p>{t('producers.hero.stats.counties', 'județe acoperite')}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  1000+
                </p>
                <p>{t('producers.hero.stats.products', 'produse active')}</p>
              </div>
            </div>
          </div>

          {/* Card lateral „featured producer" */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#0B1220]">
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
              {t('producers.hero.example.label', 'Exemplu producător')}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-50">
              {t('producers.hero.example.name', 'Stâna de sub munte')}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('producers.hero.example.location', 'Brașov, zona montană')}
            </p>

            <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <p>• {t('producers.hero.example.product1', 'Brânză maturată – de la 25 lei')}</p>
              <p>• {t('producers.hero.example.product2', 'Telemea de casă – de la 22 lei')}</p>
              <p>• {t('producers.hero.example.product3', 'Urda proaspătă – de la 18 lei')}</p>
            </div>

            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              {t('producers.hero.example.note', 'Produse făcute în gospodărie, livrate direct către tine, fără intermediari.')}
            </p>
          </div>
          </div>
        </PageContainer>
      </section>

      {/* FILTRE */}
      <section className="py-6">
        <PageContainer>
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm md:flex-row md:items-center md:justify-between md:gap-4 md:px-6 md:py-4 dark:border-slate-800 dark:bg-[#0B1220]">
          {/* Search */}
          <div className="flex flex-1 items-center gap-2">
            <input
              type="text"
              placeholder={t('producers.filters.searchPlaceholder', 'Caută producător sau produs…')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none ring-0 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
          </div>

          {/* Filtre rapide */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {[
              { label: t('producers.filters.types.bio', t('producers.filters.bio', 'Bio')), value: 'bio' },
              { label: t('producers.filters.types.traditional', t('producers.filters.traditional', 'Tradițional')), value: 'traditional' },
              { label: t('producers.filters.types.artisanal', t('producers.filters.artisanal', 'Artizanal')), value: 'artisanal' },
            ].map(({ label, value }) => {
              const isActive = typeFilter === value
              return (
                <button
                  key={value}
                  onClick={() => setTypeFilter(isActive ? '' : value)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-500 text-white dark:bg-emerald-500 dark:text-slate-900'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>

          {/* Sortare */}
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <span className="hidden md:inline">{t('producers.filters.sortLabel', 'Sortează după')}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="relevance">{t('producers.filters.sort.relevance', t('producers.filters.sortRelevance', 'Relevanță'))}</option>
              <option value="rating">{t('producers.filters.sort.rating', t('producers.filters.sortRating', 'Rating'))}</option>
              <option value="popular">{t('producers.filters.sort.popular', t('producers.filters.sortPopular', 'Cele mai populare'))}</option>
            </select>
          </div>
          </div>
        </PageContainer>
      </section>

      {/* Active Filters */}
      {hasActiveFilters && (
        <section className="py-4 border-b border-slate-200 dark:border-slate-800">
          <PageContainer>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {t('producers.filters.activeFilters', 'Filtre active:')}
              </span>
              {search && (
                <Badge
                  variant="default"
                  className="cursor-pointer hover:bg-emerald-700 bg-emerald-600 text-white dark:bg-emerald-700 dark:text-emerald-50"
                  onClick={() => setSearch('')}
                >
                  {t('producers.filters.searchLabel', 'Căutare')}: {search} ×
                </Badge>
              )}
              {regionFilter && (
                <Badge
                  variant="default"
                  className="cursor-pointer hover:bg-emerald-700 bg-emerald-600 text-white dark:bg-emerald-700 dark:text-emerald-50"
                  onClick={() => setRegionFilter('')}
                >
                  {getFilterLabel('region', regionFilter)} ×
                </Badge>
              )}
              {typeFilter && (
                <Badge
                  variant="default"
                  className="cursor-pointer hover:bg-emerald-700 bg-emerald-600 text-white dark:bg-emerald-700 dark:text-emerald-50"
                  onClick={() => setTypeFilter('')}
                >
                  {getFilterLabel('type', typeFilter)} ×
                </Badge>
              )}
              {sortBy && sortBy !== 'relevance' && (
                <Badge
                  variant="default"
                  className="cursor-pointer hover:bg-emerald-700 bg-emerald-600 text-white dark:bg-emerald-700 dark:text-emerald-50"
                  onClick={() => setSortBy('relevance')}
                >
                  {t('producers.filters.sortLabel', 'Sortează după')}: {getFilterLabel('sort', sortBy)} ×
                </Badge>
              )}
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-muted ml-auto border-emerald-600 text-emerald-700 dark:border-emerald-500 dark:text-emerald-400"
                onClick={handleResetFilters}
              >
                {t('producers.filters.clearAll', 'Șterge toate filtrele')}
              </Badge>
            </div>
          </PageContainer>
        </section>
      )}

      {/* GRID PRODUCĂTORI */}
      <section className="py-12">
        <PageContainer>
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 md:text-xl dark:text-slate-50">
                {t('producers.available', 'Producători disponibili')}
              </h2>
              <p className="mt-1 text-xs text-slate-500 md:text-sm dark:text-slate-400">
                {t('producers.chooseDescription', 'Alege producătorii preferați și comandă direct din gospodăriile lor.')}
              </p>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <ProducerCardSkeleton key={index} />
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <ProducersErrorState onRetry={() => window.location.reload()} />
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredProducers.length === 0 && (
            <ProducersEmptyState onResetFilters={handleResetFilters} />
          )}

          {/* Producers Grid */}
          {!isLoading && !error && filteredProducers.length > 0 && (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducers.map((producer, index) => (
                <motion.div
                  key={producer.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                >
                  <ProducerCard {...mapToCardProps(producer, index)} />
                </motion.div>
              ))}
            </div>
          )}
        </PageContainer>
      </section>
    </div>
  )
}
