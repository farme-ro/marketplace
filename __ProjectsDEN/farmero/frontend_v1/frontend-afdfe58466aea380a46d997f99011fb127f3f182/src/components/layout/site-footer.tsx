/**
 * Site Footer Component
 * 
 * New marketplace footer for farme.ro (farmero)
 * Modern layout focused on trust, clear navigation and social impact messaging.
 * Implemented following product discussions about producers, clients and transparency.
 */

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { useI18n } from '@/lib/i18n/context'
import { LanguageFooterLinks } from './language-footer-links'

export function SiteFooter() {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { t } = useI18n()
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && (theme === 'dark' || (theme === 'system' && systemTheme === 'dark'))

  return (
    <footer className="bg-muted border-t border-border">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section - Tagline + Context */}
        <div className="py-10 md:py-12 border-b border-border">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
            {/* Logo */}
            <div className="flex-shrink-0">
              {mounted && (
                <Image
                  src={isDark ? "/farmero_wh.png" : "/farmero.png"}
                  alt="farmero"
                  width={140}
                  height={50}
                  className="h-12 w-auto"
                />
              )}
            </div>

            {/* Tagline */}
            <div className="flex-1 space-y-2">
              <p className="text-lg md:text-xl font-heading font-semibold text-foreground">
                {t('footer.tagline', 'farmero – marketplace corect între producători locali și oameni care vor să mănânce mai bine.')}
              </p>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {t('footer.subtitle', 'Prețuri de producător, comerț corect și zero risipă acolo unde putem ajuta.')}
              </p>
            </div>
          </div>
        </div>

        {/* Main Columns Section */}
        <nav aria-label="Footer navigation" className="py-10 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Column 1 - Pentru clienți */}
            <div className="space-y-4">
              <h2 className="text-base font-heading font-semibold text-foreground">{t('footer.forClients', 'Pentru clienți')}</h2>
              <ul className="space-y-3">
                <li>
                  <Link 
                    href="/cum-functioneaza-si-impact" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {t('footer.howItWorks', 'Cum funcționează farmero')}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/producatori" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {t('footer.localProducers', 'Producători locali')}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/produse" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {t('footer.products', 'Produse')}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/cum-functioneaza-si-impact#impact-section" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {t('footer.socialImpact', 'Impact social & donații')}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/intrebari-frecvente" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {t('footer.faq', 'Întrebări frecvente (FAQ)')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2 - Pentru producători */}
            <div className="space-y-4">
              <h2 className="text-base font-heading font-semibold text-foreground">{t('footer.forProducers', 'Pentru producători')}</h2>
              <ul className="space-y-3">
                <li>
                  <Link 
                    href="/portal-producatori/register" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {t('footer.becomeProducer', 'Devino producător partener')}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/portal-producatori/login" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {t('footer.producerLogin', 'Autentificare producători')}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/portal-producatori/comisioane" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {t('footer.commissions', 'Comisioane & taxe')}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/portal-producatori/abonamente" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {t('footer.subscriptions', 'Abonamente & promovare')}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/portal-producatori/ghid-livrare" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {t('footer.shippingGuide', 'Ghid livrări & logistică')}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/pentru-producatori" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {t('footer.whySell', 'De ce să vinzi pe farme.ro')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3 - Despre farmero */}
            <div className="space-y-4">
              <h2 className="text-base font-heading font-semibold text-foreground">{t('footer.aboutFarmero', 'Despre farmero')}</h2>
              <ul className="space-y-3">
                <li>
                  <Link 
                    href="/despre-noi" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {t('footer.about', 'Despre noi')}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/despre-noi#mission" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {t('footer.mission', 'Misiune & valori')}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/jurnal-de-farmero" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {t('footer.journal', 'Jurnal de farme.ro')}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/contact" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {t('footer.contact', 'Contact')}
                  </Link>
                </li>
                {/* Note: Uncomment when pages are ready
                <li>
                  <Link 
                    href="/b2b" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    Pentru HoReCa & business
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/diaspora" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    Pentru diaspora
                  </Link>
                </li>
                */}
              </ul>
            </div>

            {/* Column 4 - Legal & info */}
            <div className="space-y-4">
              <h2 className="text-base font-heading font-semibold text-foreground">{t('footer.legal', 'Legal & info')}</h2>
              <ul className="space-y-3">
                <li>
                  <Link 
                    href="/terms" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {t('footer.terms', 'Termeni și condiții')}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/privacy" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {t('footer.privacy', 'Politica de confidențialitate')}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/cookies" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {t('footer.cookies', 'Politica de cookies')}
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      // This will be handled by the parent component
                      if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('openCookiePreferences'))
                      }
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 text-left"
                  >
                    {t('cookies.footer.settings', 'Setări cookie-uri')}
                  </button>
                </li>
                <li>
                  <Link 
                    href="/anpc" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {t('footer.anpc', 'ANPC / Soluționare litigii')}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/gdpr" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {t('footer.gdpr', 'Protecția datelor')}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/sustine-farmero" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {t('footer.supportFarmero', 'Susține Farmero')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Social & Newsletter Section */}
        <div className="py-8 md:py-10 border-t border-border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Social Icons */}
            <div className="space-y-4">
              <h3 className="text-sm font-heading font-semibold text-foreground">{t('footer.socialTitle', 'Suntem și aici')}</h3>
              <div className="flex flex-wrap gap-4">
                {/* Note: Add real social media URLs when available */}
                <a
                  href="#"
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-full bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors duration-200 group"
                >
                  <svg
                    className="w-5 h-5 text-muted-foreground group-hover:text-primary"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-full bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors duration-200 group"
                >
                  <svg
                    className="w-5 h-5 text-muted-foreground group-hover:text-primary"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  aria-label="TikTok"
                  className="w-10 h-10 rounded-full bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors duration-200 group"
                >
                  <svg
                    className="w-5 h-5 text-muted-foreground group-hover:text-primary"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                  </svg>
                </a>
                <a
                  href="#"
                  aria-label="YouTube"
                  className="w-10 h-10 rounded-full bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors duration-200 group"
                >
                  <svg
                    className="w-5 h-5 text-muted-foreground group-hover:text-primary"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h3 className="text-sm font-heading font-semibold text-foreground">
                {t('footer.newsletterTitle', 'Primești noutăți de la producători')}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('footer.newsletterDescription', 'Rețete, producători noi și oferte direct în inbox. Fără spam.')}
              </p>
              {/* Note: Newsletter subscription will be integrated when backend API is available */}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  // Note: Newsletter subscription implementation pending backend API endpoint
                }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="email"
                  placeholder={t('home.newsletter.placeholder', 'Adresa ta de email')}
                  required
                  className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-farmero-olive focus:border-transparent transition-all duration-200"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-body font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  {t('footer.newsletterButton', 'Mă abonez')}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Trust Section */}
        <div className="py-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4 text-center">
            {t('footer.trustDescription', 'Plăți securizate. Producători verificați. Livrare gestionată de fiecare producător în parte.')}
          </p>
          <ul className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>{t('footer.trustProducerPrice', 'Prețuri de producător')}</span>
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>{t('footer.trustVerifiedProducers', 'Producători verificați')}</span>
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>{t('footer.trustNoHiddenContracts', 'Fără contracte ascunse')}</span>
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>{t('footer.trustSupportLocal', 'Sprijini economia locală')}</span>
            </li>
          </ul>
        </div>

        {/* Bottom Bar - Copyright + Language */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              {t('footer.copyright', `© ${currentYear} farmero. Toate drepturile rezervate.`).replace('{year}', currentYear.toString())}
            </p>
            <LanguageFooterLinks />
          </div>
        </div>
      </div>
    </footer>
  )
}

