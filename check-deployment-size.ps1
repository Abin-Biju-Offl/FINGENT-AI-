# Vercel Deployment Size Check
# This script helps verify deployment stays under 250MB limit

Write-Host "Checking Vercel Deployment Size..." -ForegroundColor Cyan
Write-Host ""

# Check tracked files size
Write-Host "Git Tracked Files:" -ForegroundColor Yellow
$trackedSize = (git ls-files -z | ForEach-Object { if (Test-Path $_) { (Get-Item $_).Length } } | Measure-Object -Sum).Sum / 1MB
Write-Host "  Total Size: $([math]::Round($trackedSize, 2)) MB" -ForegroundColor Green
Write-Host "  File Count: $(git ls-files | Measure-Object | Select-Object -ExpandProperty Count)" -ForegroundColor Green
Write-Host ""

# Check if node_modules is tracked
Write-Host "Checking for node_modules in git..." -ForegroundColor Yellow
$nodeModulesTracked = git ls-files | Select-String "node_modules"
if ($nodeModulesTracked) {
    Write-Host "  ❌ WARNING: node_modules files are tracked!" -ForegroundColor Red
    $nodeModulesTracked
} else {
    Write-Host "  ✅ node_modules is properly excluded" -ForegroundColor Green
}
Write-Host ""

# Check Python dependencies size estimate
Write-Host "Estimated Python Dependencies Size:" -ForegroundColor Yellow
Write-Host "  FastAPI + deps: ~30-40 MB" -ForegroundColor Gray
Write-Host "  Twilio: ~10-15 MB" -ForegroundColor Gray
Write-Host "  Groq: ~5-10 MB" -ForegroundColor Gray
Write-Host "  Other deps: ~5-10 MB" -ForegroundColor Gray
Write-Host "  Estimated Total: ~50-75 MB" -ForegroundColor Green
Write-Host ""

# Calculate approximate deployment size
$estimatedDeploymentSize = $trackedSize + 60  # Add average Python deps size
Write-Host "Estimated Deployment Size:" -ForegroundColor Yellow
Write-Host "  Code: $([math]::Round($trackedSize, 2)) MB" -ForegroundColor Gray
Write-Host "  Python deps: ~60 MB (estimated)" -ForegroundColor Gray
Write-Host "  Total: ~$([math]::Round($estimatedDeploymentSize, 2)) MB" -ForegroundColor $(if ($estimatedDeploymentSize -lt 250) { "Green" } else { "Red" })
Write-Host ""

if ($estimatedDeploymentSize -lt 250) {
    Write-Host "✅ Deployment size is under 250MB limit" -ForegroundColor Green
} else {
    Write-Host "❌ WARNING: Deployment may exceed 250MB limit!" -ForegroundColor Red
}
Write-Host ""

# Check ignore files
Write-Host "Checking ignore files:" -ForegroundColor Yellow
if (Test-Path .gitignore) {
    Write-Host "  ✅ .gitignore exists" -ForegroundColor Green
}
if (Test-Path .vercelignore) {
    Write-Host "  ✅ .vercelignore exists" -ForegroundColor Green
}
if (Test-Path .slugignore) {
    Write-Host "  ✅ .slugignore exists" -ForegroundColor Green
}
Write-Host ""

Write-Host "Deployment size check complete!" -ForegroundColor Cyan
