'use client'

/**
 * i18n Translation Monitoring Page
 * 
 * Overview of translation keys and their coverage across languages
 */

import { useState, useEffect } from 'react'
import { Search, CheckCircle, AlertCircle, XCircle } from 'lucide-react'
import { AccessDenied } from '@/components/auth/AccessDenied'
import { useAdminAuth } from '@/lib/auth/admin-auth-context'
import { hasPermission } from '@/lib/permissions'
import keysSnapshot from '@/lib/i18n/keys-snapshot.json'

const LOCALES = [
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
]

interface TranslationKey {
  key: string
  baseText: string // RO text
  translations: Record<string, string>
  missingLocales: string[]
}

export default function ContentI18nPage() {
  const { admin } = useAdminAuth()
  const [keys, setKeys] = useState<TranslationKey[]>([])
  const [filteredKeys, setFilteredKeys] = useState<TranslationKey[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNamespace, setSelectedNamespace] = useState<string>('all')

  useEffect(() => {
    // Process snapshot data
    const processedKeys: TranslationKey[] = []
    const snapshotKeys = keysSnapshot.keys as Record<string, Record<string, string>>

    Object.entries(snapshotKeys).forEach(([key, translations]) => {
      const baseText = translations['ro'] || translations['en'] || Object.values(translations)[0] || ''
      const missingLocales: string[] = []

      LOCALES.forEach((locale) => {
        if (!translations[locale.code]) {
          missingLocales.push(locale.code)
        }
      })

      processedKeys.push({
        key,
        baseText,
        translations,
        missingLocales,
      })
    })

    setKeys(processedKeys)
    setFilteredKeys(processedKeys)
  }, [])

  useEffect(() => {
    let filtered = keys

    // Filter by namespace
    if (selectedNamespace !== 'all') {
      filtered = filtered.filter((k) => k.key.startsWith(`${selectedNamespace}.`))
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (k) =>
          k.key.toLowerCase().includes(query) ||
          k.baseText.toLowerCase().includes(query)
      )
    }

    setFilteredKeys(filtered)
  }, [searchQuery, selectedNamespace, keys])

  const getTranslationStatus = (key: TranslationKey, locale: string) => {
    if (key.translations[locale]) {
      return 'complete'
    }
    if (locale === 'ro') {
      return 'base' // RO is always base
    }
    return 'missing'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'base':
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case 'missing':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
  }

  const stats = {
    total: keys.length,
    complete: keys.filter((k) => k.missingLocales.length === 0).length,
    partial: keys.filter((k) => k.missingLocales.length > 0 && k.missingLocales.length < LOCALES.length - 1).length,
    missing: keys.filter((k) => k.missingLocales.length >= LOCALES.length - 1).length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Texte & i18n</h1>
        <p className="text-muted-foreground">
          Monitorizare chei de traducere și acoperire multi-limbă
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-sm font-medium text-muted-foreground">Total chei</div>
          <div className="mt-2 text-2xl font-bold text-foreground">{stats.total}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-sm font-medium text-muted-foreground">Complete</div>
          <div className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.complete}
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-sm font-medium text-muted-foreground">Parțiale</div>
          <div className="mt-2 text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {stats.partial}
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-sm font-medium text-muted-foreground">Lipsă</div>
          <div className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">
            {stats.missing}
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <p className="text-sm text-blue-800 dark:text-blue-400">
          <strong>Notă:</strong> Această pagină afișează un snapshot static al cheilor de traducere.
          Pentru a actualiza snapshot-ul, exportă cheile din frontend și actualizează{' '}
          <code>admin/src/lib/i18n/keys-snapshot.json</code>.
        </p>
        <p className="mt-2 text-xs text-blue-700 dark:text-blue-500">
          Vezi <code>docs/ADMIN_I18N_MONITORING_NOTES.md</code> pentru detalii despre procesul de
          actualizare.
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Caută după key sau text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedNamespace}
              onChange={(e) => setSelectedNamespace(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">Toate namespace-urile</option>
              {(keysSnapshot.namespaces as string[]).map((ns) => (
                <option key={ns} value={ns}>
                  {ns}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Keys Table */}
      <div className="rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Key
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                  Text (RO)
                </th>
                {LOCALES.map((locale) => (
                  <th
                    key={locale.code}
                    className="px-4 py-3 text-center text-sm font-semibold text-foreground"
                  >
                    {locale.flag} {locale.code.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredKeys.length === 0 ? (
                <tr>
                  <td colSpan={LOCALES.length + 2} className="px-4 py-8 text-center text-muted-foreground">
                    Nu am găsit chei după criteriile alese.
                  </td>
                </tr>
              ) : (
                filteredKeys.map((key) => (
                  <tr key={key.key} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <code className="text-xs text-foreground">{key.key}</code>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">{key.baseText}</td>
                    {LOCALES.map((locale) => {
                      const status = getTranslationStatus(key, locale.code)
                      return (
                        <td key={locale.code} className="px-4 py-3 text-center">
                          {getStatusIcon(status)}
                        </td>
                      )
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="rounded-lg border border-border bg-muted/50 p-4">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Legendă</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-foreground">Traducere completă</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-blue-500" />
            <span className="text-foreground">Limba de bază (RO)</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" />
            <span className="text-foreground">Traducere lipsă</span>
          </div>
        </div>
      </div>
    </div>
  )
}

