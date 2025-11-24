# Contracts & Billing PDF Optimization Guide

## Overview

The PDF generation system includes several optimizations for production use:

1. **Browser Pool** - Reuses browser instances
2. **Queue System** - Background processing for PDF generation
3. **Caching** - Avoids regenerating PDFs
4. **Multiple Storage Backends** - S3, Cloudinary, or Local filesystem

## Installation

### Required Dependencies

```bash
cd backend
npm install puppeteer
```

### Optional Dependencies (for storage)

**AWS S3:**
```bash
npm install @aws-sdk/client-s3
```

**Cloudinary:**
```bash
npm install cloudinary
```

## Configuration

### Environment Variables

```env
# PDF Storage Backend (s3 | cloudinary | local)
PDF_STORAGE_BACKEND=local

# S3 Configuration
PDF_STORAGE_S3_BUCKET=your-bucket-name
PDF_STORAGE_S3_REGION=eu-west-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Local Storage Configuration
PDF_STORAGE_LOCAL_DIR=./uploads/pdfs
PDF_STORAGE_LOCAL_PUBLIC_URL=/uploads/pdfs

# Browser Pool Configuration
PDF_BROWSER_POOL_SIZE=3
PDF_MAX_CONCURRENT=2
```

## Features

### 1. Browser Pool

The browser pool reuses Puppeteer browser instances instead of creating new ones for each PDF generation.

**Benefits:**
- Faster PDF generation (no browser startup overhead)
- Lower memory usage
- Better resource management

**Usage:**
The pool is automatically initialized when the first PDF is generated. You can also initialize it manually:

```typescript
import { initBrowserPool } from './contracts-pdf-browser-pool'

await initBrowserPool(3) // 3 browsers in pool
```

**Status:**
```typescript
import { getBrowserPoolStatus } from './contracts-pdf-browser-pool'

const status = getBrowserPoolStatus()
// { total: 3, inUse: 1, available: 2 }
```

### 2. Queue System

The queue system allows PDF generation to happen in the background, preventing blocking of API requests.

**Usage:**
```typescript
// Generate PDF in queue
const pdfUrl = await generateInvoicePdf(invoice, true, true) // useCache=true, useQueue=true

// Check job status
const job = pdfQueue.getJob(jobId)
// { id, type, status, result, error, ... }
```

**API Endpoints:**
- `GET /admin/contracts/pdf/queue/status` - Get queue status
- `GET /admin/contracts/pdf/queue/job/:jobId` - Get job status

**Queue Status:**
```json
{
  "total": 10,
  "pending": 2,
  "processing": 1,
  "completed": 6,
  "failed": 1
}
```

### 3. Caching

PDFs are cached to avoid regenerating them. Cache TTL is 7 days by default.

**Usage:**
```typescript
// Generate with cache (default)
const pdfUrl = await generateInvoicePdf(invoice, true) // useCache=true

// Generate without cache
const pdfUrl = await generateInvoicePdf(invoice, false) // useCache=false

// Invalidate cache
pdfCache.invalidate('invoice', invoiceId)
```

**Cache Statistics:**
```typescript
import { pdfCache } from './contracts-pdf-cache'

const stats = pdfCache.getStats()
// { size: 50, hits: 120, entries: [...] }
```

**API Endpoint:**
- `GET /admin/contracts/pdf/cache/stats` - Get cache statistics

### 4. Storage Backends

#### Local Filesystem (Default)

No additional configuration needed. PDFs are stored in `./uploads/pdfs/`.

#### AWS S3

1. Install dependency: `npm install @aws-sdk/client-s3`
2. Set environment variables (see above)
3. Set `PDF_STORAGE_BACKEND=s3`

#### Cloudinary

1. Install dependency: `npm install cloudinary`
2. Set environment variables (see above)
3. Set `PDF_STORAGE_BACKEND=cloudinary`

## Production Recommendations

### 1. Use Redis for Queue

Replace in-memory queue with Redis/BullMQ:

```typescript
import Bull from 'bull'

const pdfQueue = new Bull('pdf-generation', {
  redis: { host: 'localhost', port: 6379 }
})
```

### 2. Use Redis for Cache

Replace in-memory cache with Redis:

```typescript
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

async function get(key: string): Promise<string | null> {
  return await redis.get(key)
}

async function set(key: string, value: string, ttl: number): Promise<void> {
  await redis.setex(key, ttl, value)
}
```

### 3. Monitor Browser Pool

Add monitoring for browser pool health:

```typescript
setInterval(() => {
  const status = getBrowserPoolStatus()
  if (status.available === 0) {
    logger.warn('All browsers in use, consider increasing pool size')
  }
}, 60000) // Every minute
```

### 4. Implement Retry Logic

Add retry logic for failed PDF generations:

```typescript
async function generateWithRetry(fn: () => Promise<string>, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
}
```

### 5. Rate Limiting

Add rate limiting for PDF generation endpoints:

```typescript
import rateLimit from 'express-rate-limit'

const pdfRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
})

router.post('/invoices/:id/generate-pdf', pdfRateLimit, async (req, res) => {
  // ...
})
```

## Performance Metrics

### Expected Performance

- **With Browser Pool**: ~500ms per PDF
- **Without Browser Pool**: ~2-3s per PDF
- **With Cache**: ~1ms (instant)
- **Queue Processing**: ~500ms per PDF (background)

### Monitoring

Monitor these metrics:
- Browser pool utilization
- Queue length and processing time
- Cache hit rate
- PDF generation success rate
- Storage upload latency

## Troubleshooting

### Browser Pool Issues

**Problem**: All browsers in use
**Solution**: Increase `PDF_BROWSER_POOL_SIZE` or use queue system

**Problem**: Browser crashes
**Solution**: Implement browser health checks and auto-restart

### Queue Issues

**Problem**: Jobs stuck in processing
**Solution**: Implement job timeout and retry logic

**Problem**: Memory usage growing
**Solution**: Cleanup old jobs regularly (already implemented)

### Cache Issues

**Problem**: Stale PDFs served
**Solution**: Invalidate cache when documents are updated

**Problem**: Memory usage growing
**Solution**: Reduce cache TTL or use Redis

## Testing

Test PDF generation with different configurations:

```bash
# Test with cache
curl -X POST http://localhost:3001/admin/contracts/invoices/{id}/generate-pdf?useCache=true

# Test with queue
curl -X POST http://localhost:3001/admin/contracts/invoices/{id}/generate-pdf?useQueue=true

# Test without cache
curl -X POST http://localhost:3001/admin/contracts/invoices/{id}/generate-pdf?useCache=false
```

