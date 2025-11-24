# Backend Status Endpoint Specification

## Endpoint: `/status`

### Request
```
GET /status
```

### Response Format

**Success (200 OK):**
```json
{
  "api": "ok",
  "db": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error (500 Internal Server Error):**
```json
{
  "api": "ok",
  "db": "error",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "error": "Database connection failed: ..."
}
```

**Service Unavailable (503):**
```json
{
  "api": "error",
  "db": "error",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "error": "Service temporarily unavailable"
}
```

### Implementation Notes

1. **Database Check**: Use a trivial query like `SELECT 1` or `prisma.$queryRaw\`SELECT 1\``
2. **Response Time**: Should be fast (< 100ms typically)
3. **No Authentication Required**: This endpoint should be public
4. **CORS**: Must allow requests from `https://farme.ro`

### Legacy Support

The frontend also supports the legacy `/health/db` endpoint format:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "..."
}
```

The frontend will try `/status` first, then fall back to `/health/db` if 404.

