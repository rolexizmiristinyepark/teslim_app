/**
 * Memoized Payments Hook
 * Ödeme hesaplamaları ve validasyonları için optimize edilmiş hook
 */

import { useMemo, useCallback } from 'react';
import { 
  calculateTotalAmounts,
  generatePaymentDetailsText,
  generateCariPaymentText,
  generateHavalePaymentText,
  generateKrediKartiPaymentText,
  generateNakitPaymentText
} from '../utils/paymentHelpers';
import { formatNumber } from '../utils/numberHelpers';
import { PaymentTypes, CurrencySymbols, PaymentTypeLabels } from '../constants/types';

/**
 * Ödeme verilerini memoize eden ve optimize eden hook
 * @param {Array} payments - Ödeme listesi
 * @param {Object} formData - Form verileri (cari ödeme metni için)
 * @param {string} selectedBrand - Seçili marka
 * @param {string} selectedCategory - Seçili kategori
 * @returns {Object} Memoize edilmiş ödeme hesaplamaları
 */
export const useMemoizedPayments = (payments, formData, selectedBrand, selectedCategory) => {
  // Valid payments calculation - expensive filtering and validation
  const validPayments = useMemo(() => {
    return payments.filter(payment => {
      // Basic validation
      if (!payment.amount || !payment.type || !payment.currency) {
        return false;
      }

      // Amount validation
      const numericAmount = parseFloat(
        payment.amount.toString().replace(/\./g, '').replace(',', '.')
      );
      
      if (isNaN(numericAmount) || numericAmount <= 0) {
        return false;
      }

      // Date validation for certain payment types
      if ([PaymentTypes.HAVALE, PaymentTypes.KREDI_KARTI, PaymentTypes.NAKIT].includes(payment.type)) {
        if (!payment.date || payment.date.trim() === '') {
          return false;
        }
      }

      return true;
    });
  }, [payments]);

  // Payment statistics - memoized computation
  const paymentStats = useMemo(() => {
    const totalCount = payments.length;
    const validCount = validPayments.length;
    const invalidCount = totalCount - validCount;
    
    // Payment type distribution
    const typeDistribution = validPayments.reduce((acc, payment) => {
      const type = payment.type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    // Currency distribution
    const currencyDistribution = validPayments.reduce((acc, payment) => {
      const currency = payment.currency;
      acc[currency] = (acc[currency] || 0) + 1;
      return acc;
    }, {});

    return {
      totalCount,
      validCount,
      invalidCount,
      validationRate: totalCount > 0 ? Math.round((validCount / totalCount) * 100) : 0,
      typeDistribution,
      currencyDistribution
    };
  }, [payments, validPayments]);

  // Total amounts calculation - expensive computation
  const totalAmounts = useMemo(() => {
    return calculateTotalAmounts(validPayments);
  }, [validPayments]);

  // Currency-specific totals - detailed breakdown
  const currencyBreakdown = useMemo(() => {
    const breakdown = {};
    
    Object.entries(totalAmounts.byCurrency).forEach(([currency, amount]) => {
      const paymentsInCurrency = validPayments.filter(p => p.currency === currency);
      const symbol = CurrencySymbols[currency] || currency;
      const formatted = `${amount.toLocaleString('tr-TR')} ${symbol}`;
      
      breakdown[currency] = {
        amount,
        symbol,
        formatted,
        count: paymentsInCurrency.length,
        average: paymentsInCurrency.length > 0 ? amount / paymentsInCurrency.length : 0,
        payments: paymentsInCurrency
      };
    });

    return breakdown;
  }, [validPayments, totalAmounts.byCurrency]);

  // Payment details text generation - expensive string operations
  const paymentDetailsText = useMemo(() => {
    if (validPayments.length === 0) return '';
    
    return generatePaymentDetailsText(
      validPayments,
      formData,
      selectedBrand,
      selectedCategory
    );
  }, [validPayments, formData, selectedBrand, selectedCategory]);

  // Individual payment text generation - memoized per payment
  const paymentTexts = useMemo(() => {
    return validPayments.reduce((acc, payment) => {
      let text = '';
      
      try {
        switch (payment.type) {
          case PaymentTypes.CARI:
            text = generateCariPaymentText(payment, formData, selectedBrand, selectedCategory);
            break;
          case PaymentTypes.HAVALE:
            text = generateHavalePaymentText(payment);
            break;
          case PaymentTypes.KREDI_KARTI:
            text = generateKrediKartiPaymentText(payment);
            break;
          case PaymentTypes.NAKIT:
            text = generateNakitPaymentText(payment);
            break;
          default:
            const label = PaymentTypeLabels[payment.type] || payment.type;
            const amount = formatNumber(payment.amount) || '0';
            const symbol = CurrencySymbols[payment.currency] || payment.currency;
            text = `${label}: ${amount} ${symbol}`;
            if (payment.date) {
              text += ` (${payment.date})`;
            }
            break;
        }
      } catch (error) {
        console.error(`Error generating text for payment ${payment.id}:`, error);
        text = 'Ödeme detayı oluşturulamadı';
      }

      acc[payment.id] = text;
      return acc;
    }, {});
  }, [validPayments, formData, selectedBrand, selectedCategory]);

  // Payment validation results per payment
  const paymentValidations = useMemo(() => {
    return payments.reduce((acc, payment) => {
      const errors = [];
      
      // Amount validation
      if (!payment.amount || payment.amount.trim() === '') {
        errors.push('Tutar boş olamaz');
      } else {
        const numericAmount = parseFloat(
          payment.amount.toString().replace(/\./g, '').replace(',', '.')
        );
        
        if (isNaN(numericAmount)) {
          errors.push('Geçersiz tutar formatı');
        } else if (numericAmount <= 0) {
          errors.push('Tutar sıfırdan büyük olmalı');
        }
      }

      // Date validation for certain types
      if ([PaymentTypes.HAVALE, PaymentTypes.KREDI_KARTI, PaymentTypes.NAKIT].includes(payment.type)) {
        if (!payment.date || payment.date.trim() === '') {
          errors.push('Tarih gerekli');
        }
      }

      // Type validation
      if (!payment.type) {
        errors.push('Ödeme türü seçilmeli');
      }

      // Currency validation
      if (!payment.currency) {
        errors.push('Para birimi seçilmeli');
      }

      acc[payment.id] = {
        isValid: errors.length === 0,
        errors,
        errorCount: errors.length
      };

      return acc;
    }, {});
  }, [payments]);

  // Form completion status for payments
  const paymentFormStatus = useMemo(() => {
    const hasValidPayments = validPayments.length > 0;
    const allPaymentsValid = payments.length > 0 && payments.length === validPayments.length;
    const validationRate = paymentStats.validationRate;

    if (allPaymentsValid && hasValidPayments) {
      return {
        status: 'complete',
        message: 'Tüm ödemeler geçerli',
        color: 'green'
      };
    } else if (hasValidPayments && validationRate >= 70) {
      return {
        status: 'mostly-valid',
        message: 'Çoğu ödeme geçerli',
        color: 'yellow'
      };
    } else if (hasValidPayments) {
      return {
        status: 'partially-valid',
        message: 'Bazı ödemeler geçersiz',
        color: 'orange'
      };
    } else if (payments.length > 0) {
      return {
        status: 'invalid',
        message: 'Geçersiz ödemeler',
        color: 'red'
      };
    } else {
      return {
        status: 'empty',
        message: 'Ödeme eklenmedi',
        color: 'gray'
      };
    }
  }, [validPayments.length, payments.length, paymentStats.validationRate]);

  // Helper functions with stable references
  const getPaymentText = useCallback((paymentId) => {
    return paymentTexts[paymentId] || '';
  }, [paymentTexts]);

  const getPaymentValidation = useCallback((paymentId) => {
    return paymentValidations[paymentId] || { isValid: false, errors: [], errorCount: 0 };
  }, [paymentValidations]);

  const isPaymentValid = useCallback((paymentId) => {
    return paymentValidations[paymentId]?.isValid || false;
  }, [paymentValidations]);

  const getCurrencyTotal = useCallback((currency) => {
    return currencyBreakdown[currency]?.formatted || '0';
  }, [currencyBreakdown]);

  // Performance metrics
  const performanceMetrics = useMemo(() => {
    const computationComplexity = {
      paymentCount: payments.length,
      validationOperations: payments.length * 5, // 5 validations per payment
      textGenerationOperations: validPayments.length,
      currencyCalculations: Object.keys(totalAmounts.byCurrency).length
    };

    return {
      complexity: computationComplexity,
      efficiency: {
        validationRate: paymentStats.validationRate,
        memoizationHits: validPayments.length > 0 ? 'optimal' : 'minimal'
      }
    };
  }, [payments.length, validPayments.length, totalAmounts.byCurrency, paymentStats.validationRate]);

  return {
    // Processed data
    validPayments,
    paymentStats,
    totalAmounts,
    currencyBreakdown,
    paymentDetailsText,
    paymentTexts,
    paymentValidations,
    paymentFormStatus,

    // Helper functions
    getPaymentText,
    getPaymentValidation,
    isPaymentValid,
    getCurrencyTotal,

    // Quick access
    hasValidPayments: validPayments.length > 0,
    isAllValid: paymentStats.validationRate === 100 && payments.length > 0,
    totalString: totalAmounts.string,
    validCount: paymentStats.validCount,
    
    // Performance
    performanceMetrics
  };
};