/**
 * Site Layout
 * 
 * Layout pentru rutele publice (site)
 * Include navbar, footer și providers
 */

import { SiteLayoutClient } from '@/components/layout/site-layout-client'

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SiteLayoutClient>{children}</SiteLayoutClient>
}

