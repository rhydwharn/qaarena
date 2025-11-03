require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('../models/Question');
const User = require('../models/User');

async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/istqb_practice';
  await mongoose.connect(uri);
  console.log('✅ MongoDB Connected');
}

function m(text) { return new Map([['en', text]]); }

function buildSingle(questionText, options, correctIndex, category, createdBy, tags = []) {
  return {
    questionText: m(questionText),
    type: 'single-choice',
    options: options.map((t, i) => ({ text: m(t), isCorrect: i === correctIndex })),
    explanation: m(`Beginner rationale: ${options[correctIndex]} is correct for ${category}.`),
    category,
    difficulty: 'foundation',
    syllabus: 'ISTQB-CTFL-2018',
    tags: ['beginners', category, ...tags],
    points: 1,
    status: 'published',
    createdBy
  };
}

async function main() {
  try {
    await connectDB();

    let creator = await User.findOne({ role: 'admin' });
    if (!creator) creator = await User.findOne();
    if (!creator) throw new Error('No users found. Seed users first (node scripts/seedDatabase.js)');

    console.log('🗑️  Clearing existing questions...');
    await Question.deleteMany({});

    const byCat = {};

    // Fundamentals of Testing (10)
    byCat['fundamentals'] = [
      buildSingle('What is the primary purpose of software testing?',
        ['To prove the absence of defects', 'To show the presence of defects and provide information', 'To ensure code coverage is 100%', 'To replace quality assurance'], 1, 'fundamentals', creator._id, ['purpose']),
      buildSingle('Which statement aligns with ISTQB testing principle?',
        ['Exhaustive testing is possible', 'Defect clustering rarely occurs', 'Testing is context dependent', 'Absence-of-errors means useful system'], 2, 'fundamentals', creator._id, ['principles']),
      buildSingle('Which activity is NOT a typical testing objective?',
        ['Finding defects', 'Gaining confidence', 'Preventing defects', 'Guaranteeing zero defects'], 3, 'fundamentals', creator._id, ['objectives']),
      buildSingle('Which role is typically responsible for unit testing?',
        ['Developers', 'End users', 'Business analysts', 'Operations team'], 0, 'fundamentals', creator._id, ['levels']),
      buildSingle('Which is a good reason to do early testing?',
        ['It reduces cost of fixing defects', 'It increases number of test cases', 'It replaces reviews', 'It ensures 100% testing'], 0, 'fundamentals', creator._id, ['early-testing']),
      buildSingle('Which of the following describes a failure?',
        ['A mistake made by a person', 'A deviation of the software from expected result', 'The cause of a defect', 'A coding error'], 1, 'fundamentals', creator._id, ['defect-failure']),
      buildSingle('Verification is concerned with:',
        ['Are we building the product right?', 'Are we building the right product?', 'Operational acceptance', 'User validation only'], 0, 'fundamentals', creator._id, ['verification']),
      buildSingle('Validation is concerned with:',
        ['Are we building the product right?', 'Are we building the right product?', 'Design conformance only', 'Static analysis'], 1, 'fundamentals', creator._id, ['validation']),
      buildSingle('Which document describes test scope, approach, and schedule?',
        ['Test plan', 'Test case', 'Defect report', 'Traceability matrix'], 0, 'fundamentals', creator._id, ['docs']),
      buildSingle('What is testware?',
        ['Data and artifacts created during testing', 'Only automated scripts', 'Only test cases', 'Only tools used for testing'], 0, 'fundamentals', creator._id, ['artifacts'])
    ];

    // Testing Throughout SDLC (10)
    byCat['testing-throughout-sdlc'] = [
      buildSingle('When should testing activities ideally start in the SDLC?',
        ['After coding is complete', 'As early as possible', 'Only during system testing', 'Only after UAT'], 1, 'testing-throughout-sdlc', creator._id, ['early']),
      buildSingle('Which level focuses on interfaces between components?',
        ['Unit', 'Integration', 'System', 'Acceptance'], 1, 'testing-throughout-sdlc', creator._id, ['levels']),
      buildSingle('System testing is performed to validate:',
        ['Individual units', 'Component interactions only', 'The system as a whole against requirements', 'Deployment scripts'], 2, 'testing-throughout-sdlc', creator._id),
      buildSingle('Acceptance testing is primarily owned by:',
        ['Developers', 'Testers only', 'Customer/business representatives', 'Project managers'], 2, 'testing-throughout-sdlc', creator._id),
      buildSingle('Which activity is typical in requirements phase?',
        ['Code reviews', 'Static testing of specifications', 'Load testing', 'Unit tests'], 1, 'testing-throughout-sdlc', creator._id),
      buildSingle('Regression testing should be executed when:',
        ['Only new features are added', 'Changes or fixes are made', 'The project starts', 'At acceptance only'], 1, 'testing-throughout-sdlc', creator._id),
      buildSingle('Which best describes alpha testing?',
        ['Operational testing at user site', 'Testing by internal users at the developer site', 'Automated performance testing', 'Security penetration testing'], 1, 'testing-throughout-sdlc', creator._id),
      buildSingle('Beta testing is conducted by:',
        ['Independent testers in the lab', 'End users in their environment', 'Developers only', 'Auditors'], 1, 'testing-throughout-sdlc', creator._id),
      buildSingle('What is confirmed fixed during re-testing?',
        ['Related areas', 'The specific defect fix', 'All previous defects', 'Performance baseline'], 1, 'testing-throughout-sdlc', creator._id),
      buildSingle('Which artifact supports traceability across SDLC?',
        ['Code comments', 'Defect log', 'Requirements traceability matrix (RTM)', 'Build pipeline'], 2, 'testing-throughout-sdlc', creator._id)
    ];

    // Static Testing (10)
    byCat['static-testing'] = [
      buildSingle('Which are static techniques?',
        ['Reviews and static analysis', 'System tests', 'Load tests', 'Usability tests'], 0, 'static-testing', creator._id),
      buildSingle('Main benefit of static testing is:',
        ['Find defects early before execution', 'Replace dynamic tests', 'Measure performance', 'Generate code'], 0, 'static-testing', creator._id),
      buildSingle('Which work product is commonly reviewed?',
        ['Only source code', 'Requirements and designs', 'Database instances', 'Server configs only'], 1, 'static-testing', creator._id),
      buildSingle('A walkthrough is led by:',
        ['Author of the work product', 'Moderator only', 'External auditor', 'Tool vendor'], 0, 'static-testing', creator._id),
      buildSingle('An inspection requires:',
        ['Formal roles and checklists', 'No preparation', 'Only ad-hoc reading', 'Execution of code'], 0, 'static-testing', creator._id),
      buildSingle('Static analysis tools can find:',
        ['Concurrency issues and dead code', 'Missing requirements', 'All security defects', 'Only UI bugs'], 0, 'static-testing', creator._id),
      buildSingle('Entry and exit criteria for reviews help to:',
        ['Slow down the process', 'Improve consistency and effectiveness', 'Avoid documentation', 'Replace test plans'], 1, 'static-testing', creator._id),
      buildSingle('Common review outcome is:',
        ['Approved with actions', 'Performance metrics', 'Deployment plan', 'User guide'], 0, 'static-testing', creator._id),
      buildSingle('Checklists in reviews are used to:',
        ['Ensure consistent coverage of typical issues', 'Replace reviewer expertise', 'Automate execution', 'Track test cases'], 0, 'static-testing', creator._id),
      buildSingle('Which is a limitation of static testing?',
        ['Cannot find execution-related failures', 'Too expensive', 'No tool support', 'Not applicable to requirements'], 0, 'static-testing', creator._id)
    ];

    // Test Design Techniques (10)
    byCat['test-techniques'] = [
      buildSingle('Equivalence Partitioning aims to:',
        ['Test every value', 'Reduce tests by grouping inputs that should behave similarly', 'Test only boundaries', 'Test internal code paths'], 1, 'test-techniques', creator._id),
      buildSingle('Boundary Value Analysis focuses on:',
        ['Middle of ranges', 'Extreme ends and edges', 'Random sampling', 'UI flows'], 1, 'test-techniques', creator._id),
      buildSingle('Decision tables are most useful when:',
        ['There are complex combinations of conditions', 'Only one input exists', 'Doing performance tests', 'Testing UI styling'], 0, 'test-techniques', creator._id),
      buildSingle('State transition testing is based on:',
        ['User personas', 'States and allowed transitions', 'Defect lifecycle', 'Network layers'], 1, 'test-techniques', creator._id),
      buildSingle('Which is a white-box technique?',
        ['Statement coverage', 'Equivalence partitioning', 'Use-case testing', 'Error guessing'], 0, 'test-techniques', creator._id),
      buildSingle('Pairwise (combinatorial) testing is used to:',
        ['Cover all pairs of parameter values', 'Replace regression', 'Measure code complexity', 'Eliminate test data'], 0, 'test-techniques', creator._id),
      buildSingle('Use case testing derives tests from:',
        ['Low-level modules', 'User goals and interactions', 'Compiler output', 'Random inputs'], 1, 'test-techniques', creator._id),
      buildSingle('Error guessing relies on:',
        ['Tester experience and intuition', 'Formal models only', 'Strict automation', 'Production logs only'], 0, 'test-techniques', creator._id),
      buildSingle('Coverage of code statements is measured in:',
        ['Black-box tests', 'White-box tests', 'Exploratory tests', 'Acceptance tests only'], 1, 'test-techniques', creator._id),
      buildSingle('Which technique is best for numeric ranges?',
        ['Boundary value analysis', 'State transition', 'Usability testing', 'Syntax testing'], 0, 'test-techniques', creator._id)
    ];

    // Test Management (10)
    byCat['test-management'] = [
      buildSingle('A test plan typically includes:',
        ['Scope, approach, resources, schedule', 'Only test cases', 'Only defects', 'Deployment steps'], 0, 'test-management', creator._id),
      buildSingle('Exit criteria define:',
        ['Conditions to stop or accept testing', 'How many testers to hire', 'Tool vendor SLAs', 'Production KPIs'], 0, 'test-management', creator._id),
      buildSingle('Risk-based testing prioritizes tests by:',
        ['Random order', 'Risk level and impact', 'Alphabetical order', 'Tester preference'], 1, 'test-management', creator._id),
      buildSingle('Test monitoring involves:',
        ['Tracking progress and metrics', 'Fixing defects', 'Writing code', 'Only manual work'], 0, 'test-management', creator._id),
      buildSingle('A good defect report should include:',
        ['Steps, expected vs actual, severity/priority', 'Opinions of developer', 'Screenshots only', 'Stack traces only'], 0, 'test-management', creator._id),
      buildSingle('Which metric helps assess test effectiveness?',
        ['Velocity', 'Defect detection percentage', 'Server uptime', 'Build time'], 1, 'test-management', creator._id),
      buildSingle('Configuration management ensures:',
        ['Controlled versions of artifacts', 'Unlimited changes anytime', 'Less documentation', 'Free deployments'], 0, 'test-management', creator._id),
      buildSingle('Test strategy describes:',
        ['The organizational testing approach', 'Daily task list', 'Release notes', 'Coding standard'], 0, 'test-management', creator._id),
      buildSingle('Entry criteria are used to:',
        ['Decide when a test level can start', 'Terminate testing with defects', 'Replace exit criteria', 'Avoid documentation'], 0, 'test-management', creator._id),
      buildSingle('Which role approves the test plan in many orgs?',
        ['Only developers', 'Project/Test Manager and stakeholders', 'Operations only', 'End users only'], 1, 'test-management', creator._id)
    ];

    // Tool Support for Testing (10)
    byCat['tool-support'] = [
      buildSingle('A test management tool primarily helps with:',
        ['Compiling code', 'Planning, tracking, and reporting tests', 'Designing UI', 'Building servers'], 1, 'tool-support', creator._id),
      buildSingle('Which is a benefit of automated regression tests?',
        ['No maintenance required', 'Faster repeatable execution', 'Replaces all manual testing', 'Finds all bugs'], 1, 'tool-support', creator._id),
      buildSingle('Static analysis tools operate on:',
        ['Running system', 'Source or byte code without executing', 'Network layer only', 'Production logs only'], 1, 'tool-support', creator._id),
      buildSingle('A defect tracking tool helps to:',
        ['Store builds', 'Log, assign, and track defects', 'Deploy applications', 'Design databases'], 1, 'tool-support', creator._id),
      buildSingle('Which tool supports performance testing?',
        ['JMeter/LoadRunner', 'Jira', 'Figma', 'Git'], 0, 'tool-support', creator._id),
      buildSingle('CI tools like Jenkins help testing by:',
        ['Manual scheduling only', 'Automating builds and tests on changes', 'Replacing reviews', 'Managing requirements'], 1, 'tool-support', creator._id),
      buildSingle('Test data generation tools are useful to:',
        ['Fabricate realistic datasets safely', 'Encrypt traffic', 'Design logos', 'Configure servers'], 0, 'tool-support', creator._id),
      buildSingle('A code coverage tool measures:',
        ['Percentage of code executed by tests', 'Number of logged defects', 'UI pixel accuracy', 'User satisfaction'], 0, 'tool-support', creator._id),
      buildSingle('Which is a risk of over-reliance on tools?',
        ['Better consistency', 'Loss of critical thinking and false confidence', 'Improved traceability', 'Faster feedback'], 1, 'tool-support', creator._id),
      buildSingle('Selecting a tool should consider:',
        ['Hype and branding', 'Project needs, skills, integration, cost', 'Only open-source status', 'Only vendor demos'], 1, 'tool-support', creator._id)
    ];

    // Agile Testing (10)
    byCat['agile-testing'] = [
      buildSingle('In Agile, who is responsible for quality?',
        ['The tester only', 'The whole team', 'The product owner only', 'The scrum master only'], 1, 'agile-testing', creator._id),
      buildSingle('A common Agile testing practice is:',
        ['Big-bang testing at the end', 'Test early and continuously', 'Testing only after UAT', 'No automation'], 1, 'agile-testing', creator._id),
      buildSingle('TDD cycle is:',
        ['Test-Do-Debug', 'Red-Green-Refactor', 'Plan-Do-Check-Act', 'Build-Measure-Learn'], 1, 'agile-testing', creator._id),
      buildSingle('Acceptance criteria are used to:',
        ['Define done for a user story', 'Replace test cases', 'Write code standards', 'Setup CI'], 0, 'agile-testing', creator._id),
      buildSingle('Exploratory testing in Agile is:',
        ['Scripted only', 'Time-boxed learning and test design/execution', 'Not allowed', 'Only automated'], 1, 'agile-testing', creator._id),
      buildSingle('Definition of Done should include:',
        ['Only coding finished', 'Testing and acceptance activities', 'Only merged PRs', 'Only deployment'], 1, 'agile-testing', creator._id),
      buildSingle('Continuous integration supports quality by:',
        ['Merging rarely', 'Frequent integration and feedback', 'Manual builds only', 'Avoiding automation'], 1, 'agile-testing', creator._id),
      buildSingle('In Scrum, a sprint review focuses on:',
        ['Demonstrating increment and gathering feedback', 'Detailed root-cause analysis', 'Retrospective actions', 'Capacity planning'], 0, 'agile-testing', creator._id),
      buildSingle('ATDD emphasizes:',
        ['Developing tests after coding', 'Defining acceptance tests before implementation', 'Only unit tests', 'Skipping reviews'], 1, 'agile-testing', creator._id),
      buildSingle('A tester pairs with a developer to:',
        ['Slow delivery', 'Share knowledge and improve quality', 'Replace code reviews', 'Reduce coverage'], 1, 'agile-testing', creator._id)
    ];

    // Test Automation (10)
    byCat['test-automation'] = [
      buildSingle('A good candidate for automation is:',
        ['Exploratory tests', 'Frequent regression tests', 'One-off ad-hoc test', 'Usability tests'], 1, 'test-automation', creator._id),
      buildSingle('Which is important for maintainable automated tests?',
        ['Tight coupling to UI locators', 'Stable test data and abstractions', 'Duplicated code', 'Hard-coded waits'], 1, 'test-automation', creator._id),
      buildSingle('Flaky tests are:',
        ['Consistently passing', 'Intermittently passing/failing', 'Always failing only', 'Always passing'], 1, 'test-automation', creator._id),
      buildSingle('Which layer is best for fast, reliable tests?',
        ['Unit level', 'UI end-to-end', 'Manual only', 'Production only'], 0, 'test-automation', creator._id),
      buildSingle('CI pipelines should:',
        ['Run nothing automatically', 'Run automated suites on changes', 'Only build binaries', 'Deploy without tests'], 1, 'test-automation', creator._id),
      buildSingle('Page Object Model is used to:',
        ['Structure UI automation code for maintainability', 'Design databases', 'Model server hardware', 'Write performance tests'], 0, 'test-automation', creator._id),
      buildSingle('A test oracle is:',
        ['A method to determine expected results', 'A database table', 'A UI element', 'A deployment tool'], 0, 'test-automation', creator._id),
      buildSingle('Stubs and drivers are used for:',
        ['Isolated component testing', 'Deployment only', 'Security testing', 'Code reviews'], 0, 'test-automation', creator._id),
      buildSingle('An antipattern in automation is:',
        ['Modular reusable functions', 'Brittle selectors and sleeps', 'Clear reporting', 'Version control'], 1, 'test-automation', creator._id),
      buildSingle('Goal of automation is to:',
        ['Replace all testing', 'Increase speed and feedback reliability', 'Eliminate testers', 'Only reduce cost'], 1, 'test-automation', creator._id)
    ];

    const payload = Object.values(byCat).flat();
    const created = await Question.insertMany(payload);
    console.log(`✅ Inserted ${created.length} beginner questions (${Object.keys(byCat).length} categories × 10).`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Reseed failed:', err.message);
    process.exit(1);
  }
}

main();