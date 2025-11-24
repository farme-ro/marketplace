/**
 * ANPC Page
 * 
 * Pagină legală obligatorie - Soluționare litigii / ANPC
 */

'use client'

import Link from 'next/link'
import { Card, CardContent } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'
import { ExternalLink, FileText, Mail } from 'lucide-react'
import { useI18n } from '@/lib/i18n/context'

export default function ANPCPage() {
  const { t } = useI18n()
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageContainer className="py-10 md:py-16">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {t('anpc.title', 'Soluționare litigii / ANPC')}
            </h1>
            <p className="text-base text-foreground-body max-w-2xl mx-auto">
              {t('anpc.subtitle', 'Informații despre drepturile tale ca consumator și modalitățile de soluționare a litigiilor')}
            </p>
          </div>

          {/* Main Content */}
          <Card className="border border-border rounded-2xl shadow-sm bg-card">
            <CardContent className="p-6 md:p-8 space-y-6">
              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {t('anpc.consumerRights.title', 'Drepturile tale ca consumator')}
                </h2>
                <p className="text-sm text-foreground-body leading-relaxed">
                  {t('anpc.consumerRights.intro', 'Conform legislației române, ai dreptul la:')}
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-foreground-body ml-4">
                  <li>{t('anpc.consumerRights.list1', 'Produse conforme cu descrierea și calitatea promisă')}</li>
                  <li>{t('anpc.consumerRights.list2', 'Informații clare despre prețuri, caracteristici și termeni de livrare')}</li>
                  <li>{t('anpc.consumerRights.list3', 'Protecție împotriva practicilor comerciale neloiale')}</li>
                  <li>{t('anpc.consumerRights.list4', 'Dreptul de retur în termenul legal (14 zile pentru distanță)')}</li>
                  <li>{t('anpc.consumerRights.list5', 'Garanție pentru produsele defecte')}</li>
                </ul>
              </section>

              <section className="space-y-4 pt-6 border-t border-border">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  {t('anpc.amicableResolution.title', 'Rezolvare amiabilă')}
                </h2>
                <p className="text-sm text-foreground-body leading-relaxed">
                  {t('anpc.amicableResolution.intro', 'Înainte de a contacta ANPC, te rugăm să ne contactezi direct pentru a rezolva orice problemă:')}
                </p>
                <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                  <p className="text-sm font-medium text-foreground">{t('anpc.amicableResolution.contactLabel', 'Contact farme.ro')}</p>
                  <a
                    href="mailto:contact@farme.ro"
                    className="text-sm text-primary hover:underline flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    contact@farme.ro
                  </a>
                  <p className="text-xs text-muted-foreground mt-2">
                    {t('anpc.amicableResolution.responseTime', 'Răspundem în maximum 48 de ore și ne străduim să rezolvăm orice problemă rapid și corect.')}
                  </p>
                </div>
              </section>

              <section className="space-y-4 pt-6 border-t border-border">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <ExternalLink className="w-5 h-5" />
                  {t('anpc.anpc.title', 'Autoritatea Națională pentru Protecția Consumatorilor (ANPC)')}
                </h2>
                <p className="text-sm text-foreground-body leading-relaxed">
                  {t('anpc.anpc.intro', 'Dacă nu am reușit să rezolvăm problema în mod amiabil, poți contacta ANPC:')}
                </p>
                <div className="space-y-3">
                  <div className="bg-muted/50 rounded-xl p-4">
                    <p className="text-sm font-medium text-foreground mb-2">{t('anpc.anpc.officialSite', 'Site oficial ANPC')}</p>
                    <a
                      href="https://anpc.ro"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      www.anpc.ro
                    </a>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-4">
                    <p className="text-sm font-medium text-foreground mb-2">{t('anpc.anpc.odrPlatform', 'Platformă ODR (Online Dispute Resolution)')}</p>
                    <a
                      href="https://ec.europa.eu/consumers/odr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      ec.europa.eu/consumers/odr
                    </a>
                    <p className="text-xs text-muted-foreground mt-2">
                      {t('anpc.anpc.odrDescription', 'Platformă europeană pentru soluționarea online a litigiilor între consumatori și comercianți.')}
                    </p>
                  </div>
                </div>
              </section>

              <section className="space-y-4 pt-6 border-t border-border">
                <h2 className="text-xl font-semibold text-foreground">
                  {t('anpc.companyInfo.title', 'Informații despre farme.ro')}
                </h2>
                <div className="space-y-2 text-sm text-foreground-body">
                  <p>
                    <strong className="text-foreground">{t('anpc.companyInfo.nameLabel', 'Denumire')}:</strong> farme.ro
                  </p>
                  <p>
                    <strong className="text-foreground">{t('anpc.companyInfo.emailLabel', 'Email')}:</strong>{' '}
                    <a href="mailto:contact@farme.ro" className="text-primary hover:underline">
                      contact@farme.ro
                    </a>
                  </p>
                  <p>
                    <strong className="text-foreground">{t('anpc.companyInfo.websiteLabel', 'Website')}:</strong>{' '}
                    <a href="https://farme.ro" className="text-primary hover:underline">
                      https://farme.ro
                    </a>
                  </p>
                </div>
              </section>
            </CardContent>
          </Card>

          {/* Back Link */}
          <div className="text-center">
            <Link
              href="/"
              className="text-sm text-primary hover:underline inline-flex items-center gap-2"
            >
              ← {t('common.backToHomepage', 'Înapoi la homepage')}
            </Link>
          </div>
        </div>
      </PageContainer>
    </div>
  )
}

