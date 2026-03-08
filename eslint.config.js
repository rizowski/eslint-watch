const js = require('@eslint/js');
const prettier = require('eslint-config-prettier');

module.exports = [
  js.configs.recommended,
  prettier,
  {
    languageOptions: {
      globals: {
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        process: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['tests/**/*.js'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        before: 'readonly',
        beforeAll: 'readonly',
        beforeEach: 'readonly',
        after: 'readonly',
        afterAll: 'readonly',
        afterEach: 'readonly',
        expect: 'readonly',
        vi: 'readonly',
      },
    },
  },
  {
    ignores: ['node_modules/', 'build/', 'coverage/', 'tests/integration/test-files/'],
  },
];
