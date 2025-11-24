/**
 * Public Regions API
 * 
 * Funcții pentru apeluri către endpoint-urile publice de regiuni
 * Folosește request() din apiClient.ts
 */

import { get } from '../apiClient'

export interface Region {
  id: string
  name: string
  code: string | null
  type: 'COUNTY' | 'REGION'
}

export interface RegionsResponse {
  regions: Region[]
}

/**
 * Obține lista de regiuni
 * 
 * @returns Lista de regiuni
 * @throws Error dacă apare o eroare
 */
export async function getRegions(): Promise<Region[]> {
  // IMPORTANT: Apelează direct backend-ul (api.farme.ro), NU Next.js API route
  // URL-ul '/regions' va fi rezolvat la NEXT_PUBLIC_API_URL/regions
  try {
    const response = await get<RegionsResponse>('/regions')
    
    if (response.error) {
      // Pentru erori de rețea (status 0) sau backend indisponibil, returnează array gol
      // Nu logăm aceste erori - sunt așteptate când backend-ul local nu rulează
      if (response.error.status === 0 || response.error.message?.includes('network') || response.error.message?.includes('Network')) {
        // Silently return empty array - expected when local backend isn't running
        return []
      }
      
      // Pentru 401 (Unauthorized) - endpoint-ul ar trebui să fie public
      // Poate că backend-ul cere autentificare sau ruta este greșită
      if (response.error.status === 401) {
        return []
      }
      
      // Pentru 404 (Not Found) - ruta nu există pe backend
      if (response.error.status === 404) {
        return []
      }
      
      // Only log unexpected errors
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn('[getRegions] Unexpected error:', response.error)
      }
      
      const errorMessage = response.error.message || 'Eroare la încărcarea regiunilor'
      throw new Error(errorMessage)
    }
    
    return response.data?.regions || []
  } catch (error) {
    // Pentru erori de rețea sau backend indisponibil, returnează array gol
    // în loc să arunce eroare care ar putea afecta rendering-ul paginii
    // Nu logăm aceste erori - sunt așteptate când backend-ul local nu rulează
    if (error instanceof Error && (error.message.includes('network') || error.message.includes('Network') || error.message.includes('fetch') || error.message.includes('CONNECTION_REFUSED'))) {
      // Silently return empty array - expected when local backend isn't running
      return []
    }
    
    // Only log unexpected errors
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn('[getRegions] Unexpected error:', error)
    }
    
    throw error
  }
}

