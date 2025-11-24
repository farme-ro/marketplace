# Contracts & Billing Migration Guide

## Prisma Migration

To apply the Contracts & Billing models to your database, run:

```bash
cd backend
npx prisma migrate dev --name add_contracts_billing_models
```

Or if you want to create the migration file without applying it:

```bash
npx prisma migrate dev --name add_contracts_billing_models --create-only
```

Then review the migration file in `backend/prisma/migrations/` and apply it:

```bash
npx prisma migrate dev
```

## New Models

The migration adds the following models:

1. **ContractTemplate** - Template-uri de contracte
2. **ContractInstance** - Instanțe de contracte (generate din template-uri)
3. **Invoice** - Facturi
4. **InvoiceItem** - Items din facturi
5. **DeliveryNote** - Avize de expediere
6. **DeliveryNoteItem** - Items din avize

## Environment Variables

No new environment variables are required for basic functionality. However, for PDF generation and e-factura integration, you may need:

```env
# PDF Generation (optional - for production)
PDF_SERVICE_URL=https://your-pdf-service.com
PDF_API_KEY=your-api-key

# E-Factura Integration (optional - for production)
SPV_USERNAME=your-spv-username
SPV_PASSWORD=your-spv-password
EFACTURA_API_URL=https://api.efactura.ro
```

## Post-Migration Steps

1. **Verify Migration**: Check that all tables were created:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN (
     'contract_templates',
     'contract_instances',
     'invoices',
     'invoice_items',
     'delivery_notes',
     'delivery_note_items'
   );
   ```

2. **Generate Prisma Client**: After migration, regenerate the Prisma client:
   ```bash
   npx prisma generate
   ```

3. **Test Endpoints**: Test the new endpoints in the admin panel:
   - `/admin/contracts/templates` - List templates
   - `/admin/contracts/invoices` - List invoices
   - `/admin/contracts/invoices/:id/generate-pdf` - Generate PDF
   - `/admin/contracts/invoices/:id/generate-efactura` - Generate e-factura

## Notes

- PDF generation is currently a placeholder. Implement actual PDF generation using a service like Puppeteer, Playwright, or a PDF API.
- E-factura integration is currently a placeholder. Implement actual integration with SPV (Sistemul Privat Virtual) or a third-party service.
- All endpoints require ADMIN role authentication.

