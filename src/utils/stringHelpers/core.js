/**
 * Core String Helpers
 * Temel string işlemleri - her zaman yüklenir
 */

/**
 * RMC kodunun temel formatını kontrol eder
 * @param {string} rmc - Kontrol edilecek RMC kodu
 * @returns {boolean} RMC girilmiş ise true, değilse false
 */
export const isValidRmcFormat = (rmc) => {
  if (!rmc || typeof rmc !== 'string') {
    return false;
  }

  // Sadece boş olmadığını kontrol et
  const cleanRmc = rmc.trim();
  return cleanRmc.length > 0;
};

/**
 * RMC kodunun tam girilip girilmediğini kontrol eder
 * @param {string} rmc - Kontrol edilecek RMC kodu
 * @returns {boolean} RMC tam formatında ise true, değilse false
 */
export const isCompleteRmc = (rmc) => {
  if (!rmc || typeof rmc !== 'string') {
    return false;
  }

  const cleanRmc = rmc.trim().toUpperCase();

  // Tam RMC formatı: XXXXXXXX-XXXX (8 karakter + tire + 4 karakter)
  const rmcPattern = /^[A-Z0-9]{8}-[A-Z0-9]{4}$/;
  return rmcPattern.test(cleanRmc);
};

/**
 * Türkçe karakterleri destekleyerek metni büyük harfe çevirir
 * @param {string} text - Büyük harfe çevrilecek metin
 * @returns {string} Türkçe karakterlerle uyumlu büyük harf metni
 */
export const toTurkishUpperCase = (text) => {
  if (!text) return '';
  return text.toLocaleUpperCase('tr-TR');
};

/**
 * Türkçe karakterleri destekleyerek metni küçük harfe çevirir
 * @param {string} text - Küçük harfe çevrilecek metin
 * @returns {string} Türkçe karakterlerle uyumlu küçük harf metni
 */
export const toTurkishLowerCase = (text) => {
  if (!text) return '';
  return text.toLocaleLowerCase('tr-TR');
};

/**
 * Güvenli ve benzersiz ID üretir
 * @returns {string} Benzersiz ID string'i
 */
export const generateId = () => {
  // Modern tarayıcılarda desteklenen crypto.randomUUID() metodunu kontrol et
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback method - timestamp ve random kombinasyonu
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 15);
};