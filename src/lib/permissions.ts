/**
 * RBAC (Role-Based Access Control) System
 * 
 * Defines roles, permissions, and helper functions for access control
 */

import type { AdminMe } from './api/types'

/**
 * Admin Roles
 * 
 * - superadmin: Full access to everything
 * - admin: Standard admin access (most common)
 * - support: Customer support operations
 * - finance: Financial operations (orders, refunds)
 * - content: Content management (journal articles)
 */
export type AdminRole = 'superadmin' | 'admin' | 'support' | 'finance' | 'content' | 'marketing'

/**
 * Admin Permissions
 * 
 * View permissions: Read-only access
 * Edit permissions: Modify/create access
 * Manage permissions: Full control including delete/suspend
 */
export type AdminPermission =
  // Producers
  | 'view_producers'
  | 'edit_producers'
  // Users
  | 'view_users'
  | 'manage_users'
  // Orders
  | 'view_orders'
  | 'refund_orders'
  | 'cancel_orders'
  // Journal
  | 'view_journal'
  | 'manage_journal'
  // System
  | 'view_system_status'
  | 'manage_system'
  // Financials
  | 'view_financials'
  | 'manage_financials'
  // View finance (alias for view_financials for consistency)
  | 'view_finance'
  // Subscriptions & Promotions
  | 'view_subscriptions'
  | 'manage_subscriptions'
  // Audit
  | 'view_audit_log'
  // Content Management
  | 'view_content'
  | 'manage_content'
  // Marketing & Growth
  | 'view_marketing'
  | 'manage_marketing'
  // Content & SEO
  | 'view_seo'
  | 'manage_seo'
  // Security & Access
  | 'view_security'
  | 'view_access_logs'
  // GDPR & Compliance
  | 'view_gdpr'
  | 'manage_gdpr'
  // Support
  | 'view_support'
  | 'manage_support'

/**
 * Role to Permissions Mapping
 */
const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  superadmin: [
    // All permissions
    'view_producers',
    'edit_producers',
    'view_users',
    'manage_users',
    'view_orders',
    'refund_orders',
    'cancel_orders',
    'view_journal',
    'manage_journal',
    'view_system_status',
    'manage_system',
    'view_financials',
    'view_finance',
    'manage_financials',
    'view_subscriptions',
    'manage_subscriptions',
    'view_content',
    'manage_content',
    'view_marketing',
    'manage_marketing',
    'view_seo',
    'view_security',
    'view_access_logs',
    'view_gdpr',
    'manage_gdpr',
    'view_audit_log',
  ],
  admin: [
    // Standard admin - most operations except system management
    'view_producers',
    'edit_producers',
    'view_users',
    'manage_users',
    'view_orders',
    'refund_orders',
    'cancel_orders',
    'view_journal',
    'manage_journal',
    'view_system_status',
    'view_financials',
    'view_finance',
    'view_subscriptions',
    'view_content',
    'manage_content',
    'view_marketing',
    'view_seo',
    'view_gdpr',
    'manage_gdpr',
    'view_audit_log',
    // Admin can optionally have security access (policy dependent)
    // 'view_security',
    // 'view_access_logs',
  ],
  support: [
    // Customer support - view and moderate users/producers
    'view_producers',
    'edit_producers',
    'view_users',
    'manage_users',
    'view_orders',
    'view_journal',
    'view_gdpr',
    'view_audit_log',
  ],
  finance: [
    // Financial operations - orders and financials
    'view_producers',
    'view_users',
    'view_orders',
    'refund_orders',
    'cancel_orders',
    'view_financials',
    'view_finance',
    'manage_financials',
    'view_subscriptions',
    'manage_subscriptions',
    'view_audit_log',
  ],
  content: [
    // Content management - journal articles, pages, FAQ
    'view_producers',
    'view_users',
    'view_orders',
    'view_journal',
    'manage_journal',
    'view_content',
    'manage_content',
    'view_seo',
    'view_audit_log',
  ],
  marketing: [
    // Marketing & Growth - analytics, funnels, campaigns
    'view_producers',
    'view_users',
    'view_orders',
    'view_journal',
    'view_subscriptions',
    'view_marketing',
    'manage_marketing',
    'view_seo',
    'view_audit_log',
  ],
}

/**
 * Get permissions for a role
 */
export function getPermissionsForRole(role: AdminRole | string): AdminPermission[] {
  // Map backend roles to our AdminRole
  const normalizedRole = normalizeRole(role)
  return ROLE_PERMISSIONS[normalizedRole] || []
}

/**
 * Normalize backend role to AdminRole
 * 
 * Backend may return 'ADMIN' but we use 'admin' internally
 */
function normalizeRole(role: string): AdminRole {
  const roleLower = role.toLowerCase()
  
  // Map backend roles to our roles
  if (roleLower === 'admin' || roleLower === 'superadmin') {
    // Check if it's superadmin (could be in metadata or separate check)
    // For now, assume 'ADMIN' from backend is 'admin' role
    return 'admin'
  }
  
  // Support other role formats
  if (roleLower.includes('support')) return 'support'
  if (roleLower.includes('finance')) return 'finance'
  if (roleLower.includes('content')) return 'content'
  
  // Default to admin if unknown
  return 'admin'
}

/**
 * Check if admin has a specific permission
 */
export function hasPermission(
  admin: AdminMe | null,
  permission: AdminPermission
): boolean {
  if (!admin) return false

  const role = normalizeRole(admin.role)
  const permissions = getPermissionsForRole(role)
  
  return permissions.includes(permission)
}

/**
 * Check if admin has any of the specified permissions
 */
export function hasAnyPermission(
  admin: AdminMe | null,
  permissions: AdminPermission[]
): boolean {
  if (!admin) return false
  
  return permissions.some(permission => hasPermission(admin, permission))
}

/**
 * Check if admin has all of the specified permissions
 */
export function hasAllPermissions(
  admin: AdminMe | null,
  permissions: AdminPermission[]
): boolean {
  if (!admin) return false
  
  return permissions.every(permission => hasPermission(admin, permission))
}

/**
 * Check if admin can perform moderation actions
 */
export function canModerate(admin: AdminMe | null): boolean {
  return hasAnyPermission(admin, ['edit_producers', 'manage_users'])
}

/**
 * Check if admin can manage orders
 */
export function canManageOrders(admin: AdminMe | null): boolean {
  return hasAnyPermission(admin, ['refund_orders', 'cancel_orders'])
}

/**
 * Get admin role (normalized)
 */
export function getAdminRole(admin: AdminMe | null): AdminRole | null {
  if (!admin) return null
  return normalizeRole(admin.role)
}

