const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/mysqlDatabase');

const QuestionTag = sequelize.define('QuestionTag', {
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
  tag: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  tableName: 'question_tags',
  timestamps: false,
  underscored: true,
  indexes: [
    { fields: ['question_id'] },
    { fields: ['tag'] }
  ]
});

module.exports = QuestionTag;
