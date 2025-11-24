/**
 * Forgot Password Page
 * 
 * Pagină pentru resetare parolă
 * 
 * Note: Backend endpoint required: POST /auth/client/forgot-password
 * The page UI is ready and will work once the backend endpoint is implemented.
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, Button } from 'farme-ui'
import { requestClientPasswordReset } from '@/lib/api/auth'
import { Mail, ArrowLeft } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export default function ForgotPasswordPage() {
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await requestClientPasswordReset(email)
      setIsSubmitted(true)
    } catch (err: any) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Error requesting password reset:', err)
      }
      setError(err.message || t('auth.forgotPasswordPage.error', 'Eroare la trimiterea link-ului de resetare'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="border border-border rounded-2xl shadow-premium bg-card">
            <CardContent className="p-6 md:p-8">
              {!isSubmitted ? (
                <>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary-soft flex items-center justify-center">
                      <Mail className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">
                      {t('auth.forgotPasswordPage.title', 'Resetare parolă')}
                    </h1>
                    <p className="text-sm text-foreground-body">
                      {t('auth.forgotPasswordPage.description', 'Introdu adresa ta de email și îți vom trimite un link pentru resetarea parolei.')}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        {t('auth.email', 'Email')}
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="nume@example.com"
                      />
                    </div>

                    {error && (
                      <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                      </div>
                    )}

                    <div className="pt-1">
                      <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                        {isLoading ? t('auth.forgotPasswordPage.sending', 'Se trimite...') : t('auth.forgotPasswordPage.sendLink', 'Trimite link de resetare')}
                      </Button>
                    </div>
                  </form>

                  <div className="mt-5 pt-5 border-t border-border/50 text-center">
                    <Link
                      href="/login-client"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-hover transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      {t('auth.backToLogin', 'Înapoi la autentificare')}
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-50 dark:bg-green-950/20 flex items-center justify-center">
                    <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    {t('auth.forgotPasswordPage.linkSent', 'Link trimis!')}
                  </h2>
                  <p className="text-sm text-foreground-body mb-5">
                    {t('auth.forgotPasswordPage.linkSentDescription', 'Dacă există un cont cu acest email, vei primi un link de resetare parolă. Verifică inbox-ul și urmează instrucțiunile.')}
                  </p>
                  <Link
                    href="/login-client"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full"
                  >
                    {t('auth.backToLogin', 'Înapoi la autentificare')}
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
  )
}

