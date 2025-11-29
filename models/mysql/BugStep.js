const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/mysqlDatabase');

const BugStep = sequelize.define('BugStep', {
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
  stepNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'step_number'
  },
  stepDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'step_description'
  }
}, {
  tableName: 'bug_steps',
  timestamps: false,
  underscored: true,
  indexes: [
    { fields: ['bug_id'] }
  ]
});

module.exports = BugStep;
