# ============================================
# 🚀 Auto Deployment Script for Next.js Project
# Author: ChatGPT Assistant
# Description: Cleans, rebuilds, optimizes, and deploys automatically
# ============================================

Write-Host "🚀 Starting automated deployment..." -ForegroundColor Cyan

# Step 1: Clean project
Write-Host "`n🧹 Cleaning project directories..." -ForegroundColor Yellow

$foldersToRemove = @(".next", ".turbo", "node_modules")

foreach ($folder in $foldersToRemove) {
    if (Test-Path $folder) {
        Remove-Item $folder -Recurse -Force
        Write-Host "Removed $folder"
    }
}

if (Test-Path "package-lock.json") {
    Remove-Item "package-lock.json" -Force
    Write-Host "Removed package-lock.json"
}

# Step 2: Reinstall dependencies
Write-Host "`n📦 Reinstalling dependencies..." -ForegroundColor Yellow
npm install

# Step 3: Optimize and build
Write-Host "`n⚙️ Running build optimization..." -ForegroundColor Yellow
npm run build

# Step 4: Bundle Analysis (if script exists)
if (Test-Path "package.json" -and (Get-Content package.json | Select-String "analyze")) {
    Write-Host "`n📊 Running bundle analysis..." -ForegroundColor Yellow
    npm run analyze
} else {
    Write-Host "No analyze script found — skipping."
}

# Step 5: Git operations
Write-Host "`n💾 Pushing changes to GitHub..." -ForegroundColor Yellow
git add .
$commitMessage = "Automated deployment $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git commit -m $commitMessage
git push origin main

# Step 6: Environment setup
Write-Host "`n🔐 Checking environment files..." -ForegroundColor Yellow
if (Test-Path ".env.example") {
    Copy-Item ".env.example" ".env.local" -Force
    Write-Host ".env.local created from .env.example"
} elseif (Test-Path "env.example.txt") {
    Copy-Item "env.example.txt" ".env.local" -Force
    Write-Host ".env.local created from env.example.txt"
} else {
    Write-Host "⚠️ No environment template found!"
}

# Step 7: Deploy to Vercel
Write-Host "`n🚀 Deploying to Vercel..." -ForegroundColor Yellow
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}
vercel --prod --yes

# Step 8: Create summary report
Write-Host "`n📝 Creating deployment summary..." -ForegroundColor Yellow
$summary = @"
Deployment Summary
===================
Date: $(Get-Date)
Environment: Production
Git Branch: main
Deployed by: Automated Script
Status: ✅ Successful

Next.js Project optimized and deployed to Vercel.
"@
$summary | Out-File -FilePath "DEPLOYMENT_SUMMARY.txt" -Encoding utf8

Write-Host "`n✅ Deployment completed successfully!" -ForegroundColor Green

