const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/mysqlDatabase');

const Achievement = sequelize.define('Achievement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  icon: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('quiz', 'streak', 'score', 'category', 'special'),
    allowNull: false
  },
  
  // Criteria
  criteriaMetric: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'criteria_metric'
  },
  criteriaThreshold: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'criteria_threshold'
  },
  criteriaCategory: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'criteria_category'
  },
  
  rarity: {
    type: DataTypes.ENUM('common', 'rare', 'epic', 'legendary'),
    defaultValue: 'common'
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  tableName: 'achievements',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['type'] },
    { fields: ['is_active'] }
  ]
});

module.exports = Achievement;
