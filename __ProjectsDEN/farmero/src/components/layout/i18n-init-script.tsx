/**
 * I18n Initialization Script
 * 
 * Ensures locale cookie is set before React hydration
 * This helps sync server and client rendering
 */

'use client'

export function I18nInitScript() {
  // Script that runs before React hydration to sync locale
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              // Get locale from localStorage or cookie
              let locale = 'ro';
              
              // Supported locales
              const supportedLocales = ['ro', 'en', 'fr', 'it', 'es', 'de', 'uk', 'hu'];
              
              // Map browser locale to app locale
              function mapBrowserLocale(browserLocale) {
                const normalized = browserLocale.toLowerCase().split('-')[0];
                if (supportedLocales.includes(normalized)) {
                  return normalized;
                }
                // Special mappings
                if (normalized === 'ru') {
                  return 'uk'; // Map Russian to Ukrainian for MVP
                }
                return null;
              }
              
              // Try cookie first (to match server)
              let hasSavedPreference = false;
              let cookieValue = null;
              const cookies = document.cookie.split(';');
              const localeCookie = cookies.find(c => c.trim().startsWith('locale='));
              if (localeCookie) {
                cookieValue = localeCookie.split('=')[1]?.trim();
                if (cookieValue && supportedLocales.includes(cookieValue)) {
                  locale = cookieValue;
                  hasSavedPreference = true;
                }
              }
              
              // Try localStorage (this might be more recent than cookie)
              // Prefer localStorage if it exists, as it's more reliable for client-side changes
              try {
                const savedLocale = localStorage.getItem('locale');
                if (savedLocale && supportedLocales.includes(savedLocale)) {
                  locale = savedLocale;
                  hasSavedPreference = true;
                  // Sync to cookie if they differ
                  if (cookieValue !== savedLocale) {
                    document.cookie = 'locale=' + locale + '; path=/; max-age=31536000; SameSite=Lax';
                  }
                }
              } catch (e) {}
              
              // Only use browser language if NO explicit preference was saved
              // This ensures user's manual selection is always respected
              if (!hasSavedPreference && navigator.language) {
                const mapped = mapBrowserLocale(navigator.language);
                if (mapped) {
                  locale = mapped;
                  // Save to both localStorage and cookie
                  try {
                    localStorage.setItem('locale', locale);
                  } catch (e) {}
                  document.cookie = 'locale=' + locale + '; path=/; max-age=31536000; SameSite=Lax';
                }
              }
              
              // Ensure cookie is always set to match current locale
              if (!localeCookie || cookieValue !== locale) {
                document.cookie = 'locale=' + locale + '; path=/; max-age=31536000; SameSite=Lax';
              }
            } catch (e) {
              // Silently fail if initialization doesn't work
            }
          })();
        `,
      }}
    />
  )
}

