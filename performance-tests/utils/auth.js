/**
 * Authentication Utilities for K6 Performance Tests
 * JSONPlaceholder API - Simplified Authentication Module
 * 
 * This module handles user simulation and session management for JSONPlaceholder
 * Note: JSONPlaceholder doesn't require real authentication, so we simulate user sessions
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { CONFIG } from '../config/config.js';

/**
 * User authentication class - Simplified for JSONPlaceholder
 */
export class AuthService {
  constructor(baseUrl = CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
    this.sessions = new Map();
    this.users = []; // Will store users from JSONPlaceholder
  }
  
  /**
   * Get users from JSONPlaceholder and simulate authentication
   * @returns {Array} Array of available users
   */
  async initializeUsers() {
    const usersUrl = `${this.baseUrl}${CONFIG.ENDPOINTS.USERS}`;
    
    console.log('🔐 Initializing user sessions from JSONPlaceholder...');
    
    const response = http.get(usersUrl, {
      headers: CONFIG.HEADERS.DEFAULT,
      timeout: CONFIG.TIMEOUTS.DEFAULT
    });
    
    const authCheck = check(response, {
      '✅ User fetch status is 200': (r) => r.status === 200,
      '✅ Users data available': (r) => {
        try {
          const users = JSON.parse(r.body);
          return Array.isArray(users) && users.length > 0;
        } catch (e) {
          return false;
        }
      },
      '✅ Authentication response time < 2s': (r) => r.timings.duration < 2000
    });
    
    if (authCheck['✅ Authentication status is 200']) {
      try {
        const authData = JSON.parse(response.body);
        const token = authData.token || authData.access_token || authData.accessToken;
        
        if (token) {
          this.sessions.set(user.email, {
            token: token,
            user: user,
            authenticatedAt: Date.now(),
            expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
          });
          
          console.log(`✅ User ${user.email} authenticated successfully`);
          return token;
        }
      } catch (error) {
        console.error(`❌ Failed to parse authentication response: ${error.message}`);
      }
    } else {
      console.error(`❌ Authentication failed for ${user.email}: Status ${response.status}`);
      console.error(`Response: ${response.body}`);
    }
    
    return null;
  }
  
  /**
   * Get authentication headers for API requests
   * @param {String} token - Authentication token
   * @returns {Object} Headers with authorization
   */
  getAuthHeaders(token) {
    return {
      ...CONFIG.HEADERS.AUTHENTICATED,
      'Authorization': `Bearer ${token}`
    };
  }
  
  /**
   * Check if token is still valid
   * @param {String} email - User email
   * @returns {Boolean} True if token is valid
   */
  isTokenValid(email) {
    const session = this.sessions.get(email);
    if (!session) return false;
    
    return Date.now() < session.expiresAt;
  }
  
  /**
   * Get token for user (authenticate if needed)
   * @param {Object} user - User credentials
   * @returns {String} Valid authentication token
   */
  getValidToken(user) {
    if (this.isTokenValid(user.email)) {
      const session = this.sessions.get(user.email);
      return session.token;
    }
    
    return this.authenticate(user);
  }
  
  /**
   * Logout user and invalidate session
   * @param {String} email - User email
   */
  logout(email) {
    this.sessions.delete(email);
    console.log(`🔓 User ${email} logged out`);
  }
  
  /**
   * Get a random user from test data
   * @returns {Object} Random user credentials
   */
  getRandomUser() {
    const users = CONFIG.TEST_DATA.USERS;
    return users[Math.floor(Math.random() * users.length)];
  }
  
  /**
   * Simulate user login flow with realistic timing
   * @param {Object} user - User credentials
   * @returns {String} Authentication token
   */
  simulateLoginFlow(user) {
    console.log(`👤 Starting login flow for ${user.email}`);
    
    // Simulate user thinking time before login
    sleep(Math.random() * 2 + 1); // 1-3 seconds
    
    const token = this.authenticate(user);
    
    if (token) {
      // Simulate brief pause after successful login
      sleep(0.5);
    } else {
      // Simulate longer pause after failed login (user confusion)
      sleep(Math.random() * 3 + 2); // 2-5 seconds
    }
    
    return token;
  }
}

/**
 * Global authentication service instance
 */
export const authService = new AuthService();

/**
 * Helper function for quick authentication
 * @param {Object} user - User credentials
 * @returns {String} Authentication token
 */
export function authenticateUser(user) {
  return authService.getValidToken(user);
}

/**
 * Helper function to get random authenticated user
 * @returns {Object} {user, token}
 */
export function getRandomAuthenticatedUser() {
  const user = authService.getRandomUser();
  const token = authService.getValidToken(user);
  
  return {
    user: user,
    token: token,
    headers: authService.getAuthHeaders(token)
  };
}

/**
 * Setup function to pre-authenticate users for performance tests
 */
export function setupAuthentication() {
  console.log('🔧 Pre-authenticating test users...');
  
  CONFIG.TEST_DATA.USERS.forEach(user => {
    const token = authService.authenticate(user);
    if (token) {
      console.log(`✅ Pre-authenticated ${user.email}`);
    } else {
      console.error(`❌ Failed to pre-authenticate ${user.email}`);
    }
  });
  
  // Add small delay to avoid overwhelming the auth service
  sleep(1);
  
  console.log('✅ Authentication setup completed');
}