// MySQL Models
const { Achievement, AchievementTranslation, UserAchievement, User } = require('../models/mysql');
const { Op } = require('sequelize');

exports.getAllAchievements = async (req, res, next) => {
  try {
    const achievements = await Achievement.findAll({
      where: { isActive: true },
      include: [{ model: AchievementTranslation, as: 'translations' }]
    });

    const userAchievements = await UserAchievement.findAll({
      where: { userId: req.user.id },
      attributes: ['achievementId']
    });
    const unlockedIds = userAchievements.map(ua => ua.achievementId);

    const achievementsWithStatus = achievements.map(achievement => ({
      id: achievement.id,
      name: achievement.translations?.find(t => t.language === 'en')?.name || '',
      description: achievement.translations?.find(t => t.language === 'en')?.description || '',
      icon: achievement.icon,
      type: achievement.type,
      criteriaMetric: achievement.criteriaMetric,
      criteriaThreshold: achievement.criteriaThreshold,
      rarity: achievement.rarity,
      points: achievement.points,
      unlocked: unlockedIds.includes(achievement.id)
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
    const userAchievements = await UserAchievement.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Achievement,
        as: 'achievement',
        include: [{ model: AchievementTranslation, as: 'translations' }]
      }]
    });

    const achievements = userAchievements.map(ua => ({
      id: ua.achievement.id,
      name: ua.achievement.translations?.find(t => t.language === 'en')?.name || '',
      description: ua.achievement.translations?.find(t => t.language === 'en')?.description || '',
      icon: ua.achievement.icon,
      type: ua.achievement.type,
      rarity: ua.achievement.rarity,
      points: ua.achievement.points,
      unlockedAt: ua.unlockedAt
    }));

    res.status(200).json({
      status: 'success',
      data: { achievements }
    });
  } catch (error) {
    next(error);
  }
};

exports.checkAchievements = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    const achievements = await Achievement.findAll({
      where: { isActive: true },
      include: [{ model: AchievementTranslation, as: 'translations' }]
    });

    const userAchievements = await UserAchievement.findAll({
      where: { userId: req.user.id },
      attributes: ['achievementId']
    });
    const unlockedIds = userAchievements.map(ua => ua.achievementId);

    const newAchievements = [];

    for (const achievement of achievements) {
      const alreadyUnlocked = unlockedIds.includes(achievement.id);

      if (!alreadyUnlocked) {
        let unlocked = false;

        switch (achievement.criteriaMetric) {
          case 'totalQuizzes':
            unlocked = user.totalQuizzes >= achievement.criteriaThreshold;
            break;
          case 'totalScore':
            unlocked = user.totalScore >= achievement.criteriaThreshold;
            break;
          case 'averageScore':
            unlocked = parseFloat(user.averageScore) >= achievement.criteriaThreshold;
            break;
          case 'streak':
            unlocked = user.streak >= achievement.criteriaThreshold;
            break;
          case 'correctAnswers':
            unlocked = user.correctAnswers >= achievement.criteriaThreshold;
            break;
        }

        if (unlocked) {
          await UserAchievement.create({
            userId: user.id,
            achievementId: achievement.id,
            unlockedAt: new Date()
          });
          newAchievements.push({
            id: achievement.id,
            name: achievement.translations?.find(t => t.language === 'en')?.name || '',
            description: achievement.translations?.find(t => t.language === 'en')?.description || '',
            icon: achievement.icon,
            points: achievement.points
          });
        }
      }
    }

    res.status(200).json({
      status: 'success',
      data: { newAchievements }
    });
  } catch (error) {
    next(error);
  }
};