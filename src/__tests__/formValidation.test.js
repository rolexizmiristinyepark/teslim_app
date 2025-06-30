/**
 * Form Validation Unit Tests
 * formValidation.js dosyasındaki validasyon fonksiyonlarının test edilmesi
 */

import {
  validateSerial,
  validateForm,
  getSerialMinLength,
  getSerialDescription,
} from '../utils/formValidation';
import { BrandTypes, CategoryTypes } from '../constants/types';
import { createMockFormData, createMockRmcResult } from '../setupTests';

describe('formValidation', () => {
  describe('validateSerial', () => {
    test('should return true for cufflinks (accessories) regardless of serial', () => {
      // Cufflinks için seri numarası zorunlu değil
      expect(validateSerial('', BrandTypes.ROLEX, CategoryTypes.AKSESUAR)).toBe(
        true
      );
      expect(
        validateSerial('123', BrandTypes.ROLEX, CategoryTypes.AKSESUAR)
      ).toBe(true);
      expect(
        validateSerial(null, BrandTypes.ROLEX, CategoryTypes.AKSESUAR)
      ).toBe(true);
    });

    test('should validate Rolex serial numbers correctly', () => {
      // Valid Rolex serials (8+ characters, mix of letters and numbers)
      expect(
        validateSerial('A1234567', BrandTypes.ROLEX, CategoryTypes.SAAT)
      ).toBe(true);
      expect(
        validateSerial('AB123456', BrandTypes.ROLEX, CategoryTypes.SAAT)
      ).toBe(true);
      expect(
        validateSerial('12345ABC', BrandTypes.ROLEX, CategoryTypes.SAAT)
      ).toBe(true);
      expect(
        validateSerial('A1B2C3D4', BrandTypes.ROLEX, CategoryTypes.SAAT)
      ).toBe(true);

      // Invalid Rolex serials
      expect(
        validateSerial('A123456', BrandTypes.ROLEX, CategoryTypes.SAAT)
      ).toBe(false); // too short (7 chars)
      expect(
        validateSerial('12345678', BrandTypes.ROLEX, CategoryTypes.SAAT)
      ).toBe(false); // no letters
      expect(
        validateSerial('ABCDEFGH', BrandTypes.ROLEX, CategoryTypes.SAAT)
      ).toBe(false); // no numbers
      expect(validateSerial('', BrandTypes.ROLEX, CategoryTypes.SAAT)).toBe(
        false
      ); // empty
      expect(validateSerial('   ', BrandTypes.ROLEX, CategoryTypes.SAAT)).toBe(
        false
      ); // whitespace only
    });

    test('should validate Tudor serial numbers correctly', () => {
      // Valid Tudor serials (7+ characters, mix of letters and numbers)
      expect(
        validateSerial('A123456', BrandTypes.TUDOR, CategoryTypes.SAAT)
      ).toBe(true);
      expect(
        validateSerial('AB12345', BrandTypes.TUDOR, CategoryTypes.SAAT)
      ).toBe(true);
      expect(
        validateSerial('1234ABC', BrandTypes.TUDOR, CategoryTypes.SAAT)
      ).toBe(true);
      expect(
        validateSerial('A1B2C3D', BrandTypes.TUDOR, CategoryTypes.SAAT)
      ).toBe(true);

      // Invalid Tudor serials
      expect(
        validateSerial('A12345', BrandTypes.TUDOR, CategoryTypes.SAAT)
      ).toBe(false); // too short (6 chars)
      expect(
        validateSerial('1234567', BrandTypes.TUDOR, CategoryTypes.SAAT)
      ).toBe(false); // no letters
      expect(
        validateSerial('ABCDEFG', BrandTypes.TUDOR, CategoryTypes.SAAT)
      ).toBe(false); // no numbers
      expect(validateSerial('', BrandTypes.TUDOR, CategoryTypes.SAAT)).toBe(
        false
      ); // empty
    });

    test('should handle whitespace correctly', () => {
      expect(
        validateSerial(' A1234567 ', BrandTypes.ROLEX, CategoryTypes.SAAT)
      ).toBe(true);
      expect(
        validateSerial(' A123456 ', BrandTypes.TUDOR, CategoryTypes.SAAT)
      ).toBe(true);
    });
  });

  describe('validateForm', () => {
    const mockRmcResult = createMockRmcResult();
    const mockRmcMessage = { type: 'success', text: 'RMC found' };

    test('should return true for valid form data', () => {
      const formData = createMockFormData({
        musteri: 'Test Customer',
        rmc: '126334-0001',
        seri: 'A1234567',
        teslimEdilenKisi: 'Test Person',
      });

      const result = validateForm(
        formData,
        BrandTypes.ROLEX,
        CategoryTypes.SAAT,
        true, // isProductChecked
        mockRmcResult,
        mockRmcMessage
      );

      expect(result).toBe(true);
    });

    test('should return false when required fields are missing', () => {
      const formData = createMockFormData({ musteri: '' }); // missing customer

      const result = validateForm(
        formData,
        BrandTypes.ROLEX,
        CategoryTypes.SAAT,
        true,
        mockRmcResult,
        mockRmcMessage
      );

      expect(result).toBe(false);
    });

    test('should return false when RMC is invalid', () => {
      const formData = createMockFormData();
      const invalidRmcMessage = { type: 'error', text: 'RMC not found' };

      const result = validateForm(
        formData,
        BrandTypes.ROLEX,
        CategoryTypes.SAAT,
        true,
        null, // no RMC result
        invalidRmcMessage
      );

      expect(result).toBe(false);
    });

    test('should return false when serial is invalid', () => {
      const formData = createMockFormData({ seri: 'INVALID' }); // invalid serial

      const result = validateForm(
        formData,
        BrandTypes.ROLEX,
        CategoryTypes.SAAT,
        true,
        mockRmcResult,
        mockRmcMessage
      );

      expect(result).toBe(false);
    });

    test('should return false when product is not checked', () => {
      const formData = createMockFormData();

      const result = validateForm(
        formData,
        BrandTypes.ROLEX,
        CategoryTypes.SAAT,
        false, // isProductChecked = false
        mockRmcResult,
        mockRmcMessage
      );

      expect(result).toBe(false);
    });

    test('should handle cufflinks (accessories) correctly', () => {
      const formData = createMockFormData({
        seri: '', // no serial for cufflinks
      });

      const result = validateForm(
        formData,
        BrandTypes.ROLEX,
        CategoryTypes.AKSESUAR,
        true,
        mockRmcResult,
        mockRmcMessage
      );

      expect(result).toBe(true);
    });

    test('should validate all required fields for watches', () => {
      const requiredFields = ['musteri', 'rmc', 'seri', 'teslimEdilenKisi'];

      requiredFields.forEach((field) => {
        const formData = createMockFormData({ [field]: '' });

        const result = validateForm(
          formData,
          BrandTypes.ROLEX,
          CategoryTypes.SAAT,
          true,
          mockRmcResult,
          mockRmcMessage
        );

        expect(result).toBe(false);
      });
    });
  });

  describe('getSerialMinLength', () => {
    test('should return correct minimum lengths for each brand', () => {
      expect(getSerialMinLength(BrandTypes.ROLEX, CategoryTypes.SAAT)).toBe(8);
      expect(getSerialMinLength(BrandTypes.TUDOR, CategoryTypes.SAAT)).toBe(7);
      expect(getSerialMinLength(BrandTypes.ROLEX, CategoryTypes.AKSESUAR)).toBe(
        0
      ); // cufflinks
    });

    test('should return 0 for unknown brands', () => {
      expect(getSerialMinLength('UNKNOWN_BRAND', CategoryTypes.SAAT)).toBe(0);
    });
  });

  describe('getSerialDescription', () => {
    test('should return correct descriptions for each brand', () => {
      expect(getSerialDescription(BrandTypes.ROLEX, CategoryTypes.SAAT)).toBe(
        'En az 8 karakter, en az 1 harf ve 1 rakam içermeli'
      );

      expect(getSerialDescription(BrandTypes.TUDOR, CategoryTypes.SAAT)).toBe(
        'En az 7 karakter, en az 1 harf ve 1 rakam içermeli'
      );

      expect(
        getSerialDescription(BrandTypes.ROLEX, CategoryTypes.AKSESUAR)
      ).toBe('Cufflinks için seri numarası gerekmez');
    });

    test('should return empty string for unknown brands', () => {
      expect(getSerialDescription('UNKNOWN_BRAND', CategoryTypes.SAAT)).toBe(
        ''
      );
    });
  });
});
