/**
 * Growth Hooks
 * 
 * React hooks for growth engine (nudges, context)
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { getEligibleNudges, type GetEligibleNudgesContext, type EligibleNudge } from '@/lib/api/growth'
import { useAuth } from '@/lib/auth/context'
import { useCartStore } from '@/lib/store/cart'

/**
 * Hook to get eligible nudges for current user context
 */
export function useGrowthNudges(context: Partial<GetEligibleNudgesContext> = {}) {
  const { user } = useAuth()
  const { items: cartItems } = useCartStore()
  const [nudges, setNudges] = useState<EligibleNudge[]>([])
  const [loading, setLoading] = useState(false)

  // Memoize context to prevent unnecessary re-renders
  const contextString = useMemo(() => JSON.stringify(context), [context])

  const loadNudges = useCallback(async () => {
    setLoading(true)
    try {
      const parsedContext = contextString ? JSON.parse(contextString) : {}
      const fullContext: GetEligibleNudgesContext = {
        userId: user?.id,
        role: user?.role,
        cartItemsCount: cartItems.length,
        ...parsedContext,
      }

      const eligibleNudges = await getEligibleNudges(fullContext)
      setNudges(eligibleNudges)
    } catch (error) {
      console.warn('[Growth Hooks] Failed to load nudges:', error)
      setNudges([])
    } finally {
      setLoading(false)
    }
  }, [user?.id, user?.role, cartItems.length, contextString])

  useEffect(() => {
    loadNudges()
  }, [loadNudges])

  return {
    nudges,
    loading,
    refresh: loadNudges,
  }
}

/**
 * Hook to get nudges for a specific page
 */
export function usePageNudges(page: string) {
  return useGrowthNudges({ page })
}

