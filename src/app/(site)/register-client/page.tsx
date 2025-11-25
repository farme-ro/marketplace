/**
 * Client-side Register Page
 * 
 * Pagină de înregistrare cu design modern
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth, useClientAuth } from '@/lib/auth/context'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from 'farme-ui'
import { Input } from 'farme-ui'
import { Button } from 'farme-ui'
import { Alert } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'

export default function RegisterClientPage() {
  const router = useRouter()
  const { registerClient, isLoading } = useAuth()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    // Validation
    if (!firstName || !lastName || !phoneNumber || !email || !password || !confirmPassword) {
      setError('Toate câmpurile sunt obligatorii')
      return
    }

    if (password.length < 6) {
      setError('Parola trebuie să aibă minim 6 caractere')
      return
    }

    if (password !== confirmPassword) {
      setError('Parolele nu se potrivesc')
      return
    }

    // Basic phone validation (Romanian format)
    const phoneRegex = /^(\+4|0)[0-9]{9}$/
    const cleanPhone = phoneNumber.replace(/\s/g, '')
    if (!phoneRegex.test(cleanPhone)) {
      setError('Numărul de telefon trebuie să fie valid (ex: 0712345678 sau +40712345678)')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Email-ul nu este valid')
      return
    }

    try {
      // Combine firstName and lastName into fullName for API
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim()
      
      // Build payload - only include phoneNumber if it's valid
      const payload: { 
        email: string
        password: string
        fullName: string
        phoneNumber?: string
      } = {
        email,
        password,
        fullName,
      }
      
      // Only add phoneNumber if it's valid and not empty
      if (cleanPhone && cleanPhone.length > 0) {
        payload.phoneNumber = cleanPhone
      }
      
      await registerClient(payload)
      // Redirect is handled by the registerClient function
    } catch (err: any) {
      // Handle different types of errors
      let errorMessage = 'Eroare la înregistrare. Te rugăm să încerci din nou.'
      
      if (err.message) {
        errorMessage = err.message
      } else if (err instanceof TypeError && err.message.includes('fetch')) {
        errorMessage = 'Nu s-a putut conecta la server. Verifică conexiunea la internet sau încearcă din nou mai târziu.'
      } else if (err instanceof Error) {
        errorMessage = err.message
      }
      
      // Log full error in development for debugging
      if (process.env.NODE_ENV === 'development') {
        console.error('Registration error details:', err)
      }
      
      setError(errorMessage)
    }
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
            className="w-full max-w-5xl"
          >
            <Card className="border-border/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-card/95 backdrop-blur-sm overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Left Column - Information */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-gradient-to-br from-primary/10 via-primary/10 to-primary/10 dark:from-primary/20 dark:via-primary/20 dark:to-primary/20 p-8 md:p-10 lg:p-12 flex flex-col justify-center"
                >
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <div className="w-16 h-16 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mb-6 border-2 border-primary/30">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-3">
                        Alătură-te comunității!
                      </h2>
                      <div className="w-16 h-1 bg-gradient-to-r from-primary via-primary to-primary rounded-full mb-6" />
                      <p className="text-base text-muted-foreground leading-relaxed mb-6">
                        Creează un cont gratuit și începe să descoperi produse tradiționale de la producători locali
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="space-y-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">Cont gratuit</h3>
                          <p className="text-sm text-muted-foreground">Înregistrează-te fără costuri ascunse</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">Produse autentice</h3>
                          <p className="text-sm text-muted-foreground">Accesează produse tradiționale verificate</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">Livrare rapidă</h3>
                          <p className="text-sm text-muted-foreground">Primește produsele direct de la producători</p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="pt-6 border-t border-border/40"
                    >
                      <p className="text-sm text-muted-foreground mb-3">
                        Ai deja cont?
                      </p>
                      <Link href="/login-client">
                        <Button variant="outline" size="lg" className="w-full">
                          Conectează-te
                        </Button>
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Right Column - Form */}
                <div className="p-8 md:p-10 lg:p-12 flex flex-col justify-center">
                  <CardHeader className="text-center lg:text-left pb-6 px-0 pt-0">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      <CardTitle className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-2">
                        Creează cont
                      </CardTitle>
                      <div className="w-16 h-1 bg-gradient-to-r from-primary via-primary to-primary rounded-full mb-4 lg:mx-0 mx-auto" />
                      <CardDescription className="text-sm text-muted-foreground">
                        Înregistrează-te pentru a accesa toate funcționalitățile farme.ro
                      </CardDescription>
                    </motion.div>
                  </CardHeader>

                  <CardContent className="space-y-5 px-0">
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-2"
                      >
                        <Alert 
                          variant={error.includes('Prea multe încercări') ? "warning" : "destructive"} 
                          title={error.includes('Prea multe încercări') ? "Limită de încercări atinsă" : "Eroare"} 
                          className="rounded-xl"
                        >
                          <div className="space-y-2">
                            <p>{error}</p>
                            {error.includes('Prea multe încercări') && (
                              <div className="mt-3 pt-3 border-t border-destructive/20">
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

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Group 1: Nume, Prenume */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        <div className="space-y-2">
                          <label
                            htmlFor="firstName"
                            className="block text-sm font-medium text-foreground"
                          >
                            Nume
                          </label>
                          <Input
                            id="firstName"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            placeholder="Ion"
                            disabled={isLoading}
                            className="w-full"
                            autoComplete="given-name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="lastName"
                            className="block text-sm font-medium text-foreground"
                          >
                            Prenume
                          </label>
                          <Input
                            id="lastName"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            placeholder="Popescu"
                            disabled={isLoading}
                            className="w-full"
                            autoComplete="family-name"
                          />
                        </div>
                      </motion.div>

                      {/* Group 2: Telefon, Email */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        <div className="space-y-2">
                          <label
                            htmlFor="phoneNumber"
                            className="block text-sm font-medium text-foreground"
                          >
                            Număr telefon
                          </label>
                          <Input
                            id="phoneNumber"
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                            placeholder="0712345678"
                            disabled={isLoading}
                            className="w-full"
                            autoComplete="tel"
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-foreground"
                          >
                            Email
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
                        </div>
                      </motion.div>

                      {/* Group 3: Parolă, Confirmă parola */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        <div className="space-y-2">
                          <label
                            htmlFor="password"
                            className="block text-sm font-medium text-foreground"
                          >
                            Parolă
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
                          <p className="text-xs text-muted-foreground">
                            Minim 6 caractere
                          </p>
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-foreground"
                          >
                            Confirmă parola
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
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="pt-2"
                      >
                        <Button
                          type="submit"
                          size="lg"
                          className="w-full"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Se înregistrează...' : 'Creează cont'}
                        </Button>
                      </motion.div>
                    </form>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                      className="pt-5 mt-5 border-t border-border/50"
                    >
                      <div className="text-center lg:text-left">
                        <Link
                          href="/for-producers"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          Ești producător? <span className="font-medium">Devino producător</span>
                        </Link>
                      </div>
                    </motion.div>
                  </CardContent>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </PageContainer>
    </section>
  )
}
