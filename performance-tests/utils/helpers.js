/**
 * Common Utilities for K6 Performance Tests
 * Expense Management API - Utility Functions
 * 
 * This module contains common utility functions used across all tests
 */

import { check, sleep } from 'k6';
import { CONFIG } from '../config/config.js';

/**
 * Generate random test data
 */
export class DataGenerator {
  
  /**
   * Generate random string
   * @param {Number} length - String length
   * @returns {String} Random string
   */
  static randomString(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  
  /**
   * Generate random number within range
   * @param {Number} min - Minimum value
   * @param {Number} max - Maximum value
   * @returns {Number} Random number
   */
  static randomNumber(min = 1, max = 100) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  /**
   * Generate random amount (money)
   * @param {Number} min - Minimum amount
   * @param {Number} max - Maximum amount
   * @returns {Number} Random amount with 2 decimal places
   */
  static randomAmount(min = 10, max = 1000) {
    return Math.round((Math.random() * (max - min) + min) * 100) / 100;
  }
  
  /**
   * Generate random date within range
   * @param {Date} start - Start date
   * @param {Date} end - End date
   * @returns {String} Random date in ISO format
   */
  static randomDate(start = new Date(2024, 0, 1), end = new Date()) {
    const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
    return new Date(randomTime).toISOString();
  }
  
  /**
   * Generate random expense data
   * @returns {Object} Random expense data
   */
  static randomExpense() {
    return {
      description: `Test expense ${this.randomString(6)}`,
      amount: this.randomAmount(10, 500),
      currency: this.randomArrayElement(CONFIG.TEST_DATA.CURRENCIES),
      expenseType: this.randomArrayElement(CONFIG.TEST_DATA.EXPENSE_TYPES),
      date: this.randomDate(new Date(2024, 0, 1), new Date()),
      notes: `Generated for performance testing - ${this.randomString(10)}`
    };
  }
  
  /**
   * Generate random medical expense data
   * @returns {Object} Random medical expense data
   */
  static randomMedicalExpense() {
    return {
      description: `Medical expense ${this.randomString(6)}`,
      amount: this.randomAmount(50, 1000),
      currency: this.randomArrayElement(CONFIG.TEST_DATA.CURRENCIES),
      date: this.randomDate(new Date(2024, 0, 1), new Date()),
      providerName: `Medical Provider ${this.randomString(8)}`,
      notes: `Medical test data - ${this.randomString(10)}`
    };
  }
  
  /**
   * Generate random location data
   * @returns {Object} Random location data
   */
  static randomLocation() {
    return {
      name: `Office ${this.randomString(6)}`,
      address: `${this.randomNumber(1, 999)} Test Street`,
      city: this.randomArrayElement(CONFIG.TEST_DATA.LOCATIONS.CITIES),
      country: this.randomArrayElement(CONFIG.TEST_DATA.LOCATIONS.COUNTRIES),
      postalCode: this.randomString(6).toUpperCase()
    };
  }
  
  /**
   * Get random element from array
   * @param {Array} array - Array to select from
   * @returns {*} Random array element
   */
  static randomArrayElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
  
  /**
   * Generate UUID-like string
   * @returns {String} UUID-like string
   */
  static generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

/**
 * Response validation utilities
 */
export class ResponseValidator {
  
  /**
   * Validate standard API response
   * @param {Object} response - HTTP response
   * @param {String} testName - Test name for logging
   * @returns {Boolean} True if response is valid
   */
  static validateResponse(response, testName = 'API Request') {
    const checks = check(response, {
      [`✅ ${testName} - Status is successful (2xx)`]: (r) => r.status >= 200 && r.status < 300,
      [`✅ ${testName} - Response time < 3s`]: (r) => r.timings.duration < 3000,
      [`✅ ${testName} - Response has content`]: (r) => r.body && r.body.length > 0,
      [`✅ ${testName} - Content-Type is JSON`]: (r) => {
        const contentType = r.headers['Content-Type'] || r.headers['content-type'];
        return contentType && contentType.includes('application/json');
      }
    });
    
    if (!checks[`✅ ${testName} - Status is successful (2xx)`]) {
      console.error(`❌ ${testName} failed: Status ${response.status}`);
      console.error(`Response: ${response.body}`);
    }
    
    return Object.values(checks).every(check => check);
  }
  
  /**
   * Validate GET response with additional checks
   * @param {Object} response - HTTP response
   * @param {String} testName - Test name for logging
   * @returns {Boolean} True if response is valid
   */
  static validateGetResponse(response, testName = 'GET Request') {
    const checks = check(response, {
      [`✅ ${testName} - Status is 200`]: (r) => r.status === 200,
      [`✅ ${testName} - Response time < 2s`]: (r) => r.timings.duration < 2000,
      [`✅ ${testName} - Response has content`]: (r) => r.body && r.body.length > 0,
      [`✅ ${testName} - No server errors`]: (r) => r.status < 500,
      [`✅ ${testName} - Valid JSON response`]: (r) => {
        try {
          JSON.parse(r.body);
          return true;
        } catch (e) {
          return false;
        }
      }
    });
    
    return Object.values(checks).every(check => check);
  }
  
  /**
   * Validate POST response with creation checks
   * @param {Object} response - HTTP response
   * @param {String} testName - Test name for logging
   * @returns {Boolean} True if response is valid
   */
  static validatePostResponse(response, testName = 'POST Request') {
    const checks = check(response, {
      [`✅ ${testName} - Status is 201 or 200`]: (r) => r.status === 201 || r.status === 200,
      [`✅ ${testName} - Response time < 3s`]: (r) => r.timings.duration < 3000,
      [`✅ ${testName} - Created resource has ID`]: (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.id || body._id || body.uuid;
        } catch (e) {
          return false;
        }
      }
    });
    
    return Object.values(checks).every(check => check);
  }
  
  /**
   * Validate PUT response with update checks
   * @param {Object} response - HTTP response
   * @param {String} testName - Test name for logging
   * @returns {Boolean} True if response is valid
   */
  static validatePutResponse(response, testName = 'PUT Request') {
    const checks = check(response, {
      [`✅ ${testName} - Status is 200 or 204`]: (r) => r.status === 200 || r.status === 204,
      [`✅ ${testName} - Response time < 2s`]: (r) => r.timings.duration < 2000,
      [`✅ ${testName} - No server errors`]: (r) => r.status < 500
    });
    
    return Object.values(checks).every(check => check);
  }
  
  /**
   * Validate DELETE response
   * @param {Object} response - HTTP response
   * @param {String} testName - Test name for logging
   * @returns {Boolean} True if response is valid
   */
  static validateDeleteResponse(response, testName = 'DELETE Request') {
    const checks = check(response, {
      [`✅ ${testName} - Status is 200, 204, or 404`]: (r) => [200, 204, 404].includes(r.status),
      [`✅ ${testName} - Response time < 2s`]: (r) => r.timings.duration < 2000,
      [`✅ ${testName} - No server errors`]: (r) => r.status < 500
    });
    
    return Object.values(checks).every(check => check);
  }
}

/**
 * Think time utilities for realistic user behavior
 */
export class ThinkTime {
  
  /**
   * Short think time (reading/quick decision)
   */
  static short() {
    sleep(CONFIG.THINK_TIMES.SHORT + Math.random());
  }
  
  /**
   * Medium think time (form filling/selection)
   */
  static medium() {
    sleep(CONFIG.THINK_TIMES.MEDIUM + Math.random() * 2);
  }
  
  /**
   * Long think time (complex decision/reading)
   */
  static long() {
    sleep(CONFIG.THINK_TIMES.LONG + Math.random() * 3);
  }
  
  /**
   * Very long think time (break/interruption)
   */
  static veryLong() {
    sleep(CONFIG.THINK_TIMES.VERY_LONG + Math.random() * 5);
  }
  
  /**
   * Random think time
   */
  static random() {
    const times = [this.short, this.medium, this.long];
    const randomTime = times[Math.floor(Math.random() * times.length)];
    randomTime();
  }
  
  /**
   * Realistic page load waiting
   */
  static pageLoad() {
    sleep(0.5 + Math.random() * 1.5); // 0.5-2 seconds
  }
}

/**
 * Error handling utilities
 */
export class ErrorHandler {
  
  /**
   * Handle and log API errors
   * @param {Object} response - HTTP response
   * @param {String} operation - Operation name
   */
  static handleApiError(response, operation) {
    if (response.status >= 400) {
      console.error(`❌ ${operation} failed:`);
      console.error(`   Status: ${response.status}`);
      console.error(`   URL: ${response.url}`);
      console.error(`   Response: ${response.body.substring(0, 500)}`);
      
      // Log specific error types
      if (response.status === 401) {
        console.error('   🔒 Authentication required or token expired');
      } else if (response.status === 403) {
        console.error('   🚫 Access forbidden - insufficient permissions');
      } else if (response.status === 404) {
        console.error('   🔍 Resource not found');
      } else if (response.status === 429) {
        console.error('   ⏱️ Rate limit exceeded');
      } else if (response.status >= 500) {
        console.error('   🔥 Server error - infrastructure issue');
      }
    }
  }
  
  /**
   * Retry logic with exponential backoff
   * @param {Function} operation - Function to retry
   * @param {Number} maxRetries - Maximum retry attempts
   * @param {Number} baseDelay - Base delay in seconds
   * @returns {*} Operation result
   */
  static async retryWithBackoff(operation, maxRetries = 3, baseDelay = 1) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return operation();
      } catch (error) {
        lastError = error;
        
        if (attempt < maxRetries) {
          const delay = baseDelay * Math.pow(2, attempt - 1); // Exponential backoff
          console.log(`⏳ Retry attempt ${attempt}/${maxRetries} in ${delay}s`);
          sleep(delay);
        }
      }
    }
    
    throw lastError;
  }
}

/**
 * Performance metrics collection
 */
export class PerformanceMetrics {
  
  /**
   * Log performance metrics
   * @param {Object} response - HTTP response
   * @param {String} operation - Operation name
   */
  static logMetrics(response, operation) {
    const duration = Math.round(response.timings.duration);
    const status = response.status;
    
    if (status < 400) {
      console.log(`📊 ${operation}: ${duration}ms (${status})`);
    } else {
      console.log(`🔴 ${operation}: ${duration}ms (${status}) - ERROR`);
    }
    
    // Log detailed timing breakdown for slow requests
    if (duration > 2000) {
      console.log(`   DNS: ${Math.round(response.timings.dns_lookup)}ms`);
      console.log(`   Connect: ${Math.round(response.timings.tcp_handshake)}ms`);
      console.log(`   TLS: ${Math.round(response.timings.tls_handshake)}ms`);
      console.log(`   Send: ${Math.round(response.timings.sending)}ms`);
      console.log(`   Wait: ${Math.round(response.timings.waiting)}ms`);
      console.log(`   Receive: ${Math.round(response.timings.receiving)}ms`);
    }
  }
}

export default {
  DataGenerator,
  ResponseValidator,
  ThinkTime,
  ErrorHandler,
  PerformanceMetrics
};