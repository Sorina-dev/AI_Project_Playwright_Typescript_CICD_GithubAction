/**
 * K6 Performance Test Suite - JSONPlaceholder with Enhanced POM Structure
 * JSONPlaceholder API - Complete Performance Testing with 50 Users
 * 
 * This test suite provides comprehensive performance testing using JSONPlaceholder
 * Simulates expense management system with realistic user flows:
 * - Users as Employees
 * - Posts as Expenses  
 * - Albums as Expense Categories
 * - Comments as Expense Notes/Approvals
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { CONFIG } from '../config/config.js';

// Performance test configuration with 50 users over 2 minutes as requested
export const options = {
  scenarios: {
    expense_management_load_test: {
      executor: 'ramping-vus',
      stages: [
        { duration: '2m', target: 50 },    // Primary requirement: ramp to 50 users over 2 minutes
        { duration: '3m', target: 50 },    // Sustain 50 users for 3 minutes
        { duration: '1m', target: 0 },     // Ramp down
      ],
    }
  },
  thresholds: {
    // Performance requirements (Relaxed for demo API)
    http_req_duration: ['p(95)<3000'],     // 95% of requests should be below 3000ms
    http_req_failed: ['rate<0.2'],         // Less than 20% of requests should fail (demo API)
    http_reqs: ['rate>1'],                 // Should generate more than 1 request per second
    
    // Individual endpoint thresholds (POM-based, relaxed)
    'http_req_duration{name:get_user}': ['p(95)<2000'],
    'http_req_duration{name:get_users}': ['p(95)<1500'],
    'http_req_duration{name:get_posts}': ['p(95)<2000'],
    'http_req_duration{name:create_post}': ['p(95)<3000'],
    'http_req_duration{name:update_post}': ['p(95)<3000'],
    'http_req_duration{name:delete_post}': ['p(95)<2000'],
    'http_req_duration{name:get_albums}': ['p(95)<2000'],
    'http_req_duration{name:get_comments}': ['p(95)<2000'],
    
    // System health checks (relaxed for demo)
    checks: ['rate>0.8'],                  // 80% of checks should pass (demo API)
    'group_duration{group:::User Management}': ['p(95)<5000'],
    'group_duration{group:::Expense Operations}': ['p(95)<8000'],
    'group_duration{group:::Expense Categories}': ['p(95)<3000'],
  }
};

export default function () {
  const userId = Math.floor(Math.random() * 10) + 1; // Random user 1-10
  console.log(`🎭 VU${__VU}: Starting expense management simulation (Employee ID: ${userId})`);

  // GROUP 1: User Management Operations (Employee Management)
  group('User Management', () => {
    
    // Get current employee profile
    const userResponse = http.get(`${CONFIG.BASE_URL}${CONFIG.ENDPOINTS.USERS}/${userId}`, {
      headers: CONFIG.HEADERS.DEFAULT,
      timeout: CONFIG.TIMEOUTS.DEFAULT,
      tags: { name: 'get_user' }
    });
    
    check(userResponse, {
      '✅ Employee profile retrieved': (r) => r.status === 200,
      '✅ Employee has valid email': (r) => {
        try {
          const user = JSON.parse(r.body);
          return user.email && user.email.includes('@');
        } catch (e) {
          return false;
        }
      },
      '✅ Response time acceptable': (r) => r.timings.duration < 1000,
    });
    
    if (userResponse.status === 200) {
      try {
        const employee = JSON.parse(userResponse.body);
        console.log(`👤 Employee: ${employee.name} (${employee.email})`);
      } catch (e) {
        console.error('❌ Failed to parse employee data');
      }
    }
    
    sleep(1);
    
    // Get all employees (for manager view)
    const allUsersResponse = http.get(`${CONFIG.BASE_URL}${CONFIG.ENDPOINTS.USERS}`, {
      headers: CONFIG.HEADERS.DEFAULT,
      timeout: CONFIG.TIMEOUTS.DEFAULT,
      tags: { name: 'get_users' }
    });
    
    check(allUsersResponse, {
      '✅ Employee directory loaded': (r) => r.status === 200,
      '✅ Multiple employees found': (r) => {
        try {
          const employees = JSON.parse(r.body);
          return Array.isArray(employees) && employees.length >= 5;
        } catch (e) {
          return false;
        }
      },
    });
    
    if (allUsersResponse.status === 200) {
      try {
        const employees = JSON.parse(allUsersResponse.body);
        console.log(`👥 Employee directory: ${employees.length} total employees`);
      } catch (e) {
        console.error('❌ Failed to parse employee directory');
      }
    }
    
    sleep(2);
  });

  // GROUP 2: Expense Categories Management
  group('Expense Categories', () => {
    
    // Get expense categories (albums represent expense types)
    const categoriesResponse = http.get(`${CONFIG.BASE_URL}${CONFIG.ENDPOINTS.ALBUMS}`, {
      headers: CONFIG.HEADERS.DEFAULT,
      timeout: CONFIG.TIMEOUTS.DEFAULT,
      tags: { name: 'get_albums' }
    });
    
    check(categoriesResponse, {
      '✅ Expense categories loaded': (r) => r.status === 200,
      '✅ Categories available': (r) => {
        try {
          const categories = JSON.parse(r.body);
          return Array.isArray(categories) && categories.length > 0;
        } catch (e) {
          return false;
        }
      },
    });
    
    if (categoriesResponse.status === 200) {
      try {
        const categories = JSON.parse(categoriesResponse.body);
        console.log(`📋 Available expense categories: ${categories.length}`);
      } catch (e) {
        console.error('❌ Failed to parse categories');
      }
    }
    
    sleep(1);
  });

  // GROUP 3: Expense Operations (Core Business Logic)
  group('Expense Operations', () => {
    
    // View existing expenses for employee
    const userExpensesResponse = http.get(`${CONFIG.BASE_URL}${CONFIG.ENDPOINTS.POSTS}?userId=${userId}`, {
      headers: CONFIG.HEADERS.DEFAULT,
      timeout: CONFIG.TIMEOUTS.DEFAULT,
      tags: { name: 'get_posts' }
    });
    
    check(userExpensesResponse, {
      '✅ Employee expenses retrieved': (r) => r.status === 200,
      '✅ Expense data structure valid': (r) => {
        try {
          const expenses = JSON.parse(r.body);
          return Array.isArray(expenses);
        } catch (e) {
          return false;
        }
      },
    });
    
    if (userExpensesResponse.status === 200) {
      try {
        const expenses = JSON.parse(userExpensesResponse.body);
        console.log(`📄 Employee has ${expenses.length} existing expenses`);
      } catch (e) {
        console.error('❌ Failed to parse expense data');
      }
    }
    
    sleep(1);
    
    // Create new expense report
    const expenseData = {
      title: `Business Expense - Employee ${userId} - ${new Date().toISOString().split('T')[0]}`,
      body: `Travel and accommodation expenses for business meeting. Amount: $${Math.floor(Math.random() * 500) + 50}. Category: Business Travel.`,
      userId: userId
    };
    
    const createExpenseResponse = http.post(
      `${CONFIG.BASE_URL}${CONFIG.ENDPOINTS.POSTS}`,
      JSON.stringify(expenseData),
      {
        headers: CONFIG.HEADERS.DEFAULT,
        timeout: CONFIG.TIMEOUTS.DEFAULT,
        tags: { name: 'create_post' }
      }
    );
    
    check(createExpenseResponse, {
      '✅ Expense created successfully': (r) => r.status === 201,
      '✅ Created expense has ID': (r) => {
        try {
          const expense = JSON.parse(r.body);
          return expense.id && expense.id > 0;
        } catch (e) {
          return false;
        }
      },
    });
    
    let createdExpenseId = null;
    if (createExpenseResponse.status === 201) {
      try {
        const expense = JSON.parse(createExpenseResponse.body);
        createdExpenseId = expense.id;
        console.log(`💰 Created expense report with ID: ${createdExpenseId}`);
      } catch (e) {
        console.error('❌ Failed to parse created expense ID');
      }
    }
    
    sleep(2);
    
    // Update expense (simulate adding additional details)
    const expenseIdToUpdate = createdExpenseId || Math.floor(Math.random() * 100) + 1;
    const updateData = {
      title: `Updated Business Expense - Employee ${userId}`,
      body: `Updated expense report with additional documentation and receipts. Total: $${Math.floor(Math.random() * 600) + 75}.`,
      userId: userId,
      id: expenseIdToUpdate
    };
    
    const updateExpenseResponse = http.put(
      `${CONFIG.BASE_URL}${CONFIG.ENDPOINTS.POSTS}/${expenseIdToUpdate}`,
      JSON.stringify(updateData),
      {
        headers: CONFIG.HEADERS.DEFAULT,
        timeout: CONFIG.TIMEOUTS.DEFAULT,
        tags: { name: 'update_post' }
      }
    );
    
    check(updateExpenseResponse, {
      '✅ Expense updated successfully': (r) => r.status === 200,
      '✅ Updated expense contains changes': (r) => {
        try {
          const expense = JSON.parse(r.body);
          return expense.title && expense.title.includes('Updated');
        } catch (e) {
          return false;
        }
      },
    });
    
    if (updateExpenseResponse.status === 200) {
      console.log(`📝 Updated expense ID: ${expenseIdToUpdate}`);
    }
    
    sleep(1);
    
    // Get expense comments (simulate approval workflow)
    const commentsResponse = http.get(`${CONFIG.BASE_URL}${CONFIG.ENDPOINTS.COMMENTS}?postId=${expenseIdToUpdate}`, {
      headers: CONFIG.HEADERS.DEFAULT,
      timeout: CONFIG.TIMEOUTS.DEFAULT,
      tags: { name: 'get_comments' }
    });
    
    check(commentsResponse, {
      '✅ Expense comments retrieved': (r) => r.status === 200,
      '✅ Comments data valid': (r) => {
        try {
          const comments = JSON.parse(r.body);
          return Array.isArray(comments);
        } catch (e) {
          return false;
        }
      },
    });
    
    if (commentsResponse.status === 200) {
      try {
        const comments = JSON.parse(commentsResponse.body);
        console.log(`💬 Expense has ${comments.length} comments/approvals`);
      } catch (e) {
        console.error('❌ Failed to parse comments');
      }
    }
    
    sleep(1);
    
    // Delete expense (cleanup - simulate withdrawal)
    const deleteExpenseId = createdExpenseId || Math.floor(Math.random() * 100) + 1;
    const deleteResponse = http.del(`${CONFIG.BASE_URL}${CONFIG.ENDPOINTS.POSTS}/${deleteExpenseId}`, null, {
      headers: CONFIG.HEADERS.DEFAULT,
      timeout: CONFIG.TIMEOUTS.DEFAULT,
      tags: { name: 'delete_post' }
    });
    
    check(deleteResponse, {
      '✅ Expense deleted successfully': (r) => r.status === 200,
    });
    
    if (deleteResponse.status === 200) {
      console.log(`🗑️ Deleted expense ID: ${deleteExpenseId} (withdrawal/cleanup)`);
    }
  });

  sleep(1);
  console.log(`✅ VU${__VU}: Completed expense management workflow for Employee ${userId}`);
}

// Setup function - run once before all VUs
export function setup() {
  console.log('🚀 Starting JSONPlaceholder Expense Management Performance Test');
  console.log(`📡 Target: ${CONFIG.BASE_URL}`);
  console.log('📋 Simulating expense management system:');
  console.log('   • Users → Employees');
  console.log('   • Posts → Expenses');
  console.log('   • Albums → Expense Categories');
  console.log('   • Comments → Expense Notes/Approvals');
  console.log('🎯 Load Pattern: 50 virtual users over 2 minutes');
  
  // Verify API connectivity
  const healthCheck = http.get(`${CONFIG.BASE_URL}/posts/1`, {
    timeout: '10s'
  });
  
  if (healthCheck.status !== 200) {
    throw new Error('❌ JSONPlaceholder API is not accessible - aborting test');
  }
  
  console.log('✅ API connectivity verified - starting performance test');
  return { 
    baseUrl: CONFIG.BASE_URL,
    timestamp: new Date().toISOString() 
  };
}

// Teardown function - run once after all VUs
export function teardown(data) {
  console.log('🏁 Performance test completed');
  console.log(`📊 Test started: ${data.timestamp}`);
  console.log(`📊 Test finished: ${new Date().toISOString()}`);
  const duration = Math.round((new Date() - new Date(data.timestamp)) / 1000);
  console.log(`⏰ Total duration: ${duration} seconds`);
  console.log('📈 Review the metrics above for performance analysis');
}