/**
 * Find Hardcoded Texts Script
 * 
 * Detectează texte hardcodate în română/engleză care ar trebui să folosească i18n
 */

const fs = require('fs')
const path = require('path')

const SRC_DIR = path.join(__dirname, '../src')
const PATTERNS = [
  // Română
  /["'>](Produse|Producători|Cumpără|Adaugă|Descoperă|Filtrează|Comandă|Cont|Autentificare|Înregistrare|Coș|Checkout|Livrare|Plată|Anulează|Salvează|Șterge|Editează|Vezi|Detalii|Caută|Sortează|Filtrează|Înapoi|Următor|Anterior|Continuă|Confirmă|Elimină|Închide|Descarcă|Încarcă|Resetează|Aplică|Selectează|Creează|Actualizează|Trimite)[\s"']/gi,
  // Engleză (dacă nu e în t())
  /["'>](Products|Producers|Buy|Add|Discover|Filter|Order|Account|Login|Register|Cart|Checkout|Delivery|Payment|Cancel|Save|Delete|Edit|View|Details|Search|Sort|Back|Next|Previous|Continue|Confirm|Remove|Close|Download|Upload|Reset|Apply|Select|Create|Update|Send)[\s"']/gi,
]

const EXCLUDE_PATTERNS = [
  /useI18n|t\(|getTranslation|from.*i18n|import.*i18n/i,
  /\/\/.*|console\.|logger\.|error\.|warn\./,
  /\.json$/,
  /\.md$/,
  /node_modules/,
  /\.test\.|\.spec\./,
]

const HARDCODED_TEXTS = []

/**
 * Check if line uses i18n
 */
function usesI18n(line) {
  return /useI18n|t\(|getTranslation/i.test(line)
}

/**
 * Check if file should be excluded
 */
function shouldExclude(filePath) {
  return EXCLUDE_PATTERNS.some(pattern => pattern.test(filePath))
}

/**
 * Scan file for hardcoded texts
 */
function scanFile(filePath) {
  if (shouldExclude(filePath)) return
  
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const lines = content.split('\n')
    
    lines.forEach((line, index) => {
      // Skip if line uses i18n
      if (usesI18n(line)) return
      
      // Check for Romanian/English patterns
      for (const pattern of PATTERNS) {
        const matches = line.match(pattern)
        if (matches) {
          // Check if it's not in a comment or string that's already translated
          if (!line.includes('//') && !line.includes('/*') && !line.includes('*/')) {
            HARDCODED_TEXTS.push({
              file: filePath.replace(SRC_DIR + path.sep, ''),
              line: index + 1,
              text: line.trim().substring(0, 100),
              matches: matches.slice(0, 3),
            })
          }
        }
      }
    })
  } catch (error) {
    // Skip files that can't be read
  }
}

/**
 * Recursively scan directory
 */
function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    
    if (entry.isDirectory()) {
      if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
        scanDirectory(fullPath)
      }
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
      scanFile(fullPath)
    }
  }
}

// Scan src directory
console.log('🔍 Scanning for hardcoded texts...\n')
scanDirectory(SRC_DIR)

// Group by file
const byFile = {}
HARDCODED_TEXTS.forEach(item => {
  if (!byFile[item.file]) {
    byFile[item.file] = []
  }
  byFile[item.file].push(item)
})

// Generate report
let report = `## 🔴 Hardcoded Texts Requiring i18n\n\n`
report += `**Total Found:** ${HARDCODED_TEXTS.length} instances\n\n`

if (HARDCODED_TEXTS.length === 0) {
  report += `✅ No hardcoded texts found!\n\n`
} else {
  const files = Object.keys(byFile).sort()
  
  // Show top 20 files with most issues
  const filesWithCounts = files.map(file => ({
    file,
    count: byFile[file].length,
  })).sort((a, b) => b.count - a.count).slice(0, 20)
  
  report += `### Top Files with Hardcoded Texts\n\n`
  report += `| File | Instances |\n`
  report += `|------|-----------|\n`
  
  for (const { file, count } of filesWithCounts) {
    report += `| \`${file}\` | ${count} |\n`
  }
  
  report += `\n### Detailed Findings\n\n`
  
  // Show details for critical files
  const criticalFiles = filesWithCounts.slice(0, 10)
  for (const { file } of criticalFiles) {
    const items = byFile[file]
    report += `#### ${file}\n\n`
    
    // Show first 5 instances
    for (const item of items.slice(0, 5)) {
      report += `- **Line ${item.line}:** \`${item.text.substring(0, 80)}...\`\n`
      report += `  - Matches: ${item.matches.join(', ')}\n`
    }
    
    if (items.length > 5) {
      report += `\n*... and ${items.length - 5} more instances*\n`
    }
    
    report += `\n`
  }
}

// Write to file
const reportPath = path.join(__dirname, '../docs/I18N_HARDCODED_TEXTS.md')
fs.writeFileSync(reportPath, report, 'utf8')

console.log(`✅ Found ${HARDCODED_TEXTS.length} hardcoded text instances`)
console.log(`📄 Report saved to: ${reportPath}`)

// Return summary for main report
process.stdout.write(JSON.stringify({
  total: HARDCODED_TEXTS.length,
  byFile: Object.keys(byFile).length,
  topFiles: filesWithCounts.slice(0, 10).map(f => f.file),
}))

