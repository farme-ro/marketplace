/**
 * Logistics Portal Types
 * 
 * Types for Logistics portal dashboard, deliveries, and statistics
 */

// ============================================================================
// Logistics Dashboard
// ============================================================================

export interface LogisticsDashboardStats {
  totalDeliveries: number
  completedDeliveries: number
  inTransitDeliveries: number
  pendingDeliveries: number
  totalRevenue: number
  averageDeliveryTime?: number // in hours
  onTimeDeliveryRate?: number // percentage
  deliveriesThisMonth: number
  revenueThisMonth: number
  deliveriesGrowth?: number // Percentage growth
  revenueGrowth?: number // Percentage growth
}

export interface LogisticsDelivery {
  id: string
  deliveryNumber: string
  orderId: string
  orderNumber: string
  clientName: string
  clientPhone?: string
  status: 'PENDING' | 'ASSIGNED' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED' | 'CANCELED'
  pickupAddress: {
    name: string
    address: string
    city: string
    postalCode?: string
    phone?: string
  }
  deliveryAddress: {
    name: string
    address: string
    city: string
    postalCode?: string
    phone?: string
  }
  estimatedPickupTime?: string
  estimatedDeliveryTime?: string
  actualPickupTime?: string
  actualDeliveryTime?: string
  totalValue: number
  deliveryFee: number
  createdAt: string
  assignedAt?: string
  completedAt?: string
}

export interface LogisticsDeliveryStatus {
  pending: number
  assigned: number
  inTransit: number
  delivered: number
  failed: number
  canceled: number
}

// ============================================================================
// Logistics Route
// ============================================================================

export interface LogisticsRoute {
  id: string
  name: string
  region: string
  deliveries: LogisticsDelivery[]
  estimatedDuration?: number // in hours
  totalDistance?: number // in km
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED'
}

