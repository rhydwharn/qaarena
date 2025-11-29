const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/mysqlDatabase');

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.ENUM('single-choice', 'multiple-choice', 'true-false'),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Question type is required'
      }
    }
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Category is required'
      }
    },
    set(value) {
      this.setDataValue('category', value.toLowerCase().trim());
    }
  },
  difficulty: {
    type: DataTypes.ENUM('foundation', 'advanced', 'expert'),
    defaultValue: 'foundation'
  },
  syllabus: {
    type: DataTypes.STRING(100),
    defaultValue: 'ISTQB-CTFL-2018'
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: 1,
      max: 10
    }
  },
  
  // Statistics
  timesAnswered: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'times_answered'
  },
  timesCorrect: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'times_correct'
  },
  averageTime: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    field: 'average_time'
  },
  
  // Status
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived', 'flagged'),
    defaultValue: 'published'
  },
  
  // Votes
  upvotes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  downvotes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  
  // Foreign key
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'created_by',
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'questions',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['category', 'difficulty'] },
    { fields: ['status'] },
    { fields: ['created_by'] }
  ]
});

// Virtual field for success rate
Question.prototype.getSuccessRate = function() {
  if (this.timesAnswered === 0) return 0;
  return Math.round((this.timesCorrect / this.timesAnswered) * 100);
};

module.exports = Question;
