#!/bin/bash

# Script pentru activarea feature-urilor MVP în BackendSyncStatus
# Folosește acest script după ce backend-ul este gata și testat

echo "🚀 Activare feature-uri MVP în BackendSyncStatus"
echo ""

# Verifică că fișierul există
if [ ! -f "src/lib/backend-sync/status.ts" ]; then
    echo "❌ Eroare: Fișierul src/lib/backend-sync/status.ts nu există!"
    exit 1
fi

echo "📝 Backup fișier original..."
cp src/lib/backend-sync/status.ts src/lib/backend-sync/status.ts.backup

echo ""
echo "⚠️  ATENȚIE: Acest script va modifica BackendSyncStatus!"
echo "⚠️  Asigură-te că backend-ul este gata și testat înainte de a continua!"
echo ""
read -p "Continuă? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Anulat."
    exit 1
fi

echo ""
echo "✅ Activare feature-uri MVP..."

# Feature-uri MVP de activat
FEATURES=(
    "cart:true"
    "checkout:true"
    "clientOrders:true"
    "producerProducts:true"
    "producerOrders:true"
)

# Pentru fiecare feature, înlocuiește false cu true
for feature in "${FEATURES[@]}"; do
    IFS=':' read -r key value <<< "$feature"
    echo "  - Activare $key..."
    
    # Înlocuiește pattern-ul: key: false, // ... cu key: true, // ...
    sed -i "s/^\s*${key}:\s*false,.*$/  ${key}: ${value}, \/\/ ✅ ACTIVAT - MVP/" src/lib/backend-sync/status.ts
done

echo ""
echo "✅ Feature-uri activate!"
echo ""
echo "📋 Următorii pași:"
echo "1. Verifică modificările: git diff src/lib/backend-sync/status.ts"
echo "2. Testează manual fiecare feature"
echo "3. Dacă totul funcționează: git commit -m 'feat: activate MVP backend features'"
echo "4. Deploy pe Vercel"
echo ""
echo "💡 Backup salvat în: src/lib/backend-sync/status.ts.backup"

