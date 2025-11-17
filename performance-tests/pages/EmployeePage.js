/**
 * Employee Page Object for K6 Performance Tests
 * JSONPlaceholder API - User Operations (simulating employees)
 * 
 * This class handles user/employee-related API operations using JSONPlaceholder
 */

import { BasePage } from './BasePage.js';
import { CONFIG } from '../config/config.js';
import { ResponseValidator } from '../utils/helpers.js';

export class EmployeePage extends BasePage {
  
  /**
   * Get current user information (simulate by getting random user)
   * @param {Number} userId - User ID (no token needed for JSONPlaceholder)
   * @returns {Object} HTTP response
   */
  getCurrentUser(userId = 1) {
    console.log(`👤 Getting user information for ID: ${userId}...`);
    
    const response = this.get(
      `${CONFIG.ENDPOINTS.USERS}/${userId}`,
      {} // No auth headers needed for JSONPlaceholder
    );
    
    ResponseValidator.validateGetResponse(response, 'Get Current User');
    
    if (response.status === 200) {
      try {
        const user = JSON.parse(response.body);
        console.log(`✅ Retrieved user: ${user.email || user.name || 'Unknown'}`);
      } catch (e) {
        console.error('❌ Failed to parse user data');
      }
    }
    
    return response;
  }
  
  /**
   * Get list of users/employees
   * @param {Object} filters - Filter parameters (JSONPlaceholder has limited filtering)
   * @returns {Object} HTTP response
   */
  getEmployees(filters = {}) {
    console.log('👥 Getting employees/users list...');
    
    const response = this.get(
      CONFIG.ENDPOINTS.USERS, // Use USERS endpoint for JSONPlaceholder
      {}, // No auth headers needed
      filters
    );
    
    ResponseValidator.validateGetResponse(response, 'Get Employees');
    
    if (response.status === 200) {
      try {
        const employees = JSON.parse(response.body);
        const count = Array.isArray(employees) ? employees.length : employees.count || 'Unknown';
        console.log(`✅ Retrieved ${count} employees/users`);
      } catch (e) {
        console.error('❌ Failed to parse employees data');
      }
    }
    
    return response;
  }
  
  /**
   * Search employees with pagination
   * @param {String} token - Authentication token
   * @param {String} searchTerm - Search term
   * @param {Number} page - Page number
   * @param {Number} pageSize - Page size
   * @returns {Object} HTTP response
   */
  searchEmployees(token, searchTerm = '', page = 1, pageSize = 20) {
    console.log(`🔍 Searching employees: "${searchTerm}" (page ${page})`);
    
    const params = {
      search: searchTerm,
      page: page,
      pageSize: pageSize
    };
    
    const response = this.get(
      CONFIG.ENDPOINTS.EMPLOYEES,
      this.getAuthHeaders(token),
      params
    );
    
    ResponseValidator.validateGetResponse(response, 'Search Employees');
    
    return response;
  }
}

export default EmployeePage;