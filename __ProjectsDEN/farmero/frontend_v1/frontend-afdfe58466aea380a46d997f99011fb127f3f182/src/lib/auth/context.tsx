/**
 * Authentication Context and Hook
 * 
 * Provides authentication state and methods to client components
 * Supports both client and producer authentication
 * Uses backend API with cookie-based authentication
 */

'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { routes } from '@/lib/routes'
import {
  loginClient,
  registerClient,
  loginProducer,
  registerProducer,
  loginInvestor,
  registerInvestor,
  loginLogistics,
  registerLogistics,
  loginImporter,
  registerImporter,
  loginBusiness,
  registerBusiness,
  logout,
  getCurrentUser,
  getClientProfile,
  getProducerProfile,
  getInvestorProfile,
  getLogisticsProfile,
  getImporterProfile,
  getBusinessProfile,
  loginUnified,
  getUserRoles,
  type ClientUser,
  type ProducerUser,
  type InvestorUser,
  type LogisticsUser,
  type ImporterUser,
  type BusinessUser,
  type AuthUser,
} from '@/lib/api/auth'
import type { UserRole } from '@/lib/types/domain'

type AuthStatus = 'unauthenticated' | 'authenticating' | 'authenticated' | 'error'

/**
 * Normalize role from backend to canonical UserRole
 * Maps backend role strings to frontend canonical roles
 * 
 * Handles both uppercase backend roles (CUSTOMER, PRODUCER, etc.)
 * and lowercase canonical roles (client, producer, etc.)
 */
function normalizeRole(role: string | null | undefined): UserRole | null {
  if (!role) return null
  
  const upperRole = role.toUpperCase()
  
  // Map backend uppercase roles to canonical lowercase roles
  switch (upperRole) {
    case 'CUSTOMER':
      return 'client'
    case 'PRODUCER':
      return 'producer'
    case 'ADMIN':
      return 'admin'
    case 'INVESTOR':
      return 'investor'
    case 'LOGISTICS':
      return 'logistics'
    case 'IMPORTER':
      return 'importer'
    case 'BUSINESS':
      return 'business'
    case 'CLIENT':
      return 'client'
    default:
      // Check if already in canonical form (lowercase)
      const lowerRole = role.toLowerCase()
      const canonicalRoles: UserRole[] = ['client', 'producer', 'admin', 'investor', 'logistics', 'importer', 'business']
      if (canonicalRoles.includes(lowerRole as UserRole)) {
        return lowerRole as UserRole
      }
      return null
  }
}

interface AuthContextType {
  // State
  status: AuthStatus
  role: UserRole | null
  clientUser: ClientUser | null
  producerUser: ProducerUser | null
  investorUser: InvestorUser | null
  logisticsUser: LogisticsUser | null
  importerUser: ImporterUser | null
  businessUser: BusinessUser | null
  user: AuthUser | null // Convenience - returns any authenticated user
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null

  // Actions - Client
  loginClient: (email: string, password: string) => Promise<void>
  registerClient: (data: { email: string; password: string; fullName: string; phoneNumber?: string }) => Promise<void>

  // Actions - Producer
  loginProducer: (email: string, password: string) => Promise<void>
  registerProducer: (data: {
    email: string
    password: string
    fullName: string
    phoneNumber?: string
    producerName: string
    registrationNumber: string
    type: 'COMPANY' | 'PFA'
    mainRegionId?: string
    description?: string
  }) => Promise<void>

  // Actions - Investor
  loginInvestor: (email: string, password: string) => Promise<void>
  registerInvestor: (data: {
    email: string
    password: string
    fullName: string
    phoneNumber?: string
    company?: string
    investmentInterest?: string
    message?: string
  }) => Promise<void>

  // Actions - Logistics
  loginLogistics: (email: string, password: string) => Promise<void>
  registerLogistics: (data: {
    email: string
    password: string
    fullName: string
    phoneNumber?: string
    companyName: string
    serviceType: 'DELIVERY' | 'WAREHOUSE' | 'PACKAGING' | 'MULTI'
    message?: string
  }) => Promise<void>

  // Actions - Importer
  loginImporter: (email: string, password: string) => Promise<void>
  registerImporter: (data: {
    email: string
    password: string
    fullName: string
    phoneNumber?: string
    companyName: string
    country?: string
    importVolume?: string
    message?: string
  }) => Promise<void>

  // Actions - Business
  loginBusiness: (email: string, password: string) => Promise<void>
  registerBusiness: (data: {
    email: string
    password: string
    fullName: string
    phoneNumber?: string
    companyName: string
    companyType?: 'RESTAURANT' | 'HOTEL' | 'CAFE' | 'CATERING' | 'RETAIL' | 'OTHER'
    registrationNumber?: string
    address?: string
    city?: string
    employeesCount?: number
    message?: string
  }) => Promise<void>

  // Actions - Common
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
  
  // Actions - Unified Login
  loginUnified: (email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('authenticating')
  const [role, setRole] = useState<UserRole | null>(null)
  const [clientUser, setClientUser] = useState<ClientUser | null>(null)
  const [producerUser, setProducerUser] = useState<ProducerUser | null>(null)
  const [investorUser, setInvestorUser] = useState<InvestorUser | null>(null)
  const [logisticsUser, setLogisticsUser] = useState<LogisticsUser | null>(null)
  const [importerUser, setImporterUser] = useState<ImporterUser | null>(null)
  const [businessUser, setBusinessUser] = useState<BusinessUser | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()

  // Minimum time between refresh attempts (5 seconds)
  const MIN_REFRESH_INTERVAL = 5000

  // Helper to get current user (convenience)
  const user: AuthUser | null = clientUser || producerUser || investorUser || logisticsUser || importerUser || businessUser
  const isLoading = status === 'authenticating'
  const isAuthenticated = status === 'authenticated' && !!user

  // Helper to determine role from user (uses normalizeRole)
  const getUserRole = (user: AuthUser | null): UserRole | null => {
    if (!user) return null
    return normalizeRole(user.role)
  }

  // Load user on mount
  useEffect(() => {
    refreshProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount

  /**
   * Refresh user profile from backend
   * Tries both client and producer endpoints
   */
  const refreshProfile = useCallback(async () => {
    // Prevent concurrent refresh attempts
    if (isRefreshing) {
      return
    }

    // Rate limiting: don't refresh if we just refreshed recently
    const now = Date.now()
    if (now - lastRefreshTime < MIN_REFRESH_INTERVAL) {
      return
    }

    try {
      setIsRefreshing(true)
      setStatus('authenticating')
      setError(null)
      setLastRefreshTime(now)

      // Try to get current user (tries both client and producer)
      const currentUser = await getCurrentUser()

      if (currentUser) {
        // Determine role and set appropriate user
        const userRole = getUserRole(currentUser)
        
        if (currentUser.role === 'CUSTOMER') {
          setClientUser(currentUser as ClientUser)
          setProducerUser(null)
          setInvestorUser(null)
          setLogisticsUser(null)
          setImporterUser(null)
        } else if (currentUser.role === 'PRODUCER') {
          setProducerUser(currentUser as ProducerUser)
          setClientUser(null)
          setInvestorUser(null)
          setLogisticsUser(null)
          setImporterUser(null)
        } else if (currentUser.role === 'INVESTOR') {
          setInvestorUser(currentUser as InvestorUser)
          setClientUser(null)
          setProducerUser(null)
          setLogisticsUser(null)
          setImporterUser(null)
        } else if (currentUser.role === 'LOGISTICS') {
          setLogisticsUser(currentUser as LogisticsUser)
          setClientUser(null)
          setProducerUser(null)
          setInvestorUser(null)
          setImporterUser(null)
        } else if (currentUser.role === 'IMPORTER') {
          setImporterUser(currentUser as ImporterUser)
          setClientUser(null)
          setProducerUser(null)
          setInvestorUser(null)
          setLogisticsUser(null)
          setBusinessUser(null)
        } else if (currentUser.role === 'BUSINESS') {
          setBusinessUser(currentUser as BusinessUser)
          setClientUser(null)
          setProducerUser(null)
          setInvestorUser(null)
          setLogisticsUser(null)
          setImporterUser(null)
        }

        setRole(userRole)
        setStatus('authenticated')
      } else {
        // Not authenticated
        setClientUser(null)
        setProducerUser(null)
        setInvestorUser(null)
        setLogisticsUser(null)
        setImporterUser(null)
        setBusinessUser(null)
        setRole(null)
        setStatus('unauthenticated')
      }
    } catch (error) {
      // Handle 429 (Too Many Requests) gracefully
      if (error instanceof Error && (error.message.includes('429') || error.message.includes('Prea multe'))) {
        setLastRefreshTime(now + 15 * 60000) // Wait 15 minutes
        setClientUser(null)
        setProducerUser(null)
        setInvestorUser(null)
        setRole(null)
        setStatus('unauthenticated')
        return
      }

      // Only log non-network errors that aren't rate limiting or CSP errors
      if (
        error instanceof Error &&
        !error.message.includes('network') &&
        !error.message.includes('Network') &&
        !error.message.includes('429') &&
        !error.message.includes('Prea multe') &&
        !error.message.includes('CSP') &&
        !error.message.includes('Content Security Policy') &&
        !error.message.includes('violates')
      ) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('Error refreshing user:', error)
        }
      }

      // Set to unauthenticated on any error
      setClientUser(null)
      setProducerUser(null)
      setRole(null)
      setStatus('unauthenticated')
    } finally {
      setIsRefreshing(false)
    }
  }, [isRefreshing, lastRefreshTime])

  /**
   * Unified login - tries all roles and redirects based on available roles
   */
  const handleLoginUnified = useCallback(
    async (email: string, password: string) => {
      try {
        setStatus('authenticating')
        setError(null)

        // Try unified login
        const response = await loginUnified({ email, password })

        // Update state based on response
        const user = response.user
        const normalizedRole = normalizeRole(user.role)
        
        // Set user based on role
        if (normalizedRole === 'client') {
          setClientUser(user as ClientUser)
          setProducerUser(null)
          setInvestorUser(null)
          setLogisticsUser(null)
          setImporterUser(null)
          setBusinessUser(null)
        } else if (normalizedRole === 'producer') {
          setProducerUser(user as ProducerUser)
          setClientUser(null)
          setInvestorUser(null)
          setLogisticsUser(null)
          setImporterUser(null)
          setBusinessUser(null)
        } else if (normalizedRole === 'investor') {
          setInvestorUser(user as InvestorUser)
          setClientUser(null)
          setProducerUser(null)
          setLogisticsUser(null)
          setImporterUser(null)
          setBusinessUser(null)
        } else if (normalizedRole === 'logistics') {
          setLogisticsUser(user as LogisticsUser)
          setClientUser(null)
          setProducerUser(null)
          setInvestorUser(null)
          setImporterUser(null)
          setBusinessUser(null)
        } else if (normalizedRole === 'importer') {
          setImporterUser(user as ImporterUser)
          setClientUser(null)
          setProducerUser(null)
          setInvestorUser(null)
          setLogisticsUser(null)
          setBusinessUser(null)
        } else if (normalizedRole === 'business') {
          setBusinessUser(user as BusinessUser)
          setClientUser(null)
          setProducerUser(null)
          setInvestorUser(null)
          setLogisticsUser(null)
          setImporterUser(null)
        }

        setRole(normalizedRole)
        setStatus('authenticated')

        // Sync cart with backend after login (if backend sync is enabled)
        try {
          const { useCartStore } = await import('@/lib/store/cart')
          const cartStore = useCartStore.getState()
          await cartStore.syncWithBackend()
        } catch (cartError) {
          // Don't block login if cart sync fails
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.error('[Auth] Cart sync error on login:', cartError)
          }
        }

        // Check for multiple roles
        try {
          const roles = await getUserRoles()
          
          // Get returnUrl if exists
          const searchParams = new URLSearchParams(window.location.search)
          const returnUrl = searchParams.get('returnUrl') || searchParams.get('redirect')

          if (roles.length > 1) {
            // Multiple roles - redirect to select account
            if (returnUrl) {
              router.push(`/select-account?returnUrl=${encodeURIComponent(returnUrl)}`)
            } else {
              router.push('/select-account')
            }
          } else if (roles.length === 1) {
            // Single role - redirect to portal
            const role = roles[0]
            let redirectPath = '/'
            
            switch (role) {
              case 'client':
                redirectPath = '/account'
                break
              case 'business':
                redirectPath = '/business-portal'
                break
              case 'producer':
                redirectPath = '/portal-producatori/dashboard'
                break
              case 'logistics':
                redirectPath = '/logistics-portal'
                break
              case 'investor':
                redirectPath = '/investor-portal'
                break
              case 'importer':
                redirectPath = '/importer-portal'
                break
              case 'admin':
                redirectPath = '/admin'
                break
            }

            if (returnUrl) {
              router.push(returnUrl)
            } else {
              router.push(redirectPath)
            }
          } else {
            // No roles - redirect to home
            if (returnUrl) {
              router.push(returnUrl)
            } else {
              router.push('/')
            }
          }
        } catch (rolesError) {
          // If getUserRoles fails, use the role from login response
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.error('[Auth] Failed to get user roles:', rolesError)
          }
          const searchParams = new URLSearchParams(window.location.search)
          const returnUrl = searchParams.get('returnUrl') || searchParams.get('redirect')
          
          if (normalizedRole) {
            let redirectPath = '/'
            switch (normalizedRole) {
              case 'client':
                redirectPath = '/account'
                break
              case 'business':
                redirectPath = '/business-portal'
                break
              case 'producer':
                redirectPath = '/portal-producatori/dashboard'
                break
              case 'logistics':
                redirectPath = '/logistics-portal'
                break
              case 'investor':
                redirectPath = '/investor-portal'
                break
              case 'importer':
                redirectPath = '/importer-portal'
                break
              case 'admin':
                redirectPath = '/admin'
                break
            }
            
            if (returnUrl) {
              router.push(returnUrl)
            } else {
              router.push(redirectPath)
            }
          } else {
            router.push(returnUrl || '/')
          }
        }

        router.refresh()
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Eroare la autentificare'
        setError(errorMessage)
        setStatus('error')
        throw err
      }
    },
    [router]
  )

  /**
   * Login client
   */
  const handleLoginClient = useCallback(
    async (email: string, password: string) => {
      try {
        setStatus('authenticating')
        setError(null)

        const response = await loginClient({ email, password })

        // Update state
        setClientUser(response.user as ClientUser)
        setProducerUser(null)
        setRole('client')
        setStatus('authenticated')

        // Sync cart with backend after login (if backend sync is enabled)
        try {
          const { useCartStore } = await import('@/lib/store/cart')
          const cartStore = useCartStore.getState()
          await cartStore.syncWithBackend()
        } catch (cartError) {
          // Don't block login if cart sync fails
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.error('[Auth] Cart sync error on login:', cartError)
          }
        }

        // Redirect to home or intended destination
        const searchParams = new URLSearchParams(window.location.search)
        const redirect = searchParams.get('redirect') || '/'
        router.push(redirect)
        router.refresh()
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Eroare la autentificare'
        setError(errorMessage)
        setStatus('error')
        throw err
      }
    },
    [router]
  )

  /**
   * Register client
   */
  const handleRegisterClient = useCallback(
    async (data: { email: string; password: string; fullName: string; phoneNumber?: string }) => {
      try {
        setStatus('authenticating')
        setError(null)

        const response = await registerClient(data)

        // Update state
        setClientUser(response.user as ClientUser)
        setProducerUser(null)
        setRole('client')
        setStatus('authenticated')

        // Redirect to homepage or login
        router.push('/')
        router.refresh()
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Eroare la înregistrare'
        setError(errorMessage)
        setStatus('error')
        throw err
      }
    },
    [router]
  )

  /**
   * Login producer
   */
  const handleLoginProducer = useCallback(
    async (email: string, password: string) => {
      try {
        setStatus('authenticating')
        setError(null)

        const response = await loginProducer({ email, password })

        // Update state
        setProducerUser(response.user as ProducerUser)
        setClientUser(null)
        setRole('producer')
        setStatus('authenticated')

        // Redirect to producer dashboard
        router.push(routes.producerPortal.dashboard)
        router.refresh()
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Eroare la autentificare'
        setError(errorMessage)
        setStatus('error')
        throw err
      }
    },
    [router]
  )

  /**
   * Register producer
   */
  const handleRegisterProducer = useCallback(
    async (data: {
      email: string
      password: string
      fullName: string
      phoneNumber?: string
      producerName: string
      registrationNumber: string
      type: 'COMPANY' | 'PFA'
      mainRegionId?: string
      description?: string
    }) => {
      try {
        setStatus('authenticating')
        setError(null)

        const response = await registerProducer(data)

        // Update state
        setProducerUser(response.user as ProducerUser)
        setClientUser(null)
        setRole('producer')
        setStatus('authenticated')

        // Redirect to producer dashboard or login
        router.push(routes.producerPortal.dashboard)
        router.refresh()
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Eroare la înregistrare'
        setError(errorMessage)
        setStatus('error')
        throw err
      }
    },
    [router]
  )

  /**
   * Login investor
   */
  const handleLoginInvestor = useCallback(
    async (email: string, password: string) => {
      try {
        setStatus('authenticating')
        setError(null)

        const response = await loginInvestor({ email, password })

        // Check if investor is approved
        const investor = response.user as InvestorUser
        if (investor.status === 'PENDING') {
          throw new Error('Contul tău nu a fost încă aprobat. Te rugăm să aștepți aprobarea echipei.')
        }

        // Update state
        setInvestorUser(investor)
        setClientUser(null)
        setProducerUser(null)
        setLogisticsUser(null)
        setImporterUser(null)
        setRole('investor')
        setStatus('authenticated')

        // Redirect to investor dashboard
        router.push('/pentru-investitori/dashboard')
        router.refresh()
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Eroare la autentificare'
        setError(errorMessage)
        setStatus('error')
        throw err
      }
    },
    [router]
  )

  /**
   * Register investor
   */
  const handleRegisterInvestor = useCallback(
    async (data: {
      email: string
      password: string
      fullName: string
      phoneNumber?: string
      company?: string
      investmentInterest?: string
      message?: string
    }) => {
      try {
        setStatus('authenticating')
        setError(null)

        const response = await registerInvestor(data)

        // Update state (investor will be in PENDING status)
        setInvestorUser(response.user as InvestorUser)
        setClientUser(null)
        setProducerUser(null)
        setLogisticsUser(null)
        setImporterUser(null)
        setRole('investor')
        setStatus('authenticated')

        // Show message that account is pending approval
        // Redirect to pending page or show message
        router.push('/pentru-investitori/register?pending=true')
        router.refresh()
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Eroare la înregistrare'
        setError(errorMessage)
        setStatus('error')
        throw err
      }
    },
    [router]
  )

  /**
   * Login logistics
   */
  const handleLoginLogistics = useCallback(
    async (email: string, password: string) => {
      try {
        setStatus('authenticating')
        setError(null)

        const response = await loginLogistics({ email, password })

        // Check if logistics user is approved
        const logistics = response.user as LogisticsUser
        if (logistics.status === 'PENDING') {
          throw new Error('Contul tău nu a fost încă aprobat. Te rugăm să aștepți aprobarea echipei.')
        }

        // Update state
        setLogisticsUser(logistics)
        setClientUser(null)
        setProducerUser(null)
        setInvestorUser(null)
        setImporterUser(null)
        setRole('logistics')
        setStatus('authenticated')

        // Redirect to logistics dashboard
        router.push('/pentru-logistica/dashboard')
        router.refresh()
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Eroare la autentificare'
        setError(errorMessage)
        setStatus('error')
        throw err
      }
    },
    [router]
  )

  /**
   * Register logistics
   */
  const handleRegisterLogistics = useCallback(
    async (data: {
      email: string
      password: string
      fullName: string
      phoneNumber?: string
      companyName: string
      serviceType: 'DELIVERY' | 'WAREHOUSE' | 'PACKAGING' | 'MULTI'
      message?: string
    }) => {
      try {
        setStatus('authenticating')
        setError(null)

        const response = await registerLogistics(data)

        // Update state (logistics user will be in PENDING status)
        setLogisticsUser(response.user as LogisticsUser)
        setClientUser(null)
        setProducerUser(null)
        setInvestorUser(null)
        setImporterUser(null)
        setRole('logistics')
        setStatus('authenticated')

        // Show message that account is pending approval
        router.push('/pentru-logistica/register?pending=true')
        router.refresh()
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Eroare la înregistrare'
        setError(errorMessage)
        setStatus('error')
        throw err
      }
    },
    [router]
  )

  /**
   * Login importer
   */
  const handleLoginImporter = useCallback(
    async (email: string, password: string) => {
      try {
        setStatus('authenticating')
        setError(null)

        const response = await loginImporter({ email, password })

        // Check if importer user is approved
        const importer = response.user as ImporterUser
        if (importer.status === 'PENDING') {
          throw new Error('Contul tău nu a fost încă aprobat. Te rugăm să aștepți aprobarea echipei.')
        }

        // Update state
        setImporterUser(importer)
        setClientUser(null)
        setProducerUser(null)
        setInvestorUser(null)
        setLogisticsUser(null)
        setRole('importer')
        setStatus('authenticated')

        // Redirect to importer dashboard
        router.push('/pentru-importatori/dashboard')
        router.refresh()
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Eroare la autentificare'
        setError(errorMessage)
        setStatus('error')
        throw err
      }
    },
    [router]
  )

  /**
   * Register importer
   */
  const handleRegisterImporter = useCallback(
    async (data: {
      email: string
      password: string
      fullName: string
      phoneNumber?: string
      companyName: string
      country?: string
      importVolume?: string
      message?: string
    }) => {
      try {
        setStatus('authenticating')
        setError(null)

        const response = await registerImporter(data)

        // Update state (importer user will be in PENDING status)
        setImporterUser(response.user as ImporterUser)
        setClientUser(null)
        setProducerUser(null)
        setInvestorUser(null)
        setLogisticsUser(null)
        setBusinessUser(null)
        setRole('importer')
        setStatus('authenticated')

        // Show message that account is pending approval
        router.push('/pentru-importatori/register?pending=true')
        router.refresh()
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Eroare la înregistrare'
        setError(errorMessage)
        setStatus('error')
        throw err
      }
    },
    [router]
  )

  /**
   * Login business
   */
  const handleLoginBusiness = useCallback(
    async (email: string, password: string) => {
      try {
        setStatus('authenticating')
        setError(null)

        const response = await loginBusiness({ email, password })

        // Update state
        setBusinessUser(response.user as BusinessUser)
        setClientUser(null)
        setProducerUser(null)
        setInvestorUser(null)
        setLogisticsUser(null)
        setImporterUser(null)
        setRole('business')
        setStatus('authenticated')

        // Redirect to business dashboard
        router.push('/b2b/dashboard')
        router.refresh()
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Eroare la autentificare'
        setError(errorMessage)
        setStatus('error')
        throw err
      }
    },
    [router]
  )

  /**
   * Register business
   */
  const handleRegisterBusiness = useCallback(
    async (data: {
      email: string
      password: string
      fullName: string
      phoneNumber?: string
      companyName: string
      companyType?: 'RESTAURANT' | 'HOTEL' | 'CAFE' | 'CATERING' | 'RETAIL' | 'OTHER'
      registrationNumber?: string
      address?: string
      city?: string
      employeesCount?: number
      message?: string
    }) => {
      try {
        setStatus('authenticating')
        setError(null)

        const response = await registerBusiness(data)

        // Update state
        setBusinessUser(response.user as BusinessUser)
        setClientUser(null)
        setProducerUser(null)
        setInvestorUser(null)
        setLogisticsUser(null)
        setImporterUser(null)
        setRole('business')
        setStatus('authenticated')

        // Redirect to business dashboard
        router.push('/b2b/dashboard')
        router.refresh()
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Eroare la înregistrare'
        setError(errorMessage)
        setStatus('error')
        throw err
      }
    },
    [router]
  )

  /**
   * Logout
   */
  const handleLogout = useCallback(async () => {
    try {
      setStatus('authenticating')
      await logout()

      // Clear cart store on logout (if backend sync is enabled, clear backend cart too)
      try {
        const { useCartStore } = await import('@/lib/store/cart')
        const cartStore = useCartStore.getState()
        await cartStore.clear()
      } catch (cartError) {
        // Don't block logout if cart clear fails
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('[Auth] Cart clear error on logout:', cartError)
        }
      }

      // Clear state
      setClientUser(null)
      setProducerUser(null)
      setInvestorUser(null)
      setLogisticsUser(null)
      setImporterUser(null)
      setBusinessUser(null)
      setRole(null)
      setStatus('unauthenticated')
      setError(null)

      // Redirect to unified login
      router.push('/login')
      router.refresh()
    } catch (err: unknown) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Logout error:', err)
      }
      // Clear state even if logout fails
      setClientUser(null)
      setProducerUser(null)
      setInvestorUser(null)
      setLogisticsUser(null)
      setImporterUser(null)
      setBusinessUser(null)
      setRole(null)
      setStatus('unauthenticated')
      router.push('/login')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const value: AuthContextType = {
    // State
    status,
    role,
    clientUser,
    producerUser,
    investorUser,
    logisticsUser,
    importerUser,
    businessUser,
    user,
    isLoading,
    isAuthenticated,
    error,

    // Actions
    loginClient: handleLoginClient,
    registerClient: handleRegisterClient,
    loginProducer: handleLoginProducer,
    registerProducer: handleRegisterProducer,
    loginInvestor: handleLoginInvestor,
    registerInvestor: handleRegisterInvestor,
    loginLogistics: handleLoginLogistics,
    registerLogistics: handleRegisterLogistics,
    loginImporter: handleLoginImporter,
    registerImporter: handleRegisterImporter,
    loginBusiness: handleLoginBusiness,
    registerBusiness: handleRegisterBusiness,
    logout: handleLogout,
    refreshProfile,
    loginUnified: handleLoginUnified,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook to use authentication context
 * 
 * @throws Error if used outside AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

/**
 * Hook for client-specific auth (convenience)
 */
export function useClientAuth() {
  const auth = useAuth()
  return {
    ...auth,
    user: auth.clientUser,
    isAuthenticated: auth.isAuthenticated && auth.role === 'client',
  }
}

/**
 * Hook for producer-specific auth (convenience)
 */
export function useProducerAuth() {
  const auth = useAuth()
  return {
    ...auth,
    user: auth.producerUser,
    isAuthenticated: auth.isAuthenticated && auth.role === 'producer',
  }
}
