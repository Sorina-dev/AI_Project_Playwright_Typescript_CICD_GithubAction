/**
 * Expense Page Object for K6 Performance Tests
 * Expense Management API - Expense Operations
 * 
 * This class handles expense-related API operations
 */

import { BasePage } from './BasePage.js';
import { CONFIG } from '../config/config.js';
import { ResponseValidator, DataGenerator } from '../utils/helpers.js';

export class ExpensePage extends BasePage {
  
  /**
   * Get expense types available for user
   * @param {String} token - Authentication token
   * @returns {Object} HTTP response
   */
  getExpenseTypes(token) {
    console.log('📋 Getting expense types...');
    
    const response = this.get(
      CONFIG.ENDPOINTS.EXPENSE_TYPES,
      this.getAuthHeaders(token)
    );
    
    ResponseValidator.validateGetResponse(response, 'Get Expense Types');
    
    if (response.status === 200) {
      try {
        const expenseTypes = JSON.parse(response.body);
        const count = Array.isArray(expenseTypes) ? expenseTypes.length : expenseTypes.count || 'Unknown';
        console.log(`✅ Retrieved ${count} expense types`);
      } catch (e) {
        console.error('❌ Failed to parse expense types data');
      }
    }
    
    return response;
  }
  
  /**
   * Create new expense
   * @param {String} token - Authentication token
   * @param {Object} expenseData - Expense data (optional, will generate random if not provided)
   * @returns {Object} HTTP response
   */
  createExpense(token, expenseData = null) {
    const expense = expenseData || DataGenerator.randomExpense();
    
    console.log(`💰 Creating expense: ${expense.description} - ${expense.amount} ${expense.currency}`);
    
    const response = this.post(
      CONFIG.ENDPOINTS.EXPENSES,
      expense,
      this.getAuthHeaders(token)
    );
    
    ResponseValidator.validatePostResponse(response, 'Create Expense');
    
    if (response.status === 201 || response.status === 200) {
      try {
        const createdExpense = JSON.parse(response.body);
        console.log(`✅ Created expense with ID: ${createdExpense.id || createdExpense._id || 'Unknown'}`);
        return { ...response, createdExpense };
      } catch (e) {
        console.error('❌ Failed to parse created expense data');
      }
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