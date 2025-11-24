/**
 * Unified Login Page
 * 
 * Single login form for all user types (client, business, producer, logistics, investor, importer)
 * After successful login, redirects based on user roles:
 * - Single role → portal dashboard
 * - Multiple roles → /select-account
 */

'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth/context'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from 'farme-ui'
import { Input } from 'farme-ui'
import { Button } from 'farme-ui'
import { Alert } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import { useI18n } from '@/lib/i18n/context'
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react'

function UnifiedLoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { loginUnified, isLoading, isAuthenticated } = useAuth()
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const returnUrl = searchParams.get('returnUrl') || searchParams.get('redirect')
      if (returnUrl) {
        router.push(returnUrl)
      } else {
        router.push('/select-account')
      }
    }
  }, [isAuthenticated, router, searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError(t('auth.emailPasswordRequired', 'Email și parolă sunt obligatorii'))
      return
    }

    try {
      await loginUnified(email, password)
      // Redirect is handled by AuthProvider based on roles
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('auth.loginError', 'Eroare la autentificare. Te rugăm să încerci din nou.')
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
            className="w-full max-w-md"
          >
            <Card className="border-border/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-card/95 backdrop-blur-sm">
              <CardHeader className="space-y-1 text-center pb-6 px-6 pt-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <LogIn className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">
                  {t('auth.login', 'Autentificare')}
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  {t('auth.loginDescription', 'Conectează-te pentru a accesa contul tău')}
                </CardDescription>
              </CardHeader>

              <CardContent className="px-6 pb-6">
                {error && (
                  <Alert variant="destructive" className="mb-5">
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      {t('auth.email', 'Email')}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder={t('auth.emailPlaceholder', 'nume@exemplu.ro')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                        disabled={isLoading}
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-foreground">
                      {t('auth.password', 'Parolă')}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder={t('auth.passwordPlaceholder', 'Parola ta')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                        disabled={isLoading}
                        autoComplete="current-password"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm pt-1">
                    <Link
                      href="/forgot-password"
                      className="text-primary hover:underline transition-colors"
                    >
                      {t('auth.forgotPassword', 'Ai uitat parola?')}
                    </Link>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                      size="lg"
                    >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        {t('auth.loggingIn', 'Se autentifică...')}
                      </>
                    ) : (
                      <>
                        {t('auth.login', 'Autentificare')}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </>
                    )}
                    </Button>
                  </div>
                </form>

                <div className="mt-6 pt-5 border-t border-border/50 text-center text-sm text-muted-foreground">
                  <span>{t('auth.noAccount', 'Nu ai cont?')} </span>
                  <Link
                    href="/register"
                    className="text-primary hover:underline font-medium transition-colors"
                  >
                    {t('auth.register', 'Înregistrează-te')}
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </PageContainer>
    </section>
  )
}

export default function UnifiedLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="text-muted-foreground">Loading...</div></div>}>
      <UnifiedLoginContent />
    </Suspense>
  )
}

