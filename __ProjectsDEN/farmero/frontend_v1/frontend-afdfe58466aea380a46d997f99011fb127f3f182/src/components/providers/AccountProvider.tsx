/**
 * Account Provider
 * 
 * Context provider pentru gestionarea conturilor multiple (personal/business)
 * Încarcă accounts după login și setează activeAccount
 * Integrat cu AuthProvider pentru a accesa user-ul curent
 * 
 * COMPATIBILITY: Compatibil cu viitorul sistem Unified Login.
 * Depinde doar de `useAuth()` care returnează `isAuthenticated` și `user`.
 * Nu depinde de structura internă de autentificare.
 * 
 * See: docs/UNIFIED_LOGIN_COMPATIBILITY.md for compatibility details
 */

'use client'

import { createContext, useContext, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/auth/context'
import { useAccountStore, useActiveAccount } from '@/lib/store/account'
import { useFavoritesStore } from '@/lib/store/favorites'
import type { UserAccount } from '@/lib/types/domain'

// ============================================================================
// Types
// ============================================================================

interface AccountContextType {
  // State
  accounts: UserAccount[]
  activeAccount: UserAccount | null
  activeAccountId: string | null
  isLoading: boolean
  error: string | null
  
  // Actions
  switchAccount: (accountId: string) => void
  refreshAccounts: () => Promise<void>
}

// ============================================================================
// Context
// ============================================================================

const AccountContext = createContext<AccountContextType | undefined>(undefined)

// ============================================================================
// Provider
// ============================================================================

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const { accounts, activeAccountId, status, error, loadAccounts, setActiveAccount } = useAccountStore()
  const { loadFavorites } = useFavoritesStore()
  const activeAccount = useActiveAccount()

  /**
   * Load accounts and favorites when user is authenticated
   */
  useEffect(() => {
    if (isAuthenticated && user) {
      loadAccounts({
        id: user.id,
        fullName: user.fullName,
        name: user.fullName, // Use fullName as name since AuthUser doesn't have name property
        email: user.email,
      })
      // Load favorites
      loadFavorites()
    } else {
      // Reset accounts and favorites on logout
      useAccountStore.getState().reset()
      useFavoritesStore.getState().reset()
    }
  }, [isAuthenticated, user, loadAccounts, loadFavorites])

  /**
   * Switch to a different account
   */
  const switchAccount = useCallback((accountId: string) => {
    setActiveAccount(accountId)
  }, [setActiveAccount])

  /**
   * Refresh accounts from backend
   */
  const refreshAccounts = useCallback(async () => {
    if (user) {
      await loadAccounts({
        id: user.id,
        fullName: user.fullName,
        name: user.fullName, // Use fullName as name since AuthUser doesn't have name property
        email: user.email,
      })
    }
  }, [user, loadAccounts])

  const value: AccountContextType = {
    accounts,
    activeAccount,
    activeAccountId,
    isLoading: status === 'loading',
    error,
    switchAccount,
    refreshAccounts,
  }

  return (
    <AccountContext.Provider value={value}>
      {children}
    </AccountContext.Provider>
  )
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to use account context
 * 
 * @throws Error if used outside AccountProvider
 */
export function useAccount(): AccountContextType {
  const context = useContext(AccountContext)
  if (context === undefined) {
    throw new Error('useAccount must be used within AccountProvider')
  }
  return context
}

