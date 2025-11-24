# i18n Review TODO - Ukrainian & Hungarian Translations

**Data:** 2025-01-27  
**Status:** ⚠️ **REVIEW NECESAR**

---

## 📋 Rezumat

Fișierele `uk.json` și `hu.json` conțin traduceri **machine-translated** (copiate din `en.json`).

**Acestea trebuie revizuite de un traducător uman pentru acuratețe și context cultural.**

---

## ⚠️ Fișiere Necesită Review

- ✅ `src/lib/i18n/translations/uk.json` - Українська
- ✅ `src/lib/i18n/translations/hu.json` - Magyar

---

## 🎯 Prioritate Review

### 🔴 Prioritate Înaltă (UI Vizibil)

**Namespace-uri critice pentru UX:**

1. **`common`** - Butoane, acțiuni, mesaje comune
2. **`homepage`** - Hero, secțiuni, CTAs
3. **`auth`** - Login, register, forgot password
4. **`products`** - Listă produse, filtre, detalii
5. **`producers`** - Listă producători, profil
6. **`checkout`** - Coș, adrese, plată
7. **`cookies`** - Cookie banner, preferences

### 🟡 Prioritate Medie

**Namespace-uri importante:**

8. **`orders`** - Istoric comenzi, detalii
9. **`account`** - Profil, setări
10. **`producer-portal`** - Dashboard producător
11. **`business-portal`** - Dashboard business
12. **`errors`** - Mesaje de eroare

### 🟢 Prioritate Scăzută

**Namespace-uri secundare:**

13. **`investor-portal`** - Dashboard investitori
14. **`logistics-portal`** - Dashboard logistică
15. **`importer-portal`** - Dashboard importatori
16. **`legal`** - Terms, privacy, cookies policy

---

## 📝 Checklist Review

### Pentru Fiecare Fișier (uk.json, hu.json)

- [ ] **Structură chei** - Toate cheile există (compară cu `ro.json` sau `en.json`)
- [ ] **Gramatică** - Verificare gramatică corectă
- [ ] **Terminologie** - Termeni specifici domeniului (agricultură, marketplace)
- [ ] **Context cultural** - Adaptare la contextul local
- [ ] **Formalitate** - Nivelul de formalitate (tu/vous, etc.)
- [ ] **Formatare** - Numere, date, monede (RON rămâne, dar formatare poate varia)

### Exemple de Verificare

#### 1. Butoane și Acțiuni

```json
{
  "actions": {
    "addToCart": "Add to cart",  // ← Verifică traducere corectă
    "buyNow": "Buy now",
    "viewDetails": "View details"
  }
}
```

#### 2. Mesaje de Eroare

```json
{
  "errors": {
    "notFound": "Page not found",  // ← Verifică mesajul e clar
    "unauthorized": "Unauthorized access"
  }
}
```

#### 3. Termeni Tehnici

```json
{
  "products": {
    "category": "Category",  // ← Verifică termenul e corect în limba respectivă
    "price": "Price",
    "stock": "Stock"
  }
}
```

---

## 🔍 Verificare Automată Structură

**Script pentru verificare:**

```bash
# Compară structura cheilor între fișiere
node -e "
const fs = require('fs');
const ro = JSON.parse(fs.readFileSync('src/lib/i18n/translations/ro.json'));
const uk = JSON.parse(fs.readFileSync('src/lib/i18n/translations/uk.json'));
const hu = JSON.parse(fs.readFileSync('src/lib/i18n/translations/hu.json'));

function getKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const fullKey = prefix ? \`\${prefix}.\${key}\` : key;
    keys.push(fullKey);
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = keys.concat(getKeys(obj[key], fullKey));
    }
  }
  return keys;
}

const roKeys = getKeys(ro).sort();
const ukKeys = getKeys(uk).sort();
const huKeys = getKeys(hu).sort();

console.log('RO keys:', roKeys.length);
console.log('UK keys:', ukKeys.length);
console.log('HU keys:', huKeys.length);

const missingInUk = roKeys.filter(k => !ukKeys.includes(k));
const missingInHu = roKeys.filter(k => !huKeys.includes(k));

if (missingInUk.length > 0) {
  console.log('\\nMissing in UK:', missingInUk.slice(0, 10));
}
if (missingInHu.length > 0) {
  console.log('\\nMissing in HU:', missingInHu.slice(0, 10));
}
"
```

---

## 📚 Resurse pentru Traducători

### Terminologie Specifică

**Agricultură:**
- Produse tradiționale
- Produse bio
- Producător local
- Marketplace

**E-commerce:**
- Coș de cumpărături
- Checkout
- Comandă
- Livrare

**Business:**
- Comision
- Abonament
- Factură
- Contract

---

## ✅ Criterii de Acceptare

Consideră review-ul complet când:

- [ ] Toate cheile din `ro.json` există în `uk.json` și `hu.json`
- [ ] Traducerile sunt gramatical corecte
- [ ] Terminologia e consistentă
- [ ] Contextul cultural e adaptat
- [ ] Nu există texte hardcodate în engleză/română
- [ ] Testare manuală: UI se traduce corect în toate limbile

---

## 🚀 Următorii Pași

1. **Asignează traducător** pentru UK și HU
2. **Review prioritar** - Namespace-uri critice (common, homepage, auth, etc.)
3. **Review complet** - Toate namespace-urile
4. **Testare** - Verifică UI în toate limbile
5. **Actualizează status** - Marchează ca "reviewed" în `_meta`

---

**Ultima actualizare:** 2025-01-27  
**Status:** ⚠️ **PENDING HUMAN REVIEW**

