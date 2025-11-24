/**
 * Logistics Portal Sidebar Component
 * 
 * Sidebar fix stânga pentru portalul Logistics
 * Design consistent cu Producer Portal
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'
import { useI18n } from '@/lib/i18n/context'
import { useAuth } from '@/lib/auth/context'

const navigationItems = [
  {
    nameKey: 'logistics.portal.dashboard',
    href: '/logistics-portal/dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    nameKey: 'logistics.portal.commissions',
    href: '/logistics-portal/commissions',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    nameKey: 'logistics.portal.contracts',
    href: '/logistics-portal/contracts',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    nameKey: 'logistics.portal.shipments',
    href: '/logistics-portal/shipments',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    comingSoon: true,
  },
  {
    nameKey: 'logistics.portal.settings',
    href: '/logistics-portal/settings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    comingSoon: true,
  },
]

export function LogisticsSidebar() {
  const pathname = usePathname()
  const { t } = useI18n()
  const { logisticsUser } = useAuth()

  const logisticsName = logisticsUser?.companyName || logisticsUser?.fullName || 'Logistică'

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex flex-col z-40" aria-label="Logistics portal navigation">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/logistics-portal/dashboard" className="flex items-center gap-3">
          <div className="relative w-8 h-8">
            <Image
              src="/farmero.png"
              alt="Farme.ro"
              fill
              className="object-contain dark:hidden"
            />
            <Image
              src="/farmero_wh.png"
              alt="Farme.ro"
              fill
              className="object-contain hidden dark:block"
            />
          </div>
          <span className="font-bold text-lg text-foreground">Farme</span>
        </Link>
      </div>

      {/* Logistics Profile */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-muted border-2 border-border">
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-2xl">🚚</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{logisticsName}</p>
            <p className="text-xs text-muted-foreground">{t('logistics.portal.role', 'Logistică')}</p>
          </div>
        </div>
        
        {/* Status */}
        <div className="flex items-center gap-2 px-3 py-2 bg-primary-soft rounded-lg border border-primary/20">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-medium text-primary">🟢 {t('logistics.portal.active', 'Activ')}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary-soft text-primary shadow-sm'
                  : 'text-foreground-body hover:bg-muted hover:text-foreground',
                item.comingSoon && 'opacity-60 cursor-not-allowed'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.icon}
              <span>{t(item.nameKey, item.nameKey.split('.').pop() || '')}</span>
              {item.comingSoon && (
                <span className="ml-auto text-xs text-muted-foreground">
                  {t('portal.comingSoon', 'În curând')}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>{t('actions.back', 'Înapoi')} {t('common.products', 'la site')}</span>
        </Link>
      </div>
    </aside>
  )
}

