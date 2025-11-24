/**
 * Recent Orders Table Component
 * 
 * Tabel modern cu comenzi recente pentru dashboard
 */

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from 'farme-ui'
import Link from 'next/link'
import { Button } from 'farme-ui'

interface Order {
  id: string
  client: string
  product: string
  status: 'processing' | 'shipped' | 'delivered' | 'uncollected'
  value: number
  date: string
}

interface RecentOrdersTableProps {
  orders?: Order[]
  updatingIds?: Set<string>
}

const mockOrders: Order[] = [
  {
    id: '#ORD-001',
    client: 'Maria Popescu',
    product: 'Miere de salcâm',
    status: 'processing',
    value: 245,
    date: '2024-01-15',
  },
  {
    id: '#ORD-002',
    client: 'Ion Georgescu',
    product: 'Brânză de capră',
    status: 'shipped',
    value: 180,
    date: '2024-01-14',
  },
  {
    id: '#ORD-003',
    client: 'Ana Ionescu',
    product: 'Ouă de țară',
    status: 'delivered',
    value: 320,
    date: '2024-01-13',
  },
  {
    id: '#ORD-004',
    client: 'George Marinescu',
    product: 'Legume de sezon',
    status: 'uncollected',
    value: 150,
    date: '2024-01-12',
  },
]

const statusConfig = {
  processing: {
    label: 'În așteptare',
    icon: '🟡',
    className: 'bg-secondary-soft text-secondary border-secondary/20',
  },
  shipped: {
    label: 'Confirmată',
    icon: '🟢',
    className: 'bg-primary-soft text-primary border-primary/20',
  },
  delivered: {
    label: 'Livrată',
    icon: '🚚',
    className: 'bg-primary-bg text-primary border-primary/30',
  },
  uncollected: {
    label: 'Neridicată',
    icon: '🔴',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
}

export function RecentOrdersTable({ orders = mockOrders }: RecentOrdersTableProps) {
  return (
    <Card className="border border-border rounded-[32px] shadow-premium bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-foreground">Comenzi recente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground-body">Client</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground-body">Produs</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-foreground-body">Status</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-foreground-body">Acțiune</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => {
                const status = statusConfig[order.status]
                return (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <span className="text-sm font-medium text-foreground block">{order.client}</span>
                        <span className="text-xs text-muted-foreground">{order.id}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <span className="text-sm text-foreground-body block">{order.product}</span>
                        <span className="text-xs font-semibold text-foreground">{order.value} lei</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${status.className}`}>
                          {status.icon} {status.label}
                        </span>
                        {order.status === 'uncollected' && (
                          <p className="text-xs text-foreground-body italic">
                            Această comandă va fi redistribuită social.
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link href={`/producer-portal/orders/${order.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary hover:bg-primary-soft"
                        >
                          Vezi detalii
                        </Button>
                      </Link>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-6 pt-4 border-t border-border">
          <Link href="/portal-producatori/comenzi">
            <Button variant="outline" className="w-full sm:w-auto">
              Vezi toate comenzile →
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

