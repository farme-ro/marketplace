/**
 * Recent Orders Section Component
 * 
 * Secțiunea cu comenzi recente
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, Button } from 'farme-ui'
import { FiPackage, FiArrowRight } from 'react-icons/fi'

interface Order {
  id: string
  date: string
  client: string
  value: string
  status: 'Nouă' | 'În pregătire' | 'În livrare' | 'Finalizată' | 'Anulată'
}

interface RecentOrdersSectionProps {
  orders?: Order[]
}

const statusColors = {
  Nouă: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  'În pregătire': 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  'În livrare': 'bg-primary/10 text-primary',
  Finalizată: 'bg-primary/10 text-primary',
  Anulată: 'bg-destructive/10 text-destructive',
}

export function RecentOrdersSection({ orders }: RecentOrdersSectionProps) {
  const hasOrders = orders && orders.length > 0

  return (
    <section className="mb-6 lg:mb-8">
      <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4">
        Comenzi recente
      </h2>

      {hasOrders ? (
        <Card className="border border-border/60 rounded-2xl shadow-sm bg-card">
          <CardContent className="p-0">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      #ID comandă
                    </th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Data
                    </th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Client
                    </th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Valoare
                    </th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-right p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Acțiuni
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-border/60 hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4 text-sm font-medium text-foreground">
                        {order.id}
                      </td>
                      <td className="p-4 text-sm text-foreground-body">{order.date}</td>
                      <td className="p-4 text-sm text-foreground-body">{order.client}</td>
                      <td className="p-4 text-sm font-semibold text-foreground">
                        {order.value}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                            statusColors[order.status]
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Link href={`/portal-producatori/comenzi/${order.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-primary-hover"
                          >
                            Detalii
                          </Button>
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile List */}
            <div className="md:hidden divide-y divide-border">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{order.id}</p>
                      <p className="text-xs text-muted-foreground">{order.date}</p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                        statusColors[order.status]
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-foreground-body">{order.client}</p>
                      <p className="text-sm font-semibold text-foreground">{order.value}</p>
                    </div>
                    <Link href={`/producer-portal/orders/${order.id}`}>
                      <Button variant="ghost" size="sm">
                        <FiArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-border/60 rounded-2xl shadow-sm bg-card">
          <CardContent className="p-8 md:p-12 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <FiPackage className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Încă nu ai comenzi
              </h3>
              <p className="text-sm text-foreground-body max-w-md mx-auto">
                Produsele tale îi așteaptă pe clienții potriviți.
              </p>
              <Link href="/portal-producatori/produse/adauga">
                <Button className="mt-4 rounded-full">
                  Adaugă un produs nou
                </Button>
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      )}
    </section>
  )
}

