# Software Requirements Document (SRD)

## QA Arena - ISTQB Certification Practice Platform

---

**Document Version:** 2.0  
**Date:** November 26, 2024  
**Project Name:** QA Arena  
**Project Type:** Full-Stack Web Application  
**Status:** Production Ready  

**Prepared By:** Development Team  
**Organization:** QA Arena  

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Overview](#2-system-overview)
3. [Functional Requirements](#3-functional-requirements)
4. [Non-Functional Requirements](#4-non-functional-requirements)
5. [System Architecture](#5-system-architecture)
6. [Data Models](#6-data-models)
7. [API Specifications](#7-api-specifications)
8. [Security & Performance](#8-security--performance)

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Document specifies the complete functional and non-functional requirements for QA Arena - a comprehensive web-based platform for ISTQB certification exam preparation.

### 1.2 Scope

**System Name:** QA Arena - ISTQB Certification Practice Platform

**Primary Functions:**
- Interactive quiz-based learning system (1000+ questions)
- Bug hunting simulation environment (20+ scenarios)
- Progress tracking and analytics
- Gamification with achievements and leaderboards
- Administrative content management
- Bulk question upload via Excel

**Target Users:**
- ISTQB certification candidates
- Software testing professionals
- QA engineers
- Platform administrators

### 1.3 Definitions

- **ISTQB**: International Software Testing Qualifications Board
- **JWT**: JSON Web Token for authentication
- **API**: Application Programming Interface
- **Quiz Resume**: Ability to continue incomplete quizzes
- **Study Streak**: Consecutive days of platform usage
- **Bug Hunting**: Interactive scenarios for finding software defects

---

## 2. System Overview

### 2.1 System Description

QA Arena is a full-stack web application combining traditional quiz-based learning with innovative bug hunting simulations for ISTQB exam preparation.

**Core Capabilities:**

1. **Quiz Management System**
   - Customized quizzes from 1000+ questions
   - Multiple modes (practice, exam, timed)
   - Resume incomplete quizzes
   - Instant feedback with explanations

2. **Bug Hunting Hub**
   - 20+ interactive bug scenarios
   - Real-world application simulators
   - Hands-on defect identification
   - Detailed feedback

3. **Progress Analytics**
   - Performance tracking
   - Category-wise breakdown
   - Weak area identification
   - Study streak monitoring

4. **Gamification**
   - Achievement system
   - Global and category leaderboards
   - Points and ranking

5. **Administrative Tools**
   - Question management (CRUD)
   - Excel bulk upload
   - User management
   - Platform analytics

### 2.2 Technology Stack

**Frontend:**
- React 18+ with Vite
- React Router v6
- Axios for API calls
- Tailwind CSS for styling
- Lucide React for icons

**Backend:**
- Node.js 18+
- Express.js 4+
- MongoDB 6+ with Mongoose
- JWT authentication
- bcryptjs for password hashing
- xlsx for Excel processing

**Security & Middleware:**
- helmet (security headers)
- express-rate-limit (API protection)
- CORS configuration
- express-validator (input validation)

### 2.3 System Architecture

```
┌─────────────────────────────────────────┐
│     Presentation Layer (React SPA)      │
│  - User Interface Components            │
│  - State Management (Hooks)             │
│  - API Communication                    │
└──────────────┬──────────────────────────┘
               │ HTTPS/REST API
┌──────────────▼──────────────────────────┐
│   Application Layer (Express.js)        │
│  - Authentication & Authorization       │
│  - Business Logic                       │
│  - Request Routing                      │
│  - File Processing                      │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Data Layer (MongoDB)               │
│  - User Data                            │
│  - Question Bank                        │
│  - Quiz Sessions                        │
│  - Progress Records                     │
└─────────────────────────────────────────┘
```

---

## 3. Functional Requirements

### 3.1 User Management

**FR-UM-001: User Registration**
- Users can create accounts with username, email, password
- Email must be unique
- Password requirements: min 6 chars, 1 uppercase, 1 number, 1 special character
- Password hashed with bcrypt
- Default role: 'user'
- JWT token issued upon registration

**FR-UM-002: User Authentication**
- Login with email and password
- JWT token generated (30-day expiry)
- Token-based session management
- Logout functionality

**FR-UM-003: Role-Based Access**
- Two roles: 'user' and 'admin'
- Admin routes protected
- Role verification on each request

### 3.2 Question Management

**FR-QM-001: Create Question (Admin)**
- Question text with multi-language support
- Minimum 2 options, maximum 4
- Correct answer index (0-3)
- Category (required)
- Difficulty: foundation, advanced, expert
- Type: single-choice, multiple-choice, true-false
- Explanation text
- Tags (optional)
- Status: published, draft, archived, flagged

**FR-QM-002: View Questions**
- Pagination support
- Filters: category, difficulty, search text
- Only published questions shown to users
- Admins see all statuses

**FR-QM-003: Update Question (Admin)**
- Edit all question fields
- Validation applied
- Version history maintained

**FR-QM-004: Delete Question (Admin)**
- Single delete
- Multi-select bulk delete
- Confirmation required
- Audit trail logged

**FR-QM-005: Flag Question (User)**
- Users can report problematic questions
- Reason required
- Status changed to 'flagged'
- Admin notification

### 3.3 Quiz System

**FR-QZ-001: Start Quiz**
- Select mode: practice, exam, timed
- Select category (or all categories)
- Select difficulty
- Choose number of questions (1-100)
- **Validation**: Cannot start new quiz if one is in-progress
- Random question selection
- No duplicate questions
- Quiz status: 'in-progress'

**FR-QZ-002: Answer Question**
- Submit answer for each question
- Immediate validation
- Answer saved to database
- Time tracking per question
- Can change answer before completion

**FR-QZ-003: Complete Quiz**
- All questions must be answered
- Calculate final score
- Calculate percentage
- Update quiz status to 'completed'
- Update user progress
- Award points
- Check for achievements

**FR-QZ-004: Resume Quiz** ⭐
- Load in-progress quiz
- Restore all previous answers
- Show accurate progress (e.g., "2/5 answered")
- Jump to first unanswered question
- Same questions as before (no new random questions)
- Works after page refresh, timeout, or browser close

**FR-QZ-005: View Quiz History**
- List all completed quizzes
- Show score, date, category
- Pagination support
- Filter by status, category, date

**FR-QZ-006: In-Progress Quiz Detection**
- Dashboard shows "Resume Quiz" banner
- Display quiz details (category, progress)
- Prevent starting new quiz
- Prompt user to resume or complete

### 3.4 Bug Hunting Hub

**FR-BH-001: View Bug Scenarios**
- List all available scenarios
- Filter by category, difficulty
- Show scenario details
- Estimated time to complete

**FR-BH-002: Launch Simulator**
- Interactive bug environment
- 20+ different simulators:
  - E-commerce: Shopping cart, checkout, orders
  - Booking: Hotel, flight, event registration
  - Utilities: Calculator, forms, search, timer
  - And more...

**FR-BH-003: Submit Bug Report**
- Bug description (required)
- Steps to reproduce (required)
- Expected behavior (required)
- Actual behavior (required)
- Severity level
- Automatic matching with known bugs
- Score calculation
- Detailed feedback

**FR-BH-004: Bug Hunting Progress**
- Track completed scenarios
- Calculate success rate
- Time spent per scenario
- Overall bug hunting statistics

### 3.5 Progress Tracking

**FR-PT-001: Overall Progress**
- Total quizzes completed
- Total questions answered
- Correct/incorrect answers
- Average score percentage
- Total time spent
- Last activity date

**FR-PT-002: Category Progress**
- Questions attempted per category
- Questions correct per category
- Average score per category
- Mastery level (0-100)
- Last attempted date

**FR-PT-003: Study Streak**
- Current streak (consecutive days)
- Longest streak achieved
- Last study date
- Streak status (active/broken)
- Visual indicators

**FR-PT-004: Weak Areas**
- Categories below 60% accuracy
- Ranked by priority
- Recommendations
- Updated after each quiz

**FR-PT-005: Progress Dashboard**
- Overall statistics
- Category breakdown charts
- Study streak display
- Weak areas list
- Recent activity timeline

### 3.6 Leaderboard System

**FR-LB-001: Global Leaderboard**
- Rank by total score
- Top 100 users
- User's rank highlighted
- Tie-breaker: earliest achievement

**FR-LB-002: Category Leaderboards**
- Separate leaderboard per category
- Top 50 per category
- Category-specific scores

**FR-LB-003: User Rank Display**
- Global rank
- Category ranks
- Rank change indicators
- Percentile position

### 3.7 Achievement System

**FR-AS-001: Achievement Types**
- Quiz milestones (10, 50, 100 quizzes)
- Score achievements (90%+, perfect scores)
- Streak achievements (7, 30, 100 days)
- Category mastery
- Bug hunting achievements

**FR-AS-002: Achievement Tracking**
- Automatic progress monitoring
- Unlock when criteria met
- Notifications on unlock
- Achievement history

**FR-AS-003: Achievement Display**
- Unlocked achievements
- Locked achievements with progress
- Achievement details
- Unlock dates

### 3.8 Admin Dashboard

**FR-AD-001: Platform Statistics**
- Total users
- Total questions
- Total quizzes completed
- Active users (last 7 days)
- Question distribution by category
- Average user performance

**FR-AD-002: User Management**
- View all users
- Search users
- Edit user details
- Change user roles
- View user statistics
- Deactivate accounts

**FR-AD-003: Question Management**
- View all questions
- Filter by status, category, difficulty
- Search questions
- Bulk operations (multi-select delete)
- Question statistics
- Review flagged questions

**FR-AD-004: Flagged Question Review**
- View all flagged questions
- See flag reasons
- Edit flagged questions
- Resolve flags
- Track resolution history

### 3.9 Excel Upload System

**FR-EU-001: Template Download**
- Download pre-formatted Excel template
- Includes headers and sample data
- Column format:
  - question, optionA, optionB, optionC, optionD
  - correctAnswer, category, difficulty
  - explanation, tags, points, type, status

**FR-EU-002: Bulk Upload**
- Upload Excel file
- Parse and validate each row
- Create question records
- Report success/failed counts
- Detailed error messages with row numbers

**FR-EU-003: Upload Validation**
- Required fields: question, options, correctAnswer, category, difficulty
- Minimum 2 options
- Correct answer must be valid index (0-3)
- Difficulty: foundation, advanced, expert
- Type: single-choice, multiple-choice, true-false
- Status: published, draft, archived

**FR-EU-004: Dynamic Category Creation** ⭐
- Extract categories from uploaded questions
- Auto-create new categories
- Update category list
- No hardcoded categories
- Categories fetched via API: GET /api/questions-upload/categories

**FR-EU-005: Upload History**
- Log all uploads
- Track: date, admin user, file name, success/failed counts
- Viewable by admins
- Searchable and exportable

---

## 4. Non-Functional Requirements

### 4.1 Performance Requirements

**NFR-PF-001: Response Time**
- Simple queries: < 200ms
- Complex queries: < 500ms
- Quiz start: < 1000ms
- Excel upload (100 questions): < 5000ms

**NFR-PF-002: Throughput**
- Minimum: 100 concurrent users
- Target: 500 concurrent users
- Maximum: 1000 concurrent users

**NFR-PF-003: Database Performance**
- Indexed queries: < 50ms
- Aggregation queries: < 500ms
- Write operations: < 100ms

**NFR-PF-004: Frontend Performance**
- Initial page load: < 3 seconds
- Route transitions: < 500ms
- Component rendering: < 100ms

### 4.2 Security Requirements

**NFR-SC-001: Authentication Security**
- JWT tokens with 30-day expiry
- Secure token storage
- Token validation on every request
- Automatic token refresh

**NFR-SC-002: Password Security**
- bcrypt hashing with salt rounds (10+)
- Password strength requirements enforced
- No plain-text storage
- Secure password reset

**NFR-SC-003: Data Protection**
- HTTPS/TLS for all communications
- Environment variables for secrets
- No sensitive data in logs
- Input sanitization

**NFR-SC-004: API Security**
- Rate limiting: 100 requests per 15 minutes
- CORS configuration
- Helmet.js security headers
- Input validation
- XSS prevention
- NoSQL injection prevention

**NFR-SC-005: Authorization**
- Role-based access control (RBAC)
- Middleware authorization checks
- Resource ownership verification
- Admin route protection

### 4.3 Usability Requirements

**NFR-US-001: User Interface**
- Intuitive navigation
- Consistent design language
- Clear error messages
- Loading indicators
- Success confirmations

**NFR-US-002: Mobile Responsiveness** ⭐
- Responsive design (320px to 2560px)
- Touch-friendly controls (min 44x44px)
- Readable text sizes
- Optimized layouts per breakpoint
- Tailwind CSS breakpoints: sm, md, lg, xl

**NFR-US-003: Browser Compatibility**
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

### 4.4 Reliability Requirements

**NFR-RL-001: Availability**
- Target: 99.5% uptime
- Excluding planned maintenance
- Monthly uptime measurement

**NFR-RL-002: Error Handling**
- Try-catch blocks
- Error middleware
- User-friendly error messages
- Error logging
- Automatic recovery where possible

**NFR-RL-003: Data Integrity**
- Database constraints
- Validation at multiple layers
- Regular backups (daily)
- Point-in-time recovery

### 4.5 Scalability Requirements

**NFR-SL-001: Data Scalability**
- Support 10,000+ users
- Support 10,000+ questions
- Support 100,000+ quiz sessions
- Database indexing
- Query optimization

**NFR-SL-002: Horizontal Scalability**
- Stateless API design
- Load balancer support
- Database replication capability
- Caching layer ready

### 4.6 Maintainability Requirements

**NFR-MT-001: Code Quality**
- ESLint compliance
- Consistent coding standards
- Meaningful variable names
- Proper commenting
- DRY principle

**NFR-MT-002: Documentation**
- API documentation
- Code comments
- README files
- Architecture diagrams
- User guides

**NFR-MT-003: Logging**
- HTTP request logging (morgan)
- Error logging
- Authentication events
- Admin actions
- Performance metrics

---

## 5. System Architecture

### 5.1 Architecture Pattern

**Three-Tier Architecture:**

**Tier 1: Presentation Layer (Frontend)**
- React 18 with Vite
- Components: Pages, UI components, Services
- Responsibilities: UI rendering, user input, API communication

**Tier 2: Application Layer (Backend)**
- Node.js with Express.js
- Components: Controllers, Routes, Middleware, Services
- Responsibilities: Business logic, authentication, validation

**Tier 3: Data Layer (Database)**
- MongoDB with Mongoose ODM
- Components: Models, Collections, Indexes
- Responsibilities: Data persistence, retrieval, integrity

### 5.2 Project Structure

```
QA_ExamPrep/
├── client/client/src/
│   ├── components/
│   │   ├── ui/                    # Base UI components
│   │   └── FunctionalBugs/        # Bug simulators
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Quiz.jsx
│   │   ├── Questions.jsx
│   │   ├── BugHunting.jsx
│   │   ├── Admin.jsx
│   │   └── QuestionUpload.jsx
│   ├── services/
│   │   ├── api.js                 # API client
│   │   └── categoryService.js     # Category API
│   └── App.jsx
│
├── controllers/
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
├── models/
│   ├── User.js
│   ├── Question.js
│   ├── Quiz.js
│   ├── Progress.js
│   ├── Achievement.js
│   ├── BugScenario.js
│   └── BugSubmission.js
│
├── routes/
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
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   └── rateLimiter.js
│
└── server.js
```

---

## 6. Data Models

### 6.1 Core Models

**User Model**
```javascript
{
  _id: ObjectId,
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin']),
  stats: {
    totalQuizzes: Number,
    totalQuestions: Number,
    correctAnswers: Number,
    totalScore: Number,
    averageScore: Number
  },
  streak: {
    current: Number,
    longest: Number,
    lastStudyDate: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Question Model**
```javascript
{
  _id: ObjectId,
  questionText: { en: String },
  options: [{
    text: { en: String },
    isCorrect: Boolean
  }],
  correctAnswer: Number,
  category: String (indexed),
  difficulty: String (enum: ['foundation', 'advanced', 'expert']),
  type: String (enum: ['single-choice', 'multiple-choice', 'true-false']),
  explanation: { en: String },
  tags: [String],
  points: Number,
  status: String (enum: ['published', 'draft', 'archived', 'flagged']),
  createdAt: Date,
  updatedAt: Date
}
```

**Quiz Model**
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', indexed),
  mode: String (enum: ['practice', 'exam', 'timed']),
  status: String (enum: ['in-progress', 'completed'], indexed),
  settings: {
    category: String,
    difficulty: String,
    numberOfQuestions: Number
  },
  questions: [{
    question: ObjectId (ref: 'Question'),
    userAnswer: [Number],
    isCorrect: Boolean,
    timeSpent: Number,
    answeredAt: Date
  }],
  score: {
    correct: Number,
    incorrect: Number,
    percentage: Number
  },
  timing: {
    startedAt: Date,
    completedAt: Date,
    totalTime: Number
  },
  createdAt: Date
}
```

**Progress Model**
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', unique),
  overall: {
    totalQuizzes: Number,
    totalQuestions: Number,
    correctAnswers: Number,
    averageScore: Number
  },
  categories: [{
    category: String,
    questionsAttempted: Number,
    questionsCorrect: Number,
    averageScore: Number,
    masteryLevel: Number
  }],
  weakAreas: [{
    category: String,
    score: Number,
    priority: String
  }],
  updatedAt: Date
}
```

**BugScenario Model**
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String,
  difficulty: String (enum: ['easy', 'medium', 'hard']),
  simulatorComponent: String,
  knownBugs: [{
    id: String,
    description: String,
    severity: String,
    expectedBehavior: String,
    actualBehavior: String
  }],
  hints: [String],
  learningPoints: [String],
  createdAt: Date
}
```

### 6.2 Database Indexes

**Critical Indexes:**
- users: email (unique), username (unique)
- questions: category, difficulty, status, (category + difficulty + status)
- quizzes: user, status, (user + status)
- progress: user (unique)

---

## 7. API Specifications

### 7.1 Base URL
```
Production: https://api.qaarena.com
Development: http://localhost:5001/api
```

### 7.2 Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer {token}
```

### 7.3 Core Endpoints

**Authentication**
```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login user
GET    /api/auth/me                Get current user
```

**Questions**
```
GET    /api/questions              List questions (paginated)
POST   /api/questions              Create question (admin)
PUT    /api/questions/:id          Update question (admin)
DELETE /api/questions/:id          Delete question (admin)
POST   /api/questions/bulk-delete  Delete multiple (admin)
POST   /api/questions/:id/flag     Flag question
```

**Quiz**
```
POST   /api/quiz/start             Start new quiz
GET    /api/quiz/in-progress       Get in-progress quiz ⭐
POST   /api/quiz/answer            Submit answer
POST   /api/quiz/:id/complete      Complete quiz
GET    /api/quiz/:id               Get quiz by ID
GET    /api/quiz/user/history      Get quiz history
```

**Progress**
```
GET    /api/progress               Get user progress
GET    /api/progress/categories    Get category progress
GET    /api/progress/weak-areas    Get weak areas
GET    /api/progress/streak        Get study streak
```

**Leaderboard**
```
GET    /api/leaderboard/global     Global rankings
GET    /api/leaderboard/category/:cat  Category rankings
GET    /api/leaderboard/rank       User's rank
```

**Admin**
```
GET    /api/admin/stats            Platform statistics
GET    /api/admin/users            List all users
PUT    /api/admin/users/:id        Update user
GET    /api/admin/questions/flagged  Flagged questions
```

**Question Upload**
```
GET    /api/questions-upload/template     Download template
POST   /api/questions-upload/upload       Upload Excel file
GET    /api/questions-upload/categories   Get categories ⭐
GET    /api/questions-upload/stats        Upload statistics
```

**Bug Hunting**
```
GET    /api/bug-hunting/scenarios  List scenarios
GET    /api/bug-hunting/scenarios/:id  Get scenario details
POST   /api/bug-hunting/submit     Submit bug report
GET    /api/bug-hunting/submissions  User's submissions
```

### 7.4 Response Format

**Success Response:**
```json
{
  "success": true,
  "data": {
    // Response data
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

### 7.5 Status Codes

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error

---

## 8. Security & Performance

### 8.1 Security Measures

**Authentication & Authorization:**
- JWT tokens with 30-day expiry
- bcrypt password hashing (10 salt rounds)
- Role-based access control
- Token validation middleware

**API Protection:**
- Rate limiting: 100 requests per 15 minutes
- CORS configuration
- Helmet.js security headers
- Input validation with express-validator
- XSS prevention
- NoSQL injection prevention

**Data Protection:**
- HTTPS/TLS encryption
- Environment variables for secrets
- No sensitive data in logs
- Secure password reset flow

### 8.2 Performance Optimization

**Database:**
- Indexes on frequently queried fields
- Query optimization
- Connection pooling
- Pagination for large datasets

**Frontend:**
- Code splitting
- Lazy loading
- Asset optimization
- Responsive images

**Caching:**
- Browser caching
- API response caching (where appropriate)
- Static asset caching

### 8.3 Monitoring & Logging

**Logging:**
- HTTP request logging (morgan)
- Error logging
- Authentication events
- Admin actions

**Monitoring:**
- Server uptime
- API response times
- Error rates
- Database performance

---

## 9. Key Features Summary

### 9.1 Quiz Resume Feature ⭐

**Problem Solved:** Users can now resume quizzes after interruptions

**Implementation:**
- Backend: Quiz status tracking ('in-progress', 'completed')
- Frontend: Restore previous answers, jump to first unanswered
- Dashboard: "Resume Quiz" banner with accurate progress
- Validation: Prevent starting new quiz while one is in-progress

**User Flow:**
1. User starts quiz, answers 2 out of 5 questions
2. Page refreshes (or timeout/close)
3. Dashboard shows "Resume Quiz" banner: "Progress: 2/5 answered"
4. User clicks Resume
5. Quiz loads at question 3 (first unanswered)
6. Previous 2 answers restored
7. User continues normally

### 9.2 Dynamic Categories ⭐

**Problem Solved:** Categories auto-created from uploaded questions

**Implementation:**
- Backend: GET /api/questions-upload/categories
- Frontend: categoryService.js fetches from API
- No hardcoded category arrays
- Used in Dashboard, Questions, Leaderboard

**Benefits:**
- Flexible content management
- No code changes for new categories
- Automatic updates

### 9.3 Multi-Select Delete ⭐

**Problem Solved:** Bulk delete questions efficiently

**Implementation:**
- Frontend: Checkboxes for each question, "Select All"
- Backend: DELETE endpoint accepts array of IDs
- Confirmation dialog before deletion
- Audit trail logging

### 9.4 Excel Bulk Upload ⭐

**Problem Solved:** Upload hundreds of questions quickly

**Implementation:**
- Download pre-formatted template
- Separate columns for each option (optionA, optionB, etc.)
- Comprehensive validation
- Detailed error reporting
- Dynamic category creation

**Template Format:**
```
question | optionA | optionB | optionC | optionD | correctAnswer | category | difficulty | explanation | tags | points | type | status
```

### 9.5 Mobile Responsive Design ⭐

**Problem Solved:** Optimal experience on all devices

**Implementation:**
- Tailwind CSS utility classes
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly controls (min 44x44px)
- Responsive layouts and typography

---

## 10. Deployment Requirements

### 10.1 Environment Variables

**Backend (.env):**
```
NODE_ENV=production
PORT=5001
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
JWT_EXPIRE=30d
CLIENT_URL=https://your-frontend.com
```

**Frontend (.env):**
```
VITE_API_URL=https://your-backend.com/api
```

### 10.2 Hosting Recommendations

**Frontend:** Vercel, Netlify  
**Backend:** Heroku, Railway, Render  
**Database:** MongoDB Atlas  
**SSL/TLS:** Let's Encrypt  

### 10.3 Minimum Server Requirements

**Backend Server:**
- CPU: 1 vCPU
- RAM: 512 MB (minimum), 1 GB (recommended)
- Storage: 10 GB
- Node.js 18+

**Database:**
- MongoDB 6+
- Storage: 10 GB (initial), scalable
- RAM: 2 GB (recommended)

---

## 11. Testing Requirements

### 11.1 Test Coverage

- Unit tests for critical functions
- Integration tests for API endpoints
- E2E tests for user flows
- Target coverage: 70%+

### 11.2 Test Scenarios

**Authentication:**
- User registration
- User login
- Token validation
- Role-based access

**Quiz System:**
- Start quiz
- Answer questions
- Resume quiz
- Complete quiz
- Prevent multiple quizzes

**Question Management:**
- Create question
- Update question
- Delete question
- Bulk delete
- Flag question

**Excel Upload:**
- Template download
- Valid upload
- Invalid data handling
- Error reporting

---

## 12. Maintenance & Support

### 12.1 Backup Strategy

- Daily automated backups
- 30-day retention
- Point-in-time recovery
- Tested recovery procedures

### 12.2 Update Schedule

- Security patches: Immediate
- Bug fixes: Weekly
- Feature updates: Monthly
- Major releases: Quarterly

### 12.3 Support Channels

- Email: support@qaarena.com
- GitHub Issues
- Documentation: README.md

---

## 13. Future Enhancements (Roadmap)

**Phase 2 (Planned):**
- Mobile app (React Native)
- AI-powered question recommendations
- Video explanations
- Study groups
- Advanced analytics
- Multi-language UI
- Offline mode
- PDF export of progress reports

---

## Document Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Project Manager | | | |
| Lead Developer | | | |
| QA Lead | | | |
| Stakeholder | | | |

---

**End of Document**

*This SRD is a living document and will be updated as the system evolves.*
