/**
 * Journal Article Layout
 * 
 * Layout with dynamic metadata for journal articles
 */

import { Metadata } from 'next'
import { getJournalArticleBySlug } from '@/lib/api/journal'
import type { DomainJournalArticle } from '@/lib/types/domain'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://farme.ro'

interface JournalArticleLayoutProps {
  children: React.ReactNode
  params: { slug: string }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  try {
    const article: DomainJournalArticle = await getJournalArticleBySlug(params.slug)

    const title = `${article.title} – Jurnal de farme.ro`
    const description = article.excerpt || article.title
    const imageUrl = article.coverImageUrl
      ? article.coverImageUrl.startsWith('http')
        ? article.coverImageUrl
        : `${baseUrl}${article.coverImageUrl}`
      : `${baseUrl}/images/jurnal-farmero-og.png`
    const articleUrl = `${baseUrl}/jurnal-de-farmero/${article.slug}`

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        url: articleUrl,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: article.title,
          },
        ],
        publishedTime: article.publishedAt || undefined,
        modifiedTime: article.updatedAt || undefined,
        authors: [article.producerName],
        siteName: 'farmero',
        locale: 'ro_RO',
        alternateLocale: ['en_US', 'fr_FR', 'it_IT', 'de_DE', 'es_ES', 'uk_UA', 'hu_HU'],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
      alternates: {
        canonical: articleUrl,
        languages: {
          'ro': articleUrl,
          'en': articleUrl,
          'fr': articleUrl,
          'it': articleUrl,
          'de': articleUrl,
          'es': articleUrl,
          'uk': articleUrl,
          'hu': articleUrl,
        },
      },
    }
  } catch (error) {
    // Fallback metadata if article not found
    const fallbackUrl = `${baseUrl}/jurnal-de-farmero/${params.slug}`
    return {
      title: 'Articol – Jurnal de farme.ro',
      description: 'Articol din Jurnal de farme.ro',
      alternates: {
        canonical: fallbackUrl,
        languages: {
          'ro': fallbackUrl,
          'en': fallbackUrl,
          'fr': fallbackUrl,
          'it': fallbackUrl,
          'de': fallbackUrl,
          'es': fallbackUrl,
          'uk': fallbackUrl,
          'hu': fallbackUrl,
        },
      },
    }
  }
}

export default function JournalArticleLayout({ children }: JournalArticleLayoutProps) {
  return <>{children}</>
}

