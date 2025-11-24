/**
 * Category Colors Configuration
 * 
 * Culori specifice pentru fiecare categorie, folosite în:
 * - Homepage categories section
 * - Products page filters
 * - Category pages
 */

export interface CategoryColorConfig {
  primary: string // Culoare principală pentru gradient și accent
  soft: string // Culoare soft pentru background
  shadow: string // Culoare pentru shadow hover
  icon: string // Culoare pentru icon
}

export const CATEGORY_COLORS: Record<string, CategoryColorConfig> = {
  'legume-fructe': {
    primary: 'hsl(120, 50%, 45%)', // Verde proaspăt
    soft: 'hsl(120, 40%, 90%)',
    shadow: 'hsl(120, 50%, 45%)',
    icon: 'hsl(120, 55%, 50%)',
  },
  'lactate': {
    primary: 'hsl(200, 60%, 50%)', // Albastru crem
    soft: 'hsl(200, 50%, 92%)',
    shadow: 'hsl(200, 60%, 50%)',
    icon: 'hsl(200, 65%, 55%)',
  },
  'carne-mezeluri': {
    primary: 'hsl(0, 60%, 50%)', // Roșu teracota
    soft: 'hsl(0, 40%, 92%)',
    shadow: 'hsl(0, 60%, 50%)',
    icon: 'hsl(0, 65%, 55%)',
  },
  'dulciuri': {
    primary: 'hsl(30, 70%, 55%)', // Portocaliu/Amber
    soft: 'hsl(30, 60%, 93%)',
    shadow: 'hsl(30, 70%, 55%)',
    icon: 'hsl(30, 75%, 60%)',
  },
  'bauturi-locale': {
    primary: 'hsl(280, 50%, 55%)', // Mov/Lavanda
    soft: 'hsl(280, 40%, 93%)',
    shadow: 'hsl(280, 50%, 55%)',
    icon: 'hsl(280, 55%, 60%)',
  },
  'altele': {
    primary: 'hsl(45, 60%, 50%)', // Galben/Amber
    soft: 'hsl(45, 50%, 93%)',
    shadow: 'hsl(45, 60%, 50%)',
    icon: 'hsl(45, 65%, 55%)',
  },
}

/**
 * Get color config for a category slug
 */
export function getCategoryColor(slug: string): CategoryColorConfig {
  return CATEGORY_COLORS[slug] || {
    primary: 'hsl(var(--primary))',
    soft: 'hsl(var(--primary-soft))',
    shadow: 'hsl(var(--primary))',
    icon: 'hsl(var(--primary))',
  }
}

/**
 * Get CSS custom properties for a category
 */
export function getCategoryCSSVars(slug: string): Record<string, string> {
  const colors = getCategoryColor(slug)
  return {
    '--category-primary': colors.primary,
    '--category-soft': colors.soft,
    '--category-shadow': colors.shadow,
    '--category-icon': colors.icon,
  }
}

