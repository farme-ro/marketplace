# Fix Repository Structure pentru Admin

## Problema

Repository-ul GitHub `farme-ro/admin` conține structura completă de foldere (`_ProjectsDEN/farmero/admin`) în loc să conțină direct conținutul folderului `admin` la root.

## Soluție

Repository-ul trebuie să aibă structura corectă, cu toate fișierele din `admin/` la root-ul repository-ului.

### Opțiunea 1: Recreare Repository (Recomandat)

1. **Creează un branch nou local:**
   ```bash
   cd admin
   git checkout -b fix-structure
   ```

2. **Verifică că ești în folderul admin:**
   ```bash
   pwd  # Ar trebui să fie: .../farmero/admin
   ```

3. **Copiază toate fișierele la root (dacă nu sunt deja):**
   - Toate fișierele din `admin/` trebuie să fie la root-ul repository-ului
   - Nu trebuie să existe folderul `_ProjectsDEN/farmero/admin` în repository

4. **Commit și push:**
   ```bash
   git add .
   git commit -m "fix: move admin contents to repository root"
   git push origin fix-structure
   ```

5. **Pe GitHub:**
   - Creează un Pull Request din `fix-structure` către `master`
   - Sau, dacă ești sigur, merge direct în `master`

### Opțiunea 2: Fix Manual pe GitHub

1. **Clonează repository-ul admin într-un folder temporar:**
   ```bash
   cd /tmp
   git clone git@github.com:farme-ro/admin.git admin-fix
   cd admin-fix
   ```

2. **Mută conținutul din `_ProjectsDEN/farmero/admin` la root:**
   ```bash
   # Dacă există structura greșită
   mv _ProjectsDEN/farmero/admin/* .
   mv _ProjectsDEN/farmero/admin/.* . 2>/dev/null || true
   rm -rf _ProjectsDEN
   ```

3. **Commit și push:**
   ```bash
   git add .
   git commit -m "fix: move admin contents to repository root"
   git push origin master
   ```

### Opțiunea 3: Folosind Git Subtree (Dacă admin este într-un monorepo)

Dacă `admin` este parte dintr-un monorepo și vrei să-l separi:

```bash
# Din root-ul monorepo-ului
git subtree push --prefix=admin origin admin-master
```

## Verificare

După fix, repository-ul ar trebui să aibă structura:

```
admin/ (repository root)
├── src/
├── package.json
├── next.config.mjs
├── vercel.json
├── README.md
└── ... (toate fișierele din admin/)
```

**NU** ar trebui să existe:
- `_ProjectsDEN/`
- `farmero/`
- Orice alt folder wrapper

## Configurare Vercel

După ce structura este corectată:

1. **În Vercel Dashboard:**
   - **Root Directory:** `.` (sau lăsat gol)
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

2. **Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://api.farme.ro
   NEXT_PUBLIC_FRONTEND_URL=https://farme.ro
   NEXT_PUBLIC_ADMIN_URL=https://admin.farme.ro
   NEXT_PUBLIC_APP_ENV=production
   ```

## Notă

Fișierul `vercel.json` a fost creat în folderul `admin/` pentru a asigura configurația corectă de deploy.

