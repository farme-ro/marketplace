/**
 * Investor Portal Types
 * 
 * Types for Investor portal analytics, transactions, and anonymized data
 */

// ============================================================================
// Investor Dashboard Analytics
// ============================================================================

export interface InvestorDashboardStats {
  totalRevenue: number
  revenueGrowth: number // Percentage
  totalTransactions: number
  transactionsGrowth: number // Percentage
  totalOrders: number
  ordersGrowth: number // Percentage
  activeProducers: number
  producersGrowth: number // Percentage
  activeUsers: number
  usersGrowth: number // Percentage
  averageOrderValue: number
  orderValueGrowth: number // Percentage
  totalProducts: number
  platformCommission: number
  platformCommissionGrowth: number // Percentage
}

// ============================================================================
// Transaction Volume
// ============================================================================

export interface TransactionVolume {
  date: string // ISO date string
  volume: number // Total transaction volume in RON
  orders: number // Number of orders
  revenue: number // Revenue in RON
}

export interface TransactionVolumePeriod {
  period: 'daily' | 'weekly' | 'monthly'
  data: TransactionVolume[]
}

// ============================================================================
// Order Evolution
// ============================================================================

export interface OrderEvolution {
  date: string // ISO date string
  orders: number // Number of orders
  completedOrders: number
  canceledOrders: number
  averageValue: number // Average order value
}

export interface OrderEvolutionPeriod {
  period: 'daily' | 'weekly' | 'monthly'
  data: OrderEvolution[]
}

// ============================================================================
// Top Items (Anonymized)
// ============================================================================

export interface TopProduct {
  id: string // Anonymized ID
  category: string
  salesCount: number
  revenue: number
  growth?: number // Percentage growth
}

export interface TopRegion {
  id: string // Anonymized ID
  name: string // Anonymized name (e.g., "Regiunea 1")
  orders: number
  revenue: number
  producers: number // Number of producers in region
  growth?: number // Percentage growth
}

export interface TopProducer {
  id: string // Anonymized ID
  region: string // Anonymized region
  orders: number
  revenue: number
  products: number // Number of products
  rating?: number // Average rating (if available)
  growth?: number // Percentage growth
}

export interface TopItems {
  products: TopProduct[]
  regions: TopRegion[]
  producers: TopProducer[]
}

// ============================================================================
// Financial Flow
// ============================================================================

export interface FinancialFlow {
  date: string // ISO date string
  revenue: number
  commission: number
  payouts: number // Payouts to producers
  netRevenue: number // Revenue - payouts
}

export interface FinancialFlowPeriod {
  period: 'daily' | 'weekly' | 'monthly'
  data: FinancialFlow[]
}

