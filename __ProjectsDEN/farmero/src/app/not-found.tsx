/**
 * 404 Not Found Page
 * 
 * Pagină creativă și frumoasă pentru erorile 404
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import { SiteLayoutClient } from '@/components/layout/site-layout-client'
import { useI18n } from '@/lib/i18n/context'
import { 
  Home, 
  Search, 
  ShoppingCart, 
  ArrowLeft,
  Leaf,
  Package,
  Sprout,
} from 'lucide-react'

export default function NotFound() {
  const { t } = useI18n()
  return (
    <SiteLayoutClient>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center relative overflow-hidden py-12 md:py-16 lg:py-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-primary-soft/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-80 h-80 bg-secondary-soft/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, -25, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>

      <PageContainer className="relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - 404 Number and Message */}
            <div className="text-center lg:text-left">
              {/* Animated 404 number */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, type: 'spring' }}
                className="mb-6"
              >
                <div className="relative inline-block">
                  <h1 className="text-8xl md:text-9xl lg:text-[10rem] font-black text-primary/20 select-none">
                    404
                  </h1>
                  {/* Floating leaves decoration */}
                  <motion.div
                    className="absolute top-0 left-1/4"
                    animate={{
                      y: [0, -20, 0],
                      rotate: [0, 10, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <Leaf className="w-6 h-6 md:w-8 md:h-8 text-primary/40" />
                  </motion.div>
                  <motion.div
                    className="absolute top-1/3 right-1/4"
                    animate={{
                      y: [0, -15, 0],
                      rotate: [0, -10, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: 0.5,
                    }}
                  >
                    <Sprout className="w-5 h-5 md:w-6 md:h-6 text-primary/40" />
                  </motion.div>
                  <motion.div
                    className="absolute bottom-0 left-1/3"
                    animate={{
                      y: [0, -25, 0],
                      rotate: [0, 15, 0],
                    }}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: 1,
                    }}
                  >
                    <Leaf className="w-6 h-6 md:w-7 md:h-7 text-primary/40" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Main message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-6"
              >
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3">
                  {t('notFound.title', 'Oops! Pagina nu a fost găsită')}
                </h2>
                <p className="text-base md:text-lg text-muted-foreground">
                  {t('notFound.description', 'Se pare că pagina pe care o cauți s-a rătăcit în câmp... Dar nu-ți face griji, te ajutăm să găsești drumul înapoi!')}
                </p>
              </motion.div>

              {/* Quick links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-6"
              >
                <p className="text-sm text-muted-foreground mb-4">
                  {t('notFound.maybeInterested', 'Poate te interesează:')}
                </p>
                <div className="flex flex-wrap items-center gap-3 justify-center lg:justify-start">
                  <Link href="/">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary-soft/20"
                    >
                      <Home className="w-4 h-4" />
                      {t('notFound.home', 'Acasă')}
                    </Button>
                  </Link>
                  <Link href="/produse">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary-soft/20"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {t('notFound.products', 'Produse')}
                    </Button>
                  </Link>
                  <Link href="/produse">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary-soft/20"
                    >
                      <Search className="w-4 h-4" />
                      {t('notFound.search', 'Căutare')}
                    </Button>
                  </Link>
                </div>
              </motion.div>

              {/* Back button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex justify-center lg:justify-start"
              >
                <Button
                  onClick={() => window.history.back()}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('notFound.back', 'Înapoi')}
                </Button>
              </motion.div>

              {/* Fun message */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-6 text-sm text-muted-foreground"
              >
                {t('notFound.funMessage', 'P.S. Dacă ai văzut o legumă rătăcită, te rugăm să ne anunți! 🥕')}
              </motion.p>
            </div>

            {/* Right Column - Animated illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center justify-center"
            >
              <div className="relative w-full max-w-md aspect-square">
                {/* Main package icon */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl bg-primary-soft/30 flex items-center justify-center">
                    <Package className="w-20 h-20 md:w-24 md:h-24 text-primary" />
                  </div>
                </motion.div>
                
                {/* Floating elements */}
                <motion.div
                  className="absolute top-0 left-0"
                  animate={{
                    x: [0, 20, 0],
                    y: [0, -15, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Leaf className="w-10 h-10 md:w-12 md:h-12 text-primary/50" />
                </motion.div>
                <motion.div
                  className="absolute top-0 right-0"
                  animate={{
                    x: [0, -20, 0],
                    y: [0, -10, 0],
                    rotate: [360, 180, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.5,
                  }}
                >
                  <Sprout className="w-8 h-8 md:w-10 md:h-10 text-primary/50" />
                </motion.div>
                <motion.div
                  className="absolute bottom-0 left-1/4"
                  animate={{
                    x: [0, 15, 0],
                    y: [0, 10, 0],
                    rotate: [0, -180, -360],
                  }}
                  transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1,
                  }}
                >
                  <Leaf className="w-9 h-9 md:w-11 md:h-11 text-primary/50" />
                </motion.div>
                <motion.div
                  className="absolute bottom-1/4 right-0"
                  animate={{
                    x: [0, -15, 0],
                    y: [0, 12, 0],
                    rotate: [360, 180, 0],
                  }}
                  transition={{
                    duration: 4.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1.5,
                  }}
                >
                  <Sprout className="w-7 h-7 md:w-9 md:h-9 text-primary/50" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </PageContainer>
    </div>
    </SiteLayoutClient>
  )
}
