const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/mysqlDatabase');

const ArenaUser = sequelize.define('ArenaUser', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'first_name',
    validate: {
      notEmpty: {
        msg: 'First name is required'
      }
    }
  },
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'last_name',
    validate: {
      notEmpty: {
        msg: 'Last name is required'
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
  authMode: {
    type: DataTypes.ENUM('otp', 'token'),
    defaultValue: 'otp',
    field: 'auth_mode'
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_verified'
  },
  verificationOtp: {
    type: DataTypes.STRING(10),
    allowNull: true,
    field: 'verification_otp'
  },
  verificationToken: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'verification_token'
  },
  verificationExpiry: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'verification_expiry'
  }
}, {
  tableName: 'arena_users',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    { fields: ['email'], unique: true },
    { fields: ['is_verified'] }
  ]
});

module.exports = ArenaUser;
