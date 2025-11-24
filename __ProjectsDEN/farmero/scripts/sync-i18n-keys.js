/**
 * i18n Keys Synchronization Script
 * 
 * Sincronizează cheile de traducere între toate limbile,
 * completând automat cheile lipsă cu fallback-uri rezonabile.
 * 
 * Usage: node scripts/sync-i18n-keys.js
 */

const fs = require('fs')
const path = require('path')

const TRANSLATIONS_DIR = path.join(__dirname, '../src/lib/i18n/translations')
const SUPPORTED_LOCALES = ['ro', 'en', 'fr', 'it', 'de', 'es', 'uk', 'hu']
const REFERENCE_LOCALES = ['ro', 'en']
const AUTO_TRANSLATE_PREFIX = '@@AUTO@@'

/**
 * Recursively get all keys from a translation object
 */
function getAllKeys(obj, prefix = '') {
  const keys = []
  
  for (const key in obj) {
    // Skip meta keys
    if (key === '_meta') continue
    
    const fullKey = prefix ? `${prefix}.${key}` : key
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      // Recursively get nested keys
      keys.push(...getAllKeys(obj[key], fullKey))
    } else {
      // Leaf key
      keys.push(fullKey)
    }
  }
  
  return keys
}

/**
 * Get nested value from object by key path
 */
function getNestedValue(obj, keyPath) {
  const keys = keyPath.split('.')
  let value = obj
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      return undefined
    }
  }
  
  return value
}

/**
 * Set nested value in object by key path
 */
function setNestedValue(obj, keyPath, value) {
  const keys = keyPath.split('.')
  let current = obj
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
      current[key] = {}
    }
    current = current[key]
  }
  
  current[keys[keys.length - 1]] = value
}

/**
 * Check if a value is auto-translated
 */
function isAutoTranslated(value) {
  return typeof value === 'string' && value.startsWith(AUTO_TRANSLATE_PREFIX)
}

/**
 * Load translations from file
 */
function loadTranslations(locale) {
  try {
    const filePath = path.join(TRANSLATIONS_DIR, `${locale}.json`)
    const content = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(content)
  } catch (error) {
    console.error(`Error loading ${locale}.json:`, error.message)
    return null
  }
}

/**
 * Save translations to file
 */
function saveTranslations(locale, translations) {
  const filePath = path.join(TRANSLATIONS_DIR, `${locale}.json`)
  const content = JSON.stringify(translations, null, 2) + '\n'
  fs.writeFileSync(filePath, content, 'utf8')
}

/**
 * Sync translations for a locale
 */
function syncLocale(locale, reference, enTranslations) {
  const current = loadTranslations(locale)
  if (!current) {
    throw new Error(`Failed to load ${locale}.json`)
  }
  
  const report = {
    locale,
    added: 0,
    removed: 0,
    extra: [],
    autoTranslated: [],
  }
  
  // Get all keys from reference
  const referenceKeys = getAllKeys(reference)
  
  // Get all keys from current
  const currentKeys = getAllKeys(current)
  
  // Find missing keys
  const missingKeys = referenceKeys.filter(key => {
    const value = getNestedValue(current, key)
    return value === undefined
  })
  
  // Find extra keys (in current but not in reference)
  const extraKeys = currentKeys.filter(key => !referenceKeys.includes(key))
  report.extra = extraKeys
  
  // Add missing keys with fallback
  for (const key of missingKeys) {
    // Try to get from EN first, then use reference
    let fallbackValue = getNestedValue(enTranslations, key)
    
    if (fallbackValue === undefined) {
      fallbackValue = getNestedValue(reference, key)
    }
    
    // If still undefined, use key as fallback
    if (fallbackValue === undefined) {
      fallbackValue = key
    }
    
    // Mark as auto-translated if it's a string and not already marked
    let finalValue = fallbackValue
    if (typeof fallbackValue === 'string' && !isAutoTranslated(fallbackValue)) {
      // For non-EN locales, mark EN text as auto-translated
      if (locale !== 'en' && locale !== 'ro') {
        finalValue = `${AUTO_TRANSLATE_PREFIX} ${fallbackValue}`
        report.autoTranslated.push(key)
      }
    }
    
    setNestedValue(current, key, finalValue)
    report.added++
  }
  
  // Save updated translations
  saveTranslations(locale, current)
  
  return report
}

/**
 * Main sync function
 */
function syncAllTranslations() {
  console.log('🔄 Starting i18n keys synchronization...\n')
  
  // Load reference translations
  const roTranslations = loadTranslations('ro')
  const enTranslations = loadTranslations('en')
  
  if (!roTranslations || !enTranslations) {
    throw new Error('Failed to load reference translations (ro.json or en.json)')
  }
  
  console.log(`📊 Reference: RO (${getAllKeys(roTranslations).length} keys), EN (${getAllKeys(enTranslations).length} keys)\n`)
  
  const report = []
  
  // Sync each locale
  for (const locale of SUPPORTED_LOCALES) {
    if (locale === 'ro' || locale === 'en') {
      // Skip reference locales
      continue
    }
    
    console.log(`🔍 Syncing ${locale.toUpperCase()}...`)
    
    try {
      const localeReport = syncLocale(locale, roTranslations, enTranslations)
      report.push(localeReport)
      
      console.log(`  ✅ Added: ${localeReport.added} keys`)
      console.log(`  ⚠️  Extra: ${localeReport.extra.length} keys`)
      console.log(`  🔄 Auto-translated: ${localeReport.autoTranslated.length} keys`)
    } catch (error) {
      console.error(`  ❌ Error syncing ${locale}:`, error.message)
    }
  }
  
  // Generate report
  generateReport(report)
  
  console.log('\n✅ Synchronization complete!')
}

/**
 * Generate markdown report
 */
function generateReport(report) {
  let markdown = `# i18n Auto-fix Report\n\n`
  markdown += `**Generated:** ${new Date().toISOString()}\n\n`
  markdown += `**Auto-translate prefix:** \`${AUTO_TRANSLATE_PREFIX}\`\n\n`
  
  markdown += `## 📊 Summary\n\n`
  
  const totalAdded = report.reduce((sum, r) => sum + r.added, 0)
  const totalExtra = report.reduce((sum, r) => sum + r.extra.length, 0)
  const totalAuto = report.reduce((sum, r) => sum + r.autoTranslated.length, 0)
  
  markdown += `- **Total Keys Added:** ${totalAdded}\n`
  markdown += `- **Total Extra Keys:** ${totalExtra}\n`
  markdown += `- **Total Auto-translated:** ${totalAuto}\n\n`
  
  markdown += `## 📋 Per Language\n\n`
  
  for (const r of report) {
    markdown += `### ${r.locale.toUpperCase()}.json\n\n`
    markdown += `- **Keys Added:** ${r.added}\n`
    markdown += `- **Extra Keys:** ${r.extra.length}\n`
    markdown += `- **Auto-translated:** ${r.autoTranslated.length}\n\n`
    
    if (r.extra.length > 0) {
      markdown += `#### Extra Keys (not in reference):\n\n`
      const keysToShow = r.extra.slice(0, 20)
      for (const key of keysToShow) {
        markdown += `- \`${key}\`\n`
      }
      if (r.extra.length > 20) {
        markdown += `\n*... and ${r.extra.length - 20} more keys*\n`
      }
      markdown += `\n`
    }
    
    if (r.autoTranslated.length > 0) {
      markdown += `#### Auto-translated Keys (need human review):\n\n`
      const keysToShow = r.autoTranslated.slice(0, 30)
      for (const key of keysToShow) {
        markdown += `- \`${key}\`\n`
      }
      if (r.autoTranslated.length > 30) {
        markdown += `\n*... and ${r.autoTranslated.length - 30} more keys*\n`
      }
      markdown += `\n`
    }
  }
  
  markdown += `## 📝 Notes\n\n`
  markdown += `- Keys prefixed with \`${AUTO_TRANSLATE_PREFIX}\` are auto-generated and need human review.\n`
  markdown += `- Extra keys are keys that exist in a locale but not in the reference (RO).\n`
  markdown += `- Extra keys are NOT removed automatically - review manually.\n\n`
  
  // Write report
  const reportPath = path.join(__dirname, '../docs/I18N_AUTOFIX_REPORT.md')
  fs.writeFileSync(reportPath, markdown, 'utf8')
  
  console.log(`📄 Report saved to: ${reportPath}`)
}

// Run sync
try {
  syncAllTranslations()
} catch (error) {
  console.error('❌ Sync failed:', error.message)
  process.exit(1)
}

