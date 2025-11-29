// Bug Hunting Application Data
// 50 Interactive UI Bugs for Learning

export const bugCategories = {
  SPELLING: 'Spelling & Grammar',
  LAYOUT: 'Layout & Alignment',
  FUNCTIONALITY: 'Functionality Issues',
  ACCESSIBILITY: 'Accessibility Problems',
  VALIDATION: 'Form Validation',
  NAVIGATION: 'Navigation Issues',
  VISUAL: 'Visual Inconsistencies',
  PERFORMANCE: 'Performance & Loading',
  RESPONSIVE: 'Responsive Design',
  SECURITY: 'Security Concerns'
};

export const bugSeverity = {
  CRITICAL: { label: 'Critical', color: 'red', points: 10 },
  HIGH: { label: 'High', color: 'orange', points: 7 },
  MEDIUM: { label: 'Medium', color: 'yellow', points: 5 },
  LOW: { label: 'Low', color: 'blue', points: 3 }
};

export const bugHuntingScenarios = [
  // Scenario 1: E-Commerce Checkout Page
  {
    id: 1,
    title: 'E-Commerce Checkout Page',
    description: 'Find bugs in this online shopping checkout form',
    difficulty: 'Easy',
    totalBugs: 8,
    bugs: [
      {
        id: 'bug-1-1',
        type: bugCategories.SPELLING,
        severity: bugSeverity.LOW,
        bugText: 'Procede to Payment',
        correctText: 'Proceed to Payment',
        location: 'Submit button',
        explanation: 'The word "Proceed" is misspelled as "Procede". This is a spelling error that affects professionalism and user trust.',
        learningPoint: 'Always check spelling on buttons and CTAs (Call-to-Action) as they are highly visible to users.',
        impact: 'Low - Does not break functionality but looks unprofessional'
      },
      {
        id: 'bug-1-2',
        type: bugCategories.VALIDATION,
        severity: bugSeverity.HIGH,
        bugText: 'Email field accepts invalid format',
        correctText: 'Email validation should reject "user@domain"',
        location: 'Email input field',
        explanation: 'The email field accepts incomplete email addresses without proper domain extension (e.g., .com, .org).',
        learningPoint: 'Email validation should check for proper format: username@domain.extension',
        impact: 'High - Can lead to failed order confirmations and lost customers'
      },
      {
        id: 'bug-1-3',
        type: bugCategories.LAYOUT,
        severity: bugSeverity.MEDIUM,
        bugText: 'Price total misaligned',
        correctText: 'Price should align with other text',
        location: 'Order summary section',
        explanation: 'The total price is not aligned with the subtotal and tax rows, creating visual inconsistency.',
        learningPoint: 'Consistent alignment improves readability and professional appearance',
        impact: 'Medium - Affects user experience and trust in the calculation'
      },
      {
        id: 'bug-1-4',
        type: bugCategories.FUNCTIONALITY,
        severity: bugSeverity.CRITICAL,
        bugText: 'Submit button clickable before terms acceptance',
        correctText: 'Button should be disabled until terms are accepted',
        location: 'Submit button',
        explanation: 'Users can submit the form without accepting terms and conditions, which is a legal requirement.',
        learningPoint: 'Critical form validations should prevent submission until all required conditions are met',
        impact: 'Critical - Legal compliance issue and poor UX'
      },
      {
        id: 'bug-1-5',
        type: bugCategories.ACCESSIBILITY,
        severity: bugSeverity.MEDIUM,
        bugText: 'No label for card number input',
        correctText: 'Add visible label "Card Number"',
        location: 'Payment section',
        explanation: 'The card number input field has no visible label, making it unclear what information is required.',
        learningPoint: 'All form inputs should have clear, visible labels for accessibility and usability',
        impact: 'Medium - Confuses users and fails accessibility standards'
      },
      {
        id: 'bug-1-6',
        type: bugCategories.VISUAL,
        severity: bugSeverity.LOW,
        bugText: 'Inconsistent button colors',
        correctText: 'Primary buttons should use the same color scheme',
        location: 'Action buttons',
        explanation: 'The "Continue Shopping" and "Proceed to Payment" buttons use different shades of the primary color.',
        learningPoint: 'Maintain consistent color schemes for similar UI elements to create visual harmony',
        impact: 'Low - Affects brand consistency and visual appeal'
      },
      {
        id: 'bug-1-7',
        type: bugCategories.VALIDATION,
        severity: bugSeverity.HIGH,
        bugText: 'Phone number accepts letters',
        correctText: 'Phone field should only accept numbers',
        location: 'Contact information',
        explanation: 'The phone number field accepts alphabetic characters, which will cause issues in the backend.',
        learningPoint: 'Input validation should match the expected data type (numeric for phone numbers)',
        impact: 'High - Can cause order processing failures'
      },
      {
        id: 'bug-1-8',
        type: bugCategories.SPELLING,
        severity: bugSeverity.LOW,
        bugText: 'Adress',
        correctText: 'Address',
        location: 'Shipping section header',
        explanation: 'The word "Address" is misspelled as "Adress" in the section header.',
        learningPoint: 'Section headers are prominent and spelling errors here are highly visible',
        impact: 'Low - Unprofessional appearance'
      }
    ]
  },

  // Scenario 2: Social Media Profile Page
  {
    id: 2,
    title: 'Social Media Profile Page',
    description: 'Identify issues in this user profile interface',
    difficulty: 'Easy',
    totalBugs: 7,
    bugs: [
      {
        id: 'bug-2-1',
        type: bugCategories.SPELLING,
        severity: bugSeverity.LOW,
        bugText: 'Freinds',
        correctText: 'Friends',
        location: 'Navigation tab',
        explanation: 'The word "Friends" is misspelled as "Freinds" in the navigation menu.',
        learningPoint: 'Common words should be spell-checked, especially in navigation elements',
        impact: 'Low - Looks unprofessional'
      },
      {
        id: 'bug-2-2',
        type: bugCategories.FUNCTIONALITY,
        severity: bugSeverity.CRITICAL,
        bugText: 'Edit button does nothing when clicked',
        correctText: 'Edit button should open profile editor',
        location: 'Profile header',
        explanation: 'The "Edit Profile" button has no click handler attached, making it non-functional.',
        learningPoint: 'All interactive elements must have proper event handlers',
        impact: 'Critical - Users cannot edit their profiles'
      },
      {
        id: 'bug-2-3',
        type: bugCategories.LAYOUT,
        severity: bugSeverity.MEDIUM,
        bugText: 'Profile picture overlaps bio text',
        correctText: 'Add proper spacing between elements',
        location: 'Profile header section',
        explanation: 'On smaller screens, the profile picture overlaps with the biography text.',
        learningPoint: 'Test layouts at different screen sizes to ensure no overlapping',
        impact: 'Medium - Makes content unreadable on mobile devices'
      },
      {
        id: 'bug-2-4',
        type: bugCategories.VISUAL,
        severity: bugSeverity.LOW,
        bugText: 'Follow button changes size on hover',
        correctText: 'Button size should remain constant',
        location: 'Profile actions',
        explanation: 'The Follow button increases in size on hover, causing layout shift.',
        learningPoint: 'Hover effects should not change element dimensions to avoid layout shifts',
        impact: 'Low - Creates jarring user experience'
      },
      {
        id: 'bug-2-5',
        type: bugCategories.ACCESSIBILITY,
        severity: bugSeverity.HIGH,
        bugText: 'Low contrast between text and background',
        correctText: 'Use WCAG compliant color contrast (4.5:1 minimum)',
        location: 'Bio section',
        explanation: 'Light gray text on white background has insufficient contrast ratio (2.1:1).',
        learningPoint: 'Text must have sufficient contrast for readability and accessibility compliance',
        impact: 'High - Makes content unreadable for users with visual impairments'
      },
      {
        id: 'bug-2-6',
        type: bugCategories.NAVIGATION,
        severity: bugSeverity.MEDIUM,
        bugText: 'Back button redirects to wrong page',
        correctText: 'Back button should return to previous page',
        location: 'Top navigation',
        explanation: 'The back button always goes to the home page instead of the previous page in history.',
        learningPoint: 'Navigation should respect user browsing history for better UX',
        impact: 'Medium - Frustrates users and breaks expected behavior'
      },
      {
        id: 'bug-2-7',
        type: bugCategories.SPELLING,
        severity: bugSeverity.LOW,
        bugText: 'Mesage',
        correctText: 'Message',
        location: 'Action button',
        explanation: 'The "Message" button is misspelled as "Mesage".',
        learningPoint: 'Button labels should be carefully reviewed as they are primary interaction points',
        impact: 'Low - Unprofessional appearance'
      }
    ]
  },

  // Scenario 3: Login & Registration Form
  {
    id: 3,
    title: 'Login & Registration Form',
    description: 'Find security and usability issues in authentication forms',
    difficulty: 'Medium',
    totalBugs: 8,
    bugs: [
      {
        id: 'bug-3-1',
        type: bugCategories.SECURITY,
        severity: bugSeverity.CRITICAL,
        bugText: 'Password visible in plain text',
        correctText: 'Password should be masked with type="password"',
        location: 'Password input field',
        explanation: 'The password field displays text in plain view instead of masking it with dots or asterisks.',
        learningPoint: 'Password fields must always use type="password" for security',
        impact: 'Critical - Security vulnerability exposing user passwords'
      },
      {
        id: 'bug-3-2',
        type: bugCategories.VALIDATION,
        severity: bugSeverity.HIGH,
        bugText: 'No password strength indicator',
        correctText: 'Add visual feedback for password strength',
        location: 'Registration form',
        explanation: 'Users have no guidance on creating strong passwords, leading to weak password choices.',
        learningPoint: 'Password strength indicators help users create secure passwords',
        impact: 'High - Leads to weak passwords and security risks'
      },
      {
        id: 'bug-3-3',
        type: bugCategories.SPELLING,
        severity: bugSeverity.LOW,
        bugText: 'Sucessfully registered',
        correctText: 'Successfully registered',
        location: 'Success message',
        explanation: 'The success message contains a spelling error: "Sucessfully" instead of "Successfully".',
        learningPoint: 'User feedback messages should be error-free as they represent system communication',
        impact: 'Low - Unprofessional appearance'
      },
      {
        id: 'bug-3-4',
        type: bugCategories.FUNCTIONALITY,
        severity: bugSeverity.HIGH,
        bugText: 'Submit button works without filling required fields',
        correctText: 'Validate required fields before submission',
        location: 'Form submission',
        explanation: 'The form can be submitted even when required fields are empty.',
        learningPoint: 'Client-side validation should prevent submission of incomplete forms',
        impact: 'High - Creates bad data and poor user experience'
      },
      {
        id: 'bug-3-5',
        type: bugCategories.ACCESSIBILITY,
        severity: bugSeverity.MEDIUM,
        bugText: 'No error message for invalid email',
        correctText: 'Display clear error message when email is invalid',
        location: 'Email validation',
        explanation: 'When users enter an invalid email, there is no feedback explaining what went wrong.',
        learningPoint: 'Error messages should be clear, specific, and helpful',
        impact: 'Medium - Users don\'t know how to fix their mistakes'
      },
      {
        id: 'bug-3-6',
        type: bugCategories.LAYOUT,
        severity: bugSeverity.MEDIUM,
        bugText: 'Form fields not vertically aligned',
        correctText: 'Align all form fields consistently',
        location: 'Form layout',
        explanation: 'Input fields have inconsistent left margins, creating a messy appearance.',
        learningPoint: 'Consistent alignment creates a professional, easy-to-scan form',
        impact: 'Medium - Affects visual appeal and usability'
      },
      {
        id: 'bug-3-7',
        type: bugCategories.VALIDATION,
        severity: bugSeverity.MEDIUM,
        bugText: 'Username allows special characters',
        correctText: 'Restrict username to alphanumeric and underscore',
        location: 'Username field',
        explanation: 'The username field accepts special characters like @, #, $ which may cause issues.',
        learningPoint: 'Input validation should match business rules and technical constraints',
        impact: 'Medium - Can cause database or URL routing issues'
      },
      {
        id: 'bug-3-8',
        type: bugCategories.SPELLING,
        severity: bugSeverity.LOW,
        bugText: 'Rember me',
        correctText: 'Remember me',
        location: 'Checkbox label',
        explanation: 'The "Remember me" checkbox label is misspelled as "Rember me".',
        learningPoint: 'Even small UI elements need spelling verification',
        impact: 'Low - Unprofessional appearance'
      }
    ]
  },

  // Scenario 4: Dashboard Analytics Page
  {
    id: 4,
    title: 'Dashboard Analytics Page',
    description: 'Spot data visualization and layout problems',
    difficulty: 'Medium',
    totalBugs: 6,
    bugs: [
      {
        id: 'bug-4-1',
        type: bugCategories.VISUAL,
        severity: bugSeverity.MEDIUM,
        bugText: 'Chart legend overlaps with data',
        correctText: 'Position legend outside chart area',
        location: 'Sales chart',
        explanation: 'The chart legend is positioned over the data points, making both hard to read.',
        learningPoint: 'Data visualizations should have clear separation between elements',
        impact: 'Medium - Makes data difficult to interpret'
      },
      {
        id: 'bug-4-2',
        type: bugCategories.SPELLING,
        severity: bugSeverity.LOW,
        bugText: 'Reveue',
        correctText: 'Revenue',
        location: 'Chart title',
        explanation: 'The word "Revenue" is misspelled as "Reveue" in the chart title.',
        learningPoint: 'Chart titles and labels are key information points and must be accurate',
        impact: 'Low - Unprofessional and confusing'
      },
      {
        id: 'bug-4-3',
        type: bugCategories.FUNCTIONALITY,
        severity: bugSeverity.HIGH,
        bugText: 'Date filter shows future dates',
        correctText: 'Disable selection of future dates for historical data',
        location: 'Date range picker',
        explanation: 'Users can select future dates when filtering historical analytics data.',
        learningPoint: 'Date pickers should have logical constraints based on data availability',
        impact: 'High - Shows no data and confuses users'
      },
      {
        id: 'bug-4-4',
        type: bugCategories.PERFORMANCE,
        severity: bugSeverity.HIGH,
        bugText: 'Dashboard loads all data at once',
        correctText: 'Implement pagination or lazy loading',
        location: 'Data table',
        explanation: 'The dashboard attempts to load thousands of records at once, causing slow performance.',
        learningPoint: 'Large datasets should be paginated or lazy-loaded for better performance',
        impact: 'High - Page becomes unresponsive'
      },
      {
        id: 'bug-4-5',
        type: bugCategories.LAYOUT,
        severity: bugSeverity.MEDIUM,
        bugText: 'Cards have inconsistent heights',
        correctText: 'Set equal heights for dashboard cards',
        location: 'Statistics cards',
        explanation: 'Dashboard stat cards have varying heights, creating a messy grid layout.',
        learningPoint: 'Grid layouts look more professional with consistent element sizing',
        impact: 'Medium - Affects visual appeal and scannability'
      },
      {
        id: 'bug-4-6',
        type: bugCategories.ACCESSIBILITY,
        severity: bugSeverity.MEDIUM,
        bugText: 'No alt text for chart images',
        correctText: 'Add descriptive alt text for screen readers',
        location: 'All charts',
        explanation: 'Charts rendered as images have no alternative text for screen reader users.',
        learningPoint: 'All visual content needs text alternatives for accessibility',
        impact: 'Medium - Excludes visually impaired users from data insights'
      }
    ]
  },

  // Scenario 5: Mobile App Settings Page
  {
    id: 5,
    title: 'Mobile App Settings Page',
    description: 'Find responsive design and mobile-specific issues',
    difficulty: 'Hard',
    totalBugs: 7,
    bugs: [
      {
        id: 'bug-5-1',
        type: bugCategories.RESPONSIVE,
        severity: bugSeverity.HIGH,
        bugText: 'Text truncated on small screens',
        correctText: 'Implement text wrapping or responsive font sizes',
        location: 'Settings labels',
        explanation: 'Long setting names are cut off on mobile devices without any indication.',
        learningPoint: 'Text should wrap or scale appropriately on different screen sizes',
        impact: 'High - Users cannot read full setting descriptions'
      },
      {
        id: 'bug-5-2',
        type: bugCategories.FUNCTIONALITY,
        severity: bugSeverity.CRITICAL,
        bugText: 'Toggle switches don\'t update state',
        correctText: 'Implement proper state management for toggles',
        location: 'Notification settings',
        explanation: 'Toggle switches animate but don\'t actually save the changed state.',
        learningPoint: 'Visual feedback must match actual functionality',
        impact: 'Critical - Settings changes are not saved'
      },
      {
        id: 'bug-5-3',
        type: bugCategories.SPELLING,
        severity: bugSeverity.LOW,
        bugText: 'Notifcations',
        correctText: 'Notifications',
        location: 'Section header',
        explanation: 'The word "Notifications" is misspelled as "Notifcations".',
        learningPoint: 'Headers are prominent UI elements that need careful proofreading',
        impact: 'Low - Unprofessional appearance'
      },
      {
        id: 'bug-5-4',
        type: bugCategories.LAYOUT,
        severity: bugSeverity.MEDIUM,
        bugText: 'Buttons too small for touch targets',
        correctText: 'Increase button size to minimum 44x44px',
        location: 'Action buttons',
        explanation: 'Buttons are only 30x30px, below the recommended 44x44px minimum for touch targets.',
        learningPoint: 'Mobile touch targets should be at least 44x44px for easy tapping',
        impact: 'Medium - Difficult to tap accurately, frustrating users'
      },
      {
        id: 'bug-5-5',
        type: bugCategories.NAVIGATION,
        severity: bugSeverity.HIGH,
        bugText: 'Back button missing on sub-pages',
        correctText: 'Add back navigation on all sub-pages',
        location: 'Navigation',
        explanation: 'Users can navigate into sub-settings but have no way to go back without using browser controls.',
        learningPoint: 'All pages should have clear navigation paths back to parent pages',
        impact: 'High - Users get stuck in sub-pages'
      },
      {
        id: 'bug-5-6',
        type: bugCategories.VISUAL,
        severity: bugSeverity.LOW,
        bugText: 'Inconsistent icon sizes',
        correctText: 'Standardize icon dimensions',
        location: 'Settings menu',
        explanation: 'Icons next to settings options vary in size from 16px to 28px.',
        learningPoint: 'Consistent icon sizing creates visual harmony',
        impact: 'Low - Looks unprofessional'
      },
      {
        id: 'bug-5-7',
        type: bugCategories.ACCESSIBILITY,
        severity: bugSeverity.MEDIUM,
        bugText: 'No focus indicators on keyboard navigation',
        correctText: 'Add visible focus states for keyboard users',
        location: 'All interactive elements',
        explanation: 'When navigating with keyboard, there\'s no visual indication of which element has focus.',
        learningPoint: 'Keyboard users need clear focus indicators to navigate effectively',
        impact: 'Medium - Makes keyboard navigation impossible'
      }
    ]
  },

  // Scenario 6: Blog Article Page
  {
    id: 6,
    title: 'Blog Article Page',
    description: 'Identify content and readability issues',
    difficulty: 'Easy',
    totalBugs: 6,
    bugs: [
      {
        id: 'bug-6-1',
        type: bugCategories.SPELLING,
        severity: bugSeverity.LOW,
        bugText: 'Publised on',
        correctText: 'Published on',
        location: 'Article metadata',
        explanation: 'The word "Published" is misspelled as "Publised".',
        learningPoint: 'Metadata is part of the user experience and needs to be error-free',
        impact: 'Low - Unprofessional appearance'
      },
      {
        id: 'bug-6-2',
        type: bugCategories.LAYOUT,
        severity: bugSeverity.MEDIUM,
        bugText: 'Images not responsive',
        correctText: 'Add max-width: 100% to images',
        location: 'Article images',
        explanation: 'Images overflow their container on smaller screens.',
        learningPoint: 'Images should scale responsively to fit their containers',
        impact: 'Medium - Breaks layout on mobile devices'
      },
      {
        id: 'bug-6-3',
        type: bugCategories.ACCESSIBILITY,
        severity: bugSeverity.HIGH,
        bugText: 'No heading hierarchy (h1, h2, h3)',
        correctText: 'Use proper heading levels for structure',
        location: 'Article content',
        explanation: 'All headings use h2 tags regardless of their hierarchical level.',
        learningPoint: 'Proper heading hierarchy helps screen readers and SEO',
        impact: 'High - Poor accessibility and SEO'
      },
      {
        id: 'bug-6-4',
        type: bugCategories.FUNCTIONALITY,
        severity: bugSeverity.MEDIUM,
        bugText: 'Share buttons don\'t include article URL',
        correctText: 'Pre-populate share links with current article URL',
        location: 'Social share buttons',
        explanation: 'Clicking share buttons opens social media but doesn\'t include the article link.',
        learningPoint: 'Share functionality should make it easy to share specific content',
        impact: 'Medium - Users cannot easily share the article'
      },
      {
        id: 'bug-6-5',
        type: bugCategories.VISUAL,
        severity: bugSeverity.LOW,
        bugText: 'Line height too tight for body text',
        correctText: 'Increase line-height to 1.6 for better readability',
        location: 'Article body',
        explanation: 'Body text has a line-height of 1.2, making it cramped and hard to read.',
        learningPoint: 'Optimal line-height for body text is typically 1.5-1.8',
        impact: 'Low - Reduces readability'
      },
      {
        id: 'bug-6-6',
        type: bugCategories.SPELLING,
        severity: bugSeverity.LOW,
        bugText: 'Coments',
        correctText: 'Comments',
        location: 'Comments section header',
        explanation: 'The word "Comments" is misspelled as "Coments".',
        learningPoint: 'Section headers are highly visible and need careful review',
        impact: 'Low - Unprofessional appearance'
      }
    ]
  }
];

// Helper functions
export const getTotalBugsCount = () => {
  return bugHuntingScenarios.reduce((total, scenario) => total + scenario.totalBugs, 0);
};

export const getBugsByCategory = (category) => {
  const bugs = [];
  bugHuntingScenarios.forEach(scenario => {
    scenario.bugs.forEach(bug => {
      if (bug.type === category) {
        bugs.push({ ...bug, scenarioTitle: scenario.title });
      }
    });
  });
  return bugs;
};

export const getBugsBySeverity = (severity) => {
  const bugs = [];
  bugHuntingScenarios.forEach(scenario => {
    scenario.bugs.forEach(bug => {
      if (bug.severity.label === severity) {
        bugs.push({ ...bug, scenarioTitle: scenario.title });
      }
    });
  });
  return bugs;
};

export const calculateScore = (foundBugs) => {
  return foundBugs.reduce((total, bug) => total + bug.severity.points, 0);
};
