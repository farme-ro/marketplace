/**
 * Producer Insights API
 * 
 * API functions for producer dashboard insights and statistics
 * Uses apiFetch to call https://api.farme.ro
 */

import { apiFetch, ApiError } from '../client'

// ============================================================================
// Types
// ============================================================================

export type ProducerInsights = {
  // Revenue metrics
  totalRevenueMonth: number
  totalRevenueYear: number
  averageOrderValue: number
  
  // Order metrics
  totalOrdersMonth: number
  totalOrdersYear: number
  pendingOrders: number
  confirmedOrders: number
  
  // Product metrics
  totalProducts: number
  activeProducts: number
  inactiveProducts: number
  lowStockProducts: number
  
  // Top products
  topProducts?: Array<{
    id: string
    name: string
    revenue: number
    orders: number
    quantity: number
  }>
  
  // Commission info
  currentCommissionRate?: number
  commissionPaidMonth?: number
  
  // Growth metrics
  revenueGrowthMonth?: number // percentage
  ordersGrowthMonth?: number // percentage
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get producer insights/dashboard data
 * 
 * @returns Producer insights
 * @throws ApiError if request fails
 */
export async function getProducerInsights(): Promise<ProducerInsights> {
  try {
    const insights = await apiFetch<ProducerInsights>('/producers/insights', {
      method: 'GET',
      credentials: 'include',
    })
    
    return insights
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a vedea statisticile.')
      }
      // If endpoint doesn't exist yet, return empty insights
      if (error.status === 404) {
        return {
          totalRevenueMonth: 0,
          totalRevenueYear: 0,
          averageOrderValue: 0,
          totalOrdersMonth: 0,
          totalOrdersYear: 0,
          pendingOrders: 0,
          confirmedOrders: 0,
          totalProducts: 0,
          activeProducts: 0,
          inactiveProducts: 0,
          lowStockProducts: 0,
        }
      }
      throw new Error(error.message || 'Eroare la încărcarea statisticilor.')
    }
    throw error
  }
}

