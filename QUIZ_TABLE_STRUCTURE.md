# Quiz Table Structure

## Overview
The `quizzes` collection in MongoDB stores all quiz attempts by users, including practice quizzes, exams, and timed tests.

---

## Schema Fields

### **1. Basic Information**

#### `_id`
- **Type:** ObjectId
- **Description:** Unique identifier for the quiz
- **Auto-generated:** Yes

#### `user`
- **Type:** ObjectId (Reference to User)
- **Required:** Yes
- **Description:** The user who took the quiz
- **Indexed:** Yes

#### `mode`
- **Type:** String (Enum)
- **Required:** Yes
- **Values:** 
  - `'practice'` - Practice mode
  - `'exam'` - Exam mode
  - `'timed'` - Timed quiz
  - `'category'` - Category-specific quiz
- **Description:** The mode/type of quiz

---

### **2. Questions Array**

#### `questions`
- **Type:** Array of Objects
- **Description:** All questions in the quiz with user responses

**Each question object contains:**

```javascript
{
  question: ObjectId,        // Reference to Question document
  userAnswer: [Number],      // Array of answer indices (e.g., [0] or [0, 2])
  isCorrect: Boolean,        // Whether the answer was correct
  timeSpent: Number,         // Time spent on this question (seconds)
  answeredAt: Date          // When the question was answered
}
```

**Example:**
```javascript
questions: [
  {
    question: "507f1f77bcf86cd799439011",
    userAnswer: [0],
    isCorrect: true,
    timeSpent: 45,
    answeredAt: "2025-11-26T15:30:00.000Z"
  },
  {
    question: "507f1f77bcf86cd799439012",
    userAnswer: [1, 3],
    isCorrect: false,
    timeSpent: 60,
    answeredAt: "2025-11-26T15:31:00.000Z"
  }
]
```

---

### **3. Settings Object**

#### `settings`
- **Type:** Object
- **Description:** Quiz configuration and preferences

**Fields:**

```javascript
{
  language: String,           // Default: 'en'
  category: String,           // Question category filter
  difficulty: String,         // Difficulty level
  numberOfQuestions: Number,  // Total questions in quiz
  timeLimit: Number,          // Time limit in seconds
  randomOrder: Boolean        // Default: true
}
```

**Example:**
```javascript
settings: {
  language: 'en',
  category: 'fundamentals',
  difficulty: 'foundation',
  numberOfQuestions: 10,
  timeLimit: 600,
  randomOrder: true
}
```

---

### **4. Score Object**

#### `score`
- **Type:** Object
- **Description:** Quiz results and scoring
- **Auto-calculated:** Yes (on quiz completion)

**Fields:**

```javascript
{
  correct: Number,      // Number of correct answers (default: 0)
  incorrect: Number,    // Number of incorrect answers (default: 0)
  unanswered: Number,   // Number of unanswered questions (default: 0)
  percentage: Number,   // Score percentage (default: 0)
  totalPoints: Number   // Total points earned (default: 0)
}
```

**Example:**
```javascript
score: {
  correct: 7,
  incorrect: 2,
  unanswered: 1,
  percentage: 70,
  totalPoints: 14
}
```

**Calculation Logic:**
- Runs automatically when `status` changes to `'completed'`
- `percentage = (correct / totalQuestions) * 100`
- Rounded to nearest integer

---

### **5. Status & Timing**

#### `status`
- **Type:** String (Enum)
- **Default:** `'in-progress'`
- **Values:**
  - `'in-progress'` - Quiz is currently being taken
  - `'completed'` - Quiz has been finished
  - `'abandoned'` - Quiz was started but not completed
- **Indexed:** Yes

#### `startedAt`
- **Type:** Date
- **Default:** Current timestamp
- **Description:** When the quiz was started

#### `completedAt`
- **Type:** Date
- **Description:** When the quiz was completed
- **Optional:** Yes (only set when status = 'completed')

#### `totalTime`
- **Type:** Number
- **Default:** 0
- **Description:** Total time spent on quiz (seconds)

---

### **6. Timestamps**

#### `createdAt`
- **Type:** Date
- **Auto-generated:** Yes
- **Indexed:** Yes (descending)
- **Description:** When the quiz record was created

#### `updatedAt`
- **Type:** Date
- **Auto-generated:** Yes
- **Description:** When the quiz record was last updated

---

## Indexes

### **1. User + Status Index**
```javascript
{ user: 1, status: 1 }
```
- **Purpose:** Quickly find quizzes by user and status
- **Use case:** Get all completed quizzes for a user

### **2. CreatedAt Index**
```javascript
{ createdAt: -1 }
```
- **Purpose:** Sort quizzes by creation date (newest first)
- **Use case:** Recent quiz history

---

## Pre-Save Hook

### **Automatic Score Calculation**

When a quiz is saved with `status: 'completed'`, the following happens automatically:

```javascript
quizSchema.pre('save', function(next) {
  if (this.status === 'completed') {
    const totalQuestions = this.questions.length;
    
    // Count correct answers
    this.score.correct = this.questions.filter(q => q.isCorrect === true).length;
    
    // Count incorrect answers
    this.score.incorrect = this.questions.filter(q => q.isCorrect === false).length;
    
    // Count unanswered questions
    this.score.unanswered = this.questions.filter(q => q.isCorrect === undefined).length;
    
    // Calculate percentage
    if (totalQuestions > 0) {
      this.score.percentage = Math.round((this.score.correct / totalQuestions) * 100);
    }
  }
  next();
});
```

---

## Example Quiz Document

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  user: ObjectId("507f1f77bcf86cd799439000"),
  mode: "practice",
  questions: [
    {
      question: ObjectId("507f1f77bcf86cd799439100"),
      userAnswer: [0],
      isCorrect: true,
      timeSpent: 45,
      answeredAt: ISODate("2025-11-26T15:30:00.000Z")
    },
    {
      question: ObjectId("507f1f77bcf86cd799439101"),
      userAnswer: [2],
      isCorrect: false,
      timeSpent: 60,
      answeredAt: ISODate("2025-11-26T15:31:00.000Z")
    },
    {
      question: ObjectId("507f1f77bcf86cd799439102"),
      userAnswer: [1],
      isCorrect: true,
      timeSpent: 30,
      answeredAt: ISODate("2025-11-26T15:32:00.000Z")
    }
  ],
  settings: {
    language: "en",
    category: "fundamentals",
    difficulty: "foundation",
    numberOfQuestions: 10,
    timeLimit: 600,
    randomOrder: true
  },
  score: {
    correct: 7,
    incorrect: 2,
    unanswered: 1,
    percentage: 70,
    totalPoints: 14
  },
  status: "completed",
  startedAt: ISODate("2025-11-26T15:25:00.000Z"),
  completedAt: ISODate("2025-11-26T15:35:00.000Z"),
  totalTime: 600,
  createdAt: ISODate("2025-11-26T15:25:00.000Z"),
  updatedAt: ISODate("2025-11-26T15:35:00.000Z")
}
```

---

## Common Queries

### **1. Get User's Completed Quizzes**
```javascript
Quiz.find({ 
  user: userId, 
  status: 'completed' 
})
.sort({ createdAt: -1 })
.populate('questions.question');
```

### **2. Get In-Progress Quiz**
```javascript
Quiz.findOne({ 
  user: userId, 
  status: 'in-progress' 
})
.populate('questions.question');
```

### **3. Get Quiz Statistics**
```javascript
Quiz.aggregate([
  { $match: { user: userId, status: 'completed' } },
  { $group: {
    _id: null,
    totalQuizzes: { $sum: 1 },
    avgScore: { $avg: '$score.percentage' },
    totalCorrect: { $sum: '$score.correct' }
  }}
]);
```

### **4. Get Recent Quiz History**
```javascript
Quiz.find({ user: userId })
.sort({ createdAt: -1 })
.limit(10)
.select('mode score status completedAt');
```

---

## Field Validation

### **Required Fields:**
- `user` - Must reference a valid User
- `mode` - Must be one of the enum values

### **Optional Fields:**
- All other fields have defaults or are optional

### **Enum Validations:**
- `mode`: ['practice', 'exam', 'timed', 'category']
- `status`: ['in-progress', 'completed', 'abandoned']

---

## Use Cases

### **1. Practice Quiz**
```javascript
{
  mode: 'practice',
  settings: {
    numberOfQuestions: 10,
    randomOrder: true
  }
}
```

### **2. Timed Exam**
```javascript
{
  mode: 'exam',
  settings: {
    numberOfQuestions: 40,
    timeLimit: 3600,  // 1 hour
    randomOrder: false
  }
}
```

### **3. Category-Specific Quiz**
```javascript
{
  mode: 'category',
  settings: {
    category: 'fundamentals',
    difficulty: 'foundation',
    numberOfQuestions: 15
  }
}
```

---

## Summary

The Quiz table stores:
- ✅ **User quiz attempts** with full question history
- ✅ **Answer tracking** with correctness and timing
- ✅ **Automatic scoring** on completion
- ✅ **Flexible settings** for different quiz modes
- ✅ **Status tracking** (in-progress, completed, abandoned)
- ✅ **Performance metrics** for analytics

**Key Features:**
- Auto-calculates scores on completion
- Tracks individual question performance
- Supports multiple quiz modes
- Indexed for fast queries
- Timestamps for history tracking
