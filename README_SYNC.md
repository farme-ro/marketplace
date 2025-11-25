# 🔄 Sincronizare Marketplace

## Problema
Schimbările făcute în folderul `marketplace` nu sunt automat reflectate în `marketplace-repo` și deci nu ajung pe GitHub.

## Soluție

### Opțiunea 1: Lucrează direct în `marketplace-repo` (Recomandat)
- Toate schimbările vor fi direct în repo-ul Git conectat la GitHub
- Nu mai ai nevoie de sincronizare

### Opțiunea 2: Folosește script-ul de sincronizare
Dacă preferi să lucrezi în `marketplace`, rulează script-ul după ce faci schimbări:

```powershell
cd F:\__ProjectsDEN\farmero\marketplace-repo
.\sync-from-marketplace.ps1
```

Script-ul va:
1. Copia toate fișierele din `marketplace` în `marketplace-repo` (excluzând `.git`)
2. Verifica ce schimbări există
3. Te va întreba dacă vrei să faci commit și push automat

### Opțiunea 3: Sincronizare manuală
```powershell
# 1. Copiază fișierele
cd F:\__ProjectsDEN\farmero
Get-ChildItem marketplace -Force | Where-Object { $_.Name -ne '.git' } | ForEach-Object {
    Copy-Item $_.FullName -Destination "marketplace-repo\$($_.Name)" -Recurse -Force
}

# 2. Commit și push
cd marketplace-repo
git add -A
git commit -m "chore: sync changes from marketplace"
git push origin master
```

## ⚠️ Important
- Folderul `marketplace` este acum doar pentru backup/lucru local
- Folderul `marketplace-repo` este repo-ul Git conectat la GitHub
- Pentru ca schimbările să ajungă pe GitHub, trebuie să fie în `marketplace-repo` și să faci commit + push

