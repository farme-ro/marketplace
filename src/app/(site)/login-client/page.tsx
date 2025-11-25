/**
 * Client Login Page - Redirects to unified login
 * 
 * This page redirects to the unified /login page
 */

'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginClientContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const returnUrl = searchParams.get('returnUrl') || searchParams.get('redirect')
    if (returnUrl) {
      router.replace(`/login?returnUrl=${encodeURIComponent(returnUrl)}`)
    } else {
      router.replace('/login')
    }
  }, [router, searchParams])

  return null
}

export default function LoginClientPage() {
  return (
    <Suspense fallback={null}>
      <LoginClientContent />
    </Suspense>
  )
}
