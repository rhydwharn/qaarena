const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/mysqlDatabase');

const QuizQuestion = sequelize.define('QuizQuestion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  quizId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'quiz_id',
    references: {
      model: 'quizzes',
      key: 'id'
    }
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
  isCorrect: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    field: 'is_correct'
  },
  timeSpent: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'time_spent'
  },
  answeredAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'answered_at'
  }
}, {
  tableName: 'quiz_questions',
  timestamps: false,
  underscored: true,
  indexes: [
    { fields: ['quiz_id'] },
    { fields: ['question_id'] }
  ]
});

module.exports = QuizQuestion;
