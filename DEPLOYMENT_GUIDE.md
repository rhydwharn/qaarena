# Backend Deployment Guide - Shared Hosting

## 📦 Files to Copy to Shared Hosting

### ✅ REQUIRED FILES (Must Copy)

#### 1. **Core Application Files**
```
server.js                    # Main entry point
package.json                 # Dependencies and scripts
package-lock.json            # Exact dependency versions
```

#### 2. **Application Directories**
```
config/                      # Configuration files
  └── db.js                 # Database connection

controllers/                 # Business logic
  ├── authController.js
  ├── quizController.js
  ├── questionController.js
  ├── progressController.js
  ├── leaderboardController.js
  ├── achievementController.js
  └── adminController.js

middleware/                  # Express middleware
  ├── auth.js               # Authentication middleware
  ├── errorHandler.js       # Error handling
  ├── rateLimiter.js        # Rate limiting
  └── validation.js         # Input validation

models/                      # Database schemas
  ├── User.js
  ├── Question.js
  ├── Quiz.js
  ├── Progress.js
  └── Achievement.js

routes/                      # API routes
  ├── auth.js
  ├── quiz.js
  ├── questions.js
  ├── progress.js
  ├── leaderboard.js
  ├── achievements.js
  └── admin.js

utils/                       # Utility functions
  ├── helpers.js
  ├── validators.js
  └── constants.js
```

#### 3. **Environment Configuration**
```
.env                        # ⚠️ CREATE NEW on server (don't copy from local)
```

#### 4. **Optional but Recommended**
```
scripts/                    # Database scripts
  ├── seedDatabase.js       # Initial data seeding
  ├── verifyAndFixDatabase.js
  └── fixQuestionText.js

README.md                   # Documentation
```

---

## ❌ DO NOT COPY (Excluded Files)

```
node_modules/              # Will be installed on server
client/                    # Frontend (deploy separately)
coverage/                  # Test coverage reports
tests/                     # Test files (optional)
.git/                      # Git repository
.vscode/                   # IDE settings
.DS_Store                  # Mac OS files
*.log                      # Log files
.env.local                 # Local environment
uploads/                   # User uploads (if any)
tmp/                       # Temporary files
*.md files                 # Documentation (optional)
*.docx, *.xlsx            # Documentation files
*.py                       # Python scripts
```

---

## 📋 Deployment Checklist

### Step 1: Prepare Files for Upload

Create a deployment folder with only required files:

```bash
# Create deployment folder
mkdir backend-deploy

# Copy required files
cp server.js backend-deploy/
cp package.json backend-deploy/
cp package-lock.json backend-deploy/

# Copy directories
cp -r config backend-deploy/
cp -r controllers backend-deploy/
cp -r middleware backend-deploy/
cp -r models backend-deploy/
cp -r routes backend-deploy/
cp -r utils backend-deploy/
cp -r scripts backend-deploy/  # Optional

# Copy documentation (optional)
cp README.md backend-deploy/
```

### Step 2: Upload to Shared Hosting

**Via FTP/SFTP:**
1. Connect to your hosting via FTP client (FileZilla, Cyberduck, etc.)
2. Navigate to your application directory (e.g., `/home/username/app`)
3. Upload all files from `backend-deploy/` folder
4. Preserve directory structure

**Via SSH (if available):**
```bash
# Compress files locally
cd backend-deploy
tar -czf backend.tar.gz *

# Upload via SCP
scp backend.tar.gz username@yourhost.com:/home/username/app/

# SSH into server and extract
ssh username@yourhost.com
cd /home/username/app
tar -xzf backend.tar.gz
rm backend.tar.gz
```

### Step 3: Configure Environment on Server

**Create `.env` file on the server:**

```bash
# SSH into server
ssh username@yourhost.com

# Navigate to app directory
cd /home/username/app

# Create .env file
nano .env
```

**Add the following configuration:**

```env
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
```

**⚠️ IMPORTANT:** 
- Use PRODUCTION MongoDB URI (not local)
- Generate a strong JWT_SECRET
- Set strong ADMIN_PASSWORD
- Update CLIENT_URL to your actual frontend domain

### Step 4: Install Dependencies on Server

```bash
# SSH into server
ssh username@yourhost.com
cd /home/username/app

# Install Node.js dependencies
npm install --production

# This installs only production dependencies (excludes devDependencies)
```

### Step 5: Seed Database (First Time Only)

```bash
# Only run this on first deployment
npm run seed

# Or manually:
node scripts/seedDatabase.js
```

### Step 6: Start the Application

**Option A: Using Node directly**
```bash
node server.js
```

**Option B: Using PM2 (Recommended for production)**
```bash
# Install PM2 globally (if not already installed)
npm install -g pm2

# Start application with PM2
pm2 start server.js --name "qa-backend"

# Save PM2 configuration
pm2 save

# Setup PM2 to start on server reboot
pm2 startup
```

**Option C: Using your hosting's control panel**
- Many shared hosting providers have Node.js application managers
- Use their interface to start the application
- Set entry point to `server.js`
- Set environment to `production`

### Step 7: Verify Deployment

**Test the API:**
```bash
# Health check
curl https://yourbackend.com/api/health

# Test authentication
curl -X POST https://yourbackend.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

---

## 🔧 Shared Hosting Specific Considerations

### 1. **Node.js Version**
- Ensure your hosting supports Node.js 18+
- Check with: `node --version`
- Update if necessary via hosting control panel

### 2. **Port Configuration**
- Some shared hosting requires specific ports
- Check your hosting documentation
- Update `PORT` in `.env` accordingly

### 3. **Process Management**
- Shared hosting may restart your app periodically
- Use PM2 or hosting's built-in process manager
- Ensure app restarts automatically

### 4. **File Permissions**
```bash
# Set correct permissions
chmod 755 server.js
chmod -R 755 controllers/ middleware/ models/ routes/ utils/
chmod 600 .env  # Restrict .env access
```

### 5. **Database Connection**
- Use MongoDB Atlas (cloud) for production
- Don't use local MongoDB on shared hosting
- Whitelist your server's IP in MongoDB Atlas

### 6. **Memory Limits**
- Shared hosting often has memory limits
- Monitor with: `pm2 monit`
- Optimize if needed

---

## 📁 Final Directory Structure on Server

```
/home/username/app/
├── server.js
├── package.json
├── package-lock.json
├── .env                    # Created on server
├── node_modules/           # Installed on server
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── quizController.js
│   ├── questionController.js
│   ├── progressController.js
│   ├── leaderboardController.js
│   ├── achievementController.js
│   └── adminController.js
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   ├── rateLimiter.js
│   └── validation.js
├── models/
│   ├── User.js
│   ├── Question.js
│   ├── Quiz.js
│   ├── Progress.js
│   └── Achievement.js
├── routes/
│   ├── auth.js
│   ├── quiz.js
│   ├── questions.js
│   ├── progress.js
│   ├── leaderboard.js
│   ├── achievements.js
│   └── admin.js
├── utils/
│   ├── helpers.js
│   ├── validators.js
│   └── constants.js
└── scripts/               # Optional
    ├── seedDatabase.js
    └── verifyAndFixDatabase.js
```

---

## 🚀 Quick Deployment Script

Create this script locally to automate file preparation:

```bash
#!/bin/bash
# deploy-prepare.sh

echo "🚀 Preparing backend for deployment..."

# Create deployment directory
rm -rf backend-deploy
mkdir backend-deploy

# Copy required files
echo "📦 Copying files..."
cp server.js backend-deploy/
cp package.json backend-deploy/
cp package-lock.json backend-deploy/
cp README.md backend-deploy/

# Copy directories
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
NODE_ENV=production
PORT=5001
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-admin-password
CLIENT_URL=https://yourfrontend.com
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
EOF

# Create README for deployment
cat > backend-deploy/DEPLOY_README.md << 'EOF'
# Deployment Instructions

1. Upload all files to your server
2. Create .env file (use .env.example as template)
3. Run: npm install --production
4. Run: npm run seed (first time only)
5. Start: node server.js or pm2 start server.js

See full guide in DEPLOYMENT_GUIDE.md
EOF

echo "✅ Deployment package ready in backend-deploy/"
echo "📊 Total size:"
du -sh backend-deploy/

echo ""
echo "Next steps:"
echo "1. Review files in backend-deploy/"
echo "2. Upload to your shared hosting"
echo "3. Configure .env on server"
echo "4. Run npm install --production"
echo "5. Start the application"
```

**Make it executable and run:**
```bash
chmod +x deploy-prepare.sh
./deploy-prepare.sh
```

---

## 📊 Estimated File Sizes

```
server.js                ~2 KB
package.json            ~1 KB
config/                 ~1 KB
controllers/            ~50 KB
middleware/             ~15 KB
models/                 ~25 KB
routes/                 ~20 KB
utils/                  ~10 KB
scripts/                ~30 KB
--------------------------------
Total (without node_modules): ~154 KB

node_modules/ (after npm install): ~50-100 MB
```

---

## ⚠️ Security Checklist

Before deploying:

- [ ] Changed JWT_SECRET from default
- [ ] Set strong ADMIN_PASSWORD
- [ ] Updated MONGODB_URI to production database
- [ ] Set CLIENT_URL to actual frontend domain
- [ ] Removed all console.log with sensitive data
- [ ] Set NODE_ENV=production
- [ ] Configured CORS properly
- [ ] Enabled rate limiting
- [ ] Set proper file permissions (.env = 600)
- [ ] Whitelisted server IP in MongoDB Atlas
- [ ] Tested all API endpoints
- [ ] Verified database connection

---

## 🆘 Troubleshooting

### App won't start
```bash
# Check Node.js version
node --version  # Should be 18+

# Check logs
pm2 logs qa-backend

# Check if port is in use
lsof -i :5001
```

### Database connection fails
```bash
# Test MongoDB connection
node -e "require('./config/db').connectDB()"

# Check if IP is whitelisted in MongoDB Atlas
# Verify MONGODB_URI in .env
```

### Permission denied errors
```bash
# Fix permissions
chmod 755 server.js
chmod -R 755 controllers/ middleware/ models/ routes/
chmod 600 .env
```

---

## 📞 Support

If you encounter issues:
1. Check server logs: `pm2 logs` or hosting control panel
2. Verify .env configuration
3. Test database connection
4. Check Node.js version compatibility
5. Review hosting provider's Node.js documentation

---

**Last Updated:** November 25, 2025  
**Status:** Production Ready  
**Deployment Type:** Shared Hosting
