/**
 * Mobile Navigation Sidebar
 * 
 * Sidebar pentru navigare pe mobile (left side)
 * Cu animații slide-in/slide-out și keyboard support
 */

'use client'

import { useState, useEffect, useRef, memo, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import { useI18n } from '@/lib/i18n/context'
import { cn } from '@/lib/utils/cn'
import { AccountSwitcher } from '@/components/account/AccountSwitcher'
import { FarmeroNotificationCenter } from '@/components/notifications/FarmeroNotificationCenter'
import { getMobileNavLinks } from '@/config/navigation'

export interface MobileNavSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export const MobileNavSidebar = memo(function MobileNavSidebar({ isOpen, onClose }: MobileNavSidebarProps) {
  const { user, logout, role } = useAuth()
  const { t } = useI18n()
  const pathname = usePathname()
  const sidebarRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  // Focus management
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement
      // Focus pe sidebar când se deschide
      setTimeout(() => {
        const firstLink = sidebarRef.current?.querySelector<HTMLElement>('a, button')
        firstLink?.focus()
      }, 100)
    } else {
      // Restaurează focus-ul când se închide
      previousActiveElement.current?.focus()
    }
  }, [isOpen])

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
      }
    }
    return () => {
      // Cleanup on unmount
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Focus trap
  useEffect(() => {
    if (!isOpen) return

    function handleTab(e: KeyboardEvent) {
      if (e.key !== 'Tab') return

      const sidebar = sidebarRef.current
      if (!sidebar) return

      const focusableElements = sidebar.querySelectorAll<HTMLElement>(
        'a, button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleTab)
    return () => document.removeEventListener('keydown', handleTab)
  }, [isOpen])

  async function handleSignOut() {
    try {
      await logout()
      onClose()
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Logout error:', error)
      }
    }
  }

  const [isProducersMenuOpen, setIsProducersMenuOpen] = useState(false)

  // Get navigation links from centralized config
  const { main: mainNavLinks, producers: producerNavLinks, additional: additionalNavLinks } = getMobileNavLinks()

  // Transform config links to display format with translations
  const navLinks = [
    ...mainNavLinks.map(link => ({
      href: link.href,
      label: t(link.labelKey, link.fallbackLabel),
    })),
    ...additionalNavLinks.map(link => ({
      href: link.href,
      label: t(link.labelKey, link.fallbackLabel),
    })),
  ]

  const producerLinks = producerNavLinks.map(link => ({
    href: link.href,
    label: t(link.labelKey, link.fallbackLabel),
  }))

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={cn(
          'fixed left-0 top-0 bottom-0 z-50 w-80 bg-background',
          'border-r border-border shadow-lg',
          'transform transition-transform duration-300 ease-in-out',
          'flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Link href="/" onClick={onClose} className="text-2xl font-bold text-primary">
            farme.ro
          </Link>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className={cn(
                    'block px-4 py-3 rounded-lg text-foreground transition-colors',
                    'hover:bg-muted',
                    pathname === link.href && 'bg-muted font-semibold'
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {/* Producers Accordion */}
            <li>
              <button
                onClick={() => setIsProducersMenuOpen(!isProducersMenuOpen)}
                className={cn(
                  'w-full flex items-center justify-between px-4 py-3 rounded-lg text-foreground transition-colors',
                  'hover:bg-muted',
                  isProducersMenuOpen && 'bg-muted'
                )}
              >
                <span>{t('footer.forProducers', 'Pentru producători')}</span>
                <svg
                  className={cn(
                    'w-5 h-5 transition-transform',
                    isProducersMenuOpen && 'rotate-180'
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isProducersMenuOpen && (
                <ul className="mt-2 ml-4 space-y-1 border-l border-border pl-4">
                  {producerLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className={cn(
                          'block px-4 py-2 rounded-lg text-sm text-foreground transition-colors',
                          'hover:bg-muted',
                          pathname === link.href && 'bg-muted font-semibold'
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-border">
          {user ? (
            <div className="space-y-2">
              <div className="px-4 py-2 text-sm text-muted-foreground">
                {user.fullName || user.email}
              </div>
              <div className="px-4 py-2 space-y-2">
                {role === 'client' && <AccountSwitcher />}
                <FarmeroNotificationCenter />
              </div>
              <Link
                href="/dashboard"
                onClick={onClose}
                className="block px-4 py-3 rounded-lg text-foreground transition-colors hover:bg-muted"
              >
                {t('navbar.dashboard', 'Dashboard')}
              </Link>
              <Link
                href="/orders"
                onClick={onClose}
                className="block px-4 py-3 rounded-lg text-foreground transition-colors hover:bg-muted"
              >
                {t('navbar.orders', 'Comenzi')}
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-3 rounded-lg text-foreground transition-colors hover:bg-muted"
              >
                {t('navbar.logout', 'Deconectare')}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                href="/login"
                onClick={onClose}
                className="block px-4 py-3 rounded-lg text-center bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {t('navbar.signIn', 'Conectare')}
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="block px-4 py-3 rounded-lg text-center border border-border text-foreground transition-colors hover:bg-muted"
              >
                {t('navbar.signUp', 'Înregistrare')}
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  )
})

