# Ghid de Migrare Rute - Instrucțiuni Manuale

**Data:** 2025-01-27  
**Status:** 🚧 Mutarea folderelor necesită acțiune manuală

---

## ⚠️ Notă Importantă

Mutarea automată a folderelor a eșuat din cauza accesului la fișiere (probabil deschise în IDE). **Trebuie să mutați manual folderele** când IDE-ul este închis sau folosind un file manager extern.

---

## 📁 Foldere de Mutat

Mută următoarele foldere din `frontend/src/app/(site)/`:

### Comenzi PowerShell (când IDE-ul este închis):

```powershell
cd F:\__ProjectsDEN\farmero\frontend\src\app\(site)

# Products
Move-Item -Path "products" -Destination "produse" -Force

# Producers
Move-Item -Path "producers" -Destination "producatori" -Force

# Portals
Move-Item -Path "producer-portal" -Destination "portal-producatori" -Force
Move-Item -Path "business-portal" -Destination "portal-business" -Force
Move-Item -Path "logistics-portal" -Destination "portal-logistica" -Force
Move-Item -Path "investor-portal" -Destination "portal-investitori" -Force
Move-Item -Path "importer-portal" -Destination "portal-importatori" -Force

# Public Pages
Move-Item -Path "about" -Destination "despre-noi" -Force
Move-Item -Path "fees" -Destination "comisioane-taxe" -Force
Move-Item -Path "faq" -Destination "intrebari-frecvente" -Force
```

### Sau folosind File Explorer:

1. Deschide `frontend/src/app/(site)/` în File Explorer
2. Redenumește manual fiecare folder:
   - `products` → `produse`
   - `producers` → `producatori`
   - `producer-portal` → `portal-producatori`
   - `business-portal` → `portal-business`
   - `logistics-portal` → `portal-logistica`
   - `investor-portal` → `portal-investitori`
   - `importer-portal` → `portal-importatori`
   - `about` → `despre-noi`
   - `fees` → `comisioane-taxe`
   - `faq` → `intrebari-frecvente`

---

## ✅ Ce este deja făcut

- ✅ Fișier `routes.ts` creat cu toate rutele type-safe
- ✅ Redirect-uri adăugate în `next.config.js`
- ✅ Sitemap actualizat cu noile rute
- ✅ Robots.txt actualizat cu noile rute

---

## 🔄 După mutarea folderelor

După ce mutați folderele, trebuie să:

1. **Actualizați import-urile relative** în fișierele mutate
2. **Actualizați toate link-urile hardcodate** cu `routes.*` din `src/lib/routes.ts`
3. **Rulați `npm run build`** pentru a verifica că totul funcționează
4. **Testați redirect-urile** accesând vechile URL-uri

---

## 📝 Verificare

După mutare, verificați că:

- [ ] Toate folderele au fost mutate
- [ ] Build-ul funcționează (`npm run build`)
- [ ] Redirect-urile funcționează (accesați `/products` → ar trebui să redirecteze la `/produse`)
- [ ] Noile rute funcționează (accesați `/produse` → ar trebui să funcționeze)

---

**Ultima actualizare:** 2025-01-27


