// MySQL Models
const { FunctionalBug, BugStep, BugHint, BugPreventionTip, BugTestingTip, User } = require('../models/mysql');
const { Op } = require('sequelize');

// Calculate points based on performance
const calculatePoints = (bug, userAnswer, timeSpent, hintsUsed) => {
  let basePoints = bug.points;
  
  // Time bonus/penalty
  if (timeSpent < 30) {
    basePoints += 25; // Quick find bonus
  } else if (timeSpent > 120) {
    basePoints -= 10; // Slow penalty
  }
  
  // Hint penalty
  basePoints -= (hintsUsed * 10);
  
  // Accuracy bonus
  if (userAnswer.bugType === bug.bugType) {
    basePoints += 50; // Correct identification
    
    // Confidence bonus
    if (userAnswer.confidence >= 80) {
      basePoints += 10;
    }
  } else {
    basePoints = Math.floor(basePoints * 0.3); // 30% for attempt
  }
  
  // Minimum points
  return Math.max(basePoints, 10);
};

// @desc    Get all functional bugs
// @route   GET /api/functional-bugs
// @access  Public
exports.getAllBugs = async (req, res) => {
  try {
    const { domain, difficulty, limit = 20, page = 1 } = req.query;
    
    const query = { isActive: true };
    if (domain) query.domain = domain;
    if (difficulty) query.difficulty = difficulty;
    
    const where = { isActive: true };
    if (domain) where.domain = domain;
    if (difficulty) where.difficulty = difficulty;
    
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const { count: total, rows: bugs } = await FunctionalBug.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      bugs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get bug by ID
// @route   GET /api/functional-bugs/:bugId
// @access  Public
exports.getBugById = async (req, res) => {
  try {
    const bug = await FunctionalBug.findOne({ 
      where: { bugId: req.params.bugId, isActive: true },
      include: [
        { model: BugStep, as: 'steps' },
        { model: BugPreventionTip, as: 'preventionTips' },
        { model: BugTestingTip, as: 'testingTips' }
      ]
    });
    
    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }
    
    res.json({ bug });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Start bug scenario
// @route   POST /api/functional-bugs/:bugId/start
// @access  Private
exports.startBugScenario = async (req, res) => {
  try {
    const { bugId } = req.params;
    const userId = req.user.id;
    
    const bug = await FunctionalBug.findOne({ where: { bugId, isActive: true } });
    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }
    
    // Progress tracking simplified for now (can add UserBugProgress table later)
    
    res.json({
      bug: {
        bugId: bug.bugId,
        domain: bug.domain,
        title: bug.title,
        difficulty: bug.difficulty,
        severity: bug.severity,
        scenario: bug.scenario,
        points: bug.points
      },
      progress: {
        attempts: 1,
        completed: false
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get hint for bug
// @route   POST /api/functional-bugs/:bugId/hint
// @access  Private
exports.getHint = async (req, res) => {
  try {
    const { bugId } = req.params;
    const userId = req.user.id;
    
    const bug = await FunctionalBug.findOne({ 
      where: { bugId, isActive: true },
      include: [{ model: BugHint, as: 'hints' }]
    });
    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }
    
    // Simplified hint system
    const hintIndex = parseInt(req.body.hintIndex) || 0;
    const hint = bug.hints[hintIndex] || bug.hints[bug.hints.length - 1];
    
    res.json({
      hint,
      hintsUsed: hintIndex + 1,
      totalHints: bug.hints.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Submit bug answer
// @route   POST /api/functional-bugs/:bugId/submit
// @access  Private
exports.submitAnswer = async (req, res) => {
  try {
    const { bugId } = req.params;
    const { bugType, description, confidence, timeSpent } = req.body;
    const userId = req.user.id;
    
    // Validation
    if (!bugType || !description) {
      return res.status(400).json({ message: 'Bug type and description are required' });
    }
    
    const bug = await FunctionalBug.findOne({ 
      where: { bugId, isActive: true },
      include: [
        { model: BugPreventionTip, as: 'preventionTips' },
        { model: BugTestingTip, as: 'testingTips' }
      ]
    });
    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }
    
    // Simplified progress tracking
    
    const isCorrect = bugType === bug.bugType;
    const pointsEarned = calculatePoints(
      bug,
      { bugType, confidence },
      timeSpent || 0,
      0 // hintsUsed simplified
    );
    
    // Progress tracking simplified
    
    // Update user stats
    const user = await User.findByPk(userId);
    user.totalScore += pointsEarned;
    await user.save();
    
    res.json({
      isCorrect,
      pointsEarned,
      feedback: {
        bugType: bug.bugType,
        expected: bug.expected,
        actual: bug.actual,
        rootCause: bug.rootCause,
        fix: bug.fix,
        preventionTips: bug.preventionTips?.map(t => t.tipText) || [],
        testingTips: bug.testingTips?.map(t => t.tipText) || []
      },
      userAnswer: {
        bugType,
        description,
        confidence
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user progress
// @route   GET /api/functional-bugs/progress
// @access  Private
exports.getUserProgress = async (req, res) => {
  try {
    // Simplified - can implement UserBugProgress table later
    res.json({ 
      progress: [],
      stats: {
        totalAttempts: 0,
        completed: 0,
        totalPoints: 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get leaderboard
// @route   GET /api/functional-bugs/leaderboard
// @access  Public
exports.getLeaderboard = async (req, res) => {
  try {
    // Simplified leaderboard
    res.json({ leaderboard: [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get bug statistics
// @route   GET /api/functional-bugs/:bugId/stats
// @access  Public
exports.getBugStats = async (req, res) => {
  try {
    const { bugId } = req.params;
    
    // Stats simplified
    const stats = { totalAttempts: 0, successRate: 0 };
    if (!stats) {
      return res.status(404).json({ message: 'Stats not found' });
    }
    
    res.json({ stats });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create functional bug (Admin only)
// @route   POST /api/functional-bugs
// @access  Private/Admin
exports.createBug = async (req, res) => {
  try {
    const bugData = req.body;
    bugData.createdBy = req.user.id;
    
    const bug = await FunctionalBug.create(bugData);
    
    res.status(201).json({ bug });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update functional bug (Admin only)
// @route   PUT /api/functional-bugs/:bugId
// @access  Private/Admin
exports.updateBug = async (req, res) => {
  try {
    const bug = await FunctionalBug.findOne({ where: { bugId: req.params.bugId } });
    
    if (bug) {
      await bug.update(req.body);
    }
    
    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }
    
    res.json({ bug });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete functional bug (Admin only)
// @route   DELETE /api/functional-bugs/:bugId
// @access  Private/Admin
exports.deleteBug = async (req, res) => {
  try {
    const bug = await FunctionalBug.findOne({ where: { bugId: req.params.bugId } });
    
    if (bug) {
      await bug.destroy();
    }
    
    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }
    
    res.json({ message: 'Bug deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
