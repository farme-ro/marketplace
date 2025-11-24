/**
 * Mobile Home Screen Component
 * 
 * Ecran principal pentru mobile cu carduri rapide
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent } from 'farme-ui'
import { Button } from 'farme-ui'

interface QuickStats {
  salesToday: number
  newOrders: number
  criticalStock: number
}

interface MobileHomeScreenProps {
  producerName?: string
  stats?: QuickStats
}

const defaultStats: QuickStats = {
  salesToday: 450,
  newOrders: 3,
  criticalStock: 2,
}

export function MobileHomeScreen({ 
  producerName = 'Ferma Popescu',
  stats = defaultStats 
}: MobileHomeScreenProps) {
  return (
    <div className="pb-20 md:pb-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">
          Bun venit, {producerName} <span className="text-primary">🌿</span>
        </h1>
        <p className="text-sm text-foreground-body">
          Iată o privire rapidă asupra afacerii tale
        </p>
      </motion.div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border border-border rounded-2xl shadow-premium bg-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground-body mb-1">Vânzări azi</p>
                  <p className="text-2xl font-bold text-foreground">{stats.salesToday} RON</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center">
                  <span className="text-xl">💰</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="border border-border rounded-2xl shadow-premium bg-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground-body mb-1">Comenzi noi</p>
                  <p className="text-2xl font-bold text-foreground">{stats.newOrders}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center">
                  <span className="text-xl">🧺</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {stats.criticalStock > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="border border-destructive/30 rounded-2xl shadow-premium bg-destructive/5">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground-body mb-1">Stoc critic</p>
                    <p className="text-2xl font-bold text-destructive">{stats.criticalStock} produse</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                    <span className="text-xl">⚠️</span>
                  </div>
                </div>
                <Link href="/portal-producatori/produse" className="block mt-3">
                  <Button size="sm" variant="outline" className="w-full border-destructive/30 text-destructive">
                    Gestionează stocul
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Floating Add Product Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="fixed bottom-24 right-4 z-40 md:hidden"
      >
        <Link href="/portal-producatori/produse/adauga">
          <Button
            size="lg"
            className="w-14 h-14 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground shadow-premium-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}

