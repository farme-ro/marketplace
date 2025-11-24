/**
 * Modern Producer Card Component
 * 
 * Card modern pentru listarea producătorilor conform designului nou
 */

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MapPin, Star, CheckCircle2, Award } from 'lucide-react'
import type { ProducerSummary } from '@/lib/api/public/producers'

export interface ProducerCardModernProps extends ProducerSummary {
  rating?: number
  ratingCount?: number
  isTopProducer?: boolean
  featuredProducts?: {
    name: string
    price?: string
  }[]
  deliveryOptions?: string[]
}

interface ProducerCardModernWithIndex extends ProducerCardModernProps {
  index?: number
}

export function ProducerCardModern({
  id,
  slug,
  name,
  description,
  avatarUrl,
  regionName,
  tags,
  isVerified,
  productCount,
  rating,
  ratingCount,
  isTopProducer,
  featuredProducts,
  index = 0,
}: ProducerCardModernWithIndex) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      whileHover={{ y: -2 }}
      className="group"
    >
      <Link href={`/producers/${slug}`}>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1220] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full">
          {/* Header imagine */}
          <div className="relative h-[140px] bg-gradient-to-br from-emerald-400/30 to-lime-500/30 dark:from-emerald-400/10 dark:to-lime-500/10 overflow-hidden">
            {avatarUrl && (
              <Image
                src={avatarUrl}
                alt={name}
                fill
                className="object-cover opacity-20"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
            
            {/* Avatar/Logo producător - overlap */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
              <div className="relative">
                {avatarUrl ? (
                  <div className="relative w-20 h-20 rounded-full border-4 border-white dark:border-[#0B1220] overflow-hidden bg-white dark:bg-[#0B1220] shadow-lg">
                    <Image
                      src={avatarUrl}
                      alt={name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full border-4 border-white dark:border-[#0B1220] bg-gradient-to-br from-emerald-400/30 to-lime-500/30 dark:from-emerald-400/10 dark:to-lime-500/10 shadow-lg flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-emerald-600 dark:text-emerald-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                )}
                {isVerified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#3BAF6A] dark:bg-emerald-500 rounded-full border-2 border-white dark:border-[#0B1220] flex items-center justify-center shadow-md">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Conținut */}
          <div className="pt-12 pb-5 px-5 flex-1 flex flex-col">
            {/* Nume producător */}
            <div className="text-center mb-3">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-1">
                {name}
              </h3>
              
              {/* Locație */}
              {regionName && (
                <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center justify-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {regionName}
                </p>
              )}
            </div>

            {/* Rating */}
            {(rating || ratingCount) && (
              <div className="flex items-center justify-center gap-1.5 mb-3">
                <Star className="w-4 h-4 fill-[#F7B733] text-[#F7B733]" />
                <span className="text-sm font-medium text-slate-900 dark:text-slate-50">
                  {rating?.toFixed(1) || '4.8'}
                </span>
                {ratingCount && (
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    ({ratingCount} recenzii)
                  </span>
                )}
              </div>
            )}

            {/* Badge-uri */}
            <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
              {isVerified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#3BAF6A]/10 dark:bg-emerald-500/10 text-[#3BAF6A] dark:text-emerald-400 border border-[#3BAF6A]/20 dark:border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  Producător verificat
                </span>
              )}
              {isTopProducer && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#F7B733]/10 dark:bg-yellow-500/10 text-[#F7B733] dark:text-yellow-400 border border-[#F7B733]/20 dark:border-yellow-500/20">
                  <Award className="w-3 h-3" />
                  Top producător
                </span>
              )}
            </div>

            {/* Tag-uri */}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 justify-center mb-4">
                {tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Preview produse */}
            {featuredProducts && featuredProducts.length > 0 && (
              <div className="mb-4 space-y-1.5">
                {featuredProducts.slice(0, 3).map((product, index) => (
                  <div key={index} className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <span className="text-slate-400">•</span>
                    <span className="flex-1 truncate">{product.name}</span>
                    {product.price && (
                      <span className="text-slate-900 dark:text-slate-50 font-medium">
                        de la {product.price}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
              {productCount !== undefined && (
                <p className="text-xs text-slate-600 dark:text-slate-400 text-center mb-3">
                  {productCount} {productCount === 1 ? 'produs' : 'produse'} disponibile
                </p>
              )}
              
              {/* Buton principal */}
              <button className="w-full mt-2 inline-flex items-center justify-center rounded-xl bg-[#3BAF6A] hover:bg-[#2d8f54] dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-900 text-sm font-medium py-2.5 transition-colors duration-200">
                Vezi producătorul
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

