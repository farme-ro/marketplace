# E-Factura Implementation Guide

## Overview

This guide explains how to implement full e-factura integration for Romanian invoices. The current implementation provides a basic XML generator that creates UBL 2.1 compliant XML files. For production use, you need to complete the SPV (Sistemul Privat Virtual) integration.

## Current Implementation Status

✅ **Completed:**
- Basic UBL 2.1 XML generation
- XML storage (S3, Cloudinary, Local)
- Invoice data mapping to XML structure
- Tax calculations (basic)

⚠️ **Pending (Required for Production):**
- SPV API authentication
- XML submission to ANAF
- Digital signature (XAdES)
- Validation against ANAF specifications
- Error handling and retry logic

## Configuration

### Environment Variables

```env
# Company Details (Issuer)
EFACTURA_ISSUER_CUI=RO12345678
EFACTURA_ISSUER_NAME=Farmero Platform SRL
EFACTURA_ISSUER_ADDRESS=Str. Example, Nr. 1, Bucharest, Romania

# SPV API Credentials (when implementing submission)
EFACTURA_SPV_USERNAME=your-username
EFACTURA_SPV_PASSWORD=your-password
# OR use certificate-based auth:
EFACTURA_SPV_CERT_PATH=/path/to/certificate.pfx
EFACTURA_SPV_CERT_PASSWORD=cert-password

# Storage (uses same as PDF storage)
PDF_STORAGE_BACKEND=local|s3|cloudinary
```

## Implementation Steps

### 1. Complete XML Generation

The current implementation generates basic UBL 2.1 XML. You need to:

1. **Add missing required fields:**
   - Company registration details
   - Bank account information
   - Contact information
   - Payment terms

2. **Validate against ANAF specifications:**
   - Use ANAF validation service
   - Check for required fields
   - Verify tax calculations

3. **Add digital signature:**
   - Generate XAdES signature
   - Include in XML structure
   - Validate signature before submission

### 2. Implement SPV API Integration

#### Authentication

```typescript
// Example authentication flow
async function authenticateWithSPV(): Promise<string> {
  const response = await axios.post('https://api.anaf.ro/efactura/auth', {
    username: process.env.EFACTURA_SPV_USERNAME,
    password: process.env.EFACTURA_SPV_PASSWORD,
  })
  
  return response.data.token
}
```

#### Submission

```typescript
// Example submission flow
async function submitToSPV(xmlContent: string, authToken: string): Promise<string> {
  const response = await axios.post(
    'https://api.anaf.ro/efactura/submit',
    xmlContent,
    {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/xml',
      },
    }
  )
  
  return response.data.invoiceId // External ID from ANAF
}
```

### 3. Add Error Handling

```typescript
// Retry logic for failed submissions
async function submitWithRetry(xmlContent: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const token = await authenticateWithSPV()
      const externalId = await submitToSPV(xmlContent, token)
      return externalId
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
}
```

### 4. Add Validation

```typescript
// Validate XML before submission
async function validateEFacturaXml(xmlContent: string): Promise<boolean> {
  // Use ANAF validation service or XSD schema validation
  const response = await axios.post(
    'https://api.anaf.ro/efactura/validate',
    xmlContent,
    {
      headers: { 'Content-Type': 'application/xml' },
    }
  )
  
  return response.data.valid
}
```

## Testing

### 1. Test XML Generation

```bash
# Generate XML for an invoice
POST /admin/contracts/invoices/{id}/generate-efactura

# Check response
{
  "xmlUrl": "/uploads/invoices/{id}-{number}-efactura.xml",
  "externalId": "EFACTURA-{number}-{timestamp}"
}
```

### 2. Validate XML Structure

```bash
# Download XML and validate against UBL 2.1 schema
# Use online validators or XSD validation tools
```

### 3. Test SPV Integration (Sandbox)

```bash
# Use ANAF sandbox environment for testing
EFACTURA_SPV_ENDPOINT=https://api-sandbox.anaf.ro/efactura
```

## Production Checklist

- [ ] Configure company details (CUI, address, bank account)
- [ ] Obtain SPV API credentials
- [ ] Implement SPV authentication
- [ ] Implement XML submission
- [ ] Add digital signature support
- [ ] Add validation before submission
- [ ] Add error handling and retry logic
- [ ] Add monitoring and logging
- [ ] Test with ANAF sandbox
- [ ] Get approval for production use
- [ ] Set up backup and recovery

## Resources

- **ANAF E-Factura Portal:** https://mfinante.gov.ro/static/10/Mfp/infotva/efactura/index.html
- **UBL 2.1 Specification:** http://docs.oasis-open.org/ubl/os-UBL-2.1/
- **SPV API Documentation:** (Contact ANAF for access)
- **Romanian E-Factura Guide:** https://mfinante.gov.ro/static/10/Mfp/infotva/efactura/ghid_efactura.pdf

## Support

For questions or issues:
1. Check ANAF documentation
2. Contact ANAF support
3. Consult with legal/accounting team
4. Review error logs in application

## Notes

- E-factura is mandatory for B2B transactions in Romania
- XML must be submitted within 5 days of invoice issuance
- Digital signature is required for submission
- Keep XML files for at least 10 years (legal requirement)
- Monitor ANAF for specification updates

