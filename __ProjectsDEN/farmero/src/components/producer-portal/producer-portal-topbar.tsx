/**
 * Producer Portal Topbar
 * 
 * Topbar simplu pentru portalul producătorilor
 * Nu folosește SiteNavbar
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/context'
import { Button } from 'farme-ui'
import { ArrowLeft, User, LogOut } from 'lucide-react'

export function ProducerPortalTopbar() {
  const { user, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await logout()
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Logout error:', error)
      }
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Left: Logo & Back to Site */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-primary hover:text-primary/80 transition-colors">
            <span>farme.ro</span>
            <span className="text-xs text-muted-foreground hidden sm:inline">producer portal</span>
          </Link>
          <Link
            href="/"
            className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Mergi la site
          </Link>
        </div>

        {/* Right: User Menu */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-foreground">
                  {user.fullName || user.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  Producător
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary-soft flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="hidden sm:flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Ieșire</span>
              </Button>
            </div>
          ) : (
            <Link href="/portal-producatori/login">
              <Button size="sm">Conectare</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

