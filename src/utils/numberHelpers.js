/**
 * Sayı formatlama ve işleme yardımcı fonksiyonları
 * Bu dosya, uygulamada kullanılan tüm sayısal işlemleri içerir
 * Türkçe sayı formatını (1.234.567,89) destekler ve güvenli dönüşümler sağlar
 */

/**
 * Bir sayıyı Türkçe formatta (1.234.567,89) formatlar
 * Bu fonksiyon, kullanıcının girdiği sayıları görsel olarak daha okunabilir hale getirir
 * Binlik ayırıcı olarak nokta, ondalık ayırıcı olarak virgül kullanır
 *
 * @param {string|number} value - Formatlanacak sayı (string veya number)
 * @returns {string} Türkçe formatında sayı string'i veya boş string
 *
 * Örnek kullanımlar:
 * formatNumber('1234567.89') → '1.234.567,89'
 * formatNumber('1000') → '1.000'
 * formatNumber('abc') → ''
 */
export const formatNumber = (value) => {
  if (!value) return '';

  try {
    // Girdi değerini string'e çevir ve gereksiz karakterleri temizle
    // Sadece rakam, nokta ve virgüle izin ver
    const cleanedValue = String(value)
      .replace(/[^\d.,]/g, '') // Sadece rakam, nokta ve virgül
      .replace(/\./g, '') // Tüm noktaları kaldır (bunlar binlik ayırıcı olabilir)
      .replace(',', '.'); // Virgülü noktaya çevir (ondalık ayırıcı için)

    const numericValue = parseFloat(cleanedValue);

    // NaN kontrolü - eğer sayıya çevrilemezse boş string döndür
    if (isNaN(numericValue)) return '';

    // Intl.NumberFormat ile Türkçe locale kullanarak formatla
    // Bu sayede binlik ayırıcı ve ondalık ayırıcı otomatik olarak doğru yerleşir
    return new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numericValue);
  } catch (_error) { // eslint-disable-line no-unused-vars
    // Sayı formatlama hatası
    return '';
  }
};

/**
 * Türkçe formatındaki sayıyı normal float değerine çevirir
 * Bu fonksiyon, formatNumber'ın tersi işlemi yapar
 * Kullanıcıdan alınan formatlanmış sayıyı hesaplamalarda kullanılabilir hale getirir
 *
 * @param {string} formattedValue - Türkçe formatında sayı (örn: '1.234.567,89')
 * @returns {string} Normal float formatında sayı string'i veya boş string
 *
 * Örnek kullanımlar:
 * parseFormattedNumber('1.234.567,89') → '1234567.89'
 * parseFormattedNumber('1.000') → '1000'
 * parseFormattedNumber('abc') → ''
 */
export const parseFormattedNumber = (formattedValue) => {
  if (!formattedValue) return '';

  try {
    // Türkçe formatı (1.234,56) → float'a çevir (1234.56)
    const cleanedValue = formattedValue
      .replace(/\./g, '') // Binlik ayırıcı noktaları kaldır
      .replace(',', '.'); // Ondalık virgülü noktaya çevir

    const numericValue = parseFloat(cleanedValue);
    return isNaN(numericValue) ? '' : numericValue.toString();
  } catch (_error) { // eslint-disable-line no-unused-vars
    // Sayı parse hatası
    return '';
  }
};

/**
 * Kullanıcı girdisini temizler - sadece rakamları bırakır
 * Input field'larda kullanıcının sadece rakam girebilmesi için kullanılır
 *
 * @param {string} value - Temizlenecek string
 * @returns {string} Sadece rakamları içeren string
 */
export const cleanNumericValue = (value) => {
  if (!value) return '';
  return value.toString().replace(/[^\d]/g, '');
};
