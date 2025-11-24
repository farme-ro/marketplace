/**
 * Investor Analytics API
 * 
 * API functions for Investor portal analytics
 * Uses apiFetch to call https://api.farme.ro (external backend API)
 * 
 * IMPORTANT: Backend-ul este într-un repo separat (api.farme.ro).
 * Aceste funcții sunt doar API contracts și fallback-uri pentru frontend.
 * 
 * Note: Backend endpoints need to be implemented in the separate backend repository:
 * - GET /investor/analytics/dashboard - Get dashboard statistics
 * - GET /investor/analytics/transactions/volume - Get transaction volume
 * - GET /investor/analytics/orders/evolution - Get order evolution
 * - GET /investor/analytics/top-items - Get top products, regions, producers (anonymized)
 * - GET /investor/analytics/financial-flow - Get financial flow data
 * 
 * FALLBACK: If investorDashboard is disabled in BackendSyncStatus, returns mock data
 * 
 * See: docs/BACKEND_API_CONTRACT_INVESTOR.md for API contract documentation
 */

import { apiFetch, ApiError } from '../client'
import { isBackendSyncEnabled } from '@/lib/backend-sync/status'
import type {
  InvestorDashboardStats,
  TransactionVolume,
  TransactionVolumePeriod,
  OrderEvolution,
  OrderEvolutionPeriod,
  TopItems,
  FinancialFlow,
  FinancialFlowPeriod,
} from '@/lib/types/investor'

// ============================================================================
// Mock Data Generators
// ============================================================================

function generateMockDashboardStats(): InvestorDashboardStats {
  return {
    totalRevenue: 2500000,
    revenueGrowth: 25.5,
    totalTransactions: 12500,
    transactionsGrowth: 30.1,
    totalOrders: 12500,
    ordersGrowth: 30.1,
    activeProducers: 520,
    producersGrowth: 15.2,
    activeUsers: 8500,
    usersGrowth: 22.4,
    averageOrderValue: 200,
    orderValueGrowth: 5.3,
    totalProducts: 3500,
    platformCommission: 375000,
    platformCommissionGrowth: 25.5,
  }
}

function generateMockTransactionVolume(period: 'daily' | 'weekly' | 'monthly'): TransactionVolume[] {
  const data: TransactionVolume[] = []
  const now = new Date()
  const days = period === 'daily' ? 30 : period === 'weekly' ? 12 : 6

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    if (period === 'daily') {
      date.setDate(date.getDate() - i)
    } else if (period === 'weekly') {
      date.setDate(date.getDate() - i * 7)
    } else {
      date.setMonth(date.getMonth() - i)
    }

    const baseVolume = 50000 + Math.random() * 20000
    data.push({
      date: date.toISOString(),
      volume: Math.round(baseVolume),
      orders: Math.round(50 + Math.random() * 30),
      revenue: Math.round(baseVolume * 0.8),
    })
  }

  return data
}

function generateMockOrderEvolution(period: 'daily' | 'weekly' | 'monthly'): OrderEvolution[] {
  const data: OrderEvolution[] = []
  const now = new Date()
  const days = period === 'daily' ? 30 : period === 'weekly' ? 12 : 6

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    if (period === 'daily') {
      date.setDate(date.getDate() - i)
    } else if (period === 'weekly') {
      date.setDate(date.getDate() - i * 7)
    } else {
      date.setMonth(date.getMonth() - i)
    }

    const orders = Math.round(100 + Math.random() * 50)
    data.push({
      date: date.toISOString(),
      orders,
      completedOrders: Math.round(orders * 0.9),
      canceledOrders: Math.round(orders * 0.05),
      averageValue: Math.round(150 + Math.random() * 50),
    })
  }

  return data
}

function generateMockTopItems(): TopItems {
  return {
    products: [
      {
        id: 'prod-anon-1',
        category: 'Lactate',
        salesCount: 1250,
        revenue: 187500,
        growth: 15.2,
      },
      {
        id: 'prod-anon-2',
        category: 'Fructe',
        salesCount: 980,
        revenue: 147000,
        growth: 22.5,
      },
      {
        id: 'prod-anon-3',
        category: 'Legume',
        salesCount: 850,
        revenue: 127500,
        growth: 8.3,
      },
      {
        id: 'prod-anon-4',
        category: 'Carne',
        salesCount: 720,
        revenue: 216000,
        growth: 12.1,
      },
      {
        id: 'prod-anon-5',
        category: 'Miere',
        salesCount: 650,
        revenue: 97500,
        growth: 18.7,
      },
    ],
    regions: [
      {
        id: 'reg-anon-1',
        name: 'Regiunea 1',
        orders: 3200,
        revenue: 480000,
        producers: 85,
        growth: 20.5,
      },
      {
        id: 'reg-anon-2',
        name: 'Regiunea 2',
        orders: 2800,
        revenue: 420000,
        producers: 72,
        growth: 15.3,
      },
      {
        id: 'reg-anon-3',
        name: 'Regiunea 3',
        orders: 2400,
        revenue: 360000,
        producers: 65,
        growth: 12.8,
      },
      {
        id: 'reg-anon-4',
        name: 'Regiunea 4',
        orders: 2100,
        revenue: 315000,
        producers: 58,
        growth: 18.2,
      },
      {
        id: 'reg-anon-5',
        name: 'Regiunea 5',
        orders: 2000,
        revenue: 300000,
        producers: 55,
        growth: 10.5,
      },
    ],
    producers: [
      {
        id: 'prod-anon-1',
        region: 'Regiunea 1',
        orders: 450,
        revenue: 67500,
        products: 25,
        rating: 4.8,
        growth: 25.3,
      },
      {
        id: 'prod-anon-2',
        region: 'Regiunea 2',
        orders: 380,
        revenue: 57000,
        products: 22,
        rating: 4.7,
        growth: 18.5,
      },
      {
        id: 'prod-anon-3',
        region: 'Regiunea 1',
        orders: 320,
        revenue: 48000,
        products: 20,
        rating: 4.9,
        growth: 22.1,
      },
      {
        id: 'prod-anon-4',
        region: 'Regiunea 3',
        orders: 290,
        revenue: 43500,
        products: 18,
        rating: 4.6,
        growth: 15.8,
      },
      {
        id: 'prod-anon-5',
        region: 'Regiunea 2',
        orders: 270,
        revenue: 40500,
        products: 16,
        rating: 4.8,
        growth: 19.2,
      },
    ],
  }
}

function generateMockFinancialFlow(period: 'daily' | 'weekly' | 'monthly'): FinancialFlow[] {
  const data: FinancialFlow[] = []
  const now = new Date()
  const days = period === 'daily' ? 30 : period === 'weekly' ? 12 : 6

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    if (period === 'daily') {
      date.setDate(date.getDate() - i)
    } else if (period === 'weekly') {
      date.setDate(date.getDate() - i * 7)
    } else {
      date.setMonth(date.getMonth() - i)
    }

    const revenue = Math.round(50000 + Math.random() * 20000)
    const commission = Math.round(revenue * 0.15)
    const payouts = Math.round(revenue * 0.85)
    const netRevenue = commission

    data.push({
      date: date.toISOString(),
      revenue,
      commission,
      payouts,
      netRevenue,
    })
  }

  return data
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get investor dashboard statistics
 * 
 * @returns Dashboard statistics
 * @throws ApiError if request fails
 * 
 * FALLBACK: Returns mock data if backend is not enabled
 */
export async function getInvestorDashboardStats(): Promise<InvestorDashboardStats> {
  if (!isBackendSyncEnabled('investorDashboard')) {
    return generateMockDashboardStats()
  }

  try {
    const response = await apiFetch<InvestorDashboardStats | { data: InvestorDashboardStats }>(
      '/investor/analytics/dashboard',
      {
        method: 'GET',
        credentials: 'include',
      }
    )

    if ('data' in response) {
      return response.data
    }
    return response
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a vedea statisticile.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a accesa aceste date.')
      }
      throw error
    }
    throw error
  }
}

/**
 * Get transaction volume data
 * 
 * @param period - Time period (daily, weekly, monthly)
 * @returns Transaction volume data
 * @throws ApiError if request fails
 * 
 * FALLBACK: Returns mock data if backend is not enabled
 */
export async function getTransactionVolume(
  period: 'daily' | 'weekly' | 'monthly' = 'monthly'
): Promise<TransactionVolumePeriod> {
  if (!isBackendSyncEnabled('investorDashboard')) {
    return {
      period,
      data: generateMockTransactionVolume(period),
    }
  }

  try {
    const params = new URLSearchParams()
    params.append('period', period)

    const response = await apiFetch<
      TransactionVolumePeriod | { data: TransactionVolumePeriod }
    >(`/investor/analytics/transactions/volume?${params.toString()}`, {
      method: 'GET',
      credentials: 'include',
    })

    if ('data' in response && 'period' in response.data) {
      return response.data
    }
    if ('period' in response && 'data' in response) {
      return response as TransactionVolumePeriod
    }
    // Fallback: wrap in TransactionVolumePeriod if needed
    return {
      period,
      data: Array.isArray(response) ? response : [],
    }
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a vedea volume-ul tranzacțiilor.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a accesa aceste date.')
      }
      throw error
    }
    throw error
  }
}

/**
 * Get order evolution data
 * 
 * @param period - Time period (daily, weekly, monthly)
 * @returns Order evolution data
 * @throws ApiError if request fails
 * 
 * FALLBACK: Returns mock data if backend is not enabled
 */
export async function getOrderEvolution(
  period: 'daily' | 'weekly' | 'monthly' = 'monthly'
): Promise<OrderEvolutionPeriod> {
  if (!isBackendSyncEnabled('investorDashboard')) {
    return {
      period,
      data: generateMockOrderEvolution(period),
    }
  }

  try {
    const params = new URLSearchParams()
    params.append('period', period)

    const response = await apiFetch<
      OrderEvolutionPeriod | { data: OrderEvolutionPeriod }
    >(`/investor/analytics/orders/evolution?${params.toString()}`, {
      method: 'GET',
      credentials: 'include',
    })

    if ('data' in response && 'period' in response.data) {
      return response.data
    }
    if ('period' in response && 'data' in response) {
      return response as OrderEvolutionPeriod
    }
    // Fallback: wrap in OrderEvolutionPeriod if needed
    return {
      period,
      data: Array.isArray(response) ? response : [],
    }
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a vedea evoluția comenzilor.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a accesa aceste date.')
      }
      throw error
    }
    throw error
  }
}

/**
 * Get top items (products, regions, producers) - anonymized
 * 
 * @param limit - Number of items to return (default: 5)
 * @returns Top items data
 * @throws ApiError if request fails
 * 
 * FALLBACK: Returns mock data if backend is not enabled
 */
export async function getTopItems(limit: number = 5): Promise<TopItems> {
  if (!isBackendSyncEnabled('investorDashboard')) {
    const mockData = generateMockTopItems()
    return {
      products: mockData.products.slice(0, limit),
      regions: mockData.regions.slice(0, limit),
      producers: mockData.producers.slice(0, limit),
    }
  }

  try {
    const params = new URLSearchParams()
    params.append('limit', limit.toString())

    const response = await apiFetch<TopItems | { data: TopItems }>(
      `/investor/analytics/top-items?${params.toString()}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    )

    if ('data' in response) {
      return response.data
    }
    return response
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a vedea top items.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a accesa aceste date.')
      }
      throw error
    }
    throw error
  }
}

/**
 * Get financial flow data
 * 
 * @param period - Time period (daily, weekly, monthly)
 * @returns Financial flow data
 * @throws ApiError if request fails
 * 
 * FALLBACK: Returns mock data if backend is not enabled
 */
export async function getFinancialFlow(
  period: 'daily' | 'weekly' | 'monthly' = 'monthly'
): Promise<FinancialFlowPeriod> {
  if (!isBackendSyncEnabled('investorDashboard')) {
    return {
      period,
      data: generateMockFinancialFlow(period),
    }
  }

  try {
    const params = new URLSearchParams()
    params.append('period', period)

    const response = await apiFetch<FinancialFlowPeriod | { data: FinancialFlowPeriod }>(
      `/investor/analytics/financial-flow?${params.toString()}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    )

    if ('data' in response && 'period' in response.data) {
      return response.data
    }
    if ('period' in response && 'data' in response) {
      return response as FinancialFlowPeriod
    }
    // Fallback: wrap in FinancialFlowPeriod if needed
    return {
      period,
      data: Array.isArray(response) ? response : [],
    }
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a vedea fluxul financiar.')
      }
      if (error.status === 403) {
        throw new Error('Nu ai permisiunea de a accesa aceste date.')
      }
      throw error
    }
    throw error
  }
}

