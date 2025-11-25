/**
 * Producer Subscription Redirect
 * 
 * Redirect permanent către pagina canonică /portal-producatori/abonamente
 */

import { redirect } from 'next/navigation'

export default function ProducerSubscriptionRedirect() {
  redirect('/portal-producatori/abonamente')
}

