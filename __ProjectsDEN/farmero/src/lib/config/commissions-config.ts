/**
 * Commission Configuration
 * 
 * Configurație pentru nivelurile de comision
 * TODO: Mută în backend când API-ul este gata
 */

export interface CommissionTier {
  id: string
  label: string
  range: string
  rate: string
  description: string
  features: string[]
}

export const COMMISSION_TIERS: CommissionTier[] = [
  {
    id: 'starter',
    label: 'Începător',
    range: '0 – 5.000 lei / lună',
    rate: '8.5%',
    description: 'Ideal pentru producători care abia încep online.',
    features: [
      'Fără taxă de activare',
      'Poți porni și cu câteva produse',
      'Încasări săptămânale',
    ],
  },
  {
    id: 'growing',
    label: 'În creștere',
    range: '5.000 – 15.000 lei / lună',
    rate: '7.5%',
    description: 'Comision mai mic când vinzi mai mult.',
    features: [
      'Comision redus față de Starter',
      'Prioritate mai mare în listări & căutare',
      'Suport dedicat prin e-mail',
    ],
  },
  {
    id: 'partner',
    label: 'Partener stabil',
    range: '15.000+ lei / lună',
    rate: '6.5%',
    description: 'Pentru producători constanți, cu volum mare.',
    features: [
      'Comisionul minim disponibil',
      'Asistență pentru contracte B2B',
      'Campanii de promovare personalizate',
    ],
  },
]

/**
 * Get commission tier based on monthly sales
 */
export function getCommissionTier(monthlySales: number): CommissionTier {
  if (monthlySales >= 15000) {
    return COMMISSION_TIERS[2] // Partner
  } else if (monthlySales >= 5000) {
    return COMMISSION_TIERS[1] // Growing
  }
  return COMMISSION_TIERS[0] // Starter
}

