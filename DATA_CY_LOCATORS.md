# Data-CY Locators Reference

## Overview
This document lists all `data-cy` locators added to the QA Arena application for E2E testing with Cypress.

---

## Authentication Pages

### Login Page (`/login`)
- `login-page` - Main container
- `login-card` - Login card component
- `login-form` - Login form
- `login-email-input` - Email input field
- `login-password-input` - Password input field
- `login-submit-button` - Submit button
- `login-error-message` - Error message container
- `login-error-text` - Error message text
- `login-signup-link` - Link to signup page

### Register Page (`/register`)
- `register-page` - Main container
- `register-card` - Register card component
- `register-form` - Registration form
- `register-username-input` - Username input field
- `register-email-input` - Email input field
- `register-password-input` - Password input field
- `register-confirm-password-input` - Confirm password input field
- `register-submit-button` - Submit button
- `register-error-message` - Error message container
- `register-error-text` - Error message text
- `register-signin-link` - Link to signin page

---

## Dashboard Page (`/dashboard`)
- `dashboard-page` - Main container
- `dashboard-title` - Page title
- `dashboard-loading` - Loading indicator
- `resume-quiz-banner` - Resume quiz notification
- `resume-quiz-button` - Resume quiz button
- `resume-quiz-progress` - Quiz progress text
- `stats-total-quizzes` - Total quizzes stat card
- `stats-average-score` - Average score stat card
- `stats-study-streak` - Study streak stat card
- `stats-achievements` - Achievements stat card
- `start-quiz-card` - Start new quiz card
- `quiz-category-select` - Category dropdown
- `quiz-num-questions-input` - Number of questions input
- `quiz-all-questions-checkbox` - All questions checkbox
- `quiz-start-button` - Start quiz button
- `quiz-available-count` - Available questions count

---

## Quiz Page (`/quiz/:id`)
- `quiz-page` - Main container
- `quiz-loading` - Loading indicator
- `quiz-header` - Quiz header section
- `quiz-progress-bar` - Progress bar
- `quiz-progress-text` - Progress text (e.g., "3/10")
- `quiz-timer` - Timer display
- `quiz-question-card` - Question card
- `quiz-question-text` - Question text
- `quiz-question-number` - Question number
- `quiz-option-{index}` - Quiz option (0-3)
- `quiz-option-radio-{index}` - Radio button for option
- `quiz-submit-answer-button` - Submit answer button
- `quiz-next-button` - Next question button
- `quiz-previous-button` - Previous question button
- `quiz-complete-button` - Complete quiz button
- `quiz-feedback-correct` - Correct answer feedback
- `quiz-feedback-incorrect` - Incorrect answer feedback
- `quiz-explanation` - Answer explanation

---

## Questions Page (`/questions`)
- `questions-page` - Main container
- `questions-title` - Page title
- `questions-loading` - Loading indicator
- `resume-quiz-banner-questions` - Resume quiz banner
- `questions-search-input` - Search input
- `questions-category-filter` - Category filter dropdown
- `questions-difficulty-filter` - Difficulty filter dropdown
- `questions-clear-filters-button` - Clear filters button
- `questions-list` - Questions list container
- `question-item-{id}` - Individual question item
- `question-text-{id}` - Question text
- `question-category-{id}` - Question category badge
- `question-difficulty-{id}` - Question difficulty badge
- `questions-pagination` - Pagination controls
- `questions-page-{number}` - Page number button
- `questions-next-page` - Next page button
- `questions-prev-page` - Previous page button
- `start-quiz-section` - Start quiz section
- `start-quiz-button` - Start quiz button

---

## Admin Page (`/admin`)
- `admin-page` - Main container
- `admin-tabs` - Tab navigation
- `admin-tab-questions` - Questions tab
- `admin-tab-users` - Users tab
- `admin-tab-stats` - Statistics tab
- `admin-add-question-button` - Add question button
- `admin-question-form` - Question form
- `admin-question-text-input` - Question text input
- `admin-option-{index}-input` - Option input (A-D)
- `admin-correct-answer-select` - Correct answer dropdown
- `admin-category-select` - Category select
- `admin-difficulty-select` - Difficulty select
- `admin-save-question-button` - Save question button
- `admin-question-list` - Questions list
- `admin-question-item-{id}` - Question item
- `admin-edit-question-{id}` - Edit button
- `admin-delete-question-{id}` - Delete button
- `admin-select-question-{id}` - Checkbox for question
- `admin-select-all-questions` - Select all checkbox
- `admin-delete-selected-button` - Delete selected button
- `admin-users-list` - Users list
- `admin-user-item-{id}` - User item
- `admin-user-role-{id}` - User role badge
- `admin-stats-card-{type}` - Statistics card

---

## Question Upload Page (`/question-upload`)
- `upload-page` - Main container
- `upload-title` - Page title
- `upload-download-template-button` - Download template button
- `upload-file-input` - File input
- `upload-submit-button` - Upload button
- `upload-progress` - Upload progress indicator
- `upload-result-success` - Success message
- `upload-result-errors` - Error messages
- `upload-stats-total` - Total questions stat
- `upload-stats-success` - Successful uploads stat
- `upload-stats-failed` - Failed uploads stat

---

## Leaderboard Page (`/leaderboard`)
- `leaderboard-page` - Main container
- `leaderboard-title` - Page title
- `leaderboard-tabs` - Tab navigation
- `leaderboard-tab-global` - Global tab
- `leaderboard-tab-category` - Category tab
- `leaderboard-category-select` - Category dropdown
- `leaderboard-list` - Leaderboard list
- `leaderboard-item-{rank}` - Leaderboard item
- `leaderboard-rank-{rank}` - Rank number
- `leaderboard-username-{rank}` - Username
- `leaderboard-score-{rank}` - Score
- `leaderboard-user-rank` - Current user rank card

---

## Progress Page (`/progress`)
- `progress-page` - Main container
- `progress-title` - Page title
- `progress-overview-card` - Overview card
- `progress-total-quizzes` - Total quizzes
- `progress-average-score` - Average score
- `progress-study-streak` - Study streak
- `progress-category-breakdown` - Category breakdown section
- `progress-category-{name}` - Category progress item
- `progress-weak-areas` - Weak areas section
- `progress-activity-chart` - Activity chart
- `progress-recent-quizzes` - Recent quizzes list
- `progress-quiz-item-{id}` - Quiz history item

---

## Achievements Page (`/achievements`)
- `achievements-page` - Main container
- `achievements-title` - Page title
- `achievements-stats` - Statistics section
- `achievements-total` - Total achievements
- `achievements-unlocked` - Unlocked count
- `achievements-points` - Total points
- `achievements-grid` - Achievements grid
- `achievement-card-{id}` - Achievement card
- `achievement-icon-{id}` - Achievement icon
- `achievement-title-{id}` - Achievement title
- `achievement-description-{id}` - Achievement description
- `achievement-locked-{id}` - Locked indicator
- `achievement-unlocked-{id}` - Unlocked indicator

---

## Bug Hunting Pages

### Bug Hunting Hub (`/bug-hunting`)
- `bug-hunting-page` - Main container
- `bug-hunting-title` - Page title
- `bug-hunting-description` - Description text
- `bug-hunting-stats` - Statistics section
- `bug-hunting-scenarios-grid` - Scenarios grid
- `bug-scenario-card-{id}` - Scenario card
- `bug-scenario-title-{id}` - Scenario title
- `bug-scenario-difficulty-{id}` - Difficulty badge
- `bug-scenario-start-button-{id}` - Start button
- `bug-scenario-status-{id}` - Completion status

### Functional Bug Hunting (`/functional-bug-hunting`)
- `functional-bug-page` - Main container
- `functional-bug-title` - Page title
- `functional-bug-categories` - Categories section
- `functional-bug-category-{name}` - Category card
- `functional-bug-list` - Bugs list
- `functional-bug-item-{id}` - Bug item
- `functional-bug-start-{id}` - Start button

### Bug Scenario Page (`/bug-scenario/:id`)
- `bug-scenario-page` - Main container
- `bug-scenario-header` - Header section
- `bug-scenario-title` - Scenario title
- `bug-scenario-description` - Description
- `bug-scenario-simulator` - Simulator container
- `bug-scenario-identifier` - Bug identifier section
- `bug-scenario-submit-button` - Submit button
- `bug-scenario-hint-button` - Hint button
- `bug-scenario-feedback` - Feedback panel
- `bug-scenario-result-correct` - Correct result
- `bug-scenario-result-incorrect` - Incorrect result

---

## Navigation Components

### Navbar
- `navbar` - Main navbar
- `navbar-logo` - Logo/brand
- `navbar-home-link` - Home link
- `navbar-dashboard-link` - Dashboard link
- `navbar-questions-link` - Questions link
- `navbar-quiz-link` - Quiz link
- `navbar-bug-hunting-link` - Bug hunting link
- `navbar-leaderboard-link` - Leaderboard link
- `navbar-progress-link` - Progress link
- `navbar-achievements-link` - Achievements link
- `navbar-admin-link` - Admin link (admin only)
- `navbar-user-menu` - User menu dropdown
- `navbar-profile-button` - Profile button
- `navbar-logout-button` - Logout button
- `navbar-login-button` - Login button (guest)
- `navbar-register-button` - Register button (guest)

---

## Common Components

### Buttons
- Use descriptive names like: `{action}-button`, `{page}-{action}-button`
- Examples: `submit-button`, `cancel-button`, `save-button`

### Forms
- Use pattern: `{form-name}-{field-name}-input`
- Examples: `login-email-input`, `quiz-answer-input`

### Cards
- Use pattern: `{content-type}-card-{id}`
- Examples: `question-card-123`, `achievement-card-456`

### Lists
- Container: `{content-type}-list`
- Items: `{content-type}-item-{id}`
- Examples: `questions-list`, `question-item-789`

### Modals/Dialogs
- Container: `{purpose}-modal`
- Close button: `{purpose}-modal-close`
- Confirm button: `{purpose}-modal-confirm`
- Examples: `delete-modal`, `delete-modal-confirm`

---

## Naming Conventions

### General Rules
1. Use kebab-case (lowercase with hyphens)
2. Be descriptive but concise
3. Include context (page/component name)
4. Use consistent patterns

### Patterns
- **Pages**: `{page-name}-page`
- **Forms**: `{form-name}-form`
- **Inputs**: `{field-name}-input`
- **Buttons**: `{action}-button`
- **Links**: `{destination}-link`
- **Cards**: `{content}-card`
- **Lists**: `{content}-list`
- **Items**: `{content}-item-{id}`
- **Errors**: `{context}-error-message`
- **Loading**: `{context}-loading`

### Dynamic IDs
For items in lists or grids, append the ID:
- `question-item-{id}`
- `user-row-{id}`
- `achievement-card-{id}`

### State-based
For elements with different states:
- `button-loading`
- `button-disabled`
- `message-success`
- `message-error`

---

## Testing Examples

### Login Test
```javascript
cy.visit('/login');
cy.get('[data-cy="login-email-input"]').type('test@example.com');
cy.get('[data-cy="login-password-input"]').type('password123');
cy.get('[data-cy="login-submit-button"]').click();
cy.get('[data-cy="dashboard-page"]').should('be.visible');
```

### Start Quiz Test
```javascript
cy.get('[data-cy="quiz-category-select"]').select('Fundamentals');
cy.get('[data-cy="quiz-num-questions-input"]').clear().type('10');
cy.get('[data-cy="quiz-start-button"]').click();
cy.get('[data-cy="quiz-page"]').should('be.visible');
```

### Answer Question Test
```javascript
cy.get('[data-cy="quiz-option-0"]').click();
cy.get('[data-cy="quiz-submit-answer-button"]').click();
cy.get('[data-cy="quiz-feedback-correct"]').should('be.visible');
cy.get('[data-cy="quiz-next-button"]').click();
```

---

## Implementation Status

### ✅ Completed
- Login Page
- Register Page

### 🔄 In Progress
- Dashboard Page
- Quiz Page
- Questions Page
- Admin Page
- Other pages...

### ⏳ Pending
- All simulator components
- All modal components
- All shared UI components

---

## Notes
- All locators are unique across the application
- Locators are stable and won't change with UI updates
- Use semantic, descriptive names
- Avoid using implementation details (class names, IDs)
- Keep locators consistent with naming conventions
