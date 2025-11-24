# Journal de farme.ro - Migration Guide

**Data:** 2025-01-27  
**Scop:** Ghid pentru aplicarea migrației Prisma pentru modelele Journal

---

## 📋 Precondiții

- [ ] Baza de date PostgreSQL este accesibilă
- [ ] Variabila `DATABASE_URL` este setată corect în `.env`
- [ ] Nu există migrație aplicată deja pentru Journal

---

## 🚀 Pași de Migrație

### 1. Verificare Schema

Verifică că schema Prisma conține modelele Journal:

```bash
cd backend
cat prisma/schema.prisma | grep -A 20 "model JournalArticle"
```

Ar trebui să vezi:
- `JournalArticle`
- `JournalRevision`
- `JournalArticleMetrics`
- `JournalNotification`

### 2. Verificare Status Migrații

```bash
cd backend
npx prisma migrate status
```

Verifică dacă există migrații pending.

### 3. Creare Migrație

Dacă modelele Journal nu sunt încă în baza de date:

```bash
cd backend
npx prisma migrate dev --name add_journal_models
```

Această comandă va:
- Crea un fișier de migrație SQL
- Aplica migrația în baza de date
- Genera Prisma Client cu noile modele

### 4. Generare Prisma Client

După migrație, generează Prisma Client:

```bash
npx prisma generate
```

### 5. Verificare

Verifică că migrația a fost aplicată:

```bash
npx prisma migrate status
```

Ar trebui să vezi toate migrațiile ca "Applied".

---

## ⚠️ Troubleshooting

### Eroare: "Migration failed"

**Cauză:** Conflict cu migrații existente sau erori în schema.

**Soluție:**
1. Verifică logs-urile pentru erori specifice
2. Verifică că schema Prisma este validă: `npx prisma validate`
3. Dacă e necesar, resetează migrațiile (doar în development):
   ```bash
   npx prisma migrate reset
   ```

### Eroare: "Database connection failed"

**Cauză:** `DATABASE_URL` nu este setat corect.

**Soluție:**
1. Verifică `.env` sau `.env.local`
2. Verifică că baza de date este accesibilă
3. Testează conexiunea: `npx prisma db pull` (read-only)

---

## ✅ Verificare Post-Migrație

După migrație, verifică că tabelele există:

```bash
# Conectează-te la baza de date
psql $DATABASE_URL

# Verifică tabelele
\dt journal_*

# Ar trebui să vezi:
# - journal_articles
# - journal_revisions
# - journal_article_metrics
# - journal_notifications
```

---

## 📝 Note

- **Nu rula migrația în producție** fără backup
- **Testează migrația** întâi pe un environment de staging
- **Documentează** orice probleme întâmpinate

---

## 🔄 Rollback

Dacă trebuie să anulezi migrația (doar în development):

```bash
npx prisma migrate reset
```

**⚠️ ATENȚIE:** Aceasta va șterge toate datele din baza de date!

Pentru producție, creează o migrație de rollback manuală.

