/**
 * Accounts API
 * 
 * API functions for multi-account management
 * Uses apiFetch to call https://api.farme.ro (external backend API)
 * 
 * IMPORTANT: Backend-ul este într-un repo separat (api.farme.ro).
 * Aceste funcții sunt doar API contracts și fallback-uri pentru frontend.
 * 
 * Note: Backend endpoints need to be implemented in the separate backend repository:
 * - GET /accounts - List all accounts for current user
 * - GET /accounts/:id - Get account details
 * - POST /accounts/business - Create new business account
 * - PATCH /accounts/:id - Update account
 * - DELETE /accounts/:id - Delete account (soft delete)
 * 
 * FALLBACK: Until backend supports multi-account, we generate a PersonalAccount
 * locally based on the current user profile.
 * 
 * See: docs/BACKEND_API_CONTRACT_ACCOUNTS.md for API contract documentation
 */

import { apiFetch, ApiError } from './client'
import type { UserAccount, PersonalAccount, BusinessAccount } from '@/lib/types/domain'

// ============================================================================
// Types
// ============================================================================

export type CreateBusinessAccountInput = {
  name: string
  companyNumber?: string
  vatId?: string
  billingAddress?: {
    name: string
    city: string
    address: string
    postalCode?: string
    country?: string
  }
  companyType?: 'COMPANY' | 'PFA' | 'ONG' | 'OTHER'
  taxId?: string
}

export type UpdateAccountInput = Partial<CreateBusinessAccountInput> & {
  name?: string
}

// ============================================================================
// Helper: Generate Personal Account from User
// ============================================================================

/**
 * Generate a PersonalAccount from user profile
 * 
 * This is used as fallback when backend doesn't support multi-account yet.
 * Every user automatically has a personal account.
 */
export function generatePersonalAccountFromUser(user: { id: string; fullName?: string; name?: string; email: string }): PersonalAccount {
  return {
    id: `personal-${user.id}`,
    type: 'personal',
    name: user.fullName || user.name || 'Cont Personal',
    isDefault: true,
  }
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get all accounts for current user
 * 
 * @returns List of user accounts
 * @throws ApiError if request fails
 * 
 * FALLBACK: If backend doesn't support accounts yet, returns a PersonalAccount
 * generated from current user profile.
 */
export async function getAccounts(): Promise<UserAccount[]> {
  try {
    const response = await apiFetch<UserAccount[] | { data: UserAccount[] }>('/accounts', {
      method: 'GET',
      credentials: 'include',
    })
    
    // Handle both array and paginated response
    if (Array.isArray(response)) {
      return response
    }
    if (response && 'data' in response && Array.isArray(response.data)) {
      return response.data
    }
    
    // If response is empty or invalid, return empty array
    // Fallback will be handled by the store
    return []
  } catch (error) {
    // If endpoint doesn't exist (404) or backend doesn't support accounts yet,
    // return empty array - fallback will be handled by the store
    if (error instanceof ApiError && error.status === 404) {
      return []
    }
    
    // For other errors (401, 500, etc.), throw to be handled by caller
    throw error
  }
}

/**
 * Get account by ID
 * 
 * @param accountId - Account ID
 * @returns Account data
 * @throws ApiError if request fails
 */
export async function getAccountById(accountId: string): Promise<UserAccount> {
  try {
    const account = await apiFetch<UserAccount>(`/accounts/${accountId}`, {
      method: 'GET',
      credentials: 'include',
    })
    
    return account
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        throw new Error('Contul nu a fost găsit.')
      }
      if (error.status === 401 || error.status === 403) {
        throw new Error('Nu ai permisiunea de a vedea acest cont.')
      }
      throw new Error(error.message || 'Eroare la încărcarea contului.')
    }
    throw error
  }
}

/**
 * Create a new business account
 * 
 * @param input - Business account data
 * @returns Created business account
 * @throws ApiError if request fails
 * 
 * Note: Backend endpoint POST /accounts/business needs to be implemented
 */
export async function createBusinessAccount(input: CreateBusinessAccountInput): Promise<BusinessAccount> {
  try {
    const account = await apiFetch<BusinessAccount>('/accounts/business', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(input),
    })
    
    return account
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 400) {
        throw new Error('Date invalide. Verifică că toate câmpurile obligatorii sunt completate.')
      }
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a crea un cont business.')
      }
      if (error.status === 404) {
        // Endpoint doesn't exist yet - backend not ready
        throw new Error('Funcționalitatea de conturi business nu este disponibilă încă.')
      }
      throw new Error(error.message || 'Eroare la crearea contului business.')
    }
    throw error
  }
}

/**
 * Update an account
 * 
 * @param accountId - Account ID
 * @param input - Update data
 * @returns Updated account
 * @throws ApiError if request fails
 * 
 * Note: Backend endpoint PATCH /accounts/:id needs to be implemented
 */
export async function updateAccount(accountId: string, input: UpdateAccountInput): Promise<UserAccount> {
  try {
    const account = await apiFetch<UserAccount>(`/accounts/${accountId}`, {
      method: 'PATCH',
      credentials: 'include',
      body: JSON.stringify(input),
    })
    
    return account
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 400) {
        throw new Error('Date invalide. Verifică că toate câmpurile sunt corecte.')
      }
      if (error.status === 404) {
        throw new Error('Contul nu a fost găsit.')
      }
      if (error.status === 401 || error.status === 403) {
        throw new Error('Nu ai permisiunea de a actualiza acest cont.')
      }
      throw new Error(error.message || 'Eroare la actualizarea contului.')
    }
    throw error
  }
}

/**
 * Delete an account (soft delete)
 * 
 * @param accountId - Account ID
 * @throws ApiError if request fails
 * 
 * Note: Backend endpoint DELETE /accounts/:id needs to be implemented
 * NOTE: Personal accounts should not be deletable
 */
export async function deleteAccount(accountId: string): Promise<void> {
  try {
    await apiFetch<void>(`/accounts/${accountId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        throw new Error('Contul nu a fost găsit.')
      }
      if (error.status === 401 || error.status === 403) {
        throw new Error('Nu ai permisiunea de a șterge acest cont.')
      }
      throw new Error(error.message || 'Eroare la ștergerea contului.')
    }
    throw error
  }
}

