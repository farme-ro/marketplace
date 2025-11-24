'use client'

/**
 * Access Denied Component
 * 
 * Displays when user doesn't have permission to access a page/feature
 */

import { Lock } from 'lucide-react'
import Link from 'next/link'
import { useAdminI18n } from '@/lib/i18n/context'

interface AccessDeniedProps {
  message?: string
  requiredPermission?: string
}

export function AccessDenied({ 
  message,
  requiredPermission 
}: AccessDeniedProps) {
  const { t } = useAdminI18n()
  
  const defaultMessage = t('accessDenied.message', 'Nu ai permisiunea necesară pentru a accesa această pagină.')
  const displayMessage = message || defaultMessage
  
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-8">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
          <Lock className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="mb-2 text-2xl font-semibold text-foreground">
          {t('accessDenied.title', 'Acces interzis')}
        </h2>
        <p className="mb-4 text-muted-foreground">
          {displayMessage}
        </p>
        {requiredPermission && (
          <p className="mb-6 text-sm text-muted-foreground">
            {t('accessDenied.requiredPermission', 'Permisiune necesară')}: <code className="rounded bg-muted px-2 py-1 text-xs">{requiredPermission}</code>
          </p>
        )}
        <Link
          href="/dashboard"
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {t('common.back', 'Înapoi')} {t('nav.dashboard', 'Dashboard')}
        </Link>
      </div>
    </div>
  )
}

