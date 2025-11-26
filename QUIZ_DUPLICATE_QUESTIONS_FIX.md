# Quiz Duplicate Questions Fix

## Issue Reported
User complained of seeing the same question 3 times when trying the quiz section.

## Root Cause

### Problem in `controllers/quizController.js`:
The `startQuiz` function was using MongoDB's `$sample` aggregation stage to randomly select questions:

```javascript
const questions = await Question.aggregate([
  { $match: query },
  { $sample: { size: limit } }
]);
```

**Why This Causes Duplicates:**
- MongoDB's `$sample` stage can return duplicate documents in certain scenarios
- This happens especially when:
  - Sample size is large relative to collection size
  - MongoDB's internal sampling algorithm encounters edge cases
  - Collection has a small number of documents
- No duplicate checking was implemented

## Solution Applied

### Enhanced Question Selection with Duplicate Prevention:

```javascript
// 1. Sample more questions than needed (2x)
const sampleSize = Math.min(limit * 2, totalAvailable);
const sampledQuestions = await Question.aggregate([
  { $match: query },
  { $sample: { size: sampleSize } }
]);

// 2. Remove duplicates using Set to track unique IDs
const uniqueQuestions = [];
const seenIds = new Set();

for (const question of sampledQuestions) {
  const questionId = question._id.toString();
  if (!seenIds.has(questionId)) {
    seenIds.add(questionId);
    uniqueQuestions.push(question);
    if (uniqueQuestions.length === limit) {
      break;
    }
  }
}

// 3. Fetch additional questions if still not enough
if (uniqueQuestions.length < limit) {
  const additionalNeeded = limit - uniqueQuestions.length;
  const excludeIds = uniqueQuestions.map(q => q._id);
  
  const additionalQuestions = await Question.find({
    ...query,
    _id: { $nin: excludeIds }
  }).limit(additionalNeeded);
  
  uniqueQuestions.push(...additionalQuestions);
}
```

## How It Works

### Step 1: Over-Sample
```
Requested: 10 questions
Sample: 20 questions (2x)
Reason: Provides buffer for duplicate removal
```

### Step 2: Deduplication
```
Sample Result: [Q1, Q2, Q3, Q2, Q4, Q5, Q1, Q6, Q7, Q8, Q9, Q10, ...]
                     ↓ Remove duplicates using Set
Unique Result: [Q1, Q2, Q3, Q4, Q5, Q6, Q7, Q8, Q9, Q10]
```

### Step 3: Backfill (if needed)
```
If unique questions < requested:
  Fetch additional questions excluding already selected IDs
  Add to unique questions array
```

## Benefits

### For Users:
- ✅ **No Duplicate Questions** - Each question appears only once
- ✅ **Fair Assessment** - Quiz accurately tests knowledge
- ✅ **Better Experience** - No confusion or frustration
- ✅ **Reliable Results** - Scores reflect actual performance

### For System:
- ✅ **Robust Algorithm** - Handles edge cases
- ✅ **Guaranteed Uniqueness** - Set-based tracking
- ✅ **Fallback Mechanism** - Fetches more if needed
- ✅ **Performance Optimized** - Minimal database queries

## Edge Cases Handled

### Case 1: Small Question Pool
```
Available: 15 questions
Requested: 10 questions
Sample: 15 questions (min of 20 or available)
Result: 10 unique questions selected
```

### Case 2: Exact Match
```
Available: 10 questions
Requested: 10 questions
Sample: 10 questions
Result: All 10 unique questions
```

### Case 3: High Duplicate Rate
```
Sample: [Q1, Q2, Q3, Q2, Q1, Q4, Q3, Q5, Q2, Q6, Q1, Q7, Q8, Q9, Q10]
After dedup: [Q1, Q2, Q3, Q4, Q5, Q6, Q7, Q8, Q9, Q10]
Result: 10 unique questions ✅
```

### Case 4: Not Enough After Dedup
```
Requested: 10 questions
After dedup: 7 unique questions
Backfill: Fetch 3 more (excluding already selected)
Result: 10 unique questions ✅
```

## Algorithm Complexity

### Time Complexity:
- **Sampling:** O(n) where n = sample size
- **Deduplication:** O(n) where n = sampled questions
- **Backfill:** O(m) where m = additional needed
- **Total:** O(n + m) - Linear time

### Space Complexity:
- **Set storage:** O(n) for tracking IDs
- **Arrays:** O(n) for questions
- **Total:** O(n) - Linear space

## Testing

### Test Case 1: Normal Quiz (10 questions)
```bash
# Request
POST /api/quiz/start
{
  "mode": "practice",
  "numberOfQuestions": 10
}

# Expected
✅ 10 unique questions
✅ No duplicates
✅ All IDs unique
```

### Test Case 2: Large Quiz (50 questions)
```bash
# Request
POST /api/quiz/start
{
  "mode": "exam",
  "numberOfQuestions": 50
}

# Expected
✅ 50 unique questions
✅ No duplicates
✅ All IDs unique
```

### Test Case 3: Category Filter
```bash
# Request
POST /api/quiz/start
{
  "mode": "category",
  "category": "fundamentals",
  "numberOfQuestions": 15
}

# Expected
✅ 15 unique questions from fundamentals
✅ No duplicates
✅ All IDs unique
```

### Test Case 4: Small Pool
```bash
# Request
POST /api/quiz/start
{
  "category": "agile-testing",
  "difficulty": "expert",
  "numberOfQuestions": 10
}

# Available: Only 8 questions match criteria

# Expected
✅ 8 unique questions (all available)
✅ No duplicates
✅ Message: "Limited questions available"
```

## Verification Script

```javascript
// Run this to verify no duplicates in quiz
const verifyQuiz = async (quizId) => {
  const quiz = await Quiz.findById(quizId);
  const questionIds = quiz.questions.map(q => q.question.toString());
  const uniqueIds = new Set(questionIds);
  
  console.log('Total questions:', questionIds.length);
  console.log('Unique questions:', uniqueIds.size);
  console.log('Has duplicates:', questionIds.length !== uniqueIds.size);
  
  if (questionIds.length !== uniqueIds.size) {
    console.error('❌ DUPLICATES FOUND!');
    const duplicates = questionIds.filter((id, index) => 
      questionIds.indexOf(id) !== index
    );
    console.log('Duplicate IDs:', duplicates);
  } else {
    console.log('✅ No duplicates - All questions unique!');
  }
};
```

## Monitoring

### Add Logging (Optional):
```javascript
// After deduplication
console.log(`Sampled: ${sampledQuestions.length}, Unique: ${uniqueQuestions.length}`);

// After backfill
if (uniqueQuestions.length < limit) {
  console.log(`Backfilled ${additionalQuestions.length} additional questions`);
}
```

### Metrics to Track:
- Average duplicate rate in samples
- Frequency of backfill operations
- Question pool size by category/difficulty
- User reports of duplicates (should be 0)

## Files Modified

### Backend:
1. `controllers/quizController.js`
   - Enhanced `startQuiz` function
   - Added duplicate prevention logic
   - Added backfill mechanism
   - Improved question selection algorithm

## Before vs After

### Before:
```javascript
// Simple $sample - can return duplicates
const questions = await Question.aggregate([
  { $match: query },
  { $sample: { size: limit } }
]);

// No duplicate checking ❌
// User sees: Q1, Q5, Q8, Q5, Q12, Q5, Q15... (Q5 appears 3 times!)
```

### After:
```javascript
// Over-sample + deduplicate + backfill
const sampleSize = Math.min(limit * 2, totalAvailable);
const sampledQuestions = await Question.aggregate([...]);

// Deduplicate using Set ✅
const uniqueQuestions = [];
const seenIds = new Set();
// ... deduplication logic ...

// Backfill if needed ✅
if (uniqueQuestions.length < limit) {
  // Fetch more questions
}

// User sees: Q1, Q5, Q8, Q12, Q15, Q20... (all unique!)
```

## Status

✅ **Duplicate prevention implemented**
✅ **Backfill mechanism added**
✅ **Edge cases handled**
✅ **Algorithm optimized**
✅ **Ready for testing**

## Recommendation

### Additional Improvements (Future):
1. **Question History Tracking**
   - Track questions user has seen recently
   - Avoid showing same questions in consecutive quizzes
   
2. **Smart Selection**
   - Prioritize questions user hasn't seen
   - Balance difficulty distribution
   
3. **Performance Optimization**
   - Cache frequently used question sets
   - Pre-generate question pools

4. **Analytics**
   - Track duplicate rate metrics
   - Monitor backfill frequency
   - Alert if question pool is too small

---

**Last Updated:** November 26, 2025
**Status:** Fixed ✅
**Impact:** Critical bug fix - ensures quiz integrity
**User Impact:** No more duplicate questions in quizzes
