const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/mysqlDatabase');

const FunctionalBug = sequelize.define('FunctionalBug', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  bugId: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    field: 'bug_id'
  },
  domain: {
    type: DataTypes.ENUM('fintech', 'ecommerce', 'ordering', 'grading', 'authentication'),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  difficulty: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    allowNull: false
  },
  severity: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  
  // Scenario
  scenarioDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'scenario_description'
  },
  initialState: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'initial_state'
  },
  
  expectedResult: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'expected_result'
  },
  actualResult: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'actual_result'
  },
  bugType: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'bug_type'
  },
  rootCause: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'root_cause'
  },
  fixDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'fix_description'
  },
  
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 100
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'created_by',
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'functional_bugs',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['bug_id'], unique: true },
    { fields: ['domain', 'difficulty'] },
    { fields: ['is_active'] }
  ]
});

module.exports = FunctionalBug;
