/**
 * Producer Shipping Guide Page
 * 
 * Ghid livrări & logistică pentru producători
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, Button } from 'farme-ui'
import { ProducerDashboardLayout } from '@/components/producer-portal/producer-dashboard-layout'
import { Truck, Package, Box, ArrowRight, CheckCircle2 } from 'lucide-react'

const sections = [
  {
    title: 'Cum funcționează livrarea prin farme.ro',
    icon: Truck,
    items: [
      'După ce un client plasează o comandă, vei primi o notificare',
      'Confirmă comanda doar dacă ai produsele disponibile în stoc',
      'Pregătește produsele conform comenzii și marchează ca "În pregătire"',
      'Când produsele sunt gata, marchează comanda ca "Trimisă" și adaugă tracking number',
      'Clientul primește notificare și poate urmări comanda',
    ],
  },
  {
    title: 'Opțiuni: curier la adresă / easybox / pickup point',
    icon: Box,
    items: [
      'Livrare la adresă: cel mai comun mod, clientul primește comanda acasă',
      'Easybox / Pachetomat: disponibil pentru produsele care pot fi lăsate în pachetomat (în limita timpului de siguranță alimentară)',
      'Pickup point: unele producători oferă ridicare direct de la fermă (opțiune opțională)',
      'Alege metoda cea mai potrivită pentru tipul de produse pe care le oferi',
    ],
  },
  {
    title: 'Cum se gestionează coletele neridicate',
    icon: Package,
    items: [
      'Dacă un client nu ridică comanda în termenul stabilit, platforma gestionează automat procesul',
      'Comenzile neridicate pot fi redirecționate către donații (pentru produsele care permit)',
      'Tu nu rămâi cu marfa stricată - platforma asigură gestionarea',
      'Pentru produsele perisabile, se aplică politici speciale de siguranță alimentară',
    ],
  },
  {
    title: 'Ce se întâmplă cu produsele donate',
    icon: ArrowRight,
    items: [
      'Produsele donate sunt redirecționate către organizații caritabile parteneri',
      'Platforma gestionează logistica donațiilor',
      'Tu primești confirmarea donației și poți vedea impactul social',
      'Donațiile contribuie la reducerea risipei alimentare',
    ],
  },
]

export default function ProducerShippingGuidePage() {
  return (
    <ProducerDashboardLayout>
      <div className="max-w-8xl mx-auto px-4 py-10 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
            Ghid Livrări & Logistică
          </h1>
          <p className="text-base text-foreground-body">
            Ghid complet pentru livrarea produselor pe farme.ro
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {sections.map((section, index) => {
            const Icon = section.icon
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="border border-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 bg-card h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h2 className="text-lg font-semibold text-foreground">
                        {section.title}
                      </h2>
                    </div>
                    <ul className="space-y-3">
                      {section.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-foreground-body py-1">
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                          <span className="leading-relaxed flex-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <Card className="border border-border rounded-2xl shadow-sm bg-card">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Important de știut
            </h2>
            <div className="space-y-3 text-sm text-foreground-body">
              <p>
                <strong className="text-foreground">Termene de livrare:</strong> Comunică clienților termenele
                realiste de livrare. Transparența este esențială.
              </p>
              <p>
                <strong className="text-foreground">Comenzi neridicate:</strong> Dacă un client nu ridică comanda,
                platforma gestionează redirecționarea către donații (acolo unde este posibil).
                Tu nu rămâi cu marfa stricată.
              </p>
              <p>
                <strong className="text-foreground">Suport:</strong> Dacă ai întrebări despre logistică, contactează
                echipa noastră prin secțiunea de suport.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Link 
            href="/portal-producatori/comenzi"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            Vezi comenzile
          </Link>
          <Link 
            href="/portal-producatori/suport"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            Contactează suportul
          </Link>
        </div>
      </div>
    </ProducerDashboardLayout>
  )
}

