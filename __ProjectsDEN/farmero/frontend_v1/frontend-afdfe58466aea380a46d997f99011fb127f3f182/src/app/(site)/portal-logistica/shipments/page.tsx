/**
 * Logistics Shipments Page
 * 
 * Page for logistics partners to view and manage shipments
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, Button } from 'farme-ui'
import { RequireAuth } from '@/components/auth/require-auth'
import { useI18n } from '@/lib/i18n/context'
import { getShipmentsForLogistics, updateShipmentStatus } from '@/lib/api/shipments'
import type { DomainShipment, ShipmentStatus } from '@/lib/types/domain'
import { Truck, Package, Calendar, MapPin, Eye, AlertCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils/format'

export default function LogisticsShipmentsPage() {
  const { t, locale } = useI18n()
  const [shipments, setShipments] = useState<DomainShipment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<ShipmentStatus | 'all'>('all')
  const [selectedShipment, setSelectedShipment] = useState<DomainShipment | null>(null)

  useEffect(() => {
    async function loadShipments() {
      try {
        setIsLoading(true)
        const data = await getShipmentsForLogistics()
        setShipments(data)
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('[Logistics Shipments] Failed to load:', error)
        }
        setShipments([])
      } finally {
        setIsLoading(false)
      }
    }

    loadShipments()
  }, [])

  const getStatusLabel = (status: ShipmentStatus) => {
    return t(`shipments.status.${status}`, {
      pending_pickup: 'În așteptare ridicare',
      in_transit: 'În tranzit',
      out_for_delivery: 'În curs de livrare',
      delivered: 'Livrat',
      failed: 'Eșuat',
      returned: 'Returnat',
    }[status] || status)
  }

  const getStatusBadge = (status: ShipmentStatus) => {
    const statusConfig = {
      pending_pickup: { className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
      in_transit: { className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
      out_for_delivery: { className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
      delivered: { className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
      failed: { className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
      returned: { className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
    }

    const config = statusConfig[status] || statusConfig.pending_pickup

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {getStatusLabel(status)}
      </span>
    )
  }

  const filteredShipments = shipments.filter((shipment) => {
    if (selectedStatus === 'all') return true
    return shipment.status === selectedStatus
  })

  const statusOptions: (ShipmentStatus | 'all')[] = [
    'all',
    'pending_pickup',
    'in_transit',
    'out_for_delivery',
    'delivered',
    'failed',
    'returned',
  ]

  if (isLoading) {
    return (
      <RequireAuth role="logistics">
        <div className="min-h-screen bg-background text-foreground">
          <div className="max-w-6xl mx-auto px-4 py-10 md:py-16">
            <Card className="border border-border rounded-2xl shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">{t('common.loading', 'Se încarcă...')}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </RequireAuth>
    )
  }

  return (
    <RequireAuth role="logistics" fallbackRedirect="/login?returnUrl=/logistics-portal/shipments">
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-16">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
              {t('logistics.shipments.title', 'Livrări & AWB')}
            </h1>
            <p className="text-base md:text-lg text-foreground-body max-w-3xl leading-relaxed">
              {t(
                'logistics.shipments.subtitle',
                'Gestionează-ți livrările și urmărește statusul AWB-urilor.'
              )}
            </p>
          </motion.div>

          {/* Status Filter */}
          <Card className="border border-border rounded-2xl shadow-sm bg-card mb-6">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-foreground">
                  {t('logistics.shipments.filter', 'Filtrează după status')}:
                </span>
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                      selectedStatus === status
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background hover:bg-muted'
                    }`}
                  >
                    {status === 'all'
                      ? t('logistics.shipments.all', 'Toate')
                      : getStatusLabel(status as ShipmentStatus)}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shipments List */}
          {filteredShipments.length === 0 ? (
            <Card className="border border-border rounded-2xl shadow-sm bg-card">
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Truck className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-base text-foreground mb-2 font-medium">
                    {t('logistics.shipments.empty', 'Nu ai livrări încă')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t(
                      'logistics.shipments.emptyDescription',
                      'Tracking-ul livrărilor va fi disponibil în curând.'
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredShipments.map((shipment) => (
                <Card
                  key={shipment.id}
                  className="border border-border rounded-xl shadow-sm bg-card hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedShipment(shipment)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Package className="w-5 h-5 text-primary" />
                          <span className="font-semibold text-foreground">
                            {t('logistics.shipments.orderId', 'Comandă')}: {shipment.orderId}
                          </span>
                          {getStatusBadge(shipment.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {shipment.awbNumber && (
                            <div className="flex items-center gap-1">
                              <Truck className="w-4 h-4" />
                              <span>AWB: {shipment.awbNumber}</span>
                            </div>
                          )}
                          {shipment.createdAt && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {t('logistics.shipments.created', 'Creat')}:{' '}
                                {formatDate(shipment.createdAt, locale, {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                          )}
                          {shipment.estimatedDeliveryDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {t('logistics.shipments.estimated', 'Estimat')}:{' '}
                                {formatDate(shipment.estimatedDeliveryDate, locale, {
                                  day: 'numeric',
                                  month: 'short',
                                })}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        {t('common.viewDetails', 'Vezi detalii')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Shipment Details Modal */}
          {selectedShipment && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
              onClick={() => setSelectedShipment(null)}
            >
              <Card
                className="max-w-2xl w-full mx-4 border border-border rounded-2xl shadow-lg bg-card"
                onClick={(e) => e.stopPropagation()}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-2xl font-bold text-foreground">
                      {t('logistics.shipments.details', 'Detalii livrare')}
                    </h2>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedShipment(null)}>
                      ×
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">
                        {t('logistics.shipments.orderId', 'ID Comandă')}:
                      </span>
                      <p className="text-foreground">{selectedShipment.orderId}</p>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-muted-foreground">
                        {t('logistics.shipments.status', 'Status')}:
                      </span>
                      <div className="mt-1">{getStatusBadge(selectedShipment.status)}</div>
                    </div>

                    {selectedShipment.awbNumber && (
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">AWB:</span>
                        <p className="text-foreground font-mono">{selectedShipment.awbNumber}</p>
                      </div>
                    )}

                    {selectedShipment.estimatedDeliveryDate && (
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">
                          {t('logistics.shipments.estimatedDelivery', 'Livrare estimată')}:
                        </span>
                        <p className="text-foreground">
                          {formatDate(selectedShipment.estimatedDeliveryDate, locale, {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    )}

                    {selectedShipment.deliveredAt && (
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">
                          {t('logistics.shipments.deliveredAt', 'Livrat la')}:
                        </span>
                        <p className="text-foreground">
                          {formatDate(selectedShipment.deliveredAt, locale, {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Info Box */}
          <Card className="border border-border rounded-2xl shadow-sm bg-muted/30 mt-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {t('logistics.shipments.infoTitle', 'Informații importante')}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(
                      'logistics.shipments.infoDescription',
                      'Tracking-ul livrărilor este în curs de dezvoltare. Vom anunța când va fi complet funcțional.'
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RequireAuth>
  )
}

