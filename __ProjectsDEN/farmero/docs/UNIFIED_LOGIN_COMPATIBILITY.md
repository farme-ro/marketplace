# Unified Login Compatibility - Multi-Account System

**Data:** 2025-01-27  
**Scop:** Documentație despre compatibilitatea sistemului multi-account cu viitorul sistem Unified Login  
**Status:** Compatibil, fără modificări necesare

---

## 📋 Preambul

Sistemul multi-account (PersonalAccount/BusinessAccount) este implementat în frontend și este compatibil cu viitorul sistem Unified Login. Acest document descrie compatibilitatea și ce trebuie să fie asigurat pentru integrare fără probleme.

---

## ✅ Compatibilitate Actuală

### 1. Sistemul Multi-Account

**Fișiere cheie:**
- `src/lib/store/account.ts` - Account store (Zustand)
- `src/components/providers/AccountProvider.tsx` - Account context provider
- `src/lib/api/accounts.ts` - API layer pentru accounts

**Dependențe:**
- Folosește `useAuth()` din `src/lib/auth/context.tsx`
- Așteaptă `user` object cu: `{ id, fullName, name, email }`
- Nu depinde de structura internă de autentificare

### 2. Integrare cu AuthProvider

**Fișier:** `src/components/providers/AccountProvider.tsx`

```typescript
export function AccountProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth()  // ← Folosește useAuth()
  // ...
  
  useEffect(() => {
    if (isAuthenticated && user) {
      loadAccounts({
        id: user.id,
        fullName: user.fullName,
        name: user.name,
        email: user.email,
      })
    }
  }, [isAuthenticated, user, loadAccounts])
}
```

**Observație:** AccountProvider depinde doar de:
- `isAuthenticated: boolean` - Status de autentificare
- `user: { id, fullName?, name?, email }` - Datele user-ului

**Compatibilitate:** ✅ Sistemul multi-account va funcționa cu Unified Login dacă:
1. `useAuth()` continuă să returneze `isAuthenticated` și `user` cu aceleași proprietăți
2. `user.id`, `user.email` sunt disponibile
3. `user.fullName` sau `user.name` sunt disponibile (opțional)

---

## 🔄 Ce Trebuie Asigurat pentru Unified Login

### 1. Contract de Interfață

**Unified Login trebuie să respecte:**

```typescript
interface AuthContextType {
  // State
  isAuthenticated: boolean
  user: {
    id: string
    email: string
    fullName?: string
    name?: string
    // ... alte proprietăți
  } | null
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  // ... alte acțiuni
}
```

**Notă:** Dacă Unified Login folosește o interfață diferită, trebuie să fie compatibilă sau să fie adăugat un adapter.

### 2. Flow de Login

**Flow actual:**
1. User se autentifică prin `AuthProvider`
2. `isAuthenticated` devine `true`
3. `user` object este disponibil
4. `AccountProvider` detectează schimbarea
5. `AccountProvider` apelează `loadAccounts(user)`

**Flow cu Unified Login (așteptat):**
1. User se autentifică prin Unified Login
2. `isAuthenticated` devine `true` (sau echivalent)
3. `user` object este disponibil (sau echivalent)
4. `AccountProvider` detectează schimbarea
5. `AccountProvider` apelează `loadAccounts(user)`

**Compatibilitate:** ✅ Flow-ul este identic, doar sursa de autentificare se schimbă.

### 3. Cookie-based Authentication

**Actual:**
- Toate request-urile către `/accounts` folosesc `credentials: 'include'`
- Backend-ul verifică cookie-ul de sesiune

**Unified Login (așteptat):**
- Unified Login trebuie să seteze cookie-ul de sesiune
- Request-urile către `/accounts` trebuie să funcționeze cu același cookie

**Compatibilitate:** ✅ Dacă Unified Login folosește cookie-based auth, funcționează automat.

---

## 🔧 Modificări Necesare (Dacă E Cazul)

### Cazul 1: Unified Login Folosește Token-based Auth

**Dacă Unified Login folosește JWT tokens în header:**

```typescript
// Adaugă în src/lib/api/accounts.ts
// Dacă este necesar, adaugă header pentru token
const token = getAuthToken() // Funcție helper din Unified Login
headers: {
  'Authorization': `Bearer ${token}`,
  // ...
}
```

**Notă:** Acest caz nu este necesar dacă Unified Login folosește cookie-based auth.

### Cazul 2: Unified Login Folosește OAuth/SSO

**Dacă Unified Login folosește OAuth/SSO:**

- AccountProvider va continua să funcționeze
- `loadAccounts()` va continua să funcționeze
- Doar sursa de autentificare se schimbă

**Compatibilitate:** ✅ Nu sunt necesare modificări.

### Cazul 3: Unified Login Schimbă Structura User Object

**Dacă Unified Login returnează o structură diferită:**

```typescript
// Adaugă adapter în AccountProvider
const adaptedUser = unifiedLoginUser ? {
  id: unifiedLoginUser.userId || unifiedLoginUser.id,
  email: unifiedLoginUser.emailAddress || unifiedLoginUser.email,
  fullName: unifiedLoginUser.displayName || unifiedLoginUser.fullName,
  name: unifiedLoginUser.name,
} : null
```

**Notă:** Acest caz nu este necesar dacă Unified Login respectă contractul actual.

---

## 📝 Checklist pentru Unified Login

Când Unified Login este implementat, verificați:

- [ ] `useAuth()` (sau echivalent) returnează `isAuthenticated: boolean`
- [ ] `useAuth()` (sau echivalent) returnează `user` cu `id` și `email`
- [ ] Cookie-based authentication funcționează (sau token-based cu header)
- [ ] `AccountProvider` poate accesa `user` după login
- [ ] `loadAccounts(user)` funcționează cu user-ul din Unified Login
- [ ] Logout-ul resetează corect accounts (verificat în `AccountProvider`)

---

## ✅ Concluzie

**Status:** ✅ **Compatibil fără modificări necesare**

Sistemul multi-account este implementat astfel încât să fie compatibil cu viitorul Unified Login:

1. ✅ **Abstracție corectă:** Folosește `useAuth()` care poate fi înlocuit cu Unified Login
2. ✅ **Contract clar:** Depinde doar de `isAuthenticated` și `user` object
3. ✅ **Fără dependențe hardcoded:** Nu depinde de structura internă de auth
4. ✅ **Fallback safe:** Funcționează chiar dacă backend-ul nu suportă multi-account

**Recomandare:** Când Unified Login este implementat, verificați că respectă contractul de interfață descris mai sus. Dacă nu, adăugați un adapter minimal.

---

**Ultima actualizare:** 2025-01-27  
**Versiune:** 1.0

