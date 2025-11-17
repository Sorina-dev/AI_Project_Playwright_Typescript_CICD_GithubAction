/**
 * Expense Page Object for K6 Performance Tests
 * JSONPlaceholder API - Posts Operations (simulating expenses)
 * 
 * This class handles post/expense-related API operations using JSONPlaceholder
 */

import { BasePage } from './BasePage.js';
import { CONFIG } from '../config/config.js';
import { ResponseValidator, DataGenerator } from '../utils/helpers.js';

export class ExpensePage extends BasePage {
  
  /**
   * Get expense types available (simulate using albums as categories)
   * @param {Number} userId - User ID (no token needed for JSONPlaceholder)
   * @returns {Object} HTTP response
   */
  getExpenseTypes(userId = 1) {
    console.log('📋 Getting expense types/categories (albums)...');
    
    const response = this.get(
      CONFIG.ENDPOINTS.ALBUMS, // Using albums as expense categories
      {} // No auth headers needed
    );
    
    ResponseValidator.validateGetResponse(response, 'Get Expense Types');
    
    if (response.status === 200) {
      try {
        const expenseTypes = JSON.parse(response.body);
        const count = Array.isArray(expenseTypes) ? expenseTypes.length : expenseTypes.count || 'Unknown';
        console.log(`✅ Retrieved ${count} expense types/categories`);
      } catch (e) {
        console.error('❌ Failed to parse expense types data');
      }
    }
    
    return response;
  }
  
  /**
   * Create new expense (simulate using posts)
   * @param {Number} userId - User ID
   * @param {Object} expenseData - Expense data (optional, will generate random if not provided)
   * @returns {Object} HTTP response
   */
  createExpense(userId = 1, expenseData = null) {
    const expense = expenseData || DataGenerator.randomExpense();
    
    console.log(`💰 Creating expense: ${expense.title || expense.description || 'New Expense'}`);
    
    const response = this.post(
      CONFIG.ENDPOINTS.POSTS, // Using posts as expenses
      expense,
      {} // No auth headers needed for JSONPlaceholder
    );
    
    ResponseValidator.validatePostResponse(response, 'Create Expense');
    
    if (response.status === 201 || response.status === 200) {
      try {
        const createdExpense = JSON.parse(response.body);
        console.log(`✅ Created expense with ID: ${createdExpense.id || 'Unknown'}`);
        return { ...response, createdExpense };
      } catch (e) {
        console.error('❌ Failed to parse created expense data');
      }
    }
    
    return response;
  }
  
  /**
   * Get user's expenses (posts by user ID)
   * @param {Number} userId - User ID
   * @returns {Object} HTTP response
   */
  getUserExpenses(userId) {
    console.log(`📋 Getting expenses for user ${userId}...`);
    
    const response = this.get(
      `${CONFIG.ENDPOINTS.POSTS}?userId=${userId}`,
      {}
    );
    
    ResponseValidator.validateGetResponse(response, 'Get User Expenses');
    
    if (response.status === 200) {
      try {
        const expenses = JSON.parse(response.body);
        console.log(`✅ Retrieved ${expenses.length} expenses for user ${userId}`);
      } catch (e) {
        console.error('❌ Failed to parse expenses data');
      }
    }
    
    return response;
  }
  
  /**
   * Update expense (using PUT)
   * @param {Number} expenseId - Expense ID
   * @param {Object} expenseData - Updated expense data
   * @returns {Object} HTTP response
   */
  updateExpense(expenseId, expenseData) {
    console.log(`📝 Updating expense ${expenseId}...`);
    
    const response = this.put(
      `${CONFIG.ENDPOINTS.POSTS}/${expenseId}`,
      expenseData,
      {}
    );
    
    ResponseValidator.validatePutResponse(response, 'Update Expense');
    
    if (response.status === 200) {
      console.log(`✅ Successfully updated expense ${expenseId}`);
    }
    
    return response;
  }
  
  /**
   * Delete expense
   * @param {Number} expenseId - Expense ID
   * @returns {Object} HTTP response
   */
  deleteExpense(expenseId) {
    console.log(`🗑️ Deleting expense ${expenseId}...`);
    
    const response = this.delete(`${CONFIG.ENDPOINTS.POSTS}/${expenseId}`);
    
    ResponseValidator.validateDeleteResponse(response, 'Delete Expense');
    
    if (response.status === 200) {
      console.log(`✅ Successfully deleted expense ${expenseId}`);
    }
    
    return response;
  }
  
  /**
   * Update expenses (bulk update)
   * @param {String} token - Authentication token
   * @param {Array} expenses - Array of expense updates
   * @returns {Object} HTTP response
   */
  updateExpenses(token, expenses) {
    console.log(`📝 Updating ${expenses.length} expenses...`);
    
    const updateData = {
      expenses: expenses
    };
    
    const response = this.put(
      CONFIG.ENDPOINTS.EXPENSES,
      updateData,
      this.getAuthHeaders(token)
    );
    
    ResponseValidator.validatePutResponse(response, 'Update Expenses');
    
    if (response.status === 200) {
      console.log(`✅ Successfully updated ${expenses.length} expenses`);
    }
    
    return response;
  }
  
  /**
   * Get user's expense requests
   * @param {String} token - Authentication token
   * @param {Object} filters - Filter parameters
   * @returns {Object} HTTP response
   */
  getMyExpenses(token, filters = {}) {
    console.log('📊 Getting my expense requests...');
    
    const response = this.get(
      CONFIG.ENDPOINTS.REQUEST_EXPENSES + '/my',
      this.getAuthHeaders(token),
      filters
    );
    
    ResponseValidator.validateGetResponse(response, 'Get My Expenses');
    
    if (response.status === 200) {
      try {
        const expenses = JSON.parse(response.body);
        const count = Array.isArray(expenses) ? expenses.length : expenses.count || 'Unknown';
        console.log(`✅ Retrieved ${count} expense requests`);
      } catch (e) {
        console.error('❌ Failed to parse expenses data');
      }
    }
    
    return response;
  }
  
  /**
   * Delete expense request
   * @param {String} token - Authentication token
   * @param {String} requestId - Request ID to delete
   * @returns {Object} HTTP response
   */
  deleteExpenseRequest(token, requestId) {
    console.log(`🗑️ Deleting expense request: ${requestId}`);
    
    const response = this.delete(
      `${CONFIG.ENDPOINTS.REQUEST_EXPENSES}/${requestId}`,
      this.getAuthHeaders(token)
    );
    
    ResponseValidator.validateDeleteResponse(response, 'Delete Expense Request');
    
    if (response.status === 200 || response.status === 204) {
      console.log(`✅ Successfully deleted expense request: ${requestId}`);
    }
    
    return response;
  }
  
  /**
   * Get expense summary
   * @param {String} token - Authentication token
   * @param {Object} filters - Filter parameters (date range, status, etc.)
   * @returns {Object} HTTP response
   */
  getExpenseSummary(token, filters = {}) {
    console.log('📈 Getting expense summary...');
    
    const response = this.get(
      CONFIG.ENDPOINTS.EXPENSES + '/summary',
      this.getAuthHeaders(token),
      filters
    );
    
    ResponseValidator.validateGetResponse(response, 'Get Expense Summary');
    
    if (response.status === 200) {
      try {
        const summary = JSON.parse(response.body);
        console.log(`✅ Retrieved expense summary: ${summary.totalAmount || 'Unknown'} total`);
      } catch (e) {
        console.error('❌ Failed to parse expense summary');
      }
    }
    
    return response;
  }
}

export default ExpensePage;