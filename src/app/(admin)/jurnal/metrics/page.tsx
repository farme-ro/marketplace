'use client'

/**
 * Journal Metrics Dashboard
 * 
 * Performance dashboard for journal articles
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, TrendingUp, Eye, MousePointerClick, BarChart3 } from 'lucide-react'
import {
  getJournalMetricsSummary,
  getTopArticles,
  getTopProducers,
  getViewsTimeSeries,
} from '@/lib/api/journal-metrics'
import type {
  JournalMetricsSummary,
  TopArticle,
  TopProducer,
  TimeSeriesDataPoint,
} from '@/lib/api/journal-metrics'

type TimeRange = 7 | 30 | 90

export default function JournalMetricsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Data
  const [summary, setSummary] = useState<JournalMetricsSummary | null>(null)
  const [topArticles, setTopArticles] = useState<TopArticle[]>([])
  const [topProducers, setTopProducers] = useState<TopProducer[]>([])
  const [timeSeries, setTimeSeries] = useState<TimeSeriesDataPoint[]>([])

  // Filters
  const [timeRange, setTimeRange] = useState<TimeRange>(30)

  useEffect(() => {
    loadData()
  }, [timeRange])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [summaryData, articlesData, producersData, timeSeriesData] = await Promise.all([
        getJournalMetricsSummary({ days: timeRange }),
        getTopArticles({ limit: 10, days: timeRange }),
        getTopProducers({ limit: 10, days: timeRange }),
        getViewsTimeSeries({ days: timeRange }),
      ])

      setSummary(summaryData)
      setTopArticles(articlesData.data)
      setTopProducers(producersData.data)
      setTimeSeries(timeSeriesData.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea metricilor')
    } finally {
      setLoading(false)
    }
  }

  // Chart helpers
  const maxViews = timeSeries.length > 0 ? Math.max(...timeSeries.map((d) => d.views)) : 0
  const chartHeight = 200

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit' })
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-farmero-olive border-r-transparent"></div>
          <p className="text-muted-foreground">Se încarcă metricile...</p>
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
            Înapoi la jurnal
          </button>
          <h1 className="text-3xl font-bold text-foreground">Metrici Jurnal</h1>
          <p className="text-muted-foreground">Performanță articole și producători</p>
        </div>

        {/* Time Range Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Perioadă:</label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value) as TimeRange)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value={7}>Ultimele 7 zile</option>
            <option value={30}>Ultimele 30 zile</option>
            <option value={90}>Ultimele 90 zile</option>
          </select>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* KPI Cards */}
      {summary && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Articole publicate</p>
                <p className="mt-2 text-3xl font-bold text-foreground">
                  {summary.totalPublished}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-farmero-olive-600" />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Views ({timeRange}d)</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{summary.totalViews}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Clicks ({timeRange}d)</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{summary.totalClicks}</p>
              </div>
              <MousePointerClick className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">CTR</p>
                <p className="mt-2 text-3xl font-bold text-foreground">
                  {summary.ctr.toFixed(2)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </div>
      )}

      {/* Time Series Chart */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Views pe zi</h2>
        {timeSeries.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-muted-foreground">
            Nu există date pentru această perioadă
          </div>
        ) : (
          <div className="relative h-[200px] w-full">
            <svg width="100%" height={chartHeight} className="overflow-visible">
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y * chartHeight}
                  x2="100%"
                  y2={y * chartHeight}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-border opacity-20"
                />
              ))}

              {/* Chart line */}
              <polyline
                points={timeSeries
                  .map(
                    (d, i) =>
                      `${(i / (timeSeries.length - 1)) * 100}%,${
                        chartHeight - (d.views / maxViews) * chartHeight
                      }`
                  )
                  .join(' ')}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-farmero-olive-600"
              />

              {/* Data points */}
              {timeSeries.map((d, i) => {
                const x = (i / (timeSeries.length - 1)) * 100
                const y = chartHeight - (d.views / maxViews) * chartHeight
                return (
                  <circle
                    key={i}
                    cx={`${x}%`}
                    cy={y}
                    r="4"
                    fill="currentColor"
                    className="text-farmero-olive-600"
                  />
                )
              })}
            </svg>

            {/* X-axis labels */}
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              {timeSeries
                .filter((_, i) => i % Math.ceil(timeSeries.length / 5) === 0)
                .map((d, i) => (
                  <span key={i}>{formatDate(d.date)}</span>
                ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Articles */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Top Articole</h2>
          {topArticles.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nu există articole pentru această perioadă</p>
          ) : (
            <div className="space-y-4">
              {topArticles.map((article) => (
                <div
                  key={article.articleId}
                  className="rounded-lg border border-border bg-muted/50 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{article.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {article.producerName}
                      </p>
                      <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                        <span>Views: {article.views}</span>
                        <span>Clicks: {article.totalClicks}</span>
                        <span>CTR: {article.ctr.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Producers */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Top Producători</h2>
          {topProducers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nu există producători pentru această perioadă
            </p>
          ) : (
            <div className="space-y-4">
              {topProducers.map((producer) => (
                <div
                  key={producer.producerId}
                  className="rounded-lg border border-border bg-muted/50 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{producer.producerName}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {producer.articleCount} {producer.articleCount === 1 ? 'articol' : 'articole'}
                      </p>
                      <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                        <span>Views: {producer.totalViews}</span>
                        <span>Clicks: {producer.totalClicks}</span>
                        <span>CTR: {producer.ctr.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

