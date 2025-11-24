/**
 * Products Attention Section Component
 * 
 * Secțiunea cu produse care au nevoie de atenție
 */

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, Button } from 'farme-ui'
import { FiPackage, FiEdit, FiAlertCircle } from 'react-icons/fi'

interface ProductAttention {
  id: string
  name: string
  status: 'Stoc redus' | 'Epuizat' | 'Nu este vizibil'
  badge?: 'Inactiv' | 'Ascuns din listă'
}

interface ProductsAttentionSectionProps {
  products?: ProductAttention[]
}

export function ProductsAttentionSection({
  products,
}: ProductsAttentionSectionProps) {
  const hasProducts = products && products.length > 0

  return (
    <section className="mb-6 lg:mb-8">
      <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4">
        Produse care au nevoie de atenție
      </h2>

      {hasProducts ? (
        <Card className="border border-border/60 rounded-2xl shadow-sm bg-card">
          <CardContent className="p-5 lg:p-6">
            <div className="space-y-3">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-primary-soft flex items-center justify-center flex-shrink-0">
                      <FiPackage className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-foreground-body">{product.status}</span>
                        {product.badge && (
                          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-destructive/10 text-destructive">
                            {product.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Link href={`/portal-producatori/produse/${product.id}/editeaza`}>
                    <Button variant="ghost" size="sm" className="ml-2">
                      <FiEdit className="w-4 h-4 mr-1" />
                      Editează
                    </Button>
                  </Link>
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
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-soft mb-4">
                <FiPackage className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Toate produsele tale arată bine
              </h3>
              <p className="text-sm text-foreground-body">
                Poți adăuga produse noi oricând.
              </p>
            </motion.div>
          </CardContent>
        </Card>
      )}
    </section>
  )
}

