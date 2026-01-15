# Testing

This directory contains tests for the Mangpong PWA application.

## Running Tests

To run the tests, use the following npm commands:

```bash
# Run all tests
npm test

# Run tests in watch mode (re-runs tests when files change)
npm run test:watch
```

## Test Structure

- `utils.test.js` - Tests for utility functions like date formatting
- `validation.test.js` - Tests for form validation functions
- `setupTests.js` - Jest setup file with mocks for DOM and browser APIs

## Test Coverage

The tests currently cover:

1. Date formatting and parsing functions
2. Form validation logic
3. Error handling scenarios

## Adding New Tests

To add new tests:

1. Create a new test file with the `.test.js` extension
2. Write tests using Jest syntax
3. Run the tests to ensure they pass

## Mocks

The tests use several mocks to simulate browser environments:

- `localStorage` - Mocked using an in-memory object
- `fetch` - Mocked to return predictable responses
- DOM elements - Created programmatically in tests