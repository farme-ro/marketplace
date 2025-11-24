/**
 * How It Works & Social Impact Page
 * 
 * Pagină premium care explică funcționarea platformei și impactul social
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from 'farme-ui'
import { Button } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import { useI18n } from '@/lib/i18n/context'

// Icon components
const ProducerIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

const ClientIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
)

const CommunityIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
)

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const ArrowIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
)

export default function HowItWorksPage() {
  const { t } = useI18n()

  const steps = [
    {
      number: '1',
      title: t('howItWorks.steps.step1.title', 'Alegi produse locale'),
      description: t('howItWorks.steps.step1.description', 'Explorează gama variată de produse tradiționale și bio de la producători verificați din toată România.'),
      icon: '🛒',
    },
    {
      number: '2',
      title: t('howItWorks.steps.step2.title', 'Comanzi direct de la producători'),
      description: t('howItWorks.steps.step2.description', 'Fără intermediari. Comanda ta ajunge direct la producător, asigurând prețuri corecte și prospețime maximă.'),
      icon: '📦',
    },
    {
      number: '3',
      title: t('howItWorks.steps.step3.title', 'Livrarea este gestionată de aceștia'),
      description: t('howItWorks.steps.step3.description', 'Producătorii gestionează propriile livrări, asigurând control total asupra calității și prospețimii produselor.'),
      icon: '🚚',
    },
    {
      number: '4',
      title: t('howItWorks.steps.step4.title', 'Tu contribui la economia locală'),
      description: t('howItWorks.steps.step4.description', 'Fiecare comandă susține direct fermierii și producătorii locali, creând un impact real în comunități.'),
      icon: '💚',
    },
  ]

  const impactScenarios = [
    {
      title: t('howItWorks.impact.scenario1.title', 'Susținere directă'),
      description: t('howItWorks.impact.scenario1.description', 'Comenzile tale susțin fermierii locali, permițându-le să continue tradițiile și să dezvolte afaceri sustenabile.'),
      icon: '🌾',
      color: 'from-emerald-500/10 to-emerald-600/5',
    },
    {
      title: t('howItWorks.impact.scenario2.title', 'Zero risipă'),
      description: t('howItWorks.impact.scenario2.description', 'Produsele neridicate devin sprijin pentru alții. Transformăm fiecare comandă într-o oportunitate de solidaritate.'),
      icon: '♻️',
      color: 'from-primary/10 to-primary/20',
    },
    {
      title: t('howItWorks.impact.scenario3.title', 'Comunități mai puternice'),
      description: t('howItWorks.impact.scenario3.description', 'Consumul responsabil creează comunități. Fiecare achiziție contribuie la o economie locală mai rezilientă.'),
      icon: '🤝',
      color: 'from-primary/10 to-primary/20',
    },
  ]

  const producerBenefits = [
    t('howItWorks.producerBenefits.benefit1', 'Control total asupra stocului'),
    t('howItWorks.producerBenefits.benefit2', 'Posibilitatea de a dezactiva produse instant'),
    t('howItWorks.producerBenefits.benefit3', 'Transparență asupra comenzilor'),
    t('howItWorks.producerBenefits.benefit4', 'Expunere națională'),
    t('howItWorks.producerBenefits.benefit5', 'Instrumente digitale pentru promovare'),
  ]
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 lg:py-32 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-64 h-64 bg-emerald-200/20 dark:bg-emerald-800/20 rounded-full blur-3xl"
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
          <motion.div
            className="absolute bottom-20 right-10 w-80 h-80 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -40, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
          />
        </div>

        <PageContainer className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto space-y-8"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground"
            >
              {t('howItWorks.hero.title', 'Cum funcționează Farme.ro și cum transformăm fiecare comandă într-un impact real')}
            </motion.h1>
            <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary to-primary rounded-full mx-auto" />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl md:text-2xl text-muted-foreground leading-relaxed"
            >
              {t('howItWorks.hero.subtitle', 'Marketplace-ul care conectează producători locali, clienți responsabili și comunități care au nevoie de sprijin.')}
            </motion.p>

            {/* Visual chain: Producer → Client → Community */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center justify-center gap-4 md:gap-8 mt-12"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border-2 border-emerald-500/30">
                  <ProducerIcon className="w-10 h-10" />
                </div>
                <span className="text-sm font-semibold text-foreground">{t('howItWorks.hero.chain.producer', 'Producător')}</span>
              </div>
              <ArrowIcon className="w-8 h-8 text-muted-foreground hidden md:block" />
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border-2 border-primary/30">
                  <ClientIcon className="w-10 h-10" />
                </div>
                <span className="text-sm font-semibold text-foreground">{t('howItWorks.hero.chain.client', 'Client')}</span>
              </div>
              <ArrowIcon className="w-8 h-8 text-muted-foreground hidden md:block" />
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border-2 border-primary/30">
                  <CommunityIcon className="w-10 h-10" />
                </div>
                <span className="text-sm font-semibold text-foreground">{t('howItWorks.hero.chain.community', 'Comunitate')}</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
            >
              <Link href="#how-it-works">
                <Button size="lg" className="w-full sm:w-auto">
                  {t('howItWorks.hero.button1', 'Vezi cum funcționează')}
                </Button>
              </Link>
              <Link href="#social-impact">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  {t('howItWorks.hero.button2', 'Impactul tău social')}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </PageContainer>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-24">
        <PageContainer>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
              {t('howItWorks.howItWorksSection.title', 'Cum funcționează platforma')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary via-primary to-primary rounded-full mx-auto mb-6" />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('howItWorks.howItWorksSection.subtitle', 'Simplu și transparent')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="relative"
              >
                <Card className="border-2 border-border/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full bg-card/50 backdrop-blur-sm">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 border-2 border-primary/20">
                      <span className="text-3xl">{step.icon}</span>
                    </div>
                    <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20">
                      {step.number}
                    </div>
                    <CardTitle className="text-xl font-bold mb-3">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed text-center">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 text-center"
          >
            <p className="text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('howItWorks.howItWorksSection.note', 'Pe Farme.ro, produsele sunt livrate direct de producători, ceea ce susține economia locală și menține prospețimea alimentelor.')}
            </p>
          </motion.div>
        </PageContainer>
      </section>

      {/* Uncollected Orders Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-card/50 to-card/30">
        <PageContainer>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
                {t('howItWorks.uncollectedOrders.title', 'Când o comandă nu este ridicată, apare o oportunitate socială')}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary via-primary to-primary rounded-full mx-auto mb-6" />
            </div>

            <Card className="border-2 border-border/60 rounded-2xl shadow-xl bg-gradient-to-br from-rose-50/50 to-orange-50/50 dark:from-rose-950/20 dark:to-orange-950/20">
              <CardContent className="p-8 md:p-12">
                <div className="space-y-6">
                  <p className="text-lg text-foreground leading-relaxed">
                    {t('howItWorks.uncollectedOrders.intro', 'Clientul este informat clar la checkout despre termenul limită de ridicare.')}
                  </p>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {t('howItWorks.uncollectedOrders.ifNotPicked', 'Dacă produsul nu este preluat la timp:')}
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-500/20">
                        <CheckIcon className="w-4 h-4" />
                      </div>
                      <span className="text-base text-foreground">{t('howItWorks.uncollectedOrders.point1', 'nu este aruncat')}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-500/20">
                        <CheckIcon className="w-4 h-4" />
                      </div>
                      <span className="text-base text-foreground">{t('howItWorks.uncollectedOrders.point2', 'nu este irosit')}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-500/20">
                        <CheckIcon className="w-4 h-4" />
                      </div>
                      <span className="text-base text-foreground">
                        {t('howItWorks.uncollectedOrders.point3', 'este redirecționat către centre sociale / cantine / persoane vulnerabile')}
                      </span>
                    </li>
                  </ul>
                  <div className="mt-8 p-6 bg-card/60 rounded-xl border border-border/60">
                    <p className="text-lg text-foreground italic leading-relaxed text-center">
                      {t('howItWorks.uncollectedOrders.quote', 'Uneori, o comandă neridicată poate deveni o masă caldă pentru cineva care chiar are nevoie.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="px-4 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-sm font-semibold border border-emerald-500/20">
                ✅ {t('howItWorks.uncollectedOrders.badge1', 'Zero risipă')}
              </div>
              <div className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold border border-primary/20">
                ✅ {t('howItWorks.uncollectedOrders.badge2', 'Trasabilitate transparentă')}
              </div>
              <div className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold border border-primary/20">
                ✅ {t('howItWorks.uncollectedOrders.badge3', 'Impact real')}
              </div>
            </div>
          </motion.div>
        </PageContainer>
      </section>

      {/* Social Impact Section */}
      <section id="impact-section" className="py-16 md:py-24 scroll-mt-20">
        <PageContainer>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
              {t('howItWorks.socialImpact.title', 'Impactul tău merge mai departe')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary via-primary to-primary rounded-full mx-auto mb-6" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {impactScenarios.map((scenario, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <Card className={`border-2 border-border/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full bg-gradient-to-br ${scenario.color}`}>
                  <CardContent className="p-6 md:p-8 text-center">
                    <div className="text-5xl mb-5">{scenario.icon}</div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{scenario.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {scenario.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* Policy Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-card/50 to-card/30">
        <PageContainer>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                {t('howItWorks.policy.title', 'Politică responsabilă privind comenzile neridicate')}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary via-primary to-primary rounded-full mx-auto" />
            </div>

            <Card className="border-2 border-border/60 rounded-2xl shadow-lg">
              <CardContent className="p-8 md:p-10">
                <p className="text-base text-muted-foreground leading-relaxed mb-4">
                  {t('howItWorks.policy.description1', 'Pentru a menține sustenabilitatea platformei și echilibrul logistic, comenzile neridicate pot atrage temporar o taxă logistică suplimentară la următoarele comenzi.')}
                </p>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {t('howItWorks.policy.description2', 'Această măsură nu este punitivă, ci menită să asigure echitatea pentru producători și eficiența serviciului.')}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </PageContainer>
      </section>

      {/* Producer Benefits Section */}
      <section className="py-16 md:py-24">
        <PageContainer>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                {t('howItWorks.producerBenefits.title', 'De ce producătorii aleg Farme.ro')}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary via-primary to-primary rounded-full mx-auto" />
            </div>

            <Card className="border-2 border-border/60 rounded-2xl shadow-lg">
              <CardContent className="p-8 md:p-10">
                <ul className="space-y-4">
                  {producerBenefits.map((benefit, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-start gap-3 py-1"
                    >
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-1 border border-emerald-500/20">
                        <CheckIcon className="w-4 h-4" />
                      </div>
                      <span className="text-base text-foreground leading-relaxed flex-1">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </PageContainer>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24 bg-muted">
        <PageContainer>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-6">
              {t('howItWorks.mission.title', 'Misiunea Farme.ro')}
            </h2>
            <Card className="border-2 border-border/60 rounded-2xl shadow-lg bg-card/60 backdrop-blur-sm">
              <CardContent className="p-8 md:p-12">
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  {t('howItWorks.mission.description', 'Farme.ro nu este doar o platformă de vânzare. Este o inițiativă care îmbină comerțul corect, sustenabilitatea alimentară și solidaritatea socială.')}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </PageContainer>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <PageContainer>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {t('howItWorks.cta.title', 'Gata să faci parte din schimbare?')}
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/produse">
                <Button size="lg" className="w-full sm:w-auto">
                  {t('howItWorks.cta.button1', 'Cumpără responsabil')}
                </Button>
              </Link>
              <Link href="/portal-producatori/register">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  {t('howItWorks.cta.button2', 'Devino producător partener')}
                </Button>
              </Link>
            </div>
          </motion.div>
        </PageContainer>
      </section>
    </div>
  )
}

