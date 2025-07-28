// jest.config.js
export default {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  transform: {}, // No Babel needed for pure Node.js ESM
};
