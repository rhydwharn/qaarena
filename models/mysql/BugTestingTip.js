const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/mysqlDatabase');

const BugTestingTip = sequelize.define('BugTestingTip', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  bugId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'bug_id',
    references: {
      model: 'functional_bugs',
      key: 'id'
    }
  },
  tipText: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'tip_text'
  }
}, {
  tableName: 'bug_testing_tips',
  timestamps: false,
  underscored: true,
  indexes: [
    { fields: ['bug_id'] }
  ]
});

module.exports = BugTestingTip;
