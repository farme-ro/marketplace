# Sentry Setup - Error Tracking

## ✅ Status: Pregătit pentru integrare

Sentry este instalat și configurat în cod. Pentru a activa error tracking-ul, trebuie să adaugi DSN-ul Sentry.

## 📋 Pași pentru activare

### 1. Creează un proiect Sentry

1. Mergi la [sentry.io](https://sentry.io)
2. Creează un cont sau loghează-te
3. Creează un proiect nou pentru Next.js
4. Copiază DSN-ul (Data Source Name)

### 2. Adaugă DSN-ul în variabilele de mediu

**Development (`.env.local`):**
```env
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
```

**Production (Vercel):**
1. Mergi la Vercel Dashboard → Settings → Environment Variables
2. Adaugă:
   - **Name:** `NEXT_PUBLIC_SENTRY_DSN`
   - **Value:** `https://your-dsn@sentry.io/project-id`
   - **Environment:** ✅ Production, ✅ Preview

### 3. Redeploy aplicația

După ce adaugi variabila, fă redeploy pentru ca modificările să fie aplicate.

## 🔧 Configurare

Sentry este configurat în `src/lib/sentry.ts`:
- Se inițializează doar în production
- Filtrează automat erorile WebSocket (care sunt normale)
- Capturează 10% din tranzacții pentru performance monitoring

## 📍 Locații integrate

- ✅ `src/components/error-boundary.tsx` - Error boundary pentru componente
- ✅ `src/app/error.tsx` - Pagină globală de eroare

## 🧪 Testare

Pentru a testa integrarea Sentry:

1. Adaugă DSN-ul în `.env.local`
2. Creează o eroare intenționată în cod
3. Verifică în Sentry dashboard că eroarea apare

## 📝 Note

- Sentry se activează automat când `NEXT_PUBLIC_SENTRY_DSN` este setat
- În development, erorile sunt logate doar în consolă
- Erorile WebSocket sunt filtrate automat (sunt normale și nu trebuie raportate)

