# Growth Engine API Specification

## Overview

The Growth Engine module provides tracking, campaigns, and nudges for user engagement and growth optimization.

## Endpoints

### Public Endpoints

#### POST /growth/events

Record a growth event (public, no authentication required).

**Request Body:**
```json
{
  "userId": "uuid-optional",
  "producerId": "uuid-optional",
  "type": "page_view | cart_abandoned | subscription_started | ...",
  "source": "homepage | checkout | portal | journal | ...",
  "metadata": {
    "page": "/produse",
    "cartItemsCount": 3
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "producerId": "uuid",
    "type": "page_view",
    "source": "homepage",
    "metadata": {},
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Admin Endpoints

All admin endpoints require authentication and ADMIN role.

#### GET /admin/growth/timeline?userId={userId}&limit={limit}&offset={offset}

Get user timeline (last N events).

**Query Parameters:**
- `userId` (required): User UUID
- `limit` (optional, default: 20, max: 100): Number of events to return
- `offset` (optional, default: 0): Pagination offset

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "page_view",
      "source": "homepage",
      "metadata": {},
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET /admin/growth/campaigns/overview

Get campaign overview (active, upcoming, finished).

**Response:**
```json
{
  "success": true,
  "data": {
    "active": 5,
    "upcoming": 2,
    "finished": 10,
    "total": 17
  }
}
```

#### GET /admin/growth/nudges?userId={userId}&role={role}&page={page}&...

Get eligible nudges for a user context.

**Query Parameters:**
- `userId` (optional): User UUID
- `producerId` (optional): Producer UUID
- `role` (optional): User role
- `page` (optional): Current page
- `subscriptionActive` (optional): Boolean
- `hasJournalArticles` (optional): Boolean
- `cartItemsCount` (optional): Number
- `metadata` (optional): JSON object

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "code": "cart_abandoned",
      "description": "Ai lăsat produse în coș",
      "priority": 10
    }
  ]
}
```

## Event Types

- `page_view`: User viewed a page
- `cart_abandoned`: User left items in cart
- `subscription_started`: User started a subscription
- `subscription_cancelled`: User cancelled a subscription
- `journal_viewed`: User viewed journal
- `journal_article_viewed`: User viewed a journal article
- `producer_profile_viewed`: User viewed a producer profile
- `product_viewed`: User viewed a product
- `order_placed`: User placed an order
- `order_completed`: Order was completed
- `checkout_started`: User started checkout
- `checkout_completed`: User completed checkout

## Event Sources

- `homepage`: Homepage
- `checkout`: Checkout page
- `portal`: Producer/Client portal
- `journal`: Journal section
- `products`: Products page
- `producers`: Producers page
- `profile`: User profile

## Campaign Types

- `onboarding`: Onboarding campaigns
- `upsell`: Upsell campaigns
- `retention`: Retention campaigns
- `reactivation`: Reactivation campaigns

## Nudge Rules

Nudge rules are evaluated based on:
- **Segment**: User segment conditions (e.g., `role=client AND no_subscription`)
- **Trigger**: Page/context conditions (e.g., `page=checkout AND cart_items>0`)
- **Priority**: Higher priority nudges are shown first

## Database Models

### GrowthEvent
- Tracks user events for analytics
- Can be associated with user or producer
- Includes metadata for context

### GrowthCampaign
- Defines growth campaigns
- Has start/end dates and target roles
- Can be active or inactive

### GrowthNudgeRule
- Defines nudge rules for contextual messages
- Includes segment and trigger conditions
- Has priority for ordering

## Notes

- Public endpoint `/growth/events` does not require authentication (for anonymous tracking)
- All admin endpoints require ADMIN role
- Nudge evaluation is simplified; can be extended with a proper rule engine
- Timeline endpoint is useful for support/admin to understand user journey

