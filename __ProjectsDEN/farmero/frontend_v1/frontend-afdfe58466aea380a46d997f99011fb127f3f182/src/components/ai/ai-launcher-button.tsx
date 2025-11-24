/**
 * AI Launcher Button Component
 * 
 * Floating button to launch AI Assistant (bottom right)
 */

'use client'

import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '@/lib/i18n/context'
import { useAuth } from '@/lib/auth/context'
import { usePathname } from 'next/navigation'
import { AiChatWidget } from './ai-chat-widget'

export function AiLauncherButton() {
  const { t, locale } = useI18n()
  const { role: authRole } = useAuth()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Determine AI role from auth role
  const aiRole = authRole === 'producer' ? 'producer' : authRole === 'admin' ? 'admin' : 'client'

  return (
    <>
      {/* Launcher Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-shadow hover:shadow-xl md:bottom-28 md:right-8"
        aria-label={t('ai.launcher.ariaLabel', 'Deschide asistentul AI')}
        title={t('ai.launcher.title', 'Asistentul Farmero')}
      >
        <MessageCircle className="h-6 w-6" />
      </motion.button>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <AiChatWidget
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            locale={locale}
            role={aiRole}
            page={pathname}
          />
        )}
      </AnimatePresence>
    </>
  )
}

