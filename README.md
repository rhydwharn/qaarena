# ISTQB Practice Q&A Platform - Backend

Comprehensive Node.js backend for ISTQB certification practice platform.

## Features
- JWT Authentication with role-based access
- Question Management with multi-language support
- Quiz System (practice, exam, timed modes)
- Progress Tracking & Analytics
- Leaderboard & Rankings
- Achievements & Gamification
- Admin Dashboard

## Installation

```bash
npm install
cp .env.example .env
# Edit .env with your configuration
npm run seed
npm run dev
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login
- GET /api/auth/me - Get current user

### Questions
- GET /api/questions - List questions
- POST /api/questions - Create question (admin)
- PUT /api/questions/:id - Update question
- DELETE /api/questions/:id - Delete question

### Quiz
- POST /api/quiz/start - Start new quiz
- POST /api/quiz/answer - Answer question
- POST /api/quiz/:id/complete - Complete quiz
- GET /api/quiz/user/history - Get quiz history

### Progress
- GET /api/progress - Get user progress
- GET /api/progress/categories - Category progress
- GET /api/progress/weak-areas - Weak areas
- GET /api/progress/streak - Study streak

### Leaderboard
- GET /api/leaderboard/global - Global rankings
- GET /api/leaderboard/rank - User rank

### Achievements
- GET /api/achievements - All achievements
- POST /api/achievements/check - Check new achievements

### Admin
- GET /api/admin/stats - Platform statistics
- GET /api/admin/users - Manage users
- GET /api/admin/questions/flagged - Flagged questions

## Testing

```bash
npm test
```

## Default Credentials
- Test User: test@example.com / Test123!

## License
MIT