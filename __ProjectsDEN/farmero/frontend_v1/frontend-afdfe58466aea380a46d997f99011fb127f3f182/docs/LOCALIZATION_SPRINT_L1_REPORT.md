# 📋 L1 - i18n Cleanup: Eliminare texte hardcodate

**Data:** 2025-01-27  
**Status:** ✅ **În progres**

---

## ✅ Namespace-uri noi create

Am creat următoarele namespace-uri în `src/lib/i18n/translations/ro.json`:

### 1. `ui.*` - Elemente UI generice
- `ui.currency.symbol` - "lei"
- `ui.currency.code` - "RON"
- `ui.payment.method.card` - "Card"
- `ui.payment.method.cod` - "Ramburs"
- `ui.payment.method.bankTransfer` - "Transfer bancar"
- `ui.units.*` - Unități de măsură (buc, kg, g, l, ml)
- `ui.loading.*` - Mesaje de loading (default, saving, processing, etc.)

### 2. `errors.*` - Mesaje de eroare
- `errors.generic` - Eroare generică
- `errors.network` - Eroare de conexiune
- `errors.notFound` - Nu am găsit
- `errors.unauthorized` - Nu ai permisiune
- `errors.forbidden` - Acces interzis
- `errors.serverError` - Eroare de server
- `errors.validation.*` - Erori de validare
- `errors.cart.*` - Erori coș
- `errors.orders.*` - Erori comenzi
- `errors.products.*` - Erori produse
- `errors.producers.*` - Erori producători

### 3. `emptyStates.*` - Empty states
- `emptyStates.orders.*` - Empty state comenzi
- `emptyStates.products.*` - Empty state produse
- `emptyStates.producers.*` - Empty state producători
- `emptyStates.subscriptions.*` - Empty state abonamente
- `emptyStates.cart.*` - Empty state coș
- `emptyStates.favorites.*` - Empty state favorite
- `emptyStates.campaigns.*` - Empty state campanii

### 4. `notifications.*` - Notificări
- `notifications.success.*` - Mesaje de succes
- `notifications.error.*` - Mesaje de eroare
- `notifications.warning.*` - Mesaje de avertizare
- `notifications.info.*` - Mesaje informaționale

---

## ✅ Fișiere modificate

### 1. `src/lib/i18n/translations/ro.json`
- ✅ Adăugat namespace-uri noi: `ui.*`, `errors.*`, `emptyStates.*`, `notifications.*`

### 2. `src/app/(site)/orders/page.tsx`
- ✅ Înlocuit `'lei'` cu `t('ui.currency.symbol', 'lei')`
- ✅ Înlocuit `'Card'` cu `t('ui.payment.method.card', 'Card')`
- ✅ Înlocuit `'Ramburs'` cu `t('ui.payment.method.cod', 'Ramburs')`
- ✅ Înlocuit `'Eroare la adăugarea produselor în coș'` cu `t('errors.cart.addFailed', 'Eroare la adăugarea produselor în coș')`
- ✅ Corectat cheia duplicată `orders.title` → `orders.subtitle`

---

## ⚠️ Fișiere care necesită migrare

Următoarele fișiere conțin texte hardcodate care trebuie migrate:

### Prioritate înaltă:
1. `src/app/(site)/account/subscriptions/page.tsx` - Verificat, folosește deja i18n
2. `src/app/(site)/producer-portal/**/*.tsx` - Multe texte hardcodate
3. `src/app/(site)/business-portal/**/*.tsx` - Multe texte hardcodate
4. `src/app/(site)/logistics-portal/**/*.tsx` - Multe texte hardcodate
5. `src/app/(site)/investor-portal/**/*.tsx` - Multe texte hardcodate

### Prioritate medie:
6. `src/components/**/*.tsx` - Componente UI
7. `src/app/(site)/checkout/**/*.tsx` - Checkout flow
8. `src/app/(site)/cart/**/*.tsx` - Cart components

### Prioritate scăzută:
9. `src/app/(site)/about/**/*.tsx` - Pagini informaționale
10. `src/app/(site)/cum-functioneaza/**/*.tsx` - Pagini informaționale

---

## 📝 Stringuri ambigue sau imposibil de mapat

### 1. Console logs
- `console.error('Error loading orders:', err)` - Nu trebuie tradus (development only)
- `console.log(...)` - Nu trebuie tradus (development only)

### 2. Error messages din API
- `err.message` - Mesaje de eroare din backend, pot fi în orice limbă
- **Soluție:** Folosim `getUserFriendlyErrorMessage()` pentru a traduce mesajele de eroare

### 3. Date și numere
- `order.total.toFixed(2)` - Formatare numerică, nu text
- **Soluție:** Folosim `formatCurrency()` pentru formatare locale-aware (L5)

---

## 🎯 Următorii pași

1. **Migrare fișiere prioritate înaltă** - Portale (producer, business, logistics, investor)
2. **Migrare componente UI** - Componente reutilizabile
3. **Migrare checkout/cart** - Flow-uri critice
4. **Migrare pagini informaționale** - About, How it works, etc.
5. **Adăugare traduceri pentru EN, FR, IT, ES, DE** - Pentru namespace-urile noi

---

## ✅ Checklist

- [x] Creat namespace-uri noi (`ui.*`, `errors.*`, `emptyStates.*`, `notifications.*`)
- [x] Migrat texte hardcodate din `orders/page.tsx`
- [ ] Migrat texte hardcodate din portale
- [ ] Migrat texte hardcodate din componente UI
- [ ] Migrat texte hardcodate din checkout/cart
- [ ] Adăugat traduceri pentru EN, FR, IT, ES, DE
- [ ] Testat toate traducerile

---

**Document generat:** 2025-01-27  
**Status:** 🟡 **În progres** - Namespace-uri create, migrare în curs

