const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../../config/mysqlDatabase');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
    validate: {
      len: {
        args: [3, 30],
        msg: 'Username must be between 3 and 30 characters'
      },
      notEmpty: {
        msg: 'Username is required'
      }
    }
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: 'Please provide a valid email'
      },
      notEmpty: {
        msg: 'Email is required'
      }
    },
    set(value) {
      this.setDataValue('email', value.toLowerCase().trim());
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: {
        args: [6, 255],
        msg: 'Password must be at least 6 characters'
      },
      notEmpty: {
        msg: 'Password is required'
      }
    }
  },
  role: {
    type: DataTypes.ENUM('user', 'admin', 'moderator'),
    defaultValue: 'user'
  },
  
  // Profile fields
  firstName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'first_name'
  },
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'last_name'
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  preferredLanguage: {
    type: DataTypes.STRING(10),
    defaultValue: 'en',
    field: 'preferred_language'
  },
  avatar: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  
  // Stats fields
  totalQuizzes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'total_quizzes'
  },
  totalQuestions: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'total_questions'
  },
  correctAnswers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'correct_answers'
  },
  totalScore: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'total_score'
  },
  averageScore: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
    field: 'average_score'
  },
  streak: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lastActiveDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_active_date'
  },
  
  // Status fields
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_email_verified'
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_login'
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['username'] },
    { fields: ['email'] },
    { fields: ['role'] }
  ],
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Instance methods
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

User.prototype.updateAverageScore = function() {
  if (this.totalQuestions > 0) {
    this.averageScore = Math.round((this.correctAnswers / this.totalQuestions) * 100);
  }
};

// Exclude password from JSON responses
User.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  delete values.password;
  return values;
};

module.exports = User;
