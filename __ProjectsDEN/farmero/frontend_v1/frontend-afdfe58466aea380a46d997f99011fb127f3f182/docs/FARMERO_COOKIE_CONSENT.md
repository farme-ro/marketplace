# 🍪 Cookie Consent System - Farmero

**Data:** 2025-01-27  
**Status:** ✅ **Implementat**

---

## 📋 Preambul

Sistem complet de gestionare a consimțământului pentru cookie-uri, conform GDPR, integrat cu i18n, theme system și infrastructură pentru controlul scripturilor non-esențiale.

---

## 🏗️ Structură

### Fișiere create:

1. **`src/lib/cookies/cookie-consent.ts`**
   - Logica de gestionare a consimțământului
   - Funcții: `getCookieConsent()`, `saveCookieConsent()`, `hasUserMadeCookieChoice()`
   - Categorii: `necessary`, `analytics`, `functional`, `marketing`

2. **`src/lib/cookies/script-loader.ts`**
   - Controlul încărcării scripturilor non-esențiale
   - Funcții: `initAnalyticsIfConsented()`, `initMarketingIfConsented()`, `initFunctionalIfConsented()`
   - Reinițializare: `reinitializeScripts()`

3. **`src/components/cookies/cookie-banner.tsx`**
   - Banner non-intruziv pentru consimțământ
   - Animații subtile (fade-in + slide-up)
   - Respectă `prefers-reduced-motion`

4. **`src/components/cookies/cookie-preferences-modal.tsx`**
   - Modal pentru gestionarea preferințelor
   - Toggle-uri pentru fiecare categorie
   - Integrare cu theme system

---

## 🎨 Design & UX

### Cookie Banner

**Caracteristici:**
- Poziție: bottom (sticky)
- Animație: fade-in + slide-up (respectă `prefers-reduced-motion`)
- Delay: 1 secundă (non-intruziv)
- Design: card cu border, shadow, rounded corners
- Icon: Leaf (eco-friendly)
- Butoane: "Accept toate", "Resping opționalele", "Personalizează"

**Theme Integration:**
- Light mode: `bg-card`, `border-border`, accent `primary`
- Dark mode: `bg-card`, `border-border`, accent `primary`
- Folosește doar theme tokens, fără culori hardcodate

### Cookie Preferences Modal

**Caracteristici:**
- Toggle-uri pentru fiecare categorie
- Icon-uri: Shield (necessary), BarChart3 (analytics), Settings (functional), Megaphone (marketing)
- Necessary: disabled, mereu ON
- Butoane: "Salvează preferințele", "Accept toate"
- Link către `/cookies` pentru mai multe informații

---

## 🌍 i18n Support

### Limbi suportate:
- 🇷🇴 Română (RO)
- 🇬🇧 English (EN)
- 🇫🇷 Français (FR)
- 🇮🇹 Italiano (IT)
- 🇩🇪 Deutsch (DE)
- 🇪🇸 Español (ES)

### Namespace: `cookies.*`

**Banner:**
- `cookies.banner.title`
- `cookies.banner.description`
- `cookies.banner.acceptAll`
- `cookies.banner.rejectAll`
- `cookies.banner.customize`
- `cookies.banner.learnMore`

**Modal:**
- `cookies.modal.title`
- `cookies.modal.intro`
- `cookies.modal.necessary.label` / `.description`
- `cookies.modal.analytics.label` / `.description`
- `cookies.modal.functional.label` / `.description`
- `cookies.modal.marketing.label` / `.description`
- `cookies.modal.save`
- `cookies.modal.acceptAll`

**Footer:**
- `cookies.footer.settings`

---

## 💾 Storage

### LocalStorage Key: `farmero_cookie_consent_v1`

**Structură:**
```typescript
{
  consent: {
    necessary: true,      // Always true
    analytics: boolean,
    functional: boolean,
    marketing: boolean
  },
  updatedAt: string,      // ISO date
  version: string         // '1.0'
}
```

---

## 🔧 Integrare Scripturi

### Analytics

**Când userul acceptă analytics:**
```typescript
// TODO: Initialize Google Analytics
// if (window.gtag) {
//   window.gtag('consent', 'update', {
//     analytics_storage: 'granted'
//   })
// }
```

**Când userul revocă analytics:**
```typescript
// TODO: Stop analytics tracking
// if (window.gtag) {
//   window.gtag('consent', 'update', {
//     analytics_storage: 'denied'
//   })
// }
```

### Marketing

**Când userul acceptă marketing:**
```typescript
// TODO: Initialize Meta Pixel, Google Ads, etc.
// if (window.fbq) {
//   window.fbq('consent', 'grant')
// }
```

**Când userul revocă marketing:**
```typescript
// TODO: Stop marketing tracking
// if (window.fbq) {
//   window.fbq('consent', 'revoke')
// }
```

### Functional

**Când userul acceptă functional:**
```typescript
// TODO: Initialize functional scripts (chat widgets, personalization)
```

---

## 🔗 Integrare în Layout

### SiteLayoutClient

**Componente integrate:**
```tsx
<CookieBanner onCustomize={() => setIsCookieModalOpen(true)} />
<CookiePreferencesModal
  isOpen={isCookieModalOpen}
  onClose={() => setIsCookieModalOpen(false)}
/>
```

**Event Listener:**
- Butonul din footer emite event `openCookiePreferences`
- Layout-ul ascultă event-ul și deschide modalul

### Footer Link

**Buton în footer:**
```tsx
<button
  onClick={() => {
    window.dispatchEvent(new CustomEvent('openCookiePreferences'))
  }}
>
  {t('cookies.footer.settings', 'Setări cookie-uri')}
</button>
```

---

## ♿ Accesibilitate

### Banner
- `role="region"` cu `aria-label` localizat
- Butoane accesibile cu tastatura (Tab / Shift+Tab)
- Focus states clare

### Modal
- Focus trap
- `aria-labelledby` / `aria-describedby`
- Navigare completă cu tastatura
- Escape key pentru închidere

### Reduced Motion
- Respectă `prefers-reduced-motion`
- Animații foarte subtile sau fără animație dacă userul preferă

---

## 📝 Utilizare

### Verificare consimțământ

```typescript
import { hasUserMadeCookieChoice, isCategoryConsented } from '@/lib/cookies/cookie-consent'

// Verifică dacă userul a făcut o alegere
if (hasUserMadeCookieChoice()) {
  // Userul a făcut deja o alegere
}

// Verifică dacă o categorie este acceptată
if (isCategoryConsented('analytics')) {
  // Userul a acceptat analytics
}
```

### Inițializare scripturi

```typescript
import { reinitializeScripts } from '@/lib/cookies/script-loader'

// După ce userul salvează preferințele
reinitializeScripts()
```

---

## 🔄 Flux de Utilizare

1. **Prima vizită:**
   - Banner apare după 1 secundă
   - Userul poate: Accept toate / Resping opționalele / Personalizează

2. **Personalizează:**
   - Se deschide modalul
   - Userul poate activa/dezactiva categorii (except necessary)
   - Salvează preferințele

3. **Schimbare ulterioară:**
   - Userul poate accesa "Setări cookie-uri" din footer
   - Se deschide direct modalul (fără banner)

4. **Salvare:**
   - Preferințele sunt salvate în localStorage
   - Scripturile sunt reinițializate
   - Banner-ul dispare

---

## 🚀 Extindere Viitoare

### Adăugare categorii noi

1. Adaugă categoria în `CookieConsentCategory`:
```typescript
export type CookieConsentCategory = 
  | 'necessary' 
  | 'analytics' 
  | 'functional' 
  | 'marketing'
  | 'social' // Nou
```

2. Adaugă în `CookieConsentState`:
```typescript
export interface CookieConsentState {
  necessary: true
  analytics: boolean
  functional: boolean
  marketing: boolean
  social: boolean // Nou
}
```

3. Adaugă traduceri în toate limbile
4. Adaugă în modal cu icon și descriere
5. Adaugă funcție de inițializare în `script-loader.ts`

### Integrare Google Analytics

```typescript
// src/lib/cookies/script-loader.ts

export function initAnalyticsIfConsented(): void {
  if (!isCategoryConsented('analytics')) {
    return
  }

  // Load Google Analytics
  const script = document.createElement('script')
  script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID'
  script.async = true
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  function gtag(...args: any[]) {
    window.dataLayer.push(args)
  }
  gtag('js', new Date())
  gtag('config', 'GA_MEASUREMENT_ID', {
    analytics_storage: 'granted'
  })
}
```

---

## ✅ Checklist Implementare

- [x] Creat structura cookie consent
- [x] Implementat logica de salvare/încărcare
- [x] Creat CookieBanner component
- [x] Creat CookiePreferencesModal component
- [x] Adăugat animații subtile
- [x] Integrat cu theme system
- [x] Adăugat traduceri pentru toate limbile (RO, EN, FR, IT, DE, ES)
- [x] Integrat în layout
- [x] Adăugat link în footer
- [x] Creat script-loader pentru analytics/marketing
- [x] Documentație completă

---

## 🎯 Conformitate GDPR

### Cerințe îndeplinite:

✅ **Consimțământ explicit** - Userul trebuie să facă o alegere  
✅ **Categorii clare** - Necessary, Analytics, Functional, Marketing  
✅ **Control complet** - Userul poate modifica preferințele oricând  
✅ **Transparență** - Link către Politica de cookies  
✅ **Salvare preferințe** - LocalStorage pentru persistență  
✅ **Respectare alegeri** - Scripturile se încarcă doar dacă userul acceptă  

---

**Document generat:** 2025-01-27  
**Status:** ✅ **Complet Implementat**  
**Versiune:** 1.0

