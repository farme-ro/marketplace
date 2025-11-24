/**
 * Checkout Header Component
 * 
 * Header-ul checkout-ului cu mesaj social
 */

'use client'

import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n/context'

export function CheckoutHeader() {
  const { t } = useI18n()
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-center space-y-3 mb-8"
    >
      <h1 className="text-2xl md:text-3xl font-bold text-foreground">
        {t('checkout.header.title', 'Comanda ta sprijină producătorii locali și comunitățile vulnerabile')}
      </h1>
      <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        {t('checkout.header.subtitle', 'Fiecare comandă plasată pe Farme.ro înseamnă produse mai proaspete pentru tine și susținere reală pentru economia locală.')}
      </p>
    </motion.div>
  )
}

