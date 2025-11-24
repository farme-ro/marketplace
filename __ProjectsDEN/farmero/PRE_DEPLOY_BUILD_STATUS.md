# PRE_DEPLOY_BUILD_STATUS

## Frontend Build Status

- **npm run lint**: ⏳ Not yet run
- **npm run build**: ⏳ Not yet run
- **API_URL**: ✅ Unified to use `NEXT_PUBLIC_API_URL` (default: `http://localhost:4000`)

## Changes Applied

1. ✅ Updated `src/lib/api/client.ts` to use port 4000 (was 3001)
2. ✅ Updated hardcoded URLs in status pages:
   - `src/app/(site)/status/page.tsx`
   - `src/app/(site)/internal/status/page.tsx`
3. ✅ All API clients now use centralized `apiFetch` from `client.ts`

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

## Notes

- All API calls go through unified client
- No hardcoded API URLs remaining (except in comments/documentation)
- Backend reachable from frontend on http://localhost:4000
- No CORS issues expected with proper backend configuration
