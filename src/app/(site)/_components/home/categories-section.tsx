/**
 * Categories Section Component - Redesigned
 * 
 * Secțiunea "Browse by Category / Caută după categorie" cu design modern
 * Folosește CategoryCard component pentru consistență
 */

'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { useI18n } from '@/lib/i18n/context'
import { CategoryCard } from '@/components/categories/category-card'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { getCategoryColor } from '@/lib/categories/category-colors'
import { Apple, Milk, Beef, Cookie, GlassWater, Wheat } from 'lucide-react'

// Beautiful, professional icons from lucide-react - inspired by agricultural elements
const CategoryIcons = {
  VegetablesFruits: (props: React.SVGProps<SVGSVGElement> & { color?: string }) => (
    <Apple {...props} strokeWidth={2.5} />
  ),
  Dairy: (props: React.SVGProps<SVGSVGElement> & { color?: string }) => (
    <Milk {...props} strokeWidth={2.5} />
  ),
  Meat: (props: React.SVGProps<SVGSVGElement> & { color?: string }) => (
    <Beef {...props} strokeWidth={2.5} />
  ),
  Sweets: (props: React.SVGProps<SVGSVGElement> & { color?: string }) => (
    <Cookie {...props} strokeWidth={2.5} />
  ),
  LocalDrinks: (props: React.SVGProps<SVGSVGElement> & { color?: string }) => (
    <GlassWater {...props} strokeWidth={2.5} />
  ),
  Other: (props: React.SVGProps<SVGSVGElement> & { color?: string }) => (
    <Wheat {...props} strokeWidth={2.5} />
  ),
}

function CategoriesContent() {
  const { t } = useI18n()
  const searchParams = useSearchParams()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  
  // Detect active category from URL
  const activeCategory = useMemo(() => {
    return searchParams?.get('category') || null
  }, [searchParams])

  // Ordinea corectă pentru potențial de coș (conform cerințelor)
  const categories = [
    {
      id: 'legume-fructe',
      name: t('home.categories.vegetablesFruits', 'Legume & fructe'),
      slug: 'legume-fructe',
      icon: CategoryIcons.VegetablesFruits,
      description: t('home.categories.vegetablesFruitsDesc', 'Produse proaspete de sezon'),
    },
    {
      id: 'lactate',
      name: t('home.categories.dairy', 'Lactate'),
      slug: 'lactate',
      icon: CategoryIcons.Dairy,
      description: t('home.categories.dairyDesc', 'Lactate și brânzeturi locale'),
    },
    {
      id: 'carne-mezeluri',
      name: t('home.categories.meat', 'Carne & mezeluri'),
      slug: 'carne-mezeluri',
      icon: CategoryIcons.Meat,
      description: t('home.categories.meatDesc', 'Carne și mezeluri tradiționale'),
    },
    {
      id: 'dulciuri',
      name: t('home.categories.sweets', 'Dulciuri'),
      slug: 'dulciuri',
      icon: CategoryIcons.Sweets,
      description: t('home.categories.sweetsDesc', 'Dulciuri și conserve tradiționale'),
    },
    {
      id: 'bauturi-locale',
      name: t('home.categories.localDrinks', 'Băuturi locale'),
      slug: 'bauturi-locale',
      icon: CategoryIcons.LocalDrinks,
      description: t('home.categories.localDrinksDesc', 'Sucuri și băuturi naturale'),
    },
    {
      id: 'altele',
      name: t('home.categories.other', 'Altele'),
      slug: 'altele',
      icon: CategoryIcons.Other,
      description: t('home.categories.otherDesc', 'Alte produse locale'),
    },
  ]

  // Auto-scroll carousel pe mobil
  useEffect(() => {
    if (typeof window === 'undefined') return
    const isMobile = window.innerWidth < 768
    if (!isMobile || !scrollContainerRef.current) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % categories.length
        const container = scrollContainerRef.current
        if (container) {
          const cardWidth = 150 + 16 // min-w-[150px] + gap-4
          container.scrollTo({
            left: next * cardWidth,
            behavior: 'smooth',
          })
        }
        return next
      })
    }, 4000) // Schimbă la fiecare 4 secunde

    return () => clearInterval(interval)
  }, [categories.length])

  return (
    <section className="relative py-16 md:py-20 border-b border-border/40 bg-gradient-to-b from-background via-background to-muted/20 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary-soft/5 rounded-full blur-3xl" />
      </div>
      
      <PageContainer className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-10 md:space-y-12"
        >
          {/* Section Title - Enhanced */}
          <div className="text-center space-y-3">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-3 tracking-tight"
            >
              {t('home.categories.title', 'Browse by Category')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              {t('home.categories.subtitle', 'Discover products from local producers')}
            </motion.p>
          </div>

          {/* Mobile: Auto-scroll carousel */}
          <div 
            ref={scrollContainerRef}
            className="md:hidden overflow-x-auto pb-6 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex gap-4 min-w-max">
              {categories.map((category, index) => {
                const colors = getCategoryColor(category.slug)
                const IconComponent = category.icon
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, x: -30, scale: 0.9 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ 
                      duration: 0.4, 
                      delay: index * 0.08,
                      type: "spring",
                      stiffness: 100
                    }}
                    className="snap-start flex-shrink-0"
                  >
                    <CategoryCard
                      id={category.id}
                      icon={<IconComponent className="w-9 h-9" color={colors.icon} />}
                      label={category.name}
                      description={category.description}
                      href={`/products?category=${category.slug}`}
                      isActive={activeCategory === category.slug}
                      selectedLabel={activeCategory === category.slug ? t('home.categories.selected', 'Selectat') : undefined}
                      aria-label={t('home.categories.categoryAria', 'Vezi produse din categoria {{category}}').replace('{{category}}', category.name)}
                      className="w-[160px] h-[200px]"
                      categorySlug={category.slug}
                    />
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Tablet & Desktop: Grid layout - Enhanced */}
          <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5 lg:gap-6 pt-8 md:pt-10">
            {categories.map((category, index) => {
              const colors = getCategoryColor(category.slug)
              const IconComponent = category.icon
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.08,
                    type: "spring",
                    stiffness: 100
                  }}
                  className="h-full min-h-[220px]"
                >
                  <CategoryCard
                    id={category.id}
                    icon={<IconComponent className="w-10 h-10 md:w-12 md:h-12" color={colors.icon} />}
                    label={category.name}
                    description={category.description}
                    href={`/products?category=${category.slug}`}
                    isActive={activeCategory === category.slug}
                    selectedLabel={activeCategory === category.slug ? t('home.categories.selected', 'Selectat') : undefined}
                    aria-label={t('home.categories.categoryAria', 'Vezi produse din categoria {{category}}').replace('{{category}}', category.name)}
                    className="h-full w-full"
                    categorySlug={category.slug}
                  />
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </PageContainer>
    </section>
  )
}

export function CategoriesSection() {
  return (
    <Suspense fallback={
      <section className="relative py-16 md:py-20 border-b border-border/40 bg-gradient-to-b from-background via-background to-muted/20">
        <PageContainer>
          <div className="space-y-10 md:space-y-12">
            <div className="text-center space-y-3">
              <div className="h-10 w-64 bg-muted rounded-lg mx-auto mb-3 animate-pulse" />
              <div className="h-5 w-96 bg-muted/60 rounded-lg mx-auto animate-pulse" />
            </div>
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5 lg:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-40 bg-muted rounded-3xl animate-pulse" />
              ))}
            </div>
          </div>
        </PageContainer>
      </section>
    }>
      <CategoriesContent />
    </Suspense>
  )
}
