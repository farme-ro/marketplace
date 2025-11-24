/**
 * Producer Profile API
 * 
 * API functions for producer profile management
 * Uses apiFetch to call https://api.farme.ro
 */

import { apiFetch, ApiError } from '../client'

// ============================================================================
// Types
// ============================================================================

export type ProducerProfile = {
  id: string
  name: string // Brand/fermă name
  slug: string
  description?: string // Short description
  storyFull?: string // Long description/story
  location?: {
    county?: string // Județ
    city?: string // Localitate
    address?: string
  }
  contact?: {
    phone?: string
    email?: string
    website?: string
  }
  socialMedia?: {
    facebook?: string
    instagram?: string
    website?: string
  }
  logoUrl?: string
  coverImageUrl?: string
  isVerified?: boolean
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export type UpdateProducerProfilePayload = {
  name?: string
  description?: string
  storyFull?: string
  location?: {
    county?: string
    city?: string
    address?: string
  }
  contact?: {
    phone?: string
    email?: string
    website?: string
  }
  socialMedia?: {
    facebook?: string
    instagram?: string
    website?: string
  }
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Get producer profile
 * 
 * @returns Producer profile data
 * @throws ApiError if request fails
 * 
 * Note: Backend endpoint GET /producers/me needs to be implemented
 */
export async function getProducerProfile(): Promise<ProducerProfile | null> {
  try {
    const profile = await apiFetch<ProducerProfile>('/producers/me', {
      method: 'GET',
      credentials: 'include',
    })
    
    return profile
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        // Endpoint doesn't exist yet - return null
        return null
      }
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a vedea profilul.')
      }
      throw new Error(error.message || 'Eroare la încărcarea profilului.')
    }
    throw error
  }
}

/**
 * Update producer profile
 * 
 * @param payload - Profile update data
 * @returns Updated profile
 * @throws ApiError if request fails
 * 
 * Note: Backend endpoint PATCH /producers/me needs to be implemented
 */
export async function updateProducerProfile(payload: UpdateProducerProfilePayload): Promise<ProducerProfile> {
  try {
    const profile = await apiFetch<ProducerProfile>('/producers/me', {
      method: 'PATCH',
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    
    return profile
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
 * Upload producer logo
 * 
 * @param file - Logo file
 * @returns Logo URL
 * @throws ApiError if request fails
 * 
 * Note: Backend endpoint POST /producers/me/logo needs to be implemented
 */
export async function uploadProducerLogo(file: File): Promise<string> {
  try {
    const formData = new FormData()
    formData.append('logo', file)
    
    const response = await apiFetch<{ url: string }>('/producers/me/logo', {
      method: 'POST',
      credentials: 'include',
      body: formData,
      // Don't set Content-Type header - browser will set it with boundary
      headers: {},
    })
    
    return response.url
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        throw new Error('Funcționalitatea de upload logo nu este disponibilă încă.')
      }
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a încărca logo.')
      }
      if (error.status === 400) {
        throw new Error('Fișier invalid. Verifică că este o imagine validă.')
      }
      throw new Error(error.message || 'Eroare la încărcarea logo-ului.')
    }
    throw error
  }
}

/**
 * Upload producer cover image
 * 
 * @param file - Cover image file
 * @returns Cover image URL
 * @throws ApiError if request fails
 * 
 * Note: Backend endpoint POST /producers/me/cover needs to be implemented
 */
export async function uploadProducerCover(file: File): Promise<string> {
  try {
    const formData = new FormData()
    formData.append('cover', file)
    
    const response = await apiFetch<{ url: string }>('/producers/me/cover', {
      method: 'POST',
      credentials: 'include',
      body: formData,
      headers: {},
    })
    
    return response.url
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) {
        throw new Error('Funcționalitatea de upload cover nu este disponibilă încă.')
      }
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat pentru a încărca cover.')
      }
      if (error.status === 400) {
        throw new Error('Fișier invalid. Verifică că este o imagine validă.')
      }
      throw new Error(error.message || 'Eroare la încărcarea cover-ului.')
    }
    throw error
  }
}

