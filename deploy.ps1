# ===========================
# 🧠 Bakery Project — Full Auto Deploy Script
# Author: Venom Carnage
# ===========================

Write-Host "🚀 Starting full deployment process..." -ForegroundColor Cyan

# 1️⃣ Clean project
Write-Host "🧹 Cleaning project directories..."
Remove-Item -Recurse -Force .next, .turbo, node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
Write-Host "✅ Clean complete!"

# 2️⃣ Reinstall dependencies
Write-Host "📦 Installing dependencies..."
npm install

# 3️⃣ Build optimization
Write-Host "⚙️ Running build optimization..."
npm run build

# 4️⃣ Bundle analysis
Write-Host "📊 Running bundle analysis..."
npm run analyze

# 5️⃣ Git setup and push
Write-Host "🧭 Preparing Git push..."
git add .
git commit -m "🚀 Automated full deploy with performance optimization"
git branch -M main
git push origin main
Write-Host "✅ Git push complete!"

# 6️⃣ Environment setup
if (!(Test-Path ".env.local")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env.local"
        Write-Host "⚙️ Created .env.local from .env.example template."
    } elseif (Test-Path "env.example.txt") {
        Copy-Item "env.example.txt" ".env.local"
        Write-Host "⚙️ Created .env.local from env.example.txt template."
    } else {
        Write-Host "⚠️ No environment template found (.env.example or env.example.txt)." -ForegroundColor Yellow
    }
}

# 7️⃣ Vercel deployment
Write-Host "☁️ Deploying to Vercel..."
if (!(Get-Command vercel -ErrorAction SilentlyContinue)) {
    npm install -g vercel
}
vercel --prod --confirm

# 8️⃣ Summary report
$date = Get-Date -Format "yyyy-MM-dd HH:mm"
@"
✅ DEPLOYMENT COMPLETE — $date

🌐 Live site deployed to Vercel (Production)
📦 Dependencies installed
⚙️ Build optimized and analyzed
🧹 Clean project structure
🚀 Pushed to GitHub: main branch

"@ | Out-File -Encoding UTF8 DEPLOYMENT_SUMMARY.txt

Write-Host "🎉 All done! Check DEPLOYMENT_SUMMARY.txt for details." -ForegroundColor Green

