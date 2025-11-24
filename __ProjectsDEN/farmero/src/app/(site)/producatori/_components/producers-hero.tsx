/**
 * Producers Page Hero Section
 * 
 * Hero section pentru pagina de producători
 */

'use client'

import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n/context'

export function ProducersHero() {
  const { t } = useI18n()
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-4 lg:px-8 pt-10 pb-6 lg:pt-12 lg:pb-8">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-8 items-center">
          {/* Stânga */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              {t('producers.hero.title', 'Producători locali din toată România')}
            </h1>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('producers.hero.description', 'Descoperă producători de încredere, cu prețuri direct de la sursă și produse atent selectate. Susții gospodăriile locale de fiecare dată când comanzi.')}
            </p>

            {/* Bullets */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <svg className="w-4 h-4 text-[#3BAF6A] dark:text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{t('producers.hero.badge1', 'Preț de producător')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <svg className="w-4 h-4 text-[#3BAF6A] dark:text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{t('producers.hero.badge2', 'Produse locale & tradiționale')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <svg className="w-4 h-4 text-[#3BAF6A] dark:text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{t('producers.hero.badge3', 'Sprijini direct gospodăriile din România')}</span>
              </div>
            </div>

            {/* Statistici */}
            <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300 mt-4">
              <span>120+ {t('producers.hero.stats.producers', 'producători')}</span>
              <span>•</span>
              <span>20+ {t('producers.hero.stats.counties', 'județe acoperite')}</span>
              <span>•</span>
              <span>1000+ {t('producers.hero.stats.products', 'produse active')}</span>
            </div>
          </motion.div>

          {/* Dreapta - Featured Producer Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:block"
          >
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1220] shadow-md p-4 flex flex-col gap-3">
              {/* Nume producător */}
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-1">
                  {t('producers.hero.example.name', 'Stâna de sub munte')}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {t('producers.hero.example.location', 'Brașov, zona montană')}
                </p>
              </div>

              {/* 2 produse exemplu */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-700 dark:text-slate-300">• {t('producers.hero.example.product1', 'Brânză maturată – de la 25 lei')}</p>
                <p className="text-xs text-slate-700 dark:text-slate-300">• {t('producers.hero.example.product2', 'Telemea de casă – de la 22 lei')}</p>
              </div>

              {/* Badge Producător verificat */}
              <div className="pt-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#3BAF6A]/10 dark:bg-emerald-500/10 text-[#3BAF6A] dark:text-emerald-400 border border-[#3BAF6A]/20 dark:border-emerald-500/20">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {t('producers.hero.example.verified', 'Producător verificat')}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

