import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // System colors (compatible with CSS variables)
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        // Farmero brand colors
        'farmero-olive': {
          50: '#f5f7f0',
          100: '#e9ede0',
          200: '#d3dac1',
          300: '#b4c096',
          400: '#96a673',
          500: '#7a8b5a',
          600: '#5f6e47',
          700: '#4a5639',
          800: '#3d4630',
          900: '#343c2a',
          950: '#1a1f14',
        },
        'farmero-terracotta': {
          50: '#fef5f3',
          100: '#fde8e3',
          200: '#fbd5cc',
          300: '#f7b5a8',
          400: '#f28a75',
          500: '#e8654d',
          600: '#d64a2f',
          700: '#b43a24',
          800: '#953322',
          900: '#7c3121',
          950: '#43170d',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}

export default config

