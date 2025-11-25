/**
 * How It Works Redirect
 * 
 * Redirect permanent către pagina canonică /cum-functioneaza-si-impact
 */

import { redirect } from 'next/navigation'

export default function HowItWorksRedirect() {
  redirect('/cum-functioneaza-si-impact')
}
