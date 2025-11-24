/**
 * FAQ Page Client Component
 * 
 * Client component pentru pagina FAQ cu interactivitate
 */

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import { Button } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n/context'

export default function FAQPageClient() {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState('platform')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqCategories = [
    {
      id: 'platform',
      title: t('faq.categories.platform.title', 'Despre platformă'),
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    color: 'emerald',
    questions: [
      {
        question: t('faq.categories.platform.q1.question', 'Ce este farme.ro?'),
        answer: t('faq.categories.platform.q1.answer', 'farme.ro este un marketplace online care conectează producătorii locali de produse agricole tradiționale cu clienții care caută produse autentice și de calitate. Oferim o platformă directă, fără intermediari, pentru a susține economia locală și a promova tradițiile românești.'),
      },
      {
        question: t('faq.categories.platform.q2.question', 'Cum funcționează farme.ro?'),
        answer: t('faq.categories.platform.q2.answer', 'Producătorii înregistrați pot adăuga produsele lor pe platformă. Clienții pot căuta, filtra și comanda produse direct de la producători. Fiecare comandă este procesată și livrată direct de la producător la client, asigurând proaspătatea și calitatea produselor.'),
      },
      {
        question: t('faq.categories.platform.q3.question', 'Sunt produsele verificate?'),
        answer: t('faq.categories.platform.q3.answer', 'Da, toți producătorii sunt verificați înainte de a-și putea lista produsele. Verificăm documentele, calitatea produselor și respectarea standardelor de siguranță alimentară.'),
      },
      {
        question: t('faq.categories.platform.q4.question', 'Cum pot găsi produsele pe care le caut?'),
        answer: t('faq.categories.platform.q4.answer', 'Poți căuta produse folosind bara de căutare, filtrarea după categorie, regiune sau preț. De asemenea, poți explora producătorii și produsele lor direct din paginile dedicate.'),
      },
    ],
  },
  {
    id: 'orders',
    title: t('faq.categories.orders.title', 'Comenzi și livrare'),
    anchorId: 'delivery',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    color: 'amber',
    questions: [
      {
        question: t('faq.categories.orders.q1.question', 'Cum pot plasa o comandă?'),
        answer: t('faq.categories.orders.q1.answer', 'Poți plasa o comandă selectând produsele dorite, adăugându-le în coș și finalizând comanda prin procesul de checkout. Vei primi confirmarea comenzii prin email și vei fi contactat de producător pentru detalii despre livrare.'),
      },
      {
        question: t('faq.categories.orders.q2.question', 'Cum se face livrarea?'),
        answer: t('faq.categories.orders.q2.answer', 'Livrarea este gestionată direct de către producător. Fiecare producător are propriile opțiuni de livrare și costuri. Detaliile despre livrare vor fi comunicate după plasarea comenzii.'),
      },
      {
        question: t('faq.categories.orders.q3.question', 'Pot anula o comandă?'),
        answer: t('faq.categories.orders.q3.answer', 'Anularea comenzii depinde de stadiul acesteia. Dacă comanda nu a fost încă procesată de producător, poți contacta producătorul direct sau echipa noastră de suport pentru anulare.'),
      },
      {
        question: t('faq.categories.orders.q4.question', 'Cât durează livrarea?'),
        answer: t('faq.categories.orders.q4.answer', 'Timpul de livrare variază în funcție de producător și locația ta. De obicei, comenzile sunt livrate în 2-7 zile lucrătoare. Producătorul te va informa despre timpul exact de livrare după plasarea comenzii.'),
      },
      {
        question: t('faq.categories.orders.q5.question', 'Pot urmări comanda mea?'),
        answer: t('faq.categories.orders.q5.answer', 'Da, vei primi notificări prin email despre statusul comenzii tale. De asemenea, poți verifica statusul comenzii din contul tău pe platformă.'),
      },
    ],
  },
  {
    id: 'payments',
    title: t('faq.categories.payments.title', 'Plăți'),
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    color: 'orange',
    questions: [
      {
        question: t('faq.categories.payments.q1.question', 'Ce metode de plată acceptați?'),
        answer: t('faq.categories.payments.q1.answer', 'Acceptăm plăți prin card bancar, transfer bancar și alte metode de plată securizate. Toate plățile sunt procesate prin intermediul unor servicii terțe sigure și certificate.'),
      },
      {
        question: t('faq.categories.payments.q2.question', 'Când se procesează plata?'),
        answer: t('faq.categories.payments.q2.answer', 'Plata este procesată după confirmarea comenzii de către producător. În cazul unor produse cu livrare precomandă, plata poate fi procesată parțial sau integral în funcție de politica producătorului.'),
      },
      {
        question: t('faq.categories.payments.q3.question', 'Este sigur să plătesc online?'),
        answer: t('faq.categories.payments.q3.answer', 'Da, toate plățile sunt procesate prin intermediul unor servicii terțe sigure și certificate. Nu stocăm informații despre cardurile de credit sau metodele de plată.'),
      },
      {
        question: t('faq.categories.payments.q4.question', 'Pot primi factură fiscală?'),
        answer: t('faq.categories.payments.q4.answer', 'Da, poți solicita factură fiscală la momentul plasării comenzii. Factura va fi emisă de către producător și trimisă împreună cu produsele sau prin email.'),
      },
      {
        question: t('faq.categories.payments.q5.question', 'Ce se întâmplă dacă plata nu este acceptată?'),
        answer: t('faq.categories.payments.q5.answer', 'Dacă plata nu este acceptată, vei primi o notificare și vei putea încerca din nou cu o altă metodă de plată. Comanda nu va fi procesată până când plata nu este confirmată.'),
      },
    ],
  },
  {
    id: 'producers',
    title: t('faq.categories.producers.title', 'Pentru producători'),
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    color: 'primary',
    questions: [
      {
        question: t('faq.categories.producers.q1.question', 'Cum mă pot înregistra ca producător?'),
        answer: t('faq.categories.producers.q1.answer', 'Poți crea un cont de producător accesând pagina "Pentru producători" și completând formularul de înregistrare. Vei fi contactat de echipa noastră pentru verificare și aprobare.'),
      },
      {
        question: t('faq.categories.producers.q2.question', 'Care sunt comisioanele?'),
        answer: t('faq.categories.producers.q2.answer', 'Comisioanele variază în funcție de tipul de produs și volumul de vânzări. Detaliile complete despre comisioane și plăți sunt disponibile în portalul producătorilor după înregistrare.'),
      },
      {
        question: t('faq.categories.producers.q3.question', 'Cum gestionez comenzile?'),
        answer: t('faq.categories.producers.q3.answer', 'După înregistrare, vei avea acces la un portal dedicat unde poți gestiona produsele, comenzile, stocurile și plățile. Vei primi notificări pentru fiecare comandă nouă.'),
      },
      {
        question: t('faq.categories.producers.q4.question', 'Cum primesc plata pentru produsele vândute?'),
        answer: t('faq.categories.producers.q4.answer', 'Plata este transferată în contul tău bancar după finalizarea și livrarea comenzii. Frecvența plăților poate fi configurată în portalul producătorilor.'),
      },
      {
        question: t('faq.categories.producers.q5.question', 'Ce documente sunt necesare pentru înregistrare?'),
        answer: t('faq.categories.producers.q5.answer', 'Pentru înregistrare ca producător, vei avea nevoie de documente de identificare, documente care atestă activitatea ta agricolă și, dacă este cazul, autorizații sanitare pentru produsele tale.'),
      },
    ],
  },
]

  const activeCategory = faqCategories.find(cat => cat.id === activeTab) || faqCategories[0]

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'emerald':
        return {
          bg: 'bg-emerald-500/10',
          text: 'text-emerald-600 dark:text-emerald-400',
          border: 'border-emerald-500/20',
          hover: 'hover:border-emerald-500/50',
          active: 'bg-emerald-500/20 border-emerald-500/50',
        }
      case 'amber':
        return {
          bg: 'bg-primary/10',
          text: 'text-primary',
          border: 'border-primary/20',
          hover: 'hover:border-primary/50',
          active: 'bg-primary/20 border-primary/50',
        }
      case 'orange':
        return {
          bg: 'bg-orange-500/10',
          text: 'text-orange-600 dark:text-orange-400',
          border: 'border-orange-500/20',
          hover: 'hover:border-orange-500/50',
          active: 'bg-orange-500/20 border-orange-500/50',
        }
      default:
        return {
          bg: 'bg-primary/10',
          text: 'text-primary',
          border: 'border-primary/20',
          hover: 'hover:border-primary/50',
          active: 'bg-primary/20 border-primary/50',
        }
    }
  }

  const colors = getColorClasses(activeCategory.color)

  return (
    <>
      {/* Hero Section */}
      <section className="py-12 md:py-16 lg:py-24 bg-background relative overflow-hidden">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-4">
                  {t('faq.hero.title', 'Întrebări frecvente')}
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-primary via-primary to-primary rounded-full mb-6" />
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base md:text-lg text-muted-foreground leading-relaxed"
              >
                {t('faq.hero.description', 'Găsește răspunsuri rapide la cele mai frecvente întrebări despre farme.ro. Dacă nu găsești ce cauți, suntem aici să te ajutăm.')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <Link href="/contact">
                  <Button size="lg" className="w-full sm:w-auto">
                    {t('faq.hero.button1', 'Contactează-ne')}
                  </Button>
                </Link>
                <Link href="/for-producers">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    {t('faq.hero.button2', 'Pentru producători')}
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Column - Icon/Visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/20 to-primary/20 rounded-3xl blur-2xl"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <div className="relative w-full h-full bg-card rounded-3xl border border-border flex items-center justify-center p-12">
                  <motion.div
                    className={`w-32 h-32 ${colors.bg} ${colors.text} rounded-3xl flex items-center justify-center border-2 ${colors.border}`}
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, -5, 5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </PageContainer>
      </section>

      {/* FAQ Content Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
        {/* Anchor for delivery */}
        <div id="delivery" className="scroll-mt-20" />
        {/* Subtle background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <PageContainer className="relative z-10">
          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-3 justify-center">
              {faqCategories.map((category) => {
                const isActive = activeTab === category.id
                const catColors = getColorClasses(category.color)
                
                return (
                  <motion.button
                    key={category.id}
                    onClick={() => {
                      setActiveTab(category.id)
                      setOpenIndex(null)
                    }}
                    className={`
                      flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300
                      ${isActive 
                        ? `${catColors.active} ${catColors.text} border-2 shadow-md` 
                        : 'bg-card border-2 border-border/60 text-muted-foreground hover:border-border hover:bg-muted/50'
                      }
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className={isActive ? catColors.text : 'text-muted-foreground'}>
                      {category.icon}
                    </span>
                    <span>{category.title}</span>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <div className="space-y-3">
                {activeCategory.questions.map((faq, faqIndex) => {
                  const isOpen = openIndex === faqIndex
                  
                  return (
                    <motion.div
                      key={faqIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: faqIndex * 0.05 }}
                      whileHover={{ y: -2 }}
                    >
                      <Card className={`
                        border rounded-2xl transition-all duration-300 overflow-hidden
                        ${isOpen 
                          ? `${colors.border} shadow-md` 
                          : 'border-border/40 hover:border-border/60 shadow-sm hover:shadow-md'
                        }
                      `}>
                        {/* Subtle gradient background when open */}
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pointer-events-none"
                          />
                        )}
                        
                        <CardContent padding="none" className="relative z-10">
                          <button
                            onClick={() => setOpenIndex(isOpen ? null : faqIndex)}
                            className={`
                              w-full text-left p-5 md:p-6 lg:p-7 flex items-start gap-4 
                              transition-all duration-300 rounded-2xl
                              ${isOpen 
                                ? 'bg-transparent' 
                                : 'hover:bg-muted/30'
                              }
                            `}
                          >
                            <div className="flex-1 min-w-0 pt-0.5">
                              <h3 className={`
                                text-base md:text-lg lg:text-xl font-semibold leading-snug transition-colors duration-300
                                ${isOpen ? colors.text : 'text-foreground'}
                              `}>
                                {faq.question}
                              </h3>
                            </div>
                            <motion.div
                              animate={{ 
                                rotate: isOpen ? 180 : 0,
                                scale: isOpen ? 1.05 : 1
                              }}
                              transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
                              className={`
                                flex-shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center
                                transition-all duration-300 mt-0.5
                                ${isOpen 
                                  ? `${colors.bg} ${colors.text} border-2 ${colors.border} shadow-sm` 
                                  : 'bg-muted/50 text-muted-foreground border border-border/40 hover:bg-muted/70'
                                }
                              `}
                            >
                              <svg
                                className="w-5 h-5 md:w-6 md:h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth={2.5}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                              </svg>
                            </motion.div>
                          </button>
                          
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="overflow-hidden"
                              >
                                <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0">
                                  <div className="pt-4 border-t border-border/30">
                                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed pt-4">
                                      {faq.answer}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </PageContainer>
      </section>

      {/* Intermediate Section - Full Width */}
      <section className="py-12 md:py-16 lg:py-20 bg-muted relative overflow-hidden">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground mb-4">
                  {t('faq.cta.title', 'Ai nevoie de ajutor suplimentar?')}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-primary via-primary to-primary rounded-full mb-6" />
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base md:text-lg text-muted-foreground leading-relaxed"
              >
                {t('faq.cta.description', 'Dacă ai întrebări specifice sau ai nevoie de asistență personalizată, echipa noastră este aici să te ajute. Contactează-ne și îți vom răspunde în cel mai scurt timp posibil.')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 pt-2"
              >
                <Link href="/contact">
                  <Button size="lg" className="w-full sm:w-auto">
                    {t('faq.cta.button1', 'Contactează-ne')}
                  </Button>
                </Link>
                <Link href="/for-producers">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    {t('faq.cta.button2', 'Devino producător')}
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Column - Visual/Stats */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              <Card className="border-border/60 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 bg-card/50 backdrop-blur-sm">
                <CardContent padding="lg" className="text-center">
                  <div className={`w-16 h-16 ${colors.bg} ${colors.text} rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 ${colors.border}`}>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-1">24h</h3>
                  <p className="text-sm text-muted-foreground">{t('faq.stats.responseTime', 'Răspuns garantat')}</p>
                </CardContent>
              </Card>

              <Card className="border-border/60 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 bg-card/50 backdrop-blur-sm">
                <CardContent padding="lg" className="text-center">
                  <div className={`w-16 h-16 ${colors.bg} ${colors.text} rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 ${colors.border}`}>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-1">100%</h3>
                  <p className="text-sm text-muted-foreground">{t('faq.stats.dedicatedSupport', 'Suport dedicat')}</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </PageContainer>
      </section>

      {/* Additional Resources Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <PageContainer className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto space-y-8"
          >
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground mb-4">
                {t('faq.resources.title', 'Resurse suplimentare')}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary via-primary to-primary rounded-full mx-auto mb-6" />
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                {t('faq.resources.description', 'Explorează mai multe informații despre farme.ro și cum poți beneficia de platforma noastră')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Link href="/despre-noi">
                  <Card className="border-border/60 rounded-2xl hover:shadow-lg transition-all duration-300 hover:border-primary/40 h-full">
                    <CardContent padding="lg" className="text-center">
                      <div className="w-14 h-14 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{t('faq.resources.about.title', 'Despre noi')}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t('faq.resources.about.description', 'Află mai multe despre misiunea și valorile farme.ro')}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -4 }}
              >
                <Link href="/for-producers">
                  <Card className="border border-border rounded-2xl hover:shadow-lg transition-all duration-300 hover:border-primary/40 h-full">
                    <CardContent padding="lg" className="text-center">
                      <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{t('faq.resources.producers.title', 'Pentru producători')}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t('faq.resources.producers.description', 'Devino producător și vinde produsele tale pe platformă')}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -4 }}
              >
                <Link href="/contact">
                  <Card className="border border-border rounded-2xl hover:shadow-lg transition-all duration-300 hover:border-primary/40 h-full">
                    <CardContent padding="lg" className="text-center">
                      <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{t('faq.resources.contact.title', 'Contact')}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t('faq.resources.contact.description', 'Trimite-ne un mesaj și îți vom răspunde rapid')}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </PageContainer>
      </section>
    </>
  )
}
