'use client'

/**
 * Subscriptions & Promotions Overview Page
 * 
 * Overview of producer promotion plans, client subscriptions, and campaigns
 */

import { useState, useEffect } from 'react'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { Drawer } from '@/components/ui/Drawer'
import { AccessDenied } from '@/components/auth/AccessDenied'
import { useAdminAuth } from '@/lib/auth/admin-auth-context'
import { hasPermission, hasAnyPermission } from '@/lib/permissions'
import {
  getProducerSubscriptions,
  getClientSubscriptions,
  getPromotionCampaigns,
} from '@/lib/api/system'
import type {
  ProducerSubscription,
  ClientSubscription,
  PromotionCampaign,
} from '@/lib/api/system'

export default function SubscriptionsPromotionsPage() {
  const { admin } = useAdminAuth()
  
  const [producerSubs, setProducerSubs] = useState<ProducerSubscription[]>([])
  const [clientSubs, setClientSubs] = useState<ClientSubscription[]>([])
  const [campaigns, setCampaigns] = useState<PromotionCampaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<
    ProducerSubscription | ClientSubscription | PromotionCampaign | null
  >(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerType, setDrawerType] = useState<
    'producer' | 'client' | 'campaign' | null
  >(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [producerData, clientData, campaignData] = await Promise.all([
        getProducerSubscriptions(),
        getClientSubscriptions(),
        getPromotionCampaigns(),
      ])
      setProducerSubs(producerData)
      setClientSubs(clientData)
      setCampaigns(campaignData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcare')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // RBAC checks - after hooks
  const canView = hasAnyPermission(admin, ['view_subscriptions', 'manage_subscriptions'])
  
  if (!canView) {
    return <AccessDenied requiredPermission="view_subscriptions" />
  }

  const handleRowClick = (
    item: ProducerSubscription | ClientSubscription | PromotionCampaign,
    type: 'producer' | 'client' | 'campaign'
  ) => {
    setSelectedItem(item)
    setDrawerType(type)
    setDrawerOpen(true)
  }

  const producerColumns: Column<ProducerSubscription>[] = [
    {
      key: 'producerName',
      header: 'Producător',
      render: (s) => <span className="font-medium">{s.producerName}</span>,
    },
    {
      key: 'planName',
      header: 'Plan',
      render: (s) => s.planName,
    },
    {
      key: 'startDate',
      header: 'Data început',
      render: (s) => new Date(s.startDate).toLocaleDateString('ro-RO'),
    },
    {
      key: 'renewsAt',
      header: 'Reînnoiește la',
      render: (s) => (s.renewsAt ? new Date(s.renewsAt).toLocaleDateString('ro-RO') : '-'),
    },
    {
      key: 'status',
      header: 'Status',
      render: (s) => {
        const statusColors = {
          active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
          expired: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
          cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
        }
        return (
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusColors[s.status]}`}
          >
            {s.status === 'active' ? 'Activ' : s.status === 'expired' ? 'Expirat' : 'Anulat'}
          </span>
        )
      },
    },
  ]

  const clientColumns: Column<ClientSubscription>[] = [
    {
      key: 'clientName',
      header: 'Client',
      render: (s) => <span className="font-medium">{s.clientName}</span>,
    },
    {
      key: 'producerName',
      header: 'Producător',
      render: (s) => s.producerName,
    },
    {
      key: 'frequency',
      header: 'Frecvență',
      render: (s) => {
        const freqLabels = {
          weekly: 'Săptămânal',
          biweekly: 'Bisăptămânal',
          monthly: 'Lunar',
        }
        return freqLabels[s.frequency] || s.frequency
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (s) => {
        const statusColors = {
          active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
          paused: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
          cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
        }
        return (
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusColors[s.status]}`}
          >
            {s.status === 'active' ? 'Activ' : s.status === 'paused' ? 'Pauză' : 'Anulat'}
          </span>
        )
      },
    },
    {
      key: 'nextDelivery',
      header: 'Următoarea livrare',
      render: (s) => (s.nextDelivery ? new Date(s.nextDelivery).toLocaleDateString('ro-RO') : '-'),
    },
  ]

  const campaignColumns: Column<PromotionCampaign>[] = [
    {
      key: 'producerName',
      header: 'Producător',
      render: (c) => <span className="font-medium">{c.producerName}</span>,
    },
    {
      key: 'channel',
      header: 'Canal',
      render: (c) => {
        const channelLabels = {
          marketplace: 'Marketplace',
          social: 'Social Media',
          newsletter: 'Newsletter',
        }
        return channelLabels[c.channel] || c.channel
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (c) => {
        const statusColors = {
          active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
          paused: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
          completed: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
        }
        return (
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusColors[c.status]}`}
          >
            {c.status === 'active' ? 'Activă' : c.status === 'paused' ? 'Pauză' : 'Finalizată'}
          </span>
        )
      },
    },
    {
      key: 'budget',
      header: 'Buget',
      render: (c) => (c.budget ? `${c.budget.toFixed(2)} RON` : '-'),
    },
    {
      key: 'periodStart',
      header: 'Perioadă',
      render: (c) => {
        if (c.periodStart && c.periodEnd) {
          return `${new Date(c.periodStart).toLocaleDateString('ro-RO')} - ${new Date(c.periodEnd).toLocaleDateString('ro-RO')}`
        }
        return '-'
      },
    },
  ]

  const hasData = producerSubs.length > 0 || clientSubs.length > 0 || campaigns.length > 0
  const hasNoEndpoints =
    producerSubs.length === 0 && clientSubs.length === 0 && campaigns.length === 0 && !loading

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Abonamente & promovare</h1>
        <p className="text-muted-foreground">
          Aici vezi planurile și abonamentele de promovare pentru producători și clienți.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* No Endpoints Warning */}
      {hasNoEndpoints && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <p className="text-sm text-yellow-800 dark:text-yellow-400">
            Endpoint-urile pentru abonamente și promovări nu sunt disponibile încă.
          </p>
          <p className="mt-2 text-xs text-yellow-700 dark:text-yellow-500">
            Vezi <code>docs/ADMIN_BACKEND_GAPS.md</code> pentru detalii despre endpoint-urile
            necesare.
          </p>
        </div>
      )}

      {/* Producer Subscriptions */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Planuri producători</h2>
          <p className="text-sm text-muted-foreground">
            Planuri de promovare pentru producători
          </p>
        </div>
        <DataTable
          columns={producerColumns}
          data={producerSubs}
          onRowClick={(item) => handleRowClick(item, 'producer')}
          loading={loading}
          emptyMessage="Nu sunt planuri de promovare disponibile."
        />
      </div>

      {/* Client Subscriptions */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Abonamente clienți</h2>
          <p className="text-sm text-muted-foreground">
            Abonamente pentru comenzi recurente
          </p>
        </div>
        <DataTable
          columns={clientColumns}
          data={clientSubs}
          onRowClick={(item) => handleRowClick(item, 'client')}
          loading={loading}
          emptyMessage="Nu sunt abonamente clienți disponibile."
        />
      </div>

      {/* Promotion Campaigns */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Campanii de promovare</h2>
          <p className="text-sm text-muted-foreground">
            Campanii active de promovare
          </p>
        </div>
        <DataTable
          columns={campaignColumns}
          data={campaigns}
          onRowClick={(item) => handleRowClick(item, 'campaign')}
          loading={loading}
          emptyMessage="Nu sunt campanii de promovare disponibile."
        />
      </div>

      {/* Detail Drawer */}
      {selectedItem && drawerType && (
        <Drawer
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false)
            setSelectedItem(null)
            setDrawerType(null)
          }}
          title={
            drawerType === 'producer'
              ? (selectedItem as ProducerSubscription).planName
              : drawerType === 'client'
                ? `Abonament ${(selectedItem as ClientSubscription).clientName}`
                : `Campanie ${(selectedItem as PromotionCampaign).producerName}`
          }
        >
          <div className="space-y-4">
            {drawerType === 'producer' && (
              <div>
                <p className="text-sm text-muted-foreground">
                  Detaliile complete vor fi disponibile când endpoint-ul backend va fi
                  implementat.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Vezi <code>docs/ADMIN_BACKEND_GAPS.md</code> pentru detalii.
                </p>
              </div>
            )}
            {drawerType === 'client' && (
              <div>
                <p className="text-sm text-muted-foreground">
                  Detaliile complete vor fi disponibile când endpoint-ul backend va fi
                  implementat.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Vezi <code>docs/ADMIN_BACKEND_GAPS.md</code> pentru detalii.
                </p>
              </div>
            )}
            {drawerType === 'campaign' && (
              <div>
                <p className="text-sm text-muted-foreground">
                  Detaliile complete vor fi disponibile când endpoint-ul backend va fi
                  implementat.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Vezi <code>docs/ADMIN_BACKEND_GAPS.md</code> pentru detalii.
                </p>
              </div>
            )}
          </div>
        </Drawer>
      )}
    </div>
  )
}

