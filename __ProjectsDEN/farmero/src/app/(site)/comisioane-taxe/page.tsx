/**
 * Fees & Commissions Page
 * 
 * Pagină publică care explică transparent comisioanele și taxele pentru clienți
 * Refactored with modern UI aligned with B2B page
 */

'use client'

import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent } from 'farme-ui'
import { useI18n } from '@/lib/i18n/context'
import { 
  DollarSign, 
  Shield, 
  Eye, 
  User, 
  Package, 
  Truck, 
  CreditCard, 
  Banknote,
  Leaf,
  Building2,
  HelpCircle,
  ChevronDown,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils/cn'

// Note: Metadata is handled in layout.tsx or via next/head if needed
// This is a client component for interactivity (accordion, animations)

export default function FeesPage() {
  const { t } = useI18n()
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  const faqItems = [
    {
      question: t('fees.faq.q1.question', 'Mai plătesc și altceva în afară de ce văd la checkout?'),
      answer: t('fees.faq.q1.answer', 'Nu. Tot ce vezi în pagina de checkout este tot ce plătești. Nu adăugăm comisioane ascunse sau taxe suplimentare după ce confirmi comanda.'),
    },
    {
      question: t('fees.faq.q2.question', 'De ce costă livrarea atât?'),
      answer: t('fees.faq.q2.answer', 'Costul de livrare depinde de distanță, greutate și metoda de livrare. Fiecare producător gestionează propriile livrări, iar costurile sunt stabilite de ei sau de partenerii lor de logistică. Vei vedea costul exact înainte să confirmi comanda.'),
    },
    {
      question: t('fees.faq.q3.question', 'Pot să văd cât primește producătorul din comanda mea?'),
      answer: t('fees.faq.q3.answer', 'În prezent, vezi valoarea totală a produselor și costul de livrare. Pe măsură ce dezvoltăm platforma, vom afișa și mai clar distribuția exactă: cât merge la producător, cât către livrare și cât către platformă.'),
    },
    {
      question: t('fees.faq.q4.question', 'Comisionul se schimbă pentru anumite comenzi?'),
      answer: t('fees.faq.q4.answer', 'Comisionul platformei este consistent și transparent. Nu variază în funcție de tipul de produs sau de valoarea comenzii. Dacă există diferențe (de exemplu, pentru plata ramburs), acestea vor fi afișate clar înainte să confirmi comanda.'),
    },
    {
      question: t('fees.faq.q5.question', 'Există costuri ascunse sau taxe suplimentare?'),
      answer: t('fees.faq.q5.answer', 'Nu. Tot ce plătești este afișat clar în pagina de checkout: valoarea produselor, costul de livrare și comisionul platformei. Nu există costuri ascunse sau taxe suplimentare care să apară după ce confirmi comanda.'),
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden bg-background">
        {/* Background decoration */}
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
        </div>

        <PageContainer className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft/30 px-4 py-1.5 text-xs font-medium text-primary"
            >
              <Shield className="w-3 h-3" />
              {t('fees.hero.badge', 'Transparent pentru clienți și producători')}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground"
            >
              {t('fees.hero.title', 'Comisioane & taxe explicate simplu')}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg sm:text-xl md:text-2xl text-foreground-body max-w-3xl mx-auto leading-relaxed"
            >
              {t('fees.hero.subtitle', 'Pe farme.ro, plătești produse la preț de producător și vezi clar ce înseamnă costul de livrare și comisionul platformei. Fără surprize ascunse.')}
            </motion.p>

            {/* Pill Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 max-w-4xl mx-auto"
            >
              <Card className="border border-border rounded-2xl shadow-sm bg-card/95 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center mb-4 mx-auto">
                    <DollarSign className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {t('fees.hero.pill1.title', 'Preț de producător')}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('fees.hero.pill1.description', 'Produsele sunt listate de producători reali, iar prețurile sunt stabilite de ei.')}
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-border rounded-2xl shadow-sm bg-card/95 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center mb-4 mx-auto">
                    <Eye className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {t('fees.hero.pill2.title', 'Comision transparent')}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('fees.hero.pill2.description', 'O parte mică din valoarea comenzii merge către farme.ro, pentru funcționarea și dezvoltarea platformei.')}
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-border rounded-2xl shadow-sm bg-card/95 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center mb-4 mx-auto">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {t('fees.hero.pill3.title', 'Fără costuri ascunse')}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('fees.hero.pill3.description', 'Vezi costul final înainte să confirmi comanda, inclusiv livrarea.')}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </PageContainer>
      </section>

      {/* Producer Price Section - 2 Column */}
      <section className="py-16 md:py-24 bg-muted/30">
        <PageContainer>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
          >
            {/* Left Column - Explanation */}
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                {t('fees.producerPrice.title', 'Ce înseamnă "preț de producător"?')}
              </h2>
              <p className="text-base md:text-lg text-foreground-body leading-relaxed max-w-2xl">
                {t('fees.producerPrice.description', 'farme.ro este un marketplace. Asta înseamnă că nu noi stabilim prețurile produselor, ci producătorii. Ei își setează prețul corect pentru munca lor, iar tu vezi acele prețuri direct în platformă. farme.ro reține doar un comision transparent pentru a putea funcționa și a promova produsele lor.')}
              </p>
            </div>

            {/* Right Column - Mini Cards */}
            <div className="space-y-4">
              <Card className="border border-border rounded-xl shadow-sm bg-card">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-soft flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2">
                        {t('fees.producerPrice.forClient.title', 'Pentru tine, ca și client')}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t('fees.producerPrice.forClient.description', 'Plătești un preț corect, direct de la sursă, fără adaosuri neclare pe drum.')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border rounded-xl shadow-sm bg-card">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-soft flex items-center justify-center flex-shrink-0 mt-1">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2">
                        {t('fees.producerPrice.forProducer.title', 'Pentru producător')}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t('fees.producerPrice.forProducer.description', 'Primește mai mult din valoarea finală a coșului și poate să își planifice mai bine producția și livrările.')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </PageContainer>
      </section>

      {/* Order Breakdown Section - Receipt Style */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                {t('fees.orderBreakdown.title', 'Ce plătești atunci când comanzi')}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
              {/* Main Receipt Card */}
              <Card className="border border-border rounded-2xl shadow-sm bg-card">
                <CardContent className="p-6 md:p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-6">
                    {t('fees.orderBreakdown.subtitle', 'Structura unei comenzi tipice')}
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Product Value */}
                    <div className="space-y-2 pb-4 border-b border-border">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">
                          {t('fees.orderBreakdown.products.label', '1. Valoarea produselor')}
                        </span>
                        <span className="text-sm font-medium text-primary">
                          {t('fees.orderBreakdown.products.destination', '→ producător')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t('fees.orderBreakdown.products.description', 'Suma produselor pe care le alegi. Acești bani merg, în cea mai mare parte, direct la producător.')}
                      </p>
                    </div>

                    {/* Shipping Cost */}
                    <div className="space-y-2 pb-4 border-b border-border">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">
                          {t('fees.orderBreakdown.shipping.label', '2. Costul de livrare')}
                        </span>
                        <span className="text-sm font-medium text-primary">
                          {t('fees.orderBreakdown.shipping.destination', '→ curier / logistică')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t('fees.orderBreakdown.shipping.description', 'Stabilit în funcție de distanță, greutate și metoda de livrare (livrare la adresă sau punct de ridicare, acolo unde este disponibil).')}
                      </p>
                    </div>

                    {/* Commission */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">
                          {t('fees.orderBreakdown.commission.label', '3. Comision farme.ro')}
                        </span>
                        <span className="text-sm font-medium text-primary">
                          {t('fees.orderBreakdown.commission.destination', '→ platformă')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t('fees.orderBreakdown.commission.description', 'Un procent mic din valoarea comenzii, folosit pentru operarea platformei, suport, dezvoltare, promovarea producătorilor și proiectele de impact social.')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Important Card */}
              <Card className="border border-primary/20 rounded-2xl shadow-sm bg-primary-soft/10">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start gap-3 mb-6">
                    <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <h4 className="font-semibold text-foreground">
                      {t('fees.orderBreakdown.important.title', 'Important:')}
                    </h4>
                  </div>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    {[
                      t('fees.orderBreakdown.important.points.0', 'Vezi întotdeauna costul final înainte să confirmi comanda.'),
                      t('fees.orderBreakdown.important.points.1', 'Nu adăugăm comisioane ascunse în ultimul pas.'),
                      t('fees.orderBreakdown.important.points.2', 'În timp, vom afișa și mai clar cât merge la producător și cât către platformă.'),
                    ].map((point, index) => (
                      <li key={index} className="flex items-start gap-3 py-1">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                        <span className="leading-relaxed flex-1">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </PageContainer>
      </section>

      {/* Payment Comparison - Side by Side */}
      <section className="py-16 md:py-24 bg-muted/30">
        <PageContainer>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                {t('fees.payment.title', 'Plata cu cardul vs plata ramburs')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card Payment */}
              <Card className="border-2 border-primary/30 rounded-2xl shadow-sm bg-card relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-medium text-primary">
                    <CheckCircle2 className="w-3 h-3" />
                    {t('fees.payment.card.badge', 'Recomandat')}
                  </span>
                </div>
                <CardContent className="p-6 md:p-8 pt-12">
                  <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center mb-4">
                    <CreditCard className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {t('fees.payment.card.title', 'Plata cu cardul (recomandat)')}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {t('fees.payment.card.description', 'Este cea mai sigură și eficientă variantă atât pentru tine, cât și pentru producători. Comanda este confirmată, iar riscul de produse neridicate este mai mic.')}
                  </p>
                  <ul className="space-y-3">
                    {[
                      t('fees.payment.card.points.0', 'Proces mai rapid la livrare.'),
                      t('fees.payment.card.points.1', 'Mai puțin risc de risipă alimentară.'),
                      t('fees.payment.card.points.2', 'Poate veni cu beneficii suplimentare (recompense, oferte), pe viitor.'),
                    ].map((point, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground py-1">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                        <span className="leading-relaxed flex-1">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Cash on Delivery */}
              <Card className="border border-border rounded-2xl shadow-sm bg-card relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
                    <AlertCircle className="w-3 h-3" />
                    {t('fees.payment.cash.badge', 'Limitată / în funcție de zonă')}
                  </span>
                </div>
                <CardContent className="p-6 md:p-8 pt-12">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
                    <Banknote className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {t('fees.payment.cash.title', 'Plata ramburs (acolo unde este disponibilă)')}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {t('fees.payment.cash.description', 'În anumite situații, poți plăti direct la livrare. Pentru a proteja producătorii de comenzi neridicate, pot exista taxe suplimentare de logistică pentru acest tip de plată.')}
                  </p>
                  <ul className="space-y-3">
                    {[
                      t('fees.payment.cash.points.0', 'Pot exista taxe suplimentare de manipulare/transport în cazul rambursului.'),
                      t('fees.payment.cash.points.1', 'Opțiunea poate fi limitată pentru utilizatori cu multe comenzi neridicate.'),
                      t('fees.payment.cash.points.2', 'Detaliile exacte vor fi afișate clar în pagina de checkout.'),
                    ].map((point, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground py-1">
                        <AlertCircle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                        <span className="leading-relaxed flex-1">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </PageContainer>
      </section>

      {/* Earnings - Twin Cards */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                {t('fees.earnings.title', 'Cum câștigă producătorii. Cum câștigă farme.ro.')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Producers Card */}
              <Card className="border border-border rounded-2xl shadow-sm bg-card">
                <CardContent className="p-6 md:p-8">
                  <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center mb-4">
                    <Leaf className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {t('fees.earnings.producers.title', 'Producătorii')}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('fees.earnings.producers.description', 'Producătorii încasează suma produselor vândute, minus un comision clar al platformei. În schimb, primesc acces la clienți noi, vizibilitate online, instrumente de gestionare a comenzilor și, în viitor, opțiuni de promovare.')}
                  </p>
                </CardContent>
              </Card>

              {/* Platform Card */}
              <Card className="border border-border rounded-2xl shadow-sm bg-card">
                <CardContent className="p-6 md:p-8">
                  <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center mb-4">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {t('fees.earnings.platform.title', 'farme.ro')}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('fees.earnings.platform.description', 'Platforma câștigă dintr-un comision mic pe tranzacție și, eventual, din abonamente pentru producători sau servicii extra. Scopul este să rămânem un loc corect și echilibrat pentru toată lumea: clienți, producători și comunitate.')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </PageContainer>
      </section>

      {/* FAQ Section - Accordion */}
      <section className="py-16 md:py-24 bg-muted/30">
        <PageContainer>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                {t('fees.faq.title', 'Întrebări frecvente')}
              </h2>
            </div>

            <div className="space-y-4">
              {faqItems.map((item, index) => {
                const isOpen = openFaqIndex === index
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <Card className="border border-border rounded-xl shadow-sm bg-card">
                      <CardContent className="p-0">
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                          className="w-full p-6 md:p-8 flex items-center justify-between gap-4 text-left hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-8 h-8 rounded-lg bg-primary-soft flex items-center justify-center flex-shrink-0 mt-1">
                              <HelpCircle className="w-4 h-4 text-primary" />
                            </div>
                            <h3 className="text-base font-semibold text-foreground flex-1 leading-relaxed">
                              {item.question}
                            </h3>
                          </div>
                          <ChevronDown
                            className={cn(
                              "w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform",
                              isOpen && "rotate-180"
                            )}
                          />
                        </button>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="px-6 md:px-8 pb-6 md:pb-8"
                          >
                            <p className="text-sm text-foreground-body leading-relaxed pl-12">
                              {item.answer}
                            </p>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </PageContainer>
      </section>
    </div>
  )
}
