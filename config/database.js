const mongoose = require('mongoose');

/**
 * Legacy MongoDB connection helper.
 *
 * The main application now uses MySQL via Sequelize. This function is kept
 * only so older scripts or deployments that still import `config/database`
 * do not crash when `MONGODB_URI` is missing.
 *
 * Behaviour:
 * - If `DISABLE_MONGO` is set to `true` (string) OR `MONGODB_URI` is absent,
 *   this becomes a no-op and simply logs that Mongo is skipped.
 * - Otherwise, it attempts a normal mongoose connection.
 */
const connectDB = async () => {
  const disableMongo = String(process.env.DISABLE_MONGO || '').toLowerCase() === 'true';
  const uri = process.env.MONGODB_URI;

  if (disableMongo || !uri) {
    console.log('ℹ️  MongoDB connection skipped (legacy). Using MySQL only.');
    return null;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected (legacy): ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error (legacy): ${error.message}`);
    // Do not crash the process in MySQL-only mode; just log the failure.
    return null;
  }
};

module.exports = connectDB;