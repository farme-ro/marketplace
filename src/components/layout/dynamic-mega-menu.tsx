/**
 * Dynamic Mega Menu Component
 * 
 * Mega-menu adaptiv care se schimbă în funcție de tipul de utilizator
 * Suportă: producători, afaceri (B2B), clienți, importatori, investitori
 */

'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import type { AuthUser } from '@/lib/api/auth'
import { useI18n } from '@/lib/i18n/context'
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
  Store,
  Users,
  Building2,
  Globe,
  TrendingDown,
  Briefcase,
  Handshake,
  FileText,
  CreditCard,
  Heart,
  ShoppingBag,
  User,
  Settings,
  MapPin,
  Clock,
  FileCheck,
} from 'lucide-react'

// Helper type for menu items
type MenuItem = {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  href: string
  highlight?: boolean
}

type MenuColumn = {
  title: string
  items: MenuItem[]
}

// Menu content for producers
function getProducersMenuColumns(t: (key: string, fallback: string) => string): MenuColumn[] {
  return [
  {
    title: t('megaMenu.producers.start', 'Începe'),
    items: [
      {
        icon: TrendingUp,
        title: t('megaMenu.producers.why.title', 'De ce să vinzi pe farme.ro'),
        description: t('megaMenu.producers.why.description', 'Află beneficiile'),
        href: '/pentru-producatori',
        highlight: true,
      },
      {
        icon: DollarSign,
        title: t('megaMenu.producers.fees.title', 'Comisioane și taxe'),
        description: t('megaMenu.producers.fees.description', 'Model transparent'),
        href: '/comisioane-taxe',
      },
      {
        icon: Truck,
        title: t('megaMenu.producers.shipping.title', 'Ghid livrări & logistică'),
        description: t('megaMenu.producers.shipping.description', 'Cum funcționează'),
        href: '/portal-producatori/ghid-livrare',
      },
      {
        icon: BookOpen,
        title: t('megaMenu.producers.guide.title', 'Ghid producător'),
        description: t('megaMenu.producers.guide.description', 'Începe aici'),
        href: '/portal-producatori/ghid-producatori',
      },
    ],
  },
  {
    title: t('megaMenu.producers.portal', 'Portal producători'),
    items: [
      {
        icon: LayoutDashboard,
        title: t('megaMenu.producers.dashboard.title', 'Dashboard producător'),
        description: t('megaMenu.producers.dashboard.description', 'Panou de control'),
        href: '/portal-producatori/dashboard',
      },
      {
        icon: Package,
        title: t('megaMenu.producers.products.title', 'Gestionează produse'),
        description: t('megaMenu.producers.products.description', 'Adaugă și editează'),
        href: '/portal-producatori/produse',
      },
      {
        icon: ShoppingCart,
        title: t('megaMenu.producers.orders.title', 'Comenzi'),
        description: t('megaMenu.producers.orders.description', 'Gestionează comenzile'),
        href: '/portal-producatori/comenzi',
      },
      {
        icon: BarChart3,
        title: t('megaMenu.producers.stats.title', 'Statistici & insight-uri'),
        description: t('megaMenu.producers.stats.description', 'Analizează performanța'),
        href: '/portal-producatori/insights',
      },
    ],
  },
  {
    title: t('megaMenu.producers.more', 'Și mai mult'),
    items: [
      {
        icon: Star,
        title: t('megaMenu.producers.subscriptions.title', 'Abonamente & beneficii'),
        description: t('megaMenu.producers.subscriptions.description', 'Vizibilitate crescută'),
        href: '/portal-producatori/abonamente',
      },
      {
        icon: DollarSign,
        title: t('megaMenu.producers.commissions.title', 'Comisioane în portal'),
        description: t('megaMenu.producers.commissions.description', 'Detalii comisioane'),
        href: '/portal-producatori/comisioane',
      },
      {
        icon: HelpCircle,
        title: t('megaMenu.producers.support.title', 'Suport producători'),
        description: t('megaMenu.producers.support.description', 'Ajutor și asistență'),
        href: '/portal-producatori/suport',
      },
      {
        icon: LogIn,
        title: t('megaMenu.producers.login.title', 'Autentificare producători'),
        description: t('megaMenu.producers.login.description', 'Accesează portalul'),
        href: '/portal-producatori/login',
        highlight: true,
      },
    ],
  }
]
}

// Menu content for businesses (B2B - restaurants, cafes, etc.)
function getBusinessesMenuColumns(t: (key: string, fallback: string) => string): MenuColumn[] {
  return [
  {
        title: t('megaMenu.businesses.forBusiness', 'Pentru afaceri'),
        items: [
          {
            icon: Store,
            title: t('megaMenu.businesses.why.title', 'De ce farme.ro pentru afacerea ta'),
            description: t('megaMenu.businesses.why.description', 'Beneficii pentru restaurante'),
            href: '/b2b',
            highlight: true,
          },
          {
            icon: ShoppingBag,
            title: t('megaMenu.businesses.bulk.title', 'Cumpărări în cantități mari'),
            description: t('megaMenu.businesses.bulk.description', 'Prețuri speciale B2B'),
            href: '/b2b#bulk-orders',
          },
          {
            icon: Truck,
            title: t('megaMenu.businesses.scheduled.title', 'Livrări programate'),
            description: t('megaMenu.businesses.scheduled.description', 'Logistică dedicată'),
            href: '/b2b#scheduled-delivery',
          },
          {
            icon: FileText,
            title: t('megaMenu.businesses.invoicing.title', 'Facturare și contracte'),
            description: t('megaMenu.businesses.invoicing.description', 'Soluții profesionale'),
            href: '/b2b#invoicing',
          },
        ],
      },
      {
        title: t('megaMenu.businesses.services', 'Servicii'),
        items: [
          {
            icon: Users,
            title: t('megaMenu.businesses.account.title', 'Cont dedicat B2B'),
            description: t('megaMenu.businesses.account.description', 'Acces la portal business'),
            href: '/b2b/register',
          },
          {
            icon: CreditCard,
            title: t('megaMenu.businesses.payment.title', 'Plăți flexibile'),
            description: t('megaMenu.businesses.payment.description', 'Termen de plată extins'),
            href: '/b2b#payment-terms',
          },
          {
            icon: BarChart3,
            title: t('megaMenu.businesses.reports.title', 'Rapoarte și analize'),
            description: t('megaMenu.businesses.reports.description', 'Insight-uri pentru afacere'),
            href: '/b2b#analytics',
          },
          {
            icon: HelpCircle,
            title: t('megaMenu.businesses.support.title', 'Suport dedicat'),
            description: t('megaMenu.businesses.support.description', 'Echipa pentru business'),
            href: '/contact?type=b2b',
          },
        ],
      },
      {
        title: t('megaMenu.businesses.resources', 'Resurse'),
        items: [
          {
            icon: BookOpen,
            title: t('megaMenu.businesses.guide.title', 'Ghid pentru restaurante'),
            description: t('megaMenu.businesses.guide.description', 'Cum să cumperi eficient'),
            href: '/b2b/guide',
          },
      {
        icon: Star,
        title: t('megaMenu.businesses.recommended.title', 'Producători recomandați'),
        description: t('megaMenu.businesses.recommended.description', 'Parteneri verificați'),
        href: '/producatori',
      },
          {
            icon: TrendingUp,
            title: t('megaMenu.businesses.success.title', 'Cazuri de succes'),
            description: t('megaMenu.businesses.success.description', 'Povești de la parteneri'),
            href: '/b2b#success-stories',
          },
          {
            icon: LogIn,
            title: t('megaMenu.businesses.login.title', 'Autentificare B2B'),
            description: t('megaMenu.businesses.login.description', 'Accesează contul'),
            href: '/b2b/login',
            highlight: true,
          },
        ],
      },
    ]
}

// Menu content for customers
function getCustomersMenuColumns(t: (key: string, fallback: string) => string): MenuColumn[] {
  return [
  {
    title: t('megaMenu.customers.account', 'Contul tău'),
    items: [
      {
        icon: User,
        title: t('megaMenu.customers.profile.title', 'Profilul meu'),
        description: t('megaMenu.customers.profile.description', 'Setări și preferințe'),
        href: '/account',
        highlight: true,
      },
      {
        icon: ShoppingCart,
        title: t('megaMenu.customers.orders.title', 'Comenzile mele'),
        description: t('megaMenu.customers.orders.description', 'Istoric comenzi'),
        href: '/orders',
      },
      {
        icon: Heart,
        title: t('megaMenu.customers.favorites.title', 'Produse favorite'),
        description: t('megaMenu.customers.favorites.description', 'Lista de favorite'),
        href: '/account#favorites',
      },
      {
        icon: CreditCard,
        title: t('megaMenu.customers.payment.title', 'Metode de plată'),
        description: t('megaMenu.customers.payment.description', 'Carduri salvate'),
        href: '/account#payment-methods',
      },
    ],
  },
  {
    title: t('megaMenu.customers.explore', 'Explorează'),
    items: [
      {
        icon: Store,
        title: t('megaMenu.customers.producers.title', 'Producători locali'),
        description: t('megaMenu.customers.producers.description', 'Descoperă producători'),
        href: '/producatori',
      },
      {
        icon: Package,
        title: t('megaMenu.customers.popular.title', 'Produse populare'),
        description: t('megaMenu.customers.popular.description', 'Cele mai vândute'),
        href: '/produse',
      },
      {
        icon: BookOpen,
        title: t('megaMenu.customers.journal.title', 'Jurnal de farme.ro'),
        description: t('megaMenu.customers.journal.description', 'Povești despre producători'),
        href: '/jurnal-de-farmero',
      },
      {
        icon: Star,
        title: t('megaMenu.customers.recommended.title', 'Produse recomandate'),
        description: t('megaMenu.customers.recommended.description', 'Pentru tine'),
        href: '/produse?recommended=true',
      },
      {
        icon: TrendingUp,
        title: t('megaMenu.customers.special.title', 'Oferte speciale'),
        description: t('megaMenu.customers.special.description', 'Reduceri și promoții'),
        href: '/produse?onSale=true',
      },
    ],
  },
  {
    title: t('megaMenu.customers.help', 'Ajutor'),
    items: [
      {
        icon: HelpCircle,
        title: t('megaMenu.customers.faq.title', 'Întrebări frecvente'),
        description: t('megaMenu.customers.faq.description', 'FAQ'),
        href: '/intrebari-frecvente',
      },
      {
        icon: BookOpen,
        title: t('megaMenu.customers.howItWorks.title', 'Cum funcționează'),
        description: t('megaMenu.customers.howItWorks.description', 'Ghid complet'),
        href: '/cum-functioneaza-si-impact',
      },
      {
        icon: Truck,
        title: t('megaMenu.customers.delivery.title', 'Livrări și retururi'),
        description: t('megaMenu.customers.delivery.description', 'Politici de livrare'),
        href: '/faq#delivery',
      },
      {
        icon: Settings,
        title: t('megaMenu.customers.settings.title', 'Setări cont'),
        description: t('megaMenu.customers.settings.description', 'Gestionează preferințele'),
        href: '/account#settings',
      },
    ],
  }
]
}

// Menu content for importers
function getImportersMenuColumns(t: (key: string, fallback: string) => string): MenuColumn[] {
  return [
  {
    title: t('megaMenu.importers.forImporters', 'Pentru importatori'),
    items: [
      {
        icon: Globe,
        title: t('megaMenu.importers.why.title', 'De ce farme.ro pentru importatori'),
        description: t('megaMenu.importers.why.description', 'Beneficii și oportunități'),
        href: '/pentru-importatori',
        highlight: true,
      },
      {
        icon: Package,
        title: t('megaMenu.importers.products.title', 'Produse românești premium'),
        description: t('megaMenu.importers.products.description', 'Calitate export'),
        href: '/pentru-importatori#products',
      },
      {
        icon: Handshake,
        title: t('megaMenu.importers.partnerships.title', 'Parteneriate strategice'),
        description: t('megaMenu.importers.partnerships.description', 'Colaborări pe termen lung'),
        href: '/pentru-importatori#partnerships',
      },
      {
        icon: FileText,
        title: t('megaMenu.importers.certifications.title', 'Documentație și certificări'),
        description: t('megaMenu.importers.certifications.description', 'Conformitate export'),
        href: '/pentru-importatori#certifications',
      },
    ],
  },
  {
    title: t('megaMenu.importers.services', 'Servicii'),
    items: [
      {
        icon: Truck,
        title: t('megaMenu.importers.logistics.title', 'Logistică internațională'),
        description: t('megaMenu.importers.logistics.description', 'Livrări în UE și dincolo'),
        href: '/pentru-importatori#logistics',
      },
      {
        icon: DollarSign,
        title: t('megaMenu.importers.pricing.title', 'Prețuri competitive'),
        description: t('megaMenu.importers.pricing.description', 'Negocieri directe'),
        href: '/pentru-importatori#pricing',
      },
      {
        icon: BarChart3,
        title: t('megaMenu.importers.volume.title', 'Volum și disponibilitate'),
        description: t('megaMenu.importers.volume.description', 'Cantități mari'),
        href: '/pentru-importatori#volumes',
      },
      {
        icon: HelpCircle,
        title: t('megaMenu.importers.support.title', 'Suport dedicat'),
        description: t('megaMenu.importers.support.description', 'Echipa pentru importatori'),
        href: '/contact?type=importer',
      },
    ],
  },
  {
    title: t('megaMenu.importers.resources', 'Resurse'),
    items: [
      {
        icon: BookOpen,
        title: t('megaMenu.importers.guide.title', 'Ghid pentru importatori'),
        description: t('megaMenu.importers.guide.description', 'Cum funcționează'),
        href: '/pentru-importatori/guide',
      },
      {
        icon: Store,
        title: t('megaMenu.importers.verified.title', 'Producători verificați'),
        description: t('megaMenu.importers.verified.description', 'Parteneri de încredere'),
        href: '/producatori',
      },
      {
        icon: TrendingUp,
        title: t('megaMenu.importers.opportunities.title', 'Oportunități de piață'),
        description: t('megaMenu.importers.opportunities.description', 'Tendințe și cerințe'),
        href: '/pentru-importatori#market-opportunities',
      },
      {
        icon: LogIn,
        title: t('megaMenu.importers.contact.title', 'Contactează echipa'),
        description: t('megaMenu.importers.contact.description', 'Discută cu specialiștii'),
        href: '/contact?type=importer',
        highlight: true,
      },
    ],
  }
]
}

// Menu content for logistics partners
function getLogisticsMenuColumns(t: (key: string, fallback: string) => string): MenuColumn[] {
  return [
  {
    title: t('megaMenu.logistics.services', 'Servicii de logistică'),
    items: [
      {
        icon: Truck,
        title: t('megaMenu.logistics.temperature.title', 'Livrări cu temperatură controlată'),
        description: t('megaMenu.logistics.temperature.description', 'Transport frigorific pentru produse proaspete'),
        href: '/pentru-logistica#servicii',
        highlight: true,
      },
      {
        icon: Building2,
        title: t('megaMenu.logistics.storage.title', 'Depozitare și cross-docking'),
        description: t('megaMenu.logistics.storage.description', 'Soluții flexibile de stocare'),
        href: '/pentru-logistica#depozitare',
      },
      {
        icon: Package,
        title: t('megaMenu.logistics.packaging.title', 'Servicii de ambalare'),
        description: t('megaMenu.logistics.packaging.description', 'Ambalare profesională pentru siguranță'),
        href: '/pentru-logistica#ambalare',
      },
      {
        icon: MapPin,
        title: t('megaMenu.logistics.routes.title', 'Optimizare rute'),
        description: t('megaMenu.logistics.routes.description', 'Eficiență maximă în livrări'),
        href: '/pentru-logistica#rute',
      },
    ],
  },
  {
    title: t('megaMenu.logistics.partnership', 'Parteneriat'),
    items: [
      {
        icon: Handshake,
        title: t('megaMenu.logistics.why.title', 'De ce să devii partener'),
        description: t('megaMenu.logistics.why.description', 'Beneficii și oportunități de creștere'),
        href: '/pentru-logistica#parteneriat',
      },
      {
        icon: DollarSign,
        title: t('megaMenu.logistics.commission.title', 'Model de comisionare'),
        description: t('megaMenu.logistics.commission.description', 'Structură transparentă și echitabilă'),
        href: '/pentru-logistica#comisioane',
      },
      {
        icon: BarChart3,
        title: t('megaMenu.logistics.stats.title', 'Statistici și rapoarte'),
        description: t('megaMenu.logistics.stats.description', 'Urmărește performanța ta'),
        href: '/pentru-logistica/dashboard#statistics',
      },
      {
        icon: Clock,
        title: t('megaMenu.logistics.scheduled.title', 'Livrări programate'),
        description: t('megaMenu.logistics.scheduled.description', 'Planificare și programare'),
        href: '/pentru-logistica#programare',
      },
    ],
  },
  {
    title: t('megaMenu.logistics.resources', 'Resurse'),
    items: [
      {
        icon: LayoutDashboard,
        title: t('megaMenu.logistics.portal.title', 'Portal parteneri logistică'),
        description: t('megaMenu.logistics.portal.description', 'Gestionează livrările și contractele'),
        href: '/portal-logistica/dashboard',
        highlight: true,
      },
      {
        icon: DollarSign,
        title: t('megaMenu.logistics.commissions.title', 'Comisioane & extrase'),
        description: t('megaMenu.logistics.commissions.description', 'Vezi comisioanele și extrasele'),
        href: '/portal-logistica/commissions',
      },
      {
        icon: FileCheck,
        title: t('megaMenu.logistics.contracts.title', 'Contracte logistică'),
        description: t('megaMenu.logistics.contracts.description', 'Accesează contractele tale'),
        href: '/portal-logistica/contracts',
      },
      {
        icon: HelpCircle,
        title: t('megaMenu.logistics.support.title', 'Suport dedicat'),
        description: t('megaMenu.logistics.support.description', 'Echipa pentru parteneri logistici'),
        href: '/contact?type=logistics',
      },
    ],
  }
]
}

// Menu content for "Devino partener" (unauthenticated users)
function getBecomePartnerMenuColumns(t: (key: string, fallback: string) => string): MenuColumn[] {
  return [
  {
    title: t('megaMenu.becomePartner.producers', 'Pentru producători'),
    items: [
      {
        icon: TrendingUp,
        title: t('megaMenu.becomePartner.becomeProducer.title', 'Devino producător'),
        description: t('megaMenu.becomePartner.becomeProducer.description', 'Vinde produsele tale online'),
        href: '/pentru-producatori',
        highlight: true,
      },
      {
        icon: DollarSign,
        title: t('megaMenu.becomePartner.fees.title', 'Comisioane și taxe'),
        description: t('megaMenu.becomePartner.fees.description', 'Model transparent'),
        href: '/comisioane-taxe',
      },
      {
        icon: BookOpen,
        title: t('megaMenu.becomePartner.howItWorks.title', 'Cum funcționează'),
        description: t('megaMenu.becomePartner.howItWorks.description', 'Ghid complet'),
        href: '/cum-functioneaza-si-impact',
      },
      {
        icon: UserPlus,
        title: t('megaMenu.becomePartner.register.title', 'Înregistrare producător'),
        description: t('megaMenu.becomePartner.register.description', 'Creează cont acum'),
        href: '/portal-producatori/register',
      },
    ],
  },
  {
    title: t('megaMenu.becomePartner.businesses', 'Pentru afaceri'),
    items: [
      {
        icon: Store,
        title: t('megaMenu.becomePartner.restaurants.title', 'Pentru restaurante'),
        description: t('megaMenu.becomePartner.restaurants.description', 'Cumpără direct de la producători'),
        href: '/b2b',
        highlight: true,
      },
      {
        icon: ShoppingBag,
        title: t('megaMenu.becomePartner.bulk.title', 'Cantități mari'),
        description: t('megaMenu.becomePartner.bulk.description', 'Prețuri speciale B2B'),
        href: '/b2b#bulk-orders',
      },
      {
        icon: CreditCard,
        title: t('megaMenu.becomePartner.payment.title', 'Plăți flexibile'),
        description: t('megaMenu.becomePartner.payment.description', 'Termen de plată extins'),
        href: '/b2b#payment-terms',
      },
      {
        icon: UserPlus,
        title: t('megaMenu.becomePartner.b2bAccount.title', 'Cont B2B'),
        description: t('megaMenu.becomePartner.b2bAccount.description', 'Înregistrează afacerea'),
        href: '/b2b/register',
      },
    ],
  },
  {
    title: t('megaMenu.becomePartner.other', 'Alte oportunități'),
    items: [
      {
        icon: Truck,
        title: t('megaMenu.becomePartner.logistics.title', 'Logistică și transport'),
        description: t('megaMenu.becomePartner.logistics.description', 'Colaboratori livrare și depozitare'),
        href: '/pentru-logistica',
        highlight: true,
      },
      {
        icon: Globe,
        title: t('megaMenu.becomePartner.importers.title', 'Pentru importatori'),
        description: t('megaMenu.becomePartner.importers.description', 'Produse românești premium'),
        href: '/pentru-importatori',
      },
      {
        icon: TrendingUp,
        title: t('megaMenu.becomePartner.investors.title', 'Pentru investitori'),
        description: t('megaMenu.becomePartner.investors.description', 'Oportunități de investiție'),
        href: '/pentru-investitori',
      },
      {
        icon: HelpCircle,
        title: t('megaMenu.becomePartner.questions.title', 'Ai întrebări?'),
        description: t('megaMenu.becomePartner.questions.description', 'Contactează-ne'),
        href: '/contact',
      },
    ],
  }
]
}

// Menu content for investors
function getInvestorsMenuColumns(t: (key: string, fallback: string) => string): MenuColumn[] {
  return [
  {
    title: t('megaMenu.investors.forInvestors', 'Pentru investitori'),
    items: [
      {
        icon: TrendingUp,
        title: t('megaMenu.investors.opportunities.title', 'Oportunități de investiție'),
        description: t('megaMenu.investors.opportunities.description', 'Agricultură și tech'),
        href: '/pentru-investitori',
        highlight: true,
      },
      {
        icon: BarChart3,
        title: t('megaMenu.investors.businessModel.title', 'Model de business'),
        description: t('megaMenu.investors.businessModel.description', 'Cum generăm valoare'),
        href: '/pentru-investitori#business-model',
      },
      {
        icon: DollarSign,
        title: t('megaMenu.investors.financials.title', 'Proiecții financiare'),
        description: t('megaMenu.investors.financials.description', 'Potențial de creștere'),
        href: '/pentru-investitori#financials',
      },
      {
        icon: Users,
        title: t('megaMenu.investors.team.title', 'Echipa și lideri'),
        description: t('megaMenu.investors.team.description', 'Cine suntem'),
        href: '/despre-noi#team',
      },
    ],
  },
  {
    title: t('megaMenu.investors.info', 'Informații'),
    items: [
      {
        icon: FileText,
        title: t('megaMenu.investors.pitchDeck.title', 'Pitch deck'),
        description: t('megaMenu.investors.pitchDeck.description', 'Prezentare investitori'),
        href: '/pentru-investitori#pitch-deck',
      },
      {
        icon: Building2,
        title: t('megaMenu.investors.strategy.title', 'Strategie și viitor'),
        description: t('megaMenu.investors.strategy.description', 'Planuri de expansiune'),
        href: '/pentru-investitori#strategy',
      },
      {
        icon: Globe,
        title: t('megaMenu.investors.market.title', 'Piața și concurența'),
        description: t('megaMenu.investors.market.description', 'Analiză de piață'),
        href: '/pentru-investitori#market-analysis',
      },
      {
        icon: HelpCircle,
        title: t('megaMenu.investors.faq.title', 'FAQ investitori'),
        description: t('megaMenu.investors.faq.description', 'Întrebări frecvente'),
        href: '/pentru-investitori#faq',
      },
    ],
  },
  {
    title: t('megaMenu.investors.contact', 'Contact'),
    items: [
      {
        icon: Handshake,
        title: t('megaMenu.investors.meeting.title', 'Programează o întâlnire'),
        description: t('megaMenu.investors.meeting.description', 'Discută cu fondatorii'),
        href: '/contact?type=investor',
        highlight: true,
      },
      {
        icon: Briefcase,
        title: t('megaMenu.investors.partnerships.title', 'Parteneriate strategice'),
        description: t('megaMenu.investors.partnerships.description', 'Colaborări corporative'),
        href: '/contact?type=partnership',
      },
      {
        icon: Star,
        title: t('megaMenu.investors.impact.title', 'Impact social'),
        description: t('megaMenu.investors.impact.description', 'Valoare pentru comunitate'),
        href: '/cum-functioneaza-si-impact#impact-section',
      },
      {
        icon: BookOpen,
        title: t('megaMenu.investors.about.title', 'Despre noi'),
        description: t('megaMenu.investors.about.description', 'Misiune și valori'),
        href: '/despre-noi',
      },
    ],
  }
]
}

type MenuType = 'producers' | 'businesses' | 'customers' | 'importers' | 'investors' | 'logistics' | 'become-partner'

interface DynamicMegaMenuProps {
  isOpen: boolean
  onClose: () => void
  triggerRef?: React.RefObject<HTMLElement>
  user?: AuthUser | null
  menuType: MenuType
}

export function DynamicMegaMenu({ isOpen, onClose, triggerRef, user, menuType }: DynamicMegaMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const { t } = useI18n()

  // Get menu columns based on type
  const getMenuColumns = () => {
    switch (menuType) {
      case 'producers':
        return getProducersMenuColumns(t)
      case 'businesses':
        return getBusinessesMenuColumns(t)
      case 'customers':
        return getCustomersMenuColumns(t)
      case 'importers':
        return getImportersMenuColumns(t)
      case 'investors':
        return getInvestorsMenuColumns(t)
      case 'logistics':
        return getLogisticsMenuColumns(t)
      case 'become-partner':
        return getBecomePartnerMenuColumns(t)
      default:
        return getBecomePartnerMenuColumns(t)
    }
  }

  const menuColumns = getMenuColumns()
  const showCTA = menuType === 'producers' || menuType === 'businesses' || menuType === 'importers' || menuType === 'logistics' || menuType === 'become-partner'

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      
      if (
        menuRef.current?.contains(target) ||
        triggerRef?.current?.contains(target)
      ) {
        return
      }
      
      onClose()
    }

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
                menuColumns.length === 1 ? "grid-cols-1" : menuColumns.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3"
              )}>
                {menuColumns.map((column, colIndex) => (
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
              
              {/* CTA Section - Only for certain menu types */}
              {showCTA && !user && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="mt-8 pt-8 border-t border-border"
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">
                        {menuType === 'producers' && t('megaMenu.cta.producers.title', 'Nu ești încă producător partener?')}
                        {menuType === 'businesses' && t('megaMenu.cta.businesses.title', 'Ai un restaurant sau o afacere?')}
                        {menuType === 'importers' && t('megaMenu.cta.importers.title', 'Ești importator sau distribuitor?')}
                        {menuType === 'logistics' && t('megaMenu.cta.logistics.title', 'Ești partener de logistică sau transport?')}
                        {menuType === 'become-partner' && t('megaMenu.cta.becomePartner.title', 'Alege tipul de parteneriat potrivit pentru tine')}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {menuType === 'producers' && t('megaMenu.cta.producers.description', 'Înregistrează-te acum și începe să vinzi produsele tale')}
                        {menuType === 'businesses' && t('megaMenu.cta.businesses.description', 'Creează cont B2B și beneficiază de prețuri speciale')}
                        {menuType === 'importers' && t('megaMenu.cta.importers.description', 'Contactează echipa noastră pentru parteneriate')}
                        {menuType === 'logistics' && t('megaMenu.cta.logistics.description', 'Alătură-te rețelei noastre de parteneri logistici')}
                        {menuType === 'become-partner' && t('megaMenu.cta.becomePartner.description', 'De la producători la restaurante, importatori sau investitori')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {menuType === 'producers' && (
                        <>
                          <Link
                            href="/portal-producatori/register"
                            onClick={onClose}
                            className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                          >
                            <UserPlus className="w-4 h-4" />
                            {t('megaMenu.cta.producers.button', 'Devino producător')}
                          </Link>
                          <Link
                            href="/portal-producatori/login"
                            onClick={onClose}
                            className="px-4 py-2 border border-border hover:bg-muted rounded-lg text-sm font-medium transition-colors"
                          >
                            {t('megaMenu.cta.producers.login', 'Autentificare')}
                          </Link>
                        </>
                      )}
                      {menuType === 'businesses' && (
                        <>
                          <Link
                            href="/b2b/register"
                            onClick={onClose}
                            className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                          >
                            <UserPlus className="w-4 h-4" />
                            {t('megaMenu.cta.businesses.button', 'Creează cont B2B')}
                          </Link>
                          <Link
                            href="/contact?type=b2b"
                            onClick={onClose}
                            className="px-4 py-2 border border-border hover:bg-muted rounded-lg text-sm font-medium transition-colors"
                          >
                            {t('megaMenu.cta.businesses.contact', 'Contactează-ne')}
                          </Link>
                        </>
                      )}
                      {menuType === 'importers' && (
                        <Link
                          href="/contact?type=importer"
                          onClick={onClose}
                          className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                        >
                          <Handshake className="w-4 h-4" />
                          {t('megaMenu.cta.importers.button', 'Contactează echipa')}
                        </Link>
                      )}
                      {menuType === 'logistics' && (
                        <Link
                          href="/pentru-logistica/register"
                          onClick={onClose}
                          className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                        >
                          <UserPlus className="w-4 h-4" />
                          {t('megaMenu.cta.logistics.button', 'Devino partener logistic')}
                        </Link>
                      )}
                      {menuType === 'become-partner' && (
                        <>
                          <Link
                            href="/portal-producatori/register"
                            onClick={onClose}
                            className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                          >
                            <UserPlus className="w-4 h-4" />
                            {t('megaMenu.cta.becomePartner.producer', 'Devino producător')}
                          </Link>
                          <Link
                            href="/b2b/register"
                            onClick={onClose}
                            className="px-4 py-2 border border-border hover:bg-muted rounded-lg text-sm font-medium transition-colors"
                          >
                            {t('megaMenu.cta.becomePartner.b2b', 'Cont B2B')}
                          </Link>
                          <Link
                            href="/pentru-logistica/register"
                            onClick={onClose}
                            className="px-4 py-2 border border-border hover:bg-muted rounded-lg text-sm font-medium transition-colors"
                          >
                            {t('megaMenu.cta.becomePartner.logistics', 'Logistică')}
                          </Link>
                        </>
                      )}
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

