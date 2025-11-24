'use client'

/**
 * Marketing Campaigns Page
 * 
 * Campanii & canale: promovări producători, Jurnal, canale externe
 */

import { useState, useEffect } from 'react'
import { ExternalLink, Megaphone, BookOpen, Mail } from 'lucide-react'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { AccessDenied } from '@/components/auth/AccessDenied'
import { useAdminAuth } from '@/lib/auth/admin-auth-context'
import { hasPermission, hasAnyPermission } from '@/lib/permissions'
import {
  getPromotedProducers,
  getJournalTopArticles,
  type PromotedProducer,
  type JournalArticlePerformance,
} from '@/lib/api/marketing-growth'
import Link from 'next/link'

type Tab = 'promotions' | 'journal' | 'external'

export default function MarketingCampaignsPage() {
  const { admin } = useAdminAuth()
  const frontendBaseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://farme.ro'
  const [activeTab, setActiveTab] = useState<Tab>('promotions')
  const [promotedProducers, setPromotedProducers] = useState<PromotedProducer[]>([])
  const [topArticles, setTopArticles] = useState<JournalArticlePerformance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      if (activeTab === 'promotions') {
        const producers = await getPromotedProducers()
        setPromotedProducers(producers)
      } else if (activeTab === 'journal') {
        const articles = await getJournalTopArticles(20)
        setTopArticles(articles)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea datelor')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  // RBAC checks - after hooks
  const canView =
    hasPermission(admin, 'view_marketing') ||
    hasAnyPermission(admin, ['view_marketing', 'view_journal', 'view_subscriptions'])

  if (!canView) {
    return <AccessDenied requiredPermission="view_marketing" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'expired':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activ'
      case 'expired':
        return 'Expirat'
      case 'upcoming':
        return 'Viitor'
      default:
        return status
    }
  }

  const promotedProducersColumns: Column<PromotedProducer>[] = [
    {
      key: 'producerName',
      header: 'Producător',
      render: (p) => <span className="font-medium text-foreground">{p.producerName}</span>,
    },
    {
      key: 'planName',
      header: 'Plan / Tier',
      render: (p) => (
        <div>
          <div className="text-sm font-medium text-foreground">{p.planName}</div>
          <div className="text-xs text-muted-foreground">{p.tier}</div>
        </div>
      ),
    },
    {
      key: 'period',
      header: 'Perioadă',
      render: (p) => (
        <div className="text-sm text-foreground">
          <div>{new Date(p.activeFrom).toLocaleDateString('ro-RO')}</div>
          <div className="text-xs text-muted-foreground">
            → {new Date(p.activeTo).toLocaleDateString('ro-RO')}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (p) => (
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
            p.status
          )}`}
        >
          {getStatusLabel(p.status)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Acțiuni',
      render: (p) => (
        <div className="flex gap-2">
          <Link
            href={`/producers?search=${p.producerName}`}
            className="text-xs text-farmero-olive-600 hover:underline dark:text-farmero-olive-400"
          >
            Vezi producător
          </Link>
          {p.slug && (
            <a
              href={`${frontendBaseUrl}/producatori/${p.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="inline h-3 w-3" />
            </a>
          )}
        </div>
      ),
    },
  ]

  const journalColumns: Column<JournalArticlePerformance>[] = [
    {
      key: 'title',
      header: 'Articol',
      render: (a) => <span className="font-medium text-foreground">{a.title}</span>,
    },
    {
      key: 'producerName',
      header: 'Producător',
      render: (a) => <span className="text-sm text-foreground">{a.producerName}</span>,
    },
    {
      key: 'views',
      header: 'Views',
      render: (a) => <span className="text-sm text-foreground">{a.views.toLocaleString()}</span>,
    },
    {
      key: 'clicks',
      header: 'Clicks',
      render: (a) => (
        <span className="text-sm text-foreground">{a.clicks.toLocaleString()}</span>
      ),
    },
    {
      key: 'ctr',
      header: 'CTR',
      render: (a) => (
        <span className="text-sm font-medium text-foreground">{a.ctr.toFixed(2)}%</span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Campanii & Canale</h1>
        <p className="text-muted-foreground">
          Promovări producători, Jurnal & conținut, canale externe
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'promotions', label: 'Promovări producători', icon: Megaphone },
            { id: 'journal', label: 'Jurnal & conținut', icon: BookOpen },
            { id: 'external', label: 'Canale externe', icon: Mail },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-farmero-olive-600 text-farmero-olive-600'
                    : 'border-transparent text-muted-foreground hover:border-gray-300 hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'promotions' && (
          <div>
            {loading ? (
              <div className="text-center text-muted-foreground">Se încarcă...</div>
            ) : promotedProducers.length === 0 ? (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
                <p className="text-sm text-yellow-800 dark:text-yellow-400">
                  Nu există încă date despre promovări la nivel de admin. Verifică modulul de
                  subscriptions/promotions sau documentația backend.
                </p>
                <p className="mt-2 text-xs text-yellow-700 dark:text-yellow-500">
                  Endpoint-ul <code>GET /admin/marketing/promoted-producers</code> nu este
                  implementat. Vezi <code>docs/ADMIN_BACKEND_GAPS.md</code> pentru detalii.
                </p>
              </div>
            ) : (
              <DataTable
                columns={promotedProducersColumns}
                data={promotedProducers}
                loading={loading}
                emptyMessage="Nu există producători promovați."
              />
            )}
          </div>
        )}

        {activeTab === 'journal' && (
          <div>
            {loading ? (
              <div className="text-center text-muted-foreground">Se încarcă...</div>
            ) : topArticles.length === 0 ? (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
                <p className="text-sm text-yellow-800 dark:text-yellow-400">
                  Nu există date despre performanța articolelor journal. Verifică modulul de
                  journal metrics.
                </p>
              </div>
            ) : (
              <DataTable
                columns={journalColumns}
                data={topArticles}
                loading={loading}
                emptyMessage="Nu există articole cu metrici disponibile."
              />
            )}
          </div>
        )}

        {activeTab === 'external' && (
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="text-center">
              <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">Canale externe</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Ne dorim ca în viitor să afișăm aici performanța newsletter-elor, social media și
                a campaniilor externe. Backend-ul nu are încă aceste date expuse.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

