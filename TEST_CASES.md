# Test Cases Document

## QA Arena - ISTQB Certification Practice Platform

---

**Document Version:** 2.0  
**Date:** November 26, 2024  
**Project:** QA Arena  
**Test Type:** Functional & Non-Functional Testing  

---

## Table of Contents

1. [Authentication & User Management](#1-authentication--user-management)
2. [Question Management](#2-question-management)
3. [Quiz System](#3-quiz-system)
4. [Quiz Resume Feature](#4-quiz-resume-feature)
5. [Bug Hunting Hub](#5-bug-hunting-hub)
6. [Progress Tracking](#6-progress-tracking)
7. [Leaderboard System](#7-leaderboard-system)
8. [Achievement System](#8-achievement-system)
9. [Admin Dashboard](#9-admin-dashboard)
10. [Excel Upload System](#10-excel-upload-system)
11. [Dynamic Categories](#11-dynamic-categories)
12. [Mobile Responsiveness](#12-mobile-responsiveness)
13. [Security Testing](#13-security-testing)
14. [Performance Testing](#14-performance-testing)

---

## 1. Authentication & User Management

### TC-AUTH-001: User Registration - Valid Data
**Priority:** High  
**Preconditions:** User not registered  
**Test Data:**
- Username: testuser123
- Email: testuser@example.com
- Password: Test@123

**Steps:**
1. Navigate to registration page
2. Enter username: testuser123
3. Enter email: testuser@example.com
4. Enter password: Test@123
5. Click Register button

**Expected Result:**
- User account created successfully
- JWT token issued
- User redirected to dashboard
- Success message displayed

**Actual Result:** [To be filled during testing]  
**Status:** [Pass/Fail]  
**Tested By:** [Name]  
**Date:** [Date]

---

### TC-AUTH-002: User Registration - Duplicate Email
**Priority:** High  
**Preconditions:** Email already exists in database  
**Test Data:**
- Email: existing@example.com

**Steps:**
1. Navigate to registration page
2. Enter details with existing email
3. Click Register button

**Expected Result:**
- Registration fails
- Error message: "Email already exists"
- User remains on registration page

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-AUTH-003: User Registration - Weak Password
**Priority:** High  
**Preconditions:** None  
**Test Data:**
- Password: weak (no uppercase, number, or special char)

**Steps:**
1. Navigate to registration page
2. Enter valid username and email
3. Enter weak password: "weak"
4. Click Register button

**Expected Result:**
- Registration fails
- Error message: "Password must contain at least 6 characters, 1 uppercase, 1 number, 1 special character"
- User remains on registration page

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-AUTH-004: User Login - Valid Credentials
**Priority:** High  
**Preconditions:** User registered  
**Test Data:**
- Email: testuser@example.com
- Password: Test@123

**Steps:**
1. Navigate to login page
2. Enter email: testuser@example.com
3. Enter password: Test@123
4. Click Login button

**Expected Result:**
- Login successful
- JWT token issued
- User redirected to dashboard
- User data loaded

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-AUTH-005: User Login - Invalid Credentials
**Priority:** High  
**Preconditions:** None  
**Test Data:**
- Email: testuser@example.com
- Password: WrongPassword123!

**Steps:**
1. Navigate to login page
2. Enter valid email
3. Enter incorrect password
4. Click Login button

**Expected Result:**
- Login fails
- Error message: "Invalid credentials"
- User remains on login page
- No token issued

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-AUTH-006: User Logout
**Priority:** Medium  
**Preconditions:** User logged in  

**Steps:**
1. User logged in and on dashboard
2. Click Logout button

**Expected Result:**
- User logged out
- Token cleared from storage
- Redirected to login page
- Protected routes inaccessible

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-AUTH-007: Token Expiration
**Priority:** Medium  
**Preconditions:** User logged in with expired token  

**Steps:**
1. User logged in
2. Wait for token to expire (or manually expire)
3. Attempt to access protected route

**Expected Result:**
- Access denied
- 401 Unauthorized error
- Redirected to login page
- Message: "Session expired, please login again"

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

## 2. Question Management

### TC-QM-001: View Questions - User
**Priority:** High  
**Preconditions:** User logged in, questions exist  

**Steps:**
1. Navigate to Questions page
2. Observe question list

**Expected Result:**
- Questions displayed in paginated list
- Only published questions visible
- Question text, category, difficulty shown
- Pagination controls visible

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-QM-002: Filter Questions by Category
**Priority:** High  
**Preconditions:** Questions exist in multiple categories  

**Steps:**
1. Navigate to Questions page
2. Select category filter: "Fundamentals"
3. Click Apply

**Expected Result:**
- Only questions from "Fundamentals" category displayed
- Question count updated
- Filter indicator shown

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-QM-003: Search Questions
**Priority:** Medium  
**Preconditions:** Questions exist  
**Test Data:** Search term: "testing"

**Steps:**
1. Navigate to Questions page
2. Enter search term: "testing"
3. Press Enter or click Search

**Expected Result:**
- Questions containing "testing" displayed
- Results count shown
- Irrelevant questions filtered out

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-QM-004: Create Question - Admin
**Priority:** High  
**Preconditions:** Admin logged in  
**Test Data:**
- Question: "What is ISTQB?"
- Options: ["Testing Board", "Software Tool", "Programming Language", "Database"]
- Correct Answer: 0
- Category: "Fundamentals"
- Difficulty: "Foundation"

**Steps:**
1. Navigate to Admin Dashboard
2. Click "Add Question"
3. Enter question details
4. Click Save

**Expected Result:**
- Question created successfully
- Question appears in question list
- Success message displayed
- Status: "published"

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-QM-005: Create Question - Missing Required Fields
**Priority:** High  
**Preconditions:** Admin logged in  

**Steps:**
1. Navigate to Admin Dashboard
2. Click "Add Question"
3. Leave question text empty
4. Click Save

**Expected Result:**
- Validation error
- Error message: "Question text is required"
- Question not created

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-QM-006: Update Question - Admin
**Priority:** High  
**Preconditions:** Admin logged in, question exists  

**Steps:**
1. Navigate to Admin Dashboard
2. Select a question
3. Click Edit
4. Modify question text
5. Click Save

**Expected Result:**
- Question updated successfully
- Changes reflected immediately
- Success message displayed
- Update timestamp changed

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-QM-007: Delete Single Question - Admin
**Priority:** High  
**Preconditions:** Admin logged in, question exists  

**Steps:**
1. Navigate to Admin Dashboard
2. Select a question
3. Click Delete
4. Confirm deletion

**Expected Result:**
- Confirmation dialog appears
- Question deleted after confirmation
- Question removed from list
- Success message displayed

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-QM-008: Multi-Select Delete Questions - Admin
**Priority:** High  
**Preconditions:** Admin logged in, multiple questions exist  

**Steps:**
1. Navigate to Admin Dashboard
2. Check checkboxes for 3 questions
3. Click "Delete Selected" button
4. Confirm deletion

**Expected Result:**
- Confirmation dialog shows count: "Delete 3 questions?"
- All 3 questions deleted after confirmation
- Questions removed from list
- Success message: "3 questions deleted"

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-QM-009: Select All Questions - Admin
**Priority:** Medium  
**Preconditions:** Admin logged in, multiple questions on page  

**Steps:**
1. Navigate to Admin Dashboard
2. Click "Select All" checkbox in header
3. Observe all checkboxes

**Expected Result:**
- All question checkboxes on current page selected
- Delete button shows total count
- Can deselect all by clicking again

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-QM-010: Flag Question - User
**Priority:** Medium  
**Preconditions:** User logged in, question exists  

**Steps:**
1. Navigate to Questions page
2. Select a question
3. Click "Flag Question"
4. Enter reason: "Incorrect answer"
5. Submit

**Expected Result:**
- Flag submitted successfully
- Question status changed to "flagged"
- Admin notified
- Success message displayed

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

## 3. Quiz System

### TC-QZ-001: Start Quiz - Valid Configuration
**Priority:** High  
**Preconditions:** User logged in, no in-progress quiz, questions available  
**Test Data:**
- Category: "Fundamentals"
- Number of Questions: 10
- Difficulty: "Foundation"

**Steps:**
1. Navigate to Dashboard
2. Select category: "Fundamentals"
3. Enter number of questions: 10
4. Click "Start Quiz"

**Expected Result:**
- Quiz created successfully
- 10 random questions loaded
- No duplicate questions
- Quiz status: "in-progress"
- First question displayed
- Progress: 0/10

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-QZ-002: Start Quiz - Insufficient Questions
**Priority:** High  
**Preconditions:** User logged in, category has fewer questions than requested  

**Steps:**
1. Navigate to Dashboard
2. Select category with only 5 questions
3. Request 10 questions
4. Click "Start Quiz"

**Expected Result:**
- Quiz created with available questions (5)
- Warning message: "Only 5 questions available"
- Quiz starts with 5 questions

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-QZ-003: Answer Question - Single Choice
**Priority:** High  
**Preconditions:** Quiz in progress  

**Steps:**
1. Quiz loaded with question displayed
2. Select option A
3. Click "Submit Answer"

**Expected Result:**
- Answer saved to database
- Immediate feedback (correct/incorrect)
- Explanation shown
- Progress updated: 1/10
- Next question button enabled

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-QZ-004: Change Answer Before Completion
**Priority:** Medium  
**Preconditions:** Quiz in progress, question answered  

**Steps:**
1. Answer question with option A
2. Navigate back to same question
3. Change answer to option B
4. Submit

**Expected Result:**
- Answer updated to option B
- Previous answer (A) overwritten
- Feedback updated
- Score recalculated if needed

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-QZ-005: Complete Quiz - All Questions Answered
**Priority:** High  
**Preconditions:** Quiz in progress, all questions answered  

**Steps:**
1. Answer all 10 questions
2. Click "Complete Quiz" button
3. Confirm completion

**Expected Result:**
- Quiz status changed to "completed"
- Final score calculated
- Percentage calculated
- Results page displayed
- Progress updated
- Points awarded
- Achievements checked

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-QZ-006: Complete Quiz - Unanswered Questions
**Priority:** High  
**Preconditions:** Quiz in progress, some questions unanswered  

**Steps:**
1. Answer only 7 out of 10 questions
2. Click "Complete Quiz" button

**Expected Result:**
- Warning message: "3 questions unanswered"
- Option to continue or go back
- If continued, unanswered marked as incorrect
- Quiz completes with partial score

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-QZ-007: View Quiz History
**Priority:** Medium  
**Preconditions:** User has completed quizzes  

**Steps:**
1. Navigate to Dashboard or Profile
2. Click "Quiz History"

**Expected Result:**
- List of completed quizzes displayed
- Shows: date, category, score, percentage
- Sorted by date (newest first)
- Pagination if many quizzes
- Can click to view details

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

## 4. Quiz Resume Feature

### TC-QR-001: Resume Quiz After Page Refresh
**Priority:** High  
**Preconditions:** Quiz in progress, 2 out of 5 questions answered  

**Steps:**
1. Start quiz with 5 questions
2. Answer questions 1 and 2
3. Refresh the page (F5 or Cmd+R)
4. Observe dashboard

**Expected Result:**
- Dashboard shows "Resume Quiz" banner
- Banner displays: "Progress: 2/5 answered"
- Category shown correctly
- Resume button visible

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-QR-002: Resume Quiz - Restore Previous Answers
**Priority:** High  
**Preconditions:** In-progress quiz with 2/5 answered  

**Steps:**
1. Dashboard showing resume banner
2. Click "Resume Quiz" button
3. Observe quiz page

**Expected Result:**
- Quiz loads at question 3 (first unanswered)
- Questions 1 and 2 show previous answers
- Answers are marked/highlighted
- Progress bar shows 2/5
- Can navigate back to see previous answers

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-QR-003: Resume Quiz - Same Questions
**Priority:** High  
**Preconditions:** In-progress quiz  

**Steps:**
1. Start quiz, note question IDs/text
2. Answer 2 questions
3. Close browser completely
4. Reopen browser and login
5. Resume quiz
6. Compare questions

**Expected Result:**
- Exact same questions as before
- Same order
- No new random questions
- Question IDs match

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-QR-004: Prevent Starting New Quiz When One In Progress
**Priority:** High  
**Preconditions:** Quiz in progress  

**Steps:**
1. Quiz in progress (2/5 answered)
2. Navigate to Dashboard
3. Try to start a new quiz
4. Click "Start Quiz"

**Expected Result:**
- Confirmation dialog appears
- Message: "You have an unfinished quiz. Would you like to resume it?"
- Options: Yes (resume) or No (cancel)
- If Yes: navigates to in-progress quiz
- If No: stays on dashboard, no new quiz started

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-QR-005: Backend Validation - Prevent Multiple Quizzes
**Priority:** High  
**Preconditions:** Quiz in progress  

**Steps:**
1. Quiz in progress
2. Bypass frontend, make direct API call to POST /api/quiz/start
3. Observe response

**Expected Result:**
- API returns 400 Bad Request
- Error message: "You have an unfinished quiz. Please complete or abandon it before starting a new one."
- No new quiz created

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-QR-006: Resume Quiz - Accurate Progress Count
**Priority:** High  
**Preconditions:** Quiz with 5 questions, 2 answered  

**Steps:**
1. Answer questions 1 and 2
2. Refresh page
3. Check dashboard progress display

**Expected Result:**
- Progress shows: "2/5 answered" (NOT "5/5")
- Percentage: 40%
- Accurate count of answered questions

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-QR-007: Resume Quiz - All Questions Answered
**Priority:** Medium  
**Preconditions:** Quiz with all questions answered but not completed  

**Steps:**
1. Answer all 5 questions
2. Don't click "Complete Quiz"
3. Refresh page
4. Resume quiz

**Expected Result:**
- Progress: 5/5 answered
- Loads at last question
- All answers restored
- Can review and complete

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-QR-008: Resume Quiz - Non-Consecutive Answers
**Priority:** Medium  
**Preconditions:** Quiz in progress  

**Steps:**
1. Start quiz with 5 questions
2. Answer questions 1, 2, and 4 (skip 3)
3. Refresh page
4. Resume quiz

**Expected Result:**
- Progress: 3/5 answered
- Loads at question 3 (first unanswered)
- Questions 1, 2, 4 show previous answers
- Question 3 and 5 unanswered

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

## 5. Bug Hunting Hub

### TC-BH-001: View Bug Scenarios
**Priority:** High  
**Preconditions:** User logged in  

**Steps:**
1. Navigate to Bug Hunting page
2. Observe scenario list

**Expected Result:**
- All 20+ scenarios displayed
- Each shows: title, description, difficulty, category
- Scenarios organized by category
- Filter options available

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-BH-002: Filter Scenarios by Category
**Priority:** Medium  
**Preconditions:** Bug scenarios exist  

**Steps:**
1. Navigate to Bug Hunting page
2. Select category filter: "E-commerce"
3. Apply filter

**Expected Result:**
- Only e-commerce scenarios displayed
- Other categories hidden
- Count updated

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-BH-003: Launch Simulator - Shopping Cart
**Priority:** High  
**Preconditions:** User logged in  

**Steps:**
1. Navigate to Bug Hunting page
2. Select "Shopping Cart Bug" scenario
3. Click "Launch Simulator"

**Expected Result:**
- Simulator loads in new view/modal
- Interactive shopping cart interface displayed
- Can add items to cart
- Can interact with all elements
- Bugs present as designed

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-BH-004: Submit Bug Report - Valid
**Priority:** High  
**Preconditions:** Simulator launched, bug found  
**Test Data:**
- Bug Description: "Cart total incorrect when discount applied"
- Steps: "1. Add item ($100)\n2. Apply 10% discount\n3. Check total"
- Expected: "Total should be $90"
- Actual: "Total shows $100"

**Steps:**
1. Find bug in simulator
2. Click "Report Bug"
3. Fill in all fields
4. Submit

**Expected Result:**
- Bug report submitted successfully
- Matched against known bugs
- Score calculated
- Feedback provided
- Learning points shown
- Submission saved

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-BH-005: Submit Bug Report - Missing Fields
**Priority:** Medium  
**Preconditions:** Simulator launched  

**Steps:**
1. Click "Report Bug"
2. Leave "Steps to Reproduce" empty
3. Submit

**Expected Result:**
- Validation error
- Error message: "Steps to reproduce is required"
- Report not submitted

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-BH-006: Bug Hunting Progress Tracking
**Priority:** Medium  
**Preconditions:** User completed some scenarios  

**Steps:**
1. Complete 3 bug scenarios
2. Navigate to Progress or Profile
3. View bug hunting stats

**Expected Result:**
- Shows completed scenarios count: 3
- Success rate percentage
- Time spent
- Scenarios remaining

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

## 6. Progress Tracking

### TC-PT-001: View Overall Progress
**Priority:** High  
**Preconditions:** User completed some quizzes  

**Steps:**
1. Navigate to Dashboard or Progress page
2. View overall statistics

**Expected Result:**
- Total quizzes completed shown
- Total questions answered shown
- Correct/incorrect count shown
- Average score percentage shown
- Total time spent shown
- Last activity date shown

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-PT-002: View Category Progress
**Priority:** High  
**Preconditions:** User completed quizzes in multiple categories  

**Steps:**
1. Navigate to Progress page
2. View category breakdown

**Expected Result:**
- Each category listed
- Questions attempted per category
- Questions correct per category
- Average score per category
- Mastery level (0-100) shown
- Visual indicators (progress bars/charts)

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-PT-003: Study Streak - Active
**Priority:** Medium  
**Preconditions:** User studied for 5 consecutive days  

**Steps:**
1. Study on Day 1
2. Study on Day 2
3. Study on Day 3
4. Study on Day 4
5. Study on Day 5
6. Check streak

**Expected Result:**
- Current streak: 5 days
- Streak status: Active
- Visual indicator (fire icon, etc.)
- Encouragement message

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-PT-004: Study Streak - Broken
**Priority:** Medium  
**Preconditions:** User had 5-day streak, missed a day  

**Steps:**
1. Have 5-day streak
2. Don't study for 24+ hours
3. Check streak

**Expected Result:**
- Current streak: 0 days
- Longest streak: 5 days (preserved)
- Streak status: Broken
- Message: "Streak broken, start a new one!"

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-PT-005: Weak Areas Identification
**Priority:** High  
**Preconditions:** User completed quizzes with varying scores  

**Steps:**
1. Complete quizzes with:
   - Fundamentals: 90%
   - Test Techniques: 50%
   - Test Management: 55%
2. View weak areas

**Expected Result:**
- Weak areas list shows:
  - Test Techniques (50%)
  - Test Management (55%)
- Sorted by priority (lowest score first)
- Recommendations provided
- Categories above 60% not shown

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-PT-006: Progress Updates After Quiz
**Priority:** High  
**Preconditions:** User about to complete quiz  

**Steps:**
1. Note current progress stats
2. Complete a quiz with 80% score
3. Check progress stats

**Expected Result:**
- Total quizzes incremented by 1
- Total questions incremented by quiz count
- Correct answers incremented
- Average score recalculated
- Category progress updated
- Last activity date updated

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

## 7. Leaderboard System

### TC-LB-001: View Global Leaderboard
**Priority:** Medium  
**Preconditions:** Multiple users with scores  

**Steps:**
1. Navigate to Leaderboard page
2. View global rankings

**Expected Result:**
- Top 100 users displayed
- Sorted by total score (highest first)
- Shows: rank, username, total score, average score
- Current user's rank highlighted
- Pagination if needed

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-LB-002: View Category Leaderboard
**Priority:** Medium  
**Preconditions:** Users completed quizzes in category  

**Steps:**
1. Navigate to Leaderboard page
2. Select category: "Fundamentals"
3. View rankings

**Expected Result:**
- Top 50 users in Fundamentals category
- Sorted by category score
- Shows category-specific stats
- User's category rank highlighted

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-LB-003: User Rank Display
**Priority:** Medium  
**Preconditions:** User has completed quizzes  

**Steps:**
1. Navigate to Dashboard or Profile
2. View rank information

**Expected Result:**
- Global rank shown
- Category ranks shown
- Rank change indicator (up/down arrows)
- Percentile position shown

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-LB-004: Leaderboard Updates After Quiz
**Priority:** Medium  
**Preconditions:** User on leaderboard  

**Steps:**
1. Note current rank
2. Complete quiz with high score
3. Check leaderboard

**Expected Result:**
- Rank updated (improved if score high enough)
- Total score updated
- Average score recalculated
- Position change reflected

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

## 8. Achievement System

### TC-AS-001: Unlock Achievement - Quiz Milestone
**Priority:** Medium  
**Preconditions:** User completed 9 quizzes  

**Steps:**
1. Complete 10th quiz
2. Observe notification

**Expected Result:**
- Achievement unlocked: "Quiz Master - 10 Quizzes"
- Notification displayed
- Achievement added to profile
- Unlock date recorded
- Points awarded

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-AS-002: View Achievements
**Priority:** Low  
**Preconditions:** User has some achievements  

**Steps:**
1. Navigate to Profile or Achievements page
2. View achievements

**Expected Result:**
- Unlocked achievements displayed with badges
- Locked achievements shown (grayed out)
- Progress toward locked achievements shown
- Unlock dates for unlocked achievements
- Achievement descriptions

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-AS-003: Achievement Progress Tracking
**Priority:** Low  
**Preconditions:** User working toward achievement  

**Steps:**
1. View achievement: "Perfect Score - Get 100% on a quiz"
2. Complete quiz with 90%
3. Check achievement progress

**Expected Result:**
- Achievement still locked
- Progress shown: "Best score: 90%"
- Encouragement to try again

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

## 9. Admin Dashboard

### TC-AD-001: View Platform Statistics
**Priority:** High  
**Preconditions:** Admin logged in  

**Steps:**
1. Navigate to Admin Dashboard
2. View statistics section

**Expected Result:**
- Total users count shown
- Total questions count shown
- Total quizzes completed shown
- Active users (last 7 days) shown
- Question distribution by category (chart)
- Average user performance shown

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-AD-002: View All Users
**Priority:** High  
**Preconditions:** Admin logged in  

**Steps:**
1. Navigate to Admin Dashboard
2. Click "User Management"
3. View user list

**Expected Result:**
- All users displayed
- Shows: username, email, role, stats
- Pagination available
- Search functionality
- Sort options

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-AD-003: Change User Role
**Priority:** High  
**Preconditions:** Admin logged in, regular user exists  

**Steps:**
1. Navigate to User Management
2. Select a user
3. Click "Edit"
4. Change role from "user" to "admin"
5. Save

**Expected Result:**
- Role updated successfully
- User now has admin privileges
- Change logged in audit trail
- Success message displayed

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-AD-004: View Flagged Questions
**Priority:** High  
**Preconditions:** Admin logged in, flagged questions exist  

**Steps:**
1. Navigate to Admin Dashboard
2. Click "Flagged Questions"
3. View list

**Expected Result:**
- All flagged questions displayed
- Shows: question, flag reason, flagged by, date
- Can edit question
- Can resolve flag
- Can delete question

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-AD-005: Resolve Flagged Question
**Priority:** Medium  
**Preconditions:** Admin logged in, flagged question exists  

**Steps:**
1. Navigate to Flagged Questions
2. Select a flagged question
3. Edit and fix the issue
4. Click "Resolve Flag"

**Expected Result:**
- Question status changed from "flagged" to "published"
- Flag removed
- Resolution logged
- Success message displayed

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

## 10. Excel Upload System

### TC-EU-001: Download Template
**Priority:** High  
**Preconditions:** Admin logged in  

**Steps:**
1. Navigate to Question Upload page
2. Click "Download Template"

**Expected Result:**
- Excel file downloads
- File name: "question_upload_template.xlsx"
- Contains headers: question, optionA, optionB, optionC, optionD, correctAnswer, category, difficulty, explanation, tags, points, type, status
- Contains sample data row
- Columns properly formatted

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-EU-002: Upload Valid Excel File
**Priority:** High  
**Preconditions:** Admin logged in, valid Excel file prepared  
**Test Data:** Excel with 10 valid questions

**Steps:**
1. Navigate to Question Upload page
2. Click "Upload File"
3. Select valid Excel file
4. Click "Upload"

**Expected Result:**
- File uploaded successfully
- All 10 questions created
- Success message: "10 questions uploaded successfully"
- Summary shown: Total: 10, Successful: 10, Failed: 0
- Questions appear in question list

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-EU-003: Upload Excel - Missing Required Fields
**Priority:** High  
**Preconditions:** Admin logged in  
**Test Data:** Excel with row missing "category" field

**Steps:**
1. Prepare Excel with row 5 missing category
2. Upload file

**Expected Result:**
- Upload completes with errors
- Summary: Total: 10, Successful: 9, Failed: 1
- Error details shown: "Row 5: Category is required"
- 9 valid questions created
- 1 invalid question skipped

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-EU-004: Upload Excel - Invalid Correct Answer
**Priority:** High  
**Preconditions:** Admin logged in  
**Test Data:** Excel with correctAnswer = 5 (out of range)

**Steps:**
1. Prepare Excel with correctAnswer = 5 (only 4 options)
2. Upload file

**Expected Result:**
- Validation error for that row
- Error: "Correct answer must be between 0 and 3"
- Row skipped
- Other valid rows processed

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-EU-005: Upload Excel - Minimum Options Validation
**Priority:** High  
**Preconditions:** Admin logged in  
**Test Data:** Excel with only 1 option (optionA only)

**Steps:**
1. Prepare Excel with only optionA filled
2. Upload file

**Expected Result:**
- Validation error
- Error: "Minimum 2 options required"
- Row skipped

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-EU-006: Upload Excel - Invalid Difficulty
**Priority:** Medium  
**Preconditions:** Admin logged in  
**Test Data:** Excel with difficulty = "hard" (invalid)

**Steps:**
1. Prepare Excel with difficulty = "hard"
2. Upload file

**Expected Result:**
- Validation error
- Error: "Difficulty must be: foundation, advanced, or expert"
- Row skipped

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-EU-007: Upload Excel - Large File (100+ Questions)
**Priority:** Medium  
**Preconditions:** Admin logged in  
**Test Data:** Excel with 100 valid questions

**Steps:**
1. Prepare Excel with 100 questions
2. Upload file
3. Observe processing

**Expected Result:**
- File processes successfully
- All 100 questions created
- Processing time < 5 seconds
- Success message shown
- No timeout errors

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-EU-008: View Upload History
**Priority:** Low  
**Preconditions:** Admin logged in, uploads performed  

**Steps:**
1. Navigate to Question Upload page
2. View upload history section

**Expected Result:**
- List of previous uploads shown
- Shows: date, admin user, file name, total/success/failed counts
- Sorted by date (newest first)
- Can view error details for failed uploads

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

## 11. Dynamic Categories

### TC-DC-001: Auto-Create Category from Upload
**Priority:** High  
**Preconditions:** Admin logged in, new category not in system  
**Test Data:** Excel with category = "New Category"

**Steps:**
1. Prepare Excel with questions in "New Category"
2. Upload file
3. Check category list

**Expected Result:**
- Questions uploaded successfully
- "New Category" automatically created
- Category appears in category dropdown
- Category available in filters
- No manual category creation needed

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-DC-002: Fetch Categories from API
**Priority:** High  
**Preconditions:** Questions exist in multiple categories  

**Steps:**
1. Navigate to Dashboard
2. Open category dropdown
3. Observe categories

**Expected Result:**
- Categories fetched from API: GET /api/questions-upload/categories
- All existing categories shown
- No hardcoded categories
- Dynamically updated list

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-DC-003: Category Consistency Across Pages
**Priority:** Medium  
**Preconditions:** Categories exist  

**Steps:**
1. Check categories on Dashboard
2. Check categories on Questions page
3. Check categories on Leaderboard page
4. Compare lists

**Expected Result:**
- Same categories on all pages
- All use API endpoint
- Consistent formatting
- No discrepancies

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-DC-004: Category Update After New Upload
**Priority:** Medium  
**Preconditions:** Admin logged in  

**Steps:**
1. Note current categories
2. Upload questions with new category
3. Refresh category dropdown

**Expected Result:**
- New category appears immediately
- No page refresh needed
- Category list updated
- Available in all dropdowns

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

## 12. Mobile Responsiveness

### TC-MR-001: Dashboard - Mobile View (375px)
**Priority:** High  
**Preconditions:** User logged in  
**Test Device:** iPhone SE (375px width)

**Steps:**
1. Open dashboard on mobile device
2. Observe layout

**Expected Result:**
- Single column layout
- All elements visible
- No horizontal scrolling
- Touch targets min 44x44px
- Text readable (min 16px)
- Navigation accessible

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-MR-002: Quiz Page - Mobile View
**Priority:** High  
**Preconditions:** Quiz in progress  
**Test Device:** Mobile (375px)

**Steps:**
1. Take quiz on mobile device
2. Answer questions
3. Navigate between questions

**Expected Result:**
- Question text readable
- Options clearly separated
- Buttons touch-friendly
- Progress bar visible
- No overlapping elements
- Submit button accessible

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-MR-003: Admin Dashboard - Tablet View (768px)
**Priority:** Medium  
**Preconditions:** Admin logged in  
**Test Device:** iPad (768px)

**Steps:**
1. Open admin dashboard on tablet
2. View question list
3. Perform actions

**Expected Result:**
- 2-column layout
- Tables responsive
- Checkboxes touch-friendly
- Modals properly sized
- All features accessible

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-MR-004: Responsive Breakpoints
**Priority:** Medium  
**Preconditions:** None  

**Steps:**
1. Open application
2. Resize browser from 320px to 2560px
3. Observe layout changes

**Expected Result:**
- Smooth transitions at breakpoints:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
- No broken layouts
- Content adapts appropriately

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-MR-005: Touch Interactions - Mobile
**Priority:** High  
**Preconditions:** Mobile device  

**Steps:**
1. Test all interactive elements
2. Tap buttons, links, checkboxes
3. Swipe/scroll

**Expected Result:**
- All elements respond to touch
- No double-tap required
- Smooth scrolling
- No accidental clicks
- Proper touch feedback

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

## 13. Security Testing

### TC-SEC-001: SQL Injection Prevention
**Priority:** Critical  
**Preconditions:** None  
**Test Data:** Malicious input: `'; DROP TABLE users; --`

**Steps:**
1. Enter malicious SQL in search field
2. Submit

**Expected Result:**
- Input sanitized
- No SQL executed
- Safe search performed
- No database damage

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-SEC-002: XSS Prevention
**Priority:** Critical  
**Preconditions:** Admin logged in  
**Test Data:** `<script>alert('XSS')</script>`

**Steps:**
1. Create question with script tag in text
2. Save
3. View question

**Expected Result:**
- Script not executed
- Text displayed as plain text
- HTML entities escaped
- No alert shown

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-SEC-003: Unauthorized API Access
**Priority:** Critical  
**Preconditions:** No authentication token  

**Steps:**
1. Make API call to protected endpoint without token
2. Example: GET /api/quiz/user/history

**Expected Result:**
- 401 Unauthorized response
- Error message: "No token provided" or "Unauthorized"
- No data returned
- Access denied

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-SEC-004: Admin Route Protection
**Priority:** Critical  
**Preconditions:** Regular user logged in (not admin)  

**Steps:**
1. Login as regular user
2. Attempt to access admin route: /admin
3. Or make API call to admin endpoint

**Expected Result:**
- 403 Forbidden response
- Error message: "Admin access required"
- Redirected to dashboard
- No admin data accessible

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-SEC-005: Rate Limiting
**Priority:** High  
**Preconditions:** None  

**Steps:**
1. Make 101 API requests within 15 minutes
2. Observe response on 101st request

**Expected Result:**
- First 100 requests succeed
- 101st request returns 429 Too Many Requests
- Error message: "Too many requests, please try again later"
- Rate limit enforced

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-SEC-006: Password Hashing
**Priority:** Critical  
**Preconditions:** None  

**Steps:**
1. Register user with password: "Test@123"
2. Check database directly
3. View password field

**Expected Result:**
- Password not stored in plain text
- bcrypt hash stored (starts with $2a$ or $2b$)
- Hash length ~60 characters
- Original password not retrievable

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-SEC-007: HTTPS Enforcement (Production)
**Priority:** High  
**Preconditions:** Production environment  

**Steps:**
1. Attempt to access site via HTTP
2. Example: http://qaarena.com

**Expected Result:**
- Automatically redirected to HTTPS
- SSL/TLS certificate valid
- Secure connection established
- No mixed content warnings

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

## 14. Performance Testing

### TC-PERF-001: Page Load Time - Dashboard
**Priority:** High  
**Preconditions:** User logged in, good network  

**Steps:**
1. Clear browser cache
2. Navigate to dashboard
3. Measure load time

**Expected Result:**
- Initial page load < 3 seconds
- Time to interactive < 3 seconds
- No blocking resources
- Smooth rendering

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-PERF-002: API Response Time - Simple Query
**Priority:** High  
**Preconditions:** None  

**Steps:**
1. Make API call: GET /api/questions/:id
2. Measure response time

**Expected Result:**
- Response time < 200ms
- Consistent performance
- No timeouts

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-PERF-003: API Response Time - Complex Query
**Priority:** High  
**Preconditions:** Large dataset  

**Steps:**
1. Make API call: GET /api/questions?category=X&difficulty=Y&page=1&limit=20
2. Measure response time

**Expected Result:**
- Response time < 500ms
- Pagination efficient
- Filters performant

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-PERF-004: Quiz Start Performance
**Priority:** High  
**Preconditions:** User logged in  

**Steps:**
1. Click "Start Quiz"
2. Measure time until first question displayed

**Expected Result:**
- Quiz starts < 1000ms
- Random selection efficient
- No lag or freeze

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-PERF-005: Excel Upload Performance
**Priority:** Medium  
**Preconditions:** Admin logged in  
**Test Data:** Excel with 100 questions

**Steps:**
1. Upload Excel file with 100 questions
2. Measure processing time

**Expected Result:**
- Processing time < 5 seconds
- No timeout
- Progress indicator shown
- Responsive during upload

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-PERF-006: Concurrent Users
**Priority:** High  
**Preconditions:** Load testing tool  

**Steps:**
1. Simulate 100 concurrent users
2. All users taking quizzes simultaneously
3. Monitor server performance

**Expected Result:**
- Server handles 100 users
- Response times remain acceptable
- No crashes or errors
- Database performs well

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

### TC-PERF-007: Database Query Performance
**Priority:** High  
**Preconditions:** Large dataset (10,000+ questions)  

**Steps:**
1. Query questions with filters
2. Check query execution time

**Expected Result:**
- Indexed queries < 50ms
- Aggregation queries < 500ms
- No full table scans
- Indexes utilized

**Actual Result:** [To be filled]  
**Status:** [Pass/Fail]

---

## Test Summary Template

| Category | Total Tests | Passed | Failed | Blocked | Pass Rate |
|----------|-------------|--------|--------|---------|-----------|
| Authentication | 7 | - | - | - | -% |
| Question Management | 10 | - | - | - | -% |
| Quiz System | 7 | - | - | - | -% |
| Quiz Resume | 8 | - | - | - | -% |
| Bug Hunting | 6 | - | - | - | -% |
| Progress Tracking | 6 | - | - | - | -% |
| Leaderboard | 4 | - | - | - | -% |
| Achievements | 3 | - | - | - | -% |
| Admin Dashboard | 5 | - | - | - | -% |
| Excel Upload | 8 | - | - | - | -% |
| Dynamic Categories | 4 | - | - | - | -% |
| Mobile Responsive | 5 | - | - | - | -% |
| Security | 7 | - | - | - | -% |
| Performance | 7 | - | - | - | -% |
| **TOTAL** | **87** | **-** | **-** | **-** | **-%** |

---

## Test Environment

**Frontend:**
- Browser: Chrome 120+, Firefox 120+, Safari 17+
- Devices: Desktop (1920x1080), Tablet (768x1024), Mobile (375x667)
- OS: Windows 11, macOS Sonoma, iOS 17, Android 14

**Backend:**
- Node.js: 18.x
- MongoDB: 6.x
- Server: Local development / Staging / Production

**Network:**
- Connection: High-speed broadband
- Latency: < 50ms
- Bandwidth: > 10 Mbps

---

## Defect Severity Levels

- **Critical**: System crash, data loss, security breach
- **High**: Major feature broken, no workaround
- **Medium**: Feature partially broken, workaround exists
- **Low**: Minor issue, cosmetic, doesn't affect functionality

---

## Test Execution Notes

- All tests should be executed in the order listed
- Prerequisites must be met before each test
- Actual results must be documented
- Screenshots should be attached for failed tests
- Defects must be logged in issue tracking system
- Retests required after bug fixes

---

**End of Test Cases Document**

*This document should be updated as new features are added or requirements change.*
