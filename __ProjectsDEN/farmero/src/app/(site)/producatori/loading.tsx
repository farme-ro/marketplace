/**
 * Producers Loading State
 * 
 * Loading state pentru pagina de producători
 */

import { ProducersHero } from './_components/producers-hero'
import { ProducerCardSkeleton } from './_components/producer-card-skeleton'

export default function ProducersLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <ProducersHero />

      {/* Filters Skeleton */}
      <section className="mx-auto max-w-6xl px-4 lg:px-8 mb-6 -mt-4">
        <div className="bg-white dark:bg-[#0B1220] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 md:p-6 animate-pulse">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          </div>
        </div>
      </section>

      {/* Producers Grid Skeleton */}
      <section className="mx-auto max-w-6xl px-4 lg:px-8 pb-12">
        <div className="mb-6">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-64 mb-2 animate-pulse" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-96 animate-pulse" />
        </div>
        <div className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProducerCardSkeleton key={index} />
          ))}
        </div>
      </section>
    </div>
  )
}

