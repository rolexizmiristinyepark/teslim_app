/**
 * Memoized Validation Hook
 * Form validasyonlarını optimize etmek için memoization kullanır
 */

import { useMemo, useCallback } from 'react';
import { validateForm, validateSerial, getSerialMinLength, getSerialDescription } from '../utils/formValidation';
import { isValidRmcFormat, isCompleteRmc } from '../utils/stringHelpers';

/**
 * Form validasyon durumlarını memoize eden hook
 * @param {Object} formData - Form verileri
 * @param {string} selectedBrand - Seçili marka
 * @param {string} selectedCategory - Seçili kategori
 * @param {boolean} isProductChecked - Ürün kontrol durumu
 * @param {Object} rmcAnalysisResult - RMC analiz sonucu
 * @param {Object} rmcMessage - RMC mesajı
 * @returns {Object} Validasyon durumları ve helper fonksiyonları
 */
export const useMemoizedValidation = (
  formData,
  selectedBrand,
  selectedCategory,
  isProductChecked,
  rmcAnalysisResult,
  rmcMessage
) => {
  // RMC format validation - expensive regex operations
  const rmcValidation = useMemo(() => {
    if (!formData.rmc) {
      return {
        isValid: false,
        isComplete: false,
        isEmpty: true,
        formatValid: false
      };
    }

    const isValid = isValidRmcFormat(formData.rmc);
    const isComplete = isCompleteRmc(formData.rmc);
    const isEmpty = !formData.rmc.trim();
    const formatValid = isValid && rmcMessage.type !== 'error';

    return {
      isValid,
      isComplete,
      isEmpty,
      formatValid
    };
  }, [formData.rmc, rmcMessage.type]);

  // Serial number validation - brand-specific rules
  const serialValidation = useMemo(() => {
    const isValid = validateSerial(formData.seri, selectedBrand, selectedCategory);
    const minLength = getSerialMinLength(selectedBrand, selectedCategory);
    const description = getSerialDescription(selectedBrand, selectedCategory);
    const currentLength = formData.seri ? formData.seri.length : 0;
    const meetsMinLength = minLength === 0 || currentLength >= minLength;

    return {
      isValid,
      minLength,
      description,
      currentLength,
      meetsMinLength,
      isEmpty: !formData.seri || !formData.seri.trim()
    };
  }, [formData.seri, selectedBrand, selectedCategory]);

  // Customer validation
  const customerValidation = useMemo(() => {
    const isEmpty = !formData.musteri || !formData.musteri.trim();
    const isValid = !isEmpty;
    const length = formData.musteri ? formData.musteri.trim().length : 0;

    return {
      isEmpty,
      isValid,
      length,
      tooShort: length > 0 && length < 2
    };
  }, [formData.musteri]);

  // Delivery person validation
  const deliveryPersonValidation = useMemo(() => {
    const isEmpty = !formData.teslimEdilenKisi || !formData.teslimEdilenKisi.trim();
    const isValid = !isEmpty;
    const length = formData.teslimEdilenKisi ? formData.teslimEdilenKisi.trim().length : 0;

    return {
      isEmpty,
      isValid,
      length,
      tooShort: length > 0 && length < 2
    };
  }, [formData.teslimEdilenKisi]);

  // Required fields validation - memoized computation
  const requiredFieldsValidation = useMemo(() => {
    const requiredFields = ['musteri', 'rmc', 'teslimEdilenKisi'];
    
    // Add serial if not cufflinks
    const needsSerial = !(selectedBrand === 'ROLEX' && selectedCategory === 'AKSESUAR');
    if (needsSerial) {
      requiredFields.push('seri');
    }

    const missingFields = requiredFields.filter(field => {
      return !formData[field] || !formData[field].trim();
    });

    const allFieldsFilled = missingFields.length === 0;
    const completionPercent = Math.round(
      ((requiredFields.length - missingFields.length) / requiredFields.length) * 100
    );

    return {
      allFieldsFilled,
      missingFields,
      requiredFields,
      completionPercent,
      needsSerial
    };
  }, [formData.musteri, formData.rmc, formData.teslimEdilenKisi, formData.seri, selectedBrand, selectedCategory]);

  // Overall form validation - heavy computation
  const overallValidation = useMemo(() => {
    const isFormValid = validateForm(
      formData,
      selectedBrand,
      selectedCategory,
      isProductChecked,
      rmcAnalysisResult,
      rmcMessage
    );

    // Calculate validation score
    let score = 0;
    let maxScore = 5; // customer, rmc, delivery, product check, rmc analysis

    if (customerValidation.isValid) score++;
    if (rmcValidation.formatValid && rmcAnalysisResult) score++;
    if (deliveryPersonValidation.isValid) score++;
    if (serialValidation.isValid || !requiredFieldsValidation.needsSerial) score++;
    if (isProductChecked) score++;

    const validationScore = Math.round((score / maxScore) * 100);

    return {
      isFormValid,
      validationScore,
      score,
      maxScore
    };
  }, [
    formData,
    selectedBrand,
    selectedCategory,
    isProductChecked,
    rmcAnalysisResult,
    rmcMessage,
    customerValidation.isValid,
    rmcValidation.formatValid,
    deliveryPersonValidation.isValid,
    serialValidation.isValid,
    requiredFieldsValidation.needsSerial
  ]);

  // Field-specific error messages - memoized
  const errorMessages = useMemo(() => {
    const errors = {};

    // Customer errors
    if (!customerValidation.isEmpty && customerValidation.tooShort) {
      errors.musteri = 'Müşteri adı çok kısa';
    }

    // RMC errors
    if (!rmcValidation.isEmpty && !rmcValidation.isValid) {
      errors.rmc = 'Geçersiz RMC formatı';
    } else if (rmcValidation.isValid && rmcMessage.type === 'error') {
      errors.rmc = rmcMessage.text;
    }

    // Serial errors
    if (!serialValidation.isEmpty && !serialValidation.meetsMinLength) {
      errors.seri = `En az ${serialValidation.minLength} karakter gerekli`;
    } else if (!serialValidation.isEmpty && !serialValidation.isValid) {
      errors.seri = serialValidation.description;
    }

    // Delivery person errors
    if (!deliveryPersonValidation.isEmpty && deliveryPersonValidation.tooShort) {
      errors.teslimEdilenKisi = 'Teslim edilen kişi adı çok kısa';
    }

    return errors;
  }, [
    customerValidation,
    rmcValidation,
    serialValidation,
    deliveryPersonValidation,
    rmcMessage
  ]);

  // Validation helpers - stable references
  const getFieldValidationState = useCallback((fieldName) => {
    switch (fieldName) {
      case 'musteri':
        return customerValidation;
      case 'rmc':
        return rmcValidation;
      case 'seri':
        return serialValidation;
      case 'teslimEdilenKisi':
        return deliveryPersonValidation;
      default:
        return { isValid: true, isEmpty: true };
    }
  }, [customerValidation, rmcValidation, serialValidation, deliveryPersonValidation]);

  const hasError = useCallback((fieldName) => {
    return !!errorMessages[fieldName];
  }, [errorMessages]);

  const getError = useCallback((fieldName) => {
    return errorMessages[fieldName] || null;
  }, [errorMessages]);

  // Form completion status
  const formStatus = useMemo(() => {
    if (overallValidation.isFormValid) {
      return {
        status: 'complete',
        message: 'Form tamamlandı',
        color: 'green'
      };
    } else if (overallValidation.validationScore >= 75) {
      return {
        status: 'almost-complete',
        message: 'Forma yakın',
        color: 'yellow'
      };
    } else if (overallValidation.validationScore >= 50) {
      return {
        status: 'in-progress',
        message: 'Devam ediyor',
        color: 'blue'
      };
    } else {
      return {
        status: 'started',
        message: 'Başlandı',
        color: 'gray'
      };
    }
  }, [overallValidation.isFormValid, overallValidation.validationScore]);

  return {
    // Individual validations
    rmcValidation,
    serialValidation,
    customerValidation,
    deliveryPersonValidation,
    requiredFieldsValidation,
    overallValidation,
    
    // Error handling
    errorMessages,
    hasError,
    getError,
    
    // Helpers
    getFieldValidationState,
    formStatus,
    
    // Quick access
    isValid: overallValidation.isFormValid,
    validationScore: overallValidation.validationScore,
    completionPercent: requiredFieldsValidation.completionPercent
  };
};