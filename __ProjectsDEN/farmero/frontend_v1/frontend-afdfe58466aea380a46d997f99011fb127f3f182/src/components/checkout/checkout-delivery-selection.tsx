/**
 * Checkout Delivery Selection Component
 * 
 * Selecție mod livrare cu mesaje contextuale
 */

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import { useState } from 'react'
import { useI18n } from '@/lib/i18n/context'

type DeliveryMethod = 'address' | 'easybox' | null

interface CheckoutDeliverySelectionProps {
  value: DeliveryMethod
  onChange: (method: DeliveryMethod) => void
}

export function CheckoutDeliverySelection({ value, onChange }: CheckoutDeliverySelectionProps) {
  const { t } = useI18n()
  const [showEasyboxWarning, setShowEasyboxWarning] = useState(false)

  const handleMethodChange = (method: DeliveryMethod) => {
    onChange(method)
    if (method === 'easybox') {
      setShowEasyboxWarning(true)
    } else {
      setShowEasyboxWarning(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {t('checkout.delivery.title', 'Mod de livrare')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={`cursor-pointer border-2 transition-all duration-300 ${
                value === 'address'
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border/60 hover:border-primary/40'
              }`}
              onClick={() => handleMethodChange('address')}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🚚</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-2">
                      {t('checkout.delivery.address.title', 'Livrare la adresă')}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {t('checkout.delivery.address.description', 'Produsele sunt livrate direct la adresa ta')}
                    </p>
                  </div>
                  {value === 'address' && (
                    <div className="w-5 h-5 rounded-full bg-primary border-2 border-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={`cursor-pointer border-2 transition-all duration-300 ${
                value === 'easybox'
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border/60 hover:border-primary/40'
              }`}
              onClick={() => handleMethodChange('easybox')}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">📦</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-2">
                      {t('checkout.delivery.easybox.title', 'Livrare în Easybox / punct ridicare')}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {t('checkout.delivery.easybox.description', 'Ridică comanda din punctul de pick-up ales')}
                    </p>
                  </div>
                  {value === 'easybox' && (
                    <div className="w-5 h-5 rounded-full bg-primary border-2 border-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {showEasyboxWarning && value === 'easybox' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl"
        >
          <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
            <strong className="font-semibold">{t('checkout.delivery.easybox.warning', 'Produsele alimentare sunt sensibile. Te rugăm să le ridici în intervalul indicat pentru a menține calitatea.')}</strong>
          </p>
        </motion.div>
      )}
    </div>
  )
}

