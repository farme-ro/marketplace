# Script de sincronizare: copiază schimbările din marketplace în marketplace-repo
# Folosește: .\sync-from-marketplace.ps1

$marketplacePath = "F:\__ProjectsDEN\farmero\marketplace"
$marketplaceRepoPath = "F:\__ProjectsDEN\farmero\marketplace-repo"

Write-Host "🔄 Sincronizare marketplace -> marketplace-repo..." -ForegroundColor Cyan

# Exclude .git folder
Get-ChildItem $marketplacePath -Force | Where-Object { $_.Name -ne '.git' } | ForEach-Object {
    $destPath = Join-Path $marketplaceRepoPath $_.Name
    if ($_.PSIsContainer) {
        if (Test-Path $destPath) {
            Remove-Item $destPath -Recurse -Force
        }
        Copy-Item $_.FullName -Destination $destPath -Recurse -Force
        Write-Host "  ✓ Copiat folder: $($_.Name)" -ForegroundColor Green
    } else {
        Copy-Item $_.FullName -Destination $destPath -Force
        Write-Host "  ✓ Copiat fișier: $($_.Name)" -ForegroundColor Green
    }
}

Write-Host "`n📊 Verificare status Git..." -ForegroundColor Cyan
Set-Location $marketplaceRepoPath
$status = git status --short

if ($status) {
    Write-Host "`n📝 Schimbări detectate:" -ForegroundColor Yellow
    $status | Select-Object -First 20
    
    Write-Host "`n❓ Vrei să faci commit și push? (Y/N)" -ForegroundColor Yellow
    $response = Read-Host
    
    if ($response -eq 'Y' -or $response -eq 'y') {
        git add -A
        git commit -m "chore: sync changes from marketplace folder"
        git push origin master
        Write-Host "`n✅ Commit și push finalizate!" -ForegroundColor Green
    } else {
        Write-Host "`n⚠️  Schimbările sunt staged, dar nu au fost commit-uite." -ForegroundColor Yellow
        Write-Host "   Rulează manual: git add -A && git commit -m 'mesaj' && git push" -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ Nu există schimbări - totul este sincronizat!" -ForegroundColor Green
}

Write-Host "`n✨ Sincronizare completă!" -ForegroundColor Cyan

