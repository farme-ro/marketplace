/**
 * Journal Schema.org JSON-LD Component
 * 
 * Generates structured data for journal articles
 */

import type { DomainJournalArticle } from '@/lib/types/domain'

interface JournalSchemaProps {
  article: DomainJournalArticle
}

export function JournalSchema({ article }: JournalSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://farme.ro'
  const articleUrl = `${baseUrl}/jurnal-de-farmero/${article.slug}`
  const imageUrl = article.coverImageUrl
    ? article.coverImageUrl.startsWith('http')
      ? article.coverImageUrl
      : `${baseUrl}${article.coverImageUrl}`
    : `${baseUrl}/images/jurnal-farmero-og.png`

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@inLanguage': 'ro', // Base language, but content can be in any supported language
    headline: article.title,
    description: article.excerpt,
    image: imageUrl,
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Organization',
      name: article.producerName,
      url: `${baseUrl}/producatori/${article.producerSlug}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'farmero',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/farmero-logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    url: articleUrl,
    // Note: URL remains in Romanian (/jurnal-de-farmero) for all languages
    // Content is translated, but path is brand signature
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

