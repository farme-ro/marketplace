# Stripe Setup Guide - farme.ro

**Data:** 2025-01-27  
**Status:** ⏳ **Necesită configurare pentru producție**

## 📋 Rezumat

Această ghidă explică cum să configurezi Stripe pentru plăți în producție.

## 🔑 Pași pentru Configurare

### 1. Creare Cont Stripe

1. Accesează [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Creează cont sau loghează-te
3. Completează informațiile despre business

### 2. Obținere Chei API

#### Pentru Development (Test Mode):
1. În Dashboard Stripe, mergi la **Developers** → **API keys**
2. Copiază **Publishable key** (începe cu `pk_test_...`)
3. Copiază **Secret key** (începe cu `sk_test_...`)

#### Pentru Production (Live Mode):
1. Activează **Live mode** în Dashboard
2. Mergi la **Developers** → **API keys**
3. Copiază **Publishable key** (începe cu `pk_live_...`)
4. Copiază **Secret key** (începe cu `sk_live_...`)

⚠️ **IMPORTANT:** Nu partaja niciodată Secret key-ul public!

### 3. Configurare Webhook

1. În Dashboard Stripe, mergi la **Developers** → **Webhooks**
2. Click **Add endpoint**
3. URL endpoint: `https://api.farme.ro/api/payments/webhook`
4. Selectează evenimente:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copiază **Signing secret** (începe cu `whsec_...`)

### 4. Configurare Variabile de Mediu

Adaugă în fișierul `.env` al backend-ului:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_... # sau sk_test_... pentru development
STRIPE_PUBLISHABLE_KEY=pk_live_... # sau pk_test_... pentru development
STRIPE_WEBHOOK_SECRET=whsec_... # Signing secret din webhook

# Frontend Configuration (adaugă în .env al frontend-ului)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... # sau pk_test_...
```

### 5. Verificare Configurare

După configurare, testează:

1. **Test Mode:**
   - Folosește carduri de test: `4242 4242 4242 4242`
   - CVV: orice 3 cifre
   - Expiry: orice dată viitoare
   - ZIP: orice 5 cifre

2. **Verificare Webhook:**
   - Verifică că webhook-ul primește evenimente
   - Verifică logs în backend pentru erori

## 🔒 Securitate

### Best Practices:

1. ✅ **Nu hardcode chei în cod** - folosește variabile de mediu
2. ✅ **Nu commit chei în Git** - adaugă `.env` în `.gitignore`
3. ✅ **Folosește chei diferite** pentru development și producție
4. ✅ **Rotează cheile periodic** - în caz de compromitere
5. ✅ **Verifică webhook signature** - backend-ul verifică deja semnătura

## 📝 Endpoint-uri Implementate

Backend-ul are deja implementate:

- ✅ `POST /api/payments/create-checkout` - Creează Stripe Checkout Session
- ✅ `POST /api/payments/webhook` - Primește evenimente Stripe

## 🧪 Testare

### Testare Locală (Development):

1. Folosește Stripe CLI pentru webhook-uri locale:
   ```bash
   stripe listen --forward-to localhost:3001/api/payments/webhook
   ```

2. Testează cu carduri de test:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - 3D Secure: `4000 0025 0000 3155`

### Testare în Production:

1. Creează o comandă de test cu valoare mică
2. Completează checkout-ul cu card de test
3. Verifică că:
   - Comanda este creată
   - Status-ul este actualizat
   - Webhook-ul primește evenimentul

## ⚠️ Note Importante

1. **Webhook URL** trebuie să fie accesibil public (nu localhost)
2. **HTTPS** este obligatoriu pentru webhook-uri în producție
3. **Rate limiting** este configurat pentru endpoint-urile de plată
4. **Error handling** este implementat pentru toate scenariile

## 📚 Resurse

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)

## ✅ Checklist Configurare

- [ ] Cont Stripe creat
- [ ] Chei API obținute (test și live)
- [ ] Webhook configurat
- [ ] Variabile de mediu setate
- [ ] Testat în development
- [ ] Testat în production
- [ ] Documentat procesul pentru echipă

---

**Status:** 🟡 **Ghidă completă - Așteaptă configurare chei Stripe**

