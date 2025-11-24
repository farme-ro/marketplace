# ⚡ Faza 1 - Frontend Quick Start

**Data:** 2025-01-27  
**Scop:** Ghid rapid pentru activarea task-urilor Frontend din Faza 1  
**Timp estimat:** 1 zi (după ce backend-ul este gata)

---

## 🚀 Quick Start (5 pași)

### 1. Verifică Status Backend

```bash
# Rulează script-ul de verificare
./scripts/check-backend-status.sh
```

**Verifică:**
- [ ] Backend este accesibil la `https://api.farme.ro`
- [ ] Endpoint-urile MVP răspund corect
- [ ] CORS este configurat corect

---

### 2. Verifică Feature Flags

**Fișier:** `src/lib/backend-sync/status.ts`

**Status actual:** ✅ **Toate feature-urile MVP sunt deja activate!**

```typescript
// Feature-uri MVP (deja activate)
cart: true,
checkout: true,
clientOrders: true,
producerProducts: true,
producerOrders: true,
```

**⚠️ Dacă backend-ul NU este gata:**
- Setează toate pe `false` temporar
- Sau lasă-le pe `true` dacă backend-ul este gata

---

### 3. Testează Manual

**Checklist:** `docs/CORE_COMMERCE_QA_CHECKLIST.md`

**Teste rapide:**
- [ ] Adaugă produs în coș → funcționează?
- [ ] Completează checkout → comandă creată?
- [ ] Vezi comenzi → lista se încarcă?
- [ ] Producer products → produse se încarcă?

**Timp:** 2-4 ore pentru testare completă

---

### 4. Setează Variabilele de Mediu în Vercel

**Vercel Dashboard:** https://vercel.com/dashboard

**Variabilă obligatorie:**
- **Name:** `NEXT_PUBLIC_API_URL`
- **Value:** `https://api.farme.ro`
- **Environment:** Production, Preview, Development

**Ghid complet:** `VERCEL_FRONTEND_SETUP.md`

---

### 5. Deploy

**Opțiunea 1: Deploy automat**
```bash
git commit --allow-empty -m "chore: trigger deploy for MVP"
git push
```

**Opțiunea 2: Deploy manual**
- Vercel Dashboard → Deployments → Create Deployment

**Verificare post-deploy:**
- [ ] Site-ul se încarcă: `https://farme.ro`
- [ ] API calls merg către backend: `/status`
- [ ] Cart & Checkout funcționează

---

## 📋 Checklist Final

### Pre-Deploy
- [ ] Backend endpoint-uri funcționale
- [ ] Feature flags verificate
- [ ] Testare manuală completă
- [ ] Variabile de mediu setate în Vercel

### Deploy
- [ ] Deploy reușit
- [ ] Site accesibil

### Post-Deploy
- [ ] Funcționalități critice verificate
- [ ] Error handling funcționează

---

## 🔗 Documentație Completă

- **Ghid detaliat:** `docs/FAZA1_FRONTEND_ACTIVATION_GUIDE.md`
- **QA Checklist:** `docs/CORE_COMMERCE_QA_CHECKLIST.md`
- **Vercel Setup:** `VERCEL_FRONTEND_SETUP.md`
- **Environment Variables:** `ENV_VARIABLES.md`

---

**Timp total:** **1 zi** (după ce backend-ul este gata)

