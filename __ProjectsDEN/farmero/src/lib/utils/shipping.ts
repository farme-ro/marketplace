/**
 * Shipping Cost Calculation
 * 
 * Calculează costul de transport bazat pe totalul comenzii
 * 
 * NOTĂ: În viitor, calculul va fi integrat cu backend pentru calcul dinamic
 * bazat pe adresă și tipul de livrare. Momentan folosește o logică simplă:
 * - Transport gratuit pentru comenzi peste 200 lei
 * - Cost standard de 15 lei pentru comenzi sub 200 lei
 */

import type { Locale } from '@/lib/i18n/context'
import { formatCurrency } from './format'

/**
 * Calculate shipping cost based on order total
 * 
 * @param orderTotal - Totalul comenzii în lei
 * @returns Costul de transport în lei
 */
export function calculateShippingCost(orderTotal: number): number {
  // Transport gratuit pentru comenzi peste 200 lei
  const FREE_SHIPPING_THRESHOLD = 200
  
  // Cost standard de transport
  const STANDARD_SHIPPING_COST = 15

  if (orderTotal >= FREE_SHIPPING_THRESHOLD) {
    return 0
  }

  return STANDARD_SHIPPING_COST
}

/**
 * Get shipping cost message
 * 
 * @param orderTotal - Totalul comenzii în lei
 * @param locale - Locale code for formatting (default: 'ro')
 * @returns Mesaj despre transport
 */
export function getShippingMessage(orderTotal: number, locale: Locale = 'ro'): string {
  const FREE_SHIPPING_THRESHOLD = 200
  const remaining = FREE_SHIPPING_THRESHOLD - orderTotal

  if (orderTotal >= FREE_SHIPPING_THRESHOLD) {
    return 'Transport gratuit'
  }

  if (remaining > 0) {
    return `Adaugă ${formatCurrency(remaining, locale)} pentru transport gratuit`
  }

  return 'Transport standard'
}

