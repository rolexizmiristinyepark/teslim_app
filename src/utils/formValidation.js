/**
 * Form Validasyon Yardımcı Fonksiyonları
 * Kullanıcı deneyimini bozmadan arka planda validasyon kontrolü yapar
 */

import { BrandTypes, CategoryTypes } from '../constants/types';

/**
 * Seri numarası validasyonu
 * @param {string} serial - Seri numarası
 * @param {string} selectedBrand - Seçili marka
 * @param {string} selectedCategory - Seçili kategori
 * @returns {boolean} - Geçerli mi?
 */
export const validateSerial = (serial, selectedBrand, selectedCategory) => {
  // Cufflinks (AKSESUAR) için seri numarası zorunlu değil
  if (selectedBrand === BrandTypes.ROLEX && selectedCategory === CategoryTypes.AKSESUAR) {
    return true;
  }

  if (!serial || !serial.trim()) {
    return false;
  }

  const trimmedSerial = serial.trim();
  const hasLetter = /[a-zA-Z]/.test(trimmedSerial);
  const hasNumber = /[0-9]/.test(trimmedSerial);

  // En az 1 harf ve 1 rakam kontrolü
  if (!hasLetter || !hasNumber) {
    return false;
  }

  // Marka bazında karakter sayısı kontrolü
  if (selectedBrand === BrandTypes.ROLEX) {
    // Rolex: 8 karakter
    return trimmedSerial.length >= 8;
  }

  if (selectedBrand === BrandTypes.TUDOR) {
    // Tudor: 7 karakter
    return trimmedSerial.length >= 7;
  }

  return false;
};

/**
 * Genel form validasyonu
 * @param {Object} formData - Form verileri
 * @param {string} selectedBrand - Seçili marka
 * @param {string} selectedCategory - Seçili kategori
 * @param {boolean} isProductChecked - Ürün kontrol onayı
 * @param {Object} rmcAnalysisResult - RMC analiz sonucu
 * @param {Object} rmcMessage - RMC mesajı
 * @returns {boolean} - Form geçerli mi?
 */
export const validateForm = (
  formData,
  selectedBrand,
  selectedCategory,
  isProductChecked,
  rmcAnalysisResult,
  rmcMessage
) => {
  // Zorunlu alanlar kontrolü
  const requiredFields = ['musteri', 'rmc', 'teslimEdilenKisi'];
  const requiredFieldsWithSerial = [...requiredFields];

  // Cufflinks (AKSESUAR) değilse seri numarası da zorunlu
  if (!(selectedBrand === BrandTypes.ROLEX && selectedCategory === CategoryTypes.AKSESUAR)) {
    requiredFieldsWithSerial.push('seri');
  }

  const hasAllRequiredFields = requiredFieldsWithSerial.every(field => {
    return formData[field] && formData[field].trim().length > 0;
  });

  if (!hasAllRequiredFields) {
    return false;
  }

  // RMC geçerlilik kontrolü
  const isRmcValid = formData.rmc &&
                     rmcAnalysisResult &&
                     rmcMessage.type !== 'error';

  if (!isRmcValid) {
    return false;
  }

  // Seri numarası validasyonu
  const isSerialValid = validateSerial(formData.seri, selectedBrand, selectedCategory);
  if (!isSerialValid) {
    return false;
  }

  // Ürün kontrol onayı
  if (!isProductChecked) {
    return false;
  }

  return true;
};

/**
 * Seri numarası için minimum karakter sayısını döndürür
 * @param {string} selectedBrand - Seçili marka
 * @param {string} selectedCategory - Seçili kategori
 * @returns {number} - Minimum karakter sayısı
 */
export const getSerialMinLength = (selectedBrand, selectedCategory) => {
  // Cufflinks (AKSESUAR) için seri numarası gerekli değil
  if (selectedBrand === BrandTypes.ROLEX && selectedCategory === CategoryTypes.AKSESUAR) {
    return 0;
  }

  if (selectedBrand === BrandTypes.ROLEX) {
    return 8;
  }

  if (selectedBrand === BrandTypes.TUDOR) {
    return 7;
  }

  return 0;
};

/**
 * Seri numarası için açıklama metni döndürür
 * @param {string} selectedBrand - Seçili marka
 * @param {string} selectedCategory - Seçili kategori
 * @returns {string} - Açıklama metni
 */
export const getSerialDescription = (selectedBrand, selectedCategory) => {
  // Cufflinks (AKSESUAR) için seri numarası açıklaması gerekli değil
  if (selectedBrand === BrandTypes.ROLEX && selectedCategory === CategoryTypes.AKSESUAR) {
    return 'Cufflinks için seri numarası gerekmez';
  }

  const minLength = getSerialMinLength(selectedBrand, selectedCategory);

  if (minLength === 0) {
    return '';
  }

  return `En az ${minLength} karakter, en az 1 harf ve 1 rakam içermeli`;
};
