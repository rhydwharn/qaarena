const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/mysqlDatabase');

const Progress = sequelize.define('Progress', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  
  // Study Streak
  currentStreak: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'current_streak'
  },
  longestStreak: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'longest_streak'
  },
  lastStudyDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'last_study_date'
  },
  
  totalTimeSpent: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'total_time_spent'
  },
  lastUpdated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'last_updated'
  }
}, {
  tableName: 'progress',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['user_id'], unique: true }
  ]
});

module.exports = Progress;
