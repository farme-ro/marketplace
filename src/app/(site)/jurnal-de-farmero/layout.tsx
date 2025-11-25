/**
 * Journal Layout
 * 
 * Layout with metadata for journal list page
 * URL remains in Romanian (/jurnal-de-farmero) for all languages
 */

import { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://farme.ro'
const journalUrl = `${baseUrl}/jurnal-de-farmero`

export const metadata: Metadata = {
  title: 'Jurnal de farme.ro – Povești și producători locali',
  description:
    'Descoperă poveștile producătorilor locali din România. Povești autentice despre tradiții, metode de producere și oameni care transformă pământul în produse de calitate.',
  openGraph: {
    title: 'Jurnal de farme.ro – Povești și producători locali',
    description:
      'Descoperă poveștile producătorilor locali din România. Povești autentice despre tradiții, metode de producere și oameni care transformă pământul în produse de calitate.',
    type: 'website',
    url: journalUrl,
    images: [
      {
        url: `${baseUrl}/images/jurnal-farmero-og.png`,
        width: 1200,
        height: 630,
        alt: 'Jurnal de farme.ro',
      },
    ],
    locale: 'ro_RO',
    alternateLocale: ['en_US', 'fr_FR', 'it_IT', 'de_DE', 'es_ES', 'uk_UA', 'hu_HU'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jurnal de farme.ro – Povești și producători locali',
    description:
      'Descoperă poveștile producătorilor locali din România. Povești autentice despre tradiții, metode de producere și oameni care transformă pământul în produse de calitate.',
    images: [
      `${baseUrl}/images/jurnal-farmero-og.png`,
    ],
  },
  alternates: {
    canonical: journalUrl,
    languages: {
      'ro': journalUrl,
      'en': journalUrl,
      'fr': journalUrl,
      'it': journalUrl,
      'de': journalUrl,
      'es': journalUrl,
      'uk': journalUrl,
      'hu': journalUrl,
    },
  },
}

export default function JournalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

