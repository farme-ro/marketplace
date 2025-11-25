/**
 * New Product Page
 * 
 * Pagină pentru adăugarea unui produs nou cu validare și error handling îmbunătățit
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ProducerDashboardLayout } from '@/components/producer-portal/producer-dashboard-layout'
import { ProductForm } from '../_components/product-form'
import { Card, CardContent, Alert } from 'farme-ui'
import { motion, AnimatePresence } from 'framer-motion'
import { createProduct } from '@/lib/api/producer/products'
import { routes } from '@/lib/routes'

export default function NewProductPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (data: any) => {
    setError(null)
    setIsSubmitting(true)

    // Validare client-side
    if (!data.name || data.name.trim().length === 0) {
      setError('Numele produsului este obligatoriu')
      setIsSubmitting(false)
      return
    }

    if (!data.price || parseFloat(data.price) <= 0) {
      setError('Prețul trebuie să fie mai mare decât 0')
      setIsSubmitting(false)
      return
    }

    if (!data.unit || data.unit.trim().length === 0) {
      setError('Unitatea de măsură este obligatorie')
      setIsSubmitting(false)
      return
    }

    try {
      // API call pentru creare produs
      await createProduct({
        name: data.name.trim(),
        description: data.description?.trim() || undefined,
        price: parseFloat(data.price),
        unit: data.unit,
        stock: parseInt(data.stock) || 0,
        isBio: data.isBio ?? false,
        isTraditional: data.isTraditional ?? false,
        categoryId: data.categoryId || undefined,
        regionId: data.regionId || undefined,
      })
      
      // Success state
      setSuccess(true)
      
      // Redirect după 1.5 secunde pentru a permite utilizatorului să vadă mesajul de succes
      setTimeout(() => {
        router.push(routes.producerPortal.products)
      }, 1500)
    } catch (err: unknown) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Error creating product:', err)
      }
      let errorMessage = 'Eroare la crearea produsului. Te rugăm să verifici datele și să încerci din nou.'
      
      if (err instanceof Error) {
        errorMessage = err.message
        
        // Handle specific error codes
        if (err.message.includes('400') || err.message.includes('invalide')) {
          errorMessage = 'Date invalide. Verifică că toate câmpurile obligatorii sunt completate corect.'
        } else if (err.message.includes('401') || err.message.includes('autentificat')) {
          errorMessage = 'Trebuie să fii autentificat pentru a crea produse.'
        }
      }
      
      setError(errorMessage)
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (confirm('Ești sigur că vrei să anulezi? Modificările nesalvate vor fi pierdute.')) {
      router.back()
    }
  }

  return (
    <ProducerDashboardLayout>
      <div className="min-h-screen bg-background text-foreground py-8">
        <div className="mx-auto max-w-3xl px-4 space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-start justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
                Adaugă produs nou
              </h1>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Completează informațiile despre produs. Poți dezactiva produsul oricând din lista de produse.
              </p>
            </div>
            <Link
              href="/portal-producatori/produse"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Înapoi la produse
            </Link>
          </motion.div>

          {/* Success Message */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Alert variant="success" className="rounded-2xl border-emerald-500/20 bg-emerald-500/10">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="font-semibold text-emerald-900 dark:text-emerald-100">
                        Produs creat cu succes!
                      </p>
                      <p className="text-sm text-emerald-700 dark:text-emerald-300">
                        Redirecționare către lista de produse...
                      </p>
                    </div>
                  </div>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Alert variant="destructive" className="rounded-2xl">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-destructive-foreground mb-1">
                        Eroare
                      </p>
                      <p className="text-sm text-destructive-foreground/80">
                        {error}
                      </p>
                    </div>
                    <button
                      onClick={() => setError(null)}
                      className="ml-auto text-destructive-foreground/60 hover:text-destructive-foreground"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="rounded-[32px] border border-border bg-card shadow-premium">
              <CardContent className="p-6 md:p-8">
                <ProductForm
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                  isSubmitting={isSubmitting}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Help Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="rounded-[32px] border border-border bg-muted/30">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-soft flex items-center justify-center text-xl flex-shrink-0">
                    💡
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Sfaturi pentru un produs de succes
                    </h3>
                    <ul className="space-y-1.5 text-sm text-foreground-body">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Folosește un nume clar și descriptiv pentru produs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Adaugă o descriere detaliată pentru a ajuta clienții să înțeleagă produsul</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Actualizează stocul regulat pentru a evita comenzi pentru produse indisponibile</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Poți dezactiva temporar un produs fără să-l ștergi</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </ProducerDashboardLayout>
  )
}

