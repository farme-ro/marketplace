/**
 * Account Switcher Component
 * 
 * Component UI pentru schimbarea între conturi (personal/business)
 * Afișează contul activ și permite comutarea între conturi
 * Integrat cu AccountProvider
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount } from '@/components/providers/AccountProvider'
import { useAuth } from '@/lib/auth/context'
import { useI18n } from '@/lib/i18n/context'
import { cn } from '@/lib/utils/cn'
import { User, Building2, ChevronDown, Plus, Check } from 'lucide-react'
import type { UserAccount } from '@/lib/types/domain'

export function AccountSwitcher() {
  const { isAuthenticated, role } = useAuth()
  const { accounts, activeAccount, switchAccount, isLoading, error } = useAccount()
  const { t } = useI18n()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isAuthenticated || role !== 'client' || !isOpen) {
      return
    }

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, isAuthenticated, role])

  // Close dropdown on Escape key
  useEffect(() => {
    if (!isAuthenticated || role !== 'client' || !isOpen) {
      return
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, isAuthenticated, role])

  // Don't render if not authenticated or not a client
  if (!isAuthenticated || role !== 'client') {
    return null
  }

  const handleSwitchAccount = (accountId: string) => {
    switchAccount(accountId)
    setIsOpen(false)
  }

  const handleAddBusinessAccount = () => {
    setIsOpen(false)
    // Note: Business account creation page will be implemented in the future
    // For now, redirects to placeholder route
    router.push('/account/business/new')
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground">
        <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        <span className="text-sm hidden sm:inline">{t('account.loading', 'Se încarcă conturile...')}</span>
      </div>
    )
  }

  // Error state (still show switcher if we have fallback account)
  if (error && !activeAccount) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground">
        <span className="text-sm hidden sm:inline">{t('account.error', 'Eroare la încărcarea conturilor')}</span>
      </div>
    )
  }

  // No active account (shouldn't happen, but handle gracefully)
  if (!activeAccount) {
    return null
  }

  const isPersonal = activeAccount.type === 'personal'
  const AccountIcon = isPersonal ? User : Building2

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-colors',
          'border border-border',
          isOpen && 'bg-muted'
        )}
        aria-label={t('account.switchAccount', 'Schimbă contul activ')}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls="account-switcher-menu"
      >
        <AccountIcon className="w-4 h-4" />
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium">
            {activeAccount.name}
          </div>
          <div className="text-xs text-muted-foreground">
            {isPersonal 
              ? t('account.personal', 'Personal')
              : t('account.business', 'Business')
            }
          </div>
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div
          id="account-switcher-menu"
          role="menu"
          className="absolute right-0 mt-2 w-64 bg-background border border-border rounded-lg shadow-lg z-50 overflow-hidden"
          aria-label={t('account.accountMenu', 'Meniu conturi')}
        >
          <div className="p-2">
            {/* Active Account Header */}
            <div className="px-3 py-2 mb-2 border-b border-border">
              <div className="text-xs font-medium text-muted-foreground mb-1">
                {t('account.activeAccount', 'Cont activ')}
              </div>
              <div className="flex items-center gap-2">
                <AccountIcon className="w-4 h-4 text-primary" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {activeAccount.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {isPersonal 
                      ? t('account.personal', 'Personal')
                      : t('account.business', 'Business')
                    }
                  </div>
                </div>
                <Check className="w-4 h-4 text-primary" />
              </div>
            </div>

            {/* Accounts List */}
            {accounts.length > 1 && (
              <div className="space-y-1">
                {accounts
                  .filter(acc => acc.id !== activeAccount.id)
                  .map((account) => {
                    const isAccountPersonal = account.type === 'personal'
                    const AccountItemIcon = isAccountPersonal ? User : Building2
                    
                    return (
                      <button
                        key={account.id}
                        onClick={() => handleSwitchAccount(account.id)}
                        role="menuitem"
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      >
                        <AccountItemIcon className="w-4 h-4 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {account.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {isAccountPersonal 
                              ? t('account.personal', 'Personal')
                              : t('account.business', 'Business')
                            }
                          </div>
                        </div>
                      </button>
                    )
                  })}
              </div>
            )}

            {/* Add Business Account Button */}
            <div className="mt-2 pt-2 border-t border-border">
              <button
                onClick={handleAddBusinessAccount}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-muted transition-colors text-primary"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {t('account.addBusinessAccount', 'Adaugă cont business')}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

