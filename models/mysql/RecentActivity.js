const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/mysqlDatabase');

const RecentActivity = sequelize.define('RecentActivity', {
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
  activityDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'activity_date'
  },
  questionsAnswered: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'questions_answered'
  },
  score: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0
  },
  timeSpent: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'time_spent'
  }
}, {
  tableName: 'recent_activity',
  timestamps: false,
  underscored: true,
  indexes: [
    { fields: ['progress_id', 'activity_date'] }
  ]
});

module.exports = RecentActivity;
