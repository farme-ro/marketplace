import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Produse Producător | farme.ro',
  description: 'Gestionează produsele tale: activează sau dezactivează rapid produsele în funcție de stoc.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function ProducerProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

