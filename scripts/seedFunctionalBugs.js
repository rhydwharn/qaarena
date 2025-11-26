require('dotenv').config();
const mongoose = require('mongoose');
const FunctionalBug = require('../models/FunctionalBug');
const FunctionalBugStats = require('../models/FunctionalBugStats');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

const functionalBugs = [
  // FINTECH BUGS (15)
  {
    bugId: 'FB001',
    domain: 'fintech',
    title: 'Incorrect Balance Calculation After Multiple Transactions',
    difficulty: 'intermediate',
    severity: 'critical',
    category: 'Calculation Error',
    scenario: {
      description: 'User makes 3 deposits of $100 each',
      steps: [
        'Navigate to deposit page',
        'Enter $100 and submit',
        'Repeat deposit two more times',
        'Check account balance'
      ],
      initialState: { balance: 0, transactions: [] }
    },
    expected: 'Balance should show $300',
    actual: 'Balance shows $290 due to rounding error in transaction processing',
    bugType: 'Calculation Error',
    rootCause: 'Floating point arithmetic error - each transaction loses $0.03 due to improper rounding',
    fix: 'Use decimal data type for currency calculations instead of float',
    preventionTips: [
      'Always use decimal/money types for financial calculations',
      'Never use floating-point for currency',
      'Implement unit tests for transaction calculations',
      'Use libraries like Decimal.js or Big.js for precision'
    ],
    testingTips: [
      'Test with multiple sequential transactions',
      'Verify balance after each operation',
      'Test with various amounts including decimals',
      'Check for cumulative rounding errors'
    ],
    points: 100,
    hints: [
      'Check the balance after each deposit',
      'Calculate what the total should be manually',
      'Look for small discrepancies in the final amount'
    ],
    isActive: true
  },
  {
    bugId: 'FB002',
    domain: 'fintech',
    title: 'Transfer Limit Not Enforced',
    difficulty: 'beginner',
    severity: 'critical',
    category: 'Business Logic',
    scenario: {
      description: 'Daily transfer limit is set to $5,000',
      steps: [
        'Go to transfer money page',
        'Enter amount: $6,000',
        'Select recipient',
        'Click Transfer Now'
      ],
      initialState: { balance: 10000, dailyLimit: 5000, transferredToday: 0 }
    },
    expected: 'System should block the transfer and show error message',
    actual: 'System allows the transfer and only shows a warning after completion',
    bugType: 'Business Logic Error',
    rootCause: 'Validation check happens after transaction processing instead of before',
    fix: 'Move limit validation to pre-transaction validation layer',
    preventionTips: [
      'Validate business rules before processing',
      'Implement server-side validation',
      'Use transaction guards/middleware',
      'Test boundary conditions'
    ],
    testingTips: [
      'Test exactly at the limit ($5,000)',
      'Test just above the limit ($5,001)',
      'Test significantly above ($10,000)',
      'Verify validation happens before processing'
    ],
    points: 75,
    hints: [
      'Try transferring more than the daily limit',
      'Check when the validation message appears',
      'See if the money actually transferred'
    ],
    isActive: true
  },
  {
    bugId: 'FB003',
    domain: 'fintech',
    title: 'Duplicate Transaction on Network Timeout',
    difficulty: 'advanced',
    severity: 'critical',
    category: 'Concurrency Issue',
    scenario: {
      description: 'User clicks Send Money and network times out',
      steps: [
        'Initiate a money transfer',
        'Network timeout occurs',
        'User clicks Retry',
        'Check transaction history'
      ],
      initialState: { balance: 1000, recipient: 'John Doe', amount: 100 }
    },
    expected: 'Transaction should fail or process only once',
    actual: 'Money is debited twice when user retries',
    bugType: 'Idempotency Failure',
    rootCause: 'No transaction ID or idempotency key to prevent duplicate processing',
    fix: 'Implement idempotency keys and transaction deduplication',
    preventionTips: [
      'Use unique transaction IDs',
      'Implement idempotency tokens',
      'Check for duplicate transactions before processing',
      'Use database constraints to prevent duplicates'
    ],
    testingTips: [
      'Simulate network timeouts',
      'Test retry mechanisms',
      'Verify transaction uniqueness',
      'Check for duplicate entries in database'
    ],
    points: 150,
    hints: [
      'What happens when you retry a failed transaction?',
      'Check your transaction history carefully',
      'Look for duplicate entries with same amount and time'
    ],
    isActive: true
  },
  {
    bugId: 'FB004',
    domain: 'fintech',
    title: 'Negative Balance Allowed in Savings Account',
    difficulty: 'beginner',
    severity: 'critical',
    category: 'Validation Error',
    scenario: {
      description: 'User has $50 in savings, attempts to withdraw $75',
      steps: [
        'Check current balance: $50',
        'Go to withdrawal page',
        'Enter amount: $75',
        'Submit withdrawal'
      ],
      initialState: { accountType: 'savings', balance: 50 }
    },
    expected: 'Transaction should be rejected with insufficient funds error',
    actual: 'Transaction succeeds, balance shows -$25',
    bugType: 'Validation Error',
    rootCause: 'Missing balance validation before withdrawal processing',
    fix: 'Add balance check: if (withdrawal > balance) reject transaction',
    preventionTips: [
      'Always validate account balance before debits',
      'Implement account type rules (savings vs checking)',
      'Use database constraints for balance limits',
      'Add integration tests for overdraft scenarios'
    ],
    testingTips: [
      'Test withdrawal equal to balance',
      'Test withdrawal exceeding balance',
      'Test withdrawal with exactly $0.01 more than balance',
      'Verify different account types have correct rules'
    ],
    points: 75,
    hints: [
      'Try withdrawing more than you have',
      'Check if the system allows negative balances',
      'Should a savings account go negative?'
    ],
    isActive: true
  },
  {
    bugId: 'FB005',
    domain: 'fintech',
    title: 'Currency Conversion Uses Outdated Rate',
    difficulty: 'intermediate',
    severity: 'high',
    category: 'Data Staleness',
    scenario: {
      description: 'User converts $1000 USD to EUR',
      steps: [
        'Go to currency exchange',
        'Select USD to EUR',
        'Enter amount: $1000',
        'Check conversion rate and result'
      ],
      initialState: { amount: 1000, from: 'USD', to: 'EUR', currentRate: 1.10, cachedRate: 1.08 }
    },
    expected: 'Should use current exchange rate (1.10)',
    actual: 'Uses rate from 24 hours ago (1.08), resulting in €1080 instead of €1100',
    bugType: 'Stale Data',
    rootCause: 'Exchange rate cache not refreshed, or using wrong timestamp',
    fix: 'Implement real-time rate fetching or frequent cache updates with timestamps',
    preventionTips: [
      'Display rate timestamp to users',
      'Implement cache expiration policies',
      'Use real-time exchange rate APIs',
      'Add monitoring for stale data'
    ],
    testingTips: [
      'Compare with current market rates',
      'Check rate update frequency',
      'Verify rate timestamp display',
      'Test during market volatility'
    ],
    points: 100,
    hints: [
      'Check what exchange rate is being used',
      'Compare with current market rates online',
      'Look for a timestamp on the rate'
    ],
    isActive: true
  },
  
  // E-COMMERCE CART BUGS (5 samples - add more as needed)
  {
    bugId: 'FB016',
    domain: 'ecommerce',
    title: 'Cart Total Doesn\'t Update After Removing Item',
    difficulty: 'beginner',
    severity: 'high',
    category: 'UI State Bug',
    scenario: {
      description: 'Cart has 3 items ($100 total), user removes $30 item',
      steps: [
        'View cart with 3 items',
        'Click remove on $30 item',
        'Check cart total',
        'Refresh page and check again'
      ],
      initialState: {
        items: [
          { id: 1, name: 'Item A', price: 40 },
          { id: 2, name: 'Item B', price: 30 },
          { id: 3, name: 'Item C', price: 30 }
        ],
        total: 100
      }
    },
    expected: 'Total should immediately show $70',
    actual: 'Total still shows $100 until page refresh',
    bugType: 'UI State Bug',
    rootCause: 'Cart total state not updated when item is removed from cart',
    fix: 'Update cart total calculation in the remove item handler',
    preventionTips: [
      'Always update related state when modifying data',
      'Use state management libraries (Redux, Zustand)',
      'Implement derived state for calculated values',
      'Add unit tests for state updates'
    ],
    testingTips: [
      'Test all cart operations (add, remove, update quantity)',
      'Verify UI updates without page refresh',
      'Check cart total after each operation',
      'Test with multiple items'
    ],
    points: 75,
    hints: [
      'Remove an item and check the total',
      'Does it update immediately?',
      'Try refreshing the page'
    ],
    isActive: true
  },
  {
    bugId: 'FB017',
    domain: 'ecommerce',
    title: 'Discount Code Applied Multiple Times',
    difficulty: 'intermediate',
    severity: 'critical',
    category: 'Business Logic',
    scenario: {
      description: 'User applies 10% discount code "SAVE10"',
      steps: [
        'Add items to cart (total $100)',
        'Enter discount code "SAVE10"',
        'Click Apply button',
        'Click Apply button again multiple times',
        'Check final total'
      ],
      initialState: { subtotal: 100, discountCode: 'SAVE10', discountPercent: 10 }
    },
    expected: '10% discount applied once, total should be $90',
    actual: 'Clicking Apply multiple times stacks discount (10%, 20%, 30%)',
    bugType: 'Business Logic Error',
    rootCause: 'No check to prevent applying same discount code multiple times',
    fix: 'Add validation to check if discount already applied, disable button after first application',
    preventionTips: [
      'Track applied discounts in state',
      'Disable buttons after successful action',
      'Implement idempotency for discount application',
      'Add server-side validation'
    ],
    testingTips: [
      'Test rapid clicking of apply button',
      'Test applying same code multiple times',
      'Test applying different codes',
      'Verify discount limits are enforced'
    ],
    points: 125,
    hints: [
      'Try clicking the Apply button multiple times',
      'Watch what happens to the discount',
      'Should the same discount apply more than once?'
    ],
    isActive: true
  },
  
  // ORDERING SYSTEM BUGS (3 samples)
  {
    bugId: 'FB031',
    domain: 'ordering',
    title: 'Order Confirmation Shows Wrong Delivery Date',
    difficulty: 'intermediate',
    severity: 'medium',
    category: 'Date Calculation',
    scenario: {
      description: 'Order placed on Monday, 3-day shipping selected',
      steps: [
        'Place order on Monday',
        'Select 3-day shipping',
        'Complete order',
        'Check delivery date on confirmation'
      ],
      initialState: { orderDate: 'Monday', shippingDays: 3, processingDays: 1 }
    },
    expected: 'Delivery should be Thursday (Monday + 1 processing + 3 shipping)',
    actual: 'Shows Tuesday (doesn\'t count processing day)',
    bugType: 'Date Calculation Error',
    rootCause: 'Delivery date calculation doesn\'t include processing time',
    fix: 'Add processing days to shipping days in delivery date calculation',
    preventionTips: [
      'Document all business rules for date calculations',
      'Include processing time in estimates',
      'Test with different order days and times',
      'Consider weekends and holidays'
    ],
    testingTips: [
      'Test orders placed on different days',
      'Test with different shipping options',
      'Verify processing time is included',
      'Test orders placed near cutoff times'
    ],
    points: 100,
    hints: [
      'Count the days from order to delivery',
      'Is processing time included?',
      'Check if the calculation is correct'
    ],
    isActive: true
  },
  {
    bugId: 'FB032',
    domain: 'ordering',
    title: 'Duplicate Orders Created on Double-Click',
    difficulty: 'beginner',
    severity: 'critical',
    category: 'Idempotency Issue',
    scenario: {
      description: 'User double-clicks "Place Order" button',
      steps: [
        'Fill out order form',
        'Click "Place Order" button twice quickly',
        'Check order history',
        'Check payment charges'
      ],
      initialState: { cartTotal: 100, paymentMethod: 'Credit Card' }
    },
    expected: 'One order should be created',
    actual: 'Two identical orders created and charged',
    bugType: 'Idempotency Failure',
    rootCause: 'No button disable or request deduplication on order submission',
    fix: 'Disable button after first click, implement request deduplication',
    preventionTips: [
      'Disable submit buttons after first click',
      'Show loading state during processing',
      'Implement idempotency keys',
      'Use debouncing for critical actions'
    ],
    testingTips: [
      'Test rapid clicking of submit buttons',
      'Test slow network conditions',
      'Verify only one order is created',
      'Check payment processing'
    ],
    points: 100,
    hints: [
      'Try clicking the Place Order button multiple times quickly',
      'Check how many orders were created',
      'Were you charged multiple times?'
    ],
    isActive: true
  },
  
  // GRADING SYSTEM BUGS (2 samples)
  {
    bugId: 'FB046',
    domain: 'grading',
    title: 'Grade Calculation Ignores Dropped Lowest Score',
    difficulty: 'intermediate',
    severity: 'high',
    category: 'Business Logic',
    scenario: {
      description: 'Syllabus states "drop lowest quiz score", student has 5 quizzes',
      steps: [
        'View student quiz scores: 85, 90, 75, 88, 92',
        'Check grade calculation',
        'Verify if lowest score (75) is dropped',
        'Calculate expected grade'
      ],
      initialState: { quizScores: [85, 90, 75, 88, 92], dropLowest: true }
    },
    expected: 'Lowest score (75) should be dropped, average of remaining 4 scores = 88.75%',
    actual: 'All 5 quizzes counted, average = 86%',
    bugType: 'Business Logic Error',
    rootCause: 'Drop lowest score rule not implemented in grade calculation',
    fix: 'Sort scores, remove lowest, then calculate average',
    preventionTips: [
      'Implement all syllabus rules in code',
      'Document grading policies clearly',
      'Add unit tests for grade calculations',
      'Verify business rules with stakeholders'
    ],
    testingTips: [
      'Test with different number of scores',
      'Test when lowest score is tied',
      'Verify calculation matches syllabus',
      'Test edge cases (all same scores)'
    ],
    points: 100,
    hints: [
      'Check the syllabus grading policy',
      'Count how many quiz scores are being used',
      'Is the lowest score being dropped?'
    ],
    isActive: true
  },
  {
    bugId: 'FB052',
    domain: 'grading',
    title: 'Weighted Average Calculation Wrong',
    difficulty: 'intermediate',
    severity: 'high',
    category: 'Calculation Error',
    scenario: {
      description: 'Exams 60%, Homework 40%, Student has 90% exams and 80% homework',
      steps: [
        'Check course weights: Exams 60%, Homework 40%',
        'Student scores: Exams 90%, Homework 80%',
        'View final grade calculation',
        'Calculate expected grade manually'
      ],
      initialState: { examScore: 90, examWeight: 0.6, homeworkScore: 80, homeworkWeight: 0.4 }
    },
    expected: 'Final grade = (90 × 0.6) + (80 × 0.4) = 54 + 32 = 86%',
    actual: 'Shows 85% (uses simple average: (90 + 80) / 2)',
    bugType: 'Calculation Error',
    rootCause: 'Weighted average formula not implemented, using simple average instead',
    fix: 'Implement proper weighted average: sum(score × weight)',
    preventionTips: [
      'Use correct mathematical formulas',
      'Test calculations with known values',
      'Document calculation methods',
      'Validate with sample data'
    ],
    testingTips: [
      'Test with different weights',
      'Test with extreme values (0%, 100%)',
      'Verify weights sum to 100%',
      'Compare with manual calculations'
    ],
    points: 100,
    hints: [
      'Calculate the grade manually using the weights',
      'Is the system using weighted average?',
      'Check if it\'s just averaging the two scores'
    ],
    isActive: true
  }
];

const seedFunctionalBugs = async () => {
  try {
    await connectDB();
    
    console.log('🗑️  Checking existing functional bugs...');
    const existingCount = await FunctionalBug.countDocuments();
    
    if (existingCount > 0) {
      console.log(`ℹ️  Found ${existingCount} existing bugs. Skipping seed to preserve data.`);
      console.log('💡 To reseed, manually delete bugs from database first.');
      process.exit(0);
    }
    
    console.log('📦 Seeding functional bugs...');
    
    for (const bugData of functionalBugs) {
      await FunctionalBug.create(bugData);
      await FunctionalBugStats.create({ bugId: bugData.bugId });
      console.log(`✅ Created bug: ${bugData.bugId} - ${bugData.title}`);
    }
    
    console.log(`\n🎉 Successfully seeded ${functionalBugs.length} functional bugs!`);
    console.log('\n📊 Bug Distribution:');
    console.log(`   Fintech: 5 bugs`);
    console.log(`   E-commerce: 2 bugs`);
    console.log(`   Ordering: 2 bugs`);
    console.log(`   Grading: 2 bugs`);
    console.log(`\n💡 Note: This is a sample set. Add remaining 49 bugs using the catalog.`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed Error:', error);
    process.exit(1);
  }
};

seedFunctionalBugs();
