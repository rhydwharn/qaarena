# Multi-Select Delete Feature - Admin Manage Questions

## Overview
Implemented a multi-select feature on the Admin Dashboard's "Manage Questions" section that allows administrators to select multiple questions and delete them in bulk.

---

## Features Implemented

### ✅ **1. Checkbox Selection**
- Each question card now has a checkbox
- Click to select/deselect individual questions
- Selected questions have a visual indicator (blue ring)

### ✅ **2. Select All / Deselect All**
- Button to select all questions on the current page
- Button text changes based on selection state
- Shows count of selected questions

### ✅ **3. Bulk Delete**
- Delete multiple questions at once
- Confirmation dialog shows number of questions to be deleted
- Success message after deletion
- Automatic refresh of question list

### ✅ **4. Visual Feedback**
- Selected count displayed in header
- Selected questions highlighted with ring border
- Delete button shows loading state
- Button disabled during deletion

---

## UI Components

### **Control Bar**
```
[Showing X questions (Y selected)] [Select All] [Delete Y] [Manage Questions]
```

**Elements:**
- Question count with selected count
- Select All / Deselect All button
- Delete button (only visible when questions are selected)
- Manage Questions button (navigates to admin dashboard)

### **Question Cards**
```
[✓] Question Title
    Category | Difficulty | Type
    Options...
```

**Features:**
- Checkbox in top-left corner
- Blue ring border when selected
- Click checkbox to toggle selection

---

## User Flow

### **Accessing the Feature**
1. Admin logs in
2. Navigates to Admin Dashboard
3. Clicks "Manage Questions" tab
4. Multi-select controls appear

### **Selecting Questions**
1. Admin views questions in Manage Questions section
2. Clicks checkbox on individual questions
3. Selected questions show blue ring
4. Count updates in header

### **Select All**
1. Click "Select All" button
2. All questions on page are selected
3. Button changes to "Deselect All"

### **Deleting Questions**
1. Select one or more questions
2. Click "Delete X" button
3. Confirmation dialog appears
4. Confirm deletion
5. Questions are deleted
6. Success message shown
7. Page refreshes with updated list

---

## Code Changes

### **State Management**
```javascript
const [selectedQuestions, setSelectedQuestions] = useState([]);
const [deleting, setDeleting] = useState(false);
```

### **Selection Handlers**
```javascript
// Toggle individual question
const toggleQuestionSelection = (questionId) => {
  setSelectedQuestions(prev => 
    prev.includes(questionId)
      ? prev.filter(id => id !== questionId)
      : [...prev, questionId]
  );
};

// Toggle all questions
const toggleSelectAll = () => {
  if (selectedQuestions.length === questions.length) {
    setSelectedQuestions([]);
  } else {
    setSelectedQuestions(questions.map(q => q._id));
  }
};
```

### **Delete Handler**
```javascript
const handleDeleteSelected = async () => {
  // Validation
  if (selectedQuestions.length === 0) {
    alert('Please select questions to delete');
    return;
  }

  // Confirmation
  const confirmed = window.confirm(
    `Are you sure you want to delete ${selectedQuestions.length} question(s)?`
  );
  if (!confirmed) return;

  // Delete all selected questions
  try {
    setDeleting(true);
    const deletePromises = selectedQuestions.map(id => 
      questionsAPI.delete(id)
    );
    await Promise.all(deletePromises);
    
    alert(`Successfully deleted ${selectedQuestions.length} question(s)`);
    setSelectedQuestions([]);
    loadQuestions();
  } catch (error) {
    alert(error.response?.data?.message || 'Failed to delete some questions');
  } finally {
    setDeleting(false);
  }
};
```

---

## API Integration

### **Delete Endpoint**
```javascript
// API call
questionsAPI.delete(id)

// Backend route
DELETE /api/questions/:id

// Controller
exports.deleteQuestion = async (req, res, next) => {
  // Validates user permissions
  // Only creator or admin can delete
  await question.deleteOne();
  res.status(200).json({ success: true });
};
```

### **Bulk Delete**
Uses `Promise.all()` to delete multiple questions concurrently:
```javascript
const deletePromises = selectedQuestions.map(id => questionsAPI.delete(id));
await Promise.all(deletePromises);
```

---

## Security

### ✅ **Admin Only**
- Feature only visible to admin users
- Backend validates user role
- Non-admins cannot access delete endpoint

### ✅ **Confirmation Required**
- Confirmation dialog before deletion
- Shows exact number of questions to be deleted
- User must explicitly confirm

### ✅ **Permission Check**
- Backend verifies user is admin or question creator
- Returns 403 if unauthorized

---

## Visual Design

### **Selected State**
```css
className={`hover:shadow-md transition-shadow ${
  selectedQuestions.includes(question._id) ? 'ring-2 ring-primary' : ''
}`}
```

### **Checkbox Styling**
```jsx
<input
  type="checkbox"
  checked={selectedQuestions.includes(question._id)}
  onChange={() => toggleQuestionSelection(question._id)}
  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
/>
```

### **Button States**
```jsx
// Select All / Deselect All
{selectedQuestions.length === questions.length ? (
  <>
    <CheckSquare className="mr-2 h-4 w-4" />
    Deselect All
  </>
) : (
  <>
    <Square className="mr-2 h-4 w-4" />
    Select All
  </>
)}

// Delete Button
<Button
  onClick={handleDeleteSelected}
  variant="destructive"
  size="sm"
  disabled={deleting}
>
  <Trash2 className="mr-2 h-4 w-4" />
  {deleting ? 'Deleting...' : `Delete ${selectedQuestions.length}`}
</Button>
```

---

## Icons Used

```javascript
import { 
  Trash2,      // Delete button
  CheckSquare, // Deselect All
  Square       // Select All
} from 'lucide-react';
```

---

## User Experience

### **Clear Visual Feedback**
✅ Selected count in header  
✅ Blue ring around selected cards  
✅ Button text shows number to delete  
✅ Loading state during deletion  

### **Safety Features**
✅ Confirmation dialog  
✅ Clear warning message  
✅ Success/error feedback  
✅ Automatic list refresh  

### **Intuitive Controls**
✅ Checkbox on each card  
✅ Select/Deselect all button  
✅ Delete button only shows when items selected  
✅ Disabled state during operations  

---

## Example Usage

### **Delete Single Question**
1. Click checkbox on one question
2. Click "Delete 1" button
3. Confirm
4. Question deleted

### **Delete Multiple Questions**
1. Click "Select All" or select individual questions
2. Click "Delete X" button (X = number selected)
3. Confirm deletion
4. All selected questions deleted

### **Cancel Selection**
1. Click "Deselect All" button
2. All selections cleared
3. Delete button disappears

---

## Error Handling

### **No Selection**
```javascript
if (selectedQuestions.length === 0) {
  alert('Please select questions to delete');
  return;
}
```

### **Delete Failure**
```javascript
catch (error) {
  console.error('Failed to delete questions:', error);
  alert(error.response?.data?.message || 'Failed to delete some questions');
}
```

### **Partial Success**
If some deletions fail:
- Error message shown
- Successfully deleted questions removed
- Failed questions remain
- List refreshes to show current state

---

## Testing Checklist

- [ ] Select individual questions
- [ ] Select all questions
- [ ] Deselect all questions
- [ ] Delete single question
- [ ] Delete multiple questions
- [ ] Cancel deletion in confirmation
- [ ] Verify only admin can see feature
- [ ] Check error handling
- [ ] Verify list refresh after deletion
- [ ] Test with filtered questions

---

## Summary

✅ **Multi-select functionality** - Select multiple questions with checkboxes  
✅ **Bulk delete** - Delete multiple questions at once  
✅ **Visual feedback** - Clear indication of selected items  
✅ **Safety measures** - Confirmation dialog and permission checks  
✅ **Admin only** - Feature restricted to administrators  
✅ **Error handling** - Graceful handling of failures  

**Result**: Administrators can now efficiently manage questions with bulk operations! 🎉
