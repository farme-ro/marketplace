/**
 * Producer Support API
 * 
 * API functions for producer support tickets
 * Uses apiFetch to call https://api.farme.ro
 */

import { apiFetch, ApiError } from '../client'

// ============================================================================
// Types
// ============================================================================

export type SupportTicketSubject = 
  | 'order_issues'
  | 'payment_issues'
  | 'product_issues'
  | 'suggestions'
  | 'other'

export type SupportTicketPriority = 'normal' | 'high'

export type SupportTicketPayload = {
  subject: SupportTicketSubject
  priority: SupportTicketPriority
  description: string
  attachmentUrl?: string
}

export type SupportTicket = {
  id: string
  subject: SupportTicketSubject
  priority: SupportTicketPriority
  description: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  createdAt: string
  updatedAt?: string
  response?: string
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Submit support ticket
 * 
 * @param payload - Ticket data
 * @returns Created ticket
 * @throws ApiError if request fails
 * 
 * Note: Backend endpoint POST /support/producer needs to be implemented
 */
export async function submitSupportTicket(payload: SupportTicketPayload): Promise<SupportTicket> {
  try {
    const ticket = await apiFetch<SupportTicket>('/support/producer', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    
    return ticket
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        // Endpoint doesn't exist yet - throw user-friendly error
        throw new Error('Momentan, cererea ta nu poate fi trimisă automat. Te rugăm să ne scrii la contact@farme.ro.')
      }
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a trimite un ticket de suport.')
      }
      if (error.status === 400) {
        throw new Error('Date invalide. Verifică că toate câmpurile sunt completate corect.')
      }
      throw new Error(error.message || 'Eroare la trimiterea ticket-ului de suport.')
    }
    throw error
  }
}

/**
 * Get support tickets
 * 
 * @returns List of support tickets
 * @throws ApiError if request fails
 * 
 * Note: Backend endpoint GET /support/producer needs to be implemented
 */
export async function getSupportTickets(): Promise<SupportTicket[]> {
  try {
    const tickets = await apiFetch<SupportTicket[] | { data: SupportTicket[] }>('/support/producer', {
      method: 'GET',
      credentials: 'include',
    })
    
    // Handle both array and paginated response
    if (Array.isArray(tickets)) {
      return tickets
    }
    if (tickets && 'data' in tickets) {
      return tickets.data
    }
    
    return []
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        // Endpoint doesn't exist yet - return empty array
        return []
      }
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a vedea ticket-urile de suport.')
      }
      throw new Error(error.message || 'Eroare la încărcarea ticket-urilor de suport.')
    }
    throw error
  }
}

