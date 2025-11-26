#!/bin/bash

echo "🚀 QA Arena - Deploy to Production"
echo "===================================="
echo ""

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"
echo ""

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo "⚠️  You have uncommitted changes!"
    echo ""
    git status --short
    echo ""
    read -p "Do you want to commit these changes? (y/n): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        read -p "Enter commit message: " COMMIT_MSG
        
        if [ -z "$COMMIT_MSG" ]; then
            COMMIT_MSG="Update: Documentation and feature improvements"
        fi
        
        echo ""
        echo "📦 Staging all changes..."
        git add .
        
        echo "💾 Committing changes..."
        git commit -m "$COMMIT_MSG"
        
        echo "✅ Changes committed!"
        echo ""
    else
        echo "❌ Deployment cancelled. Please commit your changes first."
        exit 1
    fi
fi

# Ensure we're on main branch
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  You're not on the main branch!"
    read -p "Switch to main branch? (y/n): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🔄 Switching to main branch..."
        git checkout main
        echo "✅ Switched to main"
        echo ""
    else
        echo "❌ Deployment cancelled."
        exit 1
    fi
fi

# Pull latest changes from remote
echo "⬇️  Pulling latest changes from remote..."
git pull origin main

if [ $? -ne 0 ]; then
    echo "❌ Failed to pull from remote. Please resolve conflicts."
    exit 1
fi

echo "✅ Local branch is up to date"
echo ""

# Push to remote
echo "⬆️  Pushing changes to remote repository..."
git push origin main

if [ $? -ne 0 ]; then
    echo "❌ Failed to push to remote."
    exit 1
fi

echo "✅ Changes pushed to remote!"
echo ""

# Deployment instructions
echo "📋 Next Steps for Production Deployment:"
echo ""
echo "1️⃣  Backend Deployment (if using Render/Heroku/Railway):"
echo "   - Your hosting platform should auto-deploy from main branch"
echo "   - Or manually trigger deployment from your hosting dashboard"
echo "   - Check deployment logs for any errors"
echo ""
echo "2️⃣  Frontend Deployment (if using Vercel/Netlify):"
echo "   - Your hosting platform should auto-deploy from main branch"
echo "   - Or manually trigger deployment from your hosting dashboard"
echo "   - Verify build succeeds"
echo ""
echo "3️⃣  Verify Deployment:"
echo "   - Check your production URL"
echo "   - Test quiz resume feature"
echo "   - Test question upload"
echo "   - Verify all features work"
echo ""
echo "4️⃣  Database Migrations (if needed):"
echo "   - No schema changes detected"
echo "   - Existing data should work fine"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  WARNING: .env file not found!"
    echo "   Make sure your production environment has all required variables:"
    echo "   - MONGO_URI"
    echo "   - JWT_SECRET"
    echo "   - NODE_ENV=production"
    echo ""
fi

echo "✅ Deployment preparation complete!"
echo ""
echo "🌐 Your changes are now on GitHub."
echo "   Production will auto-deploy if configured."
echo ""
