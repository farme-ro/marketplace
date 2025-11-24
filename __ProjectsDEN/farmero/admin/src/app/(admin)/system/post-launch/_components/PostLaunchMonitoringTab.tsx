'use client';

import { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle, Clock, Database, Server, XCircle } from 'lucide-react';
// Card components replaced with native divs
import { useAdminI18n } from '@/lib/i18n/context';
import {
  getPostLaunchHealthMetrics,
  getPostLaunchErrorStats,
  getPostLaunchSystemStability,
  recordPostLaunchTestEvent,
} from '@/lib/api/post-launch';
import type { HealthMetrics, ErrorStats, SystemStability } from '@/lib/post-launch/post-launch.types';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

export function PostLaunchMonitoringTab() {
  const { t } = useAdminI18n();
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics | null>(null);
  const [errorStats, setErrorStats] = useState<ErrorStats | null>(null);
  const [stability, setStability] = useState<SystemStability | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadData();
    
    let interval: NodeJS.Timeout | null = null;
    if (autoRefresh) {
      interval = setInterval(() => {
        loadData();
      }, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const loadData = async () => {
    try {
      setError(null);
      const [health, errors, systemStability] = await Promise.all([
        getPostLaunchHealthMetrics(),
        getPostLaunchErrorStats(24),
        getPostLaunchSystemStability(),
      ]);
      setHealthMetrics(health);
      setErrorStats(errors);
      setStability(systemStability);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('monitoring.errorLoadingData', 'Eroare la încărcarea datelor.'));
    } finally {
      setLoading(false);
    }
  };

  const handleTestEvent = async () => {
    try {
      await recordPostLaunchTestEvent('Manual test event from admin panel', 'low');
      alert(t('monitoring.testEventRecorded', 'Eveniment de test înregistrat!'));
      loadData();
    } catch (err) {
      alert(t('monitoring.testEventFailed', 'Eroare la înregistrare.'));
    }
  };

  if (loading) {
    return <div className="text-center text-muted-foreground">{t('common.loading', 'Se încarcă...')}</div>;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
        <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t('postLaunch.monitoring.title', 'Monitorizare & Stabilitate')}</h2>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            {t('monitoring.autoRefresh', 'Auto-refresh (30s)')}
          </label>
          <button
            onClick={handleTestEvent}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {t('monitoring.testEvent', 'Test Event')}
          </button>
        </div>
      </div>

      {/* Health Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="border rounded-lg bg-card p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">{t('monitoring.apiHealth', 'API Health')}</div>
            {healthMetrics?.apiHealth === 'healthy' ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : healthMetrics?.apiHealth === 'degraded' ? (
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
          </div>
          <div>
            <div className="text-2xl font-bold capitalize">{healthMetrics?.apiHealth || 'N/A'}</div>
          </div>
        </div>

        <div className="border rounded-lg bg-card p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">{t('monitoring.databaseHealth', 'Database Health')}</div>
            <Database className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold capitalize">{healthMetrics?.databaseHealth || 'N/A'}</div>
          </div>
        </div>

        <div className="border rounded-lg bg-card p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">{t('monitoring.errorRate', 'Error Rate')}</div>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">{healthMetrics?.errorRate.toFixed(2) || '0'}</div>
          </div>
        </div>

        <div className="border rounded-lg bg-card p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">{t('monitoring.activeUsers', 'Active Users')}</div>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">{healthMetrics?.activeUsers || 0}</div>
          </div>
        </div>
      </div>

      {/* Error Statistics */}
      {errorStats && (
        <div className="border rounded-lg bg-card p-6">
          <div className="mb-4">
            <div className="text-lg font-semibold">{t('monitoring.errorStats', 'Statistici Erori')}</div>
          </div>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/40 rounded-lg">
                <p className="text-sm text-muted-foreground">{t('monitoring.totalErrors', 'Total Erori')}</p>
                <p className="text-2xl font-bold">{errorStats.totalErrors}</p>
              </div>
              <div className="p-4 bg-muted/40 rounded-lg">
                <p className="text-sm text-muted-foreground">{t('monitoring.criticalErrors', 'Erori Critice')}</p>
                <p className="text-2xl font-bold text-red-500">{errorStats.criticalErrors}</p>
              </div>
              <div className="p-4 bg-muted/40 rounded-lg">
                <p className="text-sm text-muted-foreground">{t('monitoring.resolvedErrors', 'Erori Rezolvate')}</p>
                <p className="text-2xl font-bold text-green-500">{errorStats.resolvedErrors}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Stability */}
      {stability && (
        <div className="border rounded-lg bg-card p-6">
          <div className="mb-4">
            <div className="text-lg font-semibold">{t('monitoring.systemStability', 'Stabilitate Sistem')}</div>
          </div>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/40 rounded-lg">
                <p className="text-sm text-muted-foreground">{t('monitoring.uptime', 'Uptime')}</p>
                <p className="text-2xl font-bold">{Math.floor(stability.uptime / 3600)}h {Math.floor((stability.uptime % 3600) / 60)}m</p>
              </div>
              <div className="p-4 bg-muted/40 rounded-lg">
                <p className="text-sm text-muted-foreground">{t('monitoring.availability', 'Disponibilitate')}</p>
                <p className="text-2xl font-bold">{stability.availability.toFixed(2)}%</p>
              </div>
              <div className="p-4 bg-muted/40 rounded-lg">
                <p className="text-sm text-muted-foreground">{t('monitoring.downtime', 'Downtime')}</p>
                <p className="text-2xl font-bold">{Math.floor(stability.downtime / 60)}m</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

