/**
 * Post-Launch Monitoring API Client
 * 
 * API functions for monitoring system health during first 72 hours
 */

import { apiFetch, ApiError } from './client';
import type {
  HealthMetrics,
  ErrorStats,
  SystemStability,
} from '@/lib/monitoring/monitoring.types';

/**
 * Get current health metrics
 */
export async function getHealthMetrics(): Promise<HealthMetrics> {
  try {
    const response = await apiFetch<HealthMetrics>('/admin/monitoring/health');
    return response;
  } catch (error) {
    console.error('[Monitoring API] Failed to get health metrics:', error);
    throw new ApiError('Failed to get health metrics', 500);
  }
}

/**
 * Get error statistics
 */
export async function getErrorStats(hours: number = 24): Promise<ErrorStats> {
  try {
    const response = await apiFetch<ErrorStats>(`/admin/monitoring/errors?hours=${hours}`);
    return response;
  } catch (error) {
    console.error('[Monitoring API] Failed to get error stats:', error);
    throw new ApiError('Failed to get error stats', 500);
  }
}

/**
 * Get system stability metrics
 */
export async function getSystemStability(): Promise<SystemStability> {
  try {
    const response = await apiFetch<SystemStability>('/admin/monitoring/stability');
    return response;
  } catch (error) {
    console.error('[Monitoring API] Failed to get system stability:', error);
    throw new ApiError('Failed to get system stability', 500);
  }
}

/**
 * Record a manual test event
 */
export async function recordTestEvent(
  description: string,
  severity: 'low' | 'medium' | 'high' | 'critical' = 'low'
): Promise<void> {
  try {
    await apiFetch('/admin/monitoring/test-event', {
      method: 'POST',
      body: JSON.stringify({ description, severity }),
    });
  } catch (error) {
    console.error('[Monitoring API] Failed to record test event:', error);
    throw new ApiError('Failed to record test event', 500);
  }
}

