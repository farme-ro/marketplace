/**
 * Producer Registration Page
 * 
 * Pagină de înregistrare pentru producători cu design modern
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from 'farme-ui'
import { Input } from 'farme-ui'
import { Button } from 'farme-ui'
import { Alert } from 'farme-ui'
import { Select } from 'farme-ui'
import { Textarea } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import { getRegions } from '@/lib/api/public/regions'
import { useAuth } from '@/lib/auth/context'
import type { Region } from '@/lib/api/public/regions'
import { ProducerRegisterStickyBreadcrumb } from '@/components/producer-portal/producer-register-sticky-breadcrumb'

interface RegisterProducerPayload {
  email: string
  password: string
  fullName: string
  phoneNumber?: string
  producerName: string
  registrationNumber: string
  type: 'COMPANY' | 'PFA'
  mainRegionId?: string
  description?: string
}

export default function ProducerRegisterPage() {
  const router = useRouter()
  const { registerProducer, isLoading: isAuthLoading } = useAuth()
  const [activeTab, setActiveTab] = useState<'form' | 'info'>('form')
  const [currentStep, setCurrentStep] = useState(1)
  const [isSuccess, setIsSuccess] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [producerName, setProducerName] = useState('')
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [type, setType] = useState<'COMPANY' | 'PFA'>('PFA')
  const [mainRegionId, setMainRegionId] = useState('')
  const [description, setDescription] = useState('')
  const [regions, setRegions] = useState<Region[]>([])
  const [isLoadingRegions, setIsLoadingRegions] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const totalSteps = 3

  useEffect(() => {
    async function loadRegions() {
      try {
        setIsLoadingRegions(true)
        const regionsData = await getRegions()
        setRegions(regionsData)
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('Error loading regions:', err)
        }
      } finally {
        setIsLoadingRegions(false)
      }
    }
    loadRegions()
  }, [])

  // Validare pentru fiecare pas
  function validateStep(step: number): boolean {
    setError(null)
    
    if (step === 1) {
      if (!fullName || !email || !password || !confirmPassword) {
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
      if (!producerName || !registrationNumber) {
        setError('Numele producătorului și numărul de înregistrare sunt obligatorii')
        return false
      }
      if (registrationNumber.length < 3) {
        setError('Numărul de înregistrare trebuie să aibă minim 3 caractere')
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

    if (!validateStep(3)) {
      return
    }

    try {
      setIsLoading(true)
      
      const payload: RegisterProducerPayload = {
        email,
        password,
        fullName,
        phoneNumber: phoneNumber || undefined,
        producerName,
        registrationNumber,
        type,
        mainRegionId: mainRegionId || undefined,
        description: description || undefined,
      }

      await registerProducer(payload)
      
      // Success - redirect is handled by registerProducer
      setIsSuccess(true)
      setCurrentStep(totalSteps + 1) // Pasul de succes
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
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Sticky Breadcrumb - apare când header-ul site-wide dispare */}
      <ProducerRegisterStickyBreadcrumb />
      
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
                          {isSuccess ? 'Înregistrare reușită!' : 'Creează cont producător'}
                        </CardTitle>
                        <div className="w-16 h-1 bg-gradient-to-r from-primary via-primary to-primary rounded-full mb-4 mx-auto" />
                        <CardDescription className="text-sm text-muted-foreground">
                          {isSuccess ? 'Contul tău a fost creat cu succes' : 'Înregistrează-te pentru a începe să vinzi produsele tale pe farme.ro'}
                        </CardDescription>
                      </motion.div>
                    </CardHeader>

                    {/* Stepper Indicator */}
                    {!isSuccess && (
                      <div className="mb-8">
                        <div className="flex items-center justify-center max-w-2xl mx-auto">
                          {[1, 2, 3].map((step, index) => (
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
                                  {step === 1 ? 'Cont' : step === 2 ? 'Producător' : 'Finalizare'}
                                </p>
                              </div>
                              {index < 2 && (
                                <div
                                  className={`h-0.5 w-16 md:w-24 mx-4 md:mx-6 transition-all duration-300 ${
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
                            <div className="space-y-2">
                              <p>{error}</p>
                              {error.includes('Prea multe încercări') && (
                                <div className="mt-3 pt-3 border-t border-border">
                                  <p className="text-sm text-muted-foreground">
                                    Această limitare protejează platforma împotriva abuzurilor. Te rugăm să aștepți înainte de a încerca din nou.
                                  </p>
                                </div>
                              )}
                              {error.includes('conecta la server') && (
                                <div className="mt-3 pt-3 border-t border-destructive/20">
                                  <p className="text-sm mb-2">Verifică:</p>
                                  <ul className="text-sm space-y-1 list-disc list-inside">
                                    <li>Backend-ul este accesibil la <code className="px-1.5 py-0.5 bg-destructive/10 rounded text-xs">api.farme.ro</code></li>
                                    <li>Variabila <code className="px-1.5 py-0.5 bg-destructive/10 rounded text-xs">NEXT_PUBLIC_API_URL</code> este setată corect</li>
                                    <li>Nu există probleme de CORS sau firewall</li>
                                  </ul>
                                  <Link 
                                    href="/status" 
                                    className="inline-block mt-3 text-sm text-destructive underline hover:no-underline"
                                  >
                                    Verifică statusul backend-ului →
                                  </Link>
                                </div>
                              )}
                            </div>
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
                              Contul tău de producător a fost creat cu succes. Urmează pașii de mai jos pentru a-ți activa contul.
                            </p>
                          </div>
                          <div className="bg-muted/50 rounded-xl p-6 space-y-4 max-w-md mx-auto text-left">
                            <h4 className="font-semibold text-foreground">Pași pentru activarea contului:</h4>
                            <div className="space-y-3">
                              <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5 font-semibold text-sm">
                                  1
                                </div>
                                <div>
                                  <p className="font-medium text-foreground">Verifică email-ul</p>
                                  <p className="text-sm text-muted-foreground">
                                    Am trimis un email la <strong>{email}</strong> cu instrucțiuni pentru activarea contului.
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5 font-semibold text-sm">
                                  2
                                </div>
                                <div>
                                  <p className="font-medium text-foreground">Așteaptă aprobarea</p>
                                  <p className="text-sm text-muted-foreground">
                                    Echipa noastră va verifica informațiile și va aproba contul în cel mult 24-48 de ore.
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5 font-semibold text-sm">
                                  3
                                </div>
                                <div>
                                  <p className="font-medium text-foreground">Conectează-te</p>
                                  <p className="text-sm text-muted-foreground">
                                    După aprobare, vei putea să te conectezi și să începi să adaugi produse.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/portal-producatori/login">
                              <Button size="lg" className="w-full sm:w-auto">
                                Mergi la autentificare
                              </Button>
                            </Link>
                            <Link href="/portal-producatori/ghid-producatori">
                              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                Vezi ghidul
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
                                  Număr de telefon
                                </label>
                                <Input
                                  id="phoneNumber"
                                  type="tel"
                                  value={phoneNumber}
                                  onChange={(e) => setPhoneNumber(e.target.value)}
                                  placeholder="+40 712 345 678"
                                  disabled={isLoading}
                                  className="w-full"
                                  autoComplete="tel"
                                />
                                <p className="text-xs text-muted-foreground">
                                  Format: +40 sau 07XX XXX XXX
                                </p>
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
                                transition={{ duration: 0.3, delay: 0.3 }}
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

                          {/* Step 2: Producer Information */}
                          {currentStep === 2 && (
                            <motion.div
                              key="step2"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3 }}
                              className="space-y-5"
                            >
                              <h3 className="text-lg font-semibold text-foreground mb-4">Informații despre producător</h3>
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-2"
                              >
                                <label htmlFor="producerName" className="block text-sm font-medium text-foreground">
                                  Nume producător/Firmă <span className="text-destructive">*</span>
                                </label>
                                <Input
                                  id="producerName"
                                  type="text"
                                  value={producerName}
                                  onChange={(e) => setProducerName(e.target.value)}
                                  required
                                  placeholder="Ferma Mea SRL"
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
                                <label htmlFor="registrationNumber" className="block text-sm font-medium text-foreground">
                                  Număr înregistrare (CUI/CNP) <span className="text-destructive">*</span>
                                </label>
                                <Input
                                  id="registrationNumber"
                                  type="text"
                                  value={registrationNumber}
                                  onChange={(e) => setRegistrationNumber(e.target.value)}
                                  required
                                  placeholder="RO12345678"
                                  disabled={isLoading}
                                  className="w-full"
                                />
                                <p className="text-xs text-muted-foreground">CUI pentru companie sau CNP pentru PFA</p>
                              </motion.div>
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                                className="space-y-2"
                              >
                                <label htmlFor="type" className="block text-sm font-medium text-foreground">
                                  Tip <span className="text-destructive">*</span>
                                </label>
                                <Select
                                  id="type"
                                  value={type}
                                  onChange={(e) => setType(e.target.value as 'COMPANY' | 'PFA')}
                                  disabled={isLoading}
                                  className="w-full"
                                >
                                  <option value="PFA">PFA (Persoană Fizică Autorizată)</option>
                                  <option value="COMPANY">Companie (SRL, SA, etc.)</option>
                                </Select>
                              </motion.div>
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.3 }}
                                className="space-y-2"
                              >
                                <label htmlFor="mainRegionId" className="block text-sm font-medium text-foreground">
                                  Regiune principală
                                </label>
                                <Select
                                  id="mainRegionId"
                                  value={mainRegionId}
                                  onChange={(e) => setMainRegionId(e.target.value)}
                                  disabled={isLoading || isLoadingRegions}
                                  className="w-full"
                                >
                                  <option value="">Selectează regiunea</option>
                                  {regions.map((region) => (
                                    <option key={region.id} value={region.id}>
                                      {region.name}
                                    </option>
                                  ))}
                                </Select>
                                <p className="text-xs text-muted-foreground">Regiunea principală unde activezi</p>
                              </motion.div>
                            </motion.div>
                          )}

                          {/* Step 3: Additional Information */}
                          {currentStep === 3 && (
                            <motion.div
                              key="step3"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3 }}
                              className="space-y-5"
                            >
                              <h3 className="text-lg font-semibold text-foreground mb-4">Informații suplimentare</h3>
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-2"
                              >
                                <label htmlFor="description" className="block text-sm font-medium text-foreground">
                                  Descriere (opțional)
                                </label>
                                <Textarea
                                  id="description"
                                  value={description}
                                  onChange={(e) => setDescription(e.target.value)}
                                  placeholder="Descriere scurtă despre producător/firmă..."
                                  disabled={isLoading}
                                  className="w-full min-h-[100px]"
                                  rows={4}
                                />
                                <p className="text-xs text-muted-foreground">
                                  O descriere detaliată te ajută să atragi mai mulți clienți
                                </p>
                              </motion.div>
                              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                                <p className="text-sm font-medium text-foreground">Rezumat înregistrare:</p>
                                <div className="text-sm text-muted-foreground space-y-1">
                                  <p><strong>Nume:</strong> {fullName}</p>
                                  <p><strong>Email:</strong> {email}</p>
                                  {phoneNumber && <p><strong>Telefon:</strong> {phoneNumber}</p>}
                                  <p><strong>Producător:</strong> {producerName}</p>
                                  <p><strong>Tip:</strong> {type === 'PFA' ? 'PFA' : 'Companie'}</p>
                                </div>
                              </div>
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
                            href="/portal-producatori/login"
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
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-3">
                        Devino producător pe farme.ro
                      </h2>
                      <div className="w-16 h-1 bg-gradient-to-r from-primary via-primary to-primary rounded-full mb-6 mx-auto" />
                      <p className="text-base text-muted-foreground leading-relaxed mb-6 max-w-2xl mx-auto">
                        Alătură-te comunității de producători locali și vinde produsele tale direct clienților, fără intermediari.
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
                          <h3 className="font-semibold text-foreground mb-1">Vinde direct clienților</h3>
                          <p className="text-sm text-muted-foreground">Fără intermediari, prețuri mai bune pentru tine și pentru clienți</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">Platformă ușor de folosit</h3>
                          <p className="text-sm text-muted-foreground">Gestionează produsele, comenzile și stocurile într-un singur loc</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">Vizibilitate crescută</h3>
                          <p className="text-sm text-muted-foreground">Produsele tale vor fi vizibile pentru mii de clienți</p>
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
                        <Link href="/portal-producatori/login">
                          <Button variant="outline" size="lg" className="w-full">
                            Conectează-te
                          </Button>
                        </Link>
                        <div className="text-center">
                          <Link
                            href="/portal-producatori/ghid-producatori"
                            className="text-sm text-primary hover:underline"
                          >
                            Vezi ghidul complet →
                          </Link>
                        </div>
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
    </>
  )
}

