# AI Assistant API Specification

## Overview

The AI Assistant module provides a simple, rule-based assistant for clients, producers, and admin users. For MVP, responses are generated using keyword matching. In production, this would integrate with an LLM service.

## Endpoints

### Public Endpoints

#### POST /ai/assistant

Handle an AI assistant request (public, no authentication required).

**Request Body:**
```json
{
  "context": {
    "role": "client | producer | support | admin",
    "locale": "ro | en | fr | ...",
    "page": "/produse (optional)",
    "userId": "uuid (optional)",
    "metadata": {}
  },
  "message": "Cum funcționează plata?"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "answer": "Poți plăti online cu cardul sau ramburs la livrare...",
    "suggestedLinks": [
      {
        "url": "/cum-functioneaza#plata",
        "label": "Despre plată"
      }
    ]
  }
}
```

### Admin Endpoints

All admin endpoints require authentication and ADMIN role.

#### GET /admin/ai/interactions?role={role}&userId={userId}&search={search}&page={page}&limit={limit}

Get AI interactions (for monitoring and analysis).

**Query Parameters:**
- `role` (optional): Filter by role
- `userId` (optional): Filter by user ID
- `search` (optional): Search in questions/answers
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 50, max: 100): Results per page

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "userId": "uuid",
        "role": "client",
        "context": {
          "page": "/produse",
          "locale": "ro"
        },
        "question": "Cum funcționează plata?",
        "answer": "Poți plăti online...",
        "suggestedLinks": [],
        "createdAt": "2025-01-27T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 100,
      "totalPages": 2
    }
  }
}
```

## Response Generation (MVP)

For MVP, responses are generated using simple keyword matching:

- **FAQ/Help**: Questions about "how", "what", "cum", "ce"
- **Delivery**: Questions about "livrare", "delivery", "transport"
- **Payment**: Questions about "plată", "payment", "plătesc"
- **Producer-specific**: Questions about "jurnal", "promovare", "plan" (for producer role)
- **Default**: Generic helpful response with links to FAQ, How it works, Contact

## Production Integration

To integrate with an LLM service:

1. Replace `generateAiResponse()` in `ai.service.ts` with a call to your LLM API
2. Add environment variables for API keys
3. Implement rate limiting and error handling
4. Add caching for common questions

## Database Model

### AiInteraction
- Stores all interactions for monitoring and improvement
- Includes context, question, answer, and suggested links
- Can be filtered by role, userId, and searched by content

## Notes

- Public endpoint does not require authentication (for anonymous users)
- All interactions are logged for monitoring
- Admin endpoint is read-only (for viewing interactions)
- Responses are locale-aware (RO, EN, etc.)

