#!/bin/bash

# Deploy to production server
# Usage: ./scripts/deploy-production.sh

set -e

SERVER="root@188.137.65.235"
APP_PATH="/var/www/vhosts/imegamobile.com/tienda.esix.online"

echo "🚀 Deploying to production..."

# Check if there are uncommitted changes
if [[ -n $(git status --porcelain) ]]; then
    echo "⚠️  You have uncommitted changes. Commit them first."
    exit 1
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

# Deploy on server
echo "🔄 Running deploy script on server..."
ssh $SERVER "$APP_PATH/deploy.sh"

echo "✅ Deploy completed!"
echo "🌐 Check: https://tienda.esix.online"
