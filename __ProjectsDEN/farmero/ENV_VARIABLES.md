# Environment Variables Documentation

## Frontend Environment Variables

### Required Variables

#### `NEXT_PUBLIC_API_URL`
- **Description**: Base URL for the backend API
- **Type**: String (URL)
- **Example**: `https://api.farme.ro`
- **Development**: `http://localhost:3001`
- **Production**: `https://api.farme.ro`
- **Required**: Yes
- **Note**: Must start with `NEXT_PUBLIC_` to be accessible in the browser

#### `NEXT_PUBLIC_API_BASE_URL` (Alternative)
- **Description**: Alternative name for API URL (used as fallback)
- **Type**: String (URL)
- **Example**: `https://api.farme.ro`
- **Required**: No (only if `NEXT_PUBLIC_API_URL` is not set)

### Optional Variables

#### `NODE_ENV`
- **Description**: Node.js environment
- **Type**: String
- **Options**: `development`, `production`, `test`
- **Default**: `development`
- **Required**: No

## Setup Instructions

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in the values in `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=https://api.farme.ro
   NODE_ENV=production
   ```

3. Restart the development server:
   ```bash
   npm run dev
   ```

## Important Notes

- **Never commit `.env.local`** to version control
- Variables starting with `NEXT_PUBLIC_` are exposed to the browser
- Use `.env.local` for local development
- Use environment variables in your deployment platform (Vercel, etc.) for production

## Backend Environment Variables

For backend environment variables, see the backend repository documentation.

