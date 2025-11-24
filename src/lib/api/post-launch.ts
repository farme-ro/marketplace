/**
 * Post-Launch API Client
 * 
 * API functions for all POST-LIVE SUPERPROMPTS
 */

import { apiFetch, ApiError } from './client';
import type {
  HealthMetrics,
  ErrorStats,
  SystemStability,
  PerformanceMetrics,
  SEOMetrics,
  ConversionMetrics,
  UserBehaviorMetrics,
  FunnelMetrics,
  SecurityMetrics,
  TestSuite,
} from '@/lib/post-launch/post-launch.types';

// ==================== POST-LIVE 1: MONITORING ====================

export async function getPostLaunchHealthMetrics(): Promise<HealthMetrics> {
  try {
    const response = await apiFetch<HealthMetrics>('/admin/post-launch/monitoring/health');
    return response;
  } catch (error) {
    console.error('[Post-Launch API] Failed to get health metrics:', error);
    throw new ApiError('Failed to get health metrics', 500);
  }
}

export async function getPostLaunchErrorStats(hours: number = 24): Promise<ErrorStats> {
  try {
    const response = await apiFetch<ErrorStats>(`/admin/post-launch/monitoring/errors?hours=${hours}`);
    return response;
  } catch (error) {
    console.error('[Post-Launch API] Failed to get error stats:', error);
    throw new ApiError('Failed to get error stats', 500);
  }
}

export async function getPostLaunchSystemStability(): Promise<SystemStability> {
  try {
    const response = await apiFetch<SystemStability>('/admin/post-launch/monitoring/stability');
    return response;
  } catch (error) {
    console.error('[Post-Launch API] Failed to get system stability:', error);
    throw new ApiError('Failed to get system stability', 500);
  }
}

export async function recordPostLaunchTestEvent(
  description: string,
  severity: 'low' | 'medium' | 'high' | 'critical' = 'low'
): Promise<void> {
  try {
    await apiFetch('/admin/post-launch/monitoring/test-event', {
      method: 'POST',
      body: JSON.stringify({ description, severity }),
    });
  } catch (error) {
    console.error('[Post-Launch API] Failed to record test event:', error);
    throw new ApiError('Failed to record test event', 500);
  }
}

// ==================== POST-LIVE 2: PERFORMANCE ====================

export async function getPostLaunchPerformanceMetrics(): Promise<PerformanceMetrics> {
  try {
    const response = await apiFetch<PerformanceMetrics>('/admin/post-launch/performance/metrics');
    return response;
  } catch (error) {
    console.error('[Post-Launch API] Failed to get performance metrics:', error);
    throw new ApiError('Failed to get performance metrics', 500);
  }
}

export async function getPostLaunchSEOMetrics(): Promise<SEOMetrics> {
  try {
    const response = await apiFetch<SEOMetrics>('/admin/post-launch/performance/seo');
    return response;
  } catch (error) {
    console.error('[Post-Launch API] Failed to get SEO metrics:', error);
    throw new ApiError('Failed to get SEO metrics', 500);
  }
}

export async function getPostLaunchOptimizationRecommendations(): Promise<Array<{
  priority: 'high' | 'medium' | 'low';
  category: 'performance' | 'seo' | 'images' | 'caching' | 'database';
  title: string;
  description: string;
  impact: string;
}>> {
  try {
    const response = await apiFetch<Array<{
      priority: 'high' | 'medium' | 'low';
      category: 'performance' | 'seo' | 'images' | 'caching' | 'database';
      title: string;
      description: string;
      impact: string;
    }>>('/admin/post-launch/performance/recommendations');
    return response;
  } catch (error) {
    console.error('[Post-Launch API] Failed to get optimization recommendations:', error);
    throw new ApiError('Failed to get optimization recommendations', 500);
  }
}

// ==================== POST-LIVE 3: ANALYTICS ====================

export async function getPostLaunchConversionMetrics(days: number = 7): Promise<ConversionMetrics> {
  try {
    const response = await apiFetch<ConversionMetrics>(`/admin/post-launch/analytics/conversions?days=${days}`);
    return response;
  } catch (error) {
    console.error('[Post-Launch API] Failed to get conversion metrics:', error);
    throw new ApiError('Failed to get conversion metrics', 500);
  }
}

export async function getPostLaunchUserBehaviorMetrics(days: number = 7): Promise<UserBehaviorMetrics> {
  try {
    const response = await apiFetch<UserBehaviorMetrics>(`/admin/post-launch/analytics/behavior?days=${days}`);
    return response;
  } catch (error) {
    console.error('[Post-Launch API] Failed to get user behavior metrics:', error);
    throw new ApiError('Failed to get user behavior metrics', 500);
  }
}

export async function getPostLaunchFunnelMetrics(): Promise<FunnelMetrics> {
  try {
    const response = await apiFetch<FunnelMetrics>('/admin/post-launch/analytics/funnel');
    return response;
  } catch (error) {
    console.error('[Post-Launch API] Failed to get funnel metrics:', error);
    throw new ApiError('Failed to get funnel metrics', 500);
  }
}

// ==================== POST-LIVE 4: SECURITY ====================

export async function getPostLaunchSecurityMetrics(): Promise<SecurityMetrics> {
  try {
    const response = await apiFetch<SecurityMetrics>('/admin/post-launch/security/metrics');
    return response;
  } catch (error) {
    console.error('[Post-Launch API] Failed to get security metrics:', error);
    throw new ApiError('Failed to get security metrics', 500);
  }
}

export async function getPostLaunchSecurityRecommendations(): Promise<Array<{
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'authentication' | 'authorization' | 'data' | 'network' | 'headers' | 'dependencies';
  title: string;
  description: string;
  remediation: string;
}>> {
  try {
    const response = await apiFetch<Array<{
      priority: 'critical' | 'high' | 'medium' | 'low';
      category: 'authentication' | 'authorization' | 'data' | 'network' | 'headers' | 'dependencies';
      title: string;
      description: string;
      remediation: string;
    }>>('/admin/post-launch/security/recommendations');
    return response;
  } catch (error) {
    console.error('[Post-Launch API] Failed to get security recommendations:', error);
    throw new ApiError('Failed to get security recommendations', 500);
  }
}

export async function runPostLaunchSecurityAudit(): Promise<{
  score: number;
  passed: number;
  failed: number;
  warnings: number;
  checks: Array<{
    name: string;
    status: 'pass' | 'fail' | 'warning';
    message: string;
  }>;
}> {
  try {
    const response = await apiFetch<{
      score: number;
      passed: number;
      failed: number;
      warnings: number;
      checks: Array<{
        name: string;
        status: 'pass' | 'fail' | 'warning';
        message: string;
      }>;
    }>('/admin/post-launch/security/audit', {
      method: 'POST',
    });
    return response;
  } catch (error) {
    console.error('[Post-Launch API] Failed to run security audit:', error);
    throw new ApiError('Failed to run security audit', 500);
  }
}

// ==================== POST-LIVE 5: QA ====================

export async function runPostLaunchAllQATests(): Promise<{
  suites: TestSuite[];
  totalPassed: number;
  totalFailed: number;
  totalWarnings: number;
  totalDuration: number;
  overallStatus: 'pass' | 'fail' | 'warning';
}> {
  try {
    const response = await apiFetch<{
      suites: TestSuite[];
      totalPassed: number;
      totalFailed: number;
      totalWarnings: number;
      totalDuration: number;
      overallStatus: 'pass' | 'fail' | 'warning';
    }>('/admin/post-launch/qa/run-all', {
      method: 'POST',
    });
    return response;
  } catch (error) {
    console.error('[Post-Launch API] Failed to run QA tests:', error);
    throw new ApiError('Failed to run QA tests', 500);
  }
}

export async function runPostLaunchFunctionalTests(): Promise<TestSuite> {
  try {
    const response = await apiFetch<TestSuite>('/admin/post-launch/qa/functional', {
      method: 'POST',
    });
    return response;
  } catch (error) {
    console.error('[Post-Launch API] Failed to run functional tests:', error);
    throw new ApiError('Failed to run functional tests', 500);
  }
}

export async function runPostLaunchLoadTests(): Promise<TestSuite> {
  try {
    const response = await apiFetch<TestSuite>('/admin/post-launch/qa/load', {
      method: 'POST',
    });
    return response;
  } catch (error) {
    console.error('[Post-Launch API] Failed to run load tests:', error);
    throw new ApiError('Failed to run load tests', 500);
  }
}

export async function runPostLaunchRegressionTests(): Promise<TestSuite> {
  try {
    const response = await apiFetch<TestSuite>('/admin/post-launch/qa/regression', {
      method: 'POST',
    });
    return response;
  } catch (error) {
    console.error('[Post-Launch API] Failed to run regression tests:', error);
    throw new ApiError('Failed to run regression tests', 500);
  }
}

