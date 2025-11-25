/**
 * Farme AI Recommendations Component
 * 
 * Recomandări AI pentru creșterea vânzărilor
 */

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from 'farme-ui'
import { Button } from 'farme-ui'

interface Recommendation {
  id: string
  title: string
  description: string
  action: string
  type: 'promotion' | 'stock' | 'pricing'
}

interface FarmeAIRecommendationsProps {
  recommendations?: Recommendation[]
}

const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    title: 'Ofertă weekend pentru legume',
    description: 'Legumele tale se vând bine – adaugă oferta -10% pentru weekend pentru a crește vânzările.',
    action: 'Creează ofertă',
    type: 'promotion',
  },
]

export function FarmeAIRecommendations({ recommendations = mockRecommendations }: FarmeAIRecommendationsProps) {
  if (recommendations.length === 0) {
    return null
  }

  return (
    <Card className="border border-border rounded-[32px] shadow-premium bg-gradient-to-br from-primary-bg/50 to-primary-soft/30">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <CardTitle className="text-xl font-bold text-foreground">Recomandare Farme AI</CardTitle>
        </div>
        <p className="text-sm text-foreground-body">Sugestii inteligente pentru creșterea vânzărilor</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-5 bg-card rounded-2xl border border-border"
            >
              <h4 className="font-semibold text-foreground mb-2">{rec.title}</h4>
              <p className="text-sm text-foreground-body mb-4 leading-relaxed">{rec.description}</p>
              <Button size="sm" className="bg-primary hover:bg-primary-hover text-primary-foreground">
                {rec.action}
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

