# Farmero AI Assistant - Overview

## Scop

AI Assistant este un asistent simplu, rule-based pentru MVP, care oferă:
- **FAQ**: Răspunsuri la întrebări frecvente despre platformă
- **Checkout Helper**: Ajutor în procesul de checkout
- **Producer Portal Tips**: Sfaturi pentru producători (Jurnal, promovare)

## Arhitectură

### Backend (`backend/src/modules/ai/`)

- **Model Prisma**: `AiInteraction` - stochează toate interacțiunile
- **Service**: `ai.service.ts` - logica de business (rule-based pentru MVP)
- **Routes**: `/ai/assistant` (public), `/admin/ai/interactions` (admin)
- **Validators**: Zod schemas pentru validare input

### Frontend (`frontend/src/components/ai/`)

- **API Client**: `frontend/src/lib/api/ai-assistant.ts` - funcții API cu fallback-uri
- **Components**:
  - `AiLauncherButton` - buton floating (bottom right)
  - `AiChatWidget` - widget chat slide-over

### Admin (`admin/src/app/(admin)/support/ai-interactions/`)

- **Monitor Page**: Pagină pentru vizualizarea interacțiunilor AI
- **API Client**: `admin/src/lib/api/ai-assistant.ts`

## Integrare în UI

### Site Layout

- **Component**: `AiLauncherButton` adăugat în `site-layout-client.tsx`
- **Vizibilitate**: Apare pe toate paginile client (homepage, produse, producători, etc.)
- **Feature Flag**: Respectă `aiAssistant: false` (dezactivat implicit)

### Chat Widget

- **Slide-over**: Deschide din dreapta pe desktop, full-screen pe mobile
- **Context-aware**: Detectează automat rolul utilizatorului (client/producer/admin)
- **Page-aware**: Trimite pagina curentă în context pentru răspunsuri relevante

## Response Generation (MVP)

Pentru MVP, răspunsurile sunt generate folosind keyword matching:

- **FAQ/Help**: Întrebări despre "cum", "ce", "how", "what"
- **Delivery**: Întrebări despre "livrare", "delivery", "transport"
- **Payment**: Întrebări despre "plată", "payment", "plătesc"
- **Producer-specific**: Întrebări despre "jurnal", "promovare", "plan" (pentru producători)
- **Default**: Răspuns generic cu link-uri către FAQ, How it works, Contact

## Production Integration

Pentru integrare cu un serviciu LLM:

1. Înlocuiește `generateAiResponse()` din `ai.service.ts` cu un apel către API-ul LLM
2. Adaugă variabile de mediu pentru API keys
3. Implementează rate limiting și error handling
4. Adaugă caching pentru întrebări comune
5. Consideră fine-tuning pe datele specifice platformei

## Feature Flags

- **Frontend**: `aiAssistant: false` în `frontend/src/lib/backend-sync/status.ts`
- **Admin**: Apare în `/system/config` ca feature flag
- **Status**: Dezactivat implicit pentru testare incrementală

## Database Model

### AiInteraction
- Stochează toate interacțiunile pentru monitorizare și îmbunătățire
- Include context, întrebare, răspuns, și link-uri sugerate
- Poate fi filtrat după rol, userId, și căutat după conținut

## Notă

- Endpoint-ul public nu necesită autentificare (pentru utilizatori anonimi)
- Toate interacțiunile sunt loggate pentru monitorizare
- Endpoint-ul admin este read-only (pentru vizualizare interacțiuni)
- Răspunsurile sunt locale-aware (RO, EN, etc.)

## Documentație

- **Backend API**: `backend/docs/AI_ASSISTANT_API_SPEC.md`
- **Admin Monitor**: `admin/src/app/(admin)/support/ai-interactions/page.tsx`
- **Backend Gaps**: `admin/docs/ADMIN_BACKEND_GAPS.md` (secțiunea 22)

## Next Steps

1. Activați feature flag-ul `aiAssistant: true` când backend-ul este gata
2. Testați interacțiunile în diferite contexte (homepage, checkout, portal)
3. Analizați interacțiunile în admin pentru a identifica pattern-uri
4. Îmbunătățiți răspunsurile rule-based sau integrați un LLM

