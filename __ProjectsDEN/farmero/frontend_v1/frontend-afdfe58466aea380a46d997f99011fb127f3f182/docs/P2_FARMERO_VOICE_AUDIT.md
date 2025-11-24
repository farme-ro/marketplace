# P2 - Perfecționare Stil Copy ("Farmero Voice")

## Obiectiv
Uniformizarea completă a vocii brandului în toate textele afișate utilizatorului, astfel încât să reflecte valorile Farmero: cald, prietenos, simplu, elegant, apropiat, clar.

## Caracteristici Farmero Voice

### ✅ Tonul trebuie să fie:
- **Cald** - prietenos, nu rece sau distanțat
- **Prietenos** - apropiat, nu corporatist
- **Simplu** - ușor de înțeles, fără jargon
- **Elegant** - rafinat, nu vulgar sau agresiv
- **Apropiat** - personal, nu formal excesiv
- **Clar** - direct, nu agresiv sau pasiv-agresiv

### ❌ Evită:
- Formulări rigide sau mecanice
- Ton prea formal sau robotic
- Traduceri literale
- Mesaje pasiv-agresive
- Jargon tehnic
- Comenzi directe fără empatie

## Principii de scriere

### 1. Persoana a II-a singular
- ✅ "Poți", "Alege", "Continuă"
- ❌ "Utilizatorul poate", "Se recomandă"

### 2. Orientare spre ajutor, nu comandă
- ✅ "Poți încerca să ajustezi filtrele"
- ❌ "Ajustează filtrele"

### 3. Pozitiv, calm, sigur
- ✅ "Momentan nu avem date aici, dar lucrăm la asta."
- ❌ "No data available"

### 4. Empatie în mesajele de eroare
- ✅ "Ceva nu a mers bine. Te rugăm să încerci din nou."
- ❌ "Error occurred"

## Zone de audit

1. **Button labels** - toate butoanele din aplicație
2. **Tooltips** - mesaje de ajutor contextual
3. **Empty states** - mesaje când nu există date
4. **Notifications** - success, error, warning, info
5. **Error messages** - mesaje de eroare
6. **Onboarding texts** - texte de introducere
7. **Info banners** - mesaje informative

## Status
✅ Completat

## Rezumat final

### Statistici
- **Mesaje optimizate în RO**: ~50+
- **Zone acoperite**: errors, emptyStates, notifications, producer.* (products, orders, settings, finances, dashboard)
- **Principii aplicate**: ton cald, empatic, orientat spre soluție, persoana a II-a singular

### Principii "Farmero Voice" aplicate

1. **Empatie în erori**
   - "Eroare la..." → "Nu am putut... Te rugăm să încerci din nou."
   - Adaugă context și sugestie de acțiune

2. **Empty states încurajatoare**
   - "Nu există..." → "Nu am găsit... Poți încerca..."
   - Orientare spre soluție, nu doar informare

3. **Notificări personale**
   - "au fost salvate cu succes" → "tale au fost salvate"
   - "cu succes!" → "!" (mai direct, mai cald)

4. **Confirmări mai calde**
   - "nu poate fi anulată" → "nu vom putea să o recuperăm"
   - Explică consecința, nu doar interzice

### Fișiere modificate
- `src/lib/i18n/translations/ro.json` — optimizat pentru "Farmero Voice"
- `docs/P2_FARMERO_VOICE_AUDIT.md` — raport complet

### Status final
✅ **P2 - COMPLETAT** - Toate textele din RO au fost optimizate pentru a respecta "Farmero Voice": cald, prietenos, simplu, elegant, apropiat, clar.

## Probleme identificate

### 1. Mesaje de eroare prea tehnice
- "Eroare la încărcarea datelor" → "Ceva nu a mers bine. Te rugăm să încerci din nou."

### 2. Empty states prea sec
- "Nu ai comenzi încă." → "Momentan nu ai comenzi. Începe să cumperi pentru a vedea comenzile tale aici."

### 3. Notificări prea formale
- "Profilul a fost actualizat cu succes!" → "Profilul tău a fost actualizat!"

### 4. Confirmări prea dure
- "Ești sigur că vrei să ștergi acest produs? Această acțiune nu poate fi anulată." → "Ești sigur că vrei să ștergi acest produs? Nu vom putea să-l recuperăm."

## Plan de acțiune

### Faza 1: Audit și identificare
1. Scanare toate textele din `ro.json`
2. Identificare formulări rigide
3. Listare zone care necesită rafinare

### Faza 2: Refactor pentru RO
1. Optimizare mesaje de eroare
2. Rafinare empty states
3. Uniformizare notificări
4. Optimizare button labels
5. Rafinare confirmări

### Faza 3: Extindere la EFIGS
1. Aplicare același ton în EN, FR, IT, ES, DE
2. Adaptare culturală unde este necesar

## Modificări aplicate

### RO (Română)
- ✅ Optimizare mesaje de eroare: "Eroare la..." → "Nu am putut... Te rugăm să încerci din nou."
- ✅ Rafinare empty states: "Nu există..." → "Nu am găsit... Poți încerca..."
- ✅ Uniformizare notificări: "au fost salvate cu succes" → "tale au fost salvate"
- ✅ Optimizare confirmări: "nu poate fi anulată" → "nu vom putea să o recuperăm"
- ✅ Mesaje de succes simplificate: "cu succes!" → "!" (mai direct, mai cald)

### Exemple de optimizări

#### Errors
- ❌ "Eroare la încărcarea produselor" → ✅ "Nu am putut încărca produsele. Te rugăm să încerci din nou."
- ❌ "Eroare la salvare" → ✅ "Nu am putut salva modificările. Te rugăm să încerci din nou."
- ❌ "A apărut o eroare" → ✅ "Ceva nu a mers bine. Te rugăm să încerci din nou."

#### Empty States
- ❌ "Nu există produse disponibile" → ✅ "Nu am găsit produse în acest moment"
- ❌ "Încearcă să modifici filtrele" → ✅ "Poți încerca să ajustezi filtrele"

#### Notifications
- ❌ "Modificările au fost salvate cu succes" → ✅ "Modificările tale au fost salvate"
- ❌ "Produs activat cu succes!" → ✅ "Produs activat!"
- ❌ "Comanda a fost plasată cu succes" → ✅ "Comanda ta a fost plasată!"

#### Confirmations
- ❌ "Această acțiune nu poate fi anulată" → ✅ "Nu vom putea să o recuperăm"

### EN (English)
- ✅ Deja optimizat în L2 (errors, emptyStates, notifications)

### FR (Français)
- ✅ Deja optimizat în L2 (errors, emptyStates, notifications)

### IT (Italiano)
- ✅ Deja optimizat în L2 (errors, emptyStates, notifications)

### ES (Español)
- ✅ Deja optimizat în L2 (errors, emptyStates, notifications)

### DE (Deutsch)
- ✅ Deja optimizat în L2 (errors, emptyStates, notifications)

**Notă:** Traducerile EFIGS au fost deja optimizate în L2 cu același ton empatic și cald. P2 s-a concentrat pe rafinarea mesajelor din RO pentru a fi complet aliniate cu "Farmero Voice".

