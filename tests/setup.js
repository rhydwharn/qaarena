const mongoose = require('mongoose');

// Set test environment BEFORE any imports
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_key';
process.env.MONGODB_URI = 'mongodb://localhost:27017/istqb_test';

beforeAll(async () => {
  // Disconnect any existing connections
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  
  const mongoUri = 'mongodb://localhost:27017/istqb_test';
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error in afterAll:', error);
  }
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});