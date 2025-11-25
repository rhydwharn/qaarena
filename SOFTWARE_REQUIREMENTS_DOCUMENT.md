# Software Requirements Document (SRD)
## ISTQB Practice Q&A Platform

**Version:** 1.0  
**Date:** November 2024  
**Project:** ISTQB Certification Practice Platform - Backend API

---

## Table of Contents
1. [Introduction](#1-introduction)
2. [System Overview](#2-system-overview)
3. [Functional Requirements](#3-functional-requirements)
4. [Non-Functional Requirements](#4-non-functional-requirements)
5. [System Architecture](#5-system-architecture)
6. [Data Models](#6-data-models)
7. [API Specifications](#7-api-specifications)
8. [Security Requirements](#8-security-requirements)
9. [Performance Requirements](#9-performance-requirements)
10. [Deployment Requirements](#10-deployment-requirements)

---

## 1. Introduction

### 1.1 Purpose
This document specifies the software requirements for the ISTQB Practice Q&A Platform backend system. The platform provides a comprehensive learning environment for ISTQB certification preparation with features including quiz management, progress tracking, gamification, and administrative controls.

### 1.2 Scope
The system is a Node.js/Express.js RESTful API backend that serves a React-based frontend application. It manages user authentication, question banks, quiz sessions, progress analytics, achievements, and administrative functions.

### 1.3 Definitions and Acronyms
- **ISTQB**: International Software Testing Qualifications Board
- **CTFL**: Certified Tester Foundation Level
- **JWT**: JSON Web Token
- **API**: Application Programming Interface
- **REST**: Representational State Transfer
- **CRUD**: Create, Read, Update, Delete

### 1.4 References
- ISTQB CTFL Syllabus 2018
- Express.js Documentation
- MongoDB Documentation
- JWT RFC 7519

---

## 2. System Overview

### 2.1 System Description
The ISTQB Practice Q&A Platform is a web-based learning management system designed to help users prepare for ISTQB certification examinations through interactive quizzes, progress tracking, and gamification elements.

### 2.2 System Context
- **Frontend**: React SPA (Single Page Application)
- **Backend**: Node.js with Express.js framework
- **Database**: MongoDB (NoSQL)
- **Authentication**: JWT-based token authentication
- **Deployment**: Cloud-based (configurable)

### 2.3 User Roles
1. **User**: Standard platform user who can take quizzes and track progress
2. **Moderator**: Can manage questions and review flagged content
3. **Admin**: Full system access including user management and platform statistics

---

## 3. Functional Requirements

### 3.1 User Authentication & Authorization

#### FR-1.1: User Registration
- **Description**: Users must be able to register for a new account
- **Inputs**: Username, email, password, profile information (firstName, lastName, country, preferredLanguage)
- **Validation**:
  - Username: 3-30 characters, unique
  - Email: Valid format, unique
  - Password: Minimum 6 characters
- **Outputs**: JWT token, user profile data
- **Process**: Hash password with bcrypt, create user record, generate JWT token

#### FR-1.2: User Login
- **Description**: Registered users must be able to authenticate
- **Inputs**: Email, password
- **Validation**: Credentials match, account is active
- **Outputs**: JWT token, user profile data
- **Process**: Verify credentials, update last login timestamp, generate JWT token

#### FR-1.3: Token-Based Authentication
- **Description**: Protect API endpoints with JWT authentication
- **Requirements**: 
  - Token expiration configurable
  - Token refresh capability
  - Role-based access control (RBAC)

#### FR-1.4: User Profile Management
- **Description**: Users can view and update their profile information
- **Capabilities**:
  - Update profile details (name, country, language, avatar)
  - View account statistics
  - View achievement history

### 3.2 Question Management

#### FR-2.1: Question Creation (Admin/Moderator)
- **Description**: Authorized users can create new questions
- **Required Fields**:
  - Question text (multi-language support via Map)
  - Question type (single-choice, multiple-choice, true-false)
  - Options with correct answer indicators
  - Category (8 predefined categories)
  - Difficulty level (foundation, advanced, expert)
  - Points (1-10)
  - Syllabus reference
  - Tags
  - Explanation (multi-language)
- **Validation**: At least one correct answer, valid category and difficulty

#### FR-2.2: Question Retrieval
- **Description**: Retrieve questions with filtering and pagination
- **Filters**:
  - Category
  - Difficulty level
  - Status (draft, published, archived, flagged)
  - Tags
  - Language
- **Sorting**: By date, difficulty, success rate
- **Pagination**: Configurable page size

#### FR-2.3: Question Update (Admin/Moderator)
- **Description**: Modify existing questions
- **Capabilities**:
  - Edit all question fields
  - Change status
  - Add contributors
  - Track modification history

#### FR-2.4: Question Deletion (Admin)
- **Description**: Remove questions from the system
- **Constraints**: Cannot delete questions used in active quizzes

#### FR-2.5: Question Flagging
- **Description**: Users can flag inappropriate or incorrect questions
- **Inputs**: Question ID, reason
- **Process**: Add flag to question, notify moderators

#### FR-2.6: Question Voting
- **Description**: Users can upvote or downvote questions
- **Tracking**: Upvotes and downvotes count
- **Purpose**: Quality control and community feedback

### 3.3 Quiz System

#### FR-3.1: Quiz Creation
- **Description**: Users can start new quiz sessions
- **Quiz Modes**:
  - **Practice**: Unlimited time, immediate feedback
  - **Exam**: Timed, no feedback until completion
  - **Timed**: Time limit per question
  - **Category**: Focus on specific category
- **Settings**:
  - Language preference
  - Category filter
  - Difficulty filter
  - Number of questions
  - Time limit
  - Random order option

#### FR-3.2: Quiz Taking
- **Description**: Users answer questions in active quiz
- **Capabilities**:
  - Submit single or multiple answers
  - Track time spent per question
  - Navigate between questions (practice mode)
  - Save progress automatically
- **Constraints**:
  - Cannot change answers after submission (exam mode)
  - Time limits enforced

#### FR-3.3: Quiz Completion
- **Description**: Finalize quiz and calculate results
- **Calculations**:
  - Correct/incorrect/unanswered counts
  - Percentage score
  - Total points earned
  - Total time spent
- **Outputs**: Detailed results, correct answers, explanations

#### FR-3.4: Quiz History
- **Description**: Users can view past quiz attempts
- **Information Displayed**:
  - Quiz mode and settings
  - Score and statistics
  - Date and duration
  - Question-by-question breakdown

### 3.4 Progress Tracking

#### FR-4.1: Overall Progress
- **Description**: Track user's learning progress across the platform
- **Metrics**:
  - Total quizzes taken
  - Total questions answered
  - Overall accuracy rate
  - Average score
  - Total points earned
  - Current streak

#### FR-4.2: Category Progress
- **Description**: Track performance by question category
- **Metrics per Category**:
  - Questions answered
  - Accuracy rate
  - Average time per question
  - Mastery level

#### FR-4.3: Weak Areas Identification
- **Description**: Identify topics requiring more practice
- **Criteria**: Categories with <70% accuracy
- **Recommendations**: Suggested questions for improvement

#### FR-4.4: Study Streak
- **Description**: Track consecutive days of platform usage
- **Rules**:
  - Increment on daily activity
  - Reset if no activity for 24+ hours
  - Display current and longest streak

#### FR-4.5: Performance Analytics
- **Description**: Detailed analytics and visualizations
- **Charts**:
  - Score trends over time
  - Category performance radar chart
  - Time spent per category
  - Difficulty level distribution

### 3.5 Leaderboard System

#### FR-5.1: Global Leaderboard
- **Description**: Rank users by total score
- **Display**:
  - Top 100 users
  - Username, score, quiz count
  - User's rank highlighted
- **Refresh**: Real-time or periodic updates

#### FR-5.2: Category Leaderboards
- **Description**: Separate rankings per category
- **Filters**: By time period (weekly, monthly, all-time)

#### FR-5.3: User Rank
- **Description**: Display user's current global rank
- **Information**: Rank, percentile, points to next rank

### 3.6 Achievement System

#### FR-6.1: Achievement Definitions
- **Types**:
  - **Milestone**: Complete X quizzes
  - **Accuracy**: Achieve X% accuracy
  - **Streak**: Maintain X-day streak
  - **Category Mastery**: 90%+ in category
  - **Speed**: Complete quiz in record time
  - **Participation**: Platform engagement

#### FR-6.2: Achievement Unlocking
- **Description**: Automatically award achievements when criteria met
- **Process**: Check criteria after each quiz completion
- **Notification**: Alert user of new achievements

#### FR-6.3: Achievement Display
- **Description**: Show earned and available achievements
- **Information**:
  - Achievement name and description
  - Icon/badge
  - Unlock date
  - Progress toward locked achievements

### 3.7 Administrative Functions

#### FR-7.1: Platform Statistics
- **Description**: Dashboard with system-wide metrics
- **Metrics**:
  - Total users, active users
  - Total questions, quizzes
  - Average scores
  - Popular categories
  - System health indicators

#### FR-7.2: User Management
- **Description**: Admin can manage user accounts
- **Capabilities**:
  - View all users with filters
  - Activate/deactivate accounts
  - Change user roles
  - View user activity logs
  - Delete users

#### FR-7.3: Content Moderation
- **Description**: Review and manage flagged content
- **Capabilities**:
  - View flagged questions
  - Approve or reject flags
  - Edit or archive questions
  - Ban users for violations

#### FR-7.4: System Configuration
- **Description**: Configure platform settings
- **Settings**:
  - Default quiz parameters
  - Achievement criteria
  - Point values
  - Time limits

---

## 4. Non-Functional Requirements

### 4.1 Performance Requirements

#### NFR-1.1: Response Time
- API endpoints must respond within 200ms for 95% of requests
- Database queries optimized with proper indexing
- Complex analytics queries: <1 second

#### NFR-1.2: Throughput
- Support 1000 concurrent users
- Handle 10,000 API requests per minute

#### NFR-1.3: Scalability
- Horizontal scaling capability
- Stateless API design for load balancing
- Database sharding support for growth

### 4.2 Security Requirements

#### NFR-2.1: Authentication Security
- Passwords hashed with bcrypt (salt rounds: 10)
- JWT tokens with configurable expiration
- HTTPS required for all communications
- Rate limiting on authentication endpoints

#### NFR-2.2: Authorization
- Role-based access control (RBAC)
- Endpoint-level permission checks
- Resource ownership validation

#### NFR-2.3: Data Protection
- Input validation and sanitization
- SQL/NoSQL injection prevention
- XSS protection with Helmet.js
- CORS configuration

#### NFR-2.4: API Security
- Rate limiting (100 requests/15 minutes per IP)
- Request size limits
- API versioning
- Error messages without sensitive data

### 4.3 Reliability Requirements

#### NFR-3.1: Availability
- 99.5% uptime target
- Graceful degradation on failures
- Health check endpoint

#### NFR-3.2: Error Handling
- Centralized error handling middleware
- Consistent error response format
- Logging of all errors
- User-friendly error messages

#### NFR-3.3: Data Integrity
- Transaction support where needed
- Data validation at model level
- Referential integrity enforcement
- Regular database backups

### 4.4 Usability Requirements

#### NFR-4.1: API Design
- RESTful conventions
- Consistent naming patterns
- Clear endpoint documentation
- Intuitive request/response formats

#### NFR-4.2: Internationalization
- Multi-language support for questions
- Language preference per user
- UTF-8 encoding throughout

### 4.5 Maintainability Requirements

#### NFR-5.1: Code Quality
- Modular architecture (MVC pattern)
- Clear separation of concerns
- Comprehensive code comments
- Consistent coding style

#### NFR-5.2: Testing
- Unit tests for business logic
- Integration tests for API endpoints
- 80%+ code coverage target
- Automated test execution

#### NFR-5.3: Documentation
- API documentation (OpenAPI/Swagger)
- Code documentation
- Deployment guides
- Database schema documentation

### 4.6 Compatibility Requirements

#### NFR-6.1: Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browser support

#### NFR-6.2: Database
- MongoDB 4.4+
- Mongoose ODM 8.0+

#### NFR-6.3: Node.js
- Node.js 18+ LTS
- npm 9+

---

## 5. System Architecture

### 5.1 Architecture Pattern
**Three-Tier Architecture**:
1. **Presentation Layer**: React Frontend (separate repository)
2. **Application Layer**: Express.js API (this system)
3. **Data Layer**: MongoDB Database

### 5.2 Design Patterns
- **MVC (Model-View-Controller)**: Separation of data, business logic, and routing
- **Middleware Pattern**: Request processing pipeline
- **Repository Pattern**: Data access abstraction
- **Factory Pattern**: Object creation (e.g., quiz generation)

### 5.3 Technology Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18+
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Security**: Helmet.js, bcryptjs, express-rate-limit
- **Validation**: express-validator
- **Testing**: Jest, Supertest
- **Development**: Nodemon, Morgan (logging)
- **Utilities**: dotenv, cors, compression

---

## 6. Data Models

### 6.1 User Model
```javascript
{
  username: String (unique, 3-30 chars),
  email: String (unique, valid format),
  password: String (hashed, min 6 chars),
  role: Enum ['user', 'admin', 'moderator'],
  profile: {
    firstName: String,
    lastName: String,
    country: String,
    preferredLanguage: String (default: 'en'),
    avatar: String (URL)
  },
  stats: {
    totalQuizzes: Number,
    totalQuestions: Number,
    correctAnswers: Number,
    totalScore: Number,
    averageScore: Number,
    streak: Number,
    lastActiveDate: Date
  },
  achievements: [ObjectId] (ref: Achievement),
  isActive: Boolean,
  isEmailVerified: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 6.2 Question Model
```javascript
{
  questionText: Map<String, String> (multi-language),
  type: Enum ['single-choice', 'multiple-choice', 'true-false'],
  options: [{
    text: Map<String, String>,
    isCorrect: Boolean
  }],
  explanation: Map<String, String>,
  category: Enum [8 categories],
  difficulty: Enum ['foundation', 'advanced', 'expert'],
  syllabus: String (default: 'ISTQB-CTFL-2018'),
  tags: [String],
  points: Number (1-10),
  statistics: {
    timesAnswered: Number,
    timesCorrect: Number,
    averageTime: Number
  },
  status: Enum ['draft', 'published', 'archived', 'flagged'],
  createdBy: ObjectId (ref: User),
  contributors: [{
    user: ObjectId,
    contribution: String,
    date: Date
  }],
  flags: [{
    user: ObjectId,
    reason: String,
    date: Date
  }],
  votes: {
    upvotes: Number,
    downvotes: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 6.3 Quiz Model
```javascript
{
  user: ObjectId (ref: User),
  mode: Enum ['practice', 'exam', 'timed', 'category'],
  questions: [{
    question: ObjectId (ref: Question),
    userAnswer: [Number],
    isCorrect: Boolean,
    timeSpent: Number,
    answeredAt: Date
  }],
  settings: {
    language: String,
    category: String,
    difficulty: String,
    numberOfQuestions: Number,
    timeLimit: Number,
    randomOrder: Boolean
  },
  score: {
    correct: Number,
    incorrect: Number,
    unanswered: Number,
    percentage: Number,
    totalPoints: Number
  },
  status: Enum ['in-progress', 'completed', 'abandoned'],
  startedAt: Date,
  completedAt: Date,
  totalTime: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### 6.4 Progress Model
```javascript
{
  user: ObjectId (ref: User, unique),
  categoryProgress: [{
    category: String,
    questionsAnswered: Number,
    correctAnswers: Number,
    averageTime: Number,
    lastPracticed: Date,
    masteryLevel: Number (0-100)
  }],
  weakAreas: [{
    category: String,
    accuracy: Number,
    recommendedQuestions: Number
  }],
  studyStreak: {
    current: Number,
    longest: Number,
    lastStudyDate: Date
  },
  milestones: [{
    type: String,
    achieved: Boolean,
    date: Date
  }],
  updatedAt: Date
}
```

### 6.5 Achievement Model
```javascript
{
  name: String (unique),
  description: String,
  icon: String,
  category: Enum ['milestone', 'accuracy', 'streak', 'mastery', 'speed', 'participation'],
  criteria: {
    type: String,
    threshold: Number,
    category: String (optional)
  },
  points: Number,
  rarity: Enum ['common', 'rare', 'epic', 'legendary'],
  createdAt: Date
}
```

---

## 7. API Specifications

### 7.1 Authentication Endpoints

#### POST /api/auth/register
- **Description**: Register new user
- **Request Body**: `{ username, email, password, profile }`
- **Response**: `{ token, user }`
- **Status Codes**: 201 (Created), 400 (Validation Error), 409 (Conflict)

#### POST /api/auth/login
- **Description**: Authenticate user
- **Request Body**: `{ email, password }`
- **Response**: `{ token, user }`
- **Status Codes**: 200 (OK), 401 (Unauthorized)

#### GET /api/auth/me
- **Description**: Get current user profile
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ user }`
- **Status Codes**: 200 (OK), 401 (Unauthorized)

### 7.2 Question Endpoints

#### GET /api/questions
- **Description**: List questions with filters
- **Query Parameters**: `category, difficulty, status, page, limit, language`
- **Response**: `{ questions, pagination }`
- **Status Codes**: 200 (OK)

#### POST /api/questions
- **Description**: Create new question (Admin/Moderator)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: Question object
- **Response**: `{ question }`
- **Status Codes**: 201 (Created), 401 (Unauthorized), 403 (Forbidden)

#### PUT /api/questions/:id
- **Description**: Update question
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: Partial question object
- **Response**: `{ question }`
- **Status Codes**: 200 (OK), 404 (Not Found)

#### DELETE /api/questions/:id
- **Description**: Delete question (Admin)
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ message }`
- **Status Codes**: 200 (OK), 404 (Not Found)

### 7.3 Quiz Endpoints

#### POST /api/quiz/start
- **Description**: Start new quiz session
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: `{ mode, settings }`
- **Response**: `{ quiz }`
- **Status Codes**: 201 (Created)

#### POST /api/quiz/answer
- **Description**: Submit answer to question
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: `{ quizId, questionId, answer, timeSpent }`
- **Response**: `{ isCorrect, explanation (if practice mode) }`
- **Status Codes**: 200 (OK)

#### POST /api/quiz/:id/complete
- **Description**: Complete quiz and get results
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ quiz, results, newAchievements }`
- **Status Codes**: 200 (OK)

#### GET /api/quiz/user/history
- **Description**: Get user's quiz history
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**: `page, limit, mode`
- **Response**: `{ quizzes, pagination }`
- **Status Codes**: 200 (OK)

### 7.4 Progress Endpoints

#### GET /api/progress
- **Description**: Get overall user progress
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ progress }`
- **Status Codes**: 200 (OK)

#### GET /api/progress/categories
- **Description**: Get category-wise progress
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ categoryProgress }`
- **Status Codes**: 200 (OK)

#### GET /api/progress/weak-areas
- **Description**: Identify weak areas
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ weakAreas }`
- **Status Codes**: 200 (OK)

#### GET /api/progress/streak
- **Description**: Get study streak information
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ streak }`
- **Status Codes**: 200 (OK)

### 7.5 Leaderboard Endpoints

#### GET /api/leaderboard/global
- **Description**: Get global leaderboard
- **Query Parameters**: `page, limit`
- **Response**: `{ leaderboard, pagination }`
- **Status Codes**: 200 (OK)

#### GET /api/leaderboard/rank
- **Description**: Get user's rank
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ rank, percentile, score }`
- **Status Codes**: 200 (OK)

### 7.6 Achievement Endpoints

#### GET /api/achievements
- **Description**: Get all achievements
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ achievements, userAchievements }`
- **Status Codes**: 200 (OK)

#### POST /api/achievements/check
- **Description**: Check for new achievements
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ newAchievements }`
- **Status Codes**: 200 (OK)

### 7.7 Admin Endpoints

#### GET /api/admin/stats
- **Description**: Get platform statistics (Admin)
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ stats }`
- **Status Codes**: 200 (OK), 403 (Forbidden)

#### GET /api/admin/users
- **Description**: List all users (Admin)
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**: `page, limit, role, status`
- **Response**: `{ users, pagination }`
- **Status Codes**: 200 (OK), 403 (Forbidden)

#### GET /api/admin/questions/flagged
- **Description**: Get flagged questions (Admin/Moderator)
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ flaggedQuestions }`
- **Status Codes**: 200 (OK), 403 (Forbidden)

---

## 8. Security Requirements

### 8.1 Authentication & Authorization
- JWT-based authentication with configurable expiration
- Role-based access control (RBAC)
- Password hashing with bcrypt (10 salt rounds)
- Secure token storage (httpOnly cookies recommended for production)

### 8.2 Input Validation
- express-validator for request validation
- Mongoose schema validation
- Sanitization of user inputs
- File upload restrictions (if applicable)

### 8.3 API Security
- Helmet.js for security headers
- CORS configuration
- Rate limiting (express-rate-limit)
- Request size limits
- XSS protection
- NoSQL injection prevention

### 8.4 Data Security
- Environment variables for sensitive data
- Secure database connections
- Password fields excluded from queries by default
- Audit logging for sensitive operations

---

## 9. Performance Requirements

### 9.1 Database Optimization
- Indexes on frequently queried fields:
  - User: username, email
  - Question: category, difficulty, status, tags
  - Quiz: user, status, createdAt
  - Progress: user
- Compound indexes for complex queries
- Virtual fields for computed properties

### 9.2 Caching Strategy
- In-memory caching for frequently accessed data
- Redis integration (optional, for production)
- Cache invalidation on data updates

### 9.3 Query Optimization
- Pagination for large result sets
- Field selection to reduce payload size
- Aggregation pipelines for analytics
- Lean queries where population not needed

### 9.4 Response Optimization
- Compression middleware
- JSON response optimization
- Efficient serialization

---

## 10. Deployment Requirements

### 10.1 Environment Configuration
- Development, staging, production environments
- Environment-specific .env files
- Configuration management

### 10.2 Dependencies
- Node.js 18+ LTS
- MongoDB 4.4+
- npm packages as specified in package.json

### 10.3 Deployment Process
1. Install dependencies: `npm install`
2. Configure environment: Copy `.env.example` to `.env`
3. Seed database: `npm run seed`
4. Run tests: `npm test`
5. Start server: `npm start` (production) or `npm run dev` (development)

### 10.4 Monitoring & Logging
- Morgan for HTTP request logging
- Error logging to files/external service
- Health check endpoint: GET /api/health
- Performance monitoring (optional: New Relic, DataDog)

### 10.5 Backup & Recovery
- Regular database backups
- Backup retention policy
- Disaster recovery plan
- Data migration scripts

---

## Appendix A: Question Categories

1. **Fundamentals**: Basic testing concepts and terminology
2. **Testing Throughout SDLC**: Testing in different lifecycle models
3. **Static Testing**: Reviews, inspections, static analysis
4. **Test Techniques**: Black-box, white-box, experience-based techniques
5. **Test Management**: Planning, monitoring, control, defect management
6. **Tool Support**: Test automation, test management tools
7. **Agile Testing**: Agile methodologies, continuous integration
8. **Test Automation**: Automation frameworks, best practices

---

## Appendix B: Achievement Examples

- **First Steps**: Complete your first quiz
- **Dedicated Learner**: Complete 10 quizzes
- **Quiz Master**: Complete 100 quizzes
- **Perfect Score**: Achieve 100% on any quiz
- **Consistency King**: Maintain 7-day study streak
- **Category Expert**: Achieve 90%+ accuracy in a category
- **Speed Demon**: Complete quiz in under 5 minutes
- **Rising Star**: Reach top 100 on leaderboard

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Nov 2024 | Development Team | Initial release |

---

**End of Document**