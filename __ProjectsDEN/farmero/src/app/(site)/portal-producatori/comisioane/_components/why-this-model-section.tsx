/**
 * Why This Model Section
 * 
 * Secțiunea "De ce am ales acest model"
 */

'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'

export function WhyThisModelSection() {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold tracking-tight text-foreground">
        De ce am ales acest model
      </h2>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Card className="border border-border rounded-[32px] shadow-premium bg-card">
          <CardContent className="p-6 md:p-8">
            <div className="space-y-4 text-sm text-foreground-body leading-relaxed">
              <p>
                Vrem ca farme.ro să fie un loc corect pentru toată lumea: producători, clienți și
                comunități. În loc să mergem pe comisioane foarte mari, preferăm un model cu margine
                rezonabilă și volum, în care producătorii rămân în platformă pentru că le este bine,
                nu pentru că sunt blocați.
              </p>
              <p>
                Comisionul nu este &ldquo;taxa farme.ro&rdquo;, ci modul prin care putem construi mai departe:
                infrastructură mai bună, unelte noi pentru tine, vizibilitate mai mare și soluții
                logistice care să reducă risipa și stresul din livrări.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  )
}

