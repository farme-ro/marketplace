/**
 * Logistics Register Page
 * 
 * Pagină de înregistrare pentru parteneri de logistică cu design tabbed-stepped
 */

'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from 'farme-ui'
import { Input } from 'farme-ui'
import { Button } from 'farme-ui'
import { Alert } from 'farme-ui'
import { Select } from 'farme-ui'
import { Textarea } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import { Truck, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/lib/auth/context'

function LogisticsRegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { registerLogistics, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState<'form' | 'info'>('form')
  const [currentStep, setCurrentStep] = useState(1)
  const [isSuccess, setIsSuccess] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [serviceType, setServiceType] = useState<'DELIVERY' | 'WAREHOUSE' | 'PACKAGING' | 'MULTI'>('DELIVERY')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const isPending = searchParams.get('pending') === 'true'

  const totalSteps = 2

  // Validare pentru fiecare pas
  function validateStep(step: number): boolean {
    setError(null)
    
    if (step === 1) {
      if (!fullName || !email || !phoneNumber || !password || !confirmPassword) {
        setError('Toate câmpurile sunt obligatorii')
        return false
      }
      if (password.length < 6) {
        setError('Parola trebuie să aibă minim 6 caractere')
        return false
      }
      if (password !== confirmPassword) {
        setError('Parolele nu se potrivesc')
        return false
      }
      return true
    }
    
    if (step === 2) {
      if (!companyName) {
        setError('Numele companiei este obligatoriu')
        return false
      }
      return true
    }
    
    return true
  }

  function handleNext() {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  function handlePrevious() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setError(null)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!validateStep(2)) {
      return
    }

    try {
      await registerLogistics({
        email,
        password,
        fullName,
        phoneNumber,
        companyName,
        serviceType,
        message: message || undefined,
      })
      
      setIsSuccess(true)
      setCurrentStep(totalSteps + 1)
    } catch (err: any) {
      let errorMessage = 'Eroare la înregistrare. Te rugăm să încerci din nou.'
      
      if (err.message) {
        errorMessage = err.message
      } else if (err instanceof TypeError && err.message.includes('fetch')) {
        errorMessage = 'Nu s-a putut conecta la server. Verifică conexiunea la internet sau încearcă din nou mai târziu.'
      } else if (err instanceof Error) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
    }
  }

  if (isPending) {
    return (
      <section className="min-h-screen py-12 md:py-16 lg:py-20 bg-background">
        <PageContainer className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Card className="border-border rounded-2xl shadow-xl bg-card">
              <CardContent className="p-12">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Cont creat cu succes!
                </h2>
                <p className="text-muted-foreground mb-6">
                  Contul tău a fost creat și este în așteptarea aprobării echipei. 
                  Vei primi un email când contul tău va fi aprobat și vei putea accesa dashboard-ul.
                </p>
                <Link href="/pentru-logistica">
                  <Button variant="outline">
                    Înapoi la pagina principală
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </PageContainer>
      </section>
    )
  }

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
        <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl"
          >
            <Card className="border-border/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-card/95 backdrop-blur-sm overflow-hidden">
              {/* Tab Navigation */}
              <div className="border-b border-border/60">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('form')}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                      activeTab === 'form'
                        ? 'text-primary border-b-2 border-primary bg-primary/5'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    Formular înregistrare
                  </button>
                  <button
                    onClick={() => setActiveTab('info')}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                      activeTab === 'info'
                        ? 'text-primary border-b-2 border-primary bg-primary/5'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    Informații
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-8 md:p-10 lg:p-12">
                {activeTab === 'form' ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardHeader className="text-center pb-6 px-0">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                      >
                        <CardTitle className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-2">
                          {isSuccess ? 'Înregistrare reușită!' : 'Creează cont partener logistică'}
                        </CardTitle>
                        <div className="w-16 h-1 bg-gradient-to-r from-primary via-primary to-primary rounded-full mb-4 mx-auto" />
                        <CardDescription className="text-sm text-muted-foreground">
                          {isSuccess ? 'Contul tău a fost creat cu succes' : 'Înregistrează-te pentru a deveni partener de logistică'}
                        </CardDescription>
                      </motion.div>
                    </CardHeader>

                    {/* Stepper Indicator */}
                    {!isSuccess && (
                      <div className="mb-8">
                        <div className="flex items-center justify-center max-w-xl mx-auto">
                          {[1, 2].map((step, index) => (
                            <div key={step} className="flex items-center">
                              <div className="flex flex-col items-center">
                                <div
                                  className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                                    currentStep >= step
                                      ? 'bg-primary text-primary-foreground shadow-md'
                                      : 'bg-muted text-muted-foreground'
                                  }`}
                                >
                                  {currentStep > step ? (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                  ) : (
                                    step
                                  )}
                                </div>
                                <p className={`text-xs md:text-sm mt-3 font-medium text-center whitespace-nowrap ${
                                  currentStep >= step ? 'text-foreground' : 'text-muted-foreground'
                                }`}>
                                  {step === 1 ? 'Cont' : 'Servicii'}
                                </p>
                              </div>
                              {index < 1 && (
                                <div
                                  className={`h-0.5 w-24 md:w-32 mx-4 md:mx-6 transition-all duration-300 ${
                                    currentStep > step ? 'bg-primary' : 'bg-muted'
                                  }`}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <CardContent className="space-y-5 px-0">
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-3"
                        >
                          <Alert 
                            variant={error.includes('Prea multe încercări') ? "warning" : "destructive"} 
                            title={error.includes('Prea multe încercări') ? "Limită de încercări atinsă" : "Eroare"} 
                            className="rounded-xl"
                          >
                            {error}
                          </Alert>
                        </motion.div>
                      )}

                      {isSuccess ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                          className="text-center space-y-6 py-8"
                        >
                          <div className="w-20 h-20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div className="space-y-3">
                            <h3 className="text-2xl font-semibold text-foreground">
                              Mulțumim pentru înregistrare!
                            </h3>
                            <p className="text-muted-foreground max-w-md mx-auto">
                              Contul tău de partener logistică a fost creat cu succes. Echipa noastră te va contacta în cel mult 24-48 de ore pentru aprobare.
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/pentru-logistica/login">
                              <Button size="lg" className="w-full sm:w-auto">
                                Mergi la autentificare
                              </Button>
                            </Link>
                            <Link href="/pentru-logistica">
                              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                Înapoi
                              </Button>
                            </Link>
                          </div>
                        </motion.div>
                      ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                          {/* Step 1: Personal Information */}
                          {currentStep === 1 && (
                            <motion.div
                              key="step1"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3 }}
                              className="space-y-5"
                            >
                              <h3 className="text-lg font-semibold text-foreground mb-4">Informații personale</h3>
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-2"
                              >
                                <label htmlFor="fullName" className="block text-sm font-medium text-foreground">
                                  Nume complet <span className="text-destructive">*</span>
                                </label>
                                <Input
                                  id="fullName"
                                  type="text"
                                  value={fullName}
                                  onChange={(e) => setFullName(e.target.value)}
                                  required
                                  placeholder="Ion Popescu"
                                  disabled={isLoading}
                                  className="w-full"
                                  autoComplete="name"
                                />
                              </motion.div>
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                                className="space-y-2"
                              >
                                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                                  Email <span className="text-destructive">*</span>
                                </label>
                                <Input
                                  id="email"
                                  type="email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  required
                                  placeholder="you@example.com"
                                  disabled={isLoading}
                                  className="w-full"
                                  autoComplete="email"
                                />
                              </motion.div>
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                                className="space-y-2"
                              >
                                <label htmlFor="phoneNumber" className="block text-sm font-medium text-foreground">
                                  Număr de telefon <span className="text-destructive">*</span>
                                </label>
                                <Input
                                  id="phoneNumber"
                                  type="tel"
                                  value={phoneNumber}
                                  onChange={(e) => setPhoneNumber(e.target.value)}
                                  required
                                  placeholder="+40 712 345 678"
                                  disabled={isLoading}
                                  className="w-full"
                                  autoComplete="tel"
                                />
                              </motion.div>
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.3 }}
                                className="space-y-2"
                              >
                                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                                  Parolă <span className="text-destructive">*</span>
                                </label>
                                <Input
                                  id="password"
                                  type="password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  required
                                  placeholder="••••••••"
                                  disabled={isLoading}
                                  className="w-full"
                                  autoComplete="new-password"
                                />
                                <p className="text-xs text-muted-foreground">Minim 6 caractere</p>
                              </motion.div>
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.4 }}
                                className="space-y-2"
                              >
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                                  Confirmă parola <span className="text-destructive">*</span>
                                </label>
                                <Input
                                  id="confirmPassword"
                                  type="password"
                                  value={confirmPassword}
                                  onChange={(e) => setConfirmPassword(e.target.value)}
                                  required
                                  placeholder="••••••••"
                                  disabled={isLoading}
                                  className="w-full"
                                  autoComplete="new-password"
                                />
                              </motion.div>
                            </motion.div>
                          )}

                          {/* Step 2: Company & Services Information */}
                          {currentStep === 2 && (
                            <motion.div
                              key="step2"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3 }}
                              className="space-y-5"
                            >
                              <h3 className="text-lg font-semibold text-foreground mb-4">Informații despre companie și servicii</h3>
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-2"
                              >
                                <label htmlFor="companyName" className="block text-sm font-medium text-foreground">
                                  Nume companie <span className="text-destructive">*</span>
                                </label>
                                <Input
                                  id="companyName"
                                  type="text"
                                  value={companyName}
                                  onChange={(e) => setCompanyName(e.target.value)}
                                  required
                                  placeholder="Numele companiei"
                                  disabled={isLoading}
                                  className="w-full"
                                />
                              </motion.div>
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                                className="space-y-2"
                              >
                                <label htmlFor="serviceType" className="block text-sm font-medium text-foreground">
                                  Tip serviciu <span className="text-destructive">*</span>
                                </label>
                                <Select
                                  id="serviceType"
                                  value={serviceType}
                                  onChange={(e) => setServiceType(e.target.value as typeof serviceType)}
                                  disabled={isLoading}
                                  className="w-full"
                                >
                                  <option value="DELIVERY">Livrări</option>
                                  <option value="WAREHOUSE">Depozitare</option>
                                  <option value="PACKAGING">Ambalare</option>
                                  <option value="MULTI">Multiple servicii</option>
                                </Select>
                                <p className="text-xs text-muted-foreground">Selectează tipul principal de serviciu oferit</p>
                              </motion.div>
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                                className="space-y-2"
                              >
                                <label htmlFor="message" className="block text-sm font-medium text-foreground">
                                  Mesaj (opțional)
                                </label>
                                <Textarea
                                  id="message"
                                  value={message}
                                  onChange={(e) => setMessage(e.target.value)}
                                  placeholder="Spune-ne mai multe despre serviciile tale..."
                                  disabled={isLoading}
                                  className="w-full min-h-[100px]"
                                  rows={4}
                                />
                              </motion.div>
                            </motion.div>
                          )}

                          {/* Navigation Buttons */}
                          {!isSuccess && (
                            <div className="flex justify-between gap-4 pt-6 border-t border-border/60">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={handlePrevious}
                                disabled={currentStep === 1 || isLoading}
                                className="flex-1 sm:flex-none"
                              >
                                Înapoi
                              </Button>
                              {currentStep < totalSteps ? (
                                <Button
                                  type="button"
                                  onClick={handleNext}
                                  disabled={isLoading}
                                  className="flex-1 sm:flex-none"
                                >
                                  Continuă
                                </Button>
                              ) : (
                                <Button
                                  type="submit"
                                  disabled={isLoading}
                                  className="flex-1 sm:flex-none"
                                >
                                  {isLoading ? 'Se înregistrează...' : 'Finalizează înregistrarea'}
                                </Button>
                              )}
                            </div>
                          )}
                        </form>
                      )}

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 1.2 }}
                        className="pt-4"
                      >
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">
                            Ai deja cont?{' '}
                            <Link
                              href="/pentru-logistica/login"
                              className="font-medium text-primary hover:underline"
                            >
                              Conectează-te
                            </Link>
                          </p>
                        </div>
                      </motion.div>
                    </CardContent>
                  </motion.div>
                ) : (
                  <motion.div
                    key="info"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-primary/30">
                        <Truck className="w-8 h-8" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-3">
                        Devino partener de logistică pe farme.ro
                      </h2>
                      <div className="w-16 h-1 bg-gradient-to-r from-primary via-primary to-primary rounded-full mb-6 mx-auto" />
                      <p className="text-base text-muted-foreground leading-relaxed mb-6 max-w-2xl mx-auto">
                        Alătură-te rețelei noastre de parteneri logistici și ajută la livrarea produselor proaspete către clienți.
                      </p>
                    </div>

                    <div className="space-y-4 max-w-2xl mx-auto">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">Comisionare transparentă</h3>
                          <p className="text-sm text-muted-foreground">Model echitabil de comisionare pentru fiecare livrare</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">Dashboard complet</h3>
                          <p className="text-sm text-muted-foreground">Gestionează livrările, comisioanele și contractele</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">Optimizare rute</h3>
                          <p className="text-sm text-muted-foreground">Eficiență maximă în livrări cu temperatură controlată</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">Suport dedicat</h3>
                          <p className="text-sm text-muted-foreground">Echipa noastră te ajută în fiecare pas</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-border/40 max-w-2xl mx-auto">
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground text-center">
                          Ai deja cont?
                        </p>
                        <Link href="/pentru-logistica/login">
                          <Button variant="outline" size="lg" className="w-full">
                            Conectează-te
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </PageContainer>
    </section>
  )
}

export default function LogisticsRegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <LogisticsRegisterContent />
    </Suspense>
  )
}
