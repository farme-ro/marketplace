# Frontend Improvements - Implementation Plan

## ✅ Status Implementare

### 1. Componente Reutilizabile
- [x] Header (SiteNavbar) - există
- [x] Footer (SiteFooter) - există
- [ ] Refactor `app/page.tsx` să folosească `(site)/layout.tsx` în loc să duplice header/footer
- [ ] Verificare duplicate în alte layout-uri

### 2. Keyboard Support (Accessibility)
- [ ] Adăugare keyboard handlers pentru toate componentele interactive
- [ ] Focus management pentru modals și sidebars
- [ ] Escape key pentru închidere modals/sidebars
- [ ] Tab navigation optimizată
- [ ] ARIA labels și roles

### 3. PWA
- [ ] Re-activare PWA în `next.config.js`
- [ ] Testare Service Worker
- [ ] Verificare că nu mai cauzează 404

### 4. Language Switcher
- [ ] Extindere i18n pentru: ro, en, fr, it, es, de
- [ ] Creare fișiere de traducere pentru fiecare limbă
- [ ] Actualizare LanguageSwitcher component
- [ ] Dropdown/Select pentru mai multe limbi

### 5. Mobile Navigation Sidebar (Left)
- [ ] Creare component `MobileNavSidebar`
- [ ] Integrare în SiteNavbar
- [ ] Animații slide-in/slide-out
- [ ] Overlay pentru backdrop
- [ ] Keyboard support (Escape pentru închidere)

### 6. Minicart Sidebar (Right)
- [ ] Creare component `MinicartSidebar`
- [ ] Integrare cu cart store (Zustand)
- [ ] Listă produse din coș
- [ ] Buton "Vezi coșul complet" → `/cart`
- [ ] Buton "Checkout" → `/checkout`
- [ ] Animații slide-in/slide-out
- [ ] Keyboard support

### 7. Modal Component
- [ ] Creare component reutilizabil `Modal`
- [ ] Variante: default, fullscreen, centered
- [ ] Props: title, children, onClose, size, variant
- [ ] Focus trap pentru accessibility
- [ ] Backdrop click pentru închidere
- [ ] Escape key pentru închidere
- [ ] Portal pentru rendering (prevent z-index issues)

## 📋 Ordine Implementare

1. **PWA re-activare** (rapid, testare)
2. **i18n extindere** (ro, en, fr, it, es, de)
3. **Language Switcher** (cu dropdown)
4. **Modal component** (bază pentru alte componente)
5. **Mobile Nav Sidebar** (left)
6. **Minicart Sidebar** (right)
7. **Keyboard support** (pentru toate componentele)
8. **Refactor duplicate** (cleanup layout-uri)

## 🎯 Prioritate

**High:**
- PWA re-activare
- Mobile Navigation Sidebar
- Minicart Sidebar
- Modal component

**Medium:**
- i18n extindere
- Language Switcher
- Keyboard support

**Low:**
- Refactor duplicate (optimizare)

