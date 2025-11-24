/**
 * Producer Promotion Page - Redirect
 * 
 * Redirect către /portal-producatori/marketing-promovare
 * Această pagină există pentru compatibilitate cu link-uri vechi.
 */

import { redirect } from 'next/navigation'

export default function ProducerPromotionPage() {
  redirect('/portal-producatori/marketing-promovare')
}

