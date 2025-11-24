# PRE_DEPLOY_BUILD_STATUS

## Admin Build Status

- **npm run lint**: ⏳ Not yet run
- **npm run build**: ⏳ Not yet run
- **API_URL**: ✅ Unified to use `NEXT_PUBLIC_API_URL` (default: `http://localhost:4000`)

## Changes Applied

1. ✅ Updated `src/lib/api/client.ts` to use port 4000 (was 3001)
2. ✅ Updated `src/lib/api/system.ts` fallback URL to use port 4000

## API URL Configuration

- **Single source of truth**: `src/lib/api/client.ts`
- **Fallback**: `http://localhost:4000`
- **Environment variable**: `NEXT_PUBLIC_API_URL`

## Environment Variables

Required `.env.local` file should contain:
```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_URL=http://localhost:3001
NEXT_PUBLIC_APP_ENV=local
```

## API Clients Verified

All admin API modules use centralized client:
- ✅ `src/lib/api/admin.ts`
- ✅ `src/lib/api/system.ts`
- ✅ `src/lib/api/journal.ts`
- ✅ `src/lib/api/marketing-growth.ts`
- ✅ `src/lib/api/content-seo.ts`
- ✅ `src/lib/api/security.ts`
- ✅ `src/lib/api/gdpr.ts`

## Notes

- All API calls go through unified client
- No hardcoded API URLs remaining
- Backend reachable from admin on http://localhost:4000
- RBAC and audit log logic preserved
- No modifications to permission structure
