/**
 * Test Authentication API endpoints
 * Tests the MySQL-migrated authentication controller
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api/auth';

// Test user data
const testUser = {
  username: `testuser_${Date.now()}`,
  email: `test_${Date.now()}@example.com`,
  password: 'TestPassword123!',
  firstName: 'Test',
  lastName: 'User',
  country: 'Nigeria',
  preferredLanguage: 'en'
};

let authToken = '';
let userId = '';

async function testRegistration() {
  console.log('\n📝 Testing User Registration...');
  try {
    const response = await axios.post(`${BASE_URL}/register`, testUser);
    
    if (response.data.status === 'success') {
      authToken = response.data.data.token;
      userId = response.data.data.user.id;
      
      console.log('✅ Registration successful!');
      console.log(`   User ID: ${userId}`);
      console.log(`   Username: ${response.data.data.user.username}`);
      console.log(`   Email: ${response.data.data.user.email}`);
      console.log(`   Token: ${authToken.substring(0, 20)}...`);
      return true;
    }
  } catch (error) {
    console.log('❌ Registration failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testLogin() {
  console.log('\n🔐 Testing User Login...');
  try {
    const response = await axios.post(`${BASE_URL}/login`, {
      email: testUser.email,
      password: testUser.password
    });
    
    if (response.data.status === 'success') {
      authToken = response.data.data.token;
      
      console.log('✅ Login successful!');
      console.log(`   User ID: ${response.data.data.user.id}`);
      console.log(`   Username: ${response.data.data.user.username}`);
      console.log(`   Role: ${response.data.data.user.role}`);
      console.log(`   Token: ${authToken.substring(0, 20)}...`);
      return true;
    }
  } catch (error) {
    console.log('❌ Login failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testGetMe() {
  console.log('\n👤 Testing Get Current User...');
  try {
    const response = await axios.get(`${BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (response.data.status === 'success') {
      console.log('✅ Get current user successful!');
      console.log(`   Username: ${response.data.data.user.username}`);
      console.log(`   Email: ${response.data.data.user.email}`);
      console.log(`   First Name: ${response.data.data.user.firstName}`);
      console.log(`   Last Name: ${response.data.data.user.lastName}`);
      return true;
    }
  } catch (error) {
    console.log('❌ Get current user failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testUpdateProfile() {
  console.log('\n✏️  Testing Update Profile...');
  try {
    const response = await axios.put(`${BASE_URL}/profile`, {
      firstName: 'Updated',
      lastName: 'Name',
      country: 'Kenya'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (response.data.status === 'success') {
      console.log('✅ Profile update successful!');
      console.log(`   First Name: ${response.data.data.user.firstName}`);
      console.log(`   Last Name: ${response.data.data.user.lastName}`);
      console.log(`   Country: ${response.data.data.user.country}`);
      return true;
    }
  } catch (error) {
    console.log('❌ Profile update failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testChangePassword() {
  console.log('\n🔑 Testing Change Password...');
  try {
    const response = await axios.put(`${BASE_URL}/password`, {
      currentPassword: testUser.password,
      newPassword: 'NewPassword123!'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (response.data.status === 'success') {
      console.log('✅ Password change successful!');
      
      // Update password for future tests
      testUser.password = 'NewPassword123!';
      return true;
    }
  } catch (error) {
    console.log('❌ Password change failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testRefreshToken() {
  console.log('\n🔄 Testing Refresh Token...');
  try {
    const response = await axios.post(`${BASE_URL}/refresh`, {}, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (response.data.status === 'success') {
      const newToken = response.data.data.token;
      console.log('✅ Token refresh successful!');
      console.log(`   Old Token: ${authToken.substring(0, 20)}...`);
      console.log(`   New Token: ${newToken.substring(0, 20)}...`);
      authToken = newToken;
      return true;
    }
  } catch (error) {
    console.log('❌ Token refresh failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testProtectedRoute() {
  console.log('\n🛡️  Testing Protected Route (without token)...');
  try {
    await axios.get(`${BASE_URL}/me`);
    console.log('❌ Should have failed without token!');
    return false;
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Protected route correctly rejected unauthorized request!');
      return true;
    }
    console.log('❌ Unexpected error:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🧪 Testing MySQL Authentication API');
  console.log('=====================================\n');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Test User: ${testUser.email}\n`);
  
  const results = {
    registration: false,
    login: false,
    getMe: false,
    updateProfile: false,
    changePassword: false,
    refreshToken: false,
    protectedRoute: false
  };
  
  try {
    // Run tests in sequence
    results.registration = await testRegistration();
    if (!results.registration) {
      console.log('\n⚠️  Registration failed. Stopping tests.');
      return;
    }
    
    results.login = await testLogin();
    results.getMe = await testGetMe();
    results.updateProfile = await testUpdateProfile();
    results.changePassword = await testChangePassword();
    results.refreshToken = await testRefreshToken();
    results.protectedRoute = await testProtectedRoute();
    
    // Summary
    console.log('\n📊 Test Results Summary');
    console.log('========================');
    const passed = Object.values(results).filter(r => r).length;
    const total = Object.keys(results).length;
    
    Object.entries(results).forEach(([test, result]) => {
      const status = result ? '✅' : '❌';
      const testName = test.replace(/([A-Z])/g, ' $1').trim();
      console.log(`${status} ${testName.charAt(0).toUpperCase() + testName.slice(1)}`);
    });
    
    console.log(`\n${passed}/${total} tests passed`);
    
    if (passed === total) {
      console.log('\n🎉 All tests passed! MySQL authentication is working perfectly!');
    } else {
      console.log(`\n⚠️  ${total - passed} test(s) failed. Please review the errors above.`);
    }
    
  } catch (error) {
    console.error('\n❌ Test suite error:', error.message);
  }
}

// Check if server is running
async function checkServer() {
  try {
    await axios.get('http://localhost:5001');
    return true;
  } catch (error) {
    console.log('❌ Server is not running on port 5001');
    console.log('   Please start the server with: npm start');
    return false;
  }
}

// Run tests
(async () => {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await runAllTests();
  }
})();
