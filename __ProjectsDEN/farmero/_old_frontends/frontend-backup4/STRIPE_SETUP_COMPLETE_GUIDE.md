# 💳 Stripe Setup Complete Guide

**Data:** 2025-01-27  
**Scop:** Ghid complet pentru configurarea Stripe în producție

---

## 📋 Overview

Stripe este deja implementat în backend. Acest ghid te ajută să configurezi Stripe pentru producție.

---

## 🔑 Step 1: Obținere Chei Stripe

### 1.1. Creează Cont Stripe

1. Mergi la [stripe.com](https://stripe.com)
2. Creează un cont (sau loghează-te dacă ai deja)
3. Completează informațiile despre business

### 1.2. Obține Cheile API

1. Mergi la **Developers** → **API keys**
2. Vei vedea două seturi de chei:
   - **Test keys** (pentru development)
   - **Live keys** (pentru producție)

3. Pentru producție, folosește **Live keys**:
   - `sk_live_...` - Secret key (pentru backend)
   - `pk_live_...` - Publishable key (pentru frontend)

---

## 🔧 Step 2: Configurare Environment Variables

### 2.1. Backend (.env)

Adaugă în `backend/.env`:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 2.2. Frontend (.env.local)

Adaugă în `frontend/.env.local`:

```env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here
```

### 2.3. Vercel (Production)

Pentru backend:
1. Mergi la Vercel Dashboard → Proiectul backend
2. Settings → Environment Variables
3. Adaugă:
   - `STRIPE_SECRET_KEY` = `sk_live_...`
   - `STRIPE_WEBHOOK_SECRET` = `whsec_...`

Pentru frontend:
1. Mergi la Vercel Dashboard → Proiectul frontend
2. Settings → Environment Variables
3. Adaugă:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_live_...`

---

## 🔗 Step 3: Configurare Webhook

### 3.1. Creează Webhook Endpoint

1. Mergi la **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Configurează:
   - **Endpoint URL**: `https://api.farme.ro/api/payments/webhook`
   - **Events to send**: Selectează:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`

4. Click **Add endpoint**

### 3.2. Obține Webhook Secret

1. După crearea webhook-ului, click pe el
2. Găsește **Signing secret**
3. Copiază secret-ul (începe cu `whsec_...`)
4. Adaugă-l în environment variables (vezi Step 2.3)

---

## 🧪 Step 4: Testare

### 4.1. Test Cards

Pentru testare, folosește carduri de test:

**Carduri de test:**
- **Succes**: `4242 4242 4242 4242`
- **Declinat**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

**Date:**
- **Expiry**: Orice dată viitoare (ex: `12/25`)
- **CVC**: Orice 3 cifre (ex: `123`)
- **ZIP**: Orice cod poștal (ex: `12345`)

### 4.2. Testare Local

1. Rulează backend-ul local:
   ```bash
   cd backend
   npm run dev
   ```

2. Rulează frontend-ul local:
   ```bash
   cd frontend
   npm run dev
   ```

3. Testează fluxul complet:
   - Adaugă produse în coș
   - Mergi la checkout
   - Completează formularul
   - Folosește cardul de test
   - Verifică că comanda este creată

### 4.3. Testare Webhook Local

Pentru testare locală a webhook-urilor, folosește Stripe CLI:

1. Instalează Stripe CLI:
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Windows
   # Download de la https://github.com/stripe/stripe-cli/releases
   ```

2. Login:
   ```bash
   stripe login
   ```

3. Forward webhook-uri către local:
   ```bash
   stripe listen --forward-to localhost:3001/api/payments/webhook
   ```

4. Folosește webhook secret-ul afișat în terminal

---

## ✅ Step 5: Verificare Finală

### Checklist:

- [ ] Chei Stripe adăugate în environment variables
- [ ] Webhook configurat în Stripe Dashboard
- [ ] Webhook secret adăugat în environment variables
- [ ] Testat cu carduri de test
- [ ] Verificat că comenzile sunt create corect
- [ ] Verificat că webhook-urile sunt primite

---

## 🚨 Troubleshooting

### Problem: Webhook nu este primit

**Soluții:**
1. Verifică că URL-ul webhook-ului este corect
2. Verifică că webhook secret-ul este corect
3. Verifică logs-urile backend-ului pentru erori
4. Folosește Stripe Dashboard → Webhooks → Events pentru a vedea ce se întâmplă

### Problem: Payment nu este procesat

**Soluții:**
1. Verifică că `STRIPE_SECRET_KEY` este corect
2. Verifică că `STRIPE_PUBLISHABLE_KEY` este corect în frontend
3. Verifică logs-urile pentru erori
4. Verifică că cardul de test este valid

### Problem: 3D Secure nu funcționează

**Soluții:**
1. Verifică că folosești cardul de test pentru 3D Secure
2. Verifică că frontend-ul este configurat corect pentru 3D Secure
3. Verifică logs-urile pentru erori

---

## 📚 Resurse

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)

---

## ✅ Status

**Backend:** ✅ Implementat și gata pentru configurare  
**Frontend:** ✅ Implementat și gata pentru configurare  
**Webhook:** ✅ Implementat și gata pentru configurare

**Următorul pas:** Configurează cheile și testează!

---

**Ghid complet!** ✅

