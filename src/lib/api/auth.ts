/**
 * Authentication API
 * 
 * Functions for user authentication (login, register, logout, getCurrentUser)
 * Uses apiFetch to call https://api.farme.ro
 * Supports both client and producer authentication
 */

import { apiFetch, ApiError } from './client'
import type { UserRole } from '@/lib/types/domain'

// ============================================================================
// Types
// ============================================================================

export interface ClientUser {
  id: string
  email: string
  fullName: string
  role: 'CUSTOMER'
  phoneNumber?: string
  createdAt?: string
}

export interface ProducerUser {
  id: string
  email: string
  fullName: string
  role: 'PRODUCER'
  producerName?: string
  registrationNumber?: string
  type?: 'COMPANY' | 'PFA'
  mainRegionId?: string
  phoneNumber?: string
  createdAt?: string
}

export interface AdminUser {
  id: string
  email: string
  fullName: string
  role: 'ADMIN'
  phoneNumber?: string
  createdAt?: string
}

export interface InvestorUser {
  id: string
  email: string
  fullName: string
  role: 'INVESTOR'
  phoneNumber?: string
  company?: string
  investmentAmount?: number
  investmentDate?: string
  status?: 'PENDING' | 'APPROVED' | 'ACTIVE'
  createdAt?: string
}

export interface LogisticsUser {
  id: string
  email: string
  fullName: string
  role: 'LOGISTICS'
  phoneNumber?: string
  companyName?: string
  serviceType?: 'DELIVERY' | 'WAREHOUSE' | 'PACKAGING' | 'MULTI'
  contractNumber?: string
  status?: 'PENDING' | 'APPROVED' | 'ACTIVE'
  createdAt?: string
}

export interface ImporterUser {
  id: string
  email: string
  fullName: string
  role: 'IMPORTER'
  phoneNumber?: string
  companyName?: string
  country?: string
  importVolume?: number
  status?: 'PENDING' | 'APPROVED' | 'ACTIVE'
  createdAt?: string
}

export interface BusinessUser {
  id: string
  email: string
  fullName: string
  role: 'BUSINESS'
  phoneNumber?: string
  companyName: string
  companyType?: 'RESTAURANT' | 'HOTEL' | 'CAFE' | 'CATERING' | 'RETAIL' | 'OTHER'
  registrationNumber?: string
  address?: string
  city?: string
  employeesCount?: number
  createdAt?: string
}

export type AuthUser = ClientUser | ProducerUser | AdminUser | InvestorUser | LogisticsUser | ImporterUser | BusinessUser

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterClientPayload {
  email: string
  password: string
  fullName: string
  phoneNumber?: string
}

export interface RegisterProducerPayload {
  email: string
  password: string
  fullName: string
  phoneNumber?: string
  producerName: string
  registrationNumber: string
  type: 'COMPANY' | 'PFA'
  mainRegionId?: string
  description?: string
}

export interface RegisterInvestorPayload {
  email: string
  password: string
  fullName: string
  phoneNumber?: string
  company?: string
  investmentInterest?: string
  message?: string
}

export interface RegisterLogisticsPayload {
  email: string
  password: string
  fullName: string
  phoneNumber?: string
  companyName: string
  serviceType: 'DELIVERY' | 'WAREHOUSE' | 'PACKAGING' | 'MULTI'
  message?: string
}

export interface RegisterImporterPayload {
  email: string
  password: string
  fullName: string
  phoneNumber?: string
  companyName: string
  country?: string
  importVolume?: string
  message?: string
}

export interface RegisterBusinessPayload {
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
}

export interface AuthResponse {
  user: AuthUser
  token?: string
  message?: string
}

// ============================================================================
// Client Authentication
// ============================================================================

/**
 * Login client
 * 
 * @param payload - Email and password
 * @returns User data
 * @throws ApiError if login fails
 */
export async function loginClient(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const response = await apiFetch<AuthResponse>('/auth/client/login', {
      method: 'POST',
      credentials: 'include', // Include cookies for session
      body: JSON.stringify(payload),
    })
    
    return response
  } catch (error) {
    if (error instanceof ApiError) {
      // Handle specific error codes
      if (error.status === 401) {
        throw new Error('Email sau parolă incorectă.')
      }
      if (error.status === 400) {
        throw new Error('Date invalide. Verifică că email-ul și parola sunt completate corect.')
      }
      if (error.status === 429) {
        throw new Error('Prea multe încercări de autentificare. Te rugăm să încerci din nou peste 15 minute.')
      }
      if (error.status === 500) {
        throw new Error('Eroare pe server. Te rugăm să încerci mai târziu.')
      }
      throw new Error(error.message || 'Eroare la autentificare. Te rugăm să încerci din nou.')
    }
    throw error
  }
}

/**
 * Extract detailed error message from API error response
 */
function extractErrorMessage(error: ApiError, defaultMessage: string): string {
  if (error.status === 500 && error.data && typeof error.data === 'object') {
    const errorData = error.data as any
    // Check for detailed error message from backend
    if (errorData.message) {
      return errorData.message
    } else if (errorData.error && typeof errorData.error === 'string') {
      return errorData.error
    } else if (errorData.details) {
      // If there are validation details, include them
      return `Eroare: ${JSON.stringify(errorData.details)}`
    }
  }
  return defaultMessage
}

/**
 * Register client
 * 
 * @param payload - Registration data
 * @returns User data
 * @throws ApiError if registration fails
 */
export async function registerClient(payload: RegisterClientPayload): Promise<AuthResponse> {
  try {
    const response = await apiFetch<AuthResponse>('/auth/client/register', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    
    return response
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 400) {
        throw new Error('Date invalide. Verifică că toate câmpurile sunt completate corect.')
      }
      if (error.status === 409) {
        throw new Error('Acest email este deja înregistrat.')
      }
      if (error.status === 429) {
        throw new Error('Prea multe încercări de înregistrare. Te rugăm să încerci din nou peste 15 minute.')
      }
      if (error.status === 500) {
        const detailedMessage = extractErrorMessage(error, 'Eroare pe server. Te rugăm să încerci mai târziu.')
        throw new Error(detailedMessage)
      }
      throw new Error(error.message || 'Eroare la înregistrare. Te rugăm să încerci din nou.')
    }
    throw error
  }
}

/**
 * Get current client profile
 * 
 * @returns Current client user or null if not authenticated
 */
export async function getClientProfile(): Promise<ClientUser | null> {
  try {
    const user = await apiFetch<ClientUser>('/auth/client/me', {
      method: 'GET',
      credentials: 'include',
    })
    
    return user
  } catch (error) {
    if (error instanceof ApiError) {
      // 401 means not authenticated
      // 403 means authenticated but wrong role (also treat as not authenticated for this endpoint)
      if (error.status === 401 || error.status === 403) {
        return null
      }
      // Network errors - assume not authenticated
      if (error.status === 0) {
        return null
      }
      throw error
    }
    return null
  }
}

// ============================================================================
// Producer Authentication
// ============================================================================

/**
 * Login producer
 * 
 * @param payload - Email and password
 * @returns User data
 * @throws ApiError if login fails
 */
export async function loginProducer(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const response = await apiFetch<AuthResponse>('/auth/producer/login', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    
    return response
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new Error('Email sau parolă incorectă.')
      }
      if (error.status === 400) {
        throw new Error('Date invalide. Verifică că email-ul și parola sunt completate corect.')
      }
      if (error.status === 429) {
        throw new Error('Prea multe încercări de autentificare. Te rugăm să încerci din nou peste 15 minute.')
      }
      if (error.status === 500) {
        throw new Error('Eroare pe server. Te rugăm să încerci mai târziu.')
      }
      throw new Error(error.message || 'Eroare la autentificare. Te rugăm să încerci din nou.')
    }
    throw error
  }
}

/**
 * Register producer
 * 
 * @param payload - Registration data
 * @returns User data
 * @throws ApiError if registration fails
 */
export async function registerProducer(payload: RegisterProducerPayload): Promise<AuthResponse> {
  try {
    const response = await apiFetch<AuthResponse>('/auth/producer/register', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    
    return response
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 400) {
        throw new Error('Date invalide. Verifică că toate câmpurile sunt completate corect.')
      }
      if (error.status === 409) {
        throw new Error('Acest email este deja înregistrat.')
      }
      if (error.status === 429) {
        throw new Error('Prea multe încercări de înregistrare. Te rugăm să încerci din nou peste 15 minute.')
      }
      if (error.status === 500) {
        throw new Error('Eroare pe server. Te rugăm să încerci mai târziu.')
      }
      throw new Error(error.message || 'Eroare la înregistrare. Te rugăm să încerci din nou.')
    }
    throw error
  }
}

/**
 * Get current producer profile
 * 
 * @returns Current producer user or null if not authenticated
 */
export async function getProducerProfile(): Promise<ProducerUser | null> {
  try {
    const user = await apiFetch<ProducerUser>('/auth/producer/me', {
      method: 'GET',
      credentials: 'include',
    })
    
    return user
  } catch (error) {
    if (error instanceof ApiError) {
      // 401 means not authenticated
      // 403 means authenticated but wrong role (also treat as not authenticated for this endpoint)
      if (error.status === 401 || error.status === 403) {
        return null
      }
      // Network errors - assume not authenticated
      if (error.status === 0) {
        return null
      }
      throw error
    }
    return null
  }
}

// ============================================================================
// Investor Authentication
// ============================================================================

/**
 * Login investor
 * 
 * @param payload - Email and password
 * @returns User data
 * @throws ApiError if login fails
 */
export async function loginInvestor(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const response = await apiFetch<AuthResponse>('/auth/investor/login', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    
    return response
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new Error('Email sau parolă incorectă.')
      }
      if (error.status === 403) {
        throw new Error('Contul tău nu a fost încă aprobat. Te rugăm să aștepți aprobarea echipei.')
      }
      if (error.status === 400) {
        throw new Error('Date invalide. Verifică că email-ul și parola sunt completate corect.')
      }
      if (error.status === 429) {
        throw new Error('Prea multe încercări de autentificare. Te rugăm să încerci din nou peste 15 minute.')
      }
      if (error.status === 500) {
        throw new Error('Eroare pe server. Te rugăm să încerci mai târziu.')
      }
      throw new Error(error.message || 'Eroare la autentificare. Te rugăm să încerci din nou.')
    }
    throw error
  }
}

/**
 * Register investor
 * 
 * @param payload - Registration data
 * @returns User data (with status PENDING)
 * @throws ApiError if registration fails
 */
export async function registerInvestor(payload: RegisterInvestorPayload): Promise<AuthResponse> {
  try {
    const response = await apiFetch<AuthResponse>('/auth/investor/register', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    
    return response
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 400) {
        throw new Error('Date invalide. Verifică că toate câmpurile sunt completate corect.')
      }
      if (error.status === 409) {
        throw new Error('Acest email este deja înregistrat.')
      }
      if (error.status === 429) {
        throw new Error('Prea multe încercări de înregistrare. Te rugăm să încerci din nou peste 15 minute.')
      }
      if (error.status === 500) {
        throw new Error('Eroare pe server. Te rugăm să încerci mai târziu.')
      }
      throw new Error(error.message || 'Eroare la înregistrare. Te rugăm să încerci din nou.')
    }
    throw error
  }
}

/**
 * Get current investor profile
 * 
 * @returns Current investor user or null if not authenticated
 */
export async function getInvestorProfile(): Promise<InvestorUser | null> {
  try {
    const user = await apiFetch<InvestorUser>('/auth/investor/me', {
      method: 'GET',
      credentials: 'include',
    })
    
    return user
  } catch (error) {
    if (error instanceof ApiError) {
      // 401 means not authenticated
      if (error.status === 401) {
        return null
      }
      // Network errors - assume not authenticated
      if (error.status === 0) {
        return null
      }
      throw error
    }
    return null
  }
}

// ============================================================================
// Logistics Authentication
// ============================================================================

/**
 * Login logistics
 * 
 * @param payload - Email and password
 * @returns User data
 * @throws ApiError if login fails
 */
export async function loginLogistics(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const response = await apiFetch<AuthResponse>('/auth/logistics/login', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    
    return response
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new Error('Email sau parolă incorectă.')
      }
      if (error.status === 403) {
        throw new Error('Contul tău nu a fost încă aprobat. Te rugăm să aștepți aprobarea echipei.')
      }
      if (error.status === 400) {
        throw new Error('Date invalide. Verifică că email-ul și parola sunt completate corect.')
      }
      if (error.status === 429) {
        throw new Error('Prea multe încercări de autentificare. Te rugăm să încerci din nou peste 15 minute.')
      }
      throw new Error(error.message || 'Eroare la autentificare. Te rugăm să încerci din nou.')
    }
    throw error
  }
}

/**
 * Register logistics
 * 
 * @param payload - Registration data
 * @returns User data
 * @throws ApiError if registration fails
 */
export async function registerLogistics(payload: RegisterLogisticsPayload): Promise<AuthResponse> {
  try {
    const response = await apiFetch<AuthResponse>('/auth/logistics/register', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    
    return response
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 400) {
        throw new Error('Date invalide. Verifică că toate câmpurile sunt completate corect.')
      }
      if (error.status === 409) {
        throw new Error('Acest email este deja înregistrat.')
      }
      if (error.status === 429) {
        throw new Error('Prea multe încercări de înregistrare. Te rugăm să încerci din nou peste 15 minute.')
      }
      if (error.status === 500) {
        throw new Error('Eroare pe server. Te rugăm să încerci mai târziu.')
      }
      throw new Error(error.message || 'Eroare la înregistrare. Te rugăm să încerci din nou.')
    }
    throw error
  }
}

/**
 * Get current logistics profile
 * 
 * @returns Current logistics user or null if not authenticated
 */
export async function getLogisticsProfile(): Promise<LogisticsUser | null> {
  try {
    const user = await apiFetch<LogisticsUser>('/auth/logistics/me', {
      method: 'GET',
      credentials: 'include',
    })
    
    return user
  } catch (error) {
    if (error instanceof ApiError) {
      // 401 means not authenticated
      if (error.status === 401) {
        return null
      }
      // Network errors - assume not authenticated
      if (error.status === 0) {
        return null
      }
      throw error
    }
    return null
  }
}

// ============================================================================
// Common Authentication
// ============================================================================

/**
 * Logout (works for both client and producer)
 * 
 * @throws ApiError if logout fails
 */
export async function logout(): Promise<void> {
  try {
    await apiFetch<void>('/auth/logout', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({}),
    })
  } catch (error) {
    // Don't throw on logout errors - just log
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('[Auth] Logout error:', error)
    }
  }
}

/**
 * Get current user (tries both client and producer)
 * 
 * @returns Current user or null if not authenticated
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  // Try client first
  try {
    const clientUser = await getClientProfile()
    if (clientUser) {
      return clientUser
    }
  } catch (error) {
    // Silently continue - 404 is expected if user doesn't have this role
    // Only log unexpected errors
    if (error instanceof ApiError && !error.isExpected && process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.debug('[getCurrentUser] Client profile check failed (expected):', error.status)
    }
  }
  
  // Try producer
  try {
    const producerUser = await getProducerProfile()
    if (producerUser) {
      return producerUser
    }
  } catch (error) {
    // Silently continue - 404 is expected if user doesn't have this role
    if (error instanceof ApiError && !error.isExpected && process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.debug('[getCurrentUser] Producer profile check failed (expected):', error.status)
    }
  }

  // Try investor
  try {
    const investorUser = await getInvestorProfile()
    if (investorUser) {
      return investorUser
    }
  } catch (error) {
    // Silently continue
    if (error instanceof ApiError && !error.isExpected && process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.debug('[getCurrentUser] Investor profile check failed (expected):', error.status)
    }
  }

  // Try logistics
  try {
    const logisticsUser = await getLogisticsProfile()
    if (logisticsUser) {
      return logisticsUser
    }
  } catch (error) {
    // Silently continue
    if (error instanceof ApiError && !error.isExpected && process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.debug('[getCurrentUser] Logistics profile check failed (expected):', error.status)
    }
  }

  // Try importer
  try {
    const importerUser = await getImporterProfile()
    if (importerUser) {
      return importerUser
    }
  } catch (error) {
    // Silently continue
    if (error instanceof ApiError && !error.isExpected && process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.debug('[getCurrentUser] Importer profile check failed (expected):', error.status)
    }
  }

  // Try business
  try {
    const businessUser = await getBusinessProfile()
    if (businessUser) {
      return businessUser
    }
  } catch (error) {
    // Silently continue - not authenticated as business either
    if (error instanceof ApiError && !error.isExpected && process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.debug('[getCurrentUser] Business profile check failed (expected):', error.status)
    }
  }
  
  return null
}

// ============================================================================
// Unified Login (tries all roles)
// ============================================================================

/**
 * Unified login function
 * 
 * Tries to login with all role endpoints until one succeeds
 * Returns the first successful login response
 * 
 * @param payload - Email and password
 * @returns User data with role information
 * @throws ApiError if all login attempts fail
 */
export async function loginUnified(payload: LoginPayload): Promise<AuthResponse> {
  const loginAttempts = [
    () => loginClient(payload),
    () => loginProducer(payload),
    () => loginBusiness(payload),
    () => loginLogistics(payload),
    () => loginInvestor(payload),
    () => loginImporter(payload),
  ]

  const errors: Error[] = []

  for (const attempt of loginAttempts) {
    try {
      return await attempt()
    } catch (error) {
      // Collect errors but continue trying
      if (error instanceof Error) {
        errors.push(error)
      }
      // Continue to next attempt
    }
  }

  // If all attempts failed, throw a generic error
  const lastError = errors[errors.length - 1]
  if (lastError instanceof ApiError) {
    throw lastError
  }
  throw new ApiError('Autentificare eșuată. Verifică email-ul și parola.', 401)
}

/**
 * Get all roles for current user
 * 
 * Checks all profile endpoints to determine which roles the user has
 * Returns array of roles the user is authenticated with
 * 
 * @returns Array of user roles
 */
export async function getUserRoles(): Promise<UserRole[]> {
  const roles: UserRole[] = []
  
  // Helper to normalize role
  const normalizeRole = (role: string): UserRole | null => {
    const upperRole = role.toUpperCase()
    switch (upperRole) {
      case 'CUSTOMER':
      case 'CLIENT':
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
      default:
        return null
    }
  }

  // Check all profile endpoints
  const checks = [
    { fn: () => getClientProfile(), role: 'client' },
    { fn: () => getProducerProfile(), role: 'producer' },
    { fn: () => getBusinessProfile(), role: 'business' },
    { fn: () => getLogisticsProfile(), role: 'logistics' },
    { fn: () => getInvestorProfile(), role: 'investor' },
    { fn: () => getImporterProfile(), role: 'importer' },
  ]

  for (const check of checks) {
    try {
      const user = await check.fn()
      if (user) {
        const normalizedRole = normalizeRole(user.role)
        if (normalizedRole && !roles.includes(normalizedRole)) {
          roles.push(normalizedRole)
        }
      }
    } catch {
      // Continue checking other roles
    }
  }

  return roles
}

// ============================================================================
// Legacy compatibility (deprecated - use specific functions above)
// ============================================================================

/**
 * @deprecated Use loginUnified instead
 */
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  // Try client first, then producer
  try {
    return await loginClient(payload)
  } catch {
    return await loginProducer(payload)
  }
}

/**
 * @deprecated Use registerClient or registerProducer instead
 */
export async function register(payload: RegisterClientPayload): Promise<AuthResponse> {
  return registerClient(payload)
}

/**
 * @deprecated Use logout instead
 */
export async function apiLogout(): Promise<void> {
  return logout()
}

// ============================================================================
// Importer Authentication
// ============================================================================

/**
 * Login importer
 * 
 * @param payload - Email and password
 * @returns User data
 * @throws ApiError if login fails
 */
export async function loginImporter(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const response = await apiFetch<AuthResponse>('/auth/importer/login', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    
    return response
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new Error('Email sau parolă incorectă.')
      }
      if (error.status === 403) {
        throw new Error('Contul tău nu a fost încă aprobat. Te rugăm să aștepți aprobarea echipei.')
      }
      if (error.status === 400) {
        throw new Error('Date invalide. Verifică că email-ul și parola sunt completate corect.')
      }
      if (error.status === 429) {
        throw new Error('Prea multe încercări de autentificare. Te rugăm să încerci din nou peste 15 minute.')
      }
      if (error.status === 500) {
        throw new Error('Eroare pe server. Te rugăm să încerci mai târziu.')
      }
      throw new Error(error.message || 'Eroare la autentificare. Te rugăm să încerci din nou.')
    }
    throw error
  }
}

/**
 * Register importer
 * 
 * @param payload - Registration data
 * @returns User data (with status PENDING)
 * @throws ApiError if registration fails
 */
export async function registerImporter(payload: RegisterImporterPayload): Promise<AuthResponse> {
  try {
    const response = await apiFetch<AuthResponse>('/auth/importer/register', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    
    return response
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 400) {
        throw new Error('Date invalide. Verifică că toate câmpurile sunt completate corect.')
      }
      if (error.status === 409) {
        throw new Error('Acest email este deja înregistrat.')
      }
      if (error.status === 429) {
        throw new Error('Prea multe încercări de înregistrare. Te rugăm să încerci din nou peste 15 minute.')
      }
      if (error.status === 500) {
        throw new Error('Eroare pe server. Te rugăm să încerci mai târziu.')
      }
      throw new Error(error.message || 'Eroare la înregistrare. Te rugăm să încerci din nou.')
    }
    throw error
  }
}

/**
 * Get current importer profile
 * 
 * @returns Current importer user or null if not authenticated
 */
export async function getImporterProfile(): Promise<ImporterUser | null> {
  try {
    const user = await apiFetch<ImporterUser>('/auth/importer/me', {
      method: 'GET',
      credentials: 'include',
    })
    
    return user
  } catch (error) {
    if (error instanceof ApiError) {
      // 401 means not authenticated
      if (error.status === 401) {
        return null
      }
      // Network errors - assume not authenticated
      if (error.status === 0) {
        return null
      }
      throw error
    }
    return null
  }
}

// ============================================================================
// Business (B2B) Authentication
// ============================================================================

/**
 * Login business
 * 
 * @param payload - Email and password
 * @returns User data
 * @throws ApiError if login fails
 */
export async function loginBusiness(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const response = await apiFetch<AuthResponse>('/auth/business/login', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    
    return response
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new Error('Email sau parolă incorectă.')
      }
      if (error.status === 400) {
        throw new Error('Date invalide. Verifică că email-ul și parola sunt completate corect.')
      }
      if (error.status === 429) {
        throw new Error('Prea multe încercări de autentificare. Te rugăm să încerci din nou peste 15 minute.')
      }
      if (error.status === 500) {
        throw new Error('Eroare pe server. Te rugăm să încerci mai târziu.')
      }
      throw new Error(error.message || 'Eroare la autentificare. Te rugăm să încerci din nou.')
    }
    throw error
  }
}

/**
 * Register business
 * 
 * @param payload - Registration data
 * @returns User data
 * @throws ApiError if registration fails
 */
export async function registerBusiness(payload: RegisterBusinessPayload): Promise<AuthResponse> {
  try {
    const response = await apiFetch<AuthResponse>('/auth/business/register', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    
    return response
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 400) {
        throw new Error('Date invalide. Verifică că toate câmpurile sunt completate corect.')
      }
      if (error.status === 409) {
        throw new Error('Acest email este deja înregistrat.')
      }
      if (error.status === 429) {
        throw new Error('Prea multe încercări de înregistrare. Te rugăm să încerci din nou peste 15 minute.')
      }
      if (error.status === 500) {
        throw new Error('Eroare pe server. Te rugăm să încerci mai târziu.')
      }
      throw new Error(error.message || 'Eroare la înregistrare. Te rugăm să încerci din nou.')
    }
    throw error
  }
}

/**
 * Get current business profile
 * 
 * @returns Current business user or null if not authenticated
 */
export async function getBusinessProfile(): Promise<BusinessUser | null> {
  try {
    const user = await apiFetch<BusinessUser>('/auth/business/me', {
      method: 'GET',
      credentials: 'include',
    })
    
    return user
  } catch (error) {
    if (error instanceof ApiError) {
      // 401 means not authenticated
      if (error.status === 401) {
        return null
      }
      // Network errors - assume not authenticated
      if (error.status === 0) {
        return null
      }
      throw error
    }
    return null
  }
}

/**
 * Request password reset for client
 * 
 * @param email - Client email address
 * @throws ApiError if request fails
 * 
 * Note: Backend endpoint POST /auth/client/forgot-password needs to be implemented
 */
export async function requestClientPasswordReset(email: string): Promise<void> {
  try {
    await apiFetch<void>('/auth/client/forgot-password', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ email }),
    })
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        // Endpoint doesn't exist yet - this is expected
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('[requestClientPasswordReset] Endpoint not implemented yet')
        }
        // Don't throw - just log, UI will show generic success message
        return
      }
      if (error.status === 400) {
        throw new Error('Email invalid. Verifică că adresa de email este corectă.')
      }
      if (error.status === 429) {
        throw new Error('Prea multe încercări. Te rugăm să încerci din nou peste 15 minute.')
      }
      // For other errors, don't throw - show generic success message for security
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('[requestClientPasswordReset] Error:', error)
      }
      return
    }
    // For network errors, don't throw - show generic success message
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('[requestClientPasswordReset] Network error:', error)
    }
  }
}