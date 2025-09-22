// eslint.config.js - ESLint configuration

import globals from 'globals';

export default [
  // Default configuration for all JS files
  {
    files: ['src/**/*.js', 'main.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        Swal: 'readonly',
        jspdf: 'readonly',
      },
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'error',
      'no-undef': 'error',
      'no-duplicate-imports': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'max-lines-per-function': ['warn', { max: 70, skipBlankLines: true, skipComments: true }],
      'max-depth': ['error', 4],
      'max-params': ['error', 4],
      'complexity': ['error', 15],
    },
  },
  // Configuration for Google Apps Script files
  {
    files: ['code.js', 'dist/code.js', 'final_GAS_code.js', 'fixed_GAS_code.js', 'updated_GAS_code.js', 'updated_GAS_code_fixed.js'],
    languageOptions: {
      globals: {
        ContentService: 'readonly',
        HtmlService: 'readonly',
        Logger: 'readonly',
        SpreadsheetApp: 'readonly',
        Utilities: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn', // Downgrade to warning for GAS files
      'no-undef': 'error',
      'complexity': ['warn', 20],
      'max-lines-per-function': ['warn', 150],
    },
  },
  // Configuration for test files
  {
    files: ['tests/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      'no-undef': 'error',
    },
  },
  // Configuration for script and config files
  {
    files: ['scripts/**/*.js', '*.config.js', 'context/**/*.js', '*.cjs'],
    languageOptions: {
      globals: {
        ...globals.node,
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      'no-console': 'off', // Allow console logs in scripts
      'no-unused-vars': 'warn',
    }
  }
];