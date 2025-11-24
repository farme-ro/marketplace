'use client'

/**
 * FAQ Management Page
 * 
 * Manage frequently asked questions with multi-language support
 */

import { useState, useEffect } from 'react'
import { Search, Filter, Plus, Save, Eye, Trash2 } from 'lucide-react'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { Drawer } from '@/components/ui/Drawer'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { AccessDenied } from '@/components/auth/AccessDenied'
import { useAdminAuth } from '@/lib/auth/admin-auth-context'
import { hasPermission } from '@/lib/permissions'
import { logAdminAction } from '@/lib/utils/admin-audit'
import {
  getAdminFaqEntries,
  createAdminFaqEntry,
  updateAdminFaqEntry,
  deleteAdminFaqEntry,
  type AdminFaqEntry,
  type FaqCategory,
  type CreateFaqEntryPayload,
} from '@/lib/api/content'

const LOCALES = [
  { code: 'ro', name: 'Română' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'it', name: 'Italiano' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' },
  { code: 'uk', name: 'Українська' },
  { code: 'hu', name: 'Magyar' },
]

const CATEGORY_LABELS: Record<FaqCategory, string> = {
  clients: 'Clienți',
  producers: 'Producători',
  delivery_payments: 'Livrare & Plăți',
  legal: 'Legal',
  other: 'Altele',
}

type CategoryFilter = FaqCategory | 'all'
type StatusFilter = 'published' | 'draft' | 'all'

export default function ContentFaqPage() {
  const { admin } = useAdminAuth()
  const [faqEntries, setFaqEntries] = useState<AdminFaqEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedEntry, setSelectedEntry] = useState<AdminFaqEntry | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [editingEntry, setEditingEntry] = useState<Partial<CreateFaqEntryPayload>>({
    key: '',
    category: 'clients',
    status: 'draft',
    order: 0,
    questions: {},
    answers: {},
  })
  const [activeLocale, setActiveLocale] = useState<string>('ro')
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    title: string
    message: string
    onConfirm: () => void
  }>({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {},
  })

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const loadFaqEntries = async () => {
    try {
      setLoading(true)
      setError(null)
      const entries = await getAdminFaqEntries({
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchQuery || undefined,
      })
      setFaqEntries(entries.sort((a, b) => a.order - b.order))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea întrebărilor')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFaqEntries()
  }, [categoryFilter, statusFilter, searchQuery])

  // RBAC checks
  const canView = hasPermission(admin, 'view_content') || hasPermission(admin, 'manage_content')
  const canManage = hasPermission(admin, 'manage_content') || hasPermission(admin, 'manage_journal')

  if (!canView) {
    return <AccessDenied requiredPermission="view_content" />
  }

  const handleEntryClick = (entry: AdminFaqEntry) => {
    setSelectedEntry(entry)
    setEditingEntry({
      key: entry.key,
      category: entry.category,
      status: entry.status,
      order: entry.order,
      questions: { ...entry.questions },
      answers: { ...entry.answers },
    })
    setIsCreating(false)
    setDrawerOpen(true)
  }

  const handleCreateNew = () => {
    setSelectedEntry(null)
    setEditingEntry({
      key: '',
      category: 'clients',
      status: 'draft',
      order: faqEntries.length,
      questions: {},
      answers: {},
    })
    setIsCreating(true)
    setDrawerOpen(true)
  }

  const handleQuestionChange = (locale: string, value: string) => {
    setEditingEntry((prev) => ({
      ...prev,
      questions: { ...(prev.questions || {}), [locale]: value },
    }))
  }

  const handleAnswerChange = (locale: string, value: string) => {
    setEditingEntry((prev) => ({
      ...prev,
      answers: { ...(prev.answers || {}), [locale]: value },
    }))
  }

  const handleSave = async () => {
    if (!canManage) return

    try {
      if (isCreating) {
        if (!editingEntry.key) {
          setError('Cheia (key) este obligatorie')
          return
        }
        await createAdminFaqEntry(editingEntry as CreateFaqEntryPayload)
        await logAdminAction(
          {
            action: 'FAQ_ENTRY_CREATED',
            targetType: 'faq_entry',
            targetId: editingEntry.key,
            metadata: { key: editingEntry.key, category: editingEntry.category },
          },
          admin
        )
      } else if (selectedEntry) {
        await updateAdminFaqEntry(selectedEntry.id, editingEntry)
        await logAdminAction(
          {
            action: 'FAQ_ENTRY_UPDATED',
            targetType: 'faq_entry',
            targetId: selectedEntry.id,
            metadata: { key: selectedEntry.key },
          },
          admin
        )
      }
      setDrawerOpen(false)
      await loadFaqEntries()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la salvarea întrebării')
    }
  }

  const handlePublish = async () => {
    if (!canManage || !selectedEntry) return

    try {
      await updateAdminFaqEntry(selectedEntry.id, { status: 'published' })
      await logAdminAction(
        {
          action: 'FAQ_ENTRY_UPDATED',
          targetType: 'faq_entry',
          targetId: selectedEntry.id,
          metadata: { key: selectedEntry.key, status: 'published' },
        },
        admin
      )
      setDrawerOpen(false)
      await loadFaqEntries()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la publicarea întrebării')
    }
  }

  const handleDelete = async () => {
    if (!canManage || !selectedEntry) return

    try {
      await deleteAdminFaqEntry(selectedEntry.id)
      await logAdminAction(
        {
          action: 'FAQ_ENTRY_DELETED',
          targetType: 'faq_entry',
          targetId: selectedEntry.id,
          metadata: { key: selectedEntry.key },
        },
        admin
      )
      setDrawerOpen(false)
      await loadFaqEntries()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la ștergerea întrebării')
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'published'
      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
  }

  const columns: Column<AdminFaqEntry>[] = [
    {
      key: 'key',
      header: 'Key',
      render: (e) => <span className="font-mono text-xs text-foreground">{e.key}</span>,
    },
    {
      key: 'category',
      header: 'Categorie',
      render: (e) => (
        <span className="text-sm text-foreground">{CATEGORY_LABELS[e.category]}</span>
      ),
    },
    {
      key: 'question',
      header: 'Întrebare',
      render: (e) => (
        <span className="text-sm text-foreground">{e.questions['ro'] || e.questions['en'] || '-'}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (e) => (
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
            e.status
          )}`}
        >
          {e.status === 'published' ? 'Publicat' : 'Draft'}
        </span>
      ),
    },
    {
      key: 'order',
      header: 'Ordine',
      render: (e) => <span className="text-sm text-muted-foreground">{e.order}</span>,
    },
  ]

  const currentQuestion = editingEntry.questions?.[activeLocale] || ''
  const currentAnswer = editingEntry.answers?.[activeLocale] || ''

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">FAQ & Ajutor</h1>
          <p className="text-muted-foreground">Gestionare întrebări frecvente</p>
        </div>
        {canManage && (
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Adaugă întrebare
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      {faqEntries.length === 0 && !loading && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <p className="text-sm text-yellow-800 dark:text-yellow-400">
            Nu există întrebări disponibile. Endpoint-ul backend pentru FAQ nu este încă
            implementat.
          </p>
          <p className="mt-2 text-xs text-yellow-700 dark:text-yellow-500">
            Vezi <code>docs/ADMIN_BACKEND_GAPS.md</code> pentru detalii.
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Caută după key sau întrebare..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">Toate categoriile</option>
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">Toate statusurile</option>
              <option value="published">Publicat</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={faqEntries}
        loading={loading}
        onRowClick={handleEntryClick}
        emptyMessage="Nu am găsit întrebări după criteriile alese."
      />

      {/* Detail Drawer */}
      {(selectedEntry || isCreating) && (
        <Drawer
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false)
            setSelectedEntry(null)
            setIsCreating(false)
            setEditingEntry({
              key: '',
              category: 'clients',
              status: 'draft',
              order: 0,
              questions: {},
              answers: {},
            })
          }}
          title={isCreating ? 'Adaugă întrebare nouă' : `FAQ: ${selectedEntry?.key}`}
        >
          <div className="space-y-6">
            {/* Meta Info */}
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Meta informații</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Key</label>
                  <input
                    type="text"
                    value={editingEntry.key || ''}
                    onChange={(e) => setEditingEntry({ ...editingEntry, key: e.target.value })}
                    disabled={!isCreating}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
                    placeholder="faq.delivery.returns"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">Categorie</label>
                    <select
                      value={editingEntry.category || 'clients'}
                      onChange={(e) =>
                        setEditingEntry({
                          ...editingEntry,
                          category: e.target.value as FaqCategory,
                        })
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">Ordine</label>
                    <input
                      type="number"
                      value={editingEntry.order || 0}
                      onChange={(e) =>
                        setEditingEntry({ ...editingEntry, order: parseInt(e.target.value) || 0 })
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Language Tabs */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-foreground">Conținut multi-limbă</h3>
              <div className="mb-4 flex flex-wrap gap-2 border-b border-border">
                {LOCALES.map((locale) => {
                  const hasQuestion = editingEntry.questions?.[locale.code]
                  const isActive = activeLocale === locale.code
                  return (
                    <button
                      key={locale.code}
                      onClick={() => setActiveLocale(locale.code)}
                      className={`rounded-t-md px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? 'border-b-2 border-farmero-olive-600 bg-farmero-olive-50 text-farmero-olive-900 dark:bg-farmero-olive-900/20 dark:text-farmero-olive-200'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {locale.name}
                      {!hasQuestion && <span className="ml-1 text-xs text-yellow-600">⚠️</span>}
                    </button>
                  )
                })}
              </div>

              {/* Content Editor */}
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Întrebare ({LOCALES.find((l) => l.code === activeLocale)?.name})
                  </label>
                  <input
                    type="text"
                    value={currentQuestion}
                    onChange={(e) => handleQuestionChange(activeLocale, e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Întrebarea"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Răspuns ({LOCALES.find((l) => l.code === activeLocale)?.name})
                  </label>
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => handleAnswerChange(activeLocale, e.target.value)}
                    rows={8}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Răspunsul"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            {canManage && (
              <div className="flex gap-2 border-t border-border pt-4">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <Save className="h-4 w-4" />
                  Salvează
                </button>
                {!isCreating && selectedEntry && selectedEntry.status === 'draft' && (
                  <button
                    onClick={handlePublish}
                    className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                  >
                    <Eye className="h-4 w-4" />
                    Publică
                  </button>
                )}
                {!isCreating && selectedEntry && (
                  <button
                    onClick={() =>
                      setConfirmDialog({
                        open: true,
                        title: 'Șterge întrebare',
                        message: `Ești sigur că vrei să ștergi întrebarea "${selectedEntry.key}"?`,
                        onConfirm: handleDelete,
                      })
                    }
                    className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    Șterge
                  </button>
                )}
              </div>
            )}
          </div>
        </Drawer>
      )}

      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        onConfirm={() => {
          confirmDialog.onConfirm()
          setConfirmDialog({ ...confirmDialog, open: false })
        }}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Confirmă"
        cancelText="Anulează"
      />
    </div>
  )
}

