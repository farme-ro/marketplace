/**
 * Offline Fallback Page
 * 
 * Pagină minimală afișată când utilizatorul este offline.
 */

'use client'

import { useI18n } from '@/lib/i18n/context'
import { WifiOff, RefreshCw } from 'lucide-react'
import { Button } from 'farme-ui'
import { Card, CardContent, CardHeader, CardTitle } from 'farme-ui'
import Link from 'next/link'

export default function OfflinePage() {
  const { t } = useI18n()

  const handleRetry = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <WifiOff className="w-8 h-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">
            {t('offline.title', 'Ești offline')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-center">
            {t(
              'offline.description',
              'Nu ai conexiune la internet. Poți reveni în Farmero când ai conexiune la internet.'
            )}
          </p>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="font-medium">{t('offline.whatYouCanDo', 'Ce poți face:')}</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>{t('offline.checkConnection', 'Verifică conexiunea la internet')}</li>
              <li>{t('offline.tryAgain', 'Încearcă din nou mai târziu')}</li>
              <li>
                {t(
                  'offline.cachedContent',
                  'Unele pagini pot fi disponibile din cache dacă le-ai vizitat recent'
                )}
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button onClick={handleRetry} className="flex-1" variant="default">
              <RefreshCw className="w-4 h-4 mr-2" />
              {t('offline.retry', 'Încearcă din nou')}
            </Button>
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full">
                {t('offline.goHome', 'Mergi la pagina principală')}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

