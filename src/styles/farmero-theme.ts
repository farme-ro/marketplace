/**
 * Farmero Design System
 * 
 * Identitate vizuală: premium, organic, autentic
 * Valori: încredere, prospețime, natură, autenticitate, premium uman
 */

export const farmeroColors = {
  // Culori principale
  olive: {
    deep: '#3F5E4C', // Verde măsliniu profund - natură, încredere
    DEFAULT: '#3F5E4C',
  },
  cream: {
    warm: '#F6F1E9', // Crem cald - fundal soft
    DEFAULT: '#F6F1E9',
  },
  beige: {
    sand: '#D8CFC4', // Bej nisip - eleganță calmă
    DEFAULT: '#D8CFC4',
  },
  // Accente
  sage: {
    green: '#8FAE9D', // Verde salvie
    DEFAULT: '#8FAE9D',
  },
  earth: {
    brown: '#6B4F3F', // Maro pământiu
    DEFAULT: '#6B4F3F',
  },
  gold: {
    soft: '#C9A227', // Auriu soft - hover/accent rar
    DEFAULT: '#C9A227',
  },
  // Dark mode
  dark: {
    background: '#1F2A24', // Fundal dark
    card: '#2E3C35', // Carduri dark
    text: '#F4F4F4', // Text dark
    accent: '#8FAE9D', // Accente dark
  },
}

export const farmeroTypography = {
  // Titluri - Playfair Display / Cormorant Garamond (elegant, uman, premium)
  heading: {
    fontFamily: ['Playfair Display', 'Cormorant Garamond', 'serif'].join(', '),
    fontWeight: {
      light: 300,
      normal: 400,
      semibold: 600,
      bold: 700,
    },
  },
  // Body - Inter / Manrope / Nunito (lizibil, modern)
  body: {
    fontFamily: ['Inter', 'Manrope', 'Nunito', 'sans-serif'].join(', '),
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
    },
  },
}

export const farmeroSpacing = {
  xs: '0.5rem', // 8px
  sm: '0.75rem', // 12px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  '2xl': '3rem', // 48px
  '3xl': '4rem', // 64px
  '4xl': '6rem', // 96px
}

export const farmeroShadows = {
  soft: '0 2px 8px rgba(63, 94, 76, 0.08)',
  medium: '0 4px 16px rgba(63, 94, 76, 0.12)',
  large: '0 8px 24px rgba(63, 94, 76, 0.16)',
  hover: '0 6px 20px rgba(63, 94, 76, 0.15)',
}

export const farmeroBorderRadius = {
  sm: '0.5rem', // 8px
  md: '0.75rem', // 12px
  lg: '1rem', // 16px
  xl: '1.5rem', // 24px
  '2xl': '2rem', // 32px
  full: '9999px',
}

export const farmeroTransitions = {
  fast: '150ms ease-out',
  normal: '250ms ease-out',
  slow: '350ms ease-out',
  smooth: '400ms cubic-bezier(0.4, 0, 0.2, 1)',
}

