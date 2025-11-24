# Contracts & Billing PDF Generation Setup

## Installation

To enable PDF generation, install Puppeteer:

```bash
cd backend
npm install puppeteer
```

Or if you prefer Playwright:

```bash
npm install playwright
```

**Note:** Puppeteer is recommended as it's lighter and faster for PDF generation.

## Configuration

The PDF service automatically detects if Puppeteer is installed. If not, it falls back to placeholder URLs.

### Environment Variables (Optional)

For production, you may want to configure:

```env
# PDF Generation
PDF_STORAGE_TYPE=s3|local|cloudinary
PDF_STORAGE_BUCKET=your-bucket-name
PDF_STORAGE_REGION=eu-west-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
```

## Storage Implementation

The `uploadPdfToStorage()` function in `contracts-pdf.service.ts` is a placeholder. Implement based on your storage solution:

### Option 1: Local Filesystem

```typescript
import fs from 'fs/promises'
import path from 'path'

async function uploadPdfToStorage(pdfBuffer: Buffer, filename: string): Promise<string> {
  const uploadDir = path.join(process.cwd(), 'uploads')
  await fs.mkdir(uploadDir, { recursive: true })
  
  const filePath = path.join(uploadDir, filename)
  await fs.writeFile(filePath, pdfBuffer)
  
  return `/uploads/${filename}`
}
```

### Option 2: AWS S3

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: process.env.PDF_STORAGE_REGION || 'eu-west-1',
})

async function uploadPdfToStorage(pdfBuffer: Buffer, filename: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: process.env.PDF_STORAGE_BUCKET!,
    Key: filename,
    Body: pdfBuffer,
    ContentType: 'application/pdf',
  })
  
  await s3Client.send(command)
  
  return `https://${process.env.PDF_STORAGE_BUCKET}.s3.amazonaws.com/${filename}`
}
```

### Option 3: Cloudinary

```typescript
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

async function uploadPdfToStorage(pdfBuffer: Buffer, filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        folder: 'pdfs',
        public_id: filename.replace('.pdf', ''),
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result!.secure_url)
      }
    ).end(pdfBuffer)
  })
}
```

## Testing

After installation, test PDF generation:

```bash
# Start backend
npm run dev

# Test endpoint (requires admin auth)
curl -X POST http://localhost:3001/admin/contracts/invoices/{invoice-id}/generate-pdf \
  -H "Authorization: Bearer {admin-token}"
```

## Production Considerations

1. **Headless Browser**: Puppeteer runs in headless mode by default
2. **Memory**: Each PDF generation spawns a browser instance. Consider:
   - Using a browser pool/reuse
   - Implementing rate limiting
   - Using a dedicated PDF service (DocRaptor, PDFShift, etc.)
3. **Performance**: For high-volume, consider:
   - Queue system (Bull, BullMQ)
   - Background jobs
   - Caching generated PDFs
4. **Security**: Ensure proper file permissions and access control

## Alternative: PDF Service

For production, consider using a dedicated PDF service:

- **DocRaptor**: `npm install docraptor`
- **PDFShift**: `npm install pdfshift`
- **HTMLPDF**: `npm install html-pdf`

These services handle scaling and optimization automatically.

