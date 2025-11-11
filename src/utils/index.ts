import { expect } from '@playwright/test';
import { ApiResponse, ValidationResult, PerformanceMetrics } from '../data/models';

/**
 * Utility Functions for API Testing
 * 
 * These utilities provide common functionality for:
 * - Logging and debugging
 * - Data validation
 * - Performance measurement
 * - Retry mechanisms
 * - Response helpers
 */

export class LoggerUtils {
  private static logLevel: 'debug' | 'info' | 'warn' | 'error' = 'info';

  /**
   * Set the logging level
   */
  static setLogLevel(level: 'debug' | 'info' | 'warn' | 'error'): void {
    this.logLevel = level;
  }

  /**
   * Log debug information
   */
  static debug(message: string, data?: any): void {
    if (this.shouldLog('debug')) {
      console.log(`🐛 DEBUG: ${message}`, data ? JSON.stringify(data, null, 2) : '');
    }
  }

  /**
   * Log informational messages
   */
  static info(message: string, data?: any): void {
    if (this.shouldLog('info')) {
      console.log(`ℹ️ INFO: ${message}`, data ? JSON.stringify(data, null, 2) : '');
    }
  }

  /**
   * Log warnings
   */
  static warn(message: string, data?: any): void {
    if (this.shouldLog('warn')) {
      console.warn(`⚠️ WARN: ${message}`, data ? JSON.stringify(data, null, 2) : '');
    }
  }

  /**
   * Log errors
   */
  static error(message: string, error?: any): void {
    if (this.shouldLog('error')) {
      console.error(`❌ ERROR: ${message}`, error);
    }
  }

  /**
   * Log API request details
   */
  static logRequest(method: string, url: string, data?: any): void {
    this.info(`${method.toUpperCase()} Request to ${url}`);
    if (data) {
      this.debug('Request payload:', data);
    }
  }

  /**
   * Log API response details
   */
  static logResponse(response: ApiResponse<any>): void {
    const status = response.status;
    const time = response.responseTime;
    
    if (status >= 200 && status < 300) {
      this.info(`✅ Response: ${status} (${time.toFixed(2)}ms)`);
    } else if (status >= 400) {
      this.error(`❌ Response: ${status} (${time.toFixed(2)}ms)`, response.data);
    } else {
      this.warn(`⚠️ Response: ${status} (${time.toFixed(2)}ms)`);
    }
    
    this.debug('Response data:', response.data);
  }

  private static shouldLog(level: string): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex >= currentLevelIndex;
  }

  /**
   * Create a formatted timestamp
   */
  static timestamp(): string {
    return new Date().toISOString();
  }
}

export class ValidationUtils {
  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format
   */
  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?\d{1,3}-?\d{3}-?\d{3}-?\d{4}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Validate URL format
   */
  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate required fields in an object
   */
  static validateRequiredFields(obj: any, requiredFields: string[]): ValidationResult {
    const missingFields = requiredFields.filter(field => 
      obj[field] === undefined || obj[field] === null || obj[field] === ''
    );

    return {
      isValid: missingFields.length === 0,
      errors: missingFields.map(field => ({
        field,
        message: `Required field '${field}' is missing or empty`
      }))
    };
  }

  /**
   * Validate object against a schema
   */
  static validateSchema(obj: any, schema: any): ValidationResult {
    const errors: Array<{field: string, message: string}> = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = obj[field];
      const fieldRules = rules as any;

      // Required validation
      if (fieldRules.required && (value === undefined || value === null)) {
        errors.push({
          field,
          message: `Field '${field}' is required`
        });
        continue;
      }

      // Skip further validation if field is not required and empty
      if (!fieldRules.required && (value === undefined || value === null)) {
        continue;
      }

      // Type validation
      if (fieldRules.type && typeof value !== fieldRules.type) {
        errors.push({
          field,
          message: `Field '${field}' must be of type '${fieldRules.type}'`
        });
      }

      // Length validation
      if (fieldRules.minLength && value.length < fieldRules.minLength) {
        errors.push({
          field,
          message: `Field '${field}' must be at least ${fieldRules.minLength} characters long`
        });
      }

      if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
        errors.push({
          field,
          message: `Field '${field}' must be no more than ${fieldRules.maxLength} characters long`
        });
      }

      // Pattern validation
      if (fieldRules.pattern && !new RegExp(fieldRules.pattern).test(value)) {
        errors.push({
          field,
          message: `Field '${field}' does not match required pattern`
        });
      }

      // Email validation
      if (fieldRules.email && !this.isValidEmail(value)) {
        errors.push({
          field,
          message: `Field '${field}' must be a valid email address`
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Deep compare two objects for equality
   */
  static deepEqual(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  /**
   * Sanitize sensitive data for logging
   */
  static sanitizeForLogging(data: any): any {
    const sanitized = JSON.parse(JSON.stringify(data));
    const sensitiveKeys = ['password', 'token', 'authorization', 'secret', 'key', 'auth'];
    
    function sanitizeObject(obj: any): any {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitizeObject(obj[key]);
        } else if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
          obj[key] = '***REDACTED***';
        }
      }
      return obj;
    }

    return sanitizeObject(sanitized);
  }
}

export class PerformanceUtils {
  private static performanceData: Map<string, PerformanceMetrics> = new Map();

  /**
   * Start measuring performance for a test
   */
  static startMeasurement(testName: string): void {
    const metrics: PerformanceMetrics = {
      testName,
      startTime: performance.now(),
      endTime: 0,
      duration: 0,
      responseTime: 0,
      timestamp: new Date().toISOString(),
      requests: [],
      averageResponseTime: 0,
      minResponseTime: Infinity,
      maxResponseTime: 0,
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0
    };
    
    this.performanceData.set(testName, metrics);
  }

  /**
   * Record a request performance
   */
  static recordRequest(testName: string, url: string, responseTime: number, success: boolean): void {
    const metrics = this.performanceData.get(testName);
    if (!metrics) return;

    metrics.requests.push({
      url,
      responseTime,
      timestamp: new Date().toISOString(),
      success
    });

    metrics.totalRequests++;
    if (success) {
      metrics.successfulRequests++;
    } else {
      metrics.failedRequests++;
    }

    metrics.minResponseTime = Math.min(metrics.minResponseTime, responseTime);
    metrics.maxResponseTime = Math.max(metrics.maxResponseTime, responseTime);
    metrics.averageResponseTime = metrics.requests.reduce((sum, req) => sum + req.responseTime, 0) / metrics.requests.length;
  }

  /**
   * End measurement and get results
   */
  static endMeasurement(testName: string): PerformanceMetrics | null {
    const metrics = this.performanceData.get(testName);
    if (!metrics) return null;

    metrics.endTime = performance.now();
    metrics.duration = metrics.endTime - metrics.startTime;

    LoggerUtils.info(`Performance Summary for ${testName}:`, {
      duration: `${metrics.duration.toFixed(2)}ms`,
      totalRequests: metrics.totalRequests,
      successRate: `${((metrics.successfulRequests / metrics.totalRequests) * 100).toFixed(2)}%`,
      averageResponseTime: `${metrics.averageResponseTime.toFixed(2)}ms`,
      minResponseTime: `${metrics.minResponseTime.toFixed(2)}ms`,
      maxResponseTime: `${metrics.maxResponseTime.toFixed(2)}ms`
    });

    return metrics;
  }

  /**
   * Get performance data for a test
   */
  static getMetrics(testName: string): PerformanceMetrics | null {
    return this.performanceData.get(testName) || null;
  }

  /**
   * Clear all performance data
   */
  static clearMetrics(): void {
    this.performanceData.clear();
  }

  /**
   * Assert performance thresholds
   */
  static assertPerformance(testName: string, thresholds: {
    maxDuration?: number;
    maxAverageResponseTime?: number;
    minSuccessRate?: number;
  }): void {
    const metrics = this.performanceData.get(testName);
    if (!metrics) {
      throw new Error(`No performance data found for test: ${testName}`);
    }

    if (thresholds.maxDuration && metrics.duration > thresholds.maxDuration) {
      throw new Error(`Test duration ${metrics.duration.toFixed(2)}ms exceeded threshold ${thresholds.maxDuration}ms`);
    }

    if (thresholds.maxAverageResponseTime && metrics.averageResponseTime > thresholds.maxAverageResponseTime) {
      throw new Error(`Average response time ${metrics.averageResponseTime.toFixed(2)}ms exceeded threshold ${thresholds.maxAverageResponseTime}ms`);
    }

    if (thresholds.minSuccessRate) {
      const successRate = (metrics.successfulRequests / metrics.totalRequests) * 100;
      if (successRate < thresholds.minSuccessRate) {
        throw new Error(`Success rate ${successRate.toFixed(2)}% below threshold ${thresholds.minSuccessRate}%`);
      }
    }
  }
}

export class RetryUtils {
  /**
   * Retry a function with exponential backoff
   */
  static async retry<T>(
    fn: () => Promise<T>,
    options: {
      maxAttempts?: number;
      initialDelay?: number;
      maxDelay?: number;
      backoffFactor?: number;
      shouldRetry?: (error: any) => boolean;
    } = {}
  ): Promise<T> {
    const {
      maxAttempts = 3,
      initialDelay = 1000,
      maxDelay = 10000,
      backoffFactor = 2,
      shouldRetry = () => true
    } = options;

    let lastError: any;
    let delay = initialDelay;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        LoggerUtils.debug(`Attempt ${attempt}/${maxAttempts}`);
        return await fn();
      } catch (error) {
        lastError = error;
        LoggerUtils.warn(`Attempt ${attempt} failed:`, error);

        if (attempt === maxAttempts || !shouldRetry(error)) {
          break;
        }

        await this.sleep(delay);
        delay = Math.min(delay * backoffFactor, maxDelay);
      }
    }

    throw lastError;
  }

  /**
   * Sleep for specified milliseconds
   */
  static async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Wait for a condition to be met
   */
  static async waitFor(
    condition: () => Promise<boolean> | boolean,
    options: {
      timeout?: number;
      interval?: number;
      timeoutMessage?: string;
    } = {}
  ): Promise<void> {
    const {
      timeout = 30000,
      interval = 1000,
      timeoutMessage = 'Condition not met within timeout'
    } = options;

    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return;
      }
      await this.sleep(interval);
    }

    throw new Error(timeoutMessage);
  }
}

export class ResponseUtils {
  /**
   * Extract data from API response
   */
  static extractData<T>(response: ApiResponse<T>): T {
    if (response.status >= 400) {
      throw new Error(`API request failed with status ${response.status}: ${JSON.stringify(response.data)}`);
    }
    return response.data!;
  }

  /**
   * Check if response indicates success
   */
  static isSuccessResponse(response: ApiResponse<any>): boolean {
    return response.status >= 200 && response.status < 300;
  }

  /**
   * Assert response status
   */
  static assertStatus(response: ApiResponse<any>, expectedStatus: number): void {
    expect(response.status).toBe(expectedStatus);
  }

  /**
   * Assert response time is within acceptable range
   */
  static assertResponseTime(response: ApiResponse<any>, maxTime: number = 5000): void {
    expect(response.responseTime).toBeLessThan(maxTime);
  }

  /**
   * Assert response contains required fields
   */
  static assertResponseStructure(data: any, requiredFields: string[]): void {
    for (const field of requiredFields) {
      expect(data).toHaveProperty(field);
    }
  }

  /**
   * Assert response data matches schema
   */
  static assertSchema(data: any, schema: any): void {
    const validation = ValidationUtils.validateSchema(data, schema);
    if (!validation.isValid) {
      const errorMessages = validation.errors?.map(error => error.message).join(', ');
      throw new Error(`Schema validation failed: ${errorMessages}`);
    }
  }

  /**
   * Extract pagination info from response
   */
  static extractPaginationInfo(response: any): {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  } {
    return {
      currentPage: response.page || 1,
      totalPages: response.total_pages || response.totalPages || 1,
      totalItems: response.total || response.totalItems || 0,
      itemsPerPage: response.per_page || response.itemsPerPage || 10
    };
  }

  /**
   * Extract error information from response
   */
  static extractError(response: ApiResponse<any>): string {
    if (response.data && response.data.error) {
      return typeof response.data.error === 'string' ? response.data.error : JSON.stringify(response.data.error);
    }
    return `HTTP ${response.status} Error`;
  }
}

export class DataUtils {
  /**
   * Generate random string
   */
  static randomString(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate random number within range
   */
  static randomNumber(min: number = 1, max: number = 1000): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Generate random email
   */
  static randomEmail(domain: string = 'example.com'): string {
    const username = this.randomString(8).toLowerCase();
    return `${username}@${domain}`;
  }

  /**
   * Generate unique ID
   */
  static uniqueId(): string {
    return `${Date.now()}-${this.randomString(6)}`;
  }

  /**
   * Deep clone an object
   */
  static deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Merge objects deeply
   */
  static deepMerge(target: any, source: any): any {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }

  /**
   * Filter object by keys
   */
  static pick(obj: any, keys: string[]): any {
    const result: any = {};
    for (const key of keys) {
      if (key in obj) {
        result[key] = obj[key];
      }
    }
    return result;
  }

  /**
   * Exclude keys from object
   */
  static omit(obj: any, keys: string[]): any {
    const result: any = {};
    for (const key in obj) {
      if (!keys.includes(key)) {
        result[key] = obj[key];
      }
    }
    return result;
  }
}