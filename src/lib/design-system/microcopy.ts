/**
 * Microcopy & Tone of Voice
 * 
 * Standardized microcopy for consistent, warm, human tone across the app
 * Replaces generic/robotic text with Farmero-specific voice
 */

export const microcopy = {
  // Actions
  actions: {
    submit: 'Trimite',
    save: 'Salvează modificările',
    cancel: 'Renunță',
    delete: 'Șterge',
    edit: 'Editează',
    add: 'Adaugă',
    create: 'Creează',
    update: 'Actualizează',
    confirm: 'Confirmă',
    close: 'Închide',
    back: 'Înapoi',
    next: 'Următorul',
    previous: 'Anterior',
    continue: 'Continuă',
    finish: 'Finalizează',
    search: 'Caută',
    filter: 'Filtrează',
    clear: 'Șterge filtrele',
    apply: 'Aplică',
    reset: 'Resetează',
  },

  // Empty states
  emptyStates: {
    noOrders: {
      title: 'Momentan nu ai comenzi',
      description: 'Începe să cumperi pentru a vedea comenzile tale aici.',
      action: 'Vezi produsele',
    },
    noProducts: {
      title: 'Momentan nu ai produse listate',
      description: 'Hai să adaugi primul produs și să începi să vinzi!',
      action: 'Adaugă primul produs',
    },
    noSubscriptions: {
      title: 'Nu ai abonamente active',
      description: 'Abonează-te la producătorii tăi preferați pentru a primi produse regulate.',
      action: 'Explorează abonamente',
    },
    noCampaigns: {
      title: 'Nu ai campanii active',
      description: 'Creează prima ta campanie de marketing pentru a-ți crește vizibilitatea.',
      action: 'Creează campanie',
    },
  },

  // Status messages
  status: {
    loading: 'Se încarcă...',
    saving: 'Se salvează...',
    deleting: 'Se șterge...',
    success: 'Succes!',
    error: 'A apărut o eroare',
    saved: 'Modificările au fost salvate',
    deleted: 'A fost șters cu succes',
    created: 'A fost creat cu succes',
    updated: 'A fost actualizat cu succes',
  },

  // Form labels & placeholders
  forms: {
    email: 'Adresa ta de email',
    password: 'Parola ta',
    name: 'Numele complet',
    phone: 'Număr de telefon',
    address: 'Adresa completă',
    city: 'Oraș',
    postalCode: 'Cod poștal',
    search: 'Caută produse, producători...',
    optional: '(opțional)',
    required: '(obligatoriu)',
  },

  // Confirmations
  confirmations: {
    delete: 'Ești sigur că vrei să ștergi?',
    cancel: 'Ești sigur că vrei să renunți? Modificările nesalvate vor fi pierdute.',
    logout: 'Ești sigur că vrei să te deconectezi?',
  },
} as const

/**
 * Get microcopy by key path
 * 
 * @example
 * getMicrocopy('actions.save') // 'Salvează modificările'
 */
export function getMicrocopy(path: string): string {
  const keys = path.split('.')
  let value: any = microcopy
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key]
    } else {
      return path // Fallback to path if not found
    }
  }
  
  return typeof value === 'string' ? value : path
}

