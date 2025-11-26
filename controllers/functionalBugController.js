const FunctionalBug = require('../models/FunctionalBug');
const UserFunctionalBugProgress = require('../models/UserFunctionalBugProgress');
const FunctionalBugStats = require('../models/FunctionalBugStats');
const User = require('../models/User');

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
    
    const bugs = await FunctionalBug.find(query)
      .select('-hints') // Don't send hints initially
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await FunctionalBug.countDocuments(query);
    
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
    const bug = await FunctionalBug.findOne({ bugId: req.params.bugId, isActive: true })
      .select('-hints'); // Don't send hints initially
    
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
    
    const bug = await FunctionalBug.findOne({ bugId, isActive: true });
    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }
    
    // Check if progress exists
    let progress = await UserFunctionalBugProgress.findOne({ user: userId, bugId });
    
    if (!progress) {
      progress = new UserFunctionalBugProgress({
        user: userId,
        bugId,
        domain: bug.domain,
        difficulty: bug.difficulty,
        startedAt: new Date(),
        attempts: 0,
        hintsUsed: 0
      });
    }
    
    progress.attempts = (progress.attempts || 0) + 1;
    await progress.save();
    
    // Update bug stats
    let stats = await FunctionalBugStats.findOne({ bugId });
    if (!stats) {
      stats = new FunctionalBugStats({ 
        bugId,
        totalAttempts: 0,
        totalCompletions: 0,
        correctIdentifications: 0,
        averageTimeSpent: 0,
        averageHintsUsed: 0,
        successRate: 0
      });
    }
    stats.totalAttempts = (stats.totalAttempts || 0) + 1;
    await stats.save();
    
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
        attempts: progress.attempts,
        completed: progress.completed
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
    
    const bug = await FunctionalBug.findOne({ bugId, isActive: true });
    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }
    
    const progress = await UserFunctionalBugProgress.findOne({ user: userId, bugId });
    if (!progress) {
      return res.status(404).json({ message: 'Start the scenario first' });
    }
    
    // Increment hints used
    progress.hintsUsed += 1;
    await progress.save();
    
    // Return next hint
    const hintIndex = progress.hintsUsed - 1;
    const hint = bug.hints[hintIndex] || bug.hints[bug.hints.length - 1];
    
    res.json({
      hint,
      hintsUsed: progress.hintsUsed,
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
    
    const bug = await FunctionalBug.findOne({ bugId, isActive: true });
    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }
    
    let progress = await UserFunctionalBugProgress.findOne({ user: userId, bugId });
    
    // If no progress exists, create it (user may have viewed without starting)
    if (!progress) {
      progress = new UserFunctionalBugProgress({
        user: userId,
        bugId,
        startedAt: new Date(),
        hintsUsed: 0
      });
    }
    
    // Check if already completed
    if (progress.completed) {
      return res.status(400).json({ message: 'Bug already completed' });
    }
    
    const isCorrect = bugType === bug.bugType;
    const pointsEarned = calculatePoints(
      bug,
      { bugType, confidence },
      timeSpent || 0,
      progress.hintsUsed
    );
    
    // Update progress
    progress.completed = true;
    progress.identifiedCorrectly = isCorrect;
    progress.pointsEarned = pointsEarned;
    progress.timeSpent = timeSpent || 0;
    progress.userAnswer = {
      bugType,
      description,
      confidence: confidence || 50,
      submittedAt: new Date()
    };
    progress.completedAt = new Date();
    
    await progress.save();
    
    // Update user stats
    await User.findByIdAndUpdate(userId, {
      $inc: { 'stats.totalScore': pointsEarned }
    });
    
    // Update bug stats
    let stats = await FunctionalBugStats.findOne({ bugId });
    if (!stats) {
      stats = new FunctionalBugStats({ bugId });
    }
    await stats.updateStats(isCorrect, timeSpent || 0, progress.hintsUsed);
    
    res.json({
      isCorrect,
      pointsEarned,
      feedback: {
        bugType: bug.bugType,
        expected: bug.expected,
        actual: bug.actual,
        rootCause: bug.rootCause,
        fix: bug.fix,
        preventionTips: bug.preventionTips,
        testingTips: bug.testingTips
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
    const userId = req.user.id;
    const { domain } = req.query;
    
    const query = { user: userId };
    if (domain) query.domain = domain;
    
    const progress = await UserFunctionalBugProgress.find(query)
      .populate('user', 'username')
      .sort({ createdAt: -1 });
    
    const stats = {
      totalAttempts: progress.length,
      completed: progress.filter(p => p.completed).length,
      totalPoints: progress.reduce((sum, p) => sum + p.pointsEarned, 0),
      averageTime: progress.length > 0 
        ? progress.reduce((sum, p) => sum + p.timeSpent, 0) / progress.length 
        : 0,
      successRate: progress.length > 0
        ? (progress.filter(p => p.identifiedCorrectly).length / progress.filter(p => p.completed).length) * 100
        : 0,
      byDomain: {
        fintech: progress.filter(p => p.domain === 'fintech' && p.completed).length,
        ecommerce: progress.filter(p => p.domain === 'ecommerce' && p.completed).length,
        ordering: progress.filter(p => p.domain === 'ordering' && p.completed).length,
        grading: progress.filter(p => p.domain === 'grading' && p.completed).length
      },
      byDifficulty: {
        beginner: progress.filter(p => p.difficulty === 'beginner' && p.completed).length,
        intermediate: progress.filter(p => p.difficulty === 'intermediate' && p.completed).length,
        advanced: progress.filter(p => p.difficulty === 'advanced' && p.completed).length
      }
    };
    
    res.json({ progress, stats });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get leaderboard
// @route   GET /api/functional-bugs/leaderboard
// @access  Public
exports.getLeaderboard = async (req, res) => {
  try {
    const { domain, limit = 10 } = req.query;
    
    const matchStage = domain ? { domain } : {};
    
    const leaderboard = await UserFunctionalBugProgress.aggregate([
      { $match: { completed: true, ...matchStage } },
      {
        $group: {
          _id: '$user',
          totalPoints: { $sum: '$pointsEarned' },
          bugsCompleted: { $sum: 1 },
          correctIdentifications: {
            $sum: { $cond: ['$identifiedCorrectly', 1, 0] }
          },
          averageTime: { $avg: '$timeSpent' }
        }
      },
      { $sort: { totalPoints: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          username: '$user.username',
          totalPoints: 1,
          bugsCompleted: 1,
          correctIdentifications: 1,
          averageTime: 1,
          successRate: {
            $multiply: [
              { $divide: ['$correctIdentifications', '$bugsCompleted'] },
              100
            ]
          }
        }
      }
    ]);
    
    res.json({ leaderboard });
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
    
    const stats = await FunctionalBugStats.findOne({ bugId });
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
    
    // Create initial stats
    await FunctionalBugStats.create({ bugId: bug.bugId });
    
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
    const bug = await FunctionalBug.findOneAndUpdate(
      { bugId: req.params.bugId },
      req.body,
      { new: true, runValidators: true }
    );
    
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
    const bug = await FunctionalBug.findOneAndDelete({ bugId: req.params.bugId });
    
    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }
    
    res.json({ message: 'Bug deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
