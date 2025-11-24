/**
 * AI Chat Widget Component
 * 
 * Slide-over or modal chat interface for AI Assistant
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Send, Loader2, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '@/lib/i18n/context'
import { useAuth } from '@/lib/auth/context'
import { sendAiMessage, type AiRole, type SuggestedLink } from '@/lib/api/ai-assistant'
import { useRouter, usePathname } from 'next/navigation'

interface AiChatWidgetProps {
  isOpen: boolean
  onClose: () => void
  locale: string
  role?: AiRole
  page?: string
}

export function AiChatWidget({ isOpen, onClose, locale, role: propRole, page: propPage }: AiChatWidgetProps) {
  const { t } = useI18n()
  const { user, role: authRole } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  
  // Determine role: use prop if provided, otherwise infer from auth
  const role: AiRole = propRole || (authRole === 'producer' ? 'producer' : authRole === 'admin' ? 'admin' : 'client')
  const page = propPage || pathname
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; suggestedLinks?: SuggestedLink[] }>>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when widget opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setLoading(true)

    // Add user message
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }]
    setMessages(newMessages)

    try {
      // Get AI response
      const response = await sendAiMessage(
        {
          role,
          locale,
          page: page || pathname,
          userId: user?.id,
        },
        userMessage
      )

      // Add assistant response
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: response.answer,
          suggestedLinks: response.suggestedLinks,
        },
      ])
    } catch (error) {
      console.error('Error sending AI message:', error)
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: t('ai.chat.error', 'Ne pare rău, a apărut o eroare. Te rugăm să încerci din nou.'),
        },
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleLinkClick = (url: string) => {
    router.push(url)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50"
          />

          {/* Chat Widget */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 right-0 top-0 z-50 flex w-full flex-col bg-background shadow-xl md:w-96"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border bg-primary/5 p-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {t('ai.chat.title', 'Farmero Assistant')}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {t('ai.chat.subtitle', 'Cum te pot ajuta?')}
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-md p-2 hover:bg-background transition-colors"
                aria-label={t('common.close', 'Închide')}
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">{t('ai.chat.welcome', 'Bună! Cum te pot ajuta?')}</p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      {msg.suggestedLinks && msg.suggestedLinks.length > 0 && (
                        <div className="mt-3 space-y-2 border-t border-border/50 pt-3">
                          {msg.suggestedLinks.map((link, linkIdx) => (
                            <button
                              key={linkIdx}
                              onClick={() => handleLinkClick(link.url)}
                              className="flex w-full items-center gap-2 rounded-md bg-background/50 px-3 py-2 text-xs text-foreground hover:bg-background transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />
                              {link.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-lg bg-muted px-4 py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Disclaimer */}
            <div className="border-t border-border bg-muted/30 px-4 py-2">
              <p className="text-xs text-muted-foreground">
                {t(
                  'ai.chat.disclaimer',
                  'Asistentul oferă informații generale. Pentru probleme specifice, contactează suportul.'
                )}
              </p>
            </div>

            {/* Input */}
            <div className="border-t border-border p-4">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('ai.chat.inputPlaceholder', 'Scrie întrebarea ta...')}
                  disabled={loading}
                  className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label={t('ai.chat.send', 'Trimite')}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

