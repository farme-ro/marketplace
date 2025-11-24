/**
 * Investors Register Page
 * 
 * Pagină de înregistrare pentru investitori
 */

'use client'

import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from 'farme-ui'
import { Input } from 'farme-ui'
import { Button } from 'farme-ui'
import { Alert } from 'farme-ui'
import { Textarea } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import { TrendingUp, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/lib/auth/context'
import { useSearchParams } from 'next/navigation'

function InvestorsRegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { registerInvestor, isLoading } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [company, setCompany] = useState('')
  const [investmentInterest, setInvestmentInterest] = useState('')
  const [message, setMessage] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const isPending = searchParams.get('pending') === 'true'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!fullName || !email || !phoneNumber || !password || !confirmPassword) {
      setError('Toate câmpurile marcate cu * sunt obligatorii')
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

    try {
      await registerInvestor({
        email,
        password,
        fullName,
        phoneNumber,
        company,
        investmentInterest,
        message,
      })
      // Redirect handled inside registerInvestor
    } catch (err: any) {
      if (err?.message) {
        setError(err.message)
      } else {
        setError('Eroare la înregistrare. Te rugăm să încerci din nou.')
      }
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
                <Link href="/pentru-investitori">
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
          className="absolute top-16 left-6 w-32 h-32 bg-primary-soft/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2],
            x: [0, 40],
            y: [0, 20],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      </div>

      <PageContainer className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl mx-auto"
        >
          <Card className="border-border rounded-2xl shadow-xl overflow-hidden bg-card/95 backdrop-blur-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Column */}
              <div className="hidden lg:flex flex-col justify-center p-8 md:p-10 lg:p-12 bg-muted/50 border-r border-border">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="space-y-8"
                >
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-primary mb-3">Devino investitor</p>
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-4">
                      Creează cont de investitor
                    </h1>
                    <div className="w-16 h-1 bg-primary rounded-full mb-6" />
                    <p className="text-base text-muted-foreground leading-relaxed">
                      Accesează informații exclusive, rapoarte financiare și actualizări despre performanța farme.ro.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3 py-1">
                      <TrendingUp className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">Acces prioritar</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">La informații și rapoarte</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 py-1">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">Actualizări regulate</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">Despre progres și metrici</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Register Form */}
              <div className="p-8 md:p-10 lg:p-12">
                <CardHeader className="px-0 pt-0 pb-6">
                  <CardTitle className="text-2xl font-bold">Înregistrare</CardTitle>
                  <CardDescription>
                    Completează formularul pentru a crea contul de investitor
                  </CardDescription>
                </CardHeader>

                {error && (
                  <Alert variant="destructive" className="mb-6">
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-sm font-medium text-foreground">
                      Nume complet <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Ion Popescu"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      disabled={isLoading}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="nume@exemplu.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phoneNumber" className="text-sm font-medium text-foreground">
                      Număr de telefon <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="+40 712 345 678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      disabled={isLoading}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-foreground">
                      Parolă <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                      Confirmă parola <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="company" className="text-sm font-medium text-foreground">
                      Companie / Organizație
                    </label>
                    <Input
                      id="company"
                      type="text"
                      placeholder="Numele companiei (opțional)"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      disabled={isLoading}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="investmentInterest" className="text-sm font-medium text-foreground">
                      Interes de investiție
                    </label>
                    <Input
                      id="investmentInterest"
                      type="text"
                      placeholder="Suma estimată sau tipul de investiție"
                      value={investmentInterest}
                      onChange={(e) => setInvestmentInterest(e.target.value)}
                      disabled={isLoading}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-foreground">
                      Mesaj (opțional)
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Spune-ne mai multe despre interesul tău de investiție..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={isLoading}
                      className="w-full min-h-[100px]"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Se înregistrează...' : 'Creează cont'}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Ai deja cont?{' '}
                    <Link
                      href="/pentru-investitori/login"
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      Conectează-te
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </PageContainer>
    </section>
  )
}

export default function InvestorsRegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <InvestorsRegisterContent />
    </Suspense>
  )
}

