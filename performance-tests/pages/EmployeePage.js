/**
 * Employee Page Object for K6 Performance Tests
 * Expense Management API - Employee Operations
 * 
 * This class handles employee-related API operations
 */

import { BasePage } from './BasePage.js';
import { CONFIG } from '../config/config.js';
import { ResponseValidator } from '../utils/helpers.js';

export class EmployeePage extends BasePage {
  
  /**
   * Get current user information
   * @param {String} token - Authentication token
   * @returns {Object} HTTP response
   */
  getCurrentUser(token) {
    console.log('👤 Getting current user information...');
    
    const response = this.get(
      CONFIG.ENDPOINTS.EMPLOYEES_ME,
      this.getAuthHeaders(token)
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
   * Get list of employees (with filters)
   * @param {String} token - Authentication token
   * @param {Object} filters - Filter parameters
   * @returns {Object} HTTP response
   */
  getEmployees(token, filters = {}) {
    console.log('👥 Getting employees list...');
    
    const response = this.get(
      CONFIG.ENDPOINTS.EMPLOYEES,
      this.getAuthHeaders(token),
      filters
    );
    
    ResponseValidator.validateGetResponse(response, 'Get Employees');
    
    if (response.status === 200) {
      try {
        const employees = JSON.parse(response.body);
        const count = Array.isArray(employees) ? employees.length : employees.count || 'Unknown';
        console.log(`✅ Retrieved ${count} employees`);
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