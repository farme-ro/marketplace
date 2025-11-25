/**
 * Site Layout Client Component
 * 
 * Client component pentru gestionarea state-ului sidebar-urilor
 * Updated: Footer reorganization
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { Navbar, Input } from 'farme-ui'
import { SiteFooter } from './site-footer'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { MobileNavSidebar } from './mobile-nav-sidebar'
import { MinicartSidebar } from './minicart-sidebar'
import { DynamicMegaMenu } from './dynamic-mega-menu'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { BackToTop } from '@/components/ui/back-to-top'
import { useCartItemCount } from '@/lib/store/cart'
import { useAuth } from '@/lib/auth/context'
import { useI18n } from '@/lib/i18n/context'
import { routes } from '@/lib/routes'
import { AccountSwitcher } from '@/components/account/AccountSwitcher'
import { FarmeroNotificationCenter } from '@/components/notifications/FarmeroNotificationCenter'
import { cn } from '@/lib/utils/cn'
import { useTheme } from 'next-themes'
import { PwaInstallPrompt } from '@/components/pwa/pwa-install-prompt'
import { CookieBanner } from '@/components/cookies/cookie-banner'
import { CookiePreferencesModal } from '@/components/cookies/cookie-preferences-modal'
import { AiLauncherButton } from '@/components/ai/ai-launcher-button'

import {
  Package, // Products
  Info, // About
  ClipboardCheck, // How it works
  Building, // For producers/businesses
  Globe, // Importers
  Briefcase, // Investors
  User, // For you (customer)
  Truck, // Logistics
} from 'lucide-react'

export function SiteLayoutClient({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const [isDynamicLinkMenuOpen, setIsDynamicLinkMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up')
  const [lastScrollY, setLastScrollY] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const megaMenuButtonRef = useRef<HTMLButtonElement>(null)
  const dynamicLinkMenuButtonRef = useRef<HTMLButtonElement>(null)
  const { theme, systemTheme } = useTheme()
  const cartCount = useCartItemCount()
  const { user, role } = useAuth()
  const { t } = useI18n()
  const router = useRouter()
  const pathname = usePathname()
  
  // Determine dynamic link based on authentication and current path
  const getDynamicLinkConfig = (): {
    label: string
    menuType: 'logistics' | 'importers' | 'investors' | 'businesses' | 'producers'
    icon: typeof Truck
    href?: string
    show: boolean
  } | null => {
    // Priority 1: If user is authenticated, show link based on role (permanent)
    if (user) {
      if (role === 'logistics') {
        return {
          label: t('navbar.forLogistics', 'Logistică și transport'),
          menuType: 'logistics' as const,
          icon: Truck,
          href: '/portal-logistica/dashboard',
          show: true,
        }
      }
      if (role === 'importer') {
        return {
          label: t('navbar.forImporters', 'Pentru importatori'),
          menuType: 'importers' as const,
          icon: Globe,
          href: '/portal-importatori/dashboard',
          show: true,
        }
      }
      if (role === 'investor') {
        return {
          label: t('navbar.forInvestors', 'Pentru investitori'),
          menuType: 'investors' as const,
          icon: Briefcase,
          href: '/portal-investitori/dashboard',
          show: true,
        }
      }
      if (role === 'business') {
        return {
          label: t('navbar.forBusiness', 'Pentru afacerea ta'),
          menuType: 'businesses' as const,
          icon: Building,
          href: '/portal-business/dashboard',
          show: true,
        }
      }
      if (role === 'producer') {
        return {
          label: t('navbar.forProducers', 'Pentru producători'),
          menuType: 'producers' as const,
          icon: Building,
          href: '/portal-producatori/dashboard',
          show: true,
        }
      }
      // For other roles, no dynamic link
      return null
    }
    
    // Priority 2: If not authenticated, show link based on current path (temporary)
    if (pathname?.startsWith('/pentru-logistica') || pathname?.startsWith('/portal-logistica')) {
      return {
        label: t('navbar.forLogistics', 'Logistică și transport'),
        menuType: 'logistics' as const,
        icon: Truck,
        show: true,
      }
    }
    if (pathname?.startsWith('/pentru-importatori') || pathname?.startsWith('/portal-importatori')) {
      return {
        label: t('navbar.forImporters', 'Pentru importatori'),
        menuType: 'importers' as const,
        icon: Globe,
        show: true,
      }
    }
    if (pathname?.startsWith('/pentru-investitori') || pathname?.startsWith('/portal-investitori')) {
      return {
        label: t('navbar.forInvestors', 'Pentru investitori'),
        menuType: 'investors' as const,
        icon: Briefcase,
        show: true,
      }
    }
    if (pathname?.startsWith('/b2b') || pathname?.startsWith('/pentru-afaceri') || pathname?.startsWith('/portal-business')) {
      return {
        label: t('navbar.forBusiness', 'Pentru afacerea ta'),
        menuType: 'businesses' as const,
        icon: Building,
        show: true,
      }
    }
    if (pathname?.startsWith('/pentru-producatori') || pathname?.startsWith('/portal-producatori')) {
      return {
        label: t('navbar.forProducers', 'Pentru producători'),
        menuType: 'producers' as const,
        icon: Building,
        show: true,
      }
    }
    
    return null
  }
  
  const dynamicLinkConfig = getDynamicLinkConfig()
  
  // Determine menu label, type and icon based on user role
  const getMenuConfig = () => {
    if (!user) {
      return {
        label: t('navbar.joinUs', 'Soluțiile noastre'),
        menuType: 'become-partner' as const,
      }
    }
    
    if (user.role === 'CUSTOMER') {
      return {
        label: t('navbar.forYou', 'Pentru tine'),
        menuType: 'customers' as const,
      }
    }
    
    if (user.role === 'PRODUCER') {
      const producerUser = user as import('@/lib/api/auth').ProducerUser
      if (producerUser.type === 'COMPANY') {
        return {
          label: t('navbar.forBusiness', 'Afacerea ta'),
          menuType: 'businesses' as const,
        }
      }
      return {
        label: t('navbar.forProducers', 'Pentru producători'),
        menuType: 'producers' as const,
      }
    }
    
    return {
      label: t('navbar.joinUs', 'Soluțiile noastre'),
      menuType: 'producers' as const,
    }
  }
  
  const menuConfig = getMenuConfig()
  const menuLabel = menuConfig.label
  const menuType = menuConfig.menuType
  
  // Determine current theme (dark or light)
  const currentTheme = theme === 'system' ? systemTheme : theme
  const isDark = mounted && currentTheme === 'dark'
  
  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Listen for cookie preferences modal open event from footer
  useEffect(() => {
    const handleOpenCookiePreferences = () => {
      setIsCookieModalOpen(true)
    }

    window.addEventListener('openCookiePreferences', handleOpenCookiePreferences)
    return () => {
      window.removeEventListener('openCookiePreferences', handleOpenCookiePreferences)
    }
  }, [])

  // Detect scroll for header shrinking effect and scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 20)
      
      // Detect scroll direction
      if (scrollPosition > lastScrollY && scrollPosition > 50) {
        // Scrolling down and past 50px - show icons
        setScrollDirection('down')
      } else if (scrollPosition < lastScrollY) {
        // Scrolling up - show text
        setScrollDirection('up')
      } else if (scrollPosition <= 50) {
        // At top (less than 50px) - always show text
        setScrollDirection('up')
      }
      
      setLastScrollY(scrollPosition)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Keyboard shortcut support for search (Ctrl+K or /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input, textarea, or contenteditable
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      // Ctrl+K or Cmd+K (Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
        searchInputRef.current?.select()
      }

      // Slash key (/)
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
        e.preventDefault()
        searchInputRef.current?.focus()
        searchInputRef.current?.select()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const closeAllMegaMenus = () => {
    setIsMegaMenuOpen(false)
    setIsDynamicLinkMenuOpen(false)
  }

  // Note: We removed the auto-close on scroll to allow mega menu to work
  // when hovering over icons (scroll down) or text (scroll up)

  return (
    <div className="min-h-screen flex flex-col bg-background" style={{ position: 'relative' }}>
      {/* Navbar */}
      <Navbar
        sticky
        className={cn(
          'transition-all duration-300 ease-in-out',
          isScrolled && 'shadow-md'
        )}
        logo={
          <Link
            href="/"
            className="flex items-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            aria-label={t('navbar.goToHome', 'Mergi la pagina principală')}
          >
            {mounted ? (
              <Image
                src={isDark ? "/farmero_wh.png" : "/farmero.png"}
                alt="farme.ro"
                width={120}
                height={40}
                className={cn(
                  'w-auto transition-all duration-300 ease-in-out',
                  isScrolled ? 'h-[2.5rem]' : 'h-[2.8rem]'
                )}
                priority
              />
            ) : (
              <Image
                src="/farmero.png"
                alt="farme.ro"
                width={120}
                height={40}
                className={cn(
                  'w-auto transition-all duration-300 ease-in-out',
                  'h-[2.8rem]'
                )}
                priority
              />
            )}
          </Link>
        }
        leftItems={
          <>
            {/* Mobile Menu Button - visible only on mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
              aria-label={t('navbar.openMenu', 'Open menu')}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            {/* Desktop Navigation - hidden on mobile */}
            <div className={cn(
              "hidden md:flex items-center transition-all duration-500 ease-in-out",
              "gap-2 lg:gap-4"
            )}>
              {/* 1. Produse / Products */}
              <Link 
                href="/produse" 
                className={cn(
                  "text-foreground hover:text-primary transition-all duration-300 whitespace-nowrap flex items-center gap-2",
                  isScrolled && scrollDirection === 'down' ? "p-2" : ""
                )}
                title={t('common.products', 'Produse')}
                aria-label={t('common.products', 'Produse')}
              >
                {/* Icon for products */}
                <svg
                  className={cn(
                    "transition-all duration-300 shrink-0",
                    isScrolled && scrollDirection === 'down' ? "w-5 h-5 opacity-100" : "hidden"
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                {/* Text label */}
                <span className={cn(
                  "transition-all duration-300",
                  isScrolled && scrollDirection === 'down' ? "max-w-0 opacity-0 overflow-hidden" : "max-w-full opacity-100",
                  isScrolled ? "text-xs lg:text-sm" : "text-xs lg:text-sm"
                )}>
                  {t('common.products', 'Produse')}
                </span>
              </Link>
              {/* 2. Cum funcționează / How it works */}
              <Link 
                href="/cum-functioneaza-si-impact" 
                className={cn(
                  "text-foreground hover:text-primary transition-all duration-300 whitespace-nowrap flex items-center gap-2",
                  isScrolled && scrollDirection === 'down' ? "p-2" : ""
                )}
                title={t('navbar.howItWorks', 'Cum funcționează')}
              >
                {/* Icon for how it works */}
                <svg
                  className={cn(
                    "transition-all duration-300 shrink-0",
                    isScrolled && scrollDirection === 'down' ? "w-5 h-5 opacity-100" : "hidden"
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
                {/* Text label */}
                <span className={cn(
                  "transition-all duration-300",
                  isScrolled && scrollDirection === 'down' ? "max-w-0 opacity-0 overflow-hidden" : "max-w-full opacity-100",
                  isScrolled ? "text-xs lg:text-sm" : "text-xs lg:text-sm"
                )}>
                  {t('navbar.howItWorks', 'Cum funcționează')}
                </span>
              </Link>
              {/* 3. Cine suntem / About us */}
              <Link 
                href="/despre-noi" 
                className={cn(
                  "text-foreground hover:text-primary transition-all duration-300 whitespace-nowrap flex items-center gap-2",
                  isScrolled && scrollDirection === 'down' ? "p-2" : ""
                )}
                title={t('navbar.about', 'Cine suntem')}
              >
                {/* Icon for about */}
                <svg
                  className={cn(
                    "transition-all duration-300 shrink-0",
                    isScrolled && scrollDirection === 'down' ? "w-5 h-5 opacity-100" : "hidden"
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {/* Text label */}
                <span className={cn(
                  "transition-all duration-300",
                  isScrolled && scrollDirection === 'down' ? "max-w-0 opacity-0 overflow-hidden" : "max-w-full opacity-100",
                  isScrolled ? "text-xs lg:text-sm" : "text-xs lg:text-sm"
                )}>
                  {t('navbar.about', 'Cine suntem')}
                </span>
              </Link>
              {/* 4. Soluțiile noastre / Our solutions */}
              <div className="relative group">
                <button
                  ref={megaMenuButtonRef}
                  className={cn(
                    "text-foreground hover:text-primary transition-all duration-300 whitespace-nowrap flex items-center gap-1",
                    isScrolled && scrollDirection === 'down' ? "p-2" : "",
                    "text-xs lg:text-sm",
                    isMegaMenuOpen && "text-primary"
                  )}
                  onMouseEnter={() => {
                    closeAllMegaMenus()
                    setIsMegaMenuOpen(true)
                  }}
                  onClick={() => {
                    setIsMegaMenuOpen(!isMegaMenuOpen)
                    closeAllMegaMenus()
                  }}
                  title={menuLabel}
                >
                  {/* Icon for producers */}
                  <svg
                    className={cn(
                      "transition-all duration-300 shrink-0",
                      isScrolled && scrollDirection === 'down' ? "w-5 h-5 opacity-100" : "hidden"
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  {/* Text label */}
                  <span className={cn(
                    "transition-all duration-300 flex items-center gap-1",
                    isScrolled && scrollDirection === 'down' ? "max-w-0 opacity-0 overflow-hidden" : "max-w-full opacity-100"
                  )}>
                    {menuLabel}
                  </span>
                  {/* Dropdown arrow - only show when text is visible */}
                  <svg
                    className={cn(
                      "w-4 h-4 transition-all duration-300 shrink-0",
                      isMegaMenuOpen && "rotate-180",
                      isScrolled && scrollDirection === 'down' ? "w-0 h-0 opacity-0" : "opacity-100"
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
              {/* Dynamic Link - Based on authentication or current path */}
              {dynamicLinkConfig && (
                <div className="relative group">
                  {dynamicLinkConfig.href ? (
                    // If href exists, show as direct link (for authenticated users to portal)
                    <Link
                      href={dynamicLinkConfig.href}
                      className={cn(
                        "text-foreground hover:text-primary transition-all duration-300 whitespace-nowrap flex items-center gap-1",
                        isScrolled && scrollDirection === 'down' ? "p-2" : "",
                        "text-xs lg:text-sm"
                      )}
                      title={dynamicLinkConfig.label}
                    >
                      {/* Icon */}
                      <dynamicLinkConfig.icon
                        className={cn(
                          "transition-all duration-300 shrink-0",
                          isScrolled && scrollDirection === 'down' ? "w-5 h-5 opacity-100" : "hidden"
                        )}
                        aria-hidden="true"
                      />
                      {/* Text label */}
                      <span className={cn(
                        "transition-all duration-300 flex items-center gap-1",
                        isScrolled && scrollDirection === 'down' ? "max-w-0 opacity-0 overflow-hidden" : "max-w-full opacity-100"
                      )}>
                        {dynamicLinkConfig.label}
                      </span>
                    </Link>
                  ) : (
                    // If no href, show as button with mega menu (for unauthenticated users)
                    <button
                      ref={dynamicLinkMenuButtonRef}
                      className={cn(
                        "text-foreground hover:text-primary transition-all duration-300 whitespace-nowrap flex items-center gap-1",
                        isScrolled && scrollDirection === 'down' ? "p-2" : "",
                        "text-xs lg:text-sm",
                        isDynamicLinkMenuOpen && "text-primary"
                      )}
                      onMouseEnter={() => {
                        closeAllMegaMenus()
                        setIsDynamicLinkMenuOpen(true)
                      }}
                      onClick={() => {
                        setIsDynamicLinkMenuOpen(!isDynamicLinkMenuOpen)
                        closeAllMegaMenus()
                      }}
                      title={dynamicLinkConfig.label}
                    >
                      {/* Icon */}
                      <dynamicLinkConfig.icon
                        className={cn(
                          "transition-all duration-300 shrink-0",
                          isScrolled && scrollDirection === 'down' ? "w-5 h-5 opacity-100" : "hidden"
                        )}
                        aria-hidden="true"
                      />
                      {/* Text label */}
                      <span className={cn(
                        "transition-all duration-300 flex items-center gap-1",
                        isScrolled && scrollDirection === 'down' ? "max-w-0 opacity-0 overflow-hidden" : "max-w-full opacity-100"
                      )}>
                        {dynamicLinkConfig.label}
                      </span>
                      {/* Dropdown arrow */}
                      <svg
                        className={cn(
                          "w-4 h-4 transition-all duration-300 shrink-0",
                          isDynamicLinkMenuOpen && "rotate-180",
                          isScrolled && scrollDirection === 'down' ? "w-0 h-0 opacity-0" : "opacity-100"
                        )}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        }
        rightItems={
          <>
            {/* Desktop Auth Links */}
            <div className="hidden md:flex items-center gap-3 lg:gap-5">
              {/* Search Input - Desktop - Moved to right side */}
              <form onSubmit={handleSearch} className="hidden lg:flex items-center">
                <div className="relative">
                  <Input
                    ref={searchInputRef}
                    id="search"
                    name="search"
                    type="search"
                    placeholder={t('navbar.searchPlaceholder', 'Caută produse...')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48 xl:w-64 2xl:w-72 pl-10 pr-16"
                    aria-label={t('navbar.searchPlaceholder', 'Caută produse...')}
                    autoComplete="off"
                  />
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  {/* Keyboard shortcut indicator */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <kbd className="hidden xl:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-semibold text-muted-foreground bg-muted border border-border rounded">
                      <span className="text-[10px]">Ctrl</span>
                      <span>K</span>
                    </kbd>
                    <kbd className="xl:hidden inline-flex items-center px-1.5 py-0.5 text-xs font-semibold text-muted-foreground bg-muted border border-border rounded">
                      /
                    </kbd>
                  </div>
                </div>
              </form>
              <ThemeToggle />
              <LanguageSwitcher />
              {user ? (
                <>
                  {role === 'client' && <AccountSwitcher />}
                  <FarmeroNotificationCenter />
                  <Link 
                    href="/dashboard" 
                    className="p-2 text-foreground hover:text-primary transition-colors rounded-lg hover:bg-muted"
                    aria-label={t('navbar.dashboard', 'Dashboard')}
                    title={t('navbar.dashboard', 'Dashboard')}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </Link>
                </>
              ) : (
                <Link 
                  href="/login-client" 
                  className="p-2 text-foreground hover:text-primary transition-colors rounded-lg hover:bg-muted"
                  aria-label={t('navbar.signIn', 'Conectare')}
                  title={t('navbar.signIn', 'Conectare')}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </Link>
              )}
              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-foreground hover:text-primary transition-colors rounded-lg hover:bg-muted"
                aria-label={t('navbar.openCart', 'Open cart')}
                title={t('navbar.cart', 'Coș')}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>
            </div>
            {/* Mobile Search & Cart */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => router.push(routes.products.list)}
                className="p-2 text-foreground hover:text-primary transition-colors"
                aria-label={t('navbar.searchPlaceholder', 'Caută produse...')}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-foreground hover:text-primary transition-colors"
                aria-label={t('navbar.openCart', 'Open cart')}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>
            </div>
          </>
        }
      />

      {/* Main Content */}
        <main id="main-content" className="flex-1 pt-16" tabIndex={-1}>
          {children}
        </main>

      {/* Footer */}
      <SiteFooter />

      {/* Mobile Navigation Sidebar (Left) */}
      <MobileNavSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Minicart Sidebar (Right) */}
      <MinicartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {/* Dynamic Mega Menu - Main (producers/businesses/customers) */}
      <DynamicMegaMenu
        isOpen={isMegaMenuOpen}
        onClose={() => setIsMegaMenuOpen(false)}
        triggerRef={megaMenuButtonRef}
        user={user}
        menuType={menuType}
      />

      {/* Dynamic Mega Menu - Dynamic Link (replaces importers/investors/logistics/business based on auth or path) */}
      {dynamicLinkConfig && (
        <DynamicMegaMenu
          isOpen={isDynamicLinkMenuOpen}
          onClose={() => setIsDynamicLinkMenuOpen(false)}
          triggerRef={dynamicLinkMenuButtonRef}
          user={user}
          menuType={dynamicLinkConfig.menuType}
        />
      )}

      {/* Back to Top Button */}
      <BackToTop />

      {/* PWA Install Prompt */}
      <PwaInstallPrompt />

      {/* Cookie Banner */}
      <CookieBanner onCustomize={() => setIsCookieModalOpen(true)} />

      {/* Cookie Preferences Modal */}
      <CookiePreferencesModal
        isOpen={isCookieModalOpen}
        onClose={() => setIsCookieModalOpen(false)}
      />

      {/* AI Assistant Launcher */}
      <AiLauncherButton />
    </div>
  )
}

