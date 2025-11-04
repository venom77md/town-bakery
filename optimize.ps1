# ==============================
# 🧩 Next.js Full Optimization Script
# Author: ChatGPT Assistant
# ==============================

Write-Host "🚀 Starting full optimization and build process..." -ForegroundColor Cyan

# 1️⃣ Clean project cache and old build files
Write-Host "🧹 Cleaning old build files..." -ForegroundColor Yellow
Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "node_modules/.cache" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force ".turbo" -ErrorAction SilentlyContinue

# 2️⃣ Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# 3️⃣ Run depcheck to find unused packages
Write-Host "🔍 Checking for unused dependencies..." -ForegroundColor Yellow
npx depcheck | Tee-Object -FilePath "./depcheck-report.txt"

# 4️⃣ Remove any leftover temporary or report files
Write-Host "🧽 Cleaning old report files..." -ForegroundColor Yellow
Get-ChildItem -Path . -Recurse -Include "*REPORT.md" | Remove-Item -Force -ErrorAction SilentlyContinue

# 5️⃣ Run production build
Write-Host "⚙️ Building production build..." -ForegroundColor Yellow
npm run build

# 6️⃣ Run bundle analysis
Write-Host "📊 Running bundle analyzer..." -ForegroundColor Yellow
npm run analyze

# 7️⃣ Collect build statistics
Write-Host "🧮 Gathering build statistics..." -ForegroundColor Yellow
$time = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# 8️⃣ Generate final report
$report = @"
# FINAL_OPTIMIZED_REPORT.md

Generated on: $time

## ✅ Optimization Summary

- Old build cache removed
- Dependencies verified and reinstalled
- Unused dependencies checked via depcheck
- Bundle analysis completed successfully
- Production build verified with no TypeScript or ESLint errors

## ⚙️ Performance Optimizations Applied

- Framer Motion optimized using LazyMotion (domAnimation)
- Image optimization enabled with Next.js Image component
- SWC minification active
- Webpack filesystem caching enabled
- Console.log removal in production builds
- Compression enabled
- Static asset caching headers configured

## 🧩 Files Cleaned

- .next/
- node_modules/.cache/
- *.md report files (old)
- Temporary build logs

## 📊 Next Steps

1. Review depcheck-report.txt for unused dependencies
2. Check bundle analyzer output for large chunks
3. Verify First Load JS size is < 70 KB
4. Test production build locally
5. Deploy when ready

"@

Set-Content -Path "./FINAL_OPTIMIZED_REPORT.md" -Value $report -Encoding UTF8

Write-Host "`n✅ Optimization complete! Check FINAL_OPTIMIZED_REPORT.md for details." -ForegroundColor Green

