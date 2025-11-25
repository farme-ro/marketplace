/**
 * Quick Actions Section
 * 
 * Secțiune cu acțiuni rapide pentru producători
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent } from 'farme-ui'
import { Button } from 'farme-ui'
import { Plus, ShoppingBasket, Package, Truck, Settings } from 'lucide-react'

const quickActions = [
  {
    title: 'Adaugă produs nou',
    description: 'Creează un produs nou în catalog',
    href: '/portal-producatori/produse/adauga',
    icon: Plus,
    color: 'bg-primary-soft',
    iconColor: 'text-primary',
  },
  {
    title: 'Vezi comenzi noi',
    description: 'Gestionează comenzile primite',
    href: '/portal-producatori/comenzi?status=pending',
    icon: ShoppingBasket,
    color: 'bg-blue-50 dark:bg-blue-950/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    title: 'Actualizează stocurile',
    description: 'Gestionează stocurile produselor',
    href: '/portal-producatori/produse',
    icon: Package,
    color: 'bg-amber-50 dark:bg-amber-950/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    title: 'Vezi ghid de livrare',
    description: 'Informații despre livrare',
    href: '/portal-producatori/ghid-livrare',
    icon: Truck,
    color: 'bg-green-50 dark:bg-green-950/20',
    iconColor: 'text-green-600 dark:text-green-400',
  },
]

export function QuickActionsSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border border-border rounded-2xl shadow-sm bg-card">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Acțiuni rapide
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-all duration-200 group-hover:shadow-md h-full"
                  >
                    <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-3`}>
                      <Icon className={`w-5 h-5 ${action.iconColor}`} />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {action.description}
                    </p>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

