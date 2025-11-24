# Farmero Growth Engine - Overview

## Scop

Growth Engine este un sistem unificat de growth & engagement care oferă:
- **Onboarding**: Ghidare pentru utilizatori noi
- **Nudges**: Mesaje contextuale bazate pe comportament
- **Win-back**: Reactivare utilizatori inactivi
- **Recomandări simple**: Sugestii bazate pe subscriptions, Jurnal, campanii

## Arhitectură

### Backend (`backend/src/modules/growth/`)

- **Models Prisma**: `GrowthEvent`, `GrowthCampaign`, `GrowthNudgeRule`
- **Service**: `growth.service.ts` - logica de business
- **Routes**: `/growth/events` (public), `/admin/growth/*` (admin)
- **Validators**: Zod schemas pentru validare input

### Frontend (`frontend/src/lib/growth/`)

- **API Client**: `frontend/src/lib/api/growth.ts` - funcții API cu fallback-uri
- **Growth Client**: `frontend/src/lib/growth/growth-client.ts` - tracking helpers
- **Growth Hooks**: `frontend/src/lib/growth/growth-hooks.ts` - React hooks pentru nudges
- **Components**: `frontend/src/components/growth/growth-nudge-banner.tsx` - componentă UI

### Admin (`admin/src/app/(admin)/marketing/growth/`)

- **Dashboard**: Pagină cu KPI, timeline sample, nudges/rules
- **API Client**: `admin/src/lib/api/growth.ts`

## Integrare în UI

### Homepage

- **Component**: `GrowthNudgeBanner` afișat după Hero Section
- **Context**: `page="homepage"`
- **Nudges**: Sugestii pentru abonamente, continuare coș abandonat

### Checkout

- **Component**: `GrowthNudgeBanner` afișat după CheckoutHeader
- **Context**: `page="checkout"`
- **Tracking**: `trackCheckoutStarted()` când pagina se încarcă
- **Nudges**: Sugestii pentru finalizare comandă, abonamente

### Portal Producători

- **Component**: `VisibilitySuggestionsSection` în dashboard
- **Context**: `page="portal"`, `role="PRODUCER"`
- **Nudges**: Sugestii pentru activare Jurnal, planuri de promovare

## Feature Flags

- **Frontend**: `growthEngine: false` în `frontend/src/lib/backend-sync/status.ts`
- **Admin**: Apare în `/system/config` ca feature flag
- **Status**: Dezactivat implicit pentru testare incrementală

## Event Types

- `page_view`: Vizualizare pagină
- `cart_abandoned`: Coș abandonat
- `subscription_started`: Abonament început
- `subscription_cancelled`: Abonament anulat
- `journal_viewed`: Jurnal vizualizat
- `journal_article_viewed`: Articol vizualizat
- `producer_profile_viewed`: Profil producător vizualizat
- `product_viewed`: Produs vizualizat
- `order_placed`: Comandă plasată
- `order_completed`: Comandă finalizată
- `checkout_started`: Checkout început
- `checkout_completed`: Checkout finalizat

## Nudge Rules

Nudge rules sunt evaluate pe baza:
- **Segment**: Condiții pentru segmentul utilizatorului (ex: `role=client AND no_subscription`)
- **Trigger**: Condiții pentru context/pagină (ex: `page=checkout AND cart_items>0`)
- **Priority**: Prioritate pentru ordonare (mai mare = mai important)

## Fallback Behavior

- Dacă backend-ul este dezactivat, frontend-ul folosește fallback-uri locale
- Nudges fallback sunt definite în `getFallbackNudges()` din `frontend/src/lib/api/growth.ts`
- Tracking events sunt ignorate silențios dacă backend-ul nu răspunde (nu sparg UX)

## Documentație

- **Backend API**: `backend/docs/GROWTH_ENGINE_API_SPEC.md`
- **Admin Dashboard**: `admin/docs/ADMIN_GROWTH_DASHBOARD_README.md` (de creat)
- **Backend Gaps**: `admin/docs/ADMIN_BACKEND_GAPS.md` (secțiunea 18)

## Next Steps

1. Activați feature flag-ul `growthEngine: true` când backend-ul este gata
2. Adăugați mai multe nudge rules în backend
3. Extindeți evaluarea segmentelor cu un rule engine mai sofisticat
4. Adăugați endpoint pentru analytics (events cu filtre)

