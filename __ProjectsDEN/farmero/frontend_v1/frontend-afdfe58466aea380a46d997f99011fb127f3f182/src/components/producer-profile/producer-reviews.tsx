/**
 * Producer Reviews Component
 * 
 * Secțiunea cu recenzii - carduri cu rating și experiență
 */

'use client'

import { motion } from 'framer-motion'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent } from 'farme-ui'

interface Review {
  id: string
  userName: string
  productName: string
  rating: number
  comment: string
  date: string
}

const mockReviews: Review[] = [
  {
    id: '1',
    userName: 'Maria P.',
    productName: 'Miere de salcâm',
    rating: 5,
    comment: 'Produse excelente, livrare rapidă. Recomand cu încredere!',
    date: '2024-01-10',
  },
  {
    id: '2',
    userName: 'Ion G.',
    productName: 'Ouă de țară',
    rating: 5,
    comment: 'Ouă foarte proaspete, exact ce căutam. Mulțumim!',
    date: '2024-01-08',
  },
  {
    id: '3',
    userName: 'Ana M.',
    productName: 'Brânză de capră',
    rating: 4,
    comment: 'Calitate bună, preț corect. Voi comanda din nou.',
    date: '2024-01-05',
  },
]

export function ProducerReviews() {
  const averageRating = mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length

  return (
    <section className="py-16 md:py-24 bg-background">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            Recenzii
          </h2>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-2xl">
                  {i < Math.round(averageRating) ? '⭐' : '☆'}
                </span>
              ))}
            </div>
            <span className="text-xl font-bold text-foreground">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-foreground-body">
              ({mockReviews.length} recenzii)
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="border border-border rounded-[32px] shadow-premium bg-card h-full">
                <CardContent className="p-6">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-lg">
                        {i < review.rating ? '⭐' : '☆'}
                      </span>
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-base text-foreground-body leading-relaxed mb-4 italic">
                    &quot;{review.comment}&quot;
                  </p>

                  {/* User Info */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{review.userName}</p>
                      <p className="text-xs text-muted-foreground">{review.productName}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{review.date}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </PageContainer>
    </section>
  )
}

