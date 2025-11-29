const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/mysqlDatabase');

const QuestionOption = sequelize.define('QuestionOption', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'question_id',
    references: {
      model: 'questions',
      key: 'id'
    }
  },
  optionIndex: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'option_index'
  },
  isCorrect: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    field: 'is_correct'
  }
}, {
  tableName: 'question_options',
  timestamps: false,
  underscored: true,
  indexes: [
    { fields: ['question_id'] }
  ]
});

module.exports = QuestionOption;
