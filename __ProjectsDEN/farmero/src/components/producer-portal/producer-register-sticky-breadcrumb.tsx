/**
 * Producer Register Sticky Breadcrumb
 * 
 * Breadcrumb sticky care apare când header-ul site-wide dispare la scroll
 * Aliniat la același nivel cu logo-ul din header-ul site-wide (h-16)
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { Button } from 'farme-ui'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useAuth } from '@/lib/auth/context'

export function ProducerRegisterStickyBreadcrumb() {
  const [isVisible, setIsVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, systemTheme } = useTheme()
  const { user } = useAuth()

  // Determine current theme (dark or light)
  const currentTheme = theme === 'system' ? systemTheme : theme
  const isDark = mounted && currentTheme === 'dark'

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      // Header-ul site-wide are înălțimea h-16 (64px)
      // Când scrollăm mai mult de 64px, header-ul site-wide iese din viewport
      // și breadcrumb-ul sticky apare
      const scrollY = window.scrollY
      // Apare când scrollăm mai mult de 64px (când header-ul site-wide iese din viewport)
      setIsVisible(scrollY > 64)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // Verifică și la mount
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) {
    return null
  }

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        'transition-all duration-300 ease-in-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
      )}
    >
      <div className="w-full max-w-8xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-full">
        {/* Left: Logo & Producer Portal Text */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            {mounted ? (
              <Image
                src={isDark ? "/farmero_wh.png" : "/farmero.png"}
                alt="farme.ro"
                width={120}
                height={40}
                className="h-8 w-auto transition-all duration-300"
                priority
              />
            ) : (
              <Image
                src="/farmero.png"
                alt="farme.ro"
                width={120}
                height={40}
                className="h-8 w-auto transition-all duration-300"
                priority
              />
            )}
          </Link>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            producer portal
          </span>
          <Link
            href="/"
            className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Mergi la site
          </Link>
        </div>

        {/* Right: Login Button */}
        <div className="flex items-center gap-3">
          {!user && (
            <Link href="/portal-producatori/login">
              <Button size="sm">Conectare</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

