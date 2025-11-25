#!/bin/bash
# Backend Deployment Preparation Script
# This script prepares your backend files for deployment to shared hosting

echo "🚀 Preparing QA Unplugged Haven Backend for Deployment..."
echo ""

# Create deployment directory
echo "📁 Creating deployment directory..."
rm -rf backend-deploy
mkdir backend-deploy

# Copy required files
echo "📦 Copying core files..."
cp server.js backend-deploy/
cp package.json backend-deploy/
cp package-lock.json backend-deploy/
cp README.md backend-deploy/

# Copy directories
echo "📂 Copying application directories..."
cp -r config backend-deploy/
cp -r controllers backend-deploy/
cp -r middleware backend-deploy/
cp -r models backend-deploy/
cp -r routes backend-deploy/
cp -r utils backend-deploy/
cp -r scripts backend-deploy/

# Create .env template
echo "📝 Creating .env template..."
cat > backend-deploy/.env.example << 'EOF'
# Server Configuration
NODE_ENV=production
PORT=5001

# MongoDB Configuration (IMPORTANT: Use your production database)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/qa_exam_prep?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Admin Credentials
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=SecureAdminPassword123!

# CORS Configuration (Your frontend URL)
CLIENT_URL=https://yourfrontend.com

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
EOF

# Create deployment README
cat > backend-deploy/DEPLOY_README.md << 'EOF'
# Quick Deployment Guide

## 1. Upload Files
Upload all files in this folder to your shared hosting server.

## 2. Configure Environment
Create `.env` file on the server using `.env.example` as template:
```bash
nano .env
# Copy contents from .env.example and update with your values
```

## 3. Install Dependencies
```bash
npm install --production
```

## 4. Seed Database (First Time Only)
```bash
npm run seed
```

## 5. Start Application
```bash
# Option A: Direct
node server.js

# Option B: With PM2 (Recommended)
pm2 start server.js --name "qa-backend"
pm2 save
```

## 6. Verify
Test your API:
```bash
curl https://yourbackend.com/api/health
```

## Important Notes
- Update MONGODB_URI to your production database
- Change JWT_SECRET to a strong random string
- Set CLIENT_URL to your frontend domain
- Whitelist your server IP in MongoDB Atlas

For detailed instructions, see DEPLOYMENT_GUIDE.md in the main project folder.
EOF

# Create file list
echo "📋 Creating file list..."
cat > backend-deploy/FILES_INCLUDED.txt << 'EOF'
Files Included in This Deployment Package:
==========================================

Core Files:
- server.js                 (Main application entry point)
- package.json             (Dependencies and scripts)
- package-lock.json        (Exact dependency versions)
- README.md                (Project documentation)

Configuration:
- .env.example             (Environment variables template)
- config/db.js            (Database connection)

Controllers (Business Logic):
- controllers/authController.js
- controllers/quizController.js
- controllers/questionController.js
- controllers/progressController.js
- controllers/leaderboardController.js
- controllers/achievementController.js
- controllers/adminController.js

Middleware:
- middleware/auth.js              (Authentication)
- middleware/errorHandler.js      (Error handling)
- middleware/rateLimiter.js       (Rate limiting)
- middleware/validation.js        (Input validation)

Models (Database Schemas):
- models/User.js
- models/Question.js
- models/Quiz.js
- models/Progress.js
- models/Achievement.js

Routes (API Endpoints):
- routes/auth.js
- routes/quiz.js
- routes/questions.js
- routes/progress.js
- routes/leaderboard.js
- routes/achievements.js
- routes/admin.js

Utilities:
- utils/helpers.js
- utils/validators.js
- utils/constants.js

Scripts (Database Management):
- scripts/seedDatabase.js
- scripts/verifyAndFixDatabase.js
- scripts/fixQuestionText.js
- scripts/fixNestedMaps.js
- scripts/testQuestionRetrieval.js

Documentation:
- DEPLOY_README.md         (Quick deployment guide)
- FILES_INCLUDED.txt       (This file)

NOT Included (Install on Server):
- node_modules/            (Run: npm install --production)
- .env                     (Create from .env.example)

Total Files: ~40 files
Estimated Size: ~150 KB (without node_modules)
After npm install: ~50-100 MB
EOF

echo ""
echo "✅ Deployment package ready!"
echo ""
echo "📊 Package Contents:"
echo "   Location: ./backend-deploy/"
echo "   Total size: $(du -sh backend-deploy/ | cut -f1)"
echo ""
echo "📁 Files included:"
find backend-deploy -type f | wc -l | xargs echo "   Total files:"
echo ""
echo "📋 Next Steps:"
echo "   1. Review files in backend-deploy/ folder"
echo "   2. Compress for upload: cd backend-deploy && tar -czf ../backend.tar.gz *"
echo "   3. Upload to your shared hosting via FTP/SFTP"
echo "   4. SSH into server and extract: tar -xzf backend.tar.gz"
echo "   5. Create .env file (use .env.example as template)"
echo "   6. Run: npm install --production"
echo "   7. Run: npm run seed (first time only)"
echo "   8. Start: node server.js or pm2 start server.js"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md"
echo ""
echo "🎉 Ready to deploy!"
