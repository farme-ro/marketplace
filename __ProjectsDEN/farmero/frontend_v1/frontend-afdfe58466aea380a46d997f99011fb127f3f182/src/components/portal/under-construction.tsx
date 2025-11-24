/**
 * Under Construction Component
 * 
 * Component pentru portaluri care nu sunt încă implementate
 * Afișează mesaj prietenos și buton "Înapoi la homepage"
 */

'use client'

import Link from 'next/link'
import { Card, CardContent, Button } from 'farme-ui'
import { Home, Construction } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

interface UnderConstructionProps {
  portalName?: string
  message?: string
}

export function UnderConstruction({ portalName, message }: UnderConstructionProps) {
  const { t } = useI18n()
  
  const defaultMessage = portalName 
    ? t('portal.underConstruction', `Portalul ${portalName} este în construcție. Vom reveni în curând!`).replace('{portal}', portalName)
    : t('portal.underConstructionGeneric', 'Această secțiune este în construcție. Vom reveni în curând!')
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <Card className="border border-border rounded-2xl shadow-premium bg-card">
          <CardContent className="p-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Construction className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {t('portal.comingSoon', 'În curând')}
            </h1>
            <p className="text-foreground-body mb-6">
              {message || defaultMessage}
            </p>
            <Link href="/">
              <Button size="lg" variant="outline" className="gap-2">
                <Home className="w-4 h-4" />
                {t('portal.backToHomepage', 'Înapoi la homepage')}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

