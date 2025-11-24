/**
 * Advanced Analytics
 * 
 * Advanced analytics tracking and reporting
 */

import { trackEvent, EventData } from './tracker';
import { apiFetch } from '../api/client';
import { isBackendSyncEnabled } from '../backend-sync/status';

/**
 * Track user engagement metrics
 */
export function trackEngagement(action: string, data?: EventData): void {
  trackEvent('user_engagement', {
    action,
    timestamp: new Date().toISOString(),
    ...data,
  });
}

/**
 * Track conversion events
 */
export function trackConversion(type: string, value?: number, data?: EventData): void {
  trackEvent('conversion', {
    type,
    value,
    timestamp: new Date().toISOString(),
    ...data,
  });
}

/**
 * Track user journey
 */
export function trackJourney(step: string, data?: EventData): void {
  trackEvent('user_journey', {
    step,
    timestamp: new Date().toISOString(),
    ...data,
  });
}

/**
 * Track performance metrics
 */
export function trackPerformance(metric: string, value: number, data?: EventData): void {
  trackEvent('performance', {
    metric,
    value,
    timestamp: new Date().toISOString(),
    ...data,
  });
}

/**
 * Get analytics dashboard data (admin only)
 */
export async function getAnalyticsDashboard(startDate?: string, endDate?: string) {
  // Analytics doesn't use backend sync status - always allow
  // if (!isBackendSyncEnabled('analytics')) {
  //   return null;
  // }

  try {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await apiFetch(`/analytics/dashboard?${params.toString()}`, {
      method: 'GET',
      credentials: 'include',
    });

    return response;
  } catch (error) {
    console.error('Error fetching analytics dashboard:', error);
    return null;
  }
}

/**
 * Get product analytics
 */
export async function getProductAnalytics(startDate?: string, endDate?: string) {
  // Analytics doesn't use backend sync status - always allow
  // if (!isBackendSyncEnabled('analytics')) {
  //   return null;
  // }

  try {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await apiFetch(`/analytics/products?${params.toString()}`, {
      method: 'GET',
      credentials: 'include',
    });

    return response;
  } catch (error) {
    console.error('Error fetching product analytics:', error);
    return null;
  }
}

/**
 * Get order analytics
 */
export async function getOrderAnalytics(startDate?: string, endDate?: string, period?: 'day' | 'week' | 'month' | 'year') {
  // Analytics doesn't use backend sync status - always allow
  // if (!isBackendSyncEnabled('analytics')) {
  //   return null;
  // }

  try {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (period) params.append('period', period);

    const response = await apiFetch(`/analytics/orders?${params.toString()}`, {
      method: 'GET',
      credentials: 'include',
    });

    return response;
  } catch (error) {
    console.error('Error fetching order analytics:', error);
    return null;
  }
}

/**
 * Get user analytics
 */
export async function getUserAnalytics(startDate?: string, endDate?: string) {
  // Analytics doesn't use backend sync status - always allow
  // if (!isBackendSyncEnabled('analytics')) {
  //   return null;
  // }

  try {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await apiFetch(`/analytics/users?${params.toString()}`, {
      method: 'GET',
      credentials: 'include',
    });

    return response;
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    return null;
  }
}

/**
 * Get revenue analytics
 */
export async function getRevenueAnalytics(startDate?: string, endDate?: string) {
  // Analytics doesn't use backend sync status - always allow
  // if (!isBackendSyncEnabled('analytics')) {
  //   return null;
  // }

  try {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await apiFetch(`/analytics/revenue?${params.toString()}`, {
      method: 'GET',
      credentials: 'include',
    });

    return response;
  } catch (error) {
    console.error('Error fetching revenue analytics:', error);
    return null;
  }
}

/**
 * Get trends analytics
 */
export async function getTrendsAnalytics(
  startDate?: string,
  endDate?: string,
  period?: 'day' | 'week' | 'month' | 'year'
) {
  // Analytics doesn't use backend sync status - always allow
  // if (!isBackendSyncEnabled('analytics')) {
  //   return null;
  // }

  try {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (period) params.append('period', period);

    const response = await apiFetch(`/analytics/trends?${params.toString()}`, {
      method: 'GET',
      credentials: 'include',
    });

    return response;
  } catch (error) {
    console.error('Error fetching trends analytics:', error);
    return null;
  }
}

