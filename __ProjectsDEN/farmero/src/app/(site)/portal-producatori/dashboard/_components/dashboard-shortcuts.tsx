/**
 * Dashboard Shortcuts Component
 * 
 * Secțiuni cu link-uri rapide către zonele importante
 */

'use client'

import Link from 'next/link'
import { Card, CardContent } from 'farme-ui'
import { Button } from 'farme-ui'
import { motion } from 'framer-motion'

interface Shortcut {
  title: string
  description: string
  href: string
  icon: string
  bullets?: string[]
}

const shortcuts: Shortcut[] = [
  {
    title: 'Gestionează produse',
    description: 'Actualizează prețuri, stocuri și disponibilitatea produselor tale.',
    href: '/portal-producatori/produse',
    icon: '📦',
    bullets: [
      'Activează/dezactivează produse',
      'Actualizează prețuri și stocuri',
      'Adaugă produse noi',
    ],
  },
  {
    title: 'Vezi comenzi',
    description: 'Gestionează comenzile primite și statusul livrărilor.',
    href: '/portal-producatori/comenzi',
    icon: '🧺',
    bullets: [
      'Comenzi noi și în procesare',
      'Istoric comenzi',
      'Status livrări',
    ],
  },
  {
    title: 'Vezi comisioane & plăți',
    description: 'Transparență totală asupra comisioanelor și încasărilor.',
    href: '/portal-producatori/comisioane',
    icon: '💰',
    bullets: [
      'Comisioane actuale',
      'Istoric plăți',
      'Abonamente disponibile',
    ],
  },
  {
    title: 'Statistici & Insights',
    description: 'Analizează performanța produselor și vânzărilor tale.',
    href: '/producer-portal/insights',
    icon: '📊',
    bullets: [
      'Vânzări pe perioade',
      'Produse bestseller',
      'Recomandări AI',
    ],
  },
  {
    title: 'Promovare & Marketing',
    description: 'Folosește tool-urile de promovare pentru a crește vânzările.',
    href: '/portal-producatori/marketing-promovare',
    icon: '🚀',
    bullets: [
      'Auto-poster social media',
      'Generator descrieri SEO',
      'Bannere promo',
    ],
  },
  {
    title: 'Setări & Profil',
    description: 'Gestionează informațiile despre fermă și preferințele tale.',
    href: '/producer-portal/settings',
    icon: '⚙️',
    bullets: [
      'Date despre fermă',
      'Preferințe livrare',
      'Notificări',
    ],
  },
]

export function DashboardShortcuts() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">
          Acces rapid
        </h2>
        <p className="text-sm text-muted-foreground">
          Zonele importante ale platformei, la un click distanță.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shortcuts.map((shortcut, index) => (
          <motion.div
            key={shortcut.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
          >
            <Card className="rounded-[32px] border border-border bg-card shadow-premium hover:shadow-premium-lg transition-all duration-300 h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary-soft flex items-center justify-center text-2xl flex-shrink-0">
                    {shortcut.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-1">
                      {shortcut.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {shortcut.description}
                    </p>
                  </div>
                </div>

                {shortcut.bullets && (
                  <ul className="space-y-2 mb-4 flex-1">
                    {shortcut.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground-body">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <Link href={shortcut.href} className="mt-auto">
                  <Button
                    variant="outline"
                    className="w-full rounded-full"
                  >
                    Vezi detalii
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

