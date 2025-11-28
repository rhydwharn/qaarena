# QA Arena - ISTQB Certification Practice Platform

> A comprehensive, full-stack web application for ISTQB (International Software Testing Qualifications Board) certification exam preparation with interactive quizzes, bug hunting simulations, and progress tracking.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-green.svg)](https://www.mongodb.com/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Core Features](#core-features)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**QA Arena** is a modern, feature-rich platform designed to help software testers prepare for ISTQB certification exams. The platform combines traditional quiz-based learning with interactive bug hunting simulations, providing a comprehensive learning experience.

### Key Highlights

- ✅ **1000+ Practice Questions** across all ISTQB Foundation Level topics
- ✅ **Interactive Bug Hunting** with real-world scenarios and simulators
- ✅ **Smart Quiz System** with resume capability and progress tracking
- ✅ **Excel Bulk Upload** for easy question management
- ✅ **Dynamic Categories** based on uploaded content
- ✅ **Multi-language Support** for questions and options
- ✅ **Gamification** with achievements, leaderboards, and streaks
- ✅ **Mobile Responsive** design for learning on-the-go
- ✅ **Admin Dashboard** for content and user management

---

## ✨ Features

### For Students

#### 📚 **Quiz System**
- **Multiple Quiz Modes**: Practice, Exam, Timed, Category-specific
- **Resume Capability**: Continue quizzes after timeout or refresh
- **Smart Progress Tracking**: Accurate question-by-question progress
- **Instant Feedback**: Immediate answer validation with explanations
- **Question Types**: Single-choice, multiple-choice, true/false
- **Difficulty Levels**: Foundation, Advanced, Expert

#### 🐛 **Bug Hunting Hub**
- **20+ Functional Bug Scenarios** with interactive simulators
- **Real-world Applications**: E-commerce, booking systems, calculators
- **Hands-on Practice**: Find and report bugs in simulated environments
- **Detailed Feedback**: Learn from mistakes with comprehensive explanations
- **Bug Categories**: Functional, UI/UX, Logic, Validation errors

#### 📊 **Progress & Analytics**
- **Detailed Statistics**: Track performance across categories
- **Study Streaks**: Maintain daily learning habits
- **Weak Areas Identification**: Focus on topics needing improvement
- **Category Progress**: Monitor mastery of each ISTQB topic
- **Quiz History**: Review past attempts and scores

#### 🏆 **Gamification**
- **Achievements System**: Unlock badges for milestones
- **Global Leaderboard**: Compete with other learners
- **Category Rankings**: Top performers per topic
- **Points & Rewards**: Earn points for correct answers

### For Administrators

#### 🎛️ **Admin Dashboard**
- **User Management**: View, edit, and manage user accounts
- **Question Management**: CRUD operations for all questions
- **Multi-select Delete**: Bulk delete questions efficiently
- **Flagged Questions**: Review and handle user-reported issues
- **Platform Statistics**: Monitor usage and engagement

#### 📤 **Excel Upload System**
- **Bulk Question Import**: Upload hundreds of questions via Excel
- **Template Download**: Pre-formatted Excel template
- **Validation & Error Reporting**: Detailed feedback on upload issues
- **Separate Option Columns**: Clean, organized question format
- **Category Auto-creation**: Dynamic categories from uploads

#### 📈 **Analytics & Reporting**
- **User Activity**: Track engagement and usage patterns
- **Question Statistics**: View answer rates and difficulty
- **Category Distribution**: Monitor question coverage
- **Performance Metrics**: Platform-wide success rates

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Processing**: xlsx (Excel parsing)
- **Security**: bcryptjs, helmet, express-rate-limit
- **Validation**: express-validator

### Frontend
- **Framework**: React 18+ with Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **UI Components**: Custom components with Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)

### DevOps & Tools
- **Version Control**: Git & GitHub
- **Package Manager**: npm
- **Environment**: dotenv for configuration
- **CORS**: Enabled for cross-origin requests
- **Logging**: Morgan (HTTP request logger)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- MongoDB 6 or higher
- npm or yarn
- Git

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/rhydwharn/qaarena.git
cd qaarena
```

#### 2. Backend Setup
```bash
# Install backend dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
# Required variables:
# - MONGO_URI=mongodb://localhost:27017/qa-arena
# - JWT_SECRET=your-secret-key
# - PORT=5001
# - NODE_ENV=development

# Seed the database with sample data
npm run seed

# Start backend server
npm run dev
```

Backend will run on `http://localhost:5001`

#### 3. Frontend Setup
```bash
# Navigate to client directory
cd client/client

# Install frontend dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with:
# VITE_API_URL=http://localhost:5001/api

# Start frontend development server
npm run dev
```

Frontend will run on `http://localhost:5173`

### Default Credentials

After seeding, you can login with:

**Admin Account:**
- Email: `admin@example.com`
- Password: `Admin123!`

**Test User:**
- Email: `test@example.com`
- Password: `Test123!`

---

## 📁 Project Structure

```
QA_ExamPrep/
├── client/                    # Frontend React application
│   └── client/
│       ├── src/
│       │   ├── components/    # Reusable UI components
│       │   │   ├── ui/        # Base UI components
│       │   │   └── FunctionalBugs/  # Bug simulators
│       │   ├── pages/         # Page components
│       │   │   ├── Dashboard.jsx
│       │   │   ├── Quiz.jsx
│       │   │   ├── Questions.jsx
│       │   │   ├── BugHunting.jsx
│       │   │   ├── Admin.jsx
│       │   │   └── QuestionUpload.jsx
│       │   ├── services/      # API services
│       │   │   ├── api.js
│       │   │   └── categoryService.js
│       │   └── App.jsx        # Main app component
│       ├── public/            # Static assets
│       └── package.json
│
├── controllers/               # Backend controllers
│   ├── authController.js
│   ├── questionController.js
│   ├── quizController.js
│   ├── progressController.js
│   ├── leaderboardController.js
│   ├── achievementController.js
│   ├── adminController.js
│   ├── bugHuntingController.js
│   └── questionUploadController.js
│
├── models/                    # Mongoose models
│   ├── User.js
│   ├── Question.js
│   ├── Quiz.js
│   ├── Progress.js
│   ├── Achievement.js
│   ├── BugScenario.js
│   └── BugSubmission.js
│
├── routes/                    # API routes
│   ├── auth.js
│   ├── questions.js
│   ├── quiz.js
│   ├── progress.js
│   ├── leaderboard.js
│   ├── achievements.js
│   ├── admin.js
│   ├── bugHunting.js
│   └── questionUpload.js
│
├── middleware/                # Custom middleware
│   ├── auth.js               # JWT authentication
│   ├── errorHandler.js       # Error handling
│   └── rateLimiter.js        # Rate limiting
│
├── utils/                     # Utility functions
│   └── errorResponse.js
│
├── scripts/                   # Database scripts
│   └── seedDatabase.js
│
├── server.js                  # Express app entry point
├── package.json
└── README.md
```

---

## 🎓 Core Features

### 1. Quiz System

#### Starting a Quiz
Users can start quizzes from:
- **Dashboard**: Quick start with category selection
- **Questions Page**: Browse questions and start quiz

**Quiz Configuration:**
- Select category (or all categories)
- Choose number of questions (1-100)
- Set difficulty level
- Select quiz mode

#### Quiz Resume Feature
**Problem Solved:** Users can now resume quizzes after:
- Page refresh
- Browser timeout
- Accidental tab close
- Network interruption

**How It Works:**
1. Quiz progress saved after each answer
2. Dashboard shows "Resume Quiz" banner
3. Click resume to continue from last question
4. Previous answers automatically restored
5. Accurate progress tracking (e.g., "2/5 answered")

**Prevention:** Users cannot start new quiz while one is in-progress

#### Quiz Flow
```
Start Quiz → Answer Questions → Submit Each Answer → Complete Quiz → View Results
     ↓              ↓                    ↓                  ↓              ↓
  In-Progress   Progress Saved    Validation Done    Score Calculated  Stats Updated
```

---

### 2. Bug Hunting Hub

#### Available Simulators

**E-commerce Scenarios:**
1. **Shopping Cart** - Cart calculation bugs
2. **Product Ordering** - Order processing issues
3. **Discount System** - Coupon validation errors
4. **Checkout Flow** - Payment processing bugs

**Booking Systems:**
5. **Hotel Booking** - Date validation issues
6. **Flight Booking** - Seat selection bugs
7. **Event Registration** - Capacity validation errors

**Utilities:**
8. **Calculator** - Mathematical operation bugs
9. **Form Validation** - Input validation issues
10. **Search Functionality** - Search result bugs
11. **Countdown Timer** - Timer logic errors
12. **Date Picker** - Date selection issues

**And 8+ more scenarios...**

#### Bug Reporting Flow
```
Select Scenario → Interact with Simulator → Find Bug → Report Bug → Get Feedback
       ↓                    ↓                   ↓            ↓            ↓
   Load Buggy App    Test Functionality   Identify Issue  Submit Report  Learn
```

---

### 3. Question Management

#### Excel Upload System

**Features:**
- Bulk upload via Excel spreadsheet
- Download pre-formatted template
- Separate columns for each option (optionA, optionB, etc.)
- Automatic validation and error reporting
- Dynamic category creation

**Excel Template Format:**
```
| question | optionA | optionB | optionC | optionD | correctAnswer | category | difficulty | explanation | tags | points | type | status |
```

**Validation:**
- Minimum 2 options required
- Correct answer must be valid index (0, 1, 2, 3...)
- Category is required
- Difficulty: foundation, advanced, expert
- Type: single-choice, multiple-choice, true-false
- Status: published, draft, archived, flagged

**Upload Process:**
1. Download template from Admin Dashboard
2. Fill in questions following format
3. Upload Excel file
4. View upload results (success/failed counts)
5. Review error details for failed rows

---

### 4. Dynamic Categories

**How It Works:**
- Categories are NOT hardcoded
- Created automatically from uploaded questions
- API endpoint: `GET /api/questions-upload/categories`
- Used across Dashboard, Questions, and Leaderboard pages

**Benefits:**
- ✅ Flexible content management
- ✅ No code changes needed for new categories
- ✅ Automatic category suggestions
- ✅ Consistent across platform

---

### 5. Progress Tracking

#### Tracked Metrics

**Overall Progress:**
- Total quizzes completed
- Total questions answered
- Correct/incorrect answers
- Average score percentage
- Total time spent studying

**Category Progress:**
- Questions attempted per category
- Questions correct per category
- Average score per category
- Last attempted date

**Study Streak:**
- Current streak (consecutive days)
- Longest streak achieved
- Last study date

**Weak Areas:**
- Categories below 60% accuracy
- Recommended focus areas
- Improvement suggestions

---

### 6. Admin Dashboard

#### User Management
- View all registered users
- See user statistics (quizzes, score, streak)
- Edit user details
- Manage user roles (user/admin)

#### Question Management
- View all questions with filters
- Create new questions manually
- Edit existing questions
- **Multi-select delete** for bulk operations
- Review flagged questions

#### Platform Statistics
- Total users count
- Total questions count
- Active questions count
- Category distribution
- Upload history

---

## 📡 API Documentation

### Base URL
```
http://localhost:5001/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response:
{
  "success": true,
  "token": "jwt-token-here",
  "data": {
    "user": { ... }
  }
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer {token}
```

---

### Question Endpoints

#### Get All Questions
```http
GET /questions?page=1&limit=10&category=fundamentals&difficulty=foundation

Response:
{
  "success": true,
  "data": {
    "questions": [...],
    "total": 100,
    "page": 1,
    "pages": 10
  }
}
```

#### Create Question (Admin)
```http
POST /questions
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "questionText": { "en": "What is testing?" },
  "options": [
    { "text": { "en": "Finding bugs" }, "isCorrect": true },
    { "text": { "en": "Writing code" }, "isCorrect": false }
  ],
  "category": "fundamentals",
  "difficulty": "foundation",
  "type": "single-choice"
}
```

#### Update Question
```http
PUT /questions/:id
Authorization: Bearer {token}
```

#### Delete Question
```http
DELETE /questions/:id
Authorization: Bearer {admin-token}
```

---

### Quiz Endpoints

#### Start Quiz
```http
POST /quiz/start
Authorization: Bearer {token}
Content-Type: application/json

{
  "mode": "practice",
  "category": "fundamentals",
  "numberOfQuestions": 10,
  "difficulty": "foundation"
}

Response:
{
  "success": true,
  "data": {
    "quiz": {
      "_id": "quiz-id",
      "questions": [...],
      "status": "in-progress"
    }
  }
}
```

#### Get In-Progress Quiz
```http
GET /quiz/in-progress
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "quiz": { ... } or null
  }
}
```

#### Answer Question
```http
POST /quiz/answer
Authorization: Bearer {token}
Content-Type: application/json

{
  "quizId": "quiz-id",
  "questionId": "question-id",
  "answer": 0,
  "timeSpent": 15
}
```

#### Complete Quiz
```http
POST /quiz/:id/complete
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Quiz completed! You scored 80%",
  "data": {
    "quiz": {
      "score": {
        "correct": 8,
        "incorrect": 2,
        "percentage": 80
      }
    }
  }
}
```

#### Get Quiz History
```http
GET /quiz/user/history?page=1&limit=10&status=completed
Authorization: Bearer {token}
```

---

### Progress Endpoints

#### Get User Progress
```http
GET /progress
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "progress": {
      "totalQuizzes": 25,
      "totalQuestions": 250,
      "correctAnswers": 200,
      "averageScore": 80,
      "categoryProgress": [...],
      "weakAreas": [...]
    }
  }
}
```

#### Get Study Streak
```http
GET /progress/streak
Authorization: Bearer {token}
```

#### Get Category Progress
```http
GET /progress/categories
Authorization: Bearer {token}
```

---

### Leaderboard Endpoints

#### Get Global Leaderboard
```http
GET /leaderboard/global?limit=100

Response:
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "username": "topuser",
        "totalScore": 9500,
        "averageScore": 95,
        "totalQuizzes": 100
      }
    ]
  }
}
```

#### Get Category Leaderboard
```http
GET /leaderboard/category/:category?limit=50
```

#### Get User Rank
```http
GET /leaderboard/rank
Authorization: Bearer {token}
```

---

### Admin Endpoints

#### Get Platform Statistics
```http
GET /admin/stats
Authorization: Bearer {admin-token}

Response:
{
  "success": true,
  "data": {
    "totalUsers": 1500,
    "totalQuestions": 1200,
    "activeQuestions": 1150,
    "totalQuizzes": 5000
  }
}
```

#### Get All Users
```http
GET /admin/users?page=1&limit=20
Authorization: Bearer {admin-token}
```

#### Get Flagged Questions
```http
GET /admin/questions/flagged
Authorization: Bearer {admin-token}
```

---

### Question Upload Endpoints

#### Upload Excel File
```http
POST /questions-upload/upload
Authorization: Bearer {admin-token}
Content-Type: multipart/form-data

file: questions.xlsx

Response:
{
  "success": true,
  "data": {
    "total": 100,
    "successful": 95,
    "failed": 5,
    "errors": [...]
  }
}
```

#### Download Template
```http
GET /questions-upload/template
Authorization: Bearer {admin-token}

Response: Excel file download
```

#### Get Upload Statistics
```http
GET /questions-upload/stats
Authorization: Bearer {admin-token}
```

#### Get Categories
```http
GET /questions-upload/categories

Response:
{
  "success": true,
  "data": {
    "categories": ["fundamentals", "testing-sdlc", ...]
  }
}
```

---

### Bug Hunting Endpoints

#### Get All Scenarios
```http
GET /bug-hunting/scenarios

Response:
{
  "success": true,
  "data": {
    "scenarios": [
      {
        "_id": "scenario-id",
        "title": "Shopping Cart Bug",
        "description": "Find calculation errors",
        "difficulty": "medium",
        "category": "functional"
      }
    ]
  }
}
```

#### Submit Bug Report
```http
POST /bug-hunting/submit
Authorization: Bearer {token}
Content-Type: application/json

{
  "scenarioId": "scenario-id",
  "bugDescription": "Cart total incorrect when...",
  "stepsToReproduce": "1. Add item\n2. Apply discount\n3. Check total",
  "expectedBehavior": "Total should be $80",
  "actualBehavior": "Total shows $100"
}
```

---

## 👥 User Roles

### Regular User
**Permissions:**
- Take quizzes
- View questions
- Track progress
- Participate in bug hunting
- View leaderboards
- Earn achievements

**Restrictions:**
- Cannot create/edit/delete questions
- Cannot access admin dashboard
- Cannot upload questions
- Cannot manage users

### Administrator
**All User Permissions PLUS:**
- Access admin dashboard
- Create/edit/delete questions
- Upload questions via Excel
- Manage users
- View platform statistics
- Review flagged questions
- Multi-select delete questions

---

## 🚢 Deployment

### Environment Variables

#### Backend (.env)
```env
# Server
NODE_ENV=production
PORT=5001

# Database
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/qa-arena

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=30d

# CORS
CLIENT_URL=https://your-frontend-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend (.env)
```env
VITE_API_URL=https://your-backend-domain.com/api
```

### Deployment Steps

#### Backend (Node.js)

**Option 1: Heroku**
```bash
# Install Heroku CLI
heroku login
heroku create qa-arena-api

# Set environment variables
heroku config:set MONGO_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-secret

# Deploy
git push heroku main
```

**Option 2: Railway/Render**
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push

#### Frontend (React)

**Option 1: Vercel**
```bash
# Install Vercel CLI
npm i -g vercel
cd client/client

# Deploy
vercel --prod
```

**Option 2: Netlify**
```bash
# Build
npm run build

# Deploy dist folder
netlify deploy --prod --dir=dist
```

### Database

**MongoDB Atlas** (Recommended)
1. Create cluster at mongodb.com
2. Whitelist IP addresses
3. Create database user
4. Get connection string
5. Add to MONGO_URI

---

## 🔒 Security Features

- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Password Hashing** - bcrypt with salt rounds
- ✅ **Rate Limiting** - Prevent brute force attacks
- ✅ **CORS Protection** - Configured allowed origins
- ✅ **Input Validation** - Sanitize all inputs
- ✅ **Role-Based Access** - Admin vs User permissions
- ✅ **Helmet.js** - Security headers
- ✅ **Environment Variables** - Sensitive data protection

---

## 🧪 Testing

### Run Tests
```bash
# Backend tests
npm test

# Frontend tests
cd client/client
npm test

# E2E tests
npm run test:e2e
```

### Test Coverage
```bash
npm run test:coverage
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Coding Standards
- Use ESLint configuration
- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Ridwan Abdulazeez**
- GitHub: [@rhydwharn](https://github.com/rhydwharn)

---

## 🙏 Acknowledgments

- ISTQB for certification standards
- Open source community
- All contributors and testers

---

## 📞 Support

For support, email support@qaarena.com or open an issue on GitHub.

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### **Issue 1: Token Expired During Quiz**

**Problem:** Users get "Token is invalid or expired" error while taking quizzes.

**Solution:**
1. Update `JWT_EXPIRE` in your `.env` file:
   ```bash
   JWT_EXPIRE=7d  # Change from 10m to 7d
   ```
2. For production, update environment variable in hosting dashboard (Render/Heroku/Railway)
3. Restart server

**Why:** Default 10-minute expiration is too short for quiz sessions.

---

#### **Issue 2: Production Using Localhost API**

**Problem:** Frontend on production calls `http://localhost:5001/api` instead of production backend.

**Solution:**

**Method 1 (Recommended):** Set environment variable in hosting platform
- Vercel/Netlify/Render: Add `VITE_API_URL=https://your-backend-url.com/api`

**Method 2:** Update `.env.production` file
```bash
# client/client/.env.production
VITE_API_URL=https://your-backend-url.com/api
```

Then commit and push:
```bash
git add client/client/.env.production
git commit -m "fix: Configure production API URL"
git push origin main
```

---

#### **Issue 3: CORS Errors**

**Problem:** Frontend can't connect to backend due to CORS policy.

**Solution:** Update `server.js` CORS configuration:
```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend-url.vercel.app',
    'https://your-frontend-url.netlify.app'
  ],
  credentials: true
}));
```

---

#### **Issue 4: MongoDB Connection Failed**

**Problem:** Backend can't connect to MongoDB.

**Solution:**
1. Check `MONGODB_URI` in `.env`
2. Verify MongoDB Atlas IP whitelist (allow `0.0.0.0/0` for production)
3. Ensure database user has correct permissions
4. Check network connectivity

---

#### **Issue 5: Build Fails on Production**

**Problem:** Frontend build fails during deployment.

**Solution:**
1. Check build logs for specific errors
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version compatibility
4. Clear build cache and retry
5. Check environment variables are set

---

#### **Issue 6: Questions Not Loading**

**Problem:** Questions page shows empty or loading indefinitely.

**Solution:**
1. Check browser console for errors
2. Verify API endpoint is accessible
3. Check if questions exist in database
4. Verify user authentication token
5. Check network tab for failed requests

---

### Quick Deployment Commands

```bash
# Update production with latest changes
git add .
git commit -m "feat: Your changes description"
git push origin main

# Force redeploy (if auto-deploy not working)
git commit --allow-empty -m "chore: trigger deployment"
git push origin main

# Check environment variables
# Local: cat .env
# Production: Check hosting dashboard

# Restart local server
npm run dev

# Test production API
curl https://your-backend-url.com/api/health
```

---

### Environment Variables Checklist

**Backend (.env):**
```bash
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
CORS_ORIGIN=https://your-frontend-url.com
```

**Frontend (client/client/.env.production):**
```bash
VITE_API_URL=https://your-backend-url.com/api
```

---

## 🗺️ Roadmap

### Upcoming Features
- [ ] Mobile app (React Native)
- [ ] AI-powered question recommendations
- [ ] Video explanations for questions
- [ ] Study groups and collaboration
- [ ] Advanced analytics dashboard
- [ ] Multi-language interface
- [ ] Offline mode support
- [ ] Export progress reports (PDF)

---

## 📊 Project Stats

- **Total Questions**: 1000+
- **Bug Scenarios**: 20+
- **API Endpoints**: 40+
- **Code Lines**: 15,000+
- **Active Users**: Growing daily!

---

**Made with ❤️ for the QA community**
