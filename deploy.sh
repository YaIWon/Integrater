#!/bin/bash

# ============================================
# UNIVERSAL INTEGRATOR PRO DEPLOYMENT SCRIPT
# ============================================

echo "🔮 Universal Integrator Pro Deployment"

# Check if gh-pages is installed
if ! command -v gh-pages &> /dev/null; then
    echo "📦 Installing gh-pages..."
    npm install -g gh-pages
fi

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed! dist directory not found."
    exit 1
fi

# Deploy to GitHub Pages
echo "🚀 Deploying to GitHub Pages..."
gh-pages -d dist --no-history

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your site is live at: https://$(git config user.name).github.io/$(basename $(git rev-parse --show-toplevel))/"
else
    echo "❌ Deployment failed!"
    exit 1
fi
