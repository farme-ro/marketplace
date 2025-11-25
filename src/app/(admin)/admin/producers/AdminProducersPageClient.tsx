/**
 * Admin Producers Page Client Component
 * 
 * Client component pentru pagina de gestionare producători admin
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardHeader, CardTitle, CardContent } from 'farme-ui'
import { Button } from 'farme-ui'
import { Badge } from 'farme-ui'
import { Alert } from 'farme-ui'
import { Skeleton } from 'farme-ui'
import { Modal } from 'farme-ui'
import { Input } from 'farme-ui'
import { Select } from 'farme-ui'
import Link from 'next/link'

interface Producer {
  id: string
  name: string
  registrationNumber: string
  type: string
  status: string
  user: {
    email: string
    fullName: string
  }
  mainRegion?: {
    name: string
  }
}

export default function AdminProducersPageClient() {
  const searchParams = useSearchParams()
  const statusFilter = searchParams.get('status') || ''

  const [producers, setProducers] = useState<Producer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionModal, setActionModal] = useState<{ producer: Producer; action: 'approve' | 'reject' } | null>(null)
  const [reason, setReason] = useState('')
  const [updating, setUpdating] = useState(false)

  const loadProducers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const url = statusFilter
        ? `/api/admin/producers?status=${statusFilter}`
        : '/api/admin/producers'
      const response = await fetch(url, {
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('Eroare la încărcarea producătorilor')
      }
      const data = await response.json()
      setProducers(data.producers || [])
    } catch (err: any) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Error loading producers:', err)
      }
      setError(err.message || 'Eroare la încărcarea producătorilor')
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    loadProducers()
  }, [loadProducers])

  async function handleApprove(producerId: string) {
    try {
      setUpdating(true)
      const response = await fetch(`/api/admin/producers/${producerId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('Eroare la aprobarea producătorului')
      }
      await loadProducers()
      setActionModal(null)
    } catch (err: any) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Error approving producer:', err)
      }
      setError(err.message || 'Eroare la aprobarea producătorului')
    } finally {
      setUpdating(false)
    }
  }

  async function handleReject(producerId: string, reason: string) {
    try {
      setUpdating(true)
      const response = await fetch(`/api/admin/producers/${producerId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ reason }),
      })
      if (!response.ok) {
        throw new Error('Eroare la respingerea producătorului')
      }
      await loadProducers()
      setActionModal(null)
      setReason('')
    } catch (err: any) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Error rejecting producer:', err)
      }
      setError(err.message || 'Eroare la respingerea producătorului')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <PageContainer>
      <div className="mb-spacing-xl">
        <h1 className="text-4xl font-heading font-bold text-[var(--color-foreground)] mb-spacing-sm">
          Gestionare Producători
        </h1>
        <p className="text-[var(--color-muted-foreground)]">
          Aprobă sau respinge cererile de producători
        </p>
      </div>

      {error && (
        <Alert variant="destructive" title="Eroare" className="mb-spacing-lg">
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card variant="default" padding="md" className="mb-spacing-lg">
        <CardContent>
          <div className="flex items-center gap-spacing-base">
            <label className="text-sm font-medium text-[var(--color-foreground)]">
              Filtrează după status:
            </label>
            <Select
              value={statusFilter}
              onChange={(e) => {
                const params = new URLSearchParams()
                if (e.target.value) {
                  params.set('status', e.target.value)
                }
                const queryString = params.toString()
                window.location.href = `/dashboard/admin/producers${queryString ? `?${queryString}` : ''}`
              }}
            >
              <option value="">Toate</option>
              <option value="PENDING_VERIFICATION">În așteptare</option>
              <option value="APPROVED">Aprobați</option>
              <option value="REJECTED">Respinși</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Producers List */}
      {loading ? (
        <div className="space-y-spacing-base">
          {[...Array(5)].map((_, i) => (
            <Card key={i} variant="default" padding="lg">
              <CardContent>
                <Skeleton variant="text" width="60%" className="mb-2" />
                <Skeleton variant="text" width="40%" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : producers.length === 0 ? (
        <Card variant="default" padding="lg">
          <CardContent>
            <p className="text-center text-[var(--color-muted-foreground)]">
              Nu există producători cu statusul selectat.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-spacing-base">
          {producers.map((producer) => (
            <Card key={producer.id} variant="default" padding="lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="mb-spacing-xs">{producer.name}</CardTitle>
                    <div className="flex items-center gap-spacing-sm flex-wrap">
                      <Badge variant={producer.status === 'APPROVED' ? 'success' : producer.status === 'REJECTED' ? 'error' : 'warning'}>
                        {producer.status}
                      </Badge>
                      <span className="text-sm text-[var(--color-muted-foreground)]">
                        {producer.user.fullName} ({producer.user.email})
                      </span>
                      {producer.mainRegion && (
                        <span className="text-sm text-[var(--color-muted-foreground)]">
                          {producer.mainRegion.name}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--color-muted-foreground)] mt-spacing-xs">
                      CUI: {producer.registrationNumber} | Tip: {producer.type}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {producer.status === 'PENDING_VERIFICATION' && (
                  <div className="flex gap-spacing-sm">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setActionModal({ producer, action: 'approve' })}
                    >
                      Aprobă
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActionModal({ producer, action: 'reject' })}
                    >
                      Respinge
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Action Modal */}
      {actionModal && (
        <Modal
          isOpen={!!actionModal}
          onClose={() => {
            setActionModal(null)
            setReason('')
          }}
          title={actionModal.action === 'approve' ? 'Aprobă producător' : 'Respinge producător'}
        >
          <div className="space-y-spacing-base">
            <p>
              Ești sigur că vrei să {actionModal.action === 'approve' ? 'aprobezi' : 'respingi'} producătorul{' '}
              <strong>{actionModal.producer.name}</strong>?
            </p>
            {actionModal.action === 'reject' && (
              <div>
                <label className="block text-sm font-medium text-[var(--color-foreground)] mb-spacing-xs">
                  Motiv (opțional):
                </label>
                <Input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Motivul respingerii..."
                />
              </div>
            )}
            <div className="flex gap-spacing-sm justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setActionModal(null)
                  setReason('')
                }}
                disabled={updating}
              >
                Anulează
              </Button>
              <Button
                variant={actionModal.action === 'approve' ? 'primary' : 'destructive'}
                onClick={() => {
                  if (actionModal.action === 'approve') {
                    handleApprove(actionModal.producer.id)
                  } else {
                    handleReject(actionModal.producer.id, reason)
                  }
                }}
                disabled={updating}
              >
                {updating ? 'Se procesează...' : actionModal.action === 'approve' ? 'Aprobă' : 'Respinge'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </PageContainer>
  )
}

