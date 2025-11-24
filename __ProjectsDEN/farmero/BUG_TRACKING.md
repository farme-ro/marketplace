# 🐛 Bug Tracking - farme.ro

**Data:** 2025-01-27  
**Status:** 📋 **Sistem de tracking bug-uri**

---

## 📋 Cum să raportezi un bug

1. Folosește template-ul din `BUG_REPORT_TEMPLATE.md`
2. Adaugă bug-ul în acest fișier
3. Actualizează status-ul când bug-ul este fixat

---

## 🐛 Bugs Identificate

### Bug #1: Producer Subscriptions - Campaign Count

**Status:** ✅ **FIXAT**

**Endpoint:** `GET /producers/subscriptions`  
**Severitate:** 🟢 Low  
**Descriere:** Campaign count era hardcodat la 0  
**Expected:** Campaign count ar trebui să fie numărul de promoții active  
**Actual:** Era 0 întotdeauna  
**Fix:** Adăugat `promotions` în include și folosit `producer.promotions?.length || 0`  
**Data fix:** 2025-01-27

---

## ✅ Bugs Fixate

1. ✅ **Producer Subscriptions - Campaign Count** (2025-01-27)

---

## ⏳ Bugs în Progres

*Niciun bug în progres momentan*

---

## 📝 Template pentru Bug Nou

```markdown
### Bug #[N]: [Titlu]

**Status:** [🆕 New / 🔄 In Progress / ✅ Fixed / ❌ Won't Fix]

**Endpoint/Component:** [Locația bug-ului]  
**Severitate:** [🔴 Critical / 🟡 Medium / 🟢 Low]  
**Descriere:** [Ce se întâmplă]  
**Expected:** [Ce ar trebui să se întâmple]  
**Actual:** [Ce se întâmplă de fapt]  
**Steps to reproduce:** 
1. [Pasul 1]
2. [Pasul 2]

**Fix:** [Soluție aplicată sau plan]  
**Data raportat:** [Data]  
**Data fixat:** [Data]
```

---

**Status:** 📋 **Sistem de tracking activ**

**Notă:** Adaugă bug-uri noi folosind template-ul de mai sus.

