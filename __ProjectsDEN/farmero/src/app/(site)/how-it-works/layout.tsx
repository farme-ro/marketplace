import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cum funcționează & Impact social | farme.ro',
  description:
    'Conectăm producători locali, oameni care vor să mănânce mai bine și o rețea de livrare gândită să reducă risipa, nu doar să mute cutii.',
  openGraph: {
    title: 'Cum funcționează & Impact social | farme.ro',
    description:
      'Conectăm producători locali, oameni care vor să mănânce mai bine și o rețea de livrare gândită să reducă risipa, nu doar să mute cutii.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

