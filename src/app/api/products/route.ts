/**
 * Products API Route
 * 
 * Next.js API route that proxies requests to the backend API
 * This route handles GET requests to /api/products
 */

import { NextRequest, NextResponse } from 'next/server'
import { getApiBaseUrl } from '@/lib/api/config'

const API_BASE_URL = getApiBaseUrl()
const DEFAULT_TIMEOUT = 30000

export async function GET(request: NextRequest) {
  try {
    // Get query parameters from the request
    const searchParams = request.nextUrl.searchParams
    const queryString = searchParams.toString()
    
    // Build the backend URL
    const backendUrl = `${API_BASE_URL}/public/products${queryString ? `?${queryString}` : ''}`
    
    // Forward cookies from the request
    const cookieHeader = request.headers.get('cookie') || ''
    
    // Build headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    // Forward cookies to backend
    if (cookieHeader) {
      headers['Cookie'] = cookieHeader
    }
    
    // Forward authorization header if present
    const authHeader = request.headers.get('authorization')
    if (authHeader) {
      headers['Authorization'] = authHeader
    }
    
    // Make request to backend with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT)
    
    try {
      const response = await fetch(backendUrl, {
        method: 'GET',
        headers,
        signal: controller.signal,
        cache: 'no-store',
      })
      
      clearTimeout(timeoutId)
      
      // Get response data
      const contentType = response.headers.get('content-type')
      let data: unknown
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        const text = await response.text()
        data = text || null
      }
      
      // Return response with same status code
      return NextResponse.json(data, {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (fetchError: unknown) {
      clearTimeout(timeoutId)
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: { message: 'Request timeout - backend server did not respond', status: 504 } },
          { status: 504 }
        )
      }
      
      throw fetchError
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('[API Route /api/products] Error:', error)
    }
    
    return NextResponse.json(
      { error: { message: errorMessage, status: 500 } },
      { status: 500 }
    )
  }
}

