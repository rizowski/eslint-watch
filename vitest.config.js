const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  test: {
    testTimeout: 10000,
    include: ['tests/**/*spec.js'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
  },
});
