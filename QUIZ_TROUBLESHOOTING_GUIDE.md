# Quiz Functionality Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: "No questions available" Error

**Symptoms:**
- Users get error when trying to start a quiz
- Message: "No questions available for the selected criteria"

**Possible Causes:**
1. No questions in database
2. All questions have status other than 'published'
3. Selected category/difficulty has no questions

**Solutions:**

#### Solution 1: Seed the Database
```bash
cd /Users/ridwanabdulazeez/QA_ExamPrep
node scripts/seedDatabase.js
```

#### Solution 2: Check Question Status
Run this in MongoDB shell or Compass:
```javascript
db.questions.updateMany(
  { status: { $ne: 'published' } },
  { $set: { status: 'published' } }
)
```

#### Solution 3: Verify Questions Exist
```javascript
db.questions.countDocuments({ status: 'published' })
```

### Issue 2: Quiz Submission Fails

**Symptoms:**
- Error when clicking "Next" or "Submit Quiz"
- Console shows 400 or 500 errors

**Possible Causes:**
1. Invalid quiz ID
2. Quiz already completed
3. Network/server issues
4. Answer format mismatch

**Solutions:**

#### Check Quiz Status
The quiz must be in 'in-progress' status. Check:
```javascript
db.quizzes.find({ _id: ObjectId("quiz_id_here") })
```

#### Verify Answer Format
- Single choice: `answer: 0` (number)
- Multiple choice: `answer: [0, 2]` (array)
- True/False: `answer: 0` or `answer: 1`

### Issue 3: Questions Not Loading

**Symptoms:**
- Blank question list
- Loading spinner never stops
- Error in console

**Possible Causes:**
1. Backend server not running
2. CORS issues
3. Authentication token expired
4. API endpoint mismatch

**Solutions:**

#### Check Backend Server
```bash
lsof -ti:5001
# Should return a process ID
```

#### Restart Backend
```bash
cd /Users/ridwanabdulazeez/QA_ExamPrep
npm run dev
```

#### Check API URL
In `/client/client/.env`:
```
VITE_API_URL=http://localhost:5001/api
```

### Issue 4: Authentication Errors (401)

**Symptoms:**
- Redirected to login page
- "Unauthorized" errors
- Token expired messages

**Solutions:**

#### Clear and Re-login
1. Clear localStorage
2. Log out
3. Log in again

#### Check Token in localStorage
```javascript
// In browser console
localStorage.getItem('token')
```

## Database Seeding

### Seed Questions
```bash
node scripts/seedDatabase.js
```

### Seed Beginner Questions
```bash
node scripts/seedBeginnerQuestions.js
```

### Verify Seeding
```javascript
// In MongoDB
db.questions.countDocuments()
db.questions.find().limit(5)
```

## API Endpoints Reference

### Questions
- GET `/api/questions` - Get all questions
- GET `/api/questions/:id` - Get single question
- POST `/api/questions` - Create question (admin)
- PUT `/api/questions/:id` - Update question (admin)
- DELETE `/api/questions/:id` - Delete question (admin)

### Quiz
- POST `/api/quiz/start` - Start new quiz
- POST `/api/quiz/answer` - Submit answer
- POST `/api/quiz/:id/complete` - Complete quiz
- GET `/api/quiz/:id` - Get quiz by ID
- GET `/api/quiz/user/history` - Get user quiz history

## Request/Response Examples

### Start Quiz Request
```json
{
  "mode": "practice",
  "numberOfQuestions": 10,
  "category": "fundamentals",
  "difficulty": "foundation"
}
```

### Start Quiz Response (Success)
```json
{
  "status": "success",
  "message": "Quiz started successfully",
  "data": {
    "quiz": {
      "_id": "...",
      "user": "...",
      "mode": "practice",
      "questions": [...],
      "status": "in-progress"
    }
  }
}
```

### Answer Question Request
```json
{
  "quizId": "quiz_id_here",
  "questionId": "question_id_here",
  "answer": 0,
  "timeSpent": 30
}
```

### Answer Question Response
```json
{
  "status": "success",
  "data": {
    "isCorrect": true,
    "correctAnswers": 0
  }
}
```

## Error Messages and Meanings

| Error | Meaning | Solution |
|-------|---------|----------|
| "No questions available" | No published questions match criteria | Seed database or change filters |
| "Quiz not found" | Invalid quiz ID or quiz deleted | Start a new quiz |
| "Quiz is completed" | Trying to answer completed quiz | View results or start new quiz |
| "Invalid quiz ID format" | Malformed ObjectId | Check quiz ID format |
| "Not authorized" | Wrong user or no permission | Check login status |
| "Please provide quizId, questionId, and answer" | Missing required fields | Check request payload |

## Debugging Steps

### 1. Check Backend Logs
```bash
# Backend terminal should show:
# - POST /api/quiz/start
# - POST /api/quiz/answer
# - POST /api/quiz/:id/complete
```

### 2. Check Browser Console
- Open DevTools (F12)
- Go to Console tab
- Look for red errors
- Check Network tab for failed requests

### 3. Check Network Requests
- Open DevTools > Network
- Filter by "Fetch/XHR"
- Click on failed request
- Check:
  - Request URL
  - Request Headers
  - Request Payload
  - Response

### 4. Verify Database State
```javascript
// Check questions
db.questions.find({ status: 'published' }).count()

// Check quizzes
db.quizzes.find({ user: ObjectId("user_id") }).sort({ createdAt: -1 }).limit(5)

// Check user
db.users.findOne({ email: "user@example.com" })
```

## Quick Fixes

### Reset Everything
```bash
# 1. Stop servers
# 2. Clear database
mongo
> use qa_exam_prep
> db.dropDatabase()
> exit

# 3. Seed database
node scripts/seedDatabase.js

# 4. Restart backend
npm run dev

# 5. Restart frontend
cd client/client
npm run dev

# 6. Clear browser cache and localStorage
# 7. Register new user
# 8. Try quiz again
```

### Fix Common Frontend Issues
```bash
cd /Users/ridwanabdulazeez/QA_ExamPrep/client/client

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build

# Restart dev server
npm run dev
```

## Testing Checklist

- [ ] Backend server running on port 5001
- [ ] Frontend server running on port 5173
- [ ] Database has published questions
- [ ] User is logged in
- [ ] Token is valid
- [ ] CORS is configured
- [ ] API URL is correct in .env
- [ ] Browser console shows no errors
- [ ] Network requests are successful

## Contact/Support

If issues persist:
1. Check all error messages carefully
2. Review backend logs
3. Verify database state
4. Test with Postman/curl
5. Check this troubleshooting guide
6. Review code changes

## Known Limitations

1. Maximum 100 questions per quiz
2. Quiz must be completed in one session
3. Cannot go back to previous questions after submission
4. Timer (if enabled) cannot be paused
5. Questions are randomly selected
