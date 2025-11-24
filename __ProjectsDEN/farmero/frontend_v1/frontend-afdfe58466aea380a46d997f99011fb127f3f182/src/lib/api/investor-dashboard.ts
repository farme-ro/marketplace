/**
 * Investor Dashboard API
 * 
 * API layer for investor dashboard with anonymized metrics
 * Integrates with BackendSyncStatus for fallback mode
 */

import { apiFetch } from './client'
import { isBackendSyncEnabled } from '@/lib/backend-sync/status'
import type { InvestorDashboardData, InvestorKpiSnapshot, InvestorTimeSeriesPoint } from '@/lib/types/domain'

/**
 * Get investor dashboard data
 * Returns anonymized, aggregated metrics
 */
export async function getInvestorDashboardData(): Promise<InvestorDashboardData | null> {
  if (!isBackendSyncEnabled('investorMetrics')) {
    // Fallback: return mock data
    return generateMockDashboardData()
  }

  try {
    const response = await apiFetch<InvestorDashboardData>('/investor/dashboard', {
      method: 'GET',
    })
    return response || generateMockDashboardData()
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('[Investor Dashboard API] Failed to load data:', error)
    }
    // Return mock data on error
    return generateMockDashboardData()
  }
}

/**
 * Generate mock dashboard data for fallback
 */
function generateMockDashboardData(): InvestorDashboardData {
  const now = new Date()
  const timeseries: InvestorTimeSeriesPoint[] = []
  
  // Generate last 30 days of data
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    timeseries.push({
      date: date.toISOString().split('T')[0],
      ordersCount: Math.floor(Math.random() * 50) + 100,
      volumeRon: Math.floor(Math.random() * 5000) + 20000,
      newClients: Math.floor(Math.random() * 10) + 5,
    })
  }

  const snapshot: InvestorKpiSnapshot = {
    totalOrders: 12500,
    totalVolumeRon: 2500000,
    activeProducers: 520,
    activeClients: 8500,
    recurringOrderRate: 0.23, // 23%
    avgOrderValueRon: 200,
  }

  return {
    snapshot,
    timeseries,
    notes: [
      'Ponderea comenzilor recurente este ~23%.',
      'Numărul de producători activi crește de la lună la lună.',
      'Valoarea medie a comenzii este stabilă la ~200 RON.',
    ],
  }
}

