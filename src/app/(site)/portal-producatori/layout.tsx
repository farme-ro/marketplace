/**
 * Producer Portal Layout
 * 
 * Layout dedicat pentru toate paginile producer-portal
 * NU folosește SiteNavbar și SiteFooter - are propriul topbar și sidebar
 * Protejează toate rutele din producer-portal (except login/register)
 */

import type { Metadata } from 'next'
import { ProducerPortalLayoutClient } from './producer-portal-layout-client'

export const metadata: Metadata = {
  title: 'Portal Producători | farme.ro',
  description: 'Portal dedicat pentru producătorii farme.ro',
  robots: {
    index: false,
    follow: false,
  },
}

export default function ProducerPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProducerPortalLayoutClient>{children}</ProducerPortalLayoutClient>
}

