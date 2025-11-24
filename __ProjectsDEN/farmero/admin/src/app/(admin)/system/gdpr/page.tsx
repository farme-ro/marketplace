'use client'

/**
 * GDPR & Compliance Center Page
 * 
 * Advanced GDPR management with requests, history, and retention policies
 */

import { useState } from 'react'
import { FileText, History, Shield } from 'lucide-react'
import { AccessDenied } from '@/components/auth/AccessDenied'
import { useAdminAuth } from '@/lib/auth/admin-auth-context'
import { hasPermission, hasAnyPermission } from '@/lib/permissions'
import { GdprRequestsTab } from './GdprRequestsTab'
import { GdprHistoryTab } from './GdprHistoryTab'
import { GdprPoliciesTab } from './GdprPoliciesTab'

type Tab = 'requests' | 'history' | 'policies'

export default function GdprPage() {
  const { admin } = useAdminAuth()
  const [activeTab, setActiveTab] = useState<Tab>('requests')

  // RBAC checks
  const canView = hasPermission(admin, 'view_gdpr')
  const canManage = hasPermission(admin, 'manage_gdpr')

  if (!canView) {
    return <AccessDenied requiredPermission="view_gdpr" />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">GDPR & Compliance</h1>
        <p className="text-muted-foreground">
          Gestionare cereri GDPR, istoric și politici de retenție
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
              activeTab === 'requests'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:border-gray-300 hover:text-foreground'
            }`}
          >
            <FileText className="h-4 w-4" />
            Requests
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
              activeTab === 'history'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:border-gray-300 hover:text-foreground'
            }`}
          >
            <History className="h-4 w-4" />
            History
          </button>
          <button
            onClick={() => setActiveTab('policies')}
            className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
              activeTab === 'policies'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:border-gray-300 hover:text-foreground'
            }`}
          >
            <Shield className="h-4 w-4" />
            Policies & Retention
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'requests' && <GdprRequestsTab canManage={canManage} />}
        {activeTab === 'history' && <GdprHistoryTab />}
        {activeTab === 'policies' && <GdprPoliciesTab />}
      </div>
    </div>
  )
}

