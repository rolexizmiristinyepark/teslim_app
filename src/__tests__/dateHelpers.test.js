/**
 * Date Helpers Unit Tests
 * dateHelpers.js dosyasındaki fonksiyonların test edilmesi
 */

import { getCurrentDate } from '../utils/dateHelpers';

describe('dateHelpers', () => {
  describe('getCurrentDate', () => {
    beforeEach(() => {
      // Her test öncesi mock date'i sıfırla
      jest.clearAllMocks();
    });

    test('should return current date in Turkish format (dd.MM.yyyy)', () => {
      // Mock date kullanarak tutarlı test sonucu al
      const mockDate = new Date('2024-01-15T10:00:00.000Z');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

      const result = getCurrentDate();

      expect(result).toBe('15.01.2024');
      expect(typeof result).toBe('string');
    });

    test('should return correct format for different dates', () => {
      // Farklı tarihler için test
      const testCases = [
        { date: '2024-01-01T10:00:00.000Z', expected: '01.01.2024' },
        { date: '2024-12-31T10:00:00.000Z', expected: '31.12.2024' },
        { date: '2024-06-15T10:00:00.000Z', expected: '15.06.2024' },
      ];

      testCases.forEach(({ date, expected }) => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date(date));

        const result = getCurrentDate();
        expect(result).toBe(expected);

        jest.useRealTimers();
      });
    });

    test('should handle edge cases correctly', () => {
      // Leap year test
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-02-29T10:00:00.000Z'));

      const result = getCurrentDate();
      expect(result).toBe('29.02.2024');
      
      jest.useRealTimers();
    });

    test('should return string format', () => {
      const result = getCurrentDate();
      expect(typeof result).toBe('string');
      expect(result).toMatch(/^\d{2}\.\d{2}\.\d{4}$/); // dd.MM.yyyy formatını kontrol et
    });
  });
});
