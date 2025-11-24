'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Play } from 'lucide-react';
// Card and Button components replaced with native elements
import { useAdminI18n } from '@/lib/i18n/context';
import {
  runPostLaunchAllQATests,
  runPostLaunchFunctionalTests,
  runPostLaunchLoadTests,
  runPostLaunchRegressionTests,
} from '@/lib/api/post-launch';
import type { TestSuite } from '@/lib/post-launch/post-launch.types';

export function PostLaunchQATab() {
  const { t } = useAdminI18n();
  const [allTestsResult, setAllTestsResult] = useState<{
    suites: TestSuite[];
    totalPassed: number;
    totalFailed: number;
    totalWarnings: number;
    totalDuration: number;
    overallStatus: 'pass' | 'fail' | 'warning';
  } | null>(null);
  const [functionalTests, setFunctionalTests] = useState<TestSuite | null>(null);
  const [loadTests, setLoadTests] = useState<TestSuite | null>(null);
  const [regressionTests, setRegressionTests] = useState<TestSuite | null>(null);
  const [running, setRunning] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRunAll = async () => {
    try {
      setRunning('all');
      setError(null);
      const result = await runPostLaunchAllQATests();
      setAllTestsResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error', 'Eroare'));
    } finally {
      setRunning(null);
    }
  };

  const handleRunFunctional = async () => {
    try {
      setRunning('functional');
      setError(null);
      const result = await runPostLaunchFunctionalTests();
      setFunctionalTests(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error', 'Eroare'));
    } finally {
      setRunning(null);
    }
  };

  const handleRunLoad = async () => {
    try {
      setRunning('load');
      setError(null);
      const result = await runPostLaunchLoadTests();
      setLoadTests(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error', 'Eroare'));
    } finally {
      setRunning(null);
    }
  };

  const handleRunRegression = async () => {
    try {
      setRunning('regression');
      setError(null);
      const result = await runPostLaunchRegressionTests();
      setRegressionTests(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error', 'Eroare'));
    } finally {
      setRunning(null);
    }
  };

  const renderTestSuite = (suite: TestSuite) => (
    <div key={suite.name} className="border rounded-lg bg-card p-6">
      <div className="mb-4">
        <div className="text-lg font-semibold">{suite.name}</div>
      </div>
      <div>
        <div className="mb-4 grid grid-cols-3 gap-4">
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-muted-foreground">Passed</p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">{suite.passed}</p>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-sm text-muted-foreground">Failed</p>
            <p className="text-xl font-bold text-red-600 dark:text-red-400">{suite.failed}</p>
          </div>
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-sm text-muted-foreground">Warnings</p>
            <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{suite.warnings}</p>
          </div>
        </div>
        <div className="space-y-2">
          {suite.tests.map((test, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-muted/20 rounded">
              <span className="text-sm">{test.name}</span>
              <div className="flex items-center gap-2">
                {test.status === 'pass' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : test.status === 'fail' ? (
                  <XCircle className="h-4 w-4 text-red-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                )}
                <span className="text-xs text-muted-foreground">{test.duration}ms</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t('postLaunch.qa.title', 'Teste Funcționale Complete')}</h2>
            <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90" onClick={handleRunAll} disabled={running !== null}>
          {running === 'all' ? t('common.loading', 'Se încarcă...') : t('postLaunch.qa.runAll', 'Rulează Toate Testele')}
            </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Individual Test Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90" onClick={handleRunFunctional} disabled={running !== null}>
          <Play className="h-4 w-4 mr-2" />
          {t('postLaunch.qa.functional', 'Teste Funcționale')}
            </button>
            <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90" onClick={handleRunLoad} disabled={running !== null}>
          <Play className="h-4 w-4 mr-2" />
          {t('postLaunch.qa.load', 'Teste Load')}
            </button>
            <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90" onClick={handleRunRegression} disabled={running !== null}>
          <Play className="h-4 w-4 mr-2" />
          {t('postLaunch.qa.regression', 'Teste Regression')}
            </button>
      </div>

      {/* All Tests Results */}
      {allTestsResult && (
        <div className="border rounded-lg bg-card p-6">
          <div className="mb-4">
            <div className="text-lg font-semibold">
              {t('postLaunch.qa.allTests', 'Toate Testele')} - {allTestsResult.overallStatus.toUpperCase()}
            </div>
          </div>
          <div>
            <div className="mb-4 grid grid-cols-4 gap-4">
              <div className="p-3 bg-muted/40 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Passed</p>
                <p className="text-xl font-bold">{allTestsResult.totalPassed}</p>
              </div>
              <div className="p-3 bg-muted/40 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Failed</p>
                <p className="text-xl font-bold text-red-500">{allTestsResult.totalFailed}</p>
              </div>
              <div className="p-3 bg-muted/40 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Warnings</p>
                <p className="text-xl font-bold text-yellow-500">{allTestsResult.totalWarnings}</p>
              </div>
              <div className="p-3 bg-muted/40 rounded-lg">
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="text-xl font-bold">{allTestsResult.totalDuration}ms</p>
              </div>
            </div>
            <div className="space-y-4">
              {allTestsResult.suites.map(renderTestSuite)}
            </div>
          </div>
        </div>
      )}

      {/* Individual Test Results */}
      {functionalTests && renderTestSuite(functionalTests)}
      {loadTests && renderTestSuite(loadTests)}
      {regressionTests && renderTestSuite(regressionTests)}
    </div>
  );
}

