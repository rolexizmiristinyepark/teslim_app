/**
 * Payment Helpers Unit Tests
 * paymentHelpers.js dosyasındaki ödeme işleme fonksiyonlarının test edilmesi
 */

import {
  generateCariPaymentText,
  generateHavalePaymentText,
  generateKrediKartiPaymentText,
  generateLinkPaymentText,
  generateNakitPaymentText,
  generatePaymentDetailsText,
  calculateTotalAmounts
} from '../utils/paymentHelpers';
import { BrandTypes, CategoryTypes, PaymentTypes } from '../constants/types';
import { createMockFormData, createMockPayment } from '../setupTests';

describe('paymentHelpers', () => {
  describe('generateCariPaymentText', () => {
    test('should generate correct text for Rolex watch', () => {
      const payment = createMockPayment({ type: PaymentTypes.CARI, amount: '50000', currency: 'TL' });
      const formData = createMockFormData({
        musteri: 'Ahmet Yılmaz',
        rmc: '126334-0001',
        seri: 'A1234567',
        size: '41',
        aile: 'Datejust'
      });

      const result = generateCariPaymentText(payment, formData, BrandTypes.ROLEX, CategoryTypes.SAAT);

      expect(result).toContain('Rolex marka');
      expect(result).toContain('126334-0001');
      expect(result).toContain('A1234567 seri numaralı');
      expect(result).toContain('41 çapında');
      expect(result).toContain('Datejust ailesine ait');
      expect(result).toContain('saatnin satışı');
      expect(result).toContain('Ahmet Yılmaz\'a');
      expect(result).toContain('50.000 ₺');
    });

    test('should generate correct text for Tudor watch', () => {
      const payment = createMockPayment({ type: PaymentTypes.CARI, amount: '30000', currency: 'EUR' });
      const formData = createMockFormData({
        musteri: 'Ayşe Demir',
        rmc: 'M79230B-0001'
      });

      const result = generateCariPaymentText(payment, formData, BrandTypes.TUDOR, CategoryTypes.SAAT);

      expect(result).toContain('Tudor marka');
      expect(result).toContain('M79230B-0001');
      expect(result).toContain('saatnin satışı');
      expect(result).toContain('Ayşe Demir\'ye');
      expect(result).toContain('30.000 €');
    });

    test('should generate correct text for Rolex cufflinks (accessories)', () => {
      const payment = createMockPayment({ type: PaymentTypes.CARI, amount: '5000', currency: 'TL' });
      const formData = createMockFormData({
        musteri: 'Mehmet Kaya',
        rmc: 'A1018',
        description: 'A1018 CUFFLINKS CROWN',
        seri: '' // no serial for cufflinks
      });

      const result = generateCariPaymentText(payment, formData, BrandTypes.ROLEX, CategoryTypes.AKSESUAR);

      expect(result).toContain('Rolex marka');
      expect(result).toContain('Cufflinks Crown');
      expect(result).toContain('kol düğmesinin satışı');
      expect(result).toContain('Mehmet Kaya\'ya');
      expect(result).toContain('5.000 ₺');
      expect(result).not.toContain('seri numaralı'); // no serial for cufflinks
    });

    test('should handle Turkish vowel harmony correctly', () => {
      const payment = createMockPayment({ type: PaymentTypes.CARI });
      
      const testCases = [
        { name: 'Ahmet', expected: 'Ahmet\'ye' },
        { name: 'Ali', expected: 'Ali\'ye' },
        { name: 'Fatma', expected: 'Fatma\'ya' },
        { name: 'Ayşe', expected: 'Ayşe\'ye' },
        { name: 'Serdar', expected: 'Serdar\'a' },
        { name: 'Özgür', expected: 'Özgür\'e' },
      ];

      testCases.forEach(({ name, expected }) => {
        const formData = createMockFormData({ musteri: name });
        const result = generateCariPaymentText(payment, formData, BrandTypes.ROLEX, CategoryTypes.SAAT);
        expect(result).toContain(expected);
      });
    });
  });

  describe('generateHavalePaymentText', () => {
    test('should generate correct havale text', () => {
      const payment = createMockPayment({
        type: PaymentTypes.HAVALE,
        date: '15.01.2024',
        amount: '25000',
        currency: 'TL'
      });

      const result = generateHavalePaymentText(payment);

      expect(result).toContain('15.01.2024 tarihinde');
      expect(result).toContain('IBAN:');
      expect(result).toContain('25.000 ₺');
      expect(result).toContain('ödeme yapılmıştır');
    });

    test('should handle different currencies', () => {
      const payment = createMockPayment({
        type: PaymentTypes.HAVALE,
        amount: '1000',
        currency: 'EUR'
      });

      const result = generateHavalePaymentText(payment);
      expect(result).toContain('1.000 €');
    });
  });

  describe('generateKrediKartiPaymentText', () => {
    test('should generate correct credit card text', () => {
      const payment = createMockPayment({
        type: PaymentTypes.KREDI_KARTI,
        date: '15.01.2024',
        amount: '15000',
        currency: 'TL'
      });

      const result = generateKrediKartiPaymentText(payment);

      expect(result).toContain('15.01.2024 tarihinde');
      expect(result).toContain('Kredi Kartı ile');
      expect(result).toContain('15.000 ₺');
      expect(result).toContain('ödeme yapılmıştır');
    });
  });

  describe('generateLinkPaymentText', () => {
    test('should generate correct link payment text', () => {
      const payment = createMockPayment({
        type: PaymentTypes.LINK,
        date: '15.01.2024',
        amount: '20000',
        currency: 'TL'
      });

      const result = generateLinkPaymentText(payment);

      expect(result).toContain('15.01.2024 tarihinde');
      expect(result).toContain('Link ile');
      expect(result).toContain('20.000 ₺');
      expect(result).toContain('ödeme yapılmıştır');
    });
  });

  describe('generateNakitPaymentText', () => {
    test('should generate correct cash payment text', () => {
      const payment = createMockPayment({
        type: PaymentTypes.NAKIT,
        date: '15.01.2024',
        amount: '5000',
        currency: 'TL'
      });

      const result = generateNakitPaymentText(payment);

      expect(result).toContain('15.01.2024 tarihinde');
      expect(result).toContain('nakit olarak');
      expect(result).toContain('5.000 ₺');
      expect(result).toContain('ödeme yapılmıştır');
    });
  });

  describe('generatePaymentDetailsText', () => {
    test('should generate payment details with star prefixes', () => {
      const payments = [
        createMockPayment({ type: PaymentTypes.HAVALE, amount: '10000' }),
        createMockPayment({ type: PaymentTypes.NAKIT, amount: '5000' }),
        createMockPayment({ type: PaymentTypes.CARI, amount: '15000' })
      ];
      const formData = createMockFormData();

      const result = generatePaymentDetailsText(payments, formData, BrandTypes.ROLEX, CategoryTypes.SAAT);

      expect(result).toContain('*'); // first payment
      expect(result).toContain('**'); // second payment  
      expect(result).toContain('***'); // third payment
      expect(result.split('\n\n')).toHaveLength(3); // three separate payments
    });

    test('should handle cari payment without prefix', () => {
      const payments = [
        createMockPayment({ type: PaymentTypes.CARI, amount: '50000' })
      ];
      const formData = createMockFormData({ musteri: 'Test Customer' });

      const result = generatePaymentDetailsText(payments, formData, BrandTypes.ROLEX, CategoryTypes.SAAT);

      expect(result).toContain('* ');
      expect(result).toContain('Test Customer');
      expect(result).not.toContain('Ödeme 1:'); // should not have payment prefix
    });

    test('should handle error gracefully', () => {
      const result = generatePaymentDetailsText(null, null, null, null);
      expect(result).toBe('Bu ödeme için ayrıntılar görüntülenemedi.');
    });
  });

  describe('calculateTotalAmounts', () => {
    test('should calculate totals correctly for single currency', () => {
      const payments = [
        createMockPayment({ amount: '10000', currency: 'TL' }),
        createMockPayment({ amount: '5000', currency: 'TL' }),
        createMockPayment({ amount: '2500', currency: 'TL' })
      ];

      const result = calculateTotalAmounts(payments);

      expect(result.string).toBe('17.500 ₺');
      expect(result.byCurrency.TL).toBe(17500);
    });

    test('should calculate totals correctly for multiple currencies', () => {
      const payments = [
        createMockPayment({ amount: '10000', currency: 'TL' }),
        createMockPayment({ amount: '1000', currency: 'EUR' }),
        createMockPayment({ amount: '500', currency: 'USD' })
      ];

      const result = calculateTotalAmounts(payments);

      expect(result.string).toContain('10.000 ₺');
      expect(result.string).toContain('1.000 €');
      expect(result.string).toContain('500 $');
      expect(result.byCurrency.TL).toBe(10000);
      expect(result.byCurrency.EUR).toBe(1000);
      expect(result.byCurrency.USD).toBe(500);
    });

    test('should handle formatted numbers correctly', () => {
      const payments = [
        createMockPayment({ amount: '10.000', currency: 'TL' }),
        createMockPayment({ amount: '5,500', currency: 'TL' })
      ];

      const result = calculateTotalAmounts(payments);

      expect(result.byCurrency.TL).toBe(15500);
    });

    test('should filter out zero amounts', () => {
      const payments = [
        createMockPayment({ amount: '10000', currency: 'TL' }),
        createMockPayment({ amount: '0', currency: 'EUR' })
      ];

      const result = calculateTotalAmounts(payments);

      expect(result.string).toBe('10.000 ₺');
      expect(result.byCurrency.EUR).toBeUndefined();
    });

    test('should return zero when no payments', () => {
      const result = calculateTotalAmounts([]);
      expect(result.string).toBe('0 ₺');
      expect(Object.keys(result.byCurrency)).toHaveLength(0);
    });
  });
});