/**
 * Producer Upload API
 * 
 * API functions for uploading producer logo and cover images
 */

import { apiFetch, ApiError } from './client';

export interface ProducerUploadResponse {
  producer: {
    id: string;
    logoUrl?: string | null;
    coverImageUrl?: string | null;
    [key: string]: any;
  };
}

/**
 * Upload producer logo
 */
export async function uploadProducerLogo(file: File): Promise<ProducerUploadResponse> {
  const formData = new FormData();
  formData.append('producerLogo', file);

  try {
    const response = await apiFetch<ProducerUploadResponse>('/producers/me/logo', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 400) {
        throw new Error('Fișier imagine necesar');
      }
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat');
      }
      if (error.status === 404) {
        throw new Error('Profil producător negăsit');
      }
      throw new Error('Eroare la upload logo');
    }
    throw error;
  }
}

/**
 * Delete producer logo
 */
export async function deleteProducerLogo(): Promise<ProducerUploadResponse> {
  try {
    const response = await apiFetch<ProducerUploadResponse>('/producers/me/logo', {
      method: 'DELETE',
      credentials: 'include',
    });

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat');
      }
      if (error.status === 404) {
        throw new Error('Profil producător negăsit');
      }
      throw new Error('Eroare la ștergere logo');
    }
    throw error;
  }
}

/**
 * Upload producer cover image
 */
export async function uploadProducerCover(file: File): Promise<ProducerUploadResponse> {
  const formData = new FormData();
  formData.append('producerCover', file);

  try {
    const response = await apiFetch<ProducerUploadResponse>('/producers/me/cover', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 400) {
        throw new Error('Fișier imagine necesar');
      }
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat');
      }
      if (error.status === 404) {
        throw new Error('Profil producător negăsit');
      }
      throw new Error('Eroare la upload copertă');
    }
    throw error;
  }
}

/**
 * Delete producer cover image
 */
export async function deleteProducerCover(): Promise<ProducerUploadResponse> {
  try {
    const response = await apiFetch<ProducerUploadResponse>('/producers/me/cover', {
      method: 'DELETE',
      credentials: 'include',
    });

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new Error('Trebuie să fii autentificat');
      }
      if (error.status === 404) {
        throw new Error('Profil producător negăsit');
      }
      throw new Error('Eroare la ștergere copertă');
    }
    throw error;
  }
}

