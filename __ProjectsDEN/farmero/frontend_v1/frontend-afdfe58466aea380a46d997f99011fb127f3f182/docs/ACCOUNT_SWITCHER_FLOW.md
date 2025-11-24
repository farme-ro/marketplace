# Account Switcher Flow Documentation

**Data:** 2024  
**Scop:** Documentație pentru flow-ul sistemului multi-account și Account Switcher  
**Status:** Implementat și funcțional

---

## 📋 Preambul

Acest document descrie flow-urile principale ale sistemului multi-account:
- **Login Flow** - Ce se întâmplă când utilizatorul se autentifică
- **Switch Account Flow** - Ce se întâmplă când utilizatorul comută între conturi
- **Logout Flow** - Ce se întâmplă când utilizatorul se deconectează

---

## 🔄 Flow Diagrams (Textual)

### 1. Login Flow

```
┌─────────────────────────────────────────────────────────────┐
│ User Login                                                  │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ AuthProvider detects isAuthenticated = true                 │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ AccountProvider detects isAuthenticated change              │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ AccountProvider calls loadAccounts(user)                    │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ AccountStore.loadAccounts()                                 │
│   - Sets status = 'loading'                                 │
│   - Calls accountsApi.getAccounts()                         │
└────────────────────┬──────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌──────────────────┐   ┌──────────────────────┐
│ Backend supports │   │ Backend doesn't      │
│ multi-account    │   │ support (404/empty)   │
└────────┬─────────┘   └──────────┬───────────┘
         │                       │
         ▼                       ▼
┌──────────────────┐   ┌──────────────────────┐
│ Returns accounts │   │ Returns [] or 404    │
│ from backend     │   │                      │
└────────┬─────────┘   └──────────┬───────────┘
         │                       │
         │                       ▼
         │            ┌──────────────────────┐
         │            │ Generate PersonalAccount│
         │            │ from user profile    │
         │            └──────────┬───────────┘
         │                     │
         └──────────┬──────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│ AccountStore sets:                                          │
│   - accounts: [PersonalAccount, ...BusinessAccounts]        │
│   - activeAccountId: default account ID                     │
│   - status: 'idle'                                          │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ AccountProvider exposes accounts and activeAccount          │
│ to all child components                                      │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ AccountSwitcher renders with active account                 │
│ (only for role === 'client')                                │
└─────────────────────────────────────────────────────────────┘
```

**Pași detaliați:**

1. **User Login:**
   - Utilizatorul se autentifică prin `AuthProvider`
   - `isAuthenticated` devine `true`
   - `user` object este disponibil

2. **AccountProvider Detection:**
   - `AccountProvider` detectează schimbarea în `isAuthenticated`
   - Apelează `loadAccounts(user)` cu datele user-ului

3. **Load Accounts:**
   - `AccountStore.loadAccounts()` setează `status = 'loading'`
   - Apelează `accountsApi.getAccounts()`

4. **Backend Response:**
   - **Dacă backend suportă:** Returnează lista de conturi
   - **Dacă backend nu suportă (404 sau []):** Frontend generează PersonalAccount local

5. **Set Active Account:**
   - Store-ul selectează contul default (prioritate: `isDefault` flag > primul cont)
   - Setează `activeAccountId`

6. **UI Update:**
   - `AccountSwitcher` se actualizează automat (reactivity prin Zustand)
   - Afișează contul activ

---

### 2. Switch Account Flow

```
┌─────────────────────────────────────────────────────────────┐
│ User clicks AccountSwitcher button                          │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ Dropdown opens showing all accounts                         │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ User selects different account                               │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ AccountSwitcher calls switchAccount(accountId)              │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ AccountProvider.switchAccount() calls                       │
│ AccountStore.setActiveAccount(accountId)                    │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ AccountStore validates account exists                        │
│   - Checks if accountId is in accounts array                │
│   - If not found: logs warning, returns early               │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ AccountStore updates activeAccountId                        │
│   - Sets activeAccountId = accountId                        │
│   - Persists to localStorage                                │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ AccountProvider exposes new activeAccount                   │
│ (reactivity through Zustand)                                │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ AccountSwitcher UI updates automatically                    │
│   - Shows new active account name                          │
│   - Updates icon (User/Building2)                          │
│   - Dropdown closes                                         │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ All components using useAccount() hook                       │
│ automatically receive new activeAccount                     │
│ (e.g., checkout page can use activeAccountId)               │
└─────────────────────────────────────────────────────────────┘
```

**Pași detaliați:**

1. **User Interaction:**
   - Utilizatorul click pe `AccountSwitcher` button
   - Dropdown se deschide cu lista de conturi

2. **Account Selection:**
   - Utilizatorul selectează un alt cont
   - `handleSwitchAccount(accountId)` este apelat

3. **Store Update:**
   - `AccountStore.setActiveAccount(accountId)` validează că contul există
   - Actualizează `activeAccountId`
   - Persistă în localStorage

4. **UI Reactivity:**
   - Toate componentele care folosesc `useAccount()` se actualizează automat
   - `AccountSwitcher` afișează noul cont activ
   - Dropdown se închide

5. **Side Effects:**
   - Checkout-ul poate folosi `activeAccountId` pentru comenzi
   - Business Portal poate filtra datele după contul activ

---

### 3. Logout Flow

```
┌─────────────────────────────────────────────────────────────┐
│ User clicks Logout                                           │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ AuthProvider.handleLogout()                                  │
│   - Clears session cookie                                   │
│   - Sets isAuthenticated = false                             │
│   - Sets user = null                                         │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ AccountProvider detects isAuthenticated = false              │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ AccountProvider calls:                                       │
│   - useAccountStore.getState().reset()                      │
│   - useFavoritesStore.getState().reset()                     │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ AccountStore.reset()                                         │
│   - Sets accounts: []                                        │
│   - Sets activeAccountId: null                              │
│   - Sets status: 'idle'                                     │
│   - Sets error: null                                        │
│   - Clears localStorage (account-storage)                  │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ AccountSwitcher detects no activeAccount                    │
│   - Returns null (doesn't render)                           │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ User is redirected to login page                             │
└─────────────────────────────────────────────────────────────┘
```

**Pași detaliați:**

1. **User Logout:**
   - Utilizatorul click pe butonul de logout
   - `AuthProvider.handleLogout()` este apelat

2. **Auth State Clear:**
   - Session cookie este șters
   - `isAuthenticated = false`
   - `user = null`

3. **AccountProvider Detection:**
   - `AccountProvider` detectează `isAuthenticated = false`
   - Apelează `reset()` pe toate store-urile relevante

4. **Store Reset:**
   - `AccountStore.reset()` golește toate datele
   - Șterge din localStorage
   - Resetează status și error

5. **UI Update:**
   - `AccountSwitcher` nu se mai afișează (returnează `null`)
   - Utilizatorul este redirectat la login

---

## 🔍 Edge Cases & Error Handling

### Backend Error During Load

```
┌─────────────────────────────────────────────────────────────┐
│ loadAccounts() called                                       │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ accountsApi.getAccounts() throws error (not 404)            │
│   - 401 Unauthorized                                        │
│   - 500 Internal Server Error                               │
│   - Network error                                           │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ AccountStore catch block                                    │
│   - If user is available:                                   │
│     → Generate PersonalAccount fallback                    │
│   - If user is not available:                              │
│     → Set status = 'error'                                 │
│     → Set error message                                    │
└─────────────────────────────────────────────────────────────┘
```

**Rezultat:** Aplicația funcționează cu fallback PersonalAccount, utilizatorul nu observă problema.

---

### Switch to Non-Existent Account

```
┌─────────────────────────────────────────────────────────────┐
│ User tries to switch to accountId that doesn't exist        │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ AccountStore.setActiveAccount(accountId)                    │
│   - Searches for account in accounts array                  │
│   - Account not found                                       │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ console.warn('[Account Store] Account not found')          │
│ Returns early (no state update)                             │
└─────────────────────────────────────────────────────────────┘
```

**Rezultat:** Nu se întâmplă nimic, contul activ rămâne neschimbat. Utilizatorul nu observă problema (account-ul nu apare în listă de ori).

---

### Delete Personal Account Attempt

```
┌─────────────────────────────────────────────────────────────┐
│ User tries to delete PersonalAccount                        │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ AccountStore.removeAccount(accountId)                       │
│   - Finds account in array                                  │
│   - Checks if account.type === 'personal'                  │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ console.warn('[Account Store] Cannot remove personal account')│
│ Returns early (no state update)                             │
└─────────────────────────────────────────────────────────────┘
```

**Rezultat:** PersonalAccount nu poate fi șters. Backend-ul ar trebui să returneze `400 Bad Request` dacă se încearcă ștergerea prin API.

---

## 🔄 State Management Flow

### Zustand Store Reactivity

```
┌─────────────────────────────────────────────────────────────┐
│ Component uses useAccount() hook                            │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ Hook subscribes to AccountStore state                       │
│   - accounts                                                 │
│   - activeAccountId                                          │
│   - status                                                  │
│   - error                                                   │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ When store state changes:                                    │
│   - All subscribed components re-render                    │
│   - useAccount() returns new values                         │
│   - AccountSwitcher updates UI                              │
└─────────────────────────────────────────────────────────────┘
```

**Beneficii:**
- Reactivity automată - nu este nevoie de manual updates
- Performance optimizat - doar componentele care folosesc hook-ul se re-render
- Type-safe - TypeScript asigură tipurile corecte

---

## 📱 UI Integration Points

### Desktop Navbar
- **Locație:** `src/components/layout/site-layout-client.tsx`
- **Condiție:** `user && role === 'client'`
- **Poziție:** În navbar, lângă ThemeToggle și LanguageSwitcher

### Mobile Sidebar
- **Locație:** `src/components/layout/mobile-nav-sidebar.tsx`
- **Condiție:** `role === 'client'`
- **Poziție:** În secțiunea de user, după numele utilizatorului

### Checkout Integration
- **Locație:** `src/app/(site)/checkout/page.tsx`
- **Folosire:** `activeAccountId` este pregătit pentru trimitere în payload (comentat până când backend suportă)

---

## 🔒 Security Considerations

1. **Account Ownership:**
   - Backend-ul trebuie să verifice că utilizatorul autentificat deține contul
   - `403 Forbidden` dacă utilizatorul încearcă să acceseze contul altui utilizator

2. **PersonalAccount Protection:**
   - Backend-ul trebuie să prevină ștergerea PersonalAccount
   - `400 Bad Request` dacă se încearcă DELETE pe PersonalAccount

3. **Default Account:**
   - Cel puțin un cont trebuie să fie întotdeauna default
   - Backend-ul trebuie să gestioneze automat setarea default-ului

---

## ✅ Testing Scenarios

### Happy Path
1. Login → Accounts loaded → PersonalAccount set as active
2. Create business account → Account added to list
3. Switch to business account → Active account changes
4. Switch back to personal → Active account changes
5. Logout → All accounts cleared

### Error Scenarios
1. Backend returns 404 → Fallback to PersonalAccount
2. Backend returns 500 → Fallback to PersonalAccount
3. Network error → Fallback to PersonalAccount
4. Try to delete PersonalAccount → Blocked (no action)
5. Try to switch to non-existent account → Blocked (no action)

---

**Ultima actualizare:** 2024  
**Versiune:** 1.0

