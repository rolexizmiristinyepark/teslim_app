/**
 * String Helpers Unit Tests
 * stringHelpers.js dosyasındaki fonksiyonların kapsamlı test edilmesi
 */

import {
  isValidRmcFormat,
  isCompleteRmc,
  toTurkishUpperCase,
  toTurkishLowerCase,
  generateId,
  addDirectionSuffix,
  fixWordSpacing
} from '../utils/stringHelpers';

describe('stringHelpers', () => {
  describe('isValidRmcFormat', () => {
    test('should return true for non-empty strings', () => {
      expect(isValidRmcFormat('126334')).toBe(true);
      expect(isValidRmcFormat('126334-0001')).toBe(true);
      expect(isValidRmcFormat('A')).toBe(true);
      expect(isValidRmcFormat(' 126334 ')).toBe(true); // whitespace trimmed
    });

    test('should return false for empty or invalid inputs', () => {
      expect(isValidRmcFormat('')).toBe(false);
      expect(isValidRmcFormat('   ')).toBe(false); // only whitespace
      expect(isValidRmcFormat(null)).toBe(false);
      expect(isValidRmcFormat(undefined)).toBe(false);
      expect(isValidRmcFormat(123)).toBe(false); // number instead of string
    });
  });

  describe('isCompleteRmc', () => {
    test('should return true for complete RMC format (XXXXXXXX-XXXX)', () => {
      expect(isCompleteRmc('12633400-0001')).toBe(true); // 8 chars + dash + 4 chars
      expect(isCompleteRmc('ABCD1234-5678')).toBe(true);
      expect(isCompleteRmc('12345678-ABCD')).toBe(true);
      expect(isCompleteRmc(' 12633400-0001 ')).toBe(true); // with whitespace
      expect(isCompleteRmc('abcd1234-5678')).toBe(true); // lowercase (gets uppercased)
    });

    test('should return false for incomplete or invalid RMC format', () => {
      expect(isCompleteRmc('126334')).toBe(false); // missing dash and suffix
      expect(isCompleteRmc('126334-')).toBe(false); // missing suffix
      expect(isCompleteRmc('-0001')).toBe(false); // missing prefix
      expect(isCompleteRmc('1263340001')).toBe(false); // missing dash
      expect(isCompleteRmc('126334-00')).toBe(false); // suffix too short
      expect(isCompleteRmc('126334-00012')).toBe(false); // suffix too long
      expect(isCompleteRmc('1263-0001')).toBe(false); // prefix too short
      expect(isCompleteRmc('126334567-0001')).toBe(false); // prefix too long
      expect(isCompleteRmc('')).toBe(false);
      expect(isCompleteRmc(null)).toBe(false);
      expect(isCompleteRmc(undefined)).toBe(false);
    });
  });

  describe('toTurkishUpperCase', () => {
    test('should convert Turkish characters correctly', () => {
      expect(toTurkishUpperCase('ışık')).toBe('IŞIK');
      expect(toTurkishUpperCase('çalışma')).toBe('ÇALIŞMA');
      expect(toTurkishUpperCase('öğrenci')).toBe('ÖĞRENCİ');
      expect(toTurkishUpperCase('güzel')).toBe('GÜZEL');
      expect(toTurkishUpperCase('şehir')).toBe('ŞEHİR');
    });

    test('should handle edge cases', () => {
      expect(toTurkishUpperCase('')).toBe('');
      expect(toTurkishUpperCase(null)).toBe('');
      expect(toTurkishUpperCase(undefined)).toBe('');
      expect(toTurkishUpperCase('ALREADY UPPER')).toBe('ALREADY UPPER');
    });
  });

  describe('toTurkishLowerCase', () => {
    test('should convert Turkish characters correctly', () => {
      expect(toTurkishLowerCase('IŞIK')).toBe('ışık');
      expect(toTurkishLowerCase('ÇALIŞMA')).toBe('çalışma');
      expect(toTurkishLowerCase('ÖĞRENCİ')).toBe('öğrenci');
      expect(toTurkishLowerCase('GÜZEL')).toBe('güzel');
      expect(toTurkishLowerCase('ŞEHİR')).toBe('şehir');
    });

    test('should handle edge cases', () => {
      expect(toTurkishLowerCase('')).toBe('');
      expect(toTurkishLowerCase(null)).toBe('');
      expect(toTurkishLowerCase(undefined)).toBe('');
      expect(toTurkishLowerCase('already lower')).toBe('already lower');
    });
  });

  describe('generateId', () => {
    test('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(typeof id2).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
      expect(id2.length).toBeGreaterThan(0);
    });

    test('should work with both crypto and fallback methods', () => {
      // Test with crypto API (if available)
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        const cryptoId = generateId();
        expect(cryptoId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
      }

      // Test fallback method by temporarily removing crypto
      const originalCrypto = global.crypto;
      global.crypto = undefined;
      
      const fallbackId = generateId();
      expect(typeof fallbackId).toBe('string');
      expect(fallbackId.length).toBeGreaterThan(10);
      
      global.crypto = originalCrypto;
    });
  });

  describe('addDirectionSuffix', () => {
    test('should add correct suffix for names ending with hard vowels', () => {
      expect(addDirectionSuffix('Fatma')).toBe("Fatma'ya");
      expect(addDirectionSuffix('Oğuz')).toBe("Oğuz'a");
      expect(addDirectionSuffix('Sıdıka')).toBe("Sıdıka'ya");
    });

    test('should add correct suffix for names ending with soft vowels', () => {
      expect(addDirectionSuffix('Ali')).toBe("Ali'ye");
      expect(addDirectionSuffix('Ayşe')).toBe("Ayşe'ye");
      expect(addDirectionSuffix('Züleyha')).toBe("Züleyha'ya");
    });

    test('should add correct suffix for names ending with consonants', () => {
      expect(addDirectionSuffix('Ahmet')).toBe("Ahmet'e");
      expect(addDirectionSuffix('Serdar')).toBe("Serdar'a");
      expect(addDirectionSuffix('Özgür')).toBe("Özgür'e");
      expect(addDirectionSuffix('Cem')).toBe("Cem'e");
    });

    test('should handle special Turkish characters', () => {
      expect(addDirectionSuffix('İsmail')).toBe("İsmail'e");
      expect(addDirectionSuffix('Gülşen')).toBe("Gülşen'e");
      expect(addDirectionSuffix('Çağlar')).toBe("Çağlar'a");
    });

    test('should handle edge cases', () => {
      expect(addDirectionSuffix('')).toBe('');
      expect(addDirectionSuffix('   ')).toBe('');
      expect(addDirectionSuffix(null)).toBe('');
      expect(addDirectionSuffix(undefined)).toBe('');
      expect(addDirectionSuffix('A')).toBe("A'ya");
      expect(addDirectionSuffix('E')).toBe("E'ye");
    });

    test('should handle compound names', () => {
      expect(addDirectionSuffix('Ali Can')).toBe("Ali Can'a");
      expect(addDirectionSuffix('Ayşe Nur')).toBe("Ayşe Nur'a");
      expect(addDirectionSuffix('Mehmet Ali')).toBe("Mehmet Ali'ye");
    });
  });

  describe('fixWordSpacing', () => {
    test('should fix common word spacing issues', () => {
      expect(fixWordSpacing('aitsaatin')).toBe('ait saatin');
      expect(fixWordSpacing('numaralısaatin')).toBe('numaralı saatin');
      expect(fixWordSpacing('numaralıSAAT')).toBe('numaralı SAAT');
      expect(fixWordSpacing('düğmesiın')).toBe('düğmesinin');
      expect(fixWordSpacing('düğmesiin')).toBe('düğmesinin');
    });

    test('should handle uppercase variations', () => {
      expect(fixWordSpacing('AITSAAT')).toBe('AIT SAAT');
      expect(fixWordSpacing('NUMARALISAATIN')).toBe('NUMARALI SAATIN');
      expect(fixWordSpacing('NUMARALIAKSESUAR')).toBe('NUMARALI AKSESUAR');
    });

    test('should fix cufflinks specific issues', () => {
      expect(fixWordSpacing(',aksesuar')).toBe(' aksesuar');
      expect(fixWordSpacing(',aksesuarın')).toBe(' aksesuarın');
      expect(fixWordSpacing('numaralıaksesuar')).toBe('numaralı aksesuar');
    });

    test('should fix financial terms', () => {
      expect(fixWordSpacing('cari hesabına')).toBe('Cari Hesabına');
      expect(fixWordSpacing('CARI HESABıNA')).toBe('CARI HESABıNA');
    });

    test('should handle edge cases', () => {
      expect(fixWordSpacing('')).toBe('');
      expect(fixWordSpacing(null)).toBe('');
      expect(fixWordSpacing(undefined)).toBe('');
      expect(fixWordSpacing('normal text')).toBe('normal text');
    });

    test('should handle error cases gracefully', () => {
      // Test with problematic input that might cause errors
      const result = fixWordSpacing('normal text without issues');
      expect(result).toBe('normal text without issues');
    });
  });
});