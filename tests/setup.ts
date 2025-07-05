import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Jest types are already available from @types/jest

// Set test environment
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error'; // Reduce log noise during tests

// Mock console methods for testing
const originalConsole = { ...console };

beforeAll(() => {
  // Optionally silence console during tests
  if (process.env.SILENT_TESTS === 'true') {
    console.log = jest.fn();
    console.info = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
  }
});

afterAll(() => {
  // Restore console
  Object.assign(console, originalConsole);
});

// Global test timeout
jest.setTimeout(30000);

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise Rejection:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

export {};