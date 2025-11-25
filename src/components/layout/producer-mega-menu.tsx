/**
 * Producer Mega Menu Component
 * 
 * Mega-menu modern și funcțional pentru "Pentru producători" în navbar
 */

'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import type { AuthUser } from '@/lib/api/auth'
import {
  TrendingUp,
  DollarSign,
  Truck,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Star,
  BarChart3,
  HelpCircle,
  ArrowRight,
  LogIn,
  UserPlus,
  BookOpen,
} from 'lucide-react'

const menuColumns = [
  {
    title: 'Începe',
    items: [
      {
        icon: TrendingUp,
        title: 'De ce să vinzi pe farme.ro',
        description: 'Află beneficiile',
        href: '/pentru-producatori',
        highlight: true,
      },
      {
        icon: DollarSign,
        title: 'Comisioane și taxe',
        description: 'Model transparent',
        href: '/fees',
      },
      {
        icon: Truck,
        title: 'Ghid livrări & logistică',
        description: 'Cum funcționează',
        href: '/portal-producatori/ghid-livrare',
      },
      {
        icon: BookOpen,
        title: 'Ghid producător',
        description: 'Începe aici',
        href: '/portal-producatori/ghid-producatori',
      },
    ],
  },
  {
    title: 'Portal producători',
    items: [
      {
        icon: LayoutDashboard,
        title: 'Dashboard producător',
        description: 'Panou de control',
        href: '/producer-portal/dashboard',
      },
      {
        icon: Package,
        title: 'Gestionează produse',
        description: 'Adaugă și editează',
        href: '/portal-producatori/produse',
      },
      {
        icon: ShoppingCart,
        title: 'Comenzi',
        description: 'Gestionează comenzile',
        href: '/portal-producatori/comenzi',
      },
      {
        icon: BarChart3,
        title: 'Statistici & insight-uri',
        description: 'Analizează performanța',
        href: '/producer-portal/insights',
      },
    ],
  },
  {
    title: 'Și mai mult',
    items: [
      {
        icon: Star,
        title: 'Abonamente & beneficii',
        description: 'Vizibilitate crescută',
        href: '/portal-producatori/abonamente',
      },
      {
        icon: DollarSign,
        title: 'Comisioane în portal',
        description: 'Detalii comisioane',
        href: '/portal-producatori/comisioane',
      },
      {
        icon: HelpCircle,
        title: 'Suport producători',
        description: 'Ajutor și asistență',
        href: '/portal-producatori/suport',
      },
      {
        icon: LogIn,
        title: 'Autentificare producători',
        description: 'Accesează portalul',
        href: '/producer-portal/login',
        highlight: true,
      },
    ],
  },
]

interface ProducerMegaMenuProps {
  isOpen: boolean
  onClose: () => void
  triggerRef?: React.RefObject<HTMLElement>
  user?: AuthUser | null
}

export function ProducerMegaMenu({ isOpen, onClose, triggerRef, user }: ProducerMegaMenuProps) {
  // Adjust menu content based on user role
  const isCustomer = user?.role === 'CUSTOMER'
  const isProducerCompany = user?.role === 'PRODUCER' && (user as import('@/lib/api/auth').ProducerUser).type === 'COMPANY'
  
  // Customer-specific menu columns
  const customerMenuColumns = [
    {
      title: 'Contul tău',
      items: [
        {
          icon: LayoutDashboard,
          title: 'Contul meu',
          description: 'Panou de control',
          href: '/account',
          highlight: true,
        },
        {
          icon: ShoppingCart,
          title: 'Comenzile mele',
          description: 'Istoric comenzi',
          href: '/orders',
        },
        {
          icon: Package,
          title: 'Produse favorite',
          description: 'Lista de favorite',
          href: '/account#favorites',
        },
      ],
    },
    {
      title: 'Explorează',
      items: [
        {
          icon: TrendingUp,
          title: 'Producători locali',
          description: 'Descoperă producători',
          href: '/producers',
        },
        {
          icon: Star,
          title: 'Produse populare',
          description: 'Cele mai vândute',
          href: '/products',
        },
        {
          icon: HelpCircle,
          title: 'Întrebări frecvente',
          description: 'FAQ',
          href: '/faq',
        },
      ],
    },
  ]
  
  // Filter menu columns based on user role
  const filteredColumns = isCustomer 
    ? customerMenuColumns 
    : menuColumns.map(column => {
        // For producers or non-logged users, show all items
        return column
      }).filter(column => column.items.length > 0)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      
      // Don't close if clicking on trigger or menu
      if (
        menuRef.current?.contains(target) ||
        triggerRef?.current?.contains(target)
      ) {
        return
      }
      
      onClose()
    }

    // Close on escape key
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose, triggerRef])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/10 backdrop-blur-sm z-30"
          />
          
          {/* Menu */}
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed top-16 left-0 right-0 bg-card/95 backdrop-blur-md border-b border-border shadow-xl z-50"
            onMouseLeave={onClose}
          >
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className={cn(
                "grid gap-8",
                filteredColumns.length === 1 ? "grid-cols-1" : filteredColumns.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3"
              )}>
                {filteredColumns.map((column, colIndex) => (
                  <motion.div
                    key={colIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: colIndex * 0.05 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                      {column.title}
                    </h3>
                    <div className="space-y-2">
                      {column.items.map((item, itemIndex) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={itemIndex}
                            href={item.href}
                            onClick={onClose}
                            className={cn(
                              "group block rounded-lg transition-all duration-200",
                              item.highlight
                                ? "bg-primary-soft/50 hover:bg-primary-soft border border-primary/20"
                                : "hover:bg-muted/50"
                            )}
                          >
                            <div className="p-3">
                              <div className="flex items-start gap-3">
                                <div className={cn(
                                  "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                                  item.highlight
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-primary-soft text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                                )}>
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <h4 className={cn(
                                      "text-sm font-semibold transition-colors",
                                      item.highlight
                                        ? "text-primary"
                                        : "text-foreground group-hover:text-primary"
                                    )}>
                                      {item.title}
                                    </h4>
                                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {item.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* CTA Section - Only show for non-customers */}
              {!isCustomer && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="mt-8 pt-8 border-t border-border"
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">
                        Nu ești încă producător partener?
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Înregistrează-te acum și începe să vinzi produsele tale
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        href="/portal-producatori/register"
                        onClick={onClose}
                        className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                      >
                        <UserPlus className="w-4 h-4" />
                        Devino producător
                      </Link>
                      <Link
                        href="/portal-producatori/login"
                        onClick={onClose}
                        className="px-4 py-2 border border-border hover:bg-muted rounded-lg text-sm font-medium transition-colors"
                      >
                        Autentificare
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
