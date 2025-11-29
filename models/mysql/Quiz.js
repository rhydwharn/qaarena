const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/mysqlDatabase');

const Quiz = sequelize.define('Quiz', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  mode: {
    type: DataTypes.ENUM('practice', 'exam', 'timed', 'category'),
    allowNull: false
  },
  
  // Settings
  language: {
    type: DataTypes.STRING(10),
    defaultValue: 'en'
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  difficulty: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  numberOfQuestions: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'number_of_questions'
  },
  timeLimit: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'time_limit'
  },
  randomOrder: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'random_order'
  },
  
  // Score
  correctCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'correct_count'
  },
  incorrectCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'incorrect_count'
  },
  unansweredCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'unanswered_count'
  },
  percentage: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0
  },
  totalPoints: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'total_points'
  },
  
  // Status
  status: {
    type: DataTypes.ENUM('in-progress', 'completed', 'abandoned'),
    defaultValue: 'in-progress'
  },
  
  startedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'started_at'
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'completed_at'
  },
  totalTime: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'total_time'
  }
}, {
  tableName: 'quizzes',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['user_id', 'status'] },
    { fields: ['created_at'] }
  ],
  hooks: {
    beforeUpdate: (quiz) => {
      if (quiz.status === 'completed' && quiz.changed('status')) {
        quiz.completedAt = new Date();
      }
    }
  }
});

module.exports = Quiz;
