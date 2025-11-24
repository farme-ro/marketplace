/**
 * Admin Authentication API
 * 
 * Handles login, logout, and session management for admin users
 */

import { apiFetch } from './client'
import type { AdminMe, AdminUser } from './types'

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: AdminUser
}

/**
 * Login as admin
 * 
 * @param credentials - Email and password
 * @returns User data and token
 */
export async function loginAdmin(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

/**
 * Logout current admin
 */
export async function logoutAdmin(): Promise<void> {
  await apiFetch('/auth/logout', {
    method: 'POST',
  })
}

/**
 * Get current admin user
 * 
 * @returns Current admin user data
 * @throws ApiError if not authenticated
 */
export async function getCurrentAdmin(): Promise<AdminMe> {
  return apiFetch<AdminMe>('/auth/me')
}

