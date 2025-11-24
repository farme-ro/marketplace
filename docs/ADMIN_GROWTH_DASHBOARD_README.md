# Admin Growth Dashboard - README

## Overview

Pagina `/marketing/growth` oferă un dashboard pentru Growth Engine, incluzând:
- **KPI Cards**: Evenimente (7 zile), campanii active, rata activare abonamente, nudges disponibile
- **Timeline Sample**: Vizualizare evenimente pentru un utilizator specific
- **Nudges / Rules**: Listă nudges eligibile și reguli configurate

## Acces

- **Permisiune necesară**: `view_marketing` sau oricare dintre `['view_marketing', 'view_journal', 'view_subscriptions']`
- **RBAC**: Verificat automat, afișează `AccessDenied` dacă nu ai permisiunea

## Funcționalități

### KPI Cards

1. **Evenimente (7 zile)**
   - Număr total evenimente în ultimele 7 zile
   - ⚠️ **Notă**: Acest KPI necesită un endpoint nou sau calcul din date existente

2. **Campanii active**
   - Număr campanii active (din `/admin/growth/campaigns/overview`)
   - ✅ **Implementat**

3. **Rata activare abonamente**
   - Procent clienți care au activat abonamente
   - ⚠️ **Notă**: Acest KPI necesită calcul din date subscriptions

4. **Nudges disponibile**
   - Număr nudges eligibile pentru context default
   - ✅ **Implementat**

### Timeline Sample

- **Input**: User ID (UUID)
- **Funcționalitate**: Afișează ultimele 20 evenimente pentru utilizator
- **Endpoint**: `GET /admin/growth/timeline?userId={userId}&limit=20&offset=0`
- ✅ **Implementat**

### Nudges / Rules

- **Funcționalitate**: Afișează nudges eligibile pentru context default
- **Endpoint**: `GET /admin/growth/nudges?role=client&page=homepage`
- ✅ **Implementat**
- **Fallback**: Dacă backend-ul nu expune endpoint-ul, afișează mesaj informativ

## API Endpoints

### ✅ Implementate

- `POST /growth/events` - Record event (public)
- `GET /admin/growth/timeline?userId={userId}` - User timeline
- `GET /admin/growth/campaigns/overview` - Campaign overview
- `GET /admin/growth/nudges?{context}` - Eligible nudges

### ❌ Opționale (pentru viitor)

- `GET /admin/growth/events` - List events cu filtre (pentru analytics)
- `GET /admin/growth/nudge-rules` - List toate nudge rules
- `POST /admin/growth/nudge-rules` - Create nudge rule
- `PATCH /admin/growth/nudge-rules/:id` - Update nudge rule

## Feature Flag

- **Flag**: `growthEngine`
- **Status**: `off` (dezactivat implicit)
- **Location**: `frontend/src/lib/backend-sync/status.ts`
- **Admin Config**: Apare în `/system/config` ca feature flag

## Notă

Dacă backend-ul nu este activ sau endpoint-urile lipsesc, dashboard-ul afișează:
- KPI-uri cu valoare `0` sau `N/A`
- Mesaje informative pentru secțiuni care necesită endpoint-uri
- Fallback-uri pentru a nu sparge UX

## Documentație Backend

Vezi `backend/docs/GROWTH_ENGINE_API_SPEC.md` pentru detalii complete despre API.

