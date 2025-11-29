const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/mysqlDatabase');

const BugPreventionTip = sequelize.define('BugPreventionTip', {
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
  tableName: 'bug_prevention_tips',
  timestamps: false,
  underscored: true,
  indexes: [
    { fields: ['bug_id'] }
  ]
});

module.exports = BugPreventionTip;
