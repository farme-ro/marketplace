'use client';

import { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle, Clock, Database, Server, TrendingUp, XCircle } from 'lucide-react';
// Card components replaced with native divs
import { AccessDenied } from '@/components/auth/AccessDenied';
import { useAdminAuth } from '@/lib/auth/admin-auth-context';
import { hasPermission } from '@/lib/permissions';
import { useAdminI18n } from '@/lib/i18n/context';
import {
  getHealthMetrics,
  getErrorStats,
  getSystemStability,
  recordTestEvent,
} from '@/lib/api/monitoring';
import type { HealthMetrics, ErrorStats, SystemStability } from '@/lib/monitoring/monitoring.types';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

export default function PostLaunchMonitoringPage() {
  const { admin } = useAdminAuth();
  const { t } = useAdminI18n();
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics | null>(null);
  const [errorStats, setErrorStats] = useState<ErrorStats | null>(null);
  const [stability, setStability] = useState<SystemStability | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const loadData = async () => {
    try {
      setError(null);
      const [health, errors, systemStability] = await Promise.all([
        getHealthMetrics(),
        getErrorStats(24),
        getSystemStability(),
      ]);
      setHealthMetrics(health);
      setErrorStats(errors);
      setStability(systemStability);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare la încărcarea datelor');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Auto-refresh every 30 seconds if enabled
    let interval: NodeJS.Timeout | null = null;
    if (autoRefresh) {
      interval = setInterval(() => {
        loadData();
      }, 30000); // 30 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefresh]);

  // RBAC check - after all hooks
  const canView = hasPermission(admin, 'view_system_status');

  if (!canView) {
    return <AccessDenied requiredPermission="view_system_status" />;
  }

  const handleTestEvent = async () => {
    try {
      await recordTestEvent('Manual test event from admin panel', 'low');
      alert(t('monitoring.testEventRecorded', 'Eveniment de test înregistrat cu succes!'));
      loadData();
    } catch (err) {
      alert(t('monitoring.testEventFailed', 'Eroare la înregistrarea evenimentului de test.'));
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">{t('monitoring.title', 'Monitorizare Post-Launch')}</h1>
        <p className="text-muted-foreground">{t('monitoring.subtitle', 'Monitorizare sistem pentru primele 72h după lansare')}</p>
        <div className="text-center text-muted-foreground">{t('common.loading', 'Se încarcă...')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">{t('monitoring.title', 'Monitorizare Post-Launch')}</h1>
        <p className="text-muted-foreground">{t('monitoring.subtitle', 'Monitorizare sistem pentru primele 72h după lansare')}</p>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('monitoring.title', 'Monitorizare Post-Launch')}</h1>
          <p className="text-muted-foreground">{t('monitoring.subtitle', 'Monitorizare sistem pentru primele 72h după lansare')}</p>
        </div>
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
        <div className="border-2 border-border/60 rounded-xl shadow-sm bg-card">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
            <div className="text-sm font-medium">{t('monitoring.apiHealth', 'API Health')}</div>
            {healthMetrics?.apiHealth === 'healthy' ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : healthMetrics?.apiHealth === 'degraded' ? (
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold capitalize">{healthMetrics?.apiHealth || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">{t('monitoring.apiHealthDesc', 'Status API server')}</p>
          </div>
        </div>

        <div className="border-2 border-border/60 rounded-xl shadow-sm bg-card">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
            <div className="text-sm font-medium">{t('monitoring.databaseHealth', 'Database Health')}</div>
            <Database className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold capitalize">{healthMetrics?.databaseHealth || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">{t('monitoring.databaseHealthDesc', 'Status baza de date')}</p>
          </div>
        </div>

        <div className="border-2 border-border/60 rounded-xl shadow-sm bg-card">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
            <div className="text-sm font-medium">{t('monitoring.errorRate', 'Error Rate')}</div>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{healthMetrics?.errorRate.toFixed(2) || '0'}</div>
            <p className="text-xs text-muted-foreground">{t('monitoring.errorRateDesc', 'Erori per 1000 requests')}</p>
          </div>
        </div>

        <div className="border-2 border-border/60 rounded-xl shadow-sm bg-card">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
            <div className="text-sm font-medium">{t('monitoring.activeUsers', 'Active Users')}</div>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{healthMetrics?.activeUsers || 0}</div>
            <p className="text-xs text-muted-foreground">{t('monitoring.activeUsersDesc', 'Ultimele 24h')}</p>
          </div>
        </div>
      </div>

      {/* Error Statistics */}
      {errorStats && (
        <div className="border-2 border-border/60 rounded-2xl shadow-lg bg-card">
          <div className="p-6 pb-2">
            <div className="text-xl font-bold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              {t('monitoring.errorStats', 'Statistici Erori')}
            </div>
          </div>
          <div className="p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
            {Object.keys(errorStats.errorsByType).length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">{t('monitoring.errorsByType', 'Erori pe tip')}</p>
                <div className="space-y-2">
                  {Object.entries(errorStats.errorsByType).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                      <span className="text-sm">{type}</span>
                      <span className="text-sm font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* System Stability */}
      {stability && (
        <div className="border-2 border-border/60 rounded-2xl shadow-lg bg-card">
          <div className="p-6 pb-2">
            <div className="text-xl font-bold flex items-center gap-2">
              <Server className="h-5 w-5 text-blue-500" />
              {t('monitoring.systemStability', 'Stabilitate Sistem')}
            </div>
          </div>
          <div className="p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
            {stability.incidents.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">{t('monitoring.recentIncidents', 'Incidente Recente')}</p>
                <div className="space-y-2">
                  {stability.incidents.slice(0, 5).map((incident, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{format(new Date(incident.timestamp), 'dd MMM yyyy HH:mm', { locale: ro })}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          incident.severity === 'critical' ? 'bg-red-500/20 text-red-500' :
                          incident.severity === 'high' ? 'bg-orange-500/20 text-orange-500' :
                          incident.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                          'bg-blue-500/20 text-blue-500'
                        }`}>
                          {incident.severity}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">{incident.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

