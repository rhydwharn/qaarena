const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/mysqlDatabase');

const SiteVisit = sequelize.define('SiteVisit', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  visitedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'visited_at'
  },
  path: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  ipHash: {
    type: DataTypes.STRING(64),
    allowNull: true,
    field: 'ip_hash'
  },
  userAgent: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'user_agent'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'site_visits',
  timestamps: false,
  underscored: true,
  indexes: [
    { fields: ['visited_at'] },
    { fields: ['path'] }
  ]
});

module.exports = SiteVisit;
