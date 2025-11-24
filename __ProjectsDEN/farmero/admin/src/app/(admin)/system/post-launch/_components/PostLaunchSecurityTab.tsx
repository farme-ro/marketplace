'use client';

import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
// Card and Button components replaced with native elements
import { useAdminI18n } from '@/lib/i18n/context';
import {
  getPostLaunchSecurityMetrics,
  getPostLaunchSecurityRecommendations,
  runPostLaunchSecurityAudit,
} from '@/lib/api/post-launch';
import type { SecurityMetrics } from '@/lib/post-launch/post-launch.types';

export function PostLaunchSecurityTab() {
  const { t } = useAdminI18n();
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics | null>(null);
  const [recommendations, setRecommendations] = useState<Array<{
    priority: 'critical' | 'high' | 'medium' | 'low';
    category: string;
    title: string;
    description: string;
    remediation: string;
  }>>([]);
  const [auditResult, setAuditResult] = useState<{
    score: number;
    passed: number;
    failed: number;
    warnings: number;
    checks: Array<{
      name: string;
      status: 'pass' | 'fail' | 'warning';
      message: string;
    }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [runningAudit, setRunningAudit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError(null);
      const [metrics, recs] = await Promise.all([
        getPostLaunchSecurityMetrics(),
        getPostLaunchSecurityRecommendations(),
      ]);
      setSecurityMetrics(metrics);
      setRecommendations(recs);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error', 'Eroare'));
    } finally {
      setLoading(false);
    }
  };

  const handleRunAudit = async () => {
    try {
      setRunningAudit(true);
      setError(null);
      const result = await runPostLaunchSecurityAudit();
      setAuditResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error', 'Eroare'));
    } finally {
      setRunningAudit(false);
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
        <h2 className="text-2xl font-bold">{t('postLaunch.security.title', 'Hardening & Security')}</h2>
            <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90" onClick={handleRunAudit} disabled={runningAudit}>
          {runningAudit ? t('common.loading', 'Se încarcă...') : t('postLaunch.security.runAudit', 'Rulează Audit')}
            </button>
      </div>

      {/* Security Metrics */}
      {securityMetrics && (
        <div className="border rounded-lg bg-card p-6">
          <div className="mb-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Shield className="h-5 w-5" />
              {t('postLaunch.security.metrics', 'Metrici Securitate')}
            </div>
          </div>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/40 rounded-lg">
                <p className="text-sm text-muted-foreground">Failed Login Attempts</p>
                <p className="text-2xl font-bold">{securityMetrics.failedLoginAttempts}</p>
              </div>
              <div className="p-4 bg-muted/40 rounded-lg">
                <p className="text-sm text-muted-foreground">Rate Limit Hits</p>
                <p className="text-2xl font-bold">{securityMetrics.rateLimitHits}</p>
              </div>
              <div className="p-4 bg-muted/40 rounded-lg">
                <p className="text-sm text-muted-foreground">SSL Enabled</p>
                <p className="text-2xl font-bold">{securityMetrics.sslEnabled ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Audit Results */}
      {auditResult && (
        <div className="border rounded-lg bg-card p-6">
          <div className="mb-4">
            <div className="text-lg font-semibold">{t('postLaunch.security.auditResults', 'Rezultate Audit Securitate')}</div>
          </div>
          <div>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Security Score</span>
                <span className="text-2xl font-bold">{auditResult.score.toFixed(0)}%</span>
              </div>
              <div className="flex-1 bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    auditResult.score >= 80 ? 'bg-green-500' : auditResult.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${auditResult.score}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-muted-foreground">Passed</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">{auditResult.passed}</p>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-xl font-bold text-red-600 dark:text-red-400">{auditResult.failed}</p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-sm text-muted-foreground">Warnings</p>
                <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{auditResult.warnings}</p>
              </div>
            </div>
            <div className="space-y-2">
              {auditResult.checks.map((check, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                  <span className="text-sm">{check.name}</span>
                  <div className="flex items-center gap-2">
                    {check.status === 'pass' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : check.status === 'fail' ? (
                      <XCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className="text-xs text-muted-foreground">{check.message}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Security Recommendations */}
      {recommendations.length > 0 && (
        <div className="border rounded-lg bg-card p-6">
          <div className="mb-4">
            <div className="text-lg font-semibold">{t('postLaunch.security.recommendations', 'Recomandări Securitate')}</div>
          </div>
          <div>
            <div className="space-y-4">
              {recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border ${
                    rec.priority === 'critical'
                      ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                      : rec.priority === 'high'
                      ? 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20'
                      : rec.priority === 'medium'
                      ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20'
                      : 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{rec.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">Remediation: {rec.remediation}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        rec.priority === 'critical'
                          ? 'bg-red-500 text-white'
                          : rec.priority === 'high'
                          ? 'bg-orange-500 text-white'
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

