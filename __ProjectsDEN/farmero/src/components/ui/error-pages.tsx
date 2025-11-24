/**
 * Error Pages Components
 * 
 * Componente reutilizabile pentru diferite tipuri de erori HTTP
 */

'use client'

import Link from 'next/link'
import { Button } from 'farme-ui'
import { Card, CardContent } from 'farme-ui'
import { AlertCircle, Home, Lock, Shield, Server, RefreshCw } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

interface ErrorPageProps {
  title?: string
  message?: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
}

/**
 * 401 Unauthorized - Neautentificat
 */
export function UnauthorizedError({ 
  title,
  message,
  actionLabel,
  actionHref = '/login-client',
}: ErrorPageProps) {
  const { t } = useI18n()
  const finalTitle = title || t('errors.unauthorized', 'Trebuie să fii autentificat')
  const finalMessage = message || t('errors.unauthorizedMessage', 'Pentru a accesa această pagină, trebuie să te autentifici.')
  const finalActionLabel = actionLabel || t('errors.goToLogin', 'Mergi la login')
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <Card className="border border-amber-200 dark:border-amber-800 rounded-2xl shadow-premium bg-card">
          <CardContent className="p-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center">
              <Lock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">{finalTitle}</h1>
            <p className="text-foreground-body mb-6">{finalMessage}</p>
            {actionHref && (
              <Link href={actionHref}>
                <Button size="lg" className="gap-2">
                  {finalActionLabel}
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/**
 * 403 Forbidden - Acces restricționat
 */
export function ForbiddenError({
  title,
  message,
  actionLabel,
  actionHref = '/',
}: ErrorPageProps) {
  const { t } = useI18n()
  const finalTitle = title || t('errors.forbidden', 'Acces restricționat')
  const finalMessage = message || t('errors.forbiddenMessage', 'Nu ai permisiunea de a accesa această pagină.')
  const finalActionLabel = actionLabel || t('errors.goHome', 'Mergi la homepage')
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <Card className="border border-red-200 dark:border-red-800 rounded-2xl shadow-premium bg-card">
          <CardContent className="p-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center">
              <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">{finalTitle}</h1>
            <p className="text-foreground-body mb-6">{finalMessage}</p>
            {actionHref && (
              <Link href={actionHref}>
                <Button size="lg" variant="outline" className="gap-2">
                  <Home className="w-4 h-4" />
                  {finalActionLabel}
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/**
 * 404 Not Found - Resursă inexistentă
 */
export function NotFoundError({
  title,
  message,
  actionLabel,
  actionHref = '/',
}: ErrorPageProps) {
  const { t } = useI18n()
  const finalTitle = title || t('errors.notFound', 'Pagina nu a fost găsită')
  const finalMessage = message || t('errors.notFoundMessage', 'Pagina pe care o cauți nu există sau a fost mutată.')
  const finalActionLabel = actionLabel || t('errors.goHome', 'Mergi la homepage')
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <Card className="border border-border rounded-2xl shadow-premium bg-card">
          <CardContent className="p-8">
            <div className="text-6xl font-bold text-primary mb-4">404</div>
            <h1 className="text-2xl font-bold text-foreground mb-2">{finalTitle}</h1>
            <p className="text-foreground-body mb-6">{finalMessage}</p>
            {actionHref && (
              <Link href={actionHref}>
                <Button size="lg" className="gap-2">
                  <Home className="w-4 h-4" />
                  {finalActionLabel}
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/**
 * 500 Server Error - Eroare server
 */
export function ServerError({
  title,
  message,
  actionLabel,
  onAction,
  actionHref,
}: ErrorPageProps) {
  const { t } = useI18n()
  const finalTitle = title || t('errors.serverError', 'Eroare server')
  const finalMessage = message || t('errors.serverErrorMessage', 'A apărut o eroare pe server. Te rugăm să încerci din nou mai târziu.')
  const finalActionLabel = actionLabel || t('errors.tryAgain', 'Încearcă din nou')
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <Card className="border border-destructive/30 rounded-2xl shadow-premium bg-card">
          <CardContent className="p-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
              <Server className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">{finalTitle}</h1>
            <p className="text-foreground-body mb-6">{finalMessage}</p>
            <div className="flex gap-4 justify-center">
              {onAction && (
                <Button onClick={onAction} size="lg" className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  {finalActionLabel}
                </Button>
              )}
              {actionHref && !onAction && (
                <Link href={actionHref}>
                  <Button size="lg" variant="outline" className="gap-2">
                    <Home className="w-4 h-4" />
                    {t('errors.goHome', 'Mergi la homepage')}
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/**
 * Generic Error - Pentru erori generale
 */
export function GenericError({
  title,
  message,
  actionLabel,
  onAction,
  actionHref = '/',
}: ErrorPageProps) {
  const { t } = useI18n()
  const finalTitle = title || t('errors.generic', 'Ceva nu a mers bine')
  const finalMessage = message || t('errors.generic', 'A apărut o eroare neașteptată. Te rugăm să încerci din nou.')
  const finalActionLabel = actionLabel || t('errors.tryAgain', 'Încearcă din nou')
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <Card className="border border-destructive/30 rounded-2xl shadow-premium bg-card">
          <CardContent className="p-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">{finalTitle}</h1>
            <p className="text-foreground-body mb-6">{finalMessage}</p>
            <div className="flex gap-4 justify-center">
              {onAction && (
                <Button onClick={onAction} size="lg" className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  {finalActionLabel}
                </Button>
              )}
              {actionHref && (
                <Link href={actionHref}>
                  <Button size="lg" variant="outline" className="gap-2">
                    <Home className="w-4 h-4" />
                    {t('errors.goHome', 'Mergi la homepage')}
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

