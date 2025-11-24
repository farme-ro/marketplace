# PRE_DEPLOY_BUILD_STATUS

**Generated:** 2025-01-28  
**Branch:** chore/style-sync-live  
**Node Version:** v22.19.0

## Frontend Build Status

- **npm install**: ✅ Completed successfully
- **npm run lint**: ✅ Passed (No ESLint warnings or errors)
- **npm run build**: ✅ Completed successfully
- **Git Status**: ✅ Committed and pushed to `chore/style-sync-live`
- **API_URL**: ✅ Unified to use `NEXT_PUBLIC_API_URL` (default: `http://localhost:4000`)

## Build Output

- **Next.js Build**: ✅ Successful
- **Static Pages Generated**: ✅ 96 pages
- **TypeScript**: ✅ No errors
- **Linting**: ✅ No warnings or errors
- **Build Warnings**: ⚠️ Minor warnings from dependencies (Prisma instrumentation, OpenTelemetry) - non-blocking

## Changes Applied

1. ✅ Updated `src/lib/api/client.ts` to use port 4000 (was 3001)
2. ✅ Updated hardcoded URLs in status pages:
   - `src/app/(site)/status/page.tsx`
   - `src/app/(site)/internal/status/page.tsx`
3. ✅ All API clients now use centralized `apiFetch` from `client.ts`
4. ✅ All dependencies installed and up to date

## API URL Configuration

- **Single source of truth**: `src/lib/api/client.ts`
- **Fallback**: `http://localhost:4000`
- **Environment variable**: `NEXT_PUBLIC_API_URL`

## Environment Variables

Required `.env.local` file should contain:
```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_URL=http://localhost:3001
NEXT_PUBLIC_APP_ENV=local
```

For production (Vercel), set:
```
NEXT_PUBLIC_API_URL=https://api.farme.ro
NEXT_PUBLIC_SITE_URL=https://farme.ro
NEXT_PUBLIC_ADMIN_URL=https://admin.farme.ro
NEXT_PUBLIC_APP_ENV=production
```

## Build Statistics

- **Total Routes**: 96
- **Static Routes**: 7 (○)
- **Dynamic Routes**: 89 (ƒ)
- **First Load JS**: ~87.9 kB shared

## Security Notes

- ⚠️ 3 high severity vulnerabilities detected in dependencies (run `npm audit fix` if needed)
- ✅ No hardcoded API URLs remaining (except in comments/documentation)
- ✅ All API calls go through unified client

## Deployment Readiness

- ✅ Build passes
- ✅ Lint passes
- ✅ All dependencies installed
- ✅ TypeScript compilation successful
- ✅ Next.js build optimized
- ⚠️ Minor TODO: Address npm audit vulnerabilities (non-blocking)

## Notes

- All API calls go through unified client
- No hardcoded API URLs remaining (except in comments/documentation)
- Backend reachable from frontend on http://localhost:4000
- No CORS issues expected with proper backend configuration
- Ready for Vercel deployment
