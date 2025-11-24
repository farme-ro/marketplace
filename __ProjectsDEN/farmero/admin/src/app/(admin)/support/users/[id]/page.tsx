'use client'

/**
 * User 360° View Page
 * 
 * Complete view of a user with timeline, orders, subscriptions, journal, and notes
 */

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Mail, User, Calendar, Package, CreditCard, BookOpen, FileText, Plus, Download, Trash2, UserX } from 'lucide-react'
import { AccessDenied } from '@/components/auth/AccessDenied'
import { useAdminAuth } from '@/lib/auth/admin-auth-context'
import { hasPermission, hasAnyPermission } from '@/lib/permissions'
import { logAdminAction } from '@/lib/utils/admin-audit'
import {
  getUserById,
  getUserOrders,
  getUserSubscriptions,
  getUserJournalArticles,
  getUserTimeline,
  getUserNotes,
  createUserNote,
} from '@/lib/api/support'
import { createGdprRequest } from '@/lib/api/gdpr'
import type { UserNote } from '@/lib/api/support'

type Tab = 'overview' | 'orders' | 'subscriptions' | 'journal' | 'notes'

export default function User360Page() {
  const params = useParams()
  const router = useRouter()
  const { admin } = useAdminAuth()
  const userId = params.id as string

  const [user, setUser] = useState<any | null>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [journalArticles, setJournalArticles] = useState<any[]>([])
  const [timeline, setTimeline] = useState<any[]>([])
  const [notes, setNotes] = useState<UserNote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [newNoteText, setNewNoteText] = useState('')
  const [savingNote, setSavingNote] = useState(false)
  const [creatingGdprRequest, setCreatingGdprRequest] = useState(false)

  const loadUserData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [userData, ordersData, subscriptionsData, journalData, timelineData, notesData] =
        await Promise.all([
          getUserById(userId),
          getUserOrders(userId),
          getUserSubscriptions(userId),
          getUserJournalArticles(userId),
          getUserTimeline(userId),
          getUserNotes(userId),
        ])

      setUser(userData)
      setOrders(ordersData)
      setSubscriptions(subscriptionsData)
      setJournalArticles(journalData)
      setTimeline(timelineData)
      setNotes(notesData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea datelor')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUserData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  // RBAC checks - after hooks
  const canView =
    hasPermission(admin, 'view_users') ||
    hasAnyPermission(admin, ['view_users', 'view_orders'])
  
  const canManage =
    hasPermission(admin, 'manage_users') ||
    hasPermission(admin, 'manage_gdpr')

  if (!canView) {
    return <AccessDenied requiredPermission="view_users" />
  }

  const handleSaveNote = async () => {
    if (!newNoteText.trim() || savingNote) return

    try {
      setSavingNote(true)
      const newNote = await createUserNote(userId, { text: newNoteText })
      setNotes([newNote, ...notes])
      setNewNoteText('')
      await logAdminAction(
        {
          action: 'SUPPORT_NOTE_ADDED',
          targetType: 'user',
          targetId: userId,
          metadata: { noteId: newNote.id },
        },
        admin
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la salvarea notei')
    } finally {
      setSavingNote(false)
    }
  }

  const handleCreateGdprRequest = async (type: 'EXPORT' | 'DELETE' | 'ANONYMIZE') => {
    if (creatingGdprRequest) return

    const confirmMessage =
      type === 'EXPORT'
        ? 'Creezi cerere de export date pentru acest utilizator?'
        : type === 'DELETE'
          ? 'Creezi cerere de ștergere date pentru acest utilizator? (Acțiune permanentă!)'
          : 'Creezi cerere de anonimizare date pentru acest utilizator? (Acțiune permanentă!)'

    if (!confirm(confirmMessage)) return

    try {
      setCreatingGdprRequest(true)
      await createGdprRequest({
        userId,
        type,
        reason: `Cerere inițiată de admin: ${admin?.email}`,
      })
      await logAdminAction(
        {
          action: 'GDPR_REQUEST_CREATED',
          targetType: 'user',
          targetId: userId,
          metadata: { type },
        },
        admin
      )
      // Navigate to GDPR page
      router.push('/system/gdpr')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la crearea cererii GDPR')
    } finally {
      setCreatingGdprRequest(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-farmero-olive border-r-transparent"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
        <p className="text-sm text-red-800 dark:text-red-400">
          Utilizatorul nu a fost găsit sau nu ai permisiunea de a-l vizualiza.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="rounded-md p-2 text-muted-foreground hover:bg-muted"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">{user.fullName || user.email}</h1>
          <p className="text-muted-foreground">Vedere 360° utilizator</p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* User Header Card */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{user.role || '-'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Creat: {user.createdAt ? new Date(user.createdAt).toLocaleDateString('ro-RO') : '-'}
              </span>
            </div>
          </div>
          <div>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                user.status === 'active'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
              }`}
            >
              {user.status || 'active'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'orders', label: 'Comenzi', icon: Package },
            { id: 'subscriptions', label: 'Abonamente', icon: CreditCard },
            { id: 'journal', label: 'Journal', icon: BookOpen },
            { id: 'notes', label: 'Note', icon: FileText },
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
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Profile Card */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Profil</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Email</dt>
                  <dd className="text-sm text-foreground">{user.email}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Nume</dt>
                  <dd className="text-sm text-foreground">{user.fullName || '-'}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-muted-foreground">Rol</dt>
                  <dd className="text-sm text-foreground">{user.role || '-'}</dd>
                </div>
                {user.producer && (
                  <div>
                    <dt className="text-xs font-medium text-muted-foreground">Producător</dt>
                    <dd className="text-sm text-foreground">
                      {user.producer.name} ({user.producer.status})
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Timeline */}
            {timeline.length > 0 && (
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Ultimele acțiuni</h3>
                <div className="space-y-2">
                  {timeline.slice(0, 5).map((event) => (
                    <div key={event.id} className="text-sm text-foreground">
                      <div className="font-medium">{event.title}</div>
                      {event.description && (
                        <div className="text-muted-foreground">{event.description}</div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        {new Date(event.timestamp).toLocaleString('ro-RO')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* GDPR & Date */}
            {canManage && (
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">GDPR & Date</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCreateGdprRequest('EXPORT')}
                    disabled={creatingGdprRequest}
                    className="flex w-full items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Download className="h-4 w-4" />
                    Creează cerere export
                  </button>
                  <button
                    onClick={() => handleCreateGdprRequest('DELETE')}
                    disabled={creatingGdprRequest}
                    className="flex w-full items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Creează cerere ștergere
                  </button>
                  <button
                    onClick={() => handleCreateGdprRequest('ANONYMIZE')}
                    disabled={creatingGdprRequest}
                    className="flex w-full items-center gap-2 rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-700 disabled:opacity-50"
                  >
                    <UserX className="h-4 w-4" />
                    Creează cerere anonimizare
                  </button>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  Aceste acțiuni creează cereri GDPR care trebuie procesate manual. Frontend-ul nu
                  șterge sau anonimizează direct nimic.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Comenzi</h3>
            {orders.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Comenzile acestui utilizator nu sunt încă disponibile în admin.
              </p>
            ) : (
              <div className="space-y-2">
                {orders.map((order) => (
                  <div key={order.id} className="rounded-lg border border-border bg-muted/50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-foreground">
                          Comandă #{order.id.slice(0, 8)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString('ro-RO')} -{' '}
                          {parseFloat(order.totalAmount).toFixed(2)} RON
                        </div>
                      </div>
                      <span className="text-sm text-foreground">{order.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'subscriptions' && (
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Abonamente</h3>
            {subscriptions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Abonamentele acestui utilizator nu sunt încă disponibile în admin.
              </p>
            ) : (
              <div className="space-y-2">
                {subscriptions.map((sub) => (
                  <div key={sub.id} className="rounded-lg border border-border bg-muted/50 p-4">
                    <div className="font-medium text-foreground">{sub.type || sub.planName}</div>
                    <div className="text-sm text-muted-foreground">Status: {sub.status}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'journal' && (
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Articole Journal</h3>
            {journalArticles.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {user.producer
                  ? 'Acest utilizator nu are articole journal.'
                  : 'Utilizatorul nu este producător.'}
              </p>
            ) : (
              <div className="space-y-2">
                {journalArticles.map((article) => (
                  <div key={article.id} className="rounded-lg border border-border bg-muted/50 p-4">
                    <div className="font-medium text-foreground">{article.title}</div>
                    <div className="text-sm text-muted-foreground">
                      Status: {article.status} -{' '}
                      {article.publishedAt
                        ? new Date(article.publishedAt).toLocaleDateString('ro-RO')
                        : 'Nepublicat'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-4">
            {/* Add Note Form */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Adaugă notă</h3>
              <div className="space-y-2">
                <textarea
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  rows={4}
                  placeholder="Scrie o notă internă despre acest utilizator..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                <button
                  onClick={handleSaveNote}
                  disabled={!newNoteText.trim() || savingNote}
                  className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                  {savingNote ? 'Se salvează...' : 'Salvează notă'}
                </button>
              </div>
            </div>

            {/* Notes List */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Note interne</h3>
              {notes.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nu există note pentru acest utilizator.</p>
              ) : (
                <div className="space-y-4">
                  {notes.map((note) => (
                    <div key={note.id} className="rounded-lg border border-border bg-muted/50 p-4">
                      <div className="mb-2 text-sm text-foreground">{note.text}</div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {note.author.fullName} ({note.author.email})
                        </span>
                        <span>{new Date(note.createdAt).toLocaleString('ro-RO')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {notes.length > 0 && notes[0].id.startsWith('temp-') && (
                <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20">
                  <p className="text-xs text-yellow-800 dark:text-yellow-400">
                    ⚠️ Funcție demo – notele nu sunt persistate, backend lipsește.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

