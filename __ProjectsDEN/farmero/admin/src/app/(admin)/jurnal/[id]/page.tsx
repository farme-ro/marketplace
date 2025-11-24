'use client'

/**
 * Journal Article Detail & Workflow Page
 * 
 * View article details, workflow actions, and revisions
 */

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, ExternalLink, CheckCircle, XCircle, Send, Archive } from 'lucide-react'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import {
  getJournalArticle,
  getJournalRevisions,
  updateJournalArticle,
  createJournalRevision,
} from '@/lib/api/journal'
import type { JournalArticle, JournalRevision, CreateRevisionParams } from '@/lib/api/journal'

export default function JournalArticleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const articleId = params?.id as string
  const frontendBaseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://farme.ro'

  const [article, setArticle] = useState<JournalArticle | null>(null)
  const [revisions, setRevisions] = useState<JournalRevision[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    title: string
    message: string
    onConfirm: () => void
  }>({ open: false, title: '', message: '', onConfirm: () => {} })

  // Revision form
  const [showRevisionForm, setShowRevisionForm] = useState(false)
  const [revisionForm, setRevisionForm] = useState<CreateRevisionParams>({
    version: 1,
    title: '',
    excerpt: '',
    content: '',
    status: 'sent_to_review',
    notes: '',
  })

  useEffect(() => {
    if (articleId) {
      loadData()
    }
  }, [articleId])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [articleData, revisionsData] = await Promise.all([
        getJournalArticle(articleId),
        getJournalRevisions(articleId).catch(() => []),
      ])
      setArticle(articleData)
      setRevisions(revisionsData)
      // Pre-fill revision form with current article data
      setRevisionForm({
        version: revisionsData.length > 0 
          ? Math.max(...revisionsData.map(r => r.version)) + 1 
          : 1,
        title: articleData.title,
        excerpt: articleData.excerpt,
        content: articleData.content || '',
        status: 'sent_to_review',
        notes: '',
      })
    } catch (err: any) {
      if (err.status === 404) {
        setError('Articolul nu a fost găsit.')
      } else if (err.status === 401 || err.status === 403) {
        setError('Nu ai acces la acest articol.')
      } else {
        setError(err.message || 'Eroare la încărcarea articolului')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: 'review' | 'approved' | 'published' | 'archived') => {
    if (!article) return

    const actionLabels = {
      review: 'Trimite în review',
      approved: 'Aprobă articol',
      published: 'Publică articol',
      archived: 'Arhivează articol',
    }

    setConfirmDialog({
      open: true,
      title: actionLabels[newStatus],
      message: `Ești sigur că vrei să ${actionLabels[newStatus].toLowerCase()} articolul "${article.title}"?`,
      onConfirm: async () => {
        try {
          setIsSaving(true)
          await updateJournalArticle(article.id, { status: newStatus })
          await loadData()
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Eroare la actualizare')
        } finally {
          setIsSaving(false)
        }
      },
    })
  }

  const handleCreateRevision = async () => {
    if (!article) return

    try {
      setIsSaving(true)
      // Calculate next version (max existing version + 1, or 1 if no revisions)
      const nextVersion = revisions.length > 0 
        ? Math.max(...revisions.map(r => r.version)) + 1 
        : 1
      
      await createJournalRevision(article.id, {
        ...revisionForm,
        version: nextVersion,
      })
      await loadData()
      setShowRevisionForm(false)
      setRevisionForm({
        version: revisions.length > 0 
          ? Math.max(...revisions.map(r => r.version)) + 1 
          : 1,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content || '',
        status: 'sent_to_review',
        notes: '',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la crearea reviziei')
    } finally {
      setIsSaving(false)
    }
  }

  const getStatusTimeline = () => {
    if (!article) return []
    const timeline = []
    timeline.push({ status: 'Draft', date: article.createdAt, label: 'Creat' })
    if (article.status !== 'draft') {
      timeline.push({ status: 'Review', date: article.updatedAt, label: 'Trimis în review' })
    }
    if (article.status === 'approved' || article.status === 'published') {
      timeline.push({ status: 'Approved', date: article.updatedAt, label: 'Aprobat' })
    }
    if (article.status === 'published' && article.publishedAt) {
      timeline.push({
        status: 'Published',
        date: article.publishedAt,
        label: 'Publicat',
      })
    }
    return timeline
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-farmero-olive border-r-transparent"></div>
          <p className="text-muted-foreground">Se încarcă...</p>
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.push('/jurnal')}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Înapoi la listă
        </button>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-red-800 dark:text-red-400">{error || 'Articolul nu a fost găsit.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={() => router.push('/jurnal')}
            className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Înapoi la listă
          </button>
          <h1 className="text-3xl font-bold text-foreground">{article.title}</h1>
          <p className="mt-2 text-muted-foreground">Slug: {article.slug}</p>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Article Info */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Informații articol</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Producător</dt>
                <dd className="mt-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{article.producerName}</span>
                    {article.producerSlug && (
                      <a
                        href={`${frontendBaseUrl}/producatori/${article.producerSlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-farmero-olive-600 hover:underline dark:text-farmero-olive-400"
                      >
                        Vezi producător <ExternalLink className="ml-1 inline h-3 w-3" />
                      </a>
                    )}
                  </div>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                <dd className="mt-1">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                      article.status === 'published'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : article.status === 'approved'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                          : article.status === 'review'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}
                  >
                    {article.status}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Rezumat</dt>
                <dd className="mt-1 text-sm">{article.excerpt}</dd>
              </div>
              {article.coverImageUrl && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Imagine copertă</dt>
                  <dd className="mt-2">
                    <img
                      src={article.coverImageUrl}
                      alt={article.title}
                      className="max-w-md rounded-lg border border-border"
                    />
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Content */}
          {article.content && (
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Conținut</h2>
              <div
                className="prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>
          )}

          {/* Revisions */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Revizii</h2>
              <button
                onClick={() => setShowRevisionForm(!showRevisionForm)}
                className="rounded-md bg-farmero-olive-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-farmero-olive-700"
              >
                {showRevisionForm ? 'Anulează' : 'Adaugă revizie'}
              </button>
            </div>

            {showRevisionForm && (
              <div className="mb-6 space-y-4 rounded-lg border border-border bg-muted/50 p-4">
                <div>
                  <label className="block text-sm font-medium text-foreground">Titlu</label>
                  <input
                    type="text"
                    value={revisionForm.title}
                    onChange={(e) =>
                      setRevisionForm({ ...revisionForm, title: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">Rezumat</label>
                  <textarea
                    value={revisionForm.excerpt}
                    onChange={(e) =>
                      setRevisionForm({ ...revisionForm, excerpt: e.target.value })
                    }
                    rows={3}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">Conținut</label>
                  <textarea
                    value={revisionForm.content}
                    onChange={(e) =>
                      setRevisionForm({ ...revisionForm, content: e.target.value })
                    }
                    rows={10}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">Status</label>
                  <select
                    value={revisionForm.status}
                    onChange={(e) =>
                      setRevisionForm({
                        ...revisionForm,
                        status: e.target.value as CreateRevisionParams['status'],
                      })
                    }
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="draft">Draft</option>
                    <option value="sent_to_review">Trimis în review</option>
                    <option value="approved">Aprobat</option>
                    <option value="rejected">Respins</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">Note</label>
                  <textarea
                    value={revisionForm.notes}
                    onChange={(e) =>
                      setRevisionForm({ ...revisionForm, notes: e.target.value })
                    }
                    rows={3}
                    placeholder="Notițe, comentarii, modificări sugerate..."
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateRevision}
                    disabled={isSaving}
                    className="rounded-md bg-farmero-olive-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-farmero-olive-700 disabled:opacity-50"
                  >
                    {isSaving ? 'Se salvează...' : 'Salvează revizie'}
                  </button>
                  <button
                    onClick={() => setShowRevisionForm(false)}
                    className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                  >
                    Anulează
                  </button>
                </div>
              </div>
            )}

            {revisions.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nu există revizii pentru acest articol.</p>
            ) : (
              <div className="space-y-4">
                {revisions.map((revision) => (
                  <div
                    key={revision.id}
                    className="rounded-lg border border-border bg-muted/50 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium">Versiunea {revision.version}</span>
                        {(revision.editorName || revision.editor?.fullName) && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            de {revision.editorName || revision.editor?.fullName}
                          </span>
                        )}
                      </div>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          revision.status === 'approved'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : revision.status === 'rejected'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        }`}
                      >
                        {revision.status}
                      </span>
                    </div>
                    <div className="mb-2 text-sm">
                      <div className="font-medium">{revision.title}</div>
                      <div className="mt-1 text-muted-foreground">{revision.excerpt}</div>
                    </div>
                    {revision.notes && (
                      <div className="mt-2 rounded bg-background p-2 text-xs text-muted-foreground">
                        {revision.notes}
                      </div>
                    )}
                    <div className="mt-2 text-xs text-muted-foreground">
                      {new Date(revision.createdAt).toLocaleString('ro-RO')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Workflow Actions */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Workflow</h2>
            <div className="space-y-3">
              {article.status === 'draft' && (
                <button
                  onClick={() => handleStatusChange('review')}
                  disabled={isSaving}
                  className="flex w-full items-center gap-2 rounded-md bg-yellow-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-yellow-700 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  Trimite în review
                </button>
              )}
              {article.status === 'review' && (
                <>
                  <button
                    onClick={() => handleStatusChange('approved')}
                    disabled={isSaving}
                    className="flex w-full items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Aprobă articol
                  </button>
                  <button
                    onClick={() => handleStatusChange('archived')}
                    disabled={isSaving}
                    className="flex w-full items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                  >
                    <XCircle className="h-4 w-4" />
                    Respinge articol
                  </button>
                </>
              )}
              {article.status === 'approved' && (
                <button
                  onClick={() => handleStatusChange('published')}
                  disabled={isSaving}
                  className="flex w-full items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                >
                  <CheckCircle className="h-4 w-4" />
                  Publică articol
                </button>
              )}
              {article.status !== 'archived' && (
                <button
                  onClick={() => handleStatusChange('archived')}
                  disabled={isSaving}
                  className="flex w-full items-center gap-2 rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:opacity-50"
                >
                  <Archive className="h-4 w-4" />
                  Arhivează
                </button>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Timeline</h2>
            <div className="space-y-4">
              {getStatusTimeline().map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1 flex h-2 w-2 rounded-full bg-farmero-olive-600"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(item.date).toLocaleString('ro-RO')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Date</h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-muted-foreground">Creat la</dt>
                <dd className="mt-1 font-medium">
                  {new Date(article.createdAt).toLocaleString('ro-RO')}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Actualizat la</dt>
                <dd className="mt-1 font-medium">
                  {new Date(article.updatedAt).toLocaleString('ro-RO')}
                </dd>
              </div>
              {article.publishedAt && (
                <div>
                  <dt className="text-muted-foreground">Publicat la</dt>
                  <dd className="mt-1 font-medium">
                    {new Date(article.publishedAt).toLocaleString('ro-RO')}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Metrics */}
          {article.metrics && (
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Metrici</h2>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Vizualizări</dt>
                  <dd className="font-medium">{article.metrics.views}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Vizualizări unice</dt>
                  <dd className="font-medium">{article.metrics.uniqueViews}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Click-uri producător</dt>
                  <dd className="font-medium">{article.metrics.clicksToProducer}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Click-uri produse</dt>
                  <dd className="font-medium">{article.metrics.clicksToProducts}</dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Confirmă"
        cancelText="Anulează"
      />
    </div>
  )
}

