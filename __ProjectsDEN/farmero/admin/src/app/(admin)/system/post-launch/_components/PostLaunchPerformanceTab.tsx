'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Zap, Image, Database, Globe } from 'lucide-react';
// Card components replaced with native divs
import { useAdminI18n } from '@/lib/i18n/context';
import {
  getPostLaunchPerformanceMetrics,
  getPostLaunchSEOMetrics,
  getPostLaunchOptimizationRecommendations,
} from '@/lib/api/post-launch';
import type { PerformanceMetrics, SEOMetrics } from '@/lib/post-launch/post-launch.types';

export function PostLaunchPerformanceTab() {
  const { t } = useAdminI18n();
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [seoMetrics, setSeoMetrics] = useState<SEOMetrics | null>(null);
  const [recommendations, setRecommendations] = useState<Array<{
    priority: 'high' | 'medium' | 'low';
    category: string;
    title: string;
    description: string;
    impact: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError(null);
      const [performance, seo, recs] = await Promise.all([
        getPostLaunchPerformanceMetrics(),
        getPostLaunchSEOMetrics(),
        getPostLaunchOptimizationRecommendations(),
      ]);
      setPerformanceMetrics(performance);
      setSeoMetrics(seo);
      setRecommendations(recs);
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
      <h2 className="text-2xl font-bold">{t('postLaunch.performance.title', 'Optimizare Performanță & SEO')}</h2>

      {/* Performance Metrics */}
      {performanceMetrics && (
        <div className="border rounded-lg bg-card p-6">
          <div className="mb-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Zap className="h-5 w-5" />
              {t('postLaunch.performance.metrics', 'Metrici Performanță')}
            </div>
          </div>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/40 rounded-lg">
                <p className="text-sm text-muted-foreground">API Response Time</p>
                <p className="text-2xl font-bold">{performanceMetrics.apiResponseTime.toFixed(0)}ms</p>
              </div>
              <div className="p-4 bg-muted/40 rounded-lg">
                <p className="text-sm text-muted-foreground">Cache Hit Rate</p>
                <p className="text-2xl font-bold">{performanceMetrics.cacheHitRate.toFixed(1)}%</p>
              </div>
              <div className="p-4 bg-muted/40 rounded-lg">
                <p className="text-sm text-muted-foreground">Database Query Time</p>
                <p className="text-2xl font-bold">{performanceMetrics.databaseQueryTime.toFixed(0)}ms</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEO Metrics */}
      {seoMetrics && (
        <div className="border rounded-lg bg-card p-6">
          <div className="mb-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Globe className="h-5 w-5" />
              {t('postLaunch.performance.seo', 'Metrici SEO')}
            </div>
          </div>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/40 rounded-lg">
                <p className="text-sm text-muted-foreground">Indexed Pages</p>
                <p className="text-2xl font-bold">{seoMetrics.indexedPages}</p>
              </div>
              <div className="p-4 bg-muted/40 rounded-lg">
                <p className="text-sm text-muted-foreground">Crawl Errors</p>
                <p className="text-2xl font-bold text-red-500">{seoMetrics.crawlErrors}</p>
              </div>
              <div className="p-4 bg-muted/40 rounded-lg">
                <p className="text-sm text-muted-foreground">Page Speed Score</p>
                <p className="text-2xl font-bold">{seoMetrics.pageSpeedScore}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="border rounded-lg bg-card p-6">
          <div className="mb-4">
            <div className="text-lg font-semibold">{t('postLaunch.performance.recommendations', 'Recomandări Optimizare')}</div>
          </div>
          <div>
            <div className="space-y-4">
              {recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border ${
                    rec.priority === 'high'
                      ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                      : rec.priority === 'medium'
                      ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20'
                      : 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{rec.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">Impact: {rec.impact}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        rec.priority === 'high'
                          ? 'bg-red-500 text-white'
                          : rec.priority === 'medium'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-blue-500 text-white'
                      }`}
                    >
                      {rec.priority}
                    </span>
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

