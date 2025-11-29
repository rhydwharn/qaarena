const { Sequelize } = require('sequelize');
const config = require('./mysql.config');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Create Sequelize instance
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    define: dbConfig.define
  }
);

// Test connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL Connection has been established successfully.');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to MySQL database:', error.message);
    return false;
  }
};

// Sync database (create tables if they don't exist)
const syncDatabase = async (options = {}) => {
  try {
    await sequelize.sync(options);
    console.log('✅ MySQL Database synchronized successfully.');
  } catch (error) {
    console.error('❌ Error synchronizing MySQL database:', error.message);
    throw error;
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncDatabase,
  Sequelize
};
