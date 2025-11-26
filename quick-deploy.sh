#!/bin/bash

echo "🚀 QA Arena - Quick Deploy to Production"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: ${GREEN}$CURRENT_BRANCH${NC}"

if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "${YELLOW}⚠️  Warning: You're not on the main branch!${NC}"
    echo "Switching to main..."
    git checkout main
fi

echo ""

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo "${YELLOW}⚠️  Uncommitted changes detected:${NC}"
    git status --short
    echo ""
    
    read -p "Commit these changes? (y/n): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Commit message: " COMMIT_MSG
        
        if [ -z "$COMMIT_MSG" ]; then
            COMMIT_MSG="Update: Latest features and improvements"
        fi
        
        git add .
        git commit -m "$COMMIT_MSG"
        echo "${GREEN}✅ Changes committed${NC}"
    else
        echo "${RED}❌ Deployment cancelled${NC}"
        exit 1
    fi
fi

echo ""
echo "⬆️  Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "${GREEN}✅ Successfully pushed to GitHub!${NC}"
    echo ""
    echo "📋 Next steps:"
    echo "1. Check your hosting dashboard for deployment status"
    echo "2. Wait 5-10 minutes for deployment to complete"
    echo "3. Test your production URL"
    echo ""
    echo "🔗 Common hosting dashboards:"
    echo "   • Render: https://dashboard.render.com"
    echo "   • Heroku: https://dashboard.heroku.com"
    echo "   • Railway: https://railway.app"
    echo "   • Vercel: https://vercel.com/dashboard"
    echo "   • Netlify: https://app.netlify.com"
    echo ""
else
    echo "${RED}❌ Failed to push to GitHub${NC}"
    echo "Please check your internet connection and try again"
    exit 1
fi
