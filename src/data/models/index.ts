/**
 * Data Transfer Objects (DTOs) for API Testing
 * 
 * These interfaces define the shape of data objects used in API tests.
 * They provide type safety and clear contracts for API requests and responses.
 */

// Base interfaces
export interface BaseEntity {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
}

// User-related DTOs
export interface User extends BaseEntity {
  name: string;
  username?: string;
  email: string;
  phone?: string;
  website?: string;
  address?: Address;
  company?: Company;
}

export interface CreateUserRequest {
  name: string;
  job: string;
  email?: string;
}

export interface UpdateUserRequest {
  name?: string;
  job?: string;
  email?: string;
}

export interface UserResponse extends BaseEntity {
  name: string;
  job: string;
  email?: string;
}

// Address DTO
export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Coordinates;
}

export interface Coordinates {
  lat: string;
  lng: string;
}

// Company DTO
export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

// Post-related DTOs
export interface Post extends BaseEntity {
  title: string;
  body: string;
  userId: number;
}

export interface CreatePostRequest {
  title: string;
  body: string;
  userId: number;
}

export interface UpdatePostRequest {
  title?: string;
  body?: string;
  userId?: number;
}

// Comment DTO
export interface Comment extends BaseEntity {
  name: string;
  email: string;
  body: string;
  postId: number;
}

// Authentication DTOs
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface AuthResponse {
  id?: number;
  token: string;
  error?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  token: string;
}

// Pagination DTOs
export interface PaginationRequest {
  page?: number;
  per_page?: number;
}

export interface PaginatedResponse<T> {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: T[];
  support?: SupportInfo;
}

export interface SupportInfo {
  url: string;
  text: string;
}

// Error DTOs
export interface ApiError {
  error: string;
  message?: string;
  statusCode?: number;
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  error?: ApiError;
  status: number;
  headers: Record<string, string>;
  responseTime: number;
  timing?: {
    responseTime: number;
    timestamp: string;
  };
}

// Test data validation interfaces
export interface ValidationRule {
  field: string;
  rule: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern';
  value?: any;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  actualValue?: any;
  expectedValue?: any;
}

// Configuration DTOs
export interface EnvironmentConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  rateLimitDelay: number;
  authRequired: boolean;
}

export interface TestConfig {
  environment: 'dev' | 'staging' | 'production';
  parallel: boolean;
  retries: number;
  timeout: number;
  skipAuthTests?: boolean;
}

// Performance testing DTOs
export interface PerformanceMetrics {
  testName?: string;
  startTime: number;
  endTime: number;
  duration: number;
  responseTime: number;
  requestsPerSecond?: number;
  errorRate?: number;
  timestamp: string;
  requests: Array<{
    url: string;
    responseTime: number;
    timestamp: string;
    success: boolean;
  }>;
  averageResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
}

export interface PerformanceThreshold {
  maxResponseTime: number;
  maxErrorRate: number;
  minRequestsPerSecond?: number;
}

// Schema validation
export interface SchemaDefinition {
  [key: string]: 'string' | 'number' | 'boolean' | 'object' | 'array' | SchemaDefinition;
}

export interface SchemaValidationResult {
  isValid: boolean;
  errors: string[];
  missingFields: string[];
  typeErrors: string[];
}