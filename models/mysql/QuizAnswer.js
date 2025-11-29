const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/mysqlDatabase');

const QuizAnswer = sequelize.define('QuizAnswer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  quizQuestionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'quiz_question_id',
    references: {
      model: 'quiz_questions',
      key: 'id'
    }
  },
  optionIndex: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'option_index'
  }
}, {
  tableName: 'quiz_answers',
  timestamps: false,
  underscored: true,
  indexes: [
    { fields: ['quiz_question_id'] }
  ]
});

module.exports = QuizAnswer;
