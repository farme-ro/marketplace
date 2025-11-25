/**
 * AI Assistant API
 * 
 * API functions for AI Assistant interactions
 */

import { apiFetch, ApiError } from './client'
import { isBackendSyncEnabled } from '@/lib/backend-sync/status'

// ============================================================================
// Types
// ============================================================================

export type AiRole = 'client' | 'producer' | 'support' | 'admin'

export interface AiContext {
  role: AiRole
  locale: string
  page?: string
  userId?: string
  metadata?: Record<string, any>
}

export interface SuggestedLink {
  url: string
  label: string
}

export interface AiAssistantResponse {
  answer: string
  suggestedLinks?: SuggestedLink[]
}

export interface AiInteraction {
  id: string
  userId?: string
  role: AiRole
  context: Record<string, any>
  question: string
  answer: string
  suggestedLinks?: SuggestedLink[]
  createdAt: string
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Send AI assistant message
 */
export async function sendAiMessage(
  context: AiContext,
  message: string
): Promise<AiAssistantResponse> {
  if (!isBackendSyncEnabled('aiAssistant')) {
    // Return fallback response
    return {
      answer:
        context.locale === 'ro'
          ? 'Te rugăm să revii, asistentul este temporar indisponibil. Poți găsi răspunsuri în secțiunea de întrebări frecvente.'
          : 'Please come back later, the assistant is temporarily unavailable. You can find answers in the FAQ section.',
      suggestedLinks: [
        { url: '/intrebari-frecvente', label: context.locale === 'ro' ? 'FAQ' : 'FAQ' },
        { url: '/contact', label: context.locale === 'ro' ? 'Contact' : 'Contact' },
      ],
    }
  }

  try {
    const response = await apiFetch<{ success: boolean; data: AiAssistantResponse }>(
      '/ai/assistant',
      {
        method: 'POST',
        body: JSON.stringify({
          context,
          message,
        }),
      }
    )

    if (!response.success || !response.data) {
      throw new ApiError('Failed to get AI response', 500)
    }

    return response.data
  } catch (error) {
    // Return fallback response on error
    console.warn('[AI Assistant] Failed to send message:', error)
    return {
      answer:
        context.locale === 'ro'
          ? 'Te rugăm să revii, asistentul este temporar indisponibil. Poți găsi răspunsuri în secțiunea de întrebări frecvente.'
          : 'Please come back later, the assistant is temporarily unavailable. You can find answers in the FAQ section.',
      suggestedLinks: [
        { url: '/intrebari-frecvente', label: context.locale === 'ro' ? 'FAQ' : 'FAQ' },
        { url: '/contact', label: context.locale === 'ro' ? 'Contact' : 'Contact' },
      ],
    }
  }
}

