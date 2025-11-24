/**
 * Producer Guide Page
 * 
 * Ghid complet pentru producători despre cum să folosească platforma
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from 'farme-ui'
import { Button } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'

const steps = [
  {
    number: 1,
    title: 'Înregistrare',
    description: 'Creează contul tău de producător',
    details: 'Completează formularul de înregistrare cu datele tale și documentele necesare. Echipa noastră va verifica și aproba contul în cel mult 24 de ore.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    number: 2,
    title: 'Adaugă Produse',
    description: 'Încarcă produsele tale',
    details: 'Adaugă produsele tale cu fotografii de calitate, descrieri detaliate, prețuri și disponibilitate. Poți organiza produsele pe categorii și seta stocuri.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    number: 3,
    title: 'Gestionează Comenzile',
    description: 'Primește și procesează comenzile',
    details: 'Vei primi notificări pentru fiecare comandă nouă. Confirmă comenzile, pregătește produsele și marchează comenzile ca fiind gata pentru livrare.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    number: 4,
    title: 'Primește Plata',
    description: 'Plăți rapide și sigure',
    details: 'Plățile se transferă automat în contul tău bancar după finalizarea comenzilor. Poți alege frecvența plăților (săptămânal sau lunar).',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

const tips = [
  {
    title: 'Fotografii de calitate',
    description: 'Folosește fotografii clare și profesionale ale produselor. Clienții cumpără cu ochii!',
    icon: '📸',
  },
  {
    title: 'Descrieri detaliate',
    description: 'Include informații despre origine, metode de producție, ingrediente și beneficii.',
    icon: '📝',
  },
  {
    title: 'Prețuri competitive',
    description: 'Cercetează piața și oferă prețuri competitive, dar care să reflecte calitatea produselor.',
    icon: '💰',
  },
  {
    title: 'Răspunde rapid',
    description: 'Răspunde prompt la întrebările clienților și confirmă comenzile cât mai repede.',
    icon: '⚡',
  },
  {
    title: 'Actualizează stocul',
    description: 'Menține stocul actualizat pentru a evita dezamăgirile clienților.',
    icon: '📦',
  },
  {
    title: 'Promovează produsele',
    description: 'Folosește rețelele sociale și alte canale pentru a promova produsele tale pe platformă.',
    icon: '📢',
  },
]

const resources = [
  {
    title: 'Centru de Ajutor',
    description: 'Găsește răspunsuri la întrebările frecvente',
    link: '/faq',
    icon: '❓',
  },
  {
    title: 'Comisioane și Rate',
    description: 'Află totul despre structura de comisioane',
    link: '/portal-producatori/comisioane',
    icon: '💳',
  },
  {
    title: 'Contact',
    description: 'Contactează echipa noastră pentru suport',
    link: '/contact',
    icon: '📧',
  },
]

export default function ProducerGuidePage() {
  return (
    <section className="min-h-screen py-12 md:py-16 lg:py-20 bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2],
            x: [0, 50],
            y: [0, 30],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-40 h-40 bg-emerald-200/20 dark:bg-emerald-800/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3],
            x: [0, -40],
            y: [0, -20],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>

      <PageContainer className="relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-4">
            Ghid Producător
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary via-primary to-primary rounded-full mx-auto mb-6" />
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Tot ce trebuie să știi pentru a începe să vinzi produsele tale pe farme.ro
          </p>
        </motion.div>

        {/* Steps Section */}
        <div className="mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-2 text-center">
              Cum funcționează
            </h2>
            <p className="text-muted-foreground text-center">
              4 pași simpli pentru a începe să vinzi
            </p>
          </motion.div>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              >
                <Card className="border-border/60 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 bg-card/95 backdrop-blur-sm">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border-2 border-primary/30">
                          <div className="relative">
                            {step.icon}
                            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                              {step.number}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
                          {step.title}
                        </h3>
                        <p className="text-base text-muted-foreground mb-3 font-medium">
                          {step.description}
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {step.details}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-2 text-center">
              Sfaturi pentru succes
            </h2>
            <p className="text-muted-foreground text-center">
              Cum să maximizezi vânzările tale
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tips.map((tip, index) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              >
                <Card className="border-border/60 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 bg-card/95 backdrop-blur-sm h-full">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">{tip.icon}</div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {tip.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tip.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Resources Section */}
        <div className="mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-2 text-center">
              Resurse utile
            </h2>
            <p className="text-muted-foreground text-center">
              Link-uri și informații importante
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
              >
                <Link href={resource.link}>
                  <Card className="border-border/60 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 bg-card/95 backdrop-blur-sm h-full cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {resource.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {resource.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center"
        >
          <Card className="border border-border rounded-2xl shadow-lg bg-card">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-4">
                Gata să începi?
              </h2>
              <p className="text-base text-muted-foreground mb-8 max-w-2xl mx-auto">
                Creează contul tău de producător și începe să vinzi produsele tale direct clienților.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/portal-producatori/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Creează cont producător
                  </Button>
                </Link>
                <Link href="/portal-producatori/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Conectează-te
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </PageContainer>
    </section>
  )
}

