/**
 * Account Store
 * 
 * Zustand store pentru gestionarea conturilor multiple (personal/business)
 * Integrat cu API backend (api.farme.ro - repo separat) pentru multi-account
 * Folosește fallback la PersonalAccount generat local când backend nu suportă încă
 * 
 * IMPORTANT: Backend-ul este într-un repo separat.
 * Acest store folosește API contracts și fallback-uri.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import * as accountsApi from '@/lib/api/accounts'
import type { UserAccount, PersonalAccount } from '@/lib/types/domain'

// ============================================================================
// Types
// ============================================================================

interface AccountStore {
  // State
  accounts: UserAccount[]
  activeAccountId: string | null
  status: 'idle' | 'loading' | 'error'
  error: string | null
  
  // Actions
  loadAccounts: (user?: { id: string; fullName?: string; name?: string; email: string }) => Promise<void>
  setActiveAccount: (accountId: string) => void
  addAccount: (account: UserAccount) => void
  updateAccount: (accountId: string, updates: Partial<UserAccount>) => void
  removeAccount: (accountId: string) => void
  reset: () => void
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Get default account ID from accounts list
 * Priority: isDefault flag > first account > null
 */
function getDefaultAccountId(accounts: UserAccount[]): string | null {
  if (accounts.length === 0) return null
  
  const defaultAccount = accounts.find(acc => acc.isDefault)
  if (defaultAccount) return defaultAccount.id
  
  return accounts[0]?.id || null
}

// ============================================================================
// Store
// ============================================================================

export const useAccountStore = create<AccountStore>()(
  persist(
    (set, get) => ({
      accounts: [],
      activeAccountId: null,
      status: 'idle',
      error: null,

      /**
       * Load accounts from backend
       * 
       * FALLBACK: If backend doesn't support accounts yet (404), generates
       * a PersonalAccount from user profile and sets it as active.
       */
      loadAccounts: async (user) => {
        set({ status: 'loading', error: null })
        
        try {
          // Try to load from backend
          const accounts = await accountsApi.getAccounts()
          
          if (accounts.length > 0) {
            // Backend supports accounts - use them
            const defaultId = getDefaultAccountId(accounts)
            set({
              accounts,
              activeAccountId: defaultId,
              status: 'idle',
              error: null,
            })
          } else if (user) {
            // Backend doesn't support accounts yet (empty array) - generate fallback
            const personalAccount = accountsApi.generatePersonalAccountFromUser(user)
            set({
              accounts: [personalAccount],
              activeAccountId: personalAccount.id,
              status: 'idle',
              error: null,
            })
          } else {
            // No user and no accounts - reset
            set({
              accounts: [],
              activeAccountId: null,
              status: 'idle',
              error: null,
            })
          }
        } catch (error) {
          // If backend error (not 404), try fallback if user is available
          if (user) {
            const personalAccount = accountsApi.generatePersonalAccountFromUser(user)
            set({
              accounts: [personalAccount],
              activeAccountId: personalAccount.id,
              status: 'idle',
              error: null,
            })
          } else {
            if (process.env.NODE_ENV === 'development') {
              // eslint-disable-next-line no-console
              console.error('[Account Store] Failed to load accounts:', error)
            }
            set({
              status: 'error',
              error: error instanceof Error ? error.message : 'Eroare la încărcarea conturilor',
            })
          }
        }
      },

      /**
       * Set active account
       */
      setActiveAccount: (accountId: string) => {
        const { accounts } = get()
        const account = accounts.find(acc => acc.id === accountId)
        
        if (!account) {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.warn(`[Account Store] Account ${accountId} not found`)
          }
          return
        }
        
        set({ activeAccountId: accountId })
      },

      /**
       * Add a new account (e.g., after creating business account)
       */
      addAccount: (account: UserAccount) => {
        const { accounts } = get()
        set({
          accounts: [...accounts, account],
        })
        
        // If this is the first account or it's marked as default, set it as active
        if (accounts.length === 0 || account.isDefault) {
          set({ activeAccountId: account.id })
        }
      },

      /**
       * Update an account
       */
      updateAccount: (accountId: string, updates: Partial<UserAccount>) => {
        const { accounts } = get()
        set({
          accounts: accounts.map(acc =>
            acc.id === accountId ? { ...acc, ...updates } : acc
          ),
        })
      },

      /**
       * Remove an account
       * NOTE: Personal accounts should not be removable
       */
      removeAccount: (accountId: string) => {
        const { accounts, activeAccountId } = get()
        
        // Don't allow removing personal accounts
        const account = accounts.find(acc => acc.id === accountId)
        if (account?.type === 'personal') {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.warn('[Account Store] Cannot remove personal account')
          }
          return
        }
        
        const updatedAccounts = accounts.filter(acc => acc.id !== accountId)
        const newActiveId = activeAccountId === accountId
          ? getDefaultAccountId(updatedAccounts)
          : activeAccountId
        
        set({
          accounts: updatedAccounts,
          activeAccountId: newActiveId,
        })
      },

      /**
       * Reset store (e.g., on logout)
       */
      reset: () => {
        set({
          accounts: [],
          activeAccountId: null,
          status: 'idle',
          error: null,
        })
      },
    }),
    {
      name: 'account-storage',
      // Only persist accounts and activeAccountId, not status/error
      partialize: (state) => ({
        accounts: state.accounts,
        activeAccountId: state.activeAccountId,
      }),
    }
  )
)

// ============================================================================
// Selectors & Hooks
// ============================================================================

/**
 * Get active account
 */
export const useActiveAccount = (): UserAccount | null => {
  return useAccountStore((state) => {
    if (!state.activeAccountId) return null
    return state.accounts.find(acc => acc.id === state.activeAccountId) || null
  })
}

/**
 * Get all accounts
 */
export const useAccounts = (): UserAccount[] => {
  return useAccountStore((state) => state.accounts)
}

/**
 * Get personal account (always exists)
 */
export const usePersonalAccount = (): PersonalAccount | null => {
  return useAccountStore((state) => {
    return state.accounts.find(acc => acc.type === 'personal') as PersonalAccount | undefined || null
  })
}

/**
 * Get business accounts
 */
export const useBusinessAccounts = (): UserAccount[] => {
  return useAccountStore((state) => {
    return state.accounts.filter(acc => acc.type === 'business')
  })
}

