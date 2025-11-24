/**
 * Promotion Tool Info Component
 * 
 * Secțiunea despre tool-ul de promovare social media
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from 'farme-ui'
import { Button } from 'farme-ui'

const ImageIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const CalendarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const FileTextIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const BarChartIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

export function PromotionToolInfo() {
  const [showModal, setShowModal] = useState(false)

  const features = [
    {
      icon: ImageIcon,
      title: 'Modele de postări predefinite',
      description: 'Template-uri gata de folosit pentru produsele tale',
    },
    {
      icon: FileTextIcon,
      title: 'Generare de text prietenos',
      description: 'Texte optimizate pentru social media cu hashtag-uri relevante',
    },
    {
      icon: BarChartIcon,
      title: 'Highlight pentru produse cu stoc',
      description: 'Promovează automat produsele disponibile',
    },
    {
      icon: CalendarIcon,
      title: 'Recomandări de oră / zi',
      description: 'Sugestii pentru momentul optim de postare (placeholder)',
    },
  ]

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-12"
      >
        <Card className="border-2 border-border/60 rounded-2xl shadow-lg bg-gradient-to-br from-primary/5 via-amber-500/5 to-orange-500/5">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center border-2 border-primary/20">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Promovare ușoară pe rețelele sociale
              </h3>
            </div>

            <p className="text-base text-muted-foreground leading-relaxed mb-6">
              Ca parte a abonamentului tău, vei putea genera rapid postări despre produsele tale (poze, texte, oferte) care pot fi publicate pe Facebook / Instagram.
              <br />
              <strong className="text-foreground">Fiecare promovare include link direct către pagina ta din platformă</strong> — astfel, tu faci promovare, iar noi îți aducem clienți noi.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-card/60 rounded-xl border border-border/40">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1 text-sm">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={() => setShowModal(true)}
              className="w-full sm:w-auto"
            >
              Vezi cum va funcționa
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl shadow-xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-bold text-foreground mb-4">
              Coming Soon
            </h3>
            <p className="text-muted-foreground mb-6">
              Tool-ul de promovare social media va fi disponibil în curând. Vei putea genera postări pentru produsele tale direct din platformă.
            </p>
            <Button onClick={() => setShowModal(false)} className="w-full">
              Închide
            </Button>
          </motion.div>
        </div>
      )}
    </>
  )
}

