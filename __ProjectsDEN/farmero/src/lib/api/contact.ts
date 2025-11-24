/**
 * Contact API
 * 
 * API functions for contact form
 */

import { apiFetch, ApiError } from './client';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

/**
 * Submit contact form
 */
export async function submitContactForm(data: ContactFormData): Promise<ContactResponse> {
  try {
    const response = await apiFetch<ContactResponse>('/contact', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 400) {
        throw new Error('Date invalide. Verifică că toate câmpurile sunt completate corect.');
      }
      throw new Error('Eroare la trimiterea mesajului. Te rugăm să încerci din nou.');
    }
    throw error;
  }
}

