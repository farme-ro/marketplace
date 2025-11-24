'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, TrendingUp, BarChart3, Shield, CheckCircle } from 'lucide-react';
import { useAdminI18n } from '@/lib/i18n/context';
import { PostLaunchMonitoringTab } from './_components/PostLaunchMonitoringTab';
import { PostLaunchPerformanceTab } from './_components/PostLaunchPerformanceTab';
import { PostLaunchAnalyticsTab } from './_components/PostLaunchAnalyticsTab';
import { PostLaunchSecurityTab } from './_components/PostLaunchSecurityTab';
import { PostLaunchQATab } from './_components/PostLaunchQATab';

export default function PostLaunchPage() {
  const { t } = useAdminI18n();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('postLaunch.title', 'Post-Launch Dashboard')}</h1>
        <p className="text-muted-foreground">{t('postLaunch.subtitle', 'Monitorizare, optimizare și testare post-launch')}</p>
      </div>

      <Tabs defaultValue="monitoring" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            {t('postLaunch.tabs.monitoring', 'Monitorizare')}
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            {t('postLaunch.tabs.performance', 'Performanță')}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {t('postLaunch.tabs.analytics', 'Analytics')}
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {t('postLaunch.tabs.security', 'Securitate')}
          </TabsTrigger>
          <TabsTrigger value="qa" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            {t('postLaunch.tabs.qa', 'QA')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monitoring" className="mt-6">
          <PostLaunchMonitoringTab />
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <PostLaunchPerformanceTab />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <PostLaunchAnalyticsTab />
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <PostLaunchSecurityTab />
        </TabsContent>

        <TabsContent value="qa" className="mt-6">
          <PostLaunchQATab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

