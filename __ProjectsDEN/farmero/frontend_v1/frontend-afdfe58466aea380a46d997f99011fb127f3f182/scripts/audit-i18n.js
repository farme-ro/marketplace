/**
 * i18n Audit Script
 * 
 * Verifică consistența traducerilor între toate limbile
 * Generează raport cu chei lipsă, chei în plus, etc.
 */

const fs = require('fs')
const path = require('path')

const TRANSLATIONS_DIR = path.join(__dirname, '../src/lib/i18n/translations')
const SUPPORTED_LOCALES = ['ro', 'en', 'fr', 'it', 'de', 'es', 'uk', 'hu']
const REFERENCE_LOCALE = 'ro'

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
 * Get value at a nested key path
 */
function getNestedValue(obj, keyPath) {
  const keys = keyPath.split('.')
  let value = obj
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key]
    } else {
      return undefined
    }
  }
  
  return value
}

/**
 * Check if a key is a leaf (string value, not an object)
 */
function isLeafKey(obj, keyPath) {
  const value = getNestedValue(obj, keyPath)
  return value !== undefined && typeof value !== 'object'
}

/**
 * Load translations for a locale
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
 * Main audit function
 */
function auditTranslations() {
  console.log('🔍 Starting i18n audit...\n')
  
  // Load reference translations (Romanian)
  const reference = loadTranslations(REFERENCE_LOCALE)
  if (!reference) {
    console.error(`❌ Failed to load reference locale: ${REFERENCE_LOCALE}`)
    process.exit(1)
  }
  
  const referenceKeys = getAllKeys(reference).sort()
  console.log(`📊 Reference (${REFERENCE_LOCALE}): ${referenceKeys.length} keys\n`)
  
  const report = {
    reference: {
      locale: REFERENCE_LOCALE,
      totalKeys: referenceKeys.length,
      keys: referenceKeys,
    },
    languages: {},
    summary: {
      totalMissing: 0,
      totalExtra: 0,
      languagesWithIssues: [],
    },
  }
  
  // Audit each language
  for (const locale of SUPPORTED_LOCALES) {
    if (locale === REFERENCE_LOCALE) continue
    
    console.log(`\n🔎 Auditing ${locale}...`)
    
    const translations = loadTranslations(locale)
    if (!translations) {
      report.languages[locale] = {
        status: 'error',
        error: 'Failed to load translations',
      }
      continue
    }
    
    const localeKeys = getAllKeys(translations).sort()
    
    // Find missing keys (in reference but not in locale)
    const missingKeys = referenceKeys.filter(key => {
      const value = getNestedValue(translations, key)
      return value === undefined || (typeof value === 'object' && !isLeafKey(translations, key))
    })
    
    // Find extra keys (in locale but not in reference)
    const extraKeys = localeKeys.filter(key => !referenceKeys.includes(key))
    
    // Find empty values (key exists but value is empty string)
    const emptyValues = localeKeys.filter(key => {
      const value = getNestedValue(translations, key)
      return typeof value === 'string' && value.trim() === ''
    })
    
    // Group missing keys by namespace
    const missingByNamespace = {}
    for (const key of missingKeys) {
      const namespace = key.split('.')[0]
      if (!missingByNamespace[namespace]) {
        missingByNamespace[namespace] = []
      }
      missingByNamespace[namespace].push(key)
    }
    
    report.languages[locale] = {
      status: 'ok',
      totalKeys: localeKeys.length,
      missingKeys,
      missingCount: missingKeys.length,
      extraKeys,
      extraCount: extraKeys.length,
      emptyValues,
      emptyCount: emptyValues.length,
      missingByNamespace,
      coverage: ((referenceKeys.length - missingKeys.length) / referenceKeys.length * 100).toFixed(2) + '%',
    }
    
    report.summary.totalMissing += missingKeys.length
    report.summary.totalExtra += extraKeys.length
    
    if (missingKeys.length > 0 || extraKeys.length > 0 || emptyValues.length > 0) {
      report.summary.languagesWithIssues.push(locale)
    }
    
    console.log(`  ✅ Total keys: ${localeKeys.length}`)
    console.log(`  ⚠️  Missing: ${missingKeys.length}`)
    console.log(`  ⚠️  Extra: ${extraKeys.length}`)
    console.log(`  ⚠️  Empty: ${emptyValues.length}`)
    console.log(`  📈 Coverage: ${report.languages[locale].coverage}`)
  }
  
  return report
}

/**
 * Generate markdown report
 */
function generateReport(report) {
  let markdown = `# i18n QA Report - Translation Consistency Audit\n\n`
  markdown += `**Generated:** ${new Date().toISOString()}\n\n`
  markdown += `**Reference Locale:** ${report.reference.locale} (${report.reference.totalKeys} keys)\n\n`
  
  // Summary
  markdown += `## 📊 Summary\n\n`
  markdown += `- **Total Missing Keys:** ${report.summary.totalMissing}\n`
  markdown += `- **Total Extra Keys:** ${report.summary.totalExtra}\n`
  markdown += `- **Languages with Issues:** ${report.summary.languagesWithIssues.length} (${report.summary.languagesWithIssues.join(', ')})\n\n`
  
  // Missing keys per language
  markdown += `## 🔴 Missing Keys Per Language\n\n`
  
  for (const locale of Object.keys(report.languages).sort()) {
    const lang = report.languages[locale]
    if (lang.status === 'error') {
      markdown += `### ${locale.toUpperCase()}.json\n\n`
      markdown += `❌ **Error:** ${lang.error}\n\n`
      continue
    }
    
    if (lang.missingCount === 0) {
      markdown += `### ${locale.toUpperCase()}.json\n\n`
      markdown += `✅ **No missing keys!** (${lang.coverage} coverage)\n\n`
      continue
    }
    
    markdown += `### ${locale.toUpperCase()}.json\n\n`
    markdown += `**Missing Keys:** ${lang.missingCount} | **Coverage:** ${lang.coverage}\n\n`
    
    // Group by namespace
    const namespaces = Object.keys(lang.missingByNamespace).sort()
    for (const namespace of namespaces) {
      const keys = lang.missingByNamespace[namespace]
      if (keys.length > 0) {
        markdown += `#### ${namespace}\n\n`
        // Show first 20 keys, then summarize
        const keysToShow = keys.slice(0, 20)
        for (const key of keysToShow) {
          markdown += `- \`${key}\`\n`
        }
        if (keys.length > 20) {
          markdown += `\n*... and ${keys.length - 20} more keys*\n`
        }
        markdown += `\n`
      }
    }
  }
  
  // Extra keys
  markdown += `## 🟡 Extra Keys (Not in Reference)\n\n`
  
  let hasExtra = false
  for (const locale of Object.keys(report.languages).sort()) {
    const lang = report.languages[locale]
    if (lang.status === 'error') continue
    
    if (lang.extraCount > 0) {
      hasExtra = true
      markdown += `### ${locale.toUpperCase()}.json\n\n`
      markdown += `**Extra Keys:** ${lang.extraCount}\n\n`
      
      const keysToShow = lang.extraKeys.slice(0, 20)
      for (const key of keysToShow) {
        markdown += `- \`${key}\`\n`
      }
      if (lang.extraKeys.length > 20) {
        markdown += `\n*... and ${lang.extraKeys.length - 20} more keys*\n`
      }
      markdown += `\n`
    }
  }
  
  if (!hasExtra) {
    markdown += `✅ No extra keys found.\n\n`
  }
  
  // Empty values
  markdown += `## ⚠️ Empty Values\n\n`
  
  let hasEmpty = false
  for (const locale of Object.keys(report.languages).sort()) {
    const lang = report.languages[locale]
    if (lang.status === 'error') continue
    
    if (lang.emptyCount > 0) {
      hasEmpty = true
      markdown += `### ${locale.toUpperCase()}.json\n\n`
      markdown += `**Empty Values:** ${lang.emptyCount}\n\n`
      
      const keysToShow = lang.emptyValues.slice(0, 20)
      for (const key of keysToShow) {
        markdown += `- \`${key}\`\n`
      }
      if (lang.emptyValues.length > 20) {
        markdown += `\n*... and ${lang.emptyValues.length - 20} more keys*\n`
      }
      markdown += `\n`
    }
  }
  
  if (!hasEmpty) {
    markdown += `✅ No empty values found.\n\n`
  }
  
  // Coverage table
  markdown += `## 📈 Coverage Table\n\n`
  markdown += `| Locale | Total Keys | Missing | Extra | Empty | Coverage |\n`
  markdown += `|--------|-----------|---------|-------|-------|----------|\n`
  
  markdown += `| ${report.reference.locale.toUpperCase()} | ${report.reference.totalKeys} | - | - | - | 100% |\n`
  
  for (const locale of Object.keys(report.languages).sort()) {
    const lang = report.languages[locale]
    if (lang.status === 'error') {
      markdown += `| ${locale.toUpperCase()} | ❌ | ❌ | ❌ | ❌ | ❌ |\n`
      continue
    }
    
    const status = lang.missingCount === 0 && lang.extraCount === 0 && lang.emptyCount === 0 ? '✅' : '⚠️'
    markdown += `| ${locale.toUpperCase()} | ${lang.totalKeys} | ${lang.missingCount} | ${lang.extraCount} | ${lang.emptyCount} | ${lang.coverage} ${status} |\n`
  }
  
  markdown += `\n`
  
  return markdown
}

// Run audit
const report = auditTranslations()
const markdown = generateReport(report)

// Write report
const reportPath = path.join(__dirname, '../docs/I18N_QA_REPORT.md')
fs.writeFileSync(reportPath, markdown, 'utf8')

console.log(`\n✅ Audit complete!`)
console.log(`📄 Report saved to: ${reportPath}`)
console.log(`\n📊 Summary:`)
console.log(`   - Missing keys: ${report.summary.totalMissing}`)
console.log(`   - Extra keys: ${report.summary.totalExtra}`)
console.log(`   - Languages with issues: ${report.summary.languagesWithIssues.length}`)

