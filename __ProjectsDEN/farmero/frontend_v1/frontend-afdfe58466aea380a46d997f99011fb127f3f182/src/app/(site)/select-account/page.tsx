/**
 * Select Account Page
 * 
 * Displays all available roles for a user with multiple roles
 * Allows user to select which role/portal to access
 */

'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth/context'
import { getUserRoles } from '@/lib/api/auth'
import { PageContainer } from '@/components/layout/page-container'
import { useI18n } from '@/lib/i18n/context'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from 'farme-ui'
import { Button } from 'farme-ui'
import { 
  User, 
  Building2, 
  Package, 
  Truck, 
  TrendingUp, 
  Globe, 
  Briefcase,
  ArrowRight,
  Loader2
} from 'lucide-react'
import type { UserRole } from '@/lib/types/domain'

interface RoleOption {
  role: UserRole
  icon: React.ComponentType<{ className?: string }>
  path: string
  color: string
  nameKey: string
  descriptionKey: string
}

const roleOptions: Record<UserRole, RoleOption> = {
  client: {
    role: 'client',
    nameKey: 'selectAccount.roles.client.name',
    descriptionKey: 'selectAccount.roles.client.description',
    icon: User,
    path: '/account',
    color: 'bg-blue-500',
  },
  business: {
    role: 'business',
    nameKey: 'selectAccount.roles.business.name',
    descriptionKey: 'selectAccount.roles.business.description',
    icon: Briefcase,
    path: '/business-portal',
    color: 'bg-purple-500',
  },
  producer: {
    role: 'producer',
    nameKey: 'selectAccount.roles.producer.name',
    descriptionKey: 'selectAccount.roles.producer.description',
    icon: Package,
    path: '/portal-producatori/dashboard',
    color: 'bg-green-500',
  },
  logistics: {
    role: 'logistics',
    nameKey: 'selectAccount.roles.logistics.name',
    descriptionKey: 'selectAccount.roles.logistics.description',
    icon: Truck,
    path: '/logistics-portal',
    color: 'bg-orange-500',
  },
  investor: {
    role: 'investor',
    nameKey: 'selectAccount.roles.investor.name',
    descriptionKey: 'selectAccount.roles.investor.description',
    icon: TrendingUp,
    path: '/investor-portal',
    color: 'bg-yellow-500',
  },
  importer: {
    role: 'importer',
    nameKey: 'selectAccount.roles.importer.name',
    descriptionKey: 'selectAccount.roles.importer.description',
    icon: Globe,
    path: '/importer-portal',
    color: 'bg-indigo-500',
  },
  admin: {
    role: 'admin',
    nameKey: 'selectAccount.roles.admin.name',
    descriptionKey: 'selectAccount.roles.admin.description',
    icon: Building2,
    path: '/admin',
    color: 'bg-red-500',
  },
}

function SelectAccountContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { t } = useI18n()
  const [availableRoles, setAvailableRoles] = useState<UserRole[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadRoles() {
      if (!isAuthenticated) {
        router.push('/login')
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const roles = await getUserRoles()
        
        if (roles.length === 0) {
          setError(t('selectAccount.noRoles', 'Nu ai roluri disponibile. Te rugăm să contactezi suportul.'))
        } else if (roles.length === 1) {
          // Single role - redirect directly
          const role = roles[0]
          const option = roleOptions[role]
          if (option) {
            router.push(option.path)
          } else {
            router.push('/')
          }
        } else {
          // Multiple roles - show selection
          setAvailableRoles(roles)
        }
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('Failed to load user roles:', err)
        }
        setError(t('selectAccount.loadError', 'Eroare la încărcarea rolurilor. Te rugăm să reîncerci.'))
      } finally {
        setIsLoading(false)
      }
    }

    if (!authLoading) {
      loadRoles()
    }
  }, [isAuthenticated, authLoading, router, t])

  const handleSelectRole = (role: UserRole) => {
    const option = roleOptions[role]
    if (option) {
      const returnUrl = searchParams.get('returnUrl')
      
      if (returnUrl) {
        router.push(returnUrl)
      } else {
        router.push(option.path)
      }
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">
            {t('selectAccount.loading', 'Se încarcă...')}
          </p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Redirect is happening
  }

  if (error) {
    return (
      <PageContainer>
        <div className="min-h-screen flex items-center justify-center py-20">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>{t('common.error', 'Eroare')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => router.push('/login')} variant="outline">
                {t('auth.backToLogin', 'Înapoi la autentificare')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    )
  }

  if (availableRoles.length === 0) {
    return null // Redirect is happening
  }

  return (
    <PageContainer>
      <div className="min-h-screen py-12 md:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {t('selectAccount.title', 'Selectează contul')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('selectAccount.description', 'Ai acces la mai multe conturi. Alege unul pentru a continua.')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableRoles.map((role, index) => {
              const option = roleOptions[role]
              if (!option) return null

              const Icon = option.icon

              return (
                <motion.div
                  key={role}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card
                    className="h-full cursor-pointer hover:shadow-lg transition-all duration-300 border-border/60 hover:border-primary/50"
                    onClick={() => handleSelectRole(role)}
                  >
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg ${option.color} flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-xl">{t(option.nameKey, option.role === 'client' ? 'Client' : option.role === 'business' ? 'Business' : option.role === 'producer' ? 'Producer' : option.role === 'logistics' ? 'Logistics' : option.role === 'investor' ? 'Investor' : option.role === 'importer' ? 'Importer' : 'Administrator')}</CardTitle>
                      <CardDescription>{t(option.descriptionKey, option.role === 'client' ? 'Access your personal account' : option.role === 'business' ? 'Portal for your business' : option.role === 'producer' ? 'Producer portal' : option.role === 'logistics' ? 'Logistics and transport portal' : option.role === 'investor' ? 'Investor portal' : option.role === 'importer' ? 'Importer portal' : 'Administration panel')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSelectRole(role)
                        }}
                      >
                        {t('selectAccount.select', 'Selectează')}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

export default function SelectAccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="text-muted-foreground">Loading...</div></div>}>
      <SelectAccountContent />
    </Suspense>
  )
}

