/**
 * Cum Funcționează Redirect
 * 
 * Redirect permanent către pagina canonică /cum-functioneaza-si-impact
 */

import { redirect } from 'next/navigation'

export default function CumFunctioneazaRedirect() {
  redirect('/cum-functioneaza-si-impact')
}
