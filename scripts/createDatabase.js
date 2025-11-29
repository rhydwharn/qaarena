require('dotenv').config();
const mysql = require('mysql2/promise');

async function createDatabase() {
  console.log('🔧 Creating MySQL Database...\n');
  
  const config = {
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || ''
  };
  
  const dbName = process.env.MYSQL_DATABASE || 'qa_arena';
  
  try {
    console.log('Step 1: Connecting to MySQL server...');
    console.log(`   Host: ${config.host}`);
    console.log(`   Port: ${config.port}`);
    console.log(`   User: ${config.user}\n`);
    
    // Connect without specifying database
    const connection = await mysql.createConnection(config);
    
    console.log('✅ Connected to MySQL server!\n');
    
    // Create database if it doesn't exist
    console.log(`Step 2: Creating database '${dbName}'...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    
    console.log(`✅ Database '${dbName}' created successfully!\n`);
    
    // Show databases
    console.log('Step 3: Listing databases...');
    const [databases] = await connection.query('SHOW DATABASES');
    console.log('\nAvailable databases:');
    databases.forEach((db, index) => {
      const dbName = db.Database;
      console.log(`   ${index + 1}. ${dbName}`);
    });
    
    await connection.end();
    
    console.log('\n🎉 Database setup complete!\n');
    console.log('Next step: Run the connection test');
    console.log('   node scripts/testMySQLConnection.js\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 MySQL server is not running. Please start it:');
      console.error('   Mac: brew services start mysql');
      console.error('   Or: mysql.server start\n');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 Access denied. Check your credentials in .env file\n');
    }
    
    process.exit(1);
  }
}

createDatabase();
