/**
 * Logistics Dashboard Layout Wrapper
 * 
 * Layout wrapper pentru toate paginile logistics portal cu sidebar
 */

'use client'

import { LogisticsSidebar } from './logistics-sidebar'

export function LogisticsDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <LogisticsSidebar />
      </div>
      
      {/* Main Content */}
      <main className="flex-1 md:ml-64">
        <div className="p-4 md:p-6 lg:p-8 xl:p-10">
          {children}
        </div>
      </main>
    </div>
  )
}

