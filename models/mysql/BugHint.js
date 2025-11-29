const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/mysqlDatabase');

const BugHint = sequelize.define('BugHint', {
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
  hintNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'hint_number'
  },
  hintText: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'hint_text'
  }
}, {
  tableName: 'bug_hints',
  timestamps: false,
  underscored: true,
  indexes: [
    { fields: ['bug_id'] }
  ]
});

module.exports = BugHint;
