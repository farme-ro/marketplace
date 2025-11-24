# Contracts & Billing Testing Guide

## Prerequisites

1. **Database Migration**: Run Prisma migration first
   ```bash
   cd backend
   # Set DATABASE_URL in .env
   npx prisma migrate dev --name add_contracts_billing_models
   npx prisma generate
   ```

2. **Install Dependencies**: Install Puppeteer for PDF generation
   ```bash
   cd backend
   npm install puppeteer
   ```

3. **Admin Authentication**: Ensure you have an admin user and token

## Testing Endpoints

### 1. Contract Templates

#### List Templates
```bash
GET /admin/contracts/templates
Authorization: Bearer {admin-token}
```

#### Get Template by ID
```bash
GET /admin/contracts/templates/{id}
Authorization: Bearer {admin-token}
```

#### Create Template
```bash
POST /admin/contracts/templates
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "code": "producer_agreement",
  "name": "Acord Producător",
  "description": "Template pentru acordul cu producătorii",
  "content": "Acest contract este între {{producerName}} și farme.ro...",
  "variables": {
    "producerName": "string",
    "date": "string"
  },
  "category": "producer"
}
```

#### Update Template
```bash
PATCH /admin/contracts/templates/{id}
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "name": "Acord Producător Actualizat",
  "isActive": true
}
```

### 2. Contract Instances

#### List Instances
```bash
GET /admin/contracts/instances?page=1&limit=20
Authorization: Bearer {admin-token}
```

#### Create Instance
```bash
POST /admin/contracts/instances
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "templateId": "{template-id}",
  "producerId": "{producer-id}",
  "clientId": "{client-id}",
  "variables": {
    "producerName": "Ferma Popescu",
    "date": "2025-01-27"
  },
  "expiresAt": "2025-12-31T23:59:59Z"
}
```

#### Generate PDF
```bash
POST /admin/contracts/instances/{id}/generate-pdf
Authorization: Bearer {admin-token}
```

### 3. Invoices

#### List Invoices
```bash
GET /admin/contracts/invoices?page=1&limit=20&status=draft
Authorization: Bearer {admin-token}
```

#### Create Invoice
```bash
POST /admin/contracts/invoices
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "type": "customer",
  "orderId": "{order-id}",
  "producerId": "{producer-id}",
  "clientId": "{client-id}",
  "items": [
    {
      "description": "Rosii Bio - 5kg",
      "quantity": 5,
      "unitPrice": 19.52,
      "taxRate": 19,
      "orderItemId": "{order-item-id}"
    }
  ],
  "dueAt": "2025-02-27T23:59:59Z"
}
```

#### Update Invoice
```bash
PATCH /admin/contracts/invoices/{id}
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "status": "issued",
  "issuedAt": "2025-01-27T10:00:00Z"
}
```

#### Generate PDF
```bash
POST /admin/contracts/invoices/{id}/generate-pdf
Authorization: Bearer {admin-token}
```

#### Generate E-Factura
```bash
POST /admin/contracts/invoices/{id}/generate-efactura
Authorization: Bearer {admin-token}
```

### 4. Delivery Notes

#### List Delivery Notes
```bash
GET /admin/contracts/delivery-notes?page=1&limit=20
Authorization: Bearer {admin-token}
```

#### Create Delivery Note
```bash
POST /admin/contracts/delivery-notes
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "orderId": "{order-id}",
  "producerId": "{producer-id}",
  "items": [
    {
      "productId": "{product-id}",
      "productName": "Rosii Bio",
      "quantity": 5,
      "unit": "kg",
      "orderItemId": "{order-item-id}"
    }
  ],
  "carrierName": "Fan Courier",
  "trackingNumber": "FC123456789"
}
```

#### Generate PDF
```bash
POST /admin/contracts/delivery-notes/{id}/generate-pdf
Authorization: Bearer {admin-token}
```

## Testing in Admin UI

1. **Access Admin Panel**: Navigate to `http://localhost:3000/admin/system/contracts`

2. **Test Templates Tab**:
   - View list of templates
   - Click "Creează Template" (should open modal - placeholder)
   - Verify pagination works

3. **Test Invoices Tab**:
   - View list of invoices
   - Click "Creează Factură" (should open modal - placeholder)
   - Verify filters work (status, type, etc.)

4. **Test PDF Generation**:
   - Create an invoice
   - Use API endpoint to generate PDF
   - Verify PDF URL is saved in invoice record

5. **Test E-Factura**:
   - Create an invoice
   - Use API endpoint to generate e-factura
   - Verify XML URL and external ID are saved

## Expected Behavior

### PDF Generation
- **With Puppeteer**: Generates actual PDF file, uploads to storage, returns URL
- **Without Puppeteer**: Returns placeholder URL `/uploads/{type}/{id}.pdf`

### E-Factura
- **Current**: Returns placeholder XML URL and external ID
- **Production**: Should generate valid XML and submit to SPV

## Troubleshooting

### PDF Generation Fails
- Check if Puppeteer is installed: `npm list puppeteer`
- Check browser installation: Puppeteer downloads Chromium automatically
- Check memory: PDF generation uses significant memory
- Check logs: Look for Puppeteer errors in backend logs

### Migration Fails
- Verify `DATABASE_URL` is set in `.env`
- Check database connection
- Verify Prisma schema is valid: `npx prisma validate`

### Endpoints Return 403
- Verify admin token is valid
- Check user has ADMIN role
- Verify authentication middleware is working

## Next Steps

1. Implement storage upload (S3, Cloudinary, or local)
2. Implement e-factura XML generation (SPV format)
3. Add admin UI modals for create/edit
4. Add PDF preview in admin UI
5. Add download buttons for PDF and XML

