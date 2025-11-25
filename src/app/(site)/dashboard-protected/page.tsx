/**
 * Protected Page Example
 * 
 * Example of a protected page using the useAuth hook
 * Redirects to login if user is not authenticated
 */

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import { Card, CardContent, CardHeader, CardTitle } from 'farme-ui'
import { Skeleton } from 'farme-ui'
import { PageContainer } from '@/components/layout/page-container'

export default function ProtectedPage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect to login if not authenticated (after loading)
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  // Show loading state
  if (isLoading) {
    return (
      <PageContainer maxWidth="4xl" className="py-10 md:py-16">
        <Card variant="default" padding="lg">
          <CardContent>
            <Skeleton variant="text" width="60%" height="32px" className="mb-4" />
            <Skeleton variant="rectangular" width="100%" height="200px" />
          </CardContent>
        </Card>
      </PageContainer>
    )
  }

  // Don't render if not authenticated (redirect will happen)
  if (!isAuthenticated || !user) {
    return null
  }

  // Render protected content
  return (
    <PageContainer maxWidth="4xl" className="py-10 md:py-16">
      <Card variant="default" padding="lg">
        <CardHeader>
          <CardTitle>Dashboard Protejat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Bun venit, {user.fullName}!</h2>
              <p className="text-muted-foreground">
                Această pagină este protejată și necesită autentificare.
              </p>
            </div>
            
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Informații cont:</h3>
              <ul className="space-y-1 text-sm">
                <li><strong>Email:</strong> {user.email}</li>
                <li><strong>Rol:</strong> {user.role}</li>
                <li><strong>ID:</strong> {user.id}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  )
}

