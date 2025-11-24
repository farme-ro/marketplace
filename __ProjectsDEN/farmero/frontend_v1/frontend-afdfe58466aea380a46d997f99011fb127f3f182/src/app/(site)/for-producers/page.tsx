/**
 * For Producers Redirect
 * 
 * Redirect permanent către pagina canonică /pentru-producatori
 */

import { redirect } from 'next/navigation'

export default function ForProducersRedirect() {
  redirect('/pentru-producatori')
}
