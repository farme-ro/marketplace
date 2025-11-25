/** @type {import('next').NextConfig} */
// Make bundle analyzer optional - only use if available and ANALYZE env var is set
let withBundleAnalyzer = (config) => config
try {
  if (process.env.ANALYZE === 'true') {
    const bundleAnalyzer = require('@next/bundle-analyzer')
    withBundleAnalyzer = bundleAnalyzer({
      enabled: true,
    })
  }
} catch (error) {
  // Bundle analyzer not available, continue without it
  console.warn('@next/bundle-analyzer not available, skipping bundle analysis')
}

const nextConfig = {
  transpilePackages: ['farme-ui'],
  experimental: {
    // Enable server components external packages if needed
  },
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: [
      'api.farme.ro',
      'farme.ro',
      // Add other image domains as needed
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.farme.ro',
      },
    ],
  },
  // Compression
  compress: true,
  // Production optimizations
  swcMinify: true,
  // Content Security Policy headers
  async headers() {
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    // Build connect-src directive - allow localhost in development
    const connectSrc = isDevelopment
      ? "connect-src 'self' https://api.farme.ro https://farme.ro https://vercel.live wss://vercel.live http://localhost:* ws://localhost:*"
      : "connect-src 'self' https://api.farme.ro https://farme.ro https://vercel.live wss://vercel.live"
    
    return [
      {
        // Exclude Next.js internal routes from CSP headers
        source: '/:path((?!_next|api).*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // In development, allow more permissive script sources for Next.js hot reload
              isDevelopment 
                ? "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live http://localhost:* https://localhost:*"
                : "script-src 'self' 'unsafe-inline' https://vercel.live",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https: http:", // Allow all stylesheet sources
              "font-src 'self' https://fonts.gstatic.com data: https:",
              "img-src 'self' data: https: blob:",
              connectSrc,
              "frame-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              // Only upgrade insecure requests in production
              ...(isDevelopment ? [] : ["upgrade-insecure-requests"]),
            ].join('; '),
          },
        ],
      },
    ]
  },
  // Fix for Next.js module resolution
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    
    // Explicitly configure path aliases for webpack
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    }
    
    // Exclude old folders from build
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        '**/node_modules/**',
        '**/__ProjectsDEN/**',
        '**/frontend_v1/**',
        '**/frontend-*/**',
        '**/_old_frontends/**',
      ],
    }
    return config
  },
  // Redirects for route localization (EN → RO)
  async redirects() {
    return [
      // Products
      {
        source: '/products',
        destination: '/produse',
        permanent: true,
      },
      {
        source: '/products/:slug*',
        destination: '/produse/:slug*',
        permanent: true,
      },
      // Producers
      {
        source: '/producers',
        destination: '/producatori',
        permanent: true,
      },
      {
        source: '/producers/:slug*',
        destination: '/producatori/:slug*',
        permanent: true,
      },
      // Producer Portal
      {
        source: '/producer-portal/:path*',
        destination: '/portal-producatori/:path*',
        permanent: true,
      },
      // Business Portal
      {
        source: '/business-portal/:path*',
        destination: '/portal-business/:path*',
        permanent: true,
      },
      // Logistics Portal
      {
        source: '/logistics-portal/:path*',
        destination: '/portal-logistica/:path*',
        permanent: true,
      },
      // Investor Portal
      {
        source: '/investor-portal/:path*',
        destination: '/portal-investitori/:path*',
        permanent: true,
      },
      // Importer Portal
      {
        source: '/importer-portal/:path*',
        destination: '/portal-importatori/:path*',
        permanent: true,
      },
      // About
      {
        source: '/about',
        destination: '/despre-noi',
        permanent: true,
      },
      // Fees
      {
        source: '/fees',
        destination: '/comisioane-taxe',
        permanent: true,
      },
      // FAQ
      {
        source: '/faq',
        destination: '/intrebari-frecvente',
        permanent: true,
      },
      // Cart
      {
        source: '/cart',
        destination: '/cos',
        permanent: true,
      },
      // Producer Portal sub-routes
      {
        source: '/portal-producatori/orders',
        destination: '/portal-producatori/comenzi',
        permanent: true,
      },
      {
        source: '/portal-producatori/orders/:path*',
        destination: '/portal-producatori/comenzi/:path*',
        permanent: true,
      },
      {
        source: '/portal-producatori/products',
        destination: '/portal-producatori/produse',
        permanent: true,
      },
      {
        source: '/portal-producatori/products/:path*',
        destination: '/portal-producatori/produse/:path*',
        permanent: true,
      },
      {
        source: '/portal-producatori/produse/new',
        destination: '/portal-producatori/produse/adauga',
        permanent: true,
      },
      {
        source: '/portal-producatori/produse/:id/edit',
        destination: '/portal-producatori/produse/:id/editeaza',
        permanent: true,
      },
      {
        source: '/portal-producatori/shipping-guide',
        destination: '/portal-producatori/ghid-livrare',
        permanent: true,
      },
      {
        source: '/portal-producatori/guide',
        destination: '/portal-producatori/ghid-producatori',
        permanent: true,
      },
      {
        source: '/portal-producatori/finances',
        destination: '/portal-producatori/finante',
        permanent: true,
      },
      {
        source: '/portal-producatori/commissions',
        destination: '/portal-producatori/comisioane',
        permanent: true,
      },
      {
        source: '/portal-producatori/subscriptions',
        destination: '/portal-producatori/abonamente',
        permanent: true,
      },
      {
        source: '/portal-producatori/marketing',
        destination: '/portal-producatori/marketing-promovare',
        permanent: true,
      },
      {
        source: '/portal-producatori/documents',
        destination: '/portal-producatori/documente',
        permanent: true,
      },
      {
        source: '/portal-producatori/contracts',
        destination: '/portal-producatori/contracte',
        permanent: true,
      },
      {
        source: '/portal-producatori/contracts/:path*',
        destination: '/portal-producatori/contracte/:path*',
        permanent: true,
      },
      {
        source: '/portal-producatori/support',
        destination: '/portal-producatori/suport',
        permanent: true,
      },
    ]
  },
}

module.exports = withBundleAnalyzer(nextConfig)

