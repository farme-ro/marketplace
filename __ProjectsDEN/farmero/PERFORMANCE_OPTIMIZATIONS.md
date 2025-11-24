# Performance Optimizations

## Static Generation & ISR

### Static Pages (force-static)
These pages are fully static and don't need dynamic data:
- `/about` - About page
- `/contact` - Contact page (metadata static, content client-side)
- `/terms` - Terms and conditions
- `/privacy` - Privacy policy
- `/for-producers` - For producers page

### ISR Pages (Incremental Static Regeneration)
These pages are statically generated but refreshed periodically:

- **Homepage (`/`)**: Revalidates every 5 minutes (300s)
- **Products List (`/products`)**: Revalidates every 5 minutes (300s)
- **Product Detail (`/products/[slug]`)**: Revalidates every 5 minutes (300s)
- **Producers List (`/producers`)**: Revalidates every 10 minutes (600s)
- **Producer Detail (`/producers/[slug]`)**: Revalidates every 10 minutes (600s)

## Image Optimization

### Next.js Image Component
- All images use `next/image` for automatic optimization
- AVIF and WebP formats enabled
- Responsive image sizes configured
- Lazy loading enabled by default
- Blur placeholders for better UX

### Image Configuration
- Device sizes: 640, 750, 828, 1080, 1200, 1920, 2048, 3840
- Image sizes: 16, 32, 48, 64, 96, 128, 256, 384
- Remote patterns configured for farme.ro domains

## Bundle Size Optimization

### Current Dependencies
- Core: Next.js 14, React 18
- UI: farme-ui (local package)
- State: Zustand (lightweight)
- Utils: clsx, class-variance-authority

### Recommendations
1. Use dynamic imports for heavy components
2. Code splitting for routes
3. Tree shaking enabled (default in Next.js)
4. SWC minification enabled

## Performance Metrics Goals

### Lighthouse Scores (Target)
- Performance: >90
- Accessibility: >90
- Best Practices: >90
- SEO: >90

### Key Metrics
- First Contentful Paint (FCP): <1.8s
- Largest Contentful Paint (LCP): <2.5s
- Time to Interactive (TTI): <3.8s
- Cumulative Layout Shift (CLS): <0.1

## Monitoring

Use the `/status` page to monitor:
- Backend API response times
- Database connectivity
- HTTP status codes

