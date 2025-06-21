/**
 * Core Image Utilities
 * Temel görsel yönetimi fonksiyonları - her zaman yüklenir
 */

/**
 * WebP desteği kontrolü - temel gereksinm
 * @returns {Promise<boolean>} WebP desteklenip desteklenmediği
 */
export const checkWebPSupport = () => {
  return new Promise((resolve) => {
    const webpData = 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA';
    const img = new Image();
    
    img.onload = () => resolve(img.width === 1);
    img.onerror = () => resolve(false);
    img.src = webpData;
  });
};

/**
 * Görsel öncelik belirleme - her görsel için gerekli
 * @param {string} src - Görsel kaynağı
 * @returns {string} Loading priority (high, low, auto)
 */
export const getImagePriority = (src) => {
  // Logo ve marka görselleri yüksek öncelik
  if (src.includes('/images/')) {
    return 'high';
  }
  
  // Cufflinks görselleri normal öncelik
  if (src.includes('/images_cufflinks/')) {
    return 'auto';
  }
  
  // API'den gelen Rolex/Tudor görselleri düşük öncelik
  if (src.includes('media.rolex.com') || src.includes('media.tudorwatch.com')) {
    return 'low';
  }
  
  return 'auto';
};

/**
 * Görsel boyutu belirleme - her görsel için gerekli
 * @param {string} src - Görsel kaynağı
 * @returns {Object} Width ve height değerleri
 */
export const getImageDimensions = (src) => {
  // Logo görselleri için sabit boyutlar
  if (src.includes('/images/')) {
    return { width: 120, height: 80 };
  }
  
  // Cufflinks görselleri
  if (src.includes('/images_cufflinks/')) {
    return { width: 300, height: 200 };
  }
  
  // API görselleri
  if (src.includes('media.rolex.com') || src.includes('media.tudorwatch.com')) {
    return { width: 400, height: 400 };
  }
  
  return { width: 300, height: 200 };
};

/**
 * Responsive görsel kaynakları oluşturma - temel ihtiyaç
 * @param {string} baseSrc - Temel görsel kaynağı
 * @param {Object} options - Seçenekler
 * @returns {Array} Responsive src set
 */
export const generateResponsiveSources = (baseSrc, options = {}) => {
  const { 
    sizes = [300, 600, 900, 1200], 
    quality = 85,
    format = 'webp'
  } = options;
  
  // Optimize edilmiş görseller için
  if (baseSrc.includes('/optimized/')) {
    return sizes.map(size => ({
      src: baseSrc.replace(/\.(png|jpg|jpeg)$/i, `.${format}`),
      width: size,
      media: `(max-width: ${size}px)`
    }));
  }
  
  // API görselleri için boyut parametreleri
  if (baseSrc.includes('media.rolex.com') || baseSrc.includes('media.tudorwatch.com')) {
    return sizes.map(size => ({
      src: `${baseSrc},w_${size},q_${quality}`,
      width: size,
      media: `(max-width: ${size}px)`
    }));
  }
  
  // Varsayılan - tek boyut
  return [{ src: baseSrc, width: 300 }];
};

/**
 * Görsel cache durumu kontrolü - temel performans
 * @param {string} src - Görsel kaynağı
 * @returns {boolean} Cache'de olup olmadığı
 */
export const isImageCached = (src) => {
  if (typeof window === 'undefined') return false;
  
  const img = new Image();
  img.src = src;
  
  // Eğer görsel zaten cache'deyse complete olur
  return img.complete && img.naturalWidth > 0;
};