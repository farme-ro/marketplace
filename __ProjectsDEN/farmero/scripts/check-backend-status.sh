#!/bin/bash

# Script pentru verificarea status-ului backend și feature-urilor

echo "🔍 Verificare status backend și feature-uri"
echo ""

# Verifică variabilele de mediu
echo "📋 Variabile de mediu:"
if [ -z "$NEXT_PUBLIC_API_URL" ]; then
    echo "  ❌ NEXT_PUBLIC_API_URL nu este setat"
else
    echo "  ✅ NEXT_PUBLIC_API_URL = $NEXT_PUBLIC_API_URL"
fi

echo ""

# Verifică status-ul feature-urilor
echo "📋 Status feature-uri în BackendSyncStatus:"

if [ -f "src/lib/backend-sync/status.ts" ]; then
    echo ""
    echo "Core Commerce (MVP):"
    grep -E "^\s*(cart|checkout|clientOrders|producerProducts|producerOrders):" src/lib/backend-sync/status.ts | sed 's/^/  /'
    
    echo ""
    echo "Feature-uri activate:"
    grep -c "true" src/lib/backend-sync/status.ts | xargs -I {} echo "  {} feature-uri"
    
    echo ""
    echo "Feature-uri dezactivate:"
    grep -c "false" src/lib/backend-sync/status.ts | xargs -I {} echo "  {} feature-uri"
else
    echo "  ❌ Fișierul src/lib/backend-sync/status.ts nu există!"
fi

echo ""

# Verifică conectivitatea la backend (dacă API URL este setat)
if [ ! -z "$NEXT_PUBLIC_API_URL" ]; then
    echo "🌐 Testare conectivitate backend:"
    if curl -s --head --request GET "$NEXT_PUBLIC_API_URL/health" > /dev/null 2>&1; then
        echo "  ✅ Backend este accesibil la $NEXT_PUBLIC_API_URL"
    else
        echo "  ⚠️  Backend nu este accesibil la $NEXT_PUBLIC_API_URL"
        echo "     (Poate fi normal dacă endpoint-ul /health nu există)"
    fi
fi

echo ""
echo "✅ Verificare completă!"

