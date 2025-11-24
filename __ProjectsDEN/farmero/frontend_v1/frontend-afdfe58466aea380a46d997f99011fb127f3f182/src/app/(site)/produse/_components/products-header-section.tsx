/**
 * Products Header Section
 * 
 * Header section pentru pagina de produse
 */

'use client'

import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n/context'

export function ProductsHeaderSection() {
  const { t } = useI18n()
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-3 mb-8"
    >
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground">
        {t('products.header.title', 'Produse de la producători locali')}
      </h1>
      <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
        {t('products.header.description', 'Alege din produse de sezon, direct de la producători. Preț de producător, fără supermarket între voi.')}
      </p>
    </motion.section>
  )
}

