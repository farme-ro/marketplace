'use client'

/**
 * Dashboard Page
 * 
 * Main admin dashboard with KPI cards
 */

import { Users, Store, ShoppingCart, DollarSign } from 'lucide-react'
import { useAdminI18n } from '@/lib/i18n/context'

export default function DashboardPage() {
  const { t } = useAdminI18n()
  
  // TODO: Hook KPIs to backend endpoints
  // GET /admin/financials/summary for financial data
  // GET /admin/users with count for total users
  // GET /admin/producers with count for total producers
  // GET /admin/orders with filters for today's orders

  const kpis = [
    {
      title: t('dashboard.kpis.totalProducers', 'Total producători'),
      value: '0',
      icon: Store,
      description: t('dashboard.kpis.totalProducersDesc', 'Producători înregistrați'),
    },
    {
      title: t('dashboard.kpis.totalClients', 'Total clienți'),
      value: '0',
      icon: Users,
      description: t('dashboard.kpis.totalClientsDesc', 'Clienți înregistrați'),
    },
    {
      title: t('dashboard.kpis.ordersToday', 'Comenzi azi'),
      value: '0',
      icon: ShoppingCart,
      description: t('dashboard.kpis.ordersTodayDesc', 'Comenzi plasate astăzi'),
    },
    {
      title: t('dashboard.kpis.ordersValueThisMonth', 'Valoare comenzi luna aceasta'),
      value: '0 RON',
      icon: DollarSign,
      description: t('dashboard.kpis.ordersValueThisMonthDesc', 'Valoare totală comenzi'),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('dashboard.title', 'Dashboard')}</h1>
        <p className="text-muted-foreground">{t('dashboard.subtitle', 'Vizualizare generală platformă')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.title}
            className="rounded-lg border border-border bg-card p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </p>
                <p className="mt-2 text-2xl font-bold text-foreground">
                  {kpi.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {kpi.description}
                </p>
              </div>
              <div className="rounded-full bg-farmero-olive-100 p-3 dark:bg-farmero-olive-900">
                <kpi.icon className="h-6 w-6 text-farmero-olive-700 dark:text-farmero-olive-400" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-yellow-50 p-4 dark:bg-yellow-900/20">
        <p className="text-sm text-yellow-800 dark:text-yellow-400">
          <strong>{t('dashboard.note', 'Notă')}:</strong> {t('dashboard.notePlaceholder', 'Aceste valori sunt placeholder-uri. Integrează cu backend-ul folosind endpoint-urile documentate în')} <code>{t('dashboard.noteBackendGaps', 'docs/ADMIN_BACKEND_GAPS.md')}</code>.
        </p>
      </div>
    </div>
  )
}

