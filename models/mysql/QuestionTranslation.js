const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/mysqlDatabase');

const QuestionTranslation = sequelize.define('QuestionTranslation', {
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
  language: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  questionText: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'question_text',
    validate: {
      notEmpty: {
        msg: 'Question text is required'
      }
    }
  },
  explanation: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'question_translations',
  timestamps: false,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['question_id', 'language'],
      name: 'unique_question_language'
    }
  ]
});

module.exports = QuestionTranslation;
