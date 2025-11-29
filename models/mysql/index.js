const { sequelize } = require('../../config/mysqlDatabase');

// Import all models
const User = require('./User');
const Question = require('./Question');
const QuestionTranslation = require('./QuestionTranslation');
const QuestionOption = require('./QuestionOption');
const QuestionOptionTranslation = require('./QuestionOptionTranslation');
const QuestionTag = require('./QuestionTag');
const Quiz = require('./Quiz');
const QuizQuestion = require('./QuizQuestion');
const QuizAnswer = require('./QuizAnswer');
const Progress = require('./Progress');
const CategoryProgress = require('./CategoryProgress');
const DifficultyProgress = require('./DifficultyProgress');
const RecentActivity = require('./RecentActivity');
const FunctionalBug = require('./FunctionalBug');
const BugStep = require('./BugStep');
const BugHint = require('./BugHint');
const BugPreventionTip = require('./BugPreventionTip');
const BugTestingTip = require('./BugTestingTip');
const Achievement = require('./Achievement');
const AchievementTranslation = require('./AchievementTranslation');
const UserAchievement = require('./UserAchievement');
const ArenaUser = require('./ArenaUser');

// ============================================
// DEFINE ASSOCIATIONS
// ============================================

// User <-> Question (One-to-Many)
User.hasMany(Question, {
  foreignKey: 'createdBy',
  as: 'questions'
});
Question.belongsTo(User, {
  foreignKey: 'createdBy',
  as: 'creator'
});

// Question <-> QuestionTranslation (One-to-Many)
Question.hasMany(QuestionTranslation, {
  foreignKey: 'questionId',
  as: 'translations',
  onDelete: 'CASCADE'
});
QuestionTranslation.belongsTo(Question, {
  foreignKey: 'questionId'
});

// Question <-> QuestionOption (One-to-Many)
Question.hasMany(QuestionOption, {
  foreignKey: 'questionId',
  as: 'options',
  onDelete: 'CASCADE'
});
QuestionOption.belongsTo(Question, {
  foreignKey: 'questionId'
});

// QuestionOption <-> QuestionOptionTranslation (One-to-Many)
QuestionOption.hasMany(QuestionOptionTranslation, {
  foreignKey: 'optionId',
  as: 'translations',
  onDelete: 'CASCADE'
});
QuestionOptionTranslation.belongsTo(QuestionOption, {
  foreignKey: 'optionId'
});

// Question <-> QuestionTag (One-to-Many)
Question.hasMany(QuestionTag, {
  foreignKey: 'questionId',
  as: 'tags',
  onDelete: 'CASCADE'
});
QuestionTag.belongsTo(Question, {
  foreignKey: 'questionId'
});

// User <-> Quiz (One-to-Many)
User.hasMany(Quiz, {
  foreignKey: 'userId',
  as: 'quizzes'
});
Quiz.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Quiz <-> QuizQuestion (One-to-Many)
Quiz.hasMany(QuizQuestion, {
  foreignKey: 'quizId',
  as: 'quizQuestions',
  onDelete: 'CASCADE'
});
QuizQuestion.belongsTo(Quiz, {
  foreignKey: 'quizId'
});

// Question <-> QuizQuestion (One-to-Many)
Question.hasMany(QuizQuestion, {
  foreignKey: 'questionId',
  as: 'quizQuestions'
});
QuizQuestion.belongsTo(Question, {
  foreignKey: 'questionId',
  as: 'question'
});

// QuizQuestion <-> QuizAnswer (One-to-Many)
QuizQuestion.hasMany(QuizAnswer, {
  foreignKey: 'quizQuestionId',
  as: 'answers',
  onDelete: 'CASCADE'
});
QuizAnswer.belongsTo(QuizQuestion, {
  foreignKey: 'quizQuestionId'
});

// User <-> Progress (One-to-One)
User.hasOne(Progress, {
  foreignKey: 'userId',
  as: 'progress'
});
Progress.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Progress <-> CategoryProgress (One-to-Many)
Progress.hasMany(CategoryProgress, {
  foreignKey: 'progressId',
  as: 'categoryProgress',
  onDelete: 'CASCADE'
});
CategoryProgress.belongsTo(Progress, {
  foreignKey: 'progressId'
});

// Progress <-> DifficultyProgress (One-to-Many)
Progress.hasMany(DifficultyProgress, {
  foreignKey: 'progressId',
  as: 'difficultyProgress',
  onDelete: 'CASCADE'
});
DifficultyProgress.belongsTo(Progress, {
  foreignKey: 'progressId'
});

// Progress <-> RecentActivity (One-to-Many)
Progress.hasMany(RecentActivity, {
  foreignKey: 'progressId',
  as: 'recentActivity',
  onDelete: 'CASCADE'
});
RecentActivity.belongsTo(Progress, {
  foreignKey: 'progressId'
});

// User <-> FunctionalBug (One-to-Many)
User.hasMany(FunctionalBug, {
  foreignKey: 'createdBy',
  as: 'functionalBugs'
});
FunctionalBug.belongsTo(User, {
  foreignKey: 'createdBy',
  as: 'creator'
});

// FunctionalBug <-> BugStep (One-to-Many)
FunctionalBug.hasMany(BugStep, {
  foreignKey: 'bugId',
  as: 'steps',
  onDelete: 'CASCADE'
});
BugStep.belongsTo(FunctionalBug, {
  foreignKey: 'bugId'
});

// FunctionalBug <-> BugHint (One-to-Many)
FunctionalBug.hasMany(BugHint, {
  foreignKey: 'bugId',
  as: 'hints',
  onDelete: 'CASCADE'
});
BugHint.belongsTo(FunctionalBug, {
  foreignKey: 'bugId'
});

// FunctionalBug <-> BugPreventionTip (One-to-Many)
FunctionalBug.hasMany(BugPreventionTip, {
  foreignKey: 'bugId',
  as: 'preventionTips',
  onDelete: 'CASCADE'
});
BugPreventionTip.belongsTo(FunctionalBug, {
  foreignKey: 'bugId'
});

// FunctionalBug <-> BugTestingTip (One-to-Many)
FunctionalBug.hasMany(BugTestingTip, {
  foreignKey: 'bugId',
  as: 'testingTips',
  onDelete: 'CASCADE'
});
BugTestingTip.belongsTo(FunctionalBug, {
  foreignKey: 'bugId'
});

// Achievement <-> AchievementTranslation (One-to-Many)
Achievement.hasMany(AchievementTranslation, {
  foreignKey: 'achievementId',
  as: 'translations',
  onDelete: 'CASCADE'
});
AchievementTranslation.belongsTo(Achievement, {
  foreignKey: 'achievementId'
});

// User <-> Achievement (Many-to-Many through UserAchievement)
User.belongsToMany(Achievement, {
  through: UserAchievement,
  foreignKey: 'userId',
  otherKey: 'achievementId',
  as: 'achievements'
});
Achievement.belongsToMany(User, {
  through: UserAchievement,
  foreignKey: 'achievementId',
  otherKey: 'userId',
  as: 'users'
});

// Direct associations for UserAchievement
UserAchievement.belongsTo(User, {
  foreignKey: 'userId'
});
UserAchievement.belongsTo(Achievement, {
  foreignKey: 'achievementId'
});

// ============================================
// EXPORT ALL MODELS
// ============================================

module.exports = {
  sequelize,
  User,
  Question,
  QuestionTranslation,
  QuestionOption,
  QuestionOptionTranslation,
  QuestionTag,
  Quiz,
  QuizQuestion,
  QuizAnswer,
  Progress,
  CategoryProgress,
  DifficultyProgress,
  RecentActivity,
  FunctionalBug,
  BugStep,
  BugHint,
  BugPreventionTip,
  BugTestingTip,
  Achievement,
  AchievementTranslation,
  UserAchievement,
  ArenaUser
};
