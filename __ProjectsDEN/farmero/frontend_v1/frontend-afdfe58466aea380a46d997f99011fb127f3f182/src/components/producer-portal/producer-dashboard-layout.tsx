/**
 * Producer Dashboard Layout Wrapper
 * 
 * Layout wrapper pentru toate paginile producer portal cu sidebar (desktop) și bottom nav (mobile)
 */

'use client'

import { ProducerSidebar } from './producer-sidebar'
import { BottomNavigation } from './mobile/bottom-navigation'

export function ProducerDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <ProducerSidebar />
      </div>
      
      {/* Main Content */}
      <main className="flex-1 md:ml-64">
        <div className="p-4 md:p-6 lg:p-8 xl:p-10 pb-20 md:pb-6">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}

