# Production Deployment Checklist - api.farme.ro

## ✅ Environment Variables (REQUIRED)

Set these environment variables on your production server (Vercel/Railway/Render/etc.):

### Critical (MUST be set)

1. **NODE_ENV**
   - Value: `production`
   - Description: Sets Node.js to production mode
   - Example: `NODE_ENV=production`

2. **DATABASE_URL**
   - Value: PostgreSQL connection string
   - Description: Database connection for Prisma
   - Format: `postgresql://user:password@host:port/database?schema=public`
   - Example: `postgresql://farmero_user:secure_password@db.example.com:5432/farmero_prod?schema=public`
   - ⚠️ **CRITICAL**: Must be valid PostgreSQL connection string

3. **JWT_SECRET**
   - Value: Secret key for JWT token signing
   - Description: Used to sign and verify authentication tokens
   - Requirements: Must be at least 32 characters long
   - Example: `your-super-secret-jwt-key-at-least-32-characters-long`
   - ⚠️ **SECURITY**: Use a strong, random secret (generate with: `node generate-jwt-secret.js`)

### Optional (Recommended)

4. **PORT**
   - Value: Server port number
   - Default: `4000`
   - Description: Port where the server listens
   - Example: `PORT=4000`

5. **HOST**
   - Value: Server host
   - Default: `0.0.0.0`
   - Description: Host where the server binds
   - Example: `HOST=0.0.0.0`

6. **CORS_ORIGIN**
   - Value: Allowed CORS origin
   - Description: Frontend URL that can access the API
   - Example: `CORS_ORIGIN=https://farme.ro`

7. **SENTRY_DSN**
   - Value: Sentry DSN for error tracking
   - Description: Optional error tracking service
   - Example: `SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx`

### Vercel-Specific (Auto-set by Vercel)

- `VERCEL=1` - Automatically set by Vercel
- `VERCEL_ENV=production` - Automatically set by Vercel

---

## 🔧 Post-Deploy Commands

After deploying, run these commands to set up the database:

### 1. Generate Prisma Client
```bash
cd backend
npm install
npx prisma generate
```

### 2. Run Database Migrations
```bash
# For production, use migrate deploy (no interactive prompts)
npx prisma migrate deploy
```

**⚠️ IMPORTANT**: 
- `prisma migrate deploy` is for production - it applies pending migrations without prompts
- `prisma migrate dev` is for development only - DO NOT use in production

### 3. (Optional) Seed Initial Data
```bash
# Only if you need initial data
npm run prisma:seed
```

---

## ✅ Health Check Validation

After deployment, verify the API is working:

### 1. Basic Health Check
```bash
curl -i https://api.farme.ro/health
```

**Expected Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2025-01-27T...",
  "database": "connected"
}
```

**If Database is Down (503 Service Unavailable):**
```json
{
  "status": "degraded",
  "timestamp": "2025-01-27T...",
  "database": "disconnected",
  "reason": "DB_CONNECTION_FAILED",
  "message": "Server is running but database is not accessible"
}
```

### 2. Public Products Endpoint
```bash
curl -i https://api.farme.ro/products
```

**Expected Response (200 OK):**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 0,
    "totalPages": 0
  }
}
```

### 3. Detailed Health Check
```bash
curl -i https://api.farme.ro/health/detailed
```

**Expected Response (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-27T...",
  "checks": {
    "database": {
      "status": "ok",
      "responseTime": 15
    },
    "memory": {
      "status": "ok",
      "usage": {
        "used": 45,
        "total": 512,
        "percentage": 8.79
      }
    }
  }
}
```

---

## 🐛 Troubleshooting "Server initialization failed"

If you see `{"error":"Server initialization failed","message":"Internal server error"}`:

### Step 1: Check Server Logs

Look at your deployment platform's logs (Vercel/Railway/Render logs). You should see detailed error messages like:

```
❌ Environment validation failed:
❌ DATABASE_URL is required but not set...
```

or

```
❌ Prisma initialization failed: DATABASE_URL must be a valid PostgreSQL connection string
```

### Step 2: Common Issues

#### Issue: Missing DATABASE_URL
**Symptom**: `DATABASE_URL is required but not set`
**Fix**: Set `DATABASE_URL` environment variable in your deployment platform

#### Issue: Invalid DATABASE_URL Format
**Symptom**: `DATABASE_URL must be a valid PostgreSQL connection string`
**Fix**: Ensure format is `postgresql://user:password@host:port/db?schema=public`

#### Issue: Database Connection Refused
**Symptom**: `DB_CONNECTION_FAILED` in health check
**Fix**: 
- Check database is running
- Verify DATABASE_URL credentials
- Check firewall/network access
- Verify database host and port are correct

#### Issue: Missing JWT_SECRET
**Symptom**: `JWT_SECRET is required but not set`
**Fix**: Set `JWT_SECRET` environment variable (at least 32 characters)

#### Issue: JWT_SECRET Too Short
**Symptom**: `JWT_SECRET must be at least 32 characters long`
**Fix**: Generate a longer secret: `node generate-jwt-secret.js`

### Step 3: Verify Environment Variables

In your deployment platform, verify all required env vars are set:
- ✅ `NODE_ENV=production`
- ✅ `DATABASE_URL=postgresql://...`
- ✅ `JWT_SECRET=...` (32+ characters)

---

## 📋 Quick Validation Script

Run this locally to test your .env before deploying:

```bash
cd backend
npm install
npm run build
NODE_ENV=development node dist/index.js
```

In another terminal:
```bash
curl -i http://localhost:4000/health
curl -i http://localhost:4000/products
```

Check the server terminal for any error messages.

---

## 🔒 Security Checklist

- [ ] `JWT_SECRET` is at least 32 characters and randomly generated
- [ ] `DATABASE_URL` contains strong password
- [ ] Database is not publicly accessible (use firewall/VPC)
- [ ] `NODE_ENV=production` is set
- [ ] CORS is configured correctly (only allow your frontend domain)
- [ ] Sensitive env vars are NOT committed to git

---

## 📝 Summary

**Required Environment Variables:**
1. `NODE_ENV=production`
2. `DATABASE_URL=postgresql://user:pass@host:port/db?schema=public`
3. `JWT_SECRET=...` (32+ characters)

**Post-Deploy Commands:**
1. `npm install`
2. `npx prisma generate`
3. `npx prisma migrate deploy`

**Validation:**
- `GET https://api.farme.ro/health` → Should return `{"status":"ok","database":"connected"}`
- `GET https://api.farme.ro/products` → Should return products array

**If errors occur:**
- Check server logs for detailed error messages
- Verify all required env vars are set
- Test database connection separately
- Use `/health/detailed` endpoint for diagnostics

