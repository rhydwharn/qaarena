const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/mysqlDatabase');

const QuestionOptionTranslation = sequelize.define('QuestionOptionTranslation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  optionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'option_id',
    references: {
      model: 'question_options',
      key: 'id'
    }
  },
  language: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  optionText: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'option_text'
  }
}, {
  tableName: 'question_option_translations',
  timestamps: false,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['option_id', 'language'],
      name: 'unique_option_language'
    }
  ]
});

module.exports = QuestionOptionTranslation;
