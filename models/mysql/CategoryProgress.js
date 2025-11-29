const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/mysqlDatabase');

const CategoryProgress = sequelize.define('CategoryProgress', {
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
  category: {
    type: DataTypes.STRING(100),
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
  },
  lastAttempted: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_attempted'
  }
}, {
  tableName: 'category_progress',
  timestamps: false,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['progress_id', 'category'],
      name: 'unique_progress_category'
    }
  ]
});

module.exports = CategoryProgress;
