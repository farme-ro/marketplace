/**
 * Robots.txt Generator
 * 
 * Generates robots.txt for SEO
 * Blocks portal routes from indexing
 */

import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://farme.ro'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          // Portal routes - should not be indexed
          '/portal-producatori/',
          '/portal-business/',
          '/portal-logistica/',
          '/portal-investitori/',
          '/portal-importatori/',
          // Legacy portal routes (redirected)
          '/producer-portal/',
          '/business-portal/',
          '/logistics-portal/',
          '/investor-portal/',
          '/importer-portal/',
          '/admin/',
          '/dashboard/',
          // API routes
          '/api/',
          // Internal/utility routes
          '/status/',
          '/backend-test/',
          '/select-account/',
          // Checkout and cart (sensitive)
          '/checkout/',
          '/cart/',
          '/orders/',
          '/account/',
          // Thank you page (no need to index)
          '/thank-you/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

