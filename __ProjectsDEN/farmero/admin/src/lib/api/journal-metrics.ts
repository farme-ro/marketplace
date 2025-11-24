/**
 * Journal Metrics API
 * 
 * API functions for journal metrics and analytics
 */

import { apiFetch } from './client'

// ==================== TYPES ====================

export interface JournalMetricsSummary {
  totalPublished: number
  totalViews: number
  totalClicks: number
  ctr: number
}

export interface TopArticle {
  articleId: string
  title: string
  slug: string
  producerId: string
  producerName: string
  views: number
  uniqueViews: number
  clicksToProducer: number
  clicksToProducts: number
  totalClicks: number
  ctr: number
  publishedAt: string | null
  createdAt: string
}

export interface TopProducer {
  producerId: string
  producerName: string
  articleCount: number
  totalViews: number
  totalClicks: number
  ctr: number
}

export interface TimeSeriesDataPoint {
  date: string
  views: number
}

export interface GetMetricsParams {
  days?: number
  limit?: number
}

// ==================== API FUNCTIONS ====================

export async function getJournalMetricsSummary(
  params?: GetMetricsParams
): Promise<JournalMetricsSummary> {
  const queryParams = new URLSearchParams()
  if (params?.days) queryParams.append('days', params.days.toString())

  const query = queryParams.toString()
  return apiFetch<JournalMetricsSummary>(
    `/admin/journal/metrics/summary${query ? `?${query}` : ''}`
  )
}

export async function getTopArticles(
  params?: GetMetricsParams
): Promise<{ data: TopArticle[] }> {
  const queryParams = new URLSearchParams()
  if (params?.limit) queryParams.append('limit', params.limit.toString())
  if (params?.days) queryParams.append('days', params.days.toString())

  const query = queryParams.toString()
  return apiFetch<{ data: TopArticle[] }>(
    `/admin/journal/metrics/top-articles${query ? `?${query}` : ''}`
  )
}

export async function getTopProducers(
  params?: GetMetricsParams
): Promise<{ data: TopProducer[] }> {
  const queryParams = new URLSearchParams()
  if (params?.limit) queryParams.append('limit', params.limit.toString())
  if (params?.days) queryParams.append('days', params.days.toString())

  const query = queryParams.toString()
  return apiFetch<{ data: TopProducer[] }>(
    `/admin/journal/metrics/top-producers${query ? `?${query}` : ''}`
  )
}

export async function getViewsTimeSeries(
  params?: GetMetricsParams
): Promise<{ data: TimeSeriesDataPoint[] }> {
  const queryParams = new URLSearchParams()
  if (params?.days) queryParams.append('days', params.days.toString())

  const query = queryParams.toString()
  return apiFetch<{ data: TimeSeriesDataPoint[] }>(
    `/admin/journal/metrics/timeseries${query ? `?${query}` : ''}`
  )
}

