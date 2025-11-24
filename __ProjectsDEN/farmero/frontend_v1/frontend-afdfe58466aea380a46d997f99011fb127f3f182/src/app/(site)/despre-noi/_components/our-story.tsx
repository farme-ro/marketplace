'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent } from 'farme-ui'
import { useI18n } from '@/lib/i18n/context'

export function OurStory() {
  const { t } = useI18n()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [20, -20])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3])

  return (
    <section ref={ref} className="py-12 md:py-16 lg:py-20 relative overflow-hidden">
      {/* Animated background gradient */}
      <motion.div
        style={{ opacity }}
        className="absolute inset-0 bg-muted/30"
      />
      
      <PageContainer className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Image (Desktop: left, Mobile: second) */}
          <motion.div
            style={{ y }}
            className="relative order-2 lg:order-1"
          >
            <Card className="rounded-3xl border border-border overflow-hidden shadow-2xl bg-card">
              <CardContent className="p-0">
                <div className="relative aspect-[4/3] bg-muted">
                  {/* Image with placeholder */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative w-full h-full"
                  >
                    {/* Placeholder image - can be replaced with actual image */}
                    <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                      {/* Decorative farm illustration as placeholder */}
                      <div className="relative w-full h-full flex items-center justify-center p-8">
                        <motion.div
                          animate={{
                            scale: [1, 1.05, 1],
                          }}
                          transition={{
                            duration: 6,
                            repeat: Infinity,
                            repeatType: 'reverse',
                            ease: 'easeInOut',
                          }}
                          className="text-8xl md:text-9xl"
                        >
                          🌾
                        </motion.div>
                        {/* Decorative elements */}
                        <div className="absolute top-4 left-4 text-4xl opacity-60">🌻</div>
                        <div className="absolute bottom-4 right-4 text-4xl opacity-60">🌿</div>
                        <div className="absolute top-1/2 right-8 text-3xl opacity-50">🌱</div>
                        <div className="absolute bottom-1/3 left-8 text-3xl opacity-50">🌷</div>
                      </div>
                    </div>
                    
                    {/* Overlay gradient for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />
                  </motion.div>
                  
                  {/* Floating particles */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-primary/30 rounded-full"
                        initial={{ 
                          x: Math.random() * 100 + '%',
                          y: Math.random() * 100 + '%',
                          opacity: 0
                        }}
                        animate={{
                          y: [null, (Math.random() - 0.5) * 50 + '%'],
                          opacity: [0, 0.6, 0],
                        }}
                        transition={{
                          duration: 4 + Math.random() * 2,
                          repeat: Infinity,
                          delay: i * 0.4,
                          ease: 'easeInOut'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column - Text (Desktop: right, Mobile: first) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="space-y-6 order-1 lg:order-2"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground mb-2">
                {t('about.story.title', 'Povestea noastră')}
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-primary via-primary to-primary rounded-full mb-6" />
            </motion.div>
            
            <div className="space-y-5 text-muted-foreground text-sm md:text-base leading-relaxed">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {t('about.story.paragraph1', 'farme.ro a apărut din observația că există o nevoie reală de a conecta producătorii locali din România cu clienții care caută produse autentice, tradiționale și de calitate. Mulți fermieri și producători mici nu au acces la piață sau resursele necesare pentru a-și promova produsele.')}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {t('about.story.paragraph2', 'În același timp, clienții din orașe mari au dificultăți în a găsi produse tradiționale autentice, fără intermediari care să mărească prețurile sau să compromită calitatea.')}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {t('about.story.paragraph3', 'Platforma noastră rezolvă această problemă oferind un marketplace direct, transparent și ușor de folosit, unde producătorii pot vinde direct clienților, iar clienții pot descoperi și cumpăra produse tradiționale românești cu încredere.')}
              </motion.p>
            </div>
          </motion.div>
        </div>
      </PageContainer>
    </section>
  )
}
