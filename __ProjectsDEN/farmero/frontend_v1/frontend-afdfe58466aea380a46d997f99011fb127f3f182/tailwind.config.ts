import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/farme-ui/**/*.{js,ts,jsx,tsx}',
  ],
      theme: {
        extend: {
          colors: {
            // Primary variants
            'primary-soft': 'hsl(var(--primary-soft))',
            'primary-hover': 'hsl(var(--primary-hover))',
            'primary-bg': 'hsl(var(--primary-bg))',
            // Secondary variants
            'secondary-soft': 'hsl(var(--secondary-soft))',
            // Background variants
            'background-alt': 'hsl(var(--background-alt))',
            // Muted background
            'muted-bg': 'hsl(var(--muted-bg))',
            // System colors (compatible with existing theme)
            background: 'hsl(var(--background))',
            foreground: 'hsl(var(--foreground))',
            'foreground-body': 'hsl(var(--foreground-body))',
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
          },
      fontFamily: {
        heading: ['Inter', 'Satoshi', 'Manrope', 'Poppins', 'sans-serif'],
        body: ['Inter', 'Manrope', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 10px 30px rgba(0, 0, 0, 0.04)',
        'premium-lg': '0 20px 40px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      maxWidth: {
        '8xl': '88rem', // 1408px - wider than 7xl (1280px)
      },
    },
  },
  plugins: [],
}

export default config

