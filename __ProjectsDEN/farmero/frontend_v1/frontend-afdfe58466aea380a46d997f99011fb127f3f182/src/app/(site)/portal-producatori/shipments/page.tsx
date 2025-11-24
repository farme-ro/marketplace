/**
 * Producer Shipments Page
 * 
 * Page for producers to view shipment status for their orders
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import { ProducerDashboardLayout } from '@/components/producer-portal/producer-dashboard-layout'
import { useI18n } from '@/lib/i18n/context'
import { getShipmentsForProducer } from '@/lib/api/shipments'
import type { DomainShipment } from '@/lib/types/domain'
import { Truck, Package, Calendar, AlertCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils/format'

export default function ProducerShipmentsPage() {
  const { t, locale } = useI18n()
  const [shipments, setShipments] = useState<DomainShipment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadShipments() {
      try {
        setIsLoading(true)
        const data = await getShipmentsForProducer()
        setShipments(data)
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('[Producer Shipments] Failed to load:', error)
        }
        setShipments([])
      } finally {
        setIsLoading(false)
      }
    }

    loadShipments()
  }, [])

  const getStatusLabel = (status: string) => {
    return t(`shipments.status.${status}`, {
      pending_pickup: 'În așteptare ridicare',
      in_transit: 'În tranzit',
      out_for_delivery: 'În curs de livrare',
      delivered: 'Livrat',
      failed: 'Eșuat',
      returned: 'Returnat',
    }[status] || status)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { className: string }> = {
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

  if (isLoading) {
    return (
      <ProducerDashboardLayout>
        <Card className="border border-border rounded-2xl shadow-sm bg-card">
          <CardContent className="p-6">
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">{t('common.loading', 'Se încarcă...')}</p>
            </div>
          </CardContent>
        </Card>
      </ProducerDashboardLayout>
    )
  }

  return (
    <ProducerDashboardLayout>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
          {t('producer.shipments.title', 'Livrări')}
        </h1>
        <p className="text-base md:text-lg text-foreground-body max-w-3xl leading-relaxed">
          {t(
            'producer.shipments.subtitle',
            'Urmărește statusul livrărilor pentru comenzile tale.'
          )}
        </p>
      </motion.div>

      {shipments.length === 0 ? (
        <Card className="border border-border rounded-2xl shadow-sm bg-card">
          <CardContent className="p-6">
            <div className="text-center py-12">
              <Truck className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-base text-foreground mb-2 font-medium">
                {t('producer.shipments.empty', 'Nu ai livrări încă')}
              </p>
              <p className="text-sm text-muted-foreground">
                {t(
                  'producer.shipments.emptyDescription',
                  'Tracking-ul livrărilor va fi disponibil în curând.'
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {shipments.map((shipment) => (
            <Card
              key={shipment.id}
              className="border border-border rounded-xl shadow-sm bg-card hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Package className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-foreground">
                        {t('producer.shipments.orderId', 'Comandă')}: {shipment.orderId}
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
                      {shipment.estimatedDeliveryDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {t('producer.shipments.estimated', 'Livrare estimată')}:{' '}
                            {formatDate(shipment.estimatedDeliveryDate, locale, {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                    {shipment.logisticsPartnerId && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {t(
                          'producer.shipments.logisticsPartner',
                          'Livrarea este gestionată de partenerul logistic.'
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Box */}
      <Card className="border border-border rounded-2xl shadow-sm bg-muted/30 mt-6">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                {t('producer.shipments.infoTitle', 'Informații importante')}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(
                  'producer.shipments.infoDescription',
                  'Tracking-ul livrărilor este în curs de dezvoltare. Vom anunța când va fi complet funcțional. Producătorii nu pot edita AWB-urile, doar văd statusul livrărilor.'
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </ProducerDashboardLayout>
  )
}

