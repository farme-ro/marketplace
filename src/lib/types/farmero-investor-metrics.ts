/**
 * Farmero Investor Metrics Types
 * 
 * Type definitions for aggregated, anonymized investor metrics.
 * 
 * IMPORTANT: All data is aggregated and anonymized - no personal identifiers (names, emails, user IDs).
 * Only high-level metrics, segments, and regional breakdowns are included.
 */

// ============================================================================
// KPI Time Series
// ============================================================================

/**
 * Single data point in a time series
 */
export interface FarmeroKpiTimePoint {
  date: string // ISO date string (daily / weekly / monthly)
  value: number
}

/**
 * Time series for a KPI
 */
export interface FarmeroKpiSeries {
  id: string
  label: string
  points: FarmeroKpiTimePoint[]
}

// ============================================================================
// Core Metrics Snapshot
// ============================================================================

/**
 * Snapshot of core platform metrics at a specific timestamp
 */
export interface FarmeroCoreMetricsSnapshot {
  timestamp: string // ISO timestamp
  totalOrders: number
  totalGrossMerchandiseVolume: number // GMV - total value of all orders
  totalFarmeroFeesCollected: number // Total fees collected by Farmero
  totalProducersActive: number
  totalClientsActive: number
  totalBusinessClientsActive: number
  totalRegionsActive: number
}

// ============================================================================
// Growth & Retention Metrics
// ============================================================================

/**
 * High-level growth and retention metrics for a period
 */
export interface FarmeroGrowthMetrics {
  periodLabel: string // e.g., "Ultimele 30 de zile"
  newClients: number
  returningClients: number
  newProducers: number
  averageOrderValue: number
  repeatOrderRate: number // 0–1 (percentage as decimal)
}

// ============================================================================
// Segment Breakdown
// ============================================================================

/**
 * Breakdown by client segment (anonymized)
 */
export interface FarmeroSegmentBreakdown {
  segmentLabel: string // e.g., "Clienți recurenți", "Noi clienți", "Abonați", "Business clients"
  ordersCount: number
  gmv: number // Gross Merchandise Volume for this segment
  fees: number // Fees collected from this segment
}

// ============================================================================
// Region Breakdown
// ============================================================================

/**
 * Breakdown by region (anonymized)
 */
export interface FarmeroRegionBreakdown {
  regionName: string // Anonymized region name
  ordersCount: number
  gmv: number
  producersCount: number
}

// ============================================================================
// Complete Investor Metrics Response
// ============================================================================

/**
 * Complete investor metrics response
 * 
 * Contains all aggregated, anonymized metrics for the investor dashboard.
 */
export interface FarmeroInvestorMetrics {
  snapshot: FarmeroCoreMetricsSnapshot
  growth: FarmeroGrowthMetrics
  kpiSeries: {
    ordersOverTime: FarmeroKpiSeries
    gmvOverTime: FarmeroKpiSeries
    feesOverTime: FarmeroKpiSeries
  }
  segments: FarmeroSegmentBreakdown[]
  regions: FarmeroRegionBreakdown[]
}

