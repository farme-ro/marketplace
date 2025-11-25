/**
 * SEO Metadata Helper
 * 
 * Centralized metadata generation for all pages
 * Supports localization for RO, EN, FR, IT, ES, DE
 */

import type { Metadata } from 'next'

export type Locale = 'ro' | 'en' | 'fr' | 'it' | 'es' | 'de' | 'uk' | 'hu'

interface PageMetadata {
  title: string
  description: string
  keywords?: string[]
  ogTitle?: string
  ogDescription?: string
  twitterTitle?: string
  twitterDescription?: string
}

const baseUrl = 'https://farme.ro'

// Helper to truncate strings for SEO
function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 3) + '...'
}

/**
 * Generate metadata for a page
 */
export function generatePageMetadata(
  pageMeta: PageMetadata | undefined,
  path: string,
  locale: Locale = 'ro'
): Metadata {
  // Fallback to default metadata if pageMeta is undefined
  if (!pageMeta) {
    pageMeta = {
      title: 'farme.ro',
      description: 'Marketplace pentru producători locali',
    }
  }
  
  const title = truncate(pageMeta.title, 60)
  const description = truncate(pageMeta.description, 160)
  const ogTitle = truncate(pageMeta.ogTitle || pageMeta.title, 60)
  const ogDescription = truncate(pageMeta.ogDescription || pageMeta.description, 160)
  const twitterTitle = truncate(pageMeta.twitterTitle || pageMeta.title, 60)
  const twitterDescription = truncate(pageMeta.twitterDescription || pageMeta.description, 160)

  return {
    title,
    description,
    keywords: pageMeta.keywords,
    openGraph: {
      type: 'website',
      locale: locale === 'ro' ? 'ro_RO' : locale === 'uk' ? 'uk_UA' : locale === 'hu' ? 'hu_HU' : `${locale}_${locale.toUpperCase()}`,
      url: `${baseUrl}${path}`,
      siteName: 'farme.ro',
      title: ogTitle,
      description: ogDescription,
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: ogTitle,
        },
      ],
      alternateLocale: ['ro_RO', 'en_US', 'fr_FR', 'it_IT', 'de_DE', 'es_ES', 'uk_UA', 'hu_HU'],
    },
    twitter: {
      card: 'summary_large_image',
      title: twitterTitle,
      description: twitterDescription,
      images: [`${baseUrl}/og-image.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}${path}`,
      languages: {
        'ro': `${baseUrl}${path}`,
        'en': `${baseUrl}${path}`,
        'fr': `${baseUrl}${path}`,
        'it': `${baseUrl}${path}`,
        'de': `${baseUrl}${path}`,
        'es': `${baseUrl}${path}`,
        'uk': `${baseUrl}${path}`,
        'hu': `${baseUrl}${path}`,
      },
    },
    // Note: URLs remain in Romanian (brand signature) for all languages
    // Content is translated, but paths stay the same
  }
}

/**
 * Homepage metadata per locale
 */
export function getHomepageMetadata(locale: Locale = 'ro'): PageMetadata {
  const metadata: Record<Locale, PageMetadata> = {
    ro: {
      title: 'farme.ro - Produse agricole tradiționale de la producători locali',
      description: 'Descoperă produse agricole tradiționale și bio direct de la producători locali din România. Livrare directă, prețuri corecte, fără intermediari.',
      keywords: ['produse agricole', 'produse tradiționale', 'produse bio', 'producători locali', 'România', 'marketplace', 'alimente naturale'],
    },
    en: {
      title: 'farme.ro - Traditional farm products from local producers',
      description: 'Discover traditional and organic farm products directly from local producers in Romania. Direct delivery, fair prices, no intermediaries.',
      keywords: ['farm products', 'traditional products', 'organic products', 'local producers', 'Romania', 'marketplace', 'natural food'],
    },
    fr: {
      title: 'farme.ro - Produits agricoles traditionnels de producteurs locaux',
      description: 'Découvrez des produits agricoles traditionnels et bio directement auprès de producteurs locaux en Roumanie. Livraison directe, prix équitables.',
      keywords: ['produits agricoles', 'produits traditionnels', 'produits bio', 'producteurs locaux', 'Roumanie', 'marché'],
    },
    it: {
      title: 'farme.ro - Prodotti agricoli tradizionali da produttori locali',
      description: 'Scopri prodotti agricoli tradizionali e biologici direttamente da produttori locali in Romania. Consegna diretta, prezzi equi.',
      keywords: ['prodotti agricoli', 'prodotti tradizionali', 'prodotti bio', 'produttori locali', 'Romania', 'mercato'],
    },
    es: {
      title: 'farme.ro - Productos agrícolas tradicionales de productores locales',
      description: 'Descubre productos agrícolas tradicionales y ecológicos directamente de productores locales en Rumanía. Entrega directa, precios justos.',
      keywords: ['productos agrícolas', 'productos tradicionales', 'productos ecológicos', 'productores locales', 'Rumanía', 'mercado'],
    },
    de: {
      title: 'farme.ro - Traditionelle landwirtschaftliche Produkte von lokalen Erzeugern',
      description: 'Entdecken Sie traditionelle und biologische landwirtschaftliche Produkte direkt von lokalen Erzeugern in Rumänien. Direktlieferung, faire Preise.',
      keywords: ['landwirtschaftliche Produkte', 'traditionelle Produkte', 'Bio-Produkte', 'lokale Erzeuger', 'Rumänien', 'Marktplatz'],
    },
    uk: {
      title: 'farme.ro - Традиційні сільськогосподарські продукти від місцевих виробників',
      description: 'Відкрийте для себе традиційні та органічні сільськогосподарські продукти безпосередньо від місцевих виробників у Румунії. Пряма доставка, справедливі ціни.',
      keywords: ['сільськогосподарські продукти', 'традиційні продукти', 'органічні продукти', 'місцеві виробники', 'Румунія', 'ринок'],
    },
    hu: {
      title: 'farme.ro - Hagyományos mezőgazdasági termékek helyi termelőktől',
      description: 'Fedezzen fel hagyományos és biológiai mezőgazdasági termékeket közvetlenül romániai helyi termelőktől. Közvetlen szállítás, tisztességes árak.',
      keywords: ['mezőgazdasági termékek', 'hagyományos termékek', 'biológiai termékek', 'helyi termelők', 'Románia', 'piac'],
    },
  }

  return metadata[locale]
}

/**
 * Products page metadata per locale
 */
export function getProductsMetadata(locale: Locale = 'ro'): PageMetadata {
  const metadata: Record<Locale, PageMetadata> = {
    ro: {
      title: 'Produse tradiționale și bio - farme.ro',
      description: 'Explorează sute de produse tradiționale și bio de la producători locali. Filtrează după categorie, regiune sau preț. Livrare directă de la fermă.',
      keywords: ['produse tradiționale', 'produse bio', 'alimente naturale', 'producători locali', 'România', 'cumpărături online'],
    },
    en: {
      title: 'Traditional and organic products - farme.ro',
      description: 'Explore hundreds of traditional and organic products from local producers. Filter by category, region or price. Direct delivery from farm.',
      keywords: ['traditional products', 'organic products', 'natural food', 'local producers', 'Romania', 'online shopping'],
    },
    fr: {
      title: 'Produits traditionnels et bio - farme.ro',
      description: 'Explorez des centaines de produits traditionnels et bio de producteurs locaux. Filtrez par catégorie, région ou prix. Livraison directe.',
      keywords: ['produits traditionnels', 'produits bio', 'aliments naturels', 'producteurs locaux', 'Roumanie'],
    },
    it: {
      title: 'Prodotti tradizionali e biologici - farme.ro',
      description: 'Esplora centinaia di prodotti tradizionali e biologici da produttori locali. Filtra per categoria, regione o prezzo. Consegna diretta.',
      keywords: ['prodotti tradizionali', 'prodotti biologici', 'alimenti naturali', 'produttori locali', 'Romania'],
    },
    es: {
      title: 'Productos tradicionales y ecológicos - farme.ro',
      description: 'Explora cientos de productos tradicionales y ecológicos de productores locales. Filtra por categoría, región o precio. Entrega directa.',
      keywords: ['productos tradicionales', 'productos ecológicos', 'alimentos naturales', 'productores locales', 'Rumanía'],
    },
    de: {
      title: 'Traditionelle und biologische Produkte - farme.ro',
      description: 'Entdecken Sie Hunderte von traditionellen und biologischen Produkten von lokalen Erzeugern. Filtern Sie nach Kategorie, Region oder Preis.',
      keywords: ['traditionelle Produkte', 'Bio-Produkte', 'natürliche Lebensmittel', 'lokale Erzeuger', 'Rumänien'],
    },
    uk: {
      title: 'Традиційні та органічні продукти - farme.ro',
      description: 'Досліджуйте сотні традиційних та органічних продуктів від місцевих виробників. Фільтруйте за категорією, регіоном або ціною. Пряма доставка з ферми.',
      keywords: ['традиційні продукти', 'органічні продукти', 'натуральні продукти', 'місцеві виробники', 'Румунія', 'онлайн покупки'],
    },
    hu: {
      title: 'Hagyományos és bio termékek - farme.ro',
      description: 'Fedezzen fel száz hagyományos és bio terméket helyi termelőktől. Szűrjön kategória, régió vagy ár szerint. Közvetlen szállítás a farmról.',
      keywords: ['hagyományos termékek', 'bio termékek', 'természetes élelmiszerek', 'helyi termelők', 'Románia', 'online vásárlás'],
    },
  }

  return metadata[locale] || metadata.ro
}

/**
 * Producers page metadata per locale
 */
export function getProducersMetadata(locale: Locale = 'ro'): PageMetadata {
  const metadata: Record<Locale, PageMetadata> = {
    ro: {
      title: 'Producători locali din România - farme.ro',
      description: 'Descoperă producători locali și tradiționali din toată România. Comandă direct de la sursă, la preț de producător, fără intermediari.',
      keywords: ['producători locali', 'producători România', 'produse tradiționale', 'produse bio', 'marketplace producători'],
    },
    en: {
      title: 'Local producers from Romania - farme.ro',
      description: 'Discover local and traditional producers from all over Romania. Order directly from source, at producer prices, no intermediaries.',
      keywords: ['local producers', 'Romania producers', 'traditional products', 'organic products', 'producer marketplace'],
    },
    fr: {
      title: 'Producteurs locaux de Roumanie - farme.ro',
      description: 'Découvrez des producteurs locaux et traditionnels de toute la Roumanie. Commandez directement à la source, aux prix du producteur.',
      keywords: ['producteurs locaux', 'producteurs Roumanie', 'produits traditionnels', 'produits bio'],
    },
    it: {
      title: 'Produttori locali dalla Romania - farme.ro',
      description: 'Scopri produttori locali e tradizionali da tutta la Romania. Ordina direttamente dalla fonte, ai prezzi del produttore.',
      keywords: ['produttori locali', 'produttori Romania', 'prodotti tradizionali', 'prodotti biologici'],
    },
    es: {
      title: 'Productores locales de Rumanía - farme.ro',
      description: 'Descubre productores locales y tradicionales de toda Rumanía. Pide directamente de la fuente, a precios de productor.',
      keywords: ['productores locales', 'productores Rumanía', 'productos tradicionales', 'productos ecológicos'],
    },
    de: {
      title: 'Lokale Erzeuger aus Rumänien - farme.ro',
      description: 'Entdecken Sie lokale und traditionelle Erzeuger aus ganz Rumänien. Bestellen Sie direkt von der Quelle, zu Erzeugerpreisen.',
      keywords: ['lokale Erzeuger', 'Rumänien Erzeuger', 'traditionelle Produkte', 'Bio-Produkte'],
    },
    uk: {
      title: 'Місцеві виробники з Румунії - farme.ro',
      description: 'Відкрийте місцевих та традиційних виробників з усієї Румунії. Замовляйте безпосередньо від джерела, за цінами виробника, без посередників.',
      keywords: ['місцеві виробники', 'виробники Румунії', 'традиційні продукти', 'органічні продукти', 'маркетплейс виробників'],
    },
    hu: {
      title: 'Helyi termelők Romániából - farme.ro',
      description: 'Fedezzen fel helyi és hagyományos termelőket Romániából. Rendeljen közvetlenül a forrástól, termelői áron, közvetítők nélkül.',
      keywords: ['helyi termelők', 'Románia termelők', 'hagyományos termékek', 'bio termékek', 'termelői piac'],
    },
  }

  return metadata[locale] || metadata.ro
}

/**
 * About page metadata per locale
 */
export function getAboutMetadata(locale: Locale = 'ro'): PageMetadata {
  const metadata: Record<Locale, PageMetadata> = {
    ro: {
      title: 'Despre farme.ro - Misiune și valori',
      description: 'Află mai multe despre farme.ro - marketplace-ul care conectează producătorii locali cu clienții. Misiunea, valorile și procesele noastre.',
      keywords: ['despre farme.ro', 'misiune', 'valori', 'producători locali', 'produse tradiționale', 'România'],
    },
    en: {
      title: 'About farme.ro - Mission and values',
      description: 'Learn more about farme.ro - the marketplace connecting local producers with customers. Our mission, values and processes.',
      keywords: ['about farme.ro', 'mission', 'values', 'local producers', 'traditional products', 'Romania'],
    },
    fr: {
      title: 'À propos de farme.ro - Mission et valeurs',
      description: 'En savoir plus sur farme.ro - la place de marché qui connecte les producteurs locaux avec les clients. Notre mission, valeurs et processus.',
      keywords: ['à propos farme.ro', 'mission', 'valeurs', 'producteurs locaux', 'produits traditionnels'],
    },
    it: {
      title: 'Chi siamo - farme.ro - Missione e valori',
      description: 'Scopri di più su farme.ro - il mercato che collega i produttori locali con i clienti. La nostra missione, valori e processi.',
      keywords: ['chi siamo farme.ro', 'missione', 'valori', 'produttori locali', 'prodotti tradizionali'],
    },
    es: {
      title: 'Sobre farme.ro - Misión y valores',
      description: 'Conoce más sobre farme.ro - el mercado que conecta productores locales con clientes. Nuestra misión, valores y procesos.',
      keywords: ['sobre farme.ro', 'misión', 'valores', 'productores locales', 'productos tradicionales'],
    },
    de: {
      title: 'Über farme.ro - Mission und Werte',
      description: 'Erfahren Sie mehr über farme.ro - den Marktplatz, der lokale Erzeuger mit Kunden verbindet. Unsere Mission, Werte und Prozesse.',
      keywords: ['über farme.ro', 'Mission', 'Werte', 'lokale Erzeuger', 'traditionelle Produkte'],
    },
    uk: {
      title: 'Про farme.ro - Місія та цінності',
      description: 'Дізнайтеся більше про farme.ro - ринкову площу, яка з\'єднує місцевих виробників з клієнтами. Наша місія, цінності та процеси.',
      keywords: ['про farme.ro', 'місія', 'цінності', 'місцеві виробники', 'традиційні продукти', 'Румунія'],
    },
    hu: {
      title: 'A farme.ro-ról - Küldetés és értékek',
      description: 'Tudjon meg többet a farme.ro-ról - a helyi termelőket az ügyfelekkel összekötő piacról. Küldetésünk, értékeink és folyamataink.',
      keywords: ['a farme.ro-ról', 'küldetés', 'értékek', 'helyi termelők', 'hagyományos termékek', 'Románia'],
    },
  }

  return metadata[locale]
}

/**
 * Fees page metadata per locale
 */
export function getFeesMetadata(locale: Locale = 'ro'): PageMetadata {
  const metadata: Record<Locale, PageMetadata> = {
    ro: {
      title: 'Comisioane și taxe - farme.ro',
      description: 'Informații transparente despre comisioanele și taxele platformei farme.ro. Tot ce trebuie să știi despre costuri, fără surprize.',
      keywords: ['comisioane', 'taxe', 'costuri', 'transparență', 'farme.ro', 'prețuri'],
    },
    en: {
      title: 'Fees and commissions - farme.ro',
      description: 'Transparent information about farme.ro platform fees and commissions. Everything you need to know about costs, no surprises.',
      keywords: ['fees', 'commissions', 'costs', 'transparency', 'farme.ro', 'prices'],
    },
    fr: {
      title: 'Frais et commissions - farme.ro',
      description: 'Informations transparentes sur les frais et commissions de la plateforme farme.ro. Tout ce que vous devez savoir sur les coûts.',
      keywords: ['frais', 'commissions', 'coûts', 'transparence', 'farme.ro'],
    },
    it: {
      title: 'Commissioni e tasse - farme.ro',
      description: 'Informazioni trasparenti su commissioni e tasse della piattaforma farme.ro. Tutto quello che devi sapere sui costi.',
      keywords: ['commissioni', 'tasse', 'costi', 'trasparenza', 'farme.ro'],
    },
    es: {
      title: 'Tarifas y comisiones - farme.ro',
      description: 'Información transparente sobre tarifas y comisiones de la plataforma farme.ro. Todo lo que necesitas saber sobre costos.',
      keywords: ['tarifas', 'comisiones', 'costos', 'transparencia', 'farme.ro'],
    },
    de: {
      title: 'Gebühren und Provisionen - farme.ro',
      description: 'Transparente Informationen zu Gebühren und Provisionen der farme.ro-Plattform. Alles, was Sie über Kosten wissen müssen.',
      keywords: ['Gebühren', 'Provisionen', 'Kosten', 'Transparenz', 'farme.ro'],
    },
    uk: {
      title: 'Комісії та збори - farme.ro',
      description: 'Прозора інформація про комісії та збори платформи farme.ro. Все, що потрібно знати про витрати, без сюрпризів.',
      keywords: ['комісії', 'збори', 'витрати', 'прозорість', 'farme.ro', 'ціни'],
    },
    hu: {
      title: 'Díjak és jutalékok - farme.ro',
      description: 'Átlátható információk a farme.ro platform díjairól és jutalékairól. Minden, amit a költségekről tudnia kell, meglepetések nélkül.',
      keywords: ['díjak', 'jutalékok', 'költségek', 'átláthatóság', 'farme.ro', 'árak'],
    },
  }

  return metadata[locale] || metadata.ro
}

/**
 * Support Farmero page metadata per locale
 */
export function getSupportFarmeroMetadata(locale: Locale = 'ro'): PageMetadata {
  const metadata: Record<Locale, PageMetadata> = {
    ro: {
      title: 'Susține Farmero - Ajută platforma să crească',
      description: 'Susține dezvoltarea platformei farme.ro și ajută producătorii locali să-și găsească clienții. Contribuie la un sistem mai bun.',
      keywords: ['susține farmero', 'donații', 'sprijin', 'producători locali', 'comunitate', 'dezvoltare'],
    },
    en: {
      title: 'Support Farmero - Help the platform grow',
      description: 'Support the development of farme.ro platform and help local producers find their customers. Contribute to a better system.',
      keywords: ['support farmero', 'donations', 'support', 'local producers', 'community', 'development'],
    },
    fr: {
      title: 'Soutenir Farmero - Aidez la plateforme à grandir',
      description: 'Soutenez le développement de la plateforme farme.ro et aidez les producteurs locaux à trouver leurs clients. Contribuez à un meilleur système.',
      keywords: ['soutenir farmero', 'dons', 'soutien', 'producteurs locaux', 'communauté'],
    },
    it: {
      title: 'Supporta Farmero - Aiuta la piattaforma a crescere',
      description: 'Supporta lo sviluppo della piattaforma farme.ro e aiuta i produttori locali a trovare i loro clienti. Contribuisci a un sistema migliore.',
      keywords: ['supporta farmero', 'donazioni', 'supporto', 'produttori locali', 'comunità'],
    },
    es: {
      title: 'Apoya Farmero - Ayuda a la plataforma a crecer',
      description: 'Apoya el desarrollo de la plataforma farme.ro y ayuda a los productores locales a encontrar sus clientes. Contribuye a un sistema mejor.',
      keywords: ['apoya farmero', 'donaciones', 'apoyo', 'productores locales', 'comunidad'],
    },
    de: {
      title: 'Unterstützen Sie Farmero - Helfen Sie der Plattform zu wachsen',
      description: 'Unterstützen Sie die Entwicklung der farme.ro-Plattform und helfen Sie lokalen Erzeugern, ihre Kunden zu finden. Tragen Sie zu einem besseren System bei.',
      keywords: ['unterstützen farmero', 'Spenden', 'Unterstützung', 'lokale Erzeuger', 'Gemeinschaft'],
    },
    uk: {
      title: 'Підтримайте Farmero - Допоможіть платформі рости',
      description: 'Підтримайте розвиток платформи farme.ro та допоможіть місцевим виробникам знайти своїх клієнтів. Внесіть свій внесок у кращу систему.',
      keywords: ['підтримати farmero', 'пожертви', 'підтримка', 'місцеві виробники', 'спільнота', 'розвиток'],
    },
    hu: {
      title: 'Támogassa a Farmero-t - Segítse a platform növekedését',
      description: 'Támogassa a farme.ro platform fejlesztését és segítse a helyi termelőket, hogy megtalálják ügyfeleiket. Járuljon hozzá egy jobb rendszerhez.',
      keywords: ['támogassa farmero', 'adományok', 'támogatás', 'helyi termelők', 'közösség', 'fejlesztés'],
    },
  }

  return metadata[locale]
}

/**
 * FAQ page metadata per locale
 */
export function getFAQMetadata(locale: Locale = 'ro'): PageMetadata {
  const metadata: Record<Locale, PageMetadata> = {
    ro: {
      title: 'Întrebări frecvente - farme.ro',
      description: 'Găsește răspunsuri la cele mai frecvente întrebări despre farme.ro',
      keywords: ['faq', 'întrebări frecvente', 'ajutor', 'suport', 'farme.ro'],
    },
    en: {
      title: 'Frequently asked questions - farme.ro',
      description: 'Find answers to the most frequently asked questions about farme.ro',
      keywords: ['faq', 'frequently asked questions', 'help', 'support', 'farme.ro'],
    },
    fr: {
      title: 'Questions fréquemment posées - farme.ro',
      description: 'Trouvez des réponses aux questions les plus fréquemment posées sur farme.ro',
      keywords: ['faq', 'questions fréquentes', 'aide', 'support', 'farme.ro'],
    },
    it: {
      title: 'Domande frequenti - farme.ro',
      description: 'Trova risposte alle domande più frequenti su farme.ro',
      keywords: ['faq', 'domande frequenti', 'aiuto', 'supporto', 'farme.ro'],
    },
    es: {
      title: 'Preguntas frecuentes - farme.ro',
      description: 'Encuentra respuestas a las preguntas más frecuentes sobre farme.ro',
      keywords: ['faq', 'preguntas frecuentes', 'ayuda', 'soporte', 'farme.ro'],
    },
    de: {
      title: 'Häufig gestellte Fragen - farme.ro',
      description: 'Finden Sie Antworten auf die häufigsten Fragen zu farme.ro',
      keywords: ['faq', 'häufig gestellte fragen', 'hilfe', 'support', 'farme.ro'],
    },
    uk: {
      title: 'Часті запитання - farme.ro',
      description: 'Знайдіть відповіді на найчастіші запитання про farme.ro',
      keywords: ['faq', 'часті запитання', 'допомога', 'підтримка', 'farme.ro'],
    },
    hu: {
      title: 'Gyakran ismételt kérdések - farme.ro',
      description: 'Találjon válaszokat a farme.ro-val kapcsolatos leggyakoribb kérdésekre',
      keywords: ['faq', 'gyakran ismételt kérdések', 'segítség', 'támogatás', 'farme.ro'],
    },
  }

  return metadata[locale] || metadata.ro
}

/**
 * How It Works page metadata per locale
 */
export function getHowItWorksMetadata(locale: Locale = 'ro'): PageMetadata {
  const metadata: Record<Locale, PageMetadata> = {
    ro: {
      title: 'Cum funcționează farme.ro - Impact social',
      description: 'Află cum funcționează platforma farme.ro și cum contribuie la economia locală și sustenabilitate.',
      keywords: ['cum funcționează', 'impact social', 'economie locală', 'sustenabilitate', 'farme.ro'],
    },
    en: {
      title: 'How farme.ro works - Social impact',
      description: 'Learn how the farme.ro platform works and how it contributes to the local economy and sustainability.',
      keywords: ['how it works', 'social impact', 'local economy', 'sustainability', 'farme.ro'],
    },
    fr: {
      title: 'Comment fonctionne farme.ro - Impact social',
      description: 'Découvrez comment fonctionne la plateforme farme.ro et comment elle contribue à l\'économie locale et à la durabilité.',
      keywords: ['comment ça marche', 'impact social', 'économie locale', 'durabilité', 'farme.ro'],
    },
    it: {
      title: 'Come funziona farme.ro - Impatto sociale',
      description: 'Scopri come funziona la piattaforma farme.ro e come contribuisce all\'economia locale e alla sostenibilità.',
      keywords: ['come funziona', 'impatto sociale', 'economia locale', 'sostenibilità', 'farme.ro'],
    },
    es: {
      title: 'Cómo funciona farme.ro - Impacto social',
      description: 'Descubre cómo funciona la plataforma farme.ro y cómo contribuye a la economía local y la sostenibilidad.',
      keywords: ['cómo funciona', 'impacto social', 'economía local', 'sostenibilidad', 'farme.ro'],
    },
    de: {
      title: 'Wie farme.ro funktioniert - Soziale Auswirkungen',
      description: 'Erfahren Sie, wie die farme.ro-Plattform funktioniert und wie sie zur lokalen Wirtschaft und Nachhaltigkeit beiträgt.',
      keywords: ['wie es funktioniert', 'soziale auswirkungen', 'lokale wirtschaft', 'nachhaltigkeit', 'farme.ro'],
    },
    uk: {
      title: 'Як працює farme.ro - Соціальний вплив',
      description: 'Дізнайтеся, як працює платформа farme.ro та як вона сприяє місцевій економіці та сталій розвитку.',
      keywords: ['як це працює', 'соціальний вплив', 'місцева економіка', 'сталість', 'farme.ro'],
    },
    hu: {
      title: 'Hogyan működik a farme.ro - Társadalmi hatás',
      description: 'Ismerje meg, hogyan működik a farme.ro platform és hogyan járul hozzá a helyi gazdasághoz és fenntarthatósághoz.',
      keywords: ['hogyan működik', 'társadalmi hatás', 'helyi gazdaság', 'fenntarthatóság', 'farme.ro'],
    },
  }

  return metadata[locale] || metadata.ro
}

/**
 * B2B page metadata per locale
 */
export function getB2BMetadata(locale: Locale = 'ro'): PageMetadata {
  const metadata: Record<Locale, PageMetadata> = {
    ro: {
      title: 'B2B - Soluții pentru afaceri - farme.ro',
      description: 'Produse proaspete pentru restaurante, hoteluri și alte afaceri. Comandă direct de la producători locali cu prețuri speciale B2B și livrare inclusă.',
      keywords: ['b2b românia', 'produse restaurante', 'produse hoteluri', 'catering produse', 'farme.ro b2b', 'produse afaceri'],
      ogTitle: 'B2B - Soluții pentru afaceri - farme.ro',
      ogDescription: 'Produse proaspete pentru restaurante, hoteluri și alte afaceri cu prețuri speciale B2B.',
    },
    en: {
      title: 'B2B - Business solutions - farme.ro',
      description: 'Fresh products for restaurants, hotels and other businesses. Order directly from local producers with special B2B prices and included delivery.',
      keywords: ['b2b romania', 'restaurant products', 'hotel products', 'catering products', 'farme.ro b2b', 'business products'],
      ogTitle: 'B2B - Business solutions - farme.ro',
      ogDescription: 'Fresh products for restaurants, hotels and other businesses with special B2B prices.',
    },
    fr: {
      title: 'B2B - Solutions pour entreprises - farme.ro',
      description: 'Produits frais pour restaurants, hôtels et autres entreprises. Commandez directement auprès de producteurs locaux avec des prix B2B spéciaux et livraison incluse.',
      keywords: ['b2b roumanie', 'produits restaurants', 'produits hôtels', 'produits traiteur', 'farme.ro b2b', 'produits entreprises'],
      ogTitle: 'B2B - Solutions pour entreprises - farme.ro',
      ogDescription: 'Produits frais pour restaurants, hôtels et autres entreprises avec des prix B2B spéciaux.',
    },
    it: {
      title: 'B2B - Soluzioni per aziende - farme.ro',
      description: 'Prodotti freschi per ristoranti, hotel e altre aziende. Ordina direttamente dai produttori locali con prezzi B2B speciali e consegna inclusa.',
      keywords: ['b2b romania', 'prodotti ristoranti', 'prodotti hotel', 'prodotti catering', 'farme.ro b2b', 'prodotti aziende'],
      ogTitle: 'B2B - Soluzioni per aziende - farme.ro',
      ogDescription: 'Prodotti freschi per ristoranti, hotel e altre aziende con prezzi B2B speciali.',
    },
    es: {
      title: 'B2B - Soluciones para empresas - farme.ro',
      description: 'Productos frescos para restaurantes, hoteles y otras empresas. Pedidos directamente de productores locales con precios B2B especiales y entrega incluida.',
      keywords: ['b2b rumania', 'productos restaurantes', 'productos hoteles', 'productos catering', 'farme.ro b2b', 'productos empresas'],
      ogTitle: 'B2B - Soluciones para empresas - farme.ro',
      ogDescription: 'Productos frescos para restaurantes, hoteles y otras empresas con precios B2B especiales.',
    },
    de: {
      title: 'B2B - Geschäftslösungen - farme.ro',
      description: 'Frische Produkte für Restaurants, Hotels und andere Unternehmen. Bestellen Sie direkt von lokalen Erzeugern mit speziellen B2B-Preisen und inklusiver Lieferung.',
      keywords: ['b2b rumänien', 'restaurant produkte', 'hotel produkte', 'catering produkte', 'farme.ro b2b', 'geschäftsprodukte'],
      ogTitle: 'B2B - Geschäftslösungen - farme.ro',
      ogDescription: 'Frische Produkte für Restaurants, Hotels und andere Unternehmen mit speziellen B2B-Preisen.',
    },
    uk: {
      title: 'B2B - Бізнес-рішення - farme.ro',
      description: 'Свіжі продукти для ресторанів, готелів та інших бізнесів. Замовляйте безпосередньо від місцевих виробників зі спеціальними B2B цінами та включеною доставкою.',
      keywords: ['b2b румунія', 'продукти ресторанів', 'продукти готелів', 'продукти кейтерингу', 'farme.ro b2b', 'бізнес продукти'],
      ogTitle: 'B2B - Бізнес-рішення - farme.ro',
      ogDescription: 'Свіжі продукти для ресторанів, готелів та інших бізнесів зі спеціальними B2B цінами.',
    },
    hu: {
      title: 'B2B - Üzleti megoldások - farme.ro',
      description: 'Friss termékek éttermeknek, hoteleknek és más vállalkozásoknak. Rendeljen közvetlenül helyi termelőktől speciális B2B árakkal és benne szállítással.',
      keywords: ['b2b románia', 'éttermi termékek', 'szállodai termékek', 'catering termékek', 'farme.ro b2b', 'üzleti termékek'],
      ogTitle: 'B2B - Üzleti megoldások - farme.ro',
      ogDescription: 'Friss termékek éttermeknek, hoteleknek és más vállalkozásoknak speciális B2B árakkal.',
    },
  }

  return metadata[locale] || metadata.ro
}

