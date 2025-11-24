# Admin i18n Implementation - Minimal (RO + EN)

**Data:** 2025-01-27  
**Status:** ✅ Complete

---

## 📋 Prezentare generală

Infrastructură i18n minimală pentru admin (RO + EN). URL-urile rămân stabile (nu sunt localizate). Focus pe textele UI importante: pagini principale, navigație, butoane, mesaje.

---

## ✅ Implementat

### 1. Infrastructură i18n

**Fișiere create:**
- ✅ `admin/src/lib/i18n/context.tsx` - Context și hook `useAdminI18n()`
- ✅ `admin/src/lib/i18n/translations/ro.json` - Traduceri românești
- ✅ `admin/src/lib/i18n/translations/en.json` - Traduceri englezești

**Provider integrat:**
- ✅ `AdminI18nProvider` adăugat în `admin/src/app/(admin)/layout.tsx`

**Hook:**
- ✅ `useAdminI18n()` - Returnează `{ locale, setLocale, t }`
- ✅ Locale salvat în `localStorage` (`admin-locale`)
- ✅ Fallback automat la RO dacă key-ul lipsește în EN

---

### 2. Componente actualizate

**Componente principale:**
- ✅ `AdminSidebar` - Navigație tradusă
- ✅ `AccessDenied` - Mesaje traduse
- ✅ `DashboardPage` - KPIs și texte traduse

**Keys adăugate:**
- ✅ `common.*` - Butoane, acțiuni comune
- ✅ `nav.*` - Toate link-urile din sidebar
- ✅ `dashboard.*` - Titluri, KPIs, note
- ✅ `producers.*` - Coloane, status, filtre, acțiuni, confirmări, erori
- ✅ `users.*` - Coloane, roluri, filtre, acțiuni
- ✅ `orders.*` - Filtre, status
- ✅ `accessDenied.*` - Titlu, mesaj, permisiune
- ✅ `confirmDialog.*` - Titlu, mesaj, butoane
- ✅ `emptyState.*` - Mesaje empty state

---

### 3. Structură traduceri

**RO (`ro.json`):**
```json
{
  "common": { "save", "cancel", "delete", ... },
  "nav": { "dashboard", "journal", "producers", ... },
  "dashboard": { "title", "subtitle", "kpis", ... },
  "producers": { "title", "columns", "status", ... },
  "users": { "title", "columns", "roles", ... },
  "orders": { "title", "filters", "status", ... },
  "accessDenied": { "title", "message", ... },
  "confirmDialog": { "defaultTitle", ... },
  "emptyState": { "noData", ... }
}
```

**EN (`en.json`):**
- Structură identică cu RO
- Traduceri profesionale, clare

---

### 4. Utilizare în componente

**Exemplu:**
```tsx
'use client'
import { useAdminI18n } from '@/lib/i18n/context'

export default function MyPage() {
  const { t } = useAdminI18n()
  
  return (
    <div>
      <h1>{t('dashboard.title', 'Dashboard')}</h1>
      <p>{t('dashboard.subtitle', 'Vizualizare generală platformă')}</p>
    </div>
  )
}
```

**Fallback:**
- Dacă key-ul lipsește în EN, se folosește RO
- Dacă key-ul lipsește complet, se folosește fallback string (al doilea parametru)

---

## 📊 Fișiere modificate

### Infrastructură
- ✅ `admin/src/lib/i18n/context.tsx` - Context și hook
- ✅ `admin/src/lib/i18n/translations/ro.json` - Traduceri RO
- ✅ `admin/src/lib/i18n/translations/en.json` - Traduceri EN

### Layout & Providers
- ✅ `admin/src/app/(admin)/layout.tsx` - Adăugat `AdminI18nProvider`

### Componente
- ✅ `admin/src/components/layout/AdminSidebar.tsx` - Navigație tradusă
- ✅ `admin/src/components/auth/AccessDenied.tsx` - Mesaje traduse
- ✅ `admin/src/app/(admin)/dashboard/page.tsx` - Dashboard tradus

---

## 🎯 Rezultat Final

- ✅ **Infrastructură i18n minimală:** RO + EN, hook `useAdminI18n()`
- ✅ **Navigație tradusă:** Toate link-urile din sidebar
- ✅ **Componente critice traduse:** Dashboard, AccessDenied, AdminSidebar
- ✅ **Keys organizate:** `common`, `nav`, `dashboard`, `producers`, `users`, `orders`, etc.
- ✅ **URL-uri stabile:** Nu sunt localizate (rămân în engleză/română conform designului)

---

## ⚠️ Note & Limitări

### Ce este tradus

**✅ Tradus:**
- Navigație (sidebar)
- Dashboard (KPIs, titluri)
- AccessDenied (mesaje)
- Keys comune (butoane, acțiuni)

**⚠️ Parțial tradus:**
- Producers, Users, Orders - doar structuri de bază (coloane, filtre, status)
- Alte pagini - necesită actualizare incrementală

### Ce NU este tradus (încă)

- Pagini complexe (Orders detail, Producers detail, etc.)
- Mesaje de eroare specifice
- Confirmări specifice (în afara structurii de bază)
- Empty states specifice

---

## 🔗 Referințe

- `admin/src/lib/i18n/context.tsx` - Context și hook
- `admin/src/lib/i18n/translations/ro.json` - Traduceri RO
- `admin/src/lib/i18n/translations/en.json` - Traduceri EN
- `admin/src/app/(admin)/layout.tsx` - Provider integrat

---

## 📝 Next Steps (opțional)

1. **Actualizare incrementală pagini:**
   - Producers page - traducere completă
   - Users page - traducere completă
   - Orders page - traducere completă
   - System pages - traducere completă

2. **Componente comune:**
   - ConfirmDialog - traducere completă
   - EmptyState - traducere completă
   - DataTable - headers traduse

3. **Mesaje specifice:**
   - Erori API - traducere
   - Confirmări specifice - traducere
   - Notificări - traducere

---

**Status:** ✅ Complete - Infrastructură minimală funcțională!

