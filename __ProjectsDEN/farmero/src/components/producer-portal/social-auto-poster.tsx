/**
 * Social Auto Poster Component
 * 
 * Panou dedicat pentru promovare automată pe social media
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from 'farme-ui'
import { Button } from 'farme-ui'

interface SocialAutoPosterProps {
  isEnabled?: boolean
  schedule?: string[]
}

export function SocialAutoPoster({
  isEnabled = false,
  schedule = ['Marți', 'Joi', 'Sâmbătă'],
}: SocialAutoPosterProps) {
  const [enabled, setEnabled] = useState(isEnabled)
  const [selectedDays, setSelectedDays] = useState<string[]>(schedule)

  const days = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă', 'Duminică']

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  return (
    <Card className="border border-border rounded-[32px] shadow-premium bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-foreground">Promovează-ți produsele automat</CardTitle>
        <p className="text-sm text-foreground-body mt-1">Postează automat pe Instagram și Facebook</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Preview Post */}
          <div className="p-6 bg-muted/30 rounded-2xl border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center">
                <span className="text-xl">🧑‍🌾</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Ferma Popescu</p>
                <p className="text-xs text-muted-foreground">Acum 2 ore</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="aspect-square bg-background rounded-xl flex items-center justify-center border border-border">
                <div className="text-center space-y-2">
                  <span className="text-4xl">📦</span>
                  <p className="text-xs text-foreground-body">Preview imagine produs</p>
                </div>
              </div>
              <p className="text-sm text-foreground-body">
                🌾 Produse proaspete direct de la fermă! Miere de salcâm, brânză de capră și ouă de țară.
                <br />
                <br />
                #produselocale #farme #romania
              </p>
            </div>
          </div>

          {/* Schedule Selection */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Programare postări</h4>
            <div className="flex flex-wrap gap-2">
              {days.map(day => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedDays.includes(day)
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-muted text-foreground-body hover:bg-muted/80'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
            <Button
              onClick={() => setEnabled(!enabled)}
              className={`flex-1 ${
                enabled
                  ? 'bg-primary hover:bg-primary-hover text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80 text-foreground'
              }`}
            >
              {enabled ? '✅ Postează automat ' + selectedDays.join(', ') : '✅ Postează automat'}
            </Button>
            <Button variant="outline" className="flex-1">
              ✅ Postează manual
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

