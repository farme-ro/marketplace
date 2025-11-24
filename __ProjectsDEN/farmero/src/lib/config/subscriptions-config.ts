/**
 * Producer Subscription Plans Configuration
 * 
 * Configurație pentru planurile de abonament producători
 * TODO: Mută în backend când API-ul este gata
 */

export interface SubscriptionPlan {
  id: string
  name: string
  price: string
  badge: string
  badgeColor: string
  features: string[]
  isPopular?: boolean
}

export const PRODUCER_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '0 lei / lună',
    badge: 'Recomandat pentru început',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    features: [
      'Listare produse în platformă',
      'Acces la comenzi online',
      'Acces la bazele de documentație',
      'Comision standard (8.5% / 7.5% / 6.5%)',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '49 lei / lună',
    badge: 'Cel mai popular',
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    isPopular: true,
    features: [
      'Toate beneficiile Starter',
      'Promovare periodică în listări',
      'Acces la unelte de comunicare cu clienții',
      'Notificări inteligente pentru stocuri',
      'Acces la tool-ul de postare social media (auto-poster light)',
      'Până la 5 postări generate / lună',
    ],
  },
  {
    id: 'pro-partner',
    name: 'Pro Partner',
    price: '99 lei / lună',
    badge: 'Pentru producători mari',
    badgeColor: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    features: [
      'Toate beneficiile Growth',
      'Promovare prioritară în rezultate',
      'Statistici detaliate despre clienți și comenzi',
      'Tool social media avansat (auto-poster, template-uri, sugestii de text)',
      'Postări nelimitate generate',
      'Consultanță periodică via platformă',
      'Evidențiere premium în platformă',
    ],
  },
]

