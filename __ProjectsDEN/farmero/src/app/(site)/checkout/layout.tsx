import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Checkout | farme.ro',
  description: 'Finalizează comanda ta și contribuie la economia locală și impactul social.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

