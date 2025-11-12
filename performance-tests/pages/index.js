/**
 * Page Objects Index File
 * Centralized exports for all page objects
 */

export { BasePage } from './BasePage.js';
export { default as EmployeePage } from './EmployeePage.js';
export { default as ExpensePage } from './ExpensePage.js';
export { default as MedicalExpensePage } from './MedicalExpensePage.js';
export { default as LocationPage } from './LocationPage.js';

// Re-export for convenience
export {
  EmployeePage,
  ExpensePage, 
  MedicalExpensePage,
  LocationPage
};