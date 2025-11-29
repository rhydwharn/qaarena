const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/mysqlDatabase');

const DifficultyProgress = sequelize.define('DifficultyProgress', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  progressId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'progress_id',
    references: {
      model: 'progress',
      key: 'id'
    }
  },
  difficulty: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  questionsAttempted: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'questions_attempted'
  },
  questionsCorrect: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'questions_correct'
  },
  averageScore: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
    field: 'average_score'
  }
}, {
  tableName: 'difficulty_progress',
  timestamps: false,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['progress_id', 'difficulty'],
      name: 'unique_progress_difficulty'
    }
  ]
});

module.exports = DifficultyProgress;
