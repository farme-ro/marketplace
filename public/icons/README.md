# Farmero PWA Icons

Acest director conține icon-urile necesare pentru PWA (Progressive Web App).

## Icons Necesare

### Android / Chrome
- `icon-192x192.png` - Icon 192x192px (Android)
- `icon-512x512.png` - Icon 512x512px (Android high-res)

### iOS / Safari
- `apple-touch-icon.png` - Icon 180x180px (iOS)

## Generare Icons

Icons-urile trebuie generate din logo-ul Farmero (`public/farmero.png` sau `public/farmero_wh.png`).

### Tool Recomandat
- **PWA Asset Generator**: https://github.com/onderceylan/pwa-asset-generator
- **RealFaviconGenerator**: https://realfavicongenerator.net/

### Comandă (PWA Asset Generator)
```bash
npx pwa-asset-generator public/farmero.png public/icons --icon-only --favicon
```

## Format

- **Format**: PNG
- **Background**: Transparent sau solid (în funcție de design)
- **Padding**: Recomandat 10-20% padding pentru a evita tăierea la rotunjire

## Verificare

După generare, verifică:
1. Icons-urile sunt vizibile în `manifest.webmanifest`
2. Testează instalarea PWA pe Android (Chrome)
3. Testează instalarea PWA pe iOS (Safari)

---

**Status:** ✅ **COMPLETE** - Icons-urile au fost generate și sunt disponibile:
- `manifest-icon-192.maskable.png` - Icon 192x192px (Android)
- `manifest-icon-512.maskable.png` - Icon 512x512px (Android high-res)
- `apple-icon-180.png` - Icon 180x180px (iOS)
- `favicon-196.png` - Favicon 196x196px

Manifest-ul și layout-ul au fost actualizate pentru a folosi aceste icon-uri.

