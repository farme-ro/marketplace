# Supabase Removal Summary

> **Status:** Supabase has been fully removed from the frontend. This file is for historical reference only.
> 
> **Current Architecture:** Frontend → Backend API (https://api.farme.ro) → Neon PostgreSQL + JWT cookies

This document summarizes all changes made to remove Supabase from the frontend and replace it with backend API calls.

## Overview

The frontend has been completely migrated from Supabase Auth to use the backend API at `NEXT_PUBLIC_API_URL` (https://api.farme.ro). All authentication and data fetching now goes through the centralized backend API.

## Files Created

### New API Client Files

1. **`src/lib/api/auth.ts`**
   - New authentication API client
   - Functions: `login()`, `register()`, `logout()`, `getCurrentUser()`
   - Uses backend API endpoints: `/auth/login`, `/auth/register`, `/auth/logout`, `/auth/me`

2. **`src/lib/api/server.ts`**
   - Server-side API client helper
   - Functions: `serverGet()`, `serverPost()`, `serverPut()`, `serverPatch()`, `serverDelete()`
   - Automatically forwards cookies from Next.js to backend API
   - Used in server components and route handlers

## Files Modified

### Core Auth Files

1. **`src/lib/auth.ts`**
   - **Before**: Used Supabase to get current user, synced with Prisma
   - **After**: Calls backend API `/auth/me` endpoint
   - Removed all Supabase dependencies
   - Simplified to use backend API response directly

2. **`src/app/auth/login/actions.ts`**
   - **Before**: Used `supabase.auth.signInWithPassword()`
   - **After**: Calls backend API `/auth/login` endpoint via `serverPost()`
   - Backend sets auth cookie automatically

3. **`src/app/auth/register/actions.ts`**
   - **Before**: Used `supabase.auth.signUp()`
   - **After**: Calls backend API `/auth/register` endpoint via `serverPost()`
   - Backend sets auth cookie automatically

4. **`src/app/auth/signout/route.ts`**
   - **Before**: Used `supabase.auth.signOut()`
   - **After**: Calls backend API `/auth/logout` endpoint and clears cookies

### Middleware

5. **`middleware.ts`**
   - **Before**: Used Supabase middleware to refresh sessions
   - **After**: Simplified - backend API handles session validation on each request
   - No longer needs to refresh Supabase tokens

### Client Components

6. **`src/components/layout/site-navbar.tsx`**
   - **Before**: Used `createClient()` from Supabase to get user and sign out
   - **After**: Uses `getCurrentUser()` and `logout()` from `@/lib/api/auth`

7. **`src/app/(admin)/_components/admin-navbar.tsx`**
   - **Before**: Used Supabase client for logout
   - **After**: Uses `logout()` from `@/lib/api/auth`

8. **`src/app/(admin)/admin/login/page.tsx`**
   - **Before**: Used `supabase.auth.signInWithPassword()`
   - **After**: Uses `login()` and `getCurrentUser()` from `@/lib/api/auth`

### API Routes

All API routes that used Supabase auth have been updated to use `getCurrentUser()`:

9. **`src/app/api/producers/me/route.ts`**
   - Replaced Supabase auth with `getCurrentUser()`

10. **`src/app/api/producers/products/route.ts`**
    - Replaced Supabase auth with `getCurrentUser()` in both GET and POST methods

11. **`src/app/api/producers/products/[id]/route.ts`**
    - Replaced Supabase auth with `getCurrentUser()` in both PUT and DELETE methods

12. **`src/app/api/producers/orders/route.ts`**
    - Replaced Supabase auth with `getCurrentUser()`

13. **`src/app/api/producers/orders/[id]/status/route.ts`**
    - Replaced Supabase auth with `getCurrentUser()`

14. **`src/app/api/producers/commissions/route.ts`**
    - Replaced Supabase auth with `getCurrentUser()`

15. **`src/app/api/auth/producer/login/route.ts`**
    - **Before**: Used Supabase for producer login
    - **After**: Proxies to backend API `/auth/producer/login` endpoint

### Configuration Files

16. **`package.json`**
    - Removed `@supabase/supabase-js` dependency
    - Removed `@supabase/ssr` dependency

17. **`src/lib/api/index.ts`**
    - Added exports for auth API and server-side helpers

18. **`src/app/(admin)/debug/page.tsx`**
    - Replaced Supabase configuration check with Backend API check

## Files Deleted

1. **`src/lib/supabase/client.ts`** - Supabase browser client
2. **`src/lib/supabase/server.ts`** - Supabase server client
3. **`src/lib/supabase/middleware.ts`** - Supabase middleware helper
4. **`src/lib/supabaseClient.ts`** - Legacy Supabase wrapper

## Environment Variables

### Removed (no longer needed)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Required
- `NEXT_PUBLIC_API_URL` - Backend API URL (e.g., https://api.farme.ro)

## Authentication Flow

### Before (Supabase)
1. User logs in → Supabase Auth
2. Supabase sets session cookie
3. Frontend calls `getCurrentUser()` → Gets Supabase user → Syncs with Prisma
4. Frontend uses Supabase user ID to query Prisma

### After (Backend API)
1. User logs in → Backend API `/auth/login`
2. Backend sets auth cookie (httpOnly, secure)
3. Frontend calls `getCurrentUser()` → Backend API `/auth/me` → Returns user data
4. Frontend uses user data directly from backend

## Key Changes

1. **Centralized API Client**: All API calls now go through `src/lib/api/apiClient.ts` which uses `NEXT_PUBLIC_API_URL`

2. **Server-Side Requests**: New `src/lib/api/server.ts` handles server-side requests with cookie forwarding

3. **No More Supabase Sync**: User data comes directly from backend API, no need to sync Supabase users with Prisma

4. **Simplified Auth**: `getCurrentUser()` now simply calls backend API instead of complex Supabase + Prisma sync

5. **Cookie-Based Auth**: Backend handles session management via httpOnly cookies

## Testing Checklist

- [ ] Login works (customer, producer, admin)
- [ ] Registration works
- [ ] Logout works
- [ ] Protected routes redirect correctly
- [ ] User data loads correctly in navbar
- [ ] Producer API routes work
- [ ] Admin pages work
- [ ] Session persists across page refreshes

## Notes

- The backend API must implement:
  - `POST /auth/login` - User login
  - `POST /auth/register` - User registration
  - `POST /auth/logout` - User logout
  - `GET /auth/me` - Get current user (requires auth cookie)
  - `POST /auth/producer/login` - Producer-specific login

- All backend endpoints should set httpOnly cookies for session management

- The frontend expects the backend to return user data in this format:
  ```typescript
  {
    id: string
    email: string
    fullName: string
    role: 'ADMIN' | 'PRODUCER' | 'CUSTOMER'
  }
  ```

