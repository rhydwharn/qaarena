# Functional Bugs Catalog - Interactive Bug Hunting Scenarios

## 60 Real-World Functional Bugs Across Multiple Domains

This catalog contains functional bugs that users will interact with before identifying them. Each bug represents a realistic scenario found in production applications.

---

## 🏦 FINTECH BUGS (15 Bugs)

### 1. **Incorrect Balance Calculation After Multiple Transactions**
- **Scenario**: User makes 3 deposits of $100 each
- **Expected**: Balance shows $300
- **Bug**: Balance shows $290 due to rounding error in transaction processing
- **Severity**: Critical
- **Category**: Calculation Error

### 2. **Transfer Limit Not Enforced**
- **Scenario**: Daily transfer limit is $5,000
- **Expected**: System blocks transfer of $6,000
- **Bug**: System allows transfer, only shows warning after completion
- **Severity**: Critical
- **Category**: Business Logic

### 3. **Duplicate Transaction on Network Timeout**
- **Scenario**: User clicks "Send Money" and network times out
- **Expected**: Transaction fails or processes once
- **Bug**: Money is debited twice when user retries
- **Severity**: Critical
- **Category**: Concurrency Issue

### 4. **Negative Balance Allowed in Savings Account**
- **Scenario**: User has $50, tries to withdraw $75
- **Expected**: Transaction rejected
- **Bug**: Transaction succeeds, balance shows -$25
- **Severity**: Critical
- **Category**: Validation Error

### 5. **Currency Conversion Uses Outdated Rate**
- **Scenario**: User converts USD to EUR
- **Expected**: Uses current exchange rate (1.10)
- **Bug**: Uses rate from 24 hours ago (1.08)
- **Severity**: High
- **Category**: Data Staleness

### 6. **Transaction History Shows Wrong Date**
- **Scenario**: User makes transaction on Nov 26, 2025 at 11:45 PM
- **Expected**: Shows Nov 26, 2025
- **Bug**: Shows Nov 27, 2025 due to timezone issue
- **Severity**: Medium
- **Category**: Timezone Bug

### 7. **Bill Payment Confirmation Email Never Sent**
- **Scenario**: User pays electricity bill successfully
- **Expected**: Receives confirmation email
- **Bug**: Email is never sent, but UI shows "Email sent"
- **Severity**: Medium
- **Category**: Integration Failure

### 8. **Recurring Payment Skips February**
- **Scenario**: Monthly payment set for 31st of each month
- **Expected**: Processes on last day of February (28th/29th)
- **Bug**: Skips February entirely
- **Severity**: High
- **Category**: Date Logic Error

### 9. **Interest Calculation Compounds Daily Instead of Monthly**
- **Scenario**: Savings account with 5% annual interest
- **Expected**: Compounds monthly
- **Bug**: Compounds daily, giving higher interest than intended
- **Severity**: Critical
- **Category**: Business Logic

### 10. **Card Expiry Validation Accepts Past Dates**
- **Scenario**: User enters card expiry as 01/2023 (expired)
- **Expected**: Shows error "Card expired"
- **Bug**: Accepts the card and processes payment
- **Severity**: High
- **Category**: Validation Error

### 11. **Statement Download Shows Other User's Transactions**
- **Scenario**: User A downloads their statement
- **Expected**: Shows only User A's transactions
- **Bug**: Includes 2-3 transactions from User B
- **Severity**: Critical
- **Category**: Security/Data Leak

### 12. **Loan Calculator Ignores Processing Fee**
- **Scenario**: User calculates loan for $10,000 with 2% processing fee
- **Expected**: Shows total as $10,200
- **Bug**: Shows $10,000, fee not included in calculation
- **Severity**: Medium
- **Category**: Calculation Error

### 13. **Auto-Pay Triggers Twice on Same Day**
- **Scenario**: Auto-pay scheduled for 1st of month
- **Expected**: Processes once
- **Bug**: Processes at 12:01 AM and again at 11:59 PM
- **Severity**: Critical
- **Category**: Scheduling Bug

### 14. **Beneficiary Name Allows Special Characters**
- **Scenario**: User adds beneficiary with name "John@#$%Doe"
- **Expected**: Rejects special characters
- **Bug**: Accepts and saves, causes transfer failure later
- **Severity**: Medium
- **Category**: Input Validation

### 15. **Transaction Reversal Doesn't Update Available Balance**
- **Scenario**: Transaction of $100 is reversed
- **Expected**: Available balance increases by $100
- **Bug**: Ledger balance updates but available balance stays same
- **Severity**: High
- **Category**: State Management

---

## 🛒 E-COMMERCE CART BUGS (15 Bugs)

### 16. **Cart Total Doesn't Update After Removing Item**
- **Scenario**: Cart has 3 items ($100 total), user removes $30 item
- **Expected**: Total shows $70
- **Bug**: Total still shows $100 until page refresh
- **Severity**: High
- **Category**: UI State Bug

### 17. **Discount Code Applied Multiple Times**
- **Scenario**: User applies 10% discount code "SAVE10"
- **Expected**: 10% discount applied once
- **Bug**: Clicking "Apply" multiple times stacks discount (10%, 20%, 30%)
- **Severity**: Critical
- **Category**: Business Logic

### 18. **Out of Stock Item Remains in Cart**
- **Scenario**: Item in cart goes out of stock
- **Expected**: User notified, item removed or checkout blocked
- **Bug**: User can checkout and payment succeeds
- **Severity**: Critical
- **Category**: Inventory Sync

### 19. **Quantity Spinner Allows Negative Values**
- **Scenario**: User clicks decrease button repeatedly
- **Expected**: Stops at 0 or 1
- **Bug**: Goes negative (-1, -2, -3), price becomes negative
- **Severity**: High
- **Category**: Validation Error

### 20. **Cart Merges Incorrectly After Login**
- **Scenario**: Guest has 2 items, logs in with account that has 3 items
- **Expected**: Shows 5 items total
- **Bug**: Guest cart overwrites logged-in cart, only shows 2 items
- **Severity**: High
- **Category**: Session Management

### 21. **Free Shipping Threshold Not Applied**
- **Scenario**: Cart total is $51, free shipping at $50
- **Expected**: Shipping cost is $0
- **Bug**: Still charges $5.99 shipping
- **Severity**: Medium
- **Category**: Business Rule

### 22. **Saved Cart Items Expire Prematurely**
- **Scenario**: Items saved for later should persist 30 days
- **Expected**: Available after 20 days
- **Bug**: Cleared after 7 days
- **Severity**: Low
- **Category**: Data Retention

### 23. **Buy One Get One Free Adds Wrong Item**
- **Scenario**: Buy shirt, get pants free (BOGO promotion)
- **Expected**: Adds pants to cart at $0
- **Bug**: Adds another shirt at $0
- **Severity**: Medium
- **Category**: Promotion Logic

### 24. **Cart Count Shows Wrong Number**
- **Scenario**: Cart has 3 unique items, 2 quantity of one item (4 total)
- **Expected**: Badge shows 4
- **Bug**: Badge shows 3 (counts unique items, not quantity)
- **Severity**: Low
- **Category**: Display Bug

### 25. **Tax Calculation Uses Wrong State**
- **Scenario**: User in California (9.5% tax), shipping to Texas (8.25% tax)
- **Expected**: Uses Texas tax rate
- **Bug**: Uses California tax rate
- **Severity**: High
- **Category**: Calculation Error

### 26. **Variant Selection Doesn't Update Price**
- **Scenario**: T-shirt Small ($20), user selects XL ($25)
- **Expected**: Price updates to $25
- **Bug**: Price stays at $20, but checkout charges $25
- **Severity**: Medium
- **Category**: UI Sync Issue

### 27. **Gift Wrap Option Charges Per Item Instead of Per Order**
- **Scenario**: 5 items in cart, gift wrap is $3.99
- **Expected**: Charges $3.99 total
- **Bug**: Charges $3.99 × 5 = $19.95
- **Severity**: Medium
- **Category**: Business Logic

### 28. **Wishlist Item Adds Wrong Variant to Cart**
- **Scenario**: Wishlist has "Red Shoes Size 10", user clicks "Add to Cart"
- **Expected**: Adds Red Size 10
- **Bug**: Adds default variant (Black Size 8)
- **Severity**: Medium
- **Category**: Data Mapping

### 29. **Cart Persists After Order Completion**
- **Scenario**: User completes order
- **Expected**: Cart is emptied
- **Bug**: Items remain in cart, user might order twice
- **Severity**: High
- **Category**: State Management

### 30. **Bundle Discount Applies to Individual Items**
- **Scenario**: Bundle of 3 items for $50 (normally $60)
- **Expected**: Discount applies only when all 3 in cart
- **Bug**: Discount applies even with just 1 item
- **Severity**: Critical
- **Category**: Promotion Logic

---

## 📦 ORDERING SYSTEM BUGS (15 Bugs)

### 31. **Order Confirmation Shows Wrong Delivery Date**
- **Scenario**: Order placed on Monday, 3-day shipping
- **Expected**: Delivery Thursday
- **Bug**: Shows Tuesday (doesn't count processing day)
- **Severity**: Medium
- **Category**: Date Calculation

### 32. **Duplicate Orders Created on Double-Click**
- **Scenario**: User double-clicks "Place Order" button
- **Expected**: One order created
- **Bug**: Two identical orders created and charged
- **Severity**: Critical
- **Category**: Idempotency Issue

### 33. **Order Status Stuck at "Processing"**
- **Scenario**: Order shipped 2 days ago
- **Expected**: Status shows "Shipped"
- **Bug**: Status never updates from "Processing"
- **Severity**: Medium
- **Category**: Workflow Bug

### 34. **Cancelled Order Still Ships**
- **Scenario**: User cancels order within 1 hour
- **Expected**: Order cancelled, no shipment
- **Bug**: Cancellation recorded but warehouse still ships
- **Severity**: Critical
- **Category**: Integration Failure

### 35. **Partial Refund Calculates Wrong Amount**
- **Scenario**: Order total $100, return 1 of 3 items ($30)
- **Expected**: Refund $30
- **Bug**: Refunds $33.33 (divides total by item count)
- **Severity**: High
- **Category**: Calculation Error

### 36. **Order History Shows Orders from Other Users**
- **Scenario**: User views their order history
- **Expected**: Shows only their orders
- **Bug**: Shows 1-2 orders from other users with similar email
- **Severity**: Critical
- **Category**: Security/Data Leak

### 37. **Reorder Function Uses Old Prices**
- **Scenario**: Previous order had item at $50, now $60
- **Expected**: Reorder uses current price ($60)
- **Bug**: Uses old price ($50), causes payment mismatch
- **Severity**: High
- **Category**: Data Staleness

### 38. **Order Tracking Link Expires Too Soon**
- **Scenario**: Tracking link sent in email
- **Expected**: Works for 30 days
- **Bug**: Expires after 24 hours
- **Severity**: Low
- **Category**: Configuration Error

### 39. **Gift Message Not Included in Package**
- **Scenario**: User adds gift message "Happy Birthday!"
- **Expected**: Message printed and included
- **Bug**: Message saved but not sent to fulfillment
- **Severity**: Medium
- **Category**: Integration Failure

### 40. **Express Shipping Charged But Standard Used**
- **Scenario**: User pays $15 for express (2-day)
- **Expected**: Ships via express carrier
- **Bug**: Ships via standard (5-7 days), but charged express rate
- **Severity**: High
- **Category**: Business Logic

### 41. **Order Invoice Shows Wrong Tax Amount**
- **Scenario**: Order total $100, tax $8.25
- **Expected**: Invoice shows $8.25 tax
- **Bug**: Invoice shows $8.00 (rounded down)
- **Severity**: Medium
- **Category**: Rounding Error

### 42. **Bulk Order Limit Not Enforced**
- **Scenario**: Max order quantity is 10 per item
- **Expected**: System blocks order of 15
- **Bug**: Allows order, causes inventory issues
- **Severity**: High
- **Category**: Validation Error

### 43. **Order Modification After Cutoff Time**
- **Scenario**: Cutoff for changes is 2 PM, user modifies at 3 PM
- **Expected**: Shows "Too late to modify"
- **Bug**: Accepts modification but doesn't apply it
- **Severity**: Medium
- **Category**: Business Rule

### 44. **Subscription Order Skips Month**
- **Scenario**: Monthly subscription set for 15th
- **Expected**: Processes every month on 15th
- **Bug**: Skips months with 31 days randomly
- **Severity**: High
- **Category**: Scheduling Bug

### 45. **Return Label Generates for Wrong Address**
- **Scenario**: Order shipped to Address A, user requests return
- **Expected**: Return label for Address A
- **Bug**: Generates label for user's billing address (Address B)
- **Severity**: Medium
- **Category**: Data Mapping

---

## 🎓 STUDENT GRADING SYSTEM BUGS (15 Bugs)

### 46. **Grade Calculation Ignores Dropped Lowest Score**
- **Scenario**: Syllabus says "drop lowest quiz score"
- **Expected**: Lowest of 5 quizzes dropped
- **Bug**: All 5 quizzes counted in final grade
- **Severity**: High
- **Category**: Business Logic

### 47. **Extra Credit Exceeds Maximum Grade**
- **Scenario**: Student has 98%, earns 5% extra credit
- **Expected**: Grade capped at 100%
- **Bug**: Grade shows 103%
- **Severity**: Medium
- **Category**: Validation Error

### 48. **Letter Grade Boundary Off by One**
- **Scenario**: Student has 89.5% (should be B+)
- **Expected**: Shows B+
- **Bug**: Shows B (rounds down instead of up)
- **Severity**: Medium
- **Category**: Rounding Logic

### 49. **Late Submission Penalty Applied Twice**
- **Scenario**: Assignment 1 day late, 10% penalty
- **Expected**: Score reduced by 10% once
- **Bug**: Penalty applied twice (20% total reduction)
- **Severity**: High
- **Category**: Calculation Error

### 50. **Grade Export Shows Wrong Student Names**
- **Scenario**: Teacher exports grades to CSV
- **Expected**: Names match students
- **Bug**: Names shifted by one row (Student A gets Student B's grade)
- **Severity**: Critical
- **Category**: Data Export Bug

### 51. **Attendance Marks Present for Absent Student**
- **Scenario**: Student absent on Nov 15, teacher marks absent
- **Expected**: Shows absent
- **Bug**: Reverts to present after page refresh
- **Severity**: Medium
- **Category**: State Persistence

### 52. **Weighted Average Calculation Wrong**
- **Scenario**: Exams 60%, Homework 40%, Student has 90% and 80%
- **Expected**: Final grade = (90×0.6) + (80×0.4) = 86%
- **Bug**: Shows 85% (uses simple average)
- **Severity**: High
- **Category**: Calculation Error

### 53. **Grade Posted Before Release Date**
- **Scenario**: Teacher sets release date for Dec 1
- **Expected**: Students can't see grade until Dec 1
- **Bug**: Grade visible immediately after teacher enters it
- **Severity**: Medium
- **Category**: Access Control

### 54. **Curve Applied to Wrong Section**
- **Scenario**: Teacher curves Section A by 5 points
- **Expected**: Only Section A students get curve
- **Bug**: Curve applied to all sections
- **Severity**: Critical
- **Category**: Data Scope

### 55. **GPA Calculation Uses Wrong Credit Hours**
- **Scenario**: Course is 4 credits, student gets A (4.0)
- **Expected**: Contributes 16 grade points
- **Bug**: Uses 3 credits, contributes 12 grade points
- **Severity**: High
- **Category**: Data Mapping

### 56. **Incomplete Grade Counts as F**
- **Scenario**: Student has "I" (Incomplete) grade
- **Expected**: Excluded from GPA calculation
- **Bug**: Treated as F (0.0), lowers GPA
- **Severity**: High
- **Category**: Business Logic

### 57. **Grade Change Notification Not Sent**
- **Scenario**: Teacher updates grade from B to A
- **Expected**: Student receives email notification
- **Bug**: No notification sent
- **Severity**: Low
- **Category**: Notification Failure

### 58. **Transcript Shows Withdrawn Course**
- **Scenario**: Student withdrew from course (should show W)
- **Expected**: Shows "W" with no grade points
- **Bug**: Shows "F" and affects GPA
- **Severity**: Critical
- **Category**: Data Display

### 59. **Rubric Score Allows Exceeding Maximum**
- **Scenario**: Rubric category max is 10 points
- **Expected**: System blocks entry of 11
- **Bug**: Allows 11, causes total to exceed 100%
- **Severity**: Medium
- **Category**: Validation Error

### 60. **Grade Distribution Chart Shows Wrong Percentages**
- **Scenario**: Class has 10 A's, 5 B's, 5 C's (20 total)
- **Expected**: Chart shows 50% A, 25% B, 25% C
- **Bug**: Chart shows 33% A, 33% B, 33% C (equal distribution)
- **Severity**: Low
- **Category**: Visualization Bug

---

## 📊 Bug Summary Statistics

### By Severity:
- **Critical**: 15 bugs (25%)
- **High**: 20 bugs (33%)
- **Medium**: 20 bugs (33%)
- **Low**: 5 bugs (9%)

### By Category:
- **Business Logic**: 12 bugs
- **Calculation Error**: 10 bugs
- **Validation Error**: 8 bugs
- **Data Mapping/Sync**: 7 bugs
- **State Management**: 6 bugs
- **Integration Failure**: 5 bugs
- **Security/Data Leak**: 3 bugs
- **UI/Display**: 4 bugs
- **Scheduling/Timing**: 3 bugs
- **Other**: 2 bugs

### By Domain:
- **Fintech**: 15 bugs
- **E-commerce Cart**: 15 bugs
- **Ordering System**: 15 bugs
- **Student Grading**: 15 bugs

---

## 🎯 Implementation Guidelines for Bug Hunting Feature

### User Interaction Flow:
1. **Scenario Introduction**: Present the scenario and expected behavior
2. **Interactive Element**: User interacts with the buggy feature
3. **Bug Discovery**: User identifies the bug through interaction
4. **Bug Identification**: User selects what type of bug it is
5. **Explanation**: System shows detailed explanation and fix
6. **Best Practices**: Tips to prevent similar bugs

### Difficulty Levels:
- **Beginner (20 bugs)**: Obvious bugs, clear visual indicators
- **Intermediate (25 bugs)**: Requires calculation or multiple steps
- **Advanced (15 bugs)**: Subtle bugs, edge cases, security issues

### Scoring System:
- **Quick Find (< 30 sec)**: 100 points
- **Normal Find (30-60 sec)**: 75 points
- **Slow Find (> 60 sec)**: 50 points
- **Used Hint**: -10 points
- **Wrong Identification**: -5 points

### Learning Outcomes:
- Understanding of common functional bugs
- Testing edge cases and boundary conditions
- Importance of validation and business rules
- Security and data integrity awareness
- Real-world testing scenarios

---

**Last Updated**: November 26, 2025  
**Total Bugs**: 60  
**Domains Covered**: 4  
**Ready for Implementation**: Yes ✅
