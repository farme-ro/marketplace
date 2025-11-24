# ♿ Accessibility Post-Launch TODO

**Data:** 2025-01-27  
**Scop:** Îmbunătățiri de accesibilitate pentru post-launch  
**Status:** 🟢 Nice-to-Have

---

## ✅ Status Actual

**Verificare minimă pentru lansare:**
- ✅ Majoritatea butoanelor icon-only au `aria-label` și `title`
- ✅ ThemeToggle are `aria-label` și `title`
- ✅ Cart button are `aria-label` și `title`
- ✅ Notification center are component dedicat (verificat)
- ✅ Mobile menu button are `aria-label`
- ✅ Search button are `aria-label`

---

## 🟡 Îmbunătățiri Post-Launch

### 1. Testare cu Screen Reader

**Prioritate:** 🟡 **MEDIUM**

**Acțiune:**
- [ ] Testare manuală cu NVDA (Windows)
- [ ] Testare manuală cu JAWS (Windows)
- [ ] Testare manuală cu VoiceOver (macOS/iOS)
- [ ] Testare manuală cu TalkBack (Android)

**Pagini de testat:**
- `/` (homepage)
- `/products`
- `/products/[slug]`
- `/cart`
- `/checkout`
- `/login`
- `/register`
- `/account`
- `/producer-portal/dashboard`

---

### 2. Verificare Focus Visual

**Prioritate:** 🟡 **MEDIUM**

**Acțiune:**
- [ ] Verifică că toate elementele interactive au focus visual clar
- [ ] Verifică că focus-ul nu este ascuns sau prea subtil
- [ ] Testează navigarea cu tastatură (Tab, Shift+Tab, Enter, Space, Arrow keys)

**Elemente de verificat:**
- Butoane
- Link-uri
- Input-uri
- Dropdown-uri
- Modal-uri
- Sidebar-uri

---

### 3. Verificare Contrast

**Prioritate:** 🟡 **MEDIUM**

**Acțiune:**
- [ ] Rulează Lighthouse Accessibility audit
- [ ] Verifică contrast-ul textului pe fundal
- [ ] Verifică contrast-ul butoanelor și link-urilor
- [ ] Verifică contrast-ul border-urilor și outline-urilor

**Tool-uri:**
- Lighthouse (Chrome DevTools)
- WAVE (Web Accessibility Evaluation Tool)
- axe DevTools

---

### 4. Verificare Keyboard Navigation

**Prioritate:** 🟡 **MEDIUM**

**Acțiune:**
- [ ] Verifică că toate elementele interactive sunt accesibile cu tastatura
- [ ] Verifică că nu există "keyboard traps" (elemente care blochează navigarea)
- [ ] Verifică că modal-urile pot fi închise cu Escape
- [ ] Verifică că dropdown-urile pot fi navigați cu Arrow keys

---

### 5. Verificare ARIA Labels

**Prioritate:** 🟢 **LOW**

**Acțiune:**
- [ ] Verifică că toate butoanele icon-only au `aria-label`
- [ ] Verifică că toate link-urile icon-only au `aria-label` sau text vizibil
- [ ] Verifică că toate form-urile au `aria-label` sau `<label>` asociate
- [ ] Verifică că toate erorile de validare au `aria-describedby` sau `aria-invalid`

---

### 6. Verificare Semantic HTML

**Prioritate:** 🟢 **LOW**

**Acțiune:**
- [ ] Verifică că se folosesc tag-uri semantice corecte (`<nav>`, `<main>`, `<header>`, `<footer>`, `<article>`, `<section>`)
- [ ] Verifică că heading-urile sunt în ordine corectă (h1, h2, h3, etc.)
- [ ] Verifică că listele sunt marcate cu `<ul>` sau `<ol>`

---

## 📊 Checklist Final

- [ ] Testare cu screen reader (NVDA/JAWS)
- [ ] Verificare focus visual
- [ ] Verificare contrast (Lighthouse)
- [ ] Verificare keyboard navigation
- [ ] Verificare ARIA labels
- [ ] Verificare semantic HTML

---

**Notă:** Aceste îmbunătățiri nu sunt critice pentru MVP, dar sunt recomandate pentru o experiență mai bună pentru utilizatorii cu dizabilități.

