'use client'

/**
 * Admin Sidebar Navigation Component
 * 
 * Responsive sidebar with navigation links
 */

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAdminI18n } from '@/lib/i18n/context'
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Settings,
  Menu,
  X,
  Store,
  Activity,
  BookOpen,
  CreditCard,
  AlertCircle,
  DollarSign,
  FileText,
  HelpCircle,
  Languages,
  TrendingUp,
  BarChart3,
  Megaphone,
  Search,
  Shield,
  Lock,
  ShieldAlert,
  Zap,
  MessageCircle,
} from 'lucide-react'

export function AdminSidebar() {
  const { t } = useAdminI18n()
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    {
      name: t('nav.dashboard', 'Dashboard'),
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: t('nav.journal', 'Jurnal'),
      items: [
        {
          name: t('nav.journalArticles', 'Articole'),
          href: '/jurnal',
          icon: BookOpen,
        },
        {
          name: t('nav.journalMetrics', 'Metrici'),
          href: '/jurnal/metrics',
          icon: Activity,
        },
      ],
    },
    {
      name: t('nav.producers', 'Producători'),
      href: '/producers',
      icon: Store,
    },
    {
      name: t('nav.orders', 'Comenzi'),
      items: [
        {
          name: t('nav.allOrders', 'Toate comenzile'),
          href: '/orders',
          icon: ShoppingCart,
        },
        {
          name: t('nav.disputes', 'Dispute & Refunds'),
          href: '/orders/disputes',
          icon: AlertCircle,
        },
      ],
    },
    {
      name: t('nav.commerce', 'Commerce'),
      items: [
        {
          name: t('nav.commissions', 'Comisioane & Payout'),
          href: '/commerce/commissions',
          icon: DollarSign,
        },
      ],
    },
    {
      name: t('nav.users', 'Utilizatori'),
      href: '/users',
      icon: Users,
    },
    {
      name: t('nav.support', 'Support'),
      items: [
        {
          name: t('nav.supportUsers', 'Utilizatori & timeline'),
          href: '/support/users',
          icon: Users,
        },
        {
          name: t('nav.aiInteractions', 'AI Interactions'),
          href: '/support/ai-interactions',
          icon: MessageCircle,
        },
      ],
    },
    {
      name: t('nav.content', 'Content'),
      items: [
        {
          name: t('nav.contentPages', 'Pagini & Legal'),
          href: '/content/pages',
          icon: FileText,
        },
        {
          name: t('nav.contentFaq', 'FAQ & Ajutor'),
          href: '/content/faq',
          icon: HelpCircle,
        },
        {
          name: t('nav.contentI18n', 'Texte & i18n'),
          href: '/content/i18n',
          icon: Languages,
        },
      ],
    },
    {
      name: t('nav.marketing', 'Marketing & Growth'),
      items: [
        {
          name: t('nav.marketingOverview', 'Overview'),
          href: '/marketing',
          icon: TrendingUp,
        },
        {
          name: t('nav.marketingFunnels', 'Funnels & activare'),
          href: '/marketing/funnels',
          icon: BarChart3,
        },
        {
          name: t('nav.marketingCampaigns', 'Campanii & canale'),
          href: '/marketing/campaigns',
          icon: Megaphone,
        },
        {
          name: t('nav.growthEngine', 'Growth Engine'),
          href: '/marketing/growth',
          icon: Zap,
        },
      ],
    },
    {
      name: t('nav.contentSeo', 'Content & SEO'),
      items: [
        {
          name: t('nav.contentSeoOverview', 'Overview'),
          href: '/content-seo',
          icon: Search,
        },
        {
          name: t('nav.contentSeoPages', 'Pagini & meta'),
          href: '/content-seo/pages',
          icon: FileText,
        },
        {
          name: t('nav.contentSeoJournal', 'Jurnal & articole'),
          href: '/content-seo/jurnal',
          icon: BookOpen,
        },
      ],
    },
    {
      name: t('nav.security', 'Security & Access'),
      items: [
        {
          name: t('nav.securityOverview', 'Security overview'),
          href: '/security',
          icon: Shield,
        },
        {
          name: t('nav.securityAccessLogs', 'Access logs'),
          href: '/security/access-logs',
          icon: Lock,
        },
        {
          name: t('nav.securitySensitiveActions', 'Sensitive changes'),
          href: '/security/sensitive-actions',
          icon: ShieldAlert,
        },
      ],
    },
    {
      name: t('nav.system', 'System'),
      items: [
        {
          name: t('nav.systemStatus', 'Status & Health'),
          href: '/system/status',
          icon: Activity,
        },
        {
          name: t('nav.systemMonitoring', 'Monitorizare Post-Launch'),
          href: '/system/monitoring',
          icon: Activity,
        },
        {
          name: t('nav.systemJournal', 'Jurnal de farme.ro'),
          href: '/system/jurnal',
          icon: BookOpen,
        },
        {
          name: t('nav.systemSubscriptions', 'Abonamente promovare'),
          href: '/system/abonamente-promovare',
          icon: CreditCard,
        },
        {
          name: t('nav.systemAuditLog', 'Audit Log'),
          href: '/system/audit-log',
          icon: Activity,
        },
        {
          name: t('nav.systemConfig', 'Config & Flags'),
          href: '/system/config',
          icon: Settings,
        },
        {
          name: t('nav.systemGdpr', 'GDPR & Date'),
          href: '/system/gdpr',
          icon: FileText,
        },
        {
          name: t('nav.systemContracts', 'Contracte & Facturi'),
          href: '/system/contracts',
          icon: FileText,
        },
        {
          name: t('nav.systemPostLaunch', 'Post-Launch Dashboard'),
          href: '/system/post-launch',
          icon: Activity,
        },
      ],
    },
    {
      name: t('nav.systemConfig', 'Configurare'),
      href: '/config',
      icon: Settings,
    },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-50 rounded-md p-2 text-foreground md:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-40 h-full w-64 transform border-r border-border bg-background transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <div className="flex h-full flex-col pt-16 md:pt-0">
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              if ('items' in item && item.items) {
                // System section with sub-items
                const isSystemActive = item.items.some((subItem) => pathname === subItem.href)
                return (
                  <div key={item.name} className="space-y-1">
                    <div className="px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">
                      {item.name}
                    </div>
                    {item.items.map((subItem) => {
                      const isActive = pathname === subItem.href
                      return (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          onClick={() => setIsOpen(false)}
                          className={`
                            flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                            ${
                              isActive
                                ? 'bg-farmero-olive-100 text-farmero-olive-900 dark:bg-farmero-olive-900 dark:text-farmero-olive-100'
                                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                            }
                          `}
                        >
                          <subItem.icon className="h-5 w-5" />
                          {subItem.name}
                        </Link>
                      )
                    })}
                  </div>
                )
              }
              // Regular navigation item
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                    ${
                      isActive
                        ? 'bg-farmero-olive-100 text-farmero-olive-900 dark:bg-farmero-olive-900 dark:text-farmero-olive-100'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    }
                  `}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>
    </>
  )
}

