/**
 * Support Farmero Layout
 * 
 * Layout pentru pagina de susținere cu metadata SEO
 */

import type { Metadata } from 'next'
import { generatePageMetadata, getSupportFarmeroMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = generatePageMetadata(
  getSupportFarmeroMetadata('ro'),
  '/sustine-farmero',
  'ro'
)

export default function SupportFarmeroLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

