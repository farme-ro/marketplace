# Contracts & Billing API Specification

## Overview

The Contracts & Billing module provides functionality for managing contract templates, contract instances, invoices, and delivery notes. All endpoints require ADMIN role.

## Base Path

- Admin API: `/admin/contracts`

## 1. Contract Templates

### GET /admin/contracts/templates

Get list of contract templates.

**Query Parameters:**
- `category` (optional): Filter by category (`producer`, `client`, `b2b`, `logistics`, `general`)
- `isActive` (optional): Filter by active status (`true`/`false`)
- `search` (optional): Search in name, code, or description
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20, max: 100): Results per page

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "code": "producer_agreement",
        "name": "Acord Producător",
        "description": "Template pentru acordul cu producătorii",
        "content": "Template content with {{variables}}...",
        "variables": { "producerName": "string", "date": "string" },
        "category": "producer",
        "isActive": true,
        "version": 1,
        "createdAt": "2025-01-27T10:00:00Z",
        "updatedAt": "2025-01-27T10:00:00Z",
        "createdBy": { "id": "uuid", "email": "admin@farme.ro", "fullName": "Admin Name" },
        "updatedBy": { "id": "uuid", "email": "admin@farme.ro", "fullName": "Admin Name" }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

### GET /admin/contracts/templates/:id

Get contract template by ID.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "code": "producer_agreement",
    "name": "Acord Producător",
    // ... same structure as list item
  }
}
```

### POST /admin/contracts/templates

Create a new contract template.

**Request Body:**
```json
{
  "code": "producer_agreement",
  "name": "Acord Producător",
  "description": "Template pentru acordul cu producătorii",
  "content": "Template content with {{producerName}} and {{date}}...",
  "variables": { "producerName": "string", "date": "string" },
  "category": "producer"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    // ... full template object
  }
}
```

### PATCH /admin/contracts/templates/:id

Update contract template.

**Request Body (all fields optional):**
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "content": "Updated content...",
  "variables": { "newVariable": "string" },
  "category": "client",
  "isActive": false
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    // ... updated template object
  }
}
```

## 2. Contract Instances

### GET /admin/contracts/instances

Get list of contract instances.

**Query Parameters:**
- `templateId` (optional): Filter by template ID
- `producerId` (optional): Filter by producer ID
- `clientId` (optional): Filter by client ID
- `orderId` (optional): Filter by order ID
- `status` (optional): Filter by status (`draft`, `pending_signature`, `signed`, `expired`, `cancelled`)
- `search` (optional): Search in contract number or notes
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20, max: 100): Results per page

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "templateId": "uuid",
        "template": { "id": "uuid", "code": "producer_agreement", "name": "Acord Producător", "category": "producer" },
        "contractNumber": "CONTRACT-2025-001",
        "producerId": "uuid",
        "producer": { "id": "uuid", "name": "Ferma Popescu" },
        "clientId": "uuid",
        "client": { "id": "uuid", "email": "client@example.com", "fullName": "Client Name" },
        "orderId": "uuid",
        "status": "draft",
        "signedAt": null,
        "expiresAt": "2025-12-31T23:59:59Z",
        "variables": { "producerName": "Ferma Popescu", "date": "2025-01-27" },
        "pdfUrl": null,
        "signedByUserId": null,
        "notes": "Contract notes",
        "createdAt": "2025-01-27T10:00:00Z",
        "updatedAt": "2025-01-27T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 10,
      "totalPages": 1
    }
  }
}
```

### POST /admin/contracts/instances

Create a new contract instance.

**Request Body:**
```json
{
  "templateId": "uuid",
  "producerId": "uuid",
  "clientId": "uuid",
  "orderId": "uuid",
  "variables": {
    "producerName": "Ferma Popescu",
    "clientName": "Client Name",
    "date": "2025-01-27"
  },
  "expiresAt": "2025-12-31T23:59:59Z",
  "notes": "Contract notes"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    // ... full contract instance object
  }
}
```

## 3. Invoices

### GET /admin/contracts/invoices

Get list of invoices.

**Query Parameters:**
- `type` (optional): Filter by type (`customer`, `producer`, `b2b`)
- `orderId` (optional): Filter by order ID
- `commissionId` (optional): Filter by commission ID
- `producerId` (optional): Filter by producer ID
- `clientId` (optional): Filter by client ID
- `status` (optional): Filter by status (`draft`, `issued`, `paid`, `cancelled`)
- `search` (optional): Search in invoice number or notes
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20, max: 100): Results per page

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "invoiceNumber": "INV-2025-001",
        "type": "customer",
        "orderId": "uuid",
        "producerId": "uuid",
        "producer": { "id": "uuid", "name": "Ferma Popescu" },
        "clientId": "uuid",
        "client": { "id": "uuid", "email": "client@example.com", "fullName": "Client Name" },
        "status": "draft",
        "totalAmount": 120.50,
        "taxAmount": 22.90,
        "netAmount": 97.60,
        "currency": "RON",
        "issuedAt": null,
        "dueAt": "2025-02-27T23:59:59Z",
        "paidAt": null,
        "externalId": null,
        "pdfUrl": null,
        "eFacturaXmlUrl": null,
        "notes": "Invoice notes",
        "items": [
          {
            "id": "uuid",
            "description": "Rosii Bio - 5kg",
            "quantity": 5,
            "unitPrice": 19.52,
            "taxRate": 19,
            "totalAmount": 97.60,
            "orderItemId": "uuid"
          }
        ],
        "createdAt": "2025-01-27T10:00:00Z",
        "updatedAt": "2025-01-27T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    }
  }
}
```

### POST /admin/contracts/invoices

Create a new invoice.

**Request Body:**
```json
{
  "type": "customer",
  "orderId": "uuid",
  "producerId": "uuid",
  "clientId": "uuid",
  "items": [
    {
      "description": "Rosii Bio - 5kg",
      "quantity": 5,
      "unitPrice": 19.52,
      "taxRate": 19,
      "orderItemId": "uuid"
    }
  ],
  "dueAt": "2025-02-27T23:59:59Z",
  "notes": "Invoice notes"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    // ... full invoice object with calculated totals
  }
}
```

## 4. Delivery Notes

### GET /admin/contracts/delivery-notes

Get list of delivery notes.

**Query Parameters:**
- `orderId` (optional): Filter by order ID
- `producerId` (optional): Filter by producer ID
- `status` (optional): Filter by status (`draft`, `issued`, `delivered`, `cancelled`)
- `search` (optional): Search in note number, tracking number, or notes
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20, max: 100): Results per page

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "noteNumber": "AV-2025-001",
        "orderId": "uuid",
        "order": { "id": "uuid", "totalAmount": "120.50", "status": "PENDING" },
        "producerId": "uuid",
        "producer": { "id": "uuid", "name": "Ferma Popescu" },
        "status": "draft",
        "issuedAt": null,
        "deliveredAt": null,
        "pdfUrl": null,
        "carrierName": "Fan Courier",
        "trackingNumber": "FC123456789",
        "notes": "Delivery notes",
        "items": [
          {
            "id": "uuid",
            "productId": "uuid",
            "productName": "Rosii Bio",
            "quantity": 5,
            "unit": "kg",
            "orderItemId": "uuid"
          }
        ],
        "createdAt": "2025-01-27T10:00:00Z",
        "updatedAt": "2025-01-27T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 25,
      "totalPages": 2
    }
  }
}
```

### POST /admin/contracts/delivery-notes

Create a new delivery note.

**Request Body:**
```json
{
  "orderId": "uuid",
  "producerId": "uuid",
  "items": [
    {
      "productId": "uuid",
      "productName": "Rosii Bio",
      "quantity": 5,
      "unit": "kg",
      "orderItemId": "uuid"
    }
  ],
  "carrierName": "Fan Courier",
  "trackingNumber": "FC123456789",
  "notes": "Delivery notes"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    // ... full delivery note object
  }
}
```

## Error Responses

All endpoints return standard error responses:

- `400 Bad Request`: Invalid input data (Zod validation errors)
- `401 Unauthorized`: No authentication token provided
- `403 Forbidden`: User does not have ADMIN role
- `404 Not Found`: Resource not found (for GET by ID)
- `500 Internal Server Error`: Server error

## 5. PDF Generation

### POST /admin/contracts/invoices/:id/generate-pdf

Generate PDF for an invoice.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "pdfUrl": "/uploads/invoices/uuid.pdf",
    "invoice": { /* Invoice object with updated pdfUrl */ }
  }
}
```

### POST /admin/contracts/instances/:id/generate-pdf

Generate PDF for a contract instance.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "pdfUrl": "/uploads/contracts/uuid.pdf",
    "instance": { /* ContractInstance object with updated pdfUrl */ }
  }
}
```

### POST /admin/contracts/delivery-notes/:id/generate-pdf

Generate PDF for a delivery note.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "pdfUrl": "/uploads/delivery-notes/uuid.pdf",
    "note": { /* DeliveryNote object with updated pdfUrl */ }
  }
}
```

## 6. E-Factura Integration

### POST /admin/contracts/invoices/:id/generate-efactura

Generate and submit e-factura XML for an invoice.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "xmlUrl": "/uploads/invoices/uuid-efactura.xml",
    "externalId": "EFACTURA-INV-2025-001",
    "invoice": { /* Invoice object with updated eFacturaXmlUrl and externalId */ }
  }
}
```

## Notes

- All endpoints require ADMIN role
- Contract templates support versioning (version increments when content changes)
- Invoice totals are automatically calculated from items (netAmount, taxAmount, totalAmount)
- Contract instances are generated from templates with variable substitution
- Delivery notes are linked to orders and producers
- All number fields (invoiceNumber, contractNumber, noteNumber) are auto-generated
- PDF generation is currently a placeholder - implement actual PDF generation in production
- E-factura integration is currently a placeholder - implement actual SPV integration in production

