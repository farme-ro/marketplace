## 🔴 Hardcoded Texts Requiring i18n

**Total Found:** 284 instances

### Top Files with Hardcoded Texts

| File | Instances |
|------|-----------|
| `lib\design-system\microcopy.ts` | 22 |
| `lib\seo\metadata.ts` | 15 |
| `lib\api\cart.ts` | 12 |
| `components\layout\site-layout-client.tsx` | 8 |
| `app\(site)\portal-producatori\comenzi\[id]\page.tsx` | 7 |
| `components\layout\producer-mega-menu.tsx` | 7 |
| `app\(site)\portal-producatori\dashboard\_components\dashboard-shortcuts.tsx` | 6 |
| `app\(site)\portal-producatori\ghid-producatori\page.tsx` | 6 |
| `app\(site)\checkout\page.tsx` | 5 |
| `app\(site)\pentru-logistica\register\page.tsx` | 5 |
| `app\(site)\portal-producatori\dashboard\_components\quick-actions-section.tsx` | 5 |
| `app\layout.tsx` | 5 |
| `app\(site)\produse\[slug]\page.tsx` | 4 |
| `app\(site)\register-client\page.tsx` | 4 |
| `components\layout\dynamic-mega-menu.tsx` | 4 |
| `components\producer-portal\producer-products-overview.tsx` | 4 |
| `app\(site)\checkout\layout.tsx` | 3 |
| `app\(site)\intrebari-frecvente\FAQPageClient.tsx` | 3 |
| `app\(site)\pentru-importatori\register\page.tsx` | 3 |
| `app\(site)\portal-producatori\insights\page.tsx` | 3 |

### Detailed Findings

#### lib\design-system\microcopy.ts

- **Line 11:** `submit: 'Trimite',...`
  - Matches: 'Trimite'
- **Line 12:** `save: 'Salvează modificările',...`
  - Matches: 'Salvează 
- **Line 14:** `delete: 'Șterge',...`
  - Matches: 'Șterge'
- **Line 15:** `edit: 'Editează',...`
  - Matches: 'Editează'
- **Line 16:** `add: 'Adaugă',...`
  - Matches: 'Adaugă'

*... and 17 more instances*

#### lib\seo\metadata.ts

- **Line 8:** `import type { Metadata } from 'next'...`
  - Matches: 'next'
- **Line 84:** `description: 'Descoperă produse agricole tradiționale și bio direct de la produc...`
  - Matches: 'Descoperă 
- **Line 85:** `keywords: ['produse agricole', 'produse tradiționale', 'produse bio', 'producăto...`
  - Matches: 'produse , 'produse , 'produse 
- **Line 89:** `description: 'Discover traditional and organic farm products directly from local...`
  - Matches: 'Discover 
- **Line 123:** `title: 'Produse tradiționale și bio - farme.ro',...`
  - Matches: 'Produse 

*... and 10 more instances*

#### lib\api\cart.ts

- **Line 63:** `if (!isBackendSyncEnabled('cart')) {...`
  - Matches: 'cart'
- **Line 82:** `if (response && typeof response === 'object' && 'cart' in response) {...`
  - Matches: 'cart'
- **Line 111:** `if (!isBackendSyncEnabled('cart')) {...`
  - Matches: 'cart'
- **Line 124:** `if (response && typeof response === 'object' && 'cart' in response) {...`
  - Matches: 'cart'
- **Line 153:** `if (!isBackendSyncEnabled('cart')) {...`
  - Matches: 'cart'

*... and 7 more instances*

#### components\layout\site-layout-client.tsx

- **Line 69:** `menuType: 'logistics' | 'importers' | 'investors' | 'businesses' | 'producers'...`
  - Matches: 'producers'
- **Line 115:** `menuType: 'producers' as const,...`
  - Matches: 'producers'
- **Line 161:** `menuType: 'producers' as const,...`
  - Matches: 'producers'
- **Line 198:** `menuType: 'producers' as const,...`
  - Matches: 'producers'
- **Line 204:** `menuType: 'producers' as const,...`
  - Matches: 'producers'

*... and 3 more instances*

#### app\(site)\portal-producatori\comenzi\[id]\page.tsx

- **Line 124:** `confirmed: 'Comandă confirmată cu succes!',...`
  - Matches: 'Comandă 
- **Line 125:** `preparing: 'Comandă marcată ca în pregătire!',...`
  - Matches: 'Comandă 
- **Line 126:** `shipped: 'Comandă marcată ca trimisă!',...`
  - Matches: 'Comandă 
- **Line 127:** `delivered: 'Comandă marcată ca livrată!',...`
  - Matches: 'Comandă 
- **Line 128:** `canceled: 'Comandă anulată!',...`
  - Matches: 'Comandă 

*... and 2 more instances*

#### components\layout\producer-mega-menu.tsx

- **Line 73:** `description: 'Adaugă și editează',...`
  - Matches: 'Adaugă 
- **Line 102:** `description: 'Detalii comisioane',...`
  - Matches: 'Detalii 
- **Line 113:** `title: 'Autentificare producători',...`
  - Matches: 'Autentificare 
- **Line 154:** `title: 'Produse favorite',...`
  - Matches: 'Produse 
- **Line 165:** `title: 'Producători locali',...`
  - Matches: 'Producători 

*... and 2 more instances*

#### app\(site)\portal-producatori\dashboard\_components\dashboard-shortcuts.tsx

- **Line 25:** `description: 'Actualizează prețuri, stocuri și disponibilitatea produselor tale....`
  - Matches: 'Actualizează 
- **Line 30:** `'Actualizează prețuri și stocuri',...`
  - Matches: 'Actualizează 
- **Line 31:** `'Adaugă produse noi',...`
  - Matches: 'Adaugă 
- **Line 35:** `title: 'Vezi comenzi',...`
  - Matches: 'Vezi 
- **Line 46:** `title: 'Vezi comisioane & plăți',...`
  - Matches: 'Vezi 

*... and 1 more instances*

#### app\(site)\portal-producatori\ghid-producatori\page.tsx

- **Line 18:** `title: 'Înregistrare',...`
  - Matches: 'Înregistrare'
- **Line 19:** `description: 'Creează contul tău de producător',...`
  - Matches: 'Creează 
- **Line 29:** `title: 'Adaugă Produse',...`
  - Matches: 'Adaugă 
- **Line 30:** `description: 'Încarcă produsele tale',...`
  - Matches: 'Încarcă 
- **Line 31:** `details: 'Adaugă produsele tale cu fotografii de calitate, descrieri detaliate, ...`
  - Matches: 'Adaugă 

*... and 1 more instances*

#### app\(site)\checkout\page.tsx

- **Line 151:** `console.error('Checkout error:', err)...`
  - Matches: 'Checkout 
- **Line 151:** `console.error('Checkout error:', err)...`
  - Matches: 'Checkout 
- **Line 360:** `<h4 className="font-semibold text-foreground">Plată online cu cardul</h4>...`
  - Matches: >Plată 
- **Line 361:** `<p className="text-sm text-muted-foreground">Plată securizată prin Stripe</p>...`
  - Matches: >Plată 
- **Line 393:** `<h4 className="font-semibold text-foreground">Plată ramburs</h4>...`
  - Matches: >Plată 

#### app\(site)\pentru-logistica\register\page.tsx

- **Line 36:** `const [serviceType, setServiceType] = useState<'DELIVERY' | 'WAREHOUSE' | 'PACKA...`
  - Matches: 'DELIVERY', 'DELIVERY'
- **Line 246:** `{isSuccess ? 'Înregistrare reușită!' : 'Creează cont partener logistică'}...`
  - Matches: 'Înregistrare , 'Creează 
- **Line 280:** `{step === 1 ? 'Cont' : 'Servicii'}...`
  - Matches: 'Cont'
- **Line 514:** `<option value="DELIVERY">Livrări</option>...`
  - Matches: "DELIVERY"
- **Line 519:** `<p className="text-xs text-muted-foreground">Selectează tipul principal de servi...`
  - Matches: >Selectează 

