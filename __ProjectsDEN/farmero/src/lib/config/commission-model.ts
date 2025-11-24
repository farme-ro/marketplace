/**
 * Commission Model Configuration
 * 
 * Configurație pentru modelul de comision și abonamente producători
 * TODO: Mută aceste valori într-un config din backend când este disponibil
 */

export const COMMISSION_MODEL = {
  baseCommission: 0.10, // 10%
  tiers: [
    { upTo: 5000, commission: 0.10 }, // 10% până la 5000 lei/lună
    { upTo: 15000, commission: 0.09 }, // 9% între 5000-15000 lei/lună
    { upTo: Infinity, commission: 0.065 }, // 6.5% peste 15000 lei/lună
  ],
} as const

export const PRODUCER_SUBSCRIPTIONS = [
  {
    id: 'free',
    name: 'Gratuit',
    price: 0,
    currency: 'RON',
    highlight: 'Ideal la început',
    features: [
      'Listare produse în platformă',
      'Gestionare comenzi de bază',
      'Comision standard din vânzări',
    ],
  },
  {
    id: 'start',
    name: 'Start',
    price: 19,
    currency: 'EUR',
    highlight: 'Mai multă vizibilitate',
    features: [
      'Promovare ocazională în listări',
      'Acces la statistici simple',
      'Instrumente de recomandări produse',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 39,
    currency: 'EUR',
    highlight: 'Pentru producători activi',
    features: [
      'Poziționare mai bună în listări',
      'Acces la rapoarte detaliate',
      'Sugestii inteligente de preț & stoc',
      'Prioritate în campanii speciale',
    ],
  },
] as const

export type SubscriptionId = typeof PRODUCER_SUBSCRIPTIONS[number]['id']

