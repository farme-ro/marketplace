'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, ShoppingCart, Users, DollarSign } from 'lucide-react';
// Card components replaced with native divs
import { useAdminI18n } from '@/lib/i18n/context';
import {
  getPostLaunchConversionMetrics,
  getPostLaunchUserBehaviorMetrics,
  getPostLaunchFunnelMetrics,
} from '@/lib/api/post-launch';
import type { ConversionMetrics, UserBehaviorMetrics, FunnelMetrics } from '@/lib/post-launch/post-launch.types';

export function PostLaunchAnalyticsTab() {
  const { t } = useAdminI18n();
  const [conversionMetrics, setConversionMetrics] = useState<ConversionMetrics | null>(null);
  const [behaviorMetrics, setBehaviorMetrics] = useState<UserBehaviorMetrics | null>(null);
  const [funnelMetrics, setFunnelMetrics] = useState<FunnelMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError(null);
      const [conversions, behavior, funnel] = await Promise.all([
        getPostLaunchConversionMetrics(7),
        getPostLaunchUserBehaviorMetrics(7),
        getPostLaunchFunnelMetrics(),
      ]);
      setConversionMetrics(conversions);
      setBehaviorMetrics(behavior);
      setFunnelMetrics(funnel);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error', 'Eroare'));
    } finally {
      setLoading(false);
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
      <h2 className="text-2xl font-bold">{t('postLaunch.analytics.title', 'Analytics & Conversii')}</h2>

      {/* Conversion Metrics */}
      {conversionMetrics && (
        <div className="border rounded-lg bg-card p-6">
          <div className="mb-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <TrendingUp className="h-5 w-5" />
              {t('postLaunch.analytics.conversions', 'Metrici Conversii')}
            </div>
          </div>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-muted/40 rounded-lg">
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{conversionMetrics.conversionRate.toFixed(2)}%</p>
              </div>
              <div className="p-4 bg-muted/40 rounded-lg">
                <p className="text-sm text-muted-foreground">Orders</p>
                <p className="text-2xl font-bold">{conversionMetrics.orders}</p>
              </div>
              <div className="p-4 bg-muted/40 rounded-lg">
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">{conversionMetrics.revenue.toFixed(2)} RON</p>
              </div>
              <div className="p-4 bg-muted/40 rounded-lg">
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
                <p className="text-2xl font-bold">{conversionMetrics.averageOrderValue.toFixed(2)} RON</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Funnel Metrics */}
      {funnelMetrics && (
        <div className="border rounded-lg bg-card p-6">
          <div className="mb-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <BarChart3 className="h-5 w-5" />
              {t('postLaunch.analytics.funnel', 'Funnel Conversii')}
            </div>
          </div>
          <div>
            <div className="space-y-4">
              {funnelMetrics.funnel.map((step, idx) => (
                <div key={idx} className="p-4 bg-muted/40 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{step.step}</span>
                    <span className="text-sm text-muted-foreground">{step.conversionRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${step.conversionRate}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">{step.visitors} visitors</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

