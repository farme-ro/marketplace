/**
 * Journal Layout Component
 * 
 * Common layout wrapper for journal pages
 */

'use client'

import { ReactNode } from 'react'
import { PageContainer } from '@/components/layout/page-container'
import { cn } from '@/lib/utils/cn'

export interface JournalLayoutProps {
  children: ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | '8xl'
}

export function JournalLayout({
  children,
  className,
  maxWidth = '8xl',
}: JournalLayoutProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '7xl': 'max-w-7xl',
    '8xl': 'max-w-8xl',
  }

  return (
    <PageContainer className={cn(maxWidthClasses[maxWidth], className)}>
      {children}
    </PageContainer>
  )
}

