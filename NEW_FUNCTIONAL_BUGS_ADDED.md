# New Functional Bugs Added

## Summary
Added **10 new functional bugs** to the bug hunting simulator, focusing on Fintech and Authentication domains.

---

## Fintech Bugs (5 new bugs)

### FB006: Countdown Timer Goes Negative on Payment Page
- **Difficulty**: Beginner
- **Severity**: Medium
- **Bug**: Timer continues to negative values after reaching 00:00, payment button remains enabled
- **Learning**: Timer logic, session validation, UI state management

### FB007: Transaction Fee Calculated on Gross Instead of Net Amount
- **Difficulty**: Intermediate
- **Severity**: High
- **Bug**: Fee calculation uses wrong reference (original balance vs transaction amount)
- **Learning**: Calculation logic, variable scoping, sequential transaction testing

### FB008: Interest Calculation Compounds Daily Instead of Monthly
- **Difficulty**: Advanced
- **Severity**: Critical
- **Bug**: Interest compounds 30 times daily instead of once monthly
- **Learning**: Compound interest logic, date-based triggers, business rule implementation

### FB013: Withdrawal Processes Twice on Slow Network
- **Difficulty**: Advanced
- **Severity**: Critical
- **Bug**: Double-click creates duplicate transactions due to race condition
- **Learning**: Idempotency, race conditions, request deduplication, button state management

### FB015: Refund Amount Exceeds Original Payment
- **Difficulty**: Intermediate
- **Severity**: Critical
- **Bug**: System allows refund greater than original payment amount
- **Learning**: Business logic validation, transaction integrity, audit logging

---

## Authentication/Security Bugs (6 new bugs)

### FB009: Login Error Reveals User Password
- **Difficulty**: Beginner
- **Severity**: Critical
- **Bug**: Error message displays actual password in plain text
- **Learning**: Information disclosure, secure error handling, debug code removal

### FB010: Case-Sensitive Password Validation Inconsistency
- **Difficulty**: Intermediate
- **Severity**: High
- **Bug**: Password comparison converts to lowercase, allowing case-insensitive login
- **Learning**: Password hashing, validation logic, security best practices

### FB011: Account Lockout Counter Never Resets
- **Difficulty**: Intermediate
- **Severity**: High
- **Bug**: Account remains locked permanently, timeout reset logic missing
- **Learning**: State management, time-based logic, lockout mechanisms

### FB012: Session Token Doesn't Expire After Logout
- **Difficulty**: Advanced
- **Severity**: Critical
- **Bug**: Token remains valid after logout, only cleared client-side
- **Learning**: Session management, token invalidation, server-side security

### FB014: Password Reset Token Works Multiple Times
- **Difficulty**: Intermediate
- **Severity**: Critical
- **Bug**: Reset token can be reused, not invalidated after first use
- **Learning**: Token lifecycle, single-use tokens, security vulnerabilities

---

## Bug Distribution After Addition

| Domain | Count | Difficulty Levels |
|--------|-------|-------------------|
| **Fintech** | 10 | Beginner (2), Intermediate (4), Advanced (4) |
| **Authentication** | 6 | Beginner (1), Intermediate (4), Advanced (1) |
| **E-commerce** | 2 | Beginner (1), Intermediate (1) |
| **Ordering** | 2 | Beginner (1), Intermediate (1) |
| **Grading** | 2 | Intermediate (2) |
| **TOTAL** | **22** | - |

---

## Key Learning Areas Covered

### Fintech Security
- ✅ Timer logic and session management
- ✅ Transaction fee calculations
- ✅ Compound interest calculations
- ✅ Race conditions and idempotency
- ✅ Refund validation and business rules

### Authentication Security
- ✅ Information disclosure vulnerabilities
- ✅ Password validation and hashing
- ✅ Account lockout mechanisms
- ✅ Session token management
- ✅ Password reset token security
- ✅ Server-side vs client-side validation

### Common Bug Patterns
- **Calculation Errors**: Floating point, rounding, wrong references
- **Validation Missing**: Business rules not enforced
- **State Management**: Timers, counters, sessions not properly managed
- **Security Vulnerabilities**: Information disclosure, token reuse
- **Race Conditions**: Duplicate transactions, concurrent requests

---

## Testing Tips Emphasized

1. **Always test edge cases**: Zero, negative, boundary values
2. **Test time-based features**: Expiration, timeouts, resets
3. **Test sequential operations**: Multiple transactions, state changes
4. **Security testing**: Error messages, token lifecycle, session management
5. **Network conditions**: Slow network, double-clicks, race conditions

---

## Next Steps

To use these new bugs:

1. **Clear existing bugs** (if reseeding):
   ```bash
   # Connect to MongoDB and delete existing bugs
   ```

2. **Run seed script**:
   ```bash
   node scripts/seedFunctionalBugs.js
   ```

3. **Verify in database**:
   - Check that all 22 bugs are created
   - Verify bug stats are initialized

4. **Test in application**:
   - Navigate to Bug Hunting Hub
   - Select Functional Bug Hunting
   - Verify new bugs appear in the list
   - Test filtering by domain and difficulty

---

## Simulator Implementation Notes

These bugs are currently **data-only** (scenarios, descriptions, hints). To make them fully interactive:

1. Create simulator components for each bug in:
   - `/client/client/src/components/FunctionalBugs/simulators/`

2. Example simulators needed:
   - `CountdownTimerSimulator.jsx` (FB006)
   - `TransactionFeeSimulator.jsx` (FB007)
   - `InterestCalculatorSimulator.jsx` (FB008)
   - `LoginSimulator.jsx` (FB009, FB010, FB011)
   - `SessionManagementSimulator.jsx` (FB012)
   - `PasswordResetSimulator.jsx` (FB014)
   - `WithdrawalSimulator.jsx` (FB013)
   - `RefundSimulator.jsx` (FB015)

3. Register simulators in `FunctionalBugScenario.jsx`

---

## Points Distribution

| Bug ID | Title | Points | Difficulty |
|--------|-------|--------|------------|
| FB006 | Countdown Timer | 75 | Beginner |
| FB007 | Transaction Fee | 100 | Intermediate |
| FB008 | Interest Calculation | 150 | Advanced |
| FB009 | Password Disclosure | 100 | Beginner |
| FB010 | Case Sensitivity | 100 | Intermediate |
| FB011 | Lockout Reset | 100 | Intermediate |
| FB012 | Session Token | 150 | Advanced |
| FB013 | Withdrawal Race | 150 | Advanced |
| FB014 | Reset Token Reuse | 125 | Intermediate |
| FB015 | Refund Validation | 100 | Intermediate |

**Total Points Available**: 1,150 points from new bugs
