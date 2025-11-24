# 💳 Stripe Setup Complete Guide - farme.ro

**Data:** 2025-01-27  
**Status:** 📋 **Ghid complet pentru configurare Stripe**

---

## 🎯 Scop

Acest ghid te ajută să configurezi Stripe pentru plăți în producție.

---

## 📋 Pași Configurare

### 1. Creează Cont Stripe

1. Accesează [stripe.com](https://stripe.com)
2. Creează cont (sau loghează-te)
3. Completează informațiile despre business

### 2. Obține API Keys

1. **Dashboard Stripe:**
   - Accesează [Dashboard → Developers → API keys](https://dashboard.stripe.com/apikeys)

2. **Test Mode (pentru development):**
   - Folosește **Test keys** (toggle "Test mode")
   - **Publishable key:** `pk_test_...`
   - **Secret key:** `sk_test_...`

3. **Live Mode (pentru producție):**
   - Activează **Live mode** (toggle)
   - **Publishable key:** `pk_live_...`
   - **Secret key:** `sk_live_...`
   - ⚠️ **IMPORTANT:** Secret key-ul live este foarte sensibil!

### 3. Configurează Webhook

1. **Creează Webhook Endpoint:**
   - Accesează [Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
   - Click "Add endpoint"
   - **URL:** `https://api.farme.ro/api/payments/webhook`
   - **Events to send:** Selectează:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`

2. **Obține Webhook Secret:**
   - După creare, click pe webhook
   - Copiază **Signing secret** (`whsec_...`)

### 4. Configurează Environment Variables

#### Backend (.env)

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_...  # sau sk_test_... pentru development
STRIPE_WEBHOOK_SECRET=whsec_...  # Webhook signing secret
```

#### Frontend (.env.local)

```env
# Stripe Public Key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...  # sau pk_test_... pentru development
```

### 5. Verifică Configurarea

**Backend:**
```bash
cd backend
npm run check:config
```

Ar trebui să vezi:
```
✅ STRIPE_SECRET_KEY                     sk_...
✅ STRIPE_WEBHOOK_SECRET                 whsec_...
```

**Frontend:**
Verifică că `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` este setat.

---

## 🧪 Testare

### Test Cards (Test Mode)

Stripe oferă carduri de test:

**Success:**
- Card: `4242 4242 4242 4242`
- Expiry: Orice dată viitoare (ex: `12/34`)
- CVC: Orice 3 cifre (ex: `123`)
- ZIP: Orice 5 cifre (ex: `12345`)

**Decline:**
- Card: `4000 0000 0000 0002`
- Alte carduri de test: [Stripe Test Cards](https://stripe.com/docs/testing)

### Test Flow

1. **Create Checkout Session:**
   ```bash
   curl -X POST https://api.farme.ro/api/payments/create-checkout \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "orderId": "order-id",
       "successUrl": "https://farme.ro/thank-you",
       "cancelUrl": "https://farme.ro/checkout"
     }'
   ```

2. **Complete Payment:**
   - Folosește cardul de test
   - Verifică redirect la success URL

3. **Verify Webhook:**
   - Verifică în Stripe Dashboard → Webhooks → Events
   - Verifică că webhook-ul a fost trimis și procesat

---

## 🔒 Security Best Practices

1. **Never commit secrets:**
   - Adaugă `.env` în `.gitignore`
   - Folosește environment variables în producție

2. **Use different keys:**
   - Test keys pentru development
   - Live keys doar pentru producție

3. **Rotate keys:**
   - Rotatează keys periodic
   - Revoke keys compromis

4. **Webhook security:**
   - Verifică semnătura webhook-ului
   - Folosește HTTPS pentru webhook URL

---

## 🐛 Troubleshooting

### Webhook nu funcționează

1. **Verifică URL:**
   - URL-ul trebuie să fie accesibil public
   - Trebuie să fie HTTPS

2. **Verifică semnătura:**
   - Webhook secret trebuie să fie corect
   - Verifică în backend că semnătura este validată

3. **Verifică events:**
   - Asigură-te că events-urile selectate sunt corecte

### Payment nu funcționează

1. **Verifică keys:**
   - Test keys pentru test mode
   - Live keys pentru live mode
   - Nu amesteca test și live keys

2. **Verifică logs:**
   - Backend logs pentru erori
   - Stripe Dashboard → Logs pentru detalii

---

## 📚 Resurse

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe API Reference](https://stripe.com/docs/api)

---

## ✅ Checklist

- [ ] Cont Stripe creat
- [ ] API keys obținute (test și live)
- [ ] Webhook endpoint creat
- [ ] Webhook secret copiat
- [ ] Environment variables configurate
- [ ] Test payment funcționează
- [ ] Webhook funcționează
- [ ] Live payment testat (cu sumă mică)

---

**Status:** 📋 **Ghid complet pentru configurare Stripe**

**Notă:** După configurare, testează cu sume mici înainte de a procesa plăți reale.

