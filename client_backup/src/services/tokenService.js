import api from './api';

/**
 * Token Service
 * Handles automatic token refresh and expiration management
 */
class TokenService {
  constructor() {
    this.refreshInterval = null;
    this.isRefreshing = false;
    this.refreshIntervalMs = 20 * 60 * 1000; // 20 minutes (adjust based on JWT_EXPIRE)
  }

  /**
   * Start automatic token refresh
   * Call this when user logs in or app loads with existing token
   */
  startAutoRefresh() {
    // Don't start if already running
    if (this.refreshInterval) {
      return;
    }

    console.log('🔄 Token auto-refresh started');
    
    // Refresh immediately if token is expiring soon
    if (this.isTokenExpiringSoon()) {
      this.refreshToken();
    }

    // Set up periodic refresh
    this.refreshInterval = setInterval(() => {
      if (this.isTokenExpiringSoon()) {
        this.refreshToken();
      }
    }, this.refreshIntervalMs);
  }

  /**
   * Stop automatic token refresh
   * Call this when user logs out
   */
  stopAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
      console.log('⏹️  Token auto-refresh stopped');
    }
  }

  /**
   * Manually refresh the token
   * Returns the new token or null if refresh failed
   */
  async refreshToken() {
    if (this.isRefreshing) {
      console.log('⏳ Token refresh already in progress');
      return null;
    }

    try {
      this.isRefreshing = true;
      console.log('🔄 Refreshing token...');
      
      const response = await api.post('/auth/refresh');
      
      if (response.data.status === 'success') {
        const newToken = response.data.data.token;
        localStorage.setItem('token', newToken);
        console.log('✅ Token refreshed successfully');
        return newToken;
      }
    } catch (error) {
      console.error('❌ Failed to refresh token:', error.response?.data?.message || error.message);
      
      // If refresh fails with 401, user needs to re-login
      if (error.response?.status === 401) {
        this.handleTokenExpired();
      }
      
      return null;
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Extend token expiration (for active quiz sessions)
   * This gives users extra time during quizzes
   */
  async extendToken() {
    try {
      console.log('⏰ Extending token expiration...');
      
      const response = await api.post('/auth/extend');
      
      if (response.data.status === 'success') {
        const extendedToken = response.data.data.token;
        localStorage.setItem('token', extendedToken);
        console.log('✅ Token extended successfully');
        return extendedToken;
      }
    } catch (error) {
      console.error('❌ Failed to extend token:', error.response?.data?.message || error.message);
      return null;
    }
  }

  /**
   * Check if token is about to expire (within 5 minutes)
   */
  isTokenExpiringSoon() {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const timeUntilExpiry = expirationTime - currentTime;
      
      // Return true if token expires in less than 5 minutes
      const isExpiringSoon = timeUntilExpiry < 5 * 60 * 1000;
      
      if (isExpiringSoon) {
        const minutesLeft = Math.floor(timeUntilExpiry / 1000 / 60);
        console.log(`⚠️  Token expiring in ${minutesLeft} minutes`);
      }
      
      return isExpiringSoon;
    } catch (err) {
      console.error('Error checking token expiration:', err);
      return false;
    }
  }

  /**
   * Check if token is already expired
   */
  isTokenExpired() {
    const token = localStorage.getItem('token');
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      
      return currentTime >= expirationTime;
    } catch {
      return true;
    }
  }

  /**
   * Get time until token expires (in minutes)
   */
  getTimeUntilExpiry() {
    const token = localStorage.getItem('token');
    if (!token) return 0;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      const timeUntilExpiry = expirationTime - currentTime;
      
      return Math.floor(timeUntilExpiry / 1000 / 60); // Return in minutes
    } catch {
      return 0;
    }
  }

  /**
   * Handle token expiration - logout user
   */
  handleTokenExpired() {
    console.log('🔒 Token expired - logging out');
    this.stopAutoRefresh();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Only redirect if not already on login page
    if (window.location.pathname !== '/login') {
      window.location.href = '/login?expired=true';
    }
  }

  /**
   * Debug: Log token information
   */
  debugTokenInfo() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationDate = new Date(payload.exp * 1000);
      const minutesLeft = this.getTimeUntilExpiry();
      
      console.log('📋 Token Info:');
      console.log('  User ID:', payload.id);
      console.log('  Expires at:', expirationDate.toLocaleString());
      console.log('  Time left:', minutesLeft, 'minutes');
      console.log('  Expiring soon?', this.isTokenExpiringSoon());
      console.log('  Expired?', this.isTokenExpired());
    } catch (error) {
      console.error('Error parsing token:', error);
    }
  }
}

// Export singleton instance
export default new TokenService();
