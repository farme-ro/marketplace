# Audit Pagini 404 - Farme.ro Frontend

## Pagini care returnează 404

### 1. Producer Portal - Pagini lipsă

#### `/producer-portal/shipping-guide`
- **Locație link**: `src/components/layout/site-footer.tsx:147`
- **Status**: TODO comentat în cod
- **Descriere**: Ghid livrări & logistică pentru producători
- **Prioritate**: Medie

#### `/producer-portal/finances`
- **Locație link**: `src/app/(site)/producer-portal/settings/page.tsx:75`
- **Status**: Link activ în pagina de setări
- **Descriere**: Pagină pentru facturi și finanțe producător
- **Prioritate**: Medie

#### `/producer-portal/support`
- **Locație link**: `src/app/(site)/producer-portal/settings/page.tsx:93`
- **Status**: Link activ în pagina de setări
- **Descriere**: Pagină de suport pentru producători
- **Prioritate**: Medie

#### `/producer-portal/orders/[id]`
- **Locație link**: 
  - `src/components/producer-portal/recent-orders-table.tsx:139`
  - `src/app/(site)/producer-portal/dashboard/_components/recent-orders-section.tsx:122, 166`
- **Status**: Link activ în multiple locații
- **Descriere**: Pagină de detalii pentru o comandă specifică
- **Prioritate**: Înaltă (folosită frecvent)

### 2. Pagini publice - Lipsă

#### `/b2b`
- **Locație link**: `src/components/layout/site-footer.tsx:179`
- **Status**: TODO comentat în cod
- **Descriere**: Pagină pentru HoReCa & business
- **Prioritate**: Scăzută

#### `/diaspora`
- **Locație link**: `src/components/layout/site-footer.tsx:196`
- **Status**: TODO comentat în cod (viitor feature)
- **Descriere**: Pagină pentru diaspora
- **Prioritate**: Scăzută

#### `/anpc`
- **Locație link**: `src/components/layout/site-footer.tsx:236`
- **Status**: TODO comentat în cod
- **Descriere**: ANPC / Soluționare litigii
- **Prioritate**: Medie (legal requirement)

#### `/forgot-password`
- **Locație link**: `src/app/(site)/login-client/page.tsx:296`
- **Status**: Link activ în pagina de login
- **Descriere**: Pagină pentru resetare parolă
- **Prioritate**: Înaltă (funcționalitate esențială)

#### `/producer-subscription`
- **Locație link**: `src/components/producer-profile/producer-subscription-cta.tsx:52`
- **Status**: Link activ în componentă
- **Descriere**: Pagină pentru abonamente producători
- **Prioritate**: Medie

#### `/producers/[slug]/products`
- **Locație link**: `src/components/producer-profile/producer-hero.tsx:142`
- **Status**: Link activ în componentă
- **Descriere**: Pagină pentru produsele unui producător specific
- **Notă**: Există `/producers/[slug]` dar nu `/producers/[slug]/products`
- **Prioritate**: Medie

#### `/orders`
- **Locație link**: `src/app/(site)/thank-you/ThankYouPageClient.tsx:187`
- **Status**: Link activ în pagina de thank-you
- **Descriere**: Pagină pentru comenzile clientului
- **Prioritate**: Înaltă (funcționalitate esențială pentru clienți)

### 3. Rute duplicate/confuze

#### `/how-it-works` vs `/cum-functioneaza` vs `/cum-functioneaza-si-impact`
- **Status**: Există 3 pagini similare:
  - `/how-it-works` - există (`src/app/(site)/how-it-works/page.tsx`)
  - `/cum-functioneaza` - există (`src/app/(site)/cum-functioneaza/page.tsx`)
  - `/cum-functioneaza-si-impact` - există (`src/app/(site)/cum-functioneaza-si-impact/page.tsx`)
- **Problema**: Linkuri către toate trei în diferite locații
- **Recomandare**: Standardizare pe o singură rută sau redirect-uri

## Rezumat

### Total pagini 404: **11 pagini**

#### Prioritate Înaltă (3 pagini):
1. `/producer-portal/orders/[id]` - Detalii comandă producător
2. `/forgot-password` - Resetare parolă
3. `/orders` - Comenzi client

#### Prioritate Medie (6 pagini):
4. `/producer-portal/shipping-guide` - Ghid livrări
5. `/producer-portal/finances` - Finanțe producător
6. `/producer-portal/support` - Suport producător
7. `/anpc` - Soluționare litigii (legal)
8. `/producer-subscription` - Abonamente producători
9. `/producers/[slug]/products` - Produse producător

#### Prioritate Scăzută (2 pagini):
10. `/b2b` - HoReCa & business
11. `/diaspora` - Pentru diaspora (viitor feature)

## Acțiuni recomandate

1. **Creează paginile cu prioritate înaltă** - sunt esențiale pentru funcționalitatea aplicației
2. **Implementează paginile cu prioritate medie** - îmbunătățesc UX-ul
3. **Evaluează necesitatea paginilor cu prioritate scăzută** - pot fi amânate sau eliminate
4. **Standardizează rutele duplicate** - alege o singură rută pentru "how it works" și folosește redirect-uri

## Note

- Toate linkurile identificate sunt active în cod (nu sunt comentate)
- Unele pagini au TODO comments indicând că sunt planificate
- Paginile cu prioritate înaltă ar trebui create urgent pentru a evita erorile 404 pentru utilizatori

