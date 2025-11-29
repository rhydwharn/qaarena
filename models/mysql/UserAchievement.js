const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/mysqlDatabase');

const UserAchievement = sequelize.define('UserAchievement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
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
  unlockedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'unlocked_at'
  }
}, {
  tableName: 'user_achievements',
  timestamps: false,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'achievement_id'],
      name: 'unique_user_achievement'
    },
    { fields: ['user_id'] },
    { fields: ['achievement_id'] }
  ]
});

module.exports = UserAchievement;
