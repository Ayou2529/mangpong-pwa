/**
 * @jest-environment jsdom
 */

const {
  formatDate,
  formatThaiDate,
  parseThaiDate,
  formatThaiDateInput,
} = require('./utils');

describe('Utility Functions', () => {
  describe('formatDate', () => {
    test('should format date as YYYY-MM-DD', () => {
      const date = new Date(2024, 0, 1); // January 1, 2024
      expect(formatDate(date)).toBe('2024-01-01');
    });

    test('should pad single digit month and day', () => {
      const date = new Date(2024, 5, 5); // June 5, 2024
      expect(formatDate(date)).toBe('2024-06-05');
    });
  });

  describe('formatThaiDate', () => {
    test('should format date in Thai format', () => {
      const dateString = '2024-01-01T00:00:00.000Z';
      expect(formatThaiDate(dateString)).toBe('1/ม.ค./2567');
    });

    test('should handle different months correctly', () => {
      const dateString = '2024-12-31T00:00:00.000Z';
      expect(formatThaiDate(dateString)).toBe('31/ธ.ค./2567');
    });
  });

  describe('parseThaiDate', () => {
    test('should parse Thai date format correctly', () => {
      const thaiDate = '1/1/2567';
      const parsedDate = parseThaiDate(thaiDate);
      expect(parsedDate.getFullYear()).toBe(2024);
      expect(parsedDate.getMonth()).toBe(0); // January (0-indexed)
      expect(parsedDate.getDate()).toBe(1);
    });

    test('should handle invalid input gracefully', () => {
      const invalidDate = 'invalid';
      const parsedDate = parseThaiDate(invalidDate);
      // Should return current date
      expect(parsedDate).toBeInstanceOf(Date);
    });

    test('should handle empty input gracefully', () => {
      const parsedDate = parseThaiDate('');
      // Should return current date
      expect(parsedDate).toBeInstanceOf(Date);
    });
  });

  describe('formatThaiDateInput', () => {
    test('should format date as DD/MM/YYYY in Thai Buddhist calendar', () => {
      const date = new Date(2024, 0, 1); // January 1, 2024
      expect(formatThaiDateInput(date)).toBe('01/01/2567');
    });

    test('should pad single digit day and month', () => {
      const date = new Date(2024, 5, 5); // June 5, 2024
      expect(formatThaiDateInput(date)).toBe('05/06/2567');
    });
  });
});