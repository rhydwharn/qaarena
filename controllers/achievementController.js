const Achievement = require('../models/Achievement');
const User = require('../models/User');

exports.getAllAchievements = async (req, res, next) => {
  try {
    const achievements = await Achievement.find({ isActive: true });

    const user = await User.findById(req.user.id).populate('achievements');
    const unlockedIds = user.achievements.map(a => a._id.toString());

    const achievementsWithStatus = achievements.map(achievement => ({
      ...achievement.toObject(),
      unlocked: unlockedIds.includes(achievement._id.toString())
    }));

    res.status(200).json({
      status: 'success',
      data: { achievements: achievementsWithStatus }
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserAchievements = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('achievements');

    res.status(200).json({
      status: 'success',
      data: { achievements: user.achievements }
    });
  } catch (error) {
    next(error);
  }
};

exports.checkAchievements = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('achievements');
    const achievements = await Achievement.find({ isActive: true });

    const newAchievements = [];

    for (const achievement of achievements) {
      const alreadyUnlocked = user.achievements.some(a => a._id.toString() === achievement._id.toString());

      if (!alreadyUnlocked) {
        let unlocked = false;

        switch (achievement.criteria.metric) {
          case 'totalQuizzes':
            unlocked = user.stats.totalQuizzes >= achievement.criteria.threshold;
            break;
          case 'totalScore':
            unlocked = user.stats.totalScore >= achievement.criteria.threshold;
            break;
          case 'averageScore':
            unlocked = user.stats.averageScore >= achievement.criteria.threshold;
            break;
          case 'streak':
            unlocked = user.stats.streak >= achievement.criteria.threshold;
            break;
          case 'correctAnswers':
            unlocked = user.stats.correctAnswers >= achievement.criteria.threshold;
            break;
        }

        if (unlocked) {
          user.achievements.push(achievement._id);
          achievement.unlockedBy.push(user._id);
          await achievement.save();
          newAchievements.push(achievement);
        }
      }
    }

    if (newAchievements.length > 0) {
      await user.save();
    }

    res.status(200).json({
      status: 'success',
      data: { newAchievements }
    });
  } catch (error) {
    next(error);
  }
};