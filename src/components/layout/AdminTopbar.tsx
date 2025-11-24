'use client'

/**
 * Admin Topbar Component
 * 
 * Displays logo, current admin info, and logout button
 */

import { useAdminAuth } from '@/lib/auth/admin-auth-context'
import { LogOut, User } from 'lucide-react'

export function AdminTopbar() {
  const { admin, logout } = useAdminAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-farmero-olive-700 dark:text-farmero-olive-400">
            Farmero Admin
          </h1>
        </div>

        {/* User Info & Logout */}
        {admin && (
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 md:flex">
              <User className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">
                <p className="font-medium">{admin.fullName}</p>
                <p className="text-xs text-muted-foreground">{admin.email}</p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Deconectare</span>
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

