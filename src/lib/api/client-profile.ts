/**
 * Client Profile API
 * 
 * API functions for client profile and account management
 * Uses apiFetch to call https://api.farme.ro
 */

import { apiFetch, ApiError } from './client'
import { isBackendSyncEnabled } from '@/lib/backend-sync/status'
import type { ClientUser } from './auth'

// ============================================================================
// Types
// ============================================================================

export type UpdateClientProfilePayload = {
  fullName?: string
  phoneNumber?: string
}

export type ShippingAddress = {
  id?: string
  name: string
  phone: string
  email?: string
  city: string
  address: string
  postalCode?: string
  notes?: string
  isDefault?: boolean
}

export type CreateShippingAddressPayload = Omit<ShippingAddress, 'id'>
export type UpdateShippingAddressPayload = Partial<CreateShippingAddressPayload>

// ============================================================================
// API Functions
// ============================================================================

/**
 * Update client profile
 * 
 * @param payload - Profile update data
 * @returns Updated client user
 * @throws ApiError if request fails
 */
export async function updateClientProfile(payload: UpdateClientProfilePayload): Promise<ClientUser> {
  if (!isBackendSyncEnabled('clientProfile')) {
    throw new Error('Funcționalitatea de actualizare profil nu este disponibilă încă.')
  }

  try {
    const user = await apiFetch<ClientUser>('/clients/me', {
      method: 'PATCH',
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    
    return user
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        throw new Error('Funcționalitatea de actualizare profil nu este disponibilă încă.')
      }
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a actualiza profilul.')
      }
      if (error.status === 400) {
        throw new Error('Date invalide. Verifică că toate câmpurile sunt completate corect.')
      }
      throw new Error(error.message || 'Eroare la actualizarea profilului.')
    }
    throw error
  }
}

/**
 * Get client shipping addresses
 * 
 * @returns List of shipping addresses
 * @throws ApiError if request fails
 */
export async function getClientAddresses(): Promise<ShippingAddress[]> {
  if (!isBackendSyncEnabled('clientAddresses')) {
    return [] // Return empty array if feature is not enabled
  }

  try {
    const addresses = await apiFetch<ShippingAddress[] | { data: ShippingAddress[] }>('/clients/addresses', {
      method: 'GET',
      credentials: 'include',
    })
    
    // Handle both array and paginated response
    if (Array.isArray(addresses)) {
      return addresses
    }
    if (addresses && 'data' in addresses) {
      return addresses.data
    }
    
    return []
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        // Endpoint doesn't exist yet - return empty array
        return []
      }
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a vedea adresele.')
      }
      throw new Error(error.message || 'Eroare la încărcarea adreselor.')
    }
    throw error
  }
}

/**
 * Create shipping address
 * 
 * @param payload - Address data
 * @returns Created address
 * @throws ApiError if request fails
 */
export async function createShippingAddress(payload: CreateShippingAddressPayload): Promise<ShippingAddress> {
  if (!isBackendSyncEnabled('clientAddresses')) {
    throw new Error('Funcționalitatea de adăugare adresă nu este disponibilă încă.')
  }

  try {
    const address = await apiFetch<ShippingAddress>('/clients/addresses', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    
    return address
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        throw new Error('Funcționalitatea de adăugare adresă nu este disponibilă încă.')
      }
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a adăuga o adresă.')
      }
      if (error.status === 400) {
        throw new Error('Date invalide. Verifică că toate câmpurile sunt completate corect.')
      }
      throw new Error(error.message || 'Eroare la adăugarea adresei.')
    }
    throw error
  }
}

/**
 * Update shipping address
 * 
 * @param addressId - Address ID
 * @param payload - Address update data
 * @returns Updated address
 * @throws ApiError if request fails
 */
export async function updateShippingAddress(
  addressId: string,
  payload: UpdateShippingAddressPayload
): Promise<ShippingAddress> {
  if (!isBackendSyncEnabled('clientAddresses')) {
    throw new Error('Funcționalitatea de actualizare adresă nu este disponibilă încă.')
  }

  try {
    const address = await apiFetch<ShippingAddress>(`/clients/addresses/${addressId}`, {
      method: 'PATCH',
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    
    return address
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        throw new Error('Funcționalitatea de actualizare adresă nu este disponibilă încă.')
      }
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a actualiza adresa.')
      }
      if (error.status === 400) {
        throw new Error('Date invalide. Verifică că toate câmpurile sunt completate corect.')
      }
      throw new Error(error.message || 'Eroare la actualizarea adresei.')
    }
    throw error
  }
}

/**
 * Delete shipping address
 * 
 * @param addressId - Address ID
 * @throws ApiError if request fails
 */
export async function deleteShippingAddress(addressId: string): Promise<void> {
  if (!isBackendSyncEnabled('clientAddresses')) {
    throw new Error('Funcționalitatea de ștergere adresă nu este disponibilă încă.')
  }

  try {
    await apiFetch<void>(`/clients/addresses/${addressId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        throw new Error('Funcționalitatea de ștergere adresă nu este disponibilă încă.')
      }
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a șterge adresa.')
      }
      throw new Error(error.message || 'Eroare la ștergerea adresei.')
    }
    throw error
  }
}

/**
 * Set default shipping address
 * 
 * @param addressId - Address ID
 * @returns Updated address
 * @throws ApiError if request fails
 */
export async function setDefaultShippingAddress(addressId: string): Promise<ShippingAddress> {
  if (!isBackendSyncEnabled('clientAddresses')) {
    throw new Error('Funcționalitatea de setare adresă principală nu este disponibilă încă.')
  }

  try {
    const address = await apiFetch<ShippingAddress>(`/clients/addresses/${addressId}/default`, {
      method: 'PATCH',
      credentials: 'include',
    })
    
    return address
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        throw new Error('Funcționalitatea de setare adresă principală nu este disponibilă încă.')
      }
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a seta adresa principală.')
      }
      throw new Error(error.message || 'Eroare la setarea adresei principale.')
    }
    throw error
  }
}

