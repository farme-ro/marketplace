# 📱 Farmero PWA Install Prompt

**Data:** 2025-01-27  
**Scop:** Documentație pentru componenta PWA Install Prompt  
**Status:** ✅ Implementat

---

## 📋 Preambul

Componenta `PwaInstallPrompt` afișează un banner/toast discret care îi invită pe utilizatori să instaleze aplicația PWA pe dispozitivul lor. Banner-ul apare doar când este relevant și nu este invaziv.

---

## 🎯 Cum Funcționează

### Condiții de Afișare

Banner-ul apare **DOAR** dacă sunt îndeplinite toate condițiile:

1. ✅ **Event `beforeinstallprompt` este disponibil** - Browser-ul suportă instalarea PWA
2. ✅ **Utilizatorul nu a respins banner-ul anterior** - `localStorage.farmero_pwa_prompt_dismissed !== 'true'`
3. ✅ **Aplicația nu este deja instalată** - `window.matchMedia('(display-mode: standalone)').matches === false`

### Comportament

1. **La încărcarea paginii:**
   - Componenta ascultă evenimentul `beforeinstallprompt`
   - Dacă evenimentul este disponibil și condițiile sunt îndeplinite, banner-ul devine vizibil

2. **La click pe "Instalează acum":**
   - Apelează `deferredPrompt.prompt()` pentru a afișa prompt-ul nativ al browser-ului
   - Așteaptă răspunsul utilizatorului (`accepted` sau `dismissed`)
   - Ascunde banner-ul și salvează `farmero_pwa_prompt_dismissed = 'true'` în localStorage

3. **La click pe "Nu acum":**
   - Ascunde banner-ul fără a afișa prompt-ul nativ
   - Salvează `farmero_pwa_prompt_dismissed = 'true'` în localStorage

---

## 🎨 Design & Styling

### Poziționare

- **Poziție:** Fixed bottom, centrat orizontal
- **Max width:** `max-w-md` (448px)
- **Z-index:** `z-50` (peste majoritatea elementelor, sub modals)

### Styling

- **Light mode:** Card cu fundal `bg-background`, border `border-border`
- **Dark mode:** Același styling, adaptat automat prin theme system
- **Animație:** Slide-in de jos cu fade-in (respectă `prefers-reduced-motion`)

### Responsive

- **Mobile:** Padding `p-4`, text mai mic
- **Desktop:** Padding `sm:p-5`, text mai mare

---

## 🔧 Implementare

### Componentă

**Fișier:** `src/components/pwa/pwa-install-prompt.tsx`

**Props:** Niciun prop (folosește hook-uri interne)

**Exemplu de utilizare:**

```tsx
import { PwaInstallPrompt } from '@/components/pwa/pwa-install-prompt'

export function Layout() {
  return (
    <div>
      {/* ... alte componente ... */}
      <PwaInstallPrompt />
    </div>
  )
}
```

### Integrare

Componenta este deja integrată în `src/components/layout/site-layout-client.tsx` și apare automat pe toate paginile site-ului.

---

## 🌐 Internaționalizare (i18n)

Componenta folosește hook-ul `useI18n()` pentru traduceri. Cheile de traducere:

- `pwa.installPrompt.title` - Titlul banner-ului
- `pwa.installPrompt.subtitle` - Subtext-ul banner-ului
- `pwa.installPrompt.installButton` - Text buton "Instalează acum"
- `pwa.installPrompt.installing` - Text când se instalează
- `pwa.installPrompt.dismissButton` - Text buton "Nu acum"
- `common.close` - Text pentru butonul de închidere

**Fallback-uri (română):**
- Titlu: "Instalează Farmero pe dispozitivul tău"
- Subtext: "Acces rapid la producătorii tăi preferați, direct de pe ecranul principal."
- Buton instalare: "Instalează acum"
- Buton dismiss: "Nu acum"

---

## ♿ Accesibilitate

- ✅ **ARIA labels:** Toate butoanele au `aria-label` adecvat
- ✅ **ARIA live:** Banner-ul are `role="alert"` și `aria-live="polite"`
- ✅ **Keyboard navigation:** Toate butoanele sunt accesibile cu tastatura
- ✅ **Focus management:** Focus-ul este gestionat corect
- ✅ **Reduced motion:** Animațiile respectă `prefers-reduced-motion`

---

## 🧪 Testare

### Checklist Testare Manuală

- [ ] Banner-ul apare când condițiile sunt îndeplinite
- [ ] Banner-ul NU apare dacă aplicația este deja instalată
- [ ] Banner-ul NU apare după ce utilizatorul l-a respins
- [ ] Click pe "Instalează acum" → Afișează prompt-ul nativ
- [ ] Click pe "Nu acum" → Ascunde banner-ul și nu mai apare
- [ ] Click pe butonul X → Ascunde banner-ul și nu mai apare
- [ ] Styling corect în light mode
- [ ] Styling corect în dark mode
- [ ] Responsive pe mobile (viewport mic)
- [ ] Responsive pe desktop (viewport mare)
- [ ] Animații funcționează corect
- [ ] Animații sunt dezactivate când `prefers-reduced-motion` este activ

### Testare pe Dispozitive Reale

**Recomandat:**
- Testează pe Android (Chrome) - suport complet PWA
- Testează pe iOS (Safari) - suport parțial PWA (Share → Add to Home Screen)
- Testează pe desktop (Chrome/Edge) - suport complet PWA

---

## 🔧 Customizare

### Dezactivare Completă

Pentru a dezactiva complet banner-ul, comentează sau elimină componenta din layout:

```tsx
// src/components/layout/site-layout-client.tsx
// <PwaInstallPrompt /> // Comentat
```

### Modificare Styling

Editează clasele Tailwind în `src/components/pwa/pwa-install-prompt.tsx`:

```tsx
// Exemplu: Schimbă poziția
className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto" // Top în loc de bottom
```

### Modificare Text

Editează cheile de traducere în fișierele de traducere (`src/lib/i18n/translations/*.json`) sau folosește fallback-urile din componentă.

---

## 📊 Analytics (Opțional)

Pentru a urmări rate-ul de instalare, poți adăuga tracking:

```tsx
// În handleInstall, după userChoice
if (outcome === 'accepted') {
  // Track install acceptance
  analytics.track('pwa_install_accepted')
} else {
  // Track install dismissal
  analytics.track('pwa_install_dismissed')
}
```

---

## 🐛 Troubleshooting

### Banner-ul nu apare

**Cauze posibile:**
1. ✅ Aplicația este deja instalată → Normal, banner-ul nu trebuie să apară
2. ✅ Utilizatorul a respins banner-ul anterior → Verifică `localStorage.farmero_pwa_prompt_dismissed`
3. ✅ Browser-ul nu suportă PWA → Verifică dacă `beforeinstallprompt` este disponibil
4. ✅ PWA nu este configurat corect → Verifică `manifest.json` și service worker

### Banner-ul apare prea des

**Soluție:** Verifică că `localStorage.setItem(STORAGE_KEY, 'true')` este apelat corect la dismiss.

### Prompt-ul nativ nu apare

**Cauze posibile:**
1. ✅ `deferredPrompt` este `null` → Verifică că evenimentul `beforeinstallprompt` este capturat
2. ✅ Browser-ul nu suportă instalarea PWA → Verifică suportul browser-ului

---

## 📝 Note Tehnice

- **Storage key:** `farmero_pwa_prompt_dismissed` (localStorage)
- **Event:** `beforeinstallprompt` (browser native)
- **Z-index:** `z-50` (peste majoritatea elementelor)
- **Dependencies:** `useI18n`, `cn` (utils), `lucide-react` (icons)

---

## 🔗 Referințe

- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev: Add to Home Screen](https://web.dev/add-to-home-screen/)
- [Chrome: PWA Install Prompt](https://developer.chrome.com/docs/web-platform/pwa-overview/)

---

**Document generat:** 2025-01-27  
**Status:** ✅ **Implementat și gata pentru testare**

