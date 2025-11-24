# Internal Status Dashboard

**Data:** 2025-01-27  
**Scop:** Documentație pentru pagina internă de status și feature flags  
**Status:** ✅ Implementat

---

## 📋 Preambul

Pagina `/internal/status` este un dashboard intern pentru verificarea rapidă a stării feature flags și conectivității backend. Este accesibilă doar în modul development sau pentru utilizatori cu rol special.

---

## 🔒 Protecție Acces

### Condiții de Acces

Pagina este accesibilă dacă **cel puțin una** dintre următoarele condiții este îndeplinită:

1. **Environment Development:**
   - `process.env.NODE_ENV === 'development'`
   - Acces automat în development

2. **Environment Flag:**
   - `process.env.NEXT_PUBLIC_ENABLE_INTERNAL_STATUS === 'true'`
   - Poate fi setat în Vercel pentru preview/production dacă este necesar

3. **Rol Admin:**
   - `user.role === 'admin'`
   - Dacă rolul admin există în sistem

### Dacă Nu Ai Acces

Pagina afișează un mesaj de "Acces restricționat" cu explicație clară.

---

## 📊 Ce Arată Pagina

### 1. Build Info

- **Environment:** development / preview / production
- **Version:** Versiunea aplicației (din `NEXT_PUBLIC_APP_VERSION` sau default `1.0.0`)

### 2. Backend Connectivity

- **Status:** Online / Offline
- **HTTP Status Code:** Dacă backend răspunde
- **Error Message:** Dacă există eroare
- **Buton Refresh:** Pentru re-verificare

**Endpoint testat:** `GET /health` (sau `/status` dacă există)

**Notă:** Dacă endpoint-ul `/health` nu există, pagina afișează "Backend offline" cu mesaj explicativ.

### 3. Feature Flags Summary

- **Total:** Numărul total de feature flags
- **Active:** Numărul de feature-uri active (backend sync enabled)
- **Fallback:** Numărul de feature-uri în fallback mode (mock data)

### 4. Feature Flags Table

Tabel complet cu toate feature-urile din `BackendSyncStatus`:

- **Feature:** Numele feature-ului (ex: `cart`, `checkout`, etc.)
- **Status:** Badge "Active" sau "Fallback"
- **Mode:** Icon + text "Backend" sau "Mock"
- **Documentation:** Link către documentația din `FARMERO_BACKENDSYNC_ACTIVATION_PLAN.md`

---

## 🔧 Cum Se Folosește

### Verificare Rapidă

1. Deschide `/internal/status` în development
2. Verifică:
   - Câte feature-uri sunt active vs fallback
   - Dacă backend-ul răspunde
   - Versiunea și environment-ul

### Activare Feature

1. Backend implementează endpoint-urile necesare
2. Frontend testează manual flow-ul
3. Setează feature-ul pe `true` în `src/lib/backend-sync/status.ts`
4. Verifică în `/internal/status` că status-ul s-a actualizat
5. Commit și deploy

### Debugging

Dacă un feature nu funcționează:

1. Verifică în `/internal/status` dacă feature-ul este activ
2. Verifică dacă backend-ul răspunde
3. Verifică link-ul către documentație pentru endpoint-uri necesare
4. Verifică console-ul pentru erori

---

## 📁 Fișiere

- **Pagina:** `src/app/(site)/internal/status/page.tsx`
- **Configurație:** `src/lib/backend-sync/status.ts`
- **Documentație:** `docs/FARMERO_BACKENDSYNC_ACTIVATION_PLAN.md`

---

## 🚀 Extindere

### Adăugare Feature Flag Nou

1. Adaugă în `src/lib/backend-sync/status.ts`:
   ```typescript
   export const BackendSyncStatus = {
     // ... existing
     newFeature: false, // GET /new-feature
   }
   ```

2. Pagina `/internal/status` va afișa automat noul feature în tabel.

### Adăugare Health Check Custom

Modifică funcția `checkBackendHealth()` în `src/app/(site)/internal/status/page.tsx`:

```typescript
async function checkBackendHealth(): Promise<{ online: boolean; status?: number; error?: string }> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    // Schimbă endpoint-ul aici
    const response = await fetch(`${baseUrl}/your-health-endpoint`, {
      // ... config
    })
    return { online: response.ok, status: response.status }
  } catch (error) {
    return { online: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
```

### Adăugare Metrici Suplimentare

Poți adăuga secțiuni noi în pagina pentru:
- Response times
- Error rates
- Feature usage stats
- etc.

---

## ⚠️ Notă Importantă

**Această pagină NU trebuie să fie accesibilă în producție pentru utilizatori normali.**

Verifică întotdeauna că:
- `NEXT_PUBLIC_ENABLE_INTERNAL_STATUS` nu este setat în production (sau doar pentru admini)
- Rolul admin este verificat corect
- Nu expune informații sensibile (ex: API keys, tokens)

---

**Ultima actualizare:** 2025-01-27

