/**
 * Edit Product Page
 * 
 * Pagină pentru editarea unui produs existent
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ProducerDashboardLayout } from '@/components/producer-portal/producer-dashboard-layout'
import { ProductForm } from '../../_components/product-form'
import { Card, CardContent, Alert } from 'farme-ui'
import { motion, AnimatePresence } from 'framer-motion'
import { getProductById, updateProduct, type ProducerProduct } from '@/lib/api/producer/products'
import { routes } from '@/lib/routes'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  const [product, setProduct] = useState<ProducerProduct | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Fetch product data
  useEffect(() => {
    async function loadProduct() {
      if (!productId) {
        setError('ID produs lipsă')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const productData = await getProductById(productId)
        
        if (!productData) {
          setError('Produsul nu a fost găsit')
          setIsLoading(false)
          return
        }

        setProduct(productData)
      } catch (err: unknown) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('Error loading product:', err)
        }
        let errorMessage = 'Eroare la încărcarea produsului. Te rugăm să reîncerci.'
        
        if (err instanceof Error) {
          errorMessage = err.message
          
          // Handle specific error codes
          if (err.message.includes('404') || err.message.includes('nu a fost găsit')) {
            errorMessage = 'Produsul nu a fost găsit'
          } else if (err.message.includes('401') || err.message.includes('403') || err.message.includes('permisiune')) {
            errorMessage = 'Nu ai permisiunea de a vedea acest produs'
            router.push(routes.producerPortal.login)
            return
          }
        }
        
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId])

  const handleSubmit = async (data: any) => {
    if (!productId) {
      setError('ID produs lipsă')
      return
    }

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
      // API call pentru update produs
      await updateProduct(productId, {
        name: data.name.trim(),
        description: data.description?.trim() || undefined,
        price: parseFloat(data.price),
        unit: data.unit,
        stock: parseInt(data.stock) || 0,
        isActive: data.isActive ?? true,
        isBio: data.isBio ?? false,
        isTraditional: data.isTraditional ?? false,
        categoryId: data.categoryId || undefined,
        regionId: data.regionId || undefined,
      })
      
      // Success state
      setSuccess(true)
      
      // Redirect după 1.5 secunde
      setTimeout(() => {
        router.push(routes.producerPortal.products)
      }, 1500)
    } catch (err: unknown) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Error updating product:', err)
      }
      let errorMessage = 'Eroare la actualizarea produsului. Te rugăm să verifici datele și să încerci din nou.'
      
      if (err instanceof Error) {
        errorMessage = err.message
        
        // Handle specific error codes
        if (err.message.includes('400') || err.message.includes('invalide')) {
          errorMessage = 'Date invalide. Verifică că toate câmpurile sunt corecte.'
        } else if (err.message.includes('404') || err.message.includes('nu a fost găsit')) {
          errorMessage = 'Produsul nu a fost găsit'
        } else if (err.message.includes('401') || err.message.includes('403') || err.message.includes('permisiune')) {
          errorMessage = 'Nu ai permisiunea de a actualiza acest produs'
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

  // Loading state
  if (isLoading) {
    return (
      <ProducerDashboardLayout>
        <div className="min-h-screen bg-background text-foreground py-8">
          <div className="mx-auto max-w-3xl px-4">
            <Card className="rounded-[32px] border border-border bg-card shadow-premium">
              <CardContent className="p-12 text-center">
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-muted rounded w-3/4 mx-auto" />
                  <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
                  <div className="h-64 bg-muted rounded mt-8" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProducerDashboardLayout>
    )
  }

  // Error state - product not found
  if (error && !product) {
    return (
      <ProducerDashboardLayout>
        <div className="min-h-screen bg-background text-foreground py-8">
          <div className="mx-auto max-w-3xl px-4">
            <Card className="rounded-[32px] border border-border bg-card shadow-premium">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Produs negăsit
                </h2>
                <p className="text-muted-foreground mb-6">
                  {error}
                </p>
                <Link href="/portal-producatori/produse">
                  <button className="px-6 py-3 bg-primary hover:bg-primary-hover text-primary-foreground rounded-full font-semibold transition-colors">
                    Înapoi la produse
                  </button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProducerDashboardLayout>
    )
  }

  if (!product) {
    return null
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
                Editează produs
              </h1>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Actualizează informațiile despre produs. Modificările vor fi vizibile imediat în marketplace.
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
                        Produs actualizat cu succes!
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
                    <div className="flex-1">
                      <p className="font-semibold text-destructive-foreground mb-1">
                        Eroare
                      </p>
                      <p className="text-sm text-destructive-foreground/80">
                        {error}
                      </p>
                    </div>
                    <button
                      onClick={() => setError(null)}
                      className="ml-auto text-destructive-foreground/60 hover:text-destructive-foreground flex-shrink-0"
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
                  product={product}
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                  isSubmitting={isSubmitting}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="rounded-[32px] border border-border bg-muted/30">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-soft flex items-center justify-center text-xl flex-shrink-0">
                    ℹ️
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Despre editarea produselor
                    </h3>
                    <ul className="space-y-1.5 text-sm text-foreground-body">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Modificările sunt salvate imediat și sunt vizibile clienților</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Dacă dezactivezi un produs, acesta dispare din listările publice</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Actualizează stocul regulat pentru a evita comenzi pentru produse indisponibile</span>
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
