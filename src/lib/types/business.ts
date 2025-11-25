/**
 * Business Portal Types
 * 
 * Types for Business portal dashboard, orders, and statistics
 */

// ============================================================================
// Business Dashboard
// ============================================================================

export interface BusinessDashboardStats {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  activeSubscriptions: number
  averageOrderValue: number
  ordersThisMonth: number
  revenueThisMonth: number
  ordersGrowth?: number // Percentage growth
  revenueGrowth?: number // Percentage growth
}

export interface BusinessOrder {
  id: string
  orderNumber: string
  clientName: string
  clientEmail?: string
  total: number
  status: 'NEW' | 'CONFIRMED' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'CANCELED'
  createdAt: string
  deliveryDate?: string
  items: BusinessOrderItem[]
  shippingAddress?: {
    name: string
    address: string
    city: string
    postalCode?: string
    phone?: string
  }
}

export interface BusinessOrderItem {
  id: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  total: number
  unit?: string
}

export interface BusinessOrderFlow {
  new: number
  confirmed: number
  preparing: number
  shipped: number
  delivered: number
  canceled: number
}

// ============================================================================
// Business Subscription
// ============================================================================

export interface BusinessSubscription {
  id: string
  name: string
  frequency: 'weekly' | 'biweekly' | 'monthly'
  isActive: boolean
  nextDeliveryDate?: string
  items: BusinessSubscriptionItem[]
  createdAt: string
}

export interface BusinessSubscriptionItem {
  productId: string
  productName: string
  quantity: number
  unit?: string
}

