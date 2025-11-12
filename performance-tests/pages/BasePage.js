/**
 * Base Page Object for K6 Performance Tests
 * Expense Management API - Base Page Class
 * 
 * This class provides common functionality for all API page objects
 */

import http from 'k6/http';
import { sleep } from 'k6';
import { CONFIG } from '../config/config.js';
import { ErrorHandler, PerformanceMetrics } from '../utils/helpers.js';

export class BasePage {
  constructor(baseUrl = CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
    this.defaultTimeout = CONFIG.TIMEOUTS.DEFAULT;
  }
  
  /**
   * Make a GET request
   * @param {String} endpoint - API endpoint
   * @param {Object} headers - Request headers
   * @param {Object} params - Query parameters
   * @returns {Object} HTTP response
   */
  get(endpoint, headers = {}, params = {}) {
    const url = this.buildUrl(endpoint, params);
    
    const response = http.get(url, {
      headers: { ...CONFIG.HEADERS.DEFAULT, ...headers },
      timeout: this.defaultTimeout
    });
    
    PerformanceMetrics.logMetrics(response, `GET ${endpoint}`);
    ErrorHandler.handleApiError(response, `GET ${endpoint}`);
    
    return response;
  }
  
  /**
   * Make a POST request
   * @param {String} endpoint - API endpoint
   * @param {Object} payload - Request payload
   * @param {Object} headers - Request headers
   * @returns {Object} HTTP response
   */
  post(endpoint, payload, headers = {}) {
    const url = this.buildUrl(endpoint);
    
    const response = http.post(url, JSON.stringify(payload), {
      headers: { ...CONFIG.HEADERS.DEFAULT, ...headers },
      timeout: this.defaultTimeout
    });
    
    PerformanceMetrics.logMetrics(response, `POST ${endpoint}`);
    ErrorHandler.handleApiError(response, `POST ${endpoint}`);
    
    return response;
  }
  
  /**
   * Make a PUT request
   * @param {String} endpoint - API endpoint
   * @param {Object} payload - Request payload
   * @param {Object} headers - Request headers
   * @returns {Object} HTTP response
   */
  put(endpoint, payload, headers = {}) {
    const url = this.buildUrl(endpoint);
    
    const response = http.put(url, JSON.stringify(payload), {
      headers: { ...CONFIG.HEADERS.DEFAULT, ...headers },
      timeout: this.defaultTimeout
    });
    
    PerformanceMetrics.logMetrics(response, `PUT ${endpoint}`);
    ErrorHandler.handleApiError(response, `PUT ${endpoint}`);
    
    return response;
  }
  
  /**
   * Make a DELETE request
   * @param {String} endpoint - API endpoint
   * @param {Object} headers - Request headers
   * @returns {Object} HTTP response
   */
  delete(endpoint, headers = {}) {
    const url = this.buildUrl(endpoint);
    
    const response = http.del(url, null, {
      headers: { ...CONFIG.HEADERS.DEFAULT, ...headers },
      timeout: this.defaultTimeout
    });
    
    PerformanceMetrics.logMetrics(response, `DELETE ${endpoint}`);
    ErrorHandler.handleApiError(response, `DELETE ${endpoint}`);
    
    return response;
  }
  
  /**
   * Build full URL with query parameters
   * @param {String} endpoint - API endpoint
   * @param {Object} params - Query parameters
   * @returns {String} Complete URL
   */
  buildUrl(endpoint, params = {}) {
    let url = `${this.baseUrl}${endpoint}`;
    
    const queryString = Object.keys(params)
      .map(key => {
        const value = params[key];
        if (Array.isArray(value)) {
          return value.map(v => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`).join('&');
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      })
      .filter(param => param)
      .join('&');
    
    if (queryString) {
      url += `?${queryString}`;
    }
    
    return url;
  }
  
  /**
   * Set authentication headers
   * @param {String} token - Authentication token
   * @returns {Object} Headers with authorization
   */
  getAuthHeaders(token) {
    return {
      'Authorization': `Bearer ${token}`
    };
  }
  
  /**
   * Wait for response with timeout
   * @param {Function} requestFn - Function that makes the request
   * @param {Number} timeoutMs - Timeout in milliseconds
   * @returns {Object} HTTP response
   */
  waitForResponse(requestFn, timeoutMs = 30000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      try {
        const response = requestFn();
        if (response.status < 500) { // Accept any non-server error
          return response;
        }
      } catch (error) {
        console.log(`⏳ Request failed, retrying... ${error.message}`);
      }
      
      // Wait before retry
      sleep(1);
    }
    
    throw new Error(`Request timed out after ${timeoutMs}ms`);
  }
}