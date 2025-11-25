/**
 * Unified Register Page
 * 
 * Allows users to select the type of account they want to create
 * Then redirects to the appropriate registration form
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
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
  ArrowRight
} from 'lucide-react'

interface RegisterOption {
  type: 'client' | 'producer' | 'business' | 'logistics' | 'investor' | 'importer'
  nameKey: string
  descriptionKey: string
  icon: React.ComponentType<{ className?: string }>
  path: string
  color: string
}

const registerOptions: RegisterOption[] = [
  {
    type: 'client',
    nameKey: 'register.options.client.name',
    descriptionKey: 'register.options.client.description',
    icon: User,
    path: '/register-client',
    color: 'bg-blue-500',
  },
  {
    type: 'producer',
    nameKey: 'register.options.producer.name',
    descriptionKey: 'register.options.producer.description',
    icon: Package,
    path: '/portal-producatori/register',
    color: 'bg-green-500',
  },
  {
    type: 'business',
    nameKey: 'register.options.business.name',
    descriptionKey: 'register.options.business.description',
    icon: Briefcase,
    path: '/b2b/register',
    color: 'bg-purple-500',
  },
  {
    type: 'logistics',
    nameKey: 'register.options.logistics.name',
    descriptionKey: 'register.options.logistics.description',
    icon: Truck,
    path: '/pentru-logistica/register',
    color: 'bg-orange-500',
  },
  {
    type: 'investor',
    nameKey: 'register.options.investor.name',
    descriptionKey: 'register.options.investor.description',
    icon: TrendingUp,
    path: '/pentru-investitori/register',
    color: 'bg-yellow-500',
  },
  {
    type: 'importer',
    nameKey: 'register.options.importer.name',
    descriptionKey: 'register.options.importer.description',
    icon: Globe,
    path: '/pentru-importatori/register',
    color: 'bg-indigo-500',
  },
]

export default function UnifiedRegisterPage() {
  const router = useRouter()
  const { t } = useI18n()

  const handleSelectType = (option: RegisterOption) => {
    router.push(option.path)
  }

  return (
    <PageContainer>
      <div className="min-h-screen py-12 md:py-16 lg:py-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {t('register.title', 'Creează cont')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('register.description', 'Alege tipul de cont pe care vrei să-l creezi')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {registerOptions.map((option, index) => {
              const Icon = option.icon

              return (
                <motion.div
                  key={option.type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card
                    className="h-full cursor-pointer hover:shadow-lg transition-all duration-300 border-border/60 hover:border-primary/50"
                    onClick={() => handleSelectType(option)}
                  >
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg ${option.color} flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-xl">{t(option.nameKey, option.type === 'client' ? 'Client' : option.type === 'producer' ? 'Producer' : option.type === 'business' ? 'Business' : option.type === 'logistics' ? 'Logistics' : option.type === 'investor' ? 'Investor' : 'Importer')}</CardTitle>
                      <CardDescription>{t(option.descriptionKey, option.type === 'client' ? 'Create account to buy products directly from local producers' : option.type === 'producer' ? 'Become a partner producer and sell your products directly to customers' : option.type === 'business' ? 'Account for restaurants, hotels, cafes and other businesses' : option.type === 'logistics' ? 'Become a logistics and transport partner' : option.type === 'investor' ? 'Invest in the Farme.ro platform' : 'Import quality products into Romania')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSelectType(option)
                        }}
                      >
                        {t('register.select', 'Selectează')}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {t('register.alreadyHaveAccount', 'Ai deja cont?')}{' '}
              <Link
                href="/login"
                className="text-primary hover:underline font-medium transition-colors"
              >
                {t('auth.login', 'Autentifică-te')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

