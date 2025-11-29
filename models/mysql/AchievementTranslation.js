const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/mysqlDatabase');

const AchievementTranslation = sequelize.define('AchievementTranslation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  achievementId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'achievement_id',
    references: {
      model: 'achievements',
      key: 'id'
    }
  },
  language: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'achievement_translations',
  timestamps: false,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['achievement_id', 'language'],
      name: 'unique_achievement_language'
    }
  ]
});

module.exports = AchievementTranslation;
