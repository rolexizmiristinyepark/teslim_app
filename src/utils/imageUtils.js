/**
 * Image Utilities
 * Görsel yönetimi ve optimizasyon yardımcı fonksiyonları
 */

/**
 * WebP desteği kontrolü
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
 * Görsel öncelik belirleme
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
 * Görsel boyutu belirleme
 * @param {string} src - Görsel kaynağı
 * @returns {Object} Width ve height değerleri
 */
export const getImageDimensions = (src) => {
  // Cufflinks için optimize edilmiş boyutlar
  if (src.includes('/images_cufflinks/')) {
    return {
      width: 300,
      height: 300,
      maxWidth: '300px',
      maxHeight: '300px'
    };
  }
  
  // Marka logoları için boyutlar
  if (src.includes('/images/')) {
    return {
      width: 200,
      height: 100,
      maxWidth: '200px',
      maxHeight: '100px'
    };
  }
  
  // API görselleri için boyutlar
  if (src.includes('media.rolex.com') || src.includes('media.tudorwatch.com')) {
    return {
      width: 400,
      height: 400,
      maxWidth: '400px',
      maxHeight: '400px'
    };
  }
  
  // Varsayılan boyutlar
  return {
    width: 'auto',
    height: 'auto',
    maxWidth: '100%',
    maxHeight: '100%'
  };
};

/**
 * Responsive görsel source'ları oluştur
 * @param {string} src - Ana görsel kaynağı
 * @returns {Object} Farklı boyutlar için source'lar
 */
export const generateResponsiveSources = (src) => {
  if (!src) return {};
  
  const basePath = src.replace(/\.(png|jpg|jpeg)$/i, '');
  const extension = src.match(/\.(png|jpg|jpeg)$/i)?.[0] || '.png';
  
  return {
    small: `${basePath}_small${extension}`,
    medium: `${basePath}_medium${extension}`,
    large: `${basePath}_large${extension}`,
    original: src
  };
};

/**
 * Görsel önbellek kontrolü
 * @param {string} src - Görsel kaynağı
 * @returns {Promise<boolean>} Görsel cache'de var mı
 */
export const isImageCached = (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    const startTime = performance.now();
    
    img.onload = () => {
      const loadTime = performance.now() - startTime;
      // 10ms'den az sürede yüklenirse cache'den gelmiştir
      resolve(loadTime < 10);
    };
    
    img.onerror = () => resolve(false);
    img.src = src;
  });
};

/**
 * Görsel ön yükleme
 * @param {Array<string>} sources - Ön yüklenecek görsel kaynakları
 * @returns {Promise<Array>} Yükleme sonuçları
 */
export const preloadImages = (sources) => {
  return Promise.allSettled(
    sources.map(src => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = () => reject(new Error(`Failed to load: ${src}`));
        img.src = src;
      });
    })
  );
};

/**
 * Görsel dosya boyutu tahmin etme
 * @param {string} src - Görsel kaynağı
 * @returns {Promise<number>} Tahmini dosya boyutu (bytes)
 */
export const estimateImageSize = async (src) => {
  try {
    const response = await fetch(src, { method: 'HEAD' });
    const contentLength = response.headers.get('content-length');
    return contentLength ? parseInt(contentLength, 10) : 0;
  } catch {
    // Hata durumunda ortalama bir değer döndür
    if (src.includes('/images_cufflinks/')) return 150000; // ~150KB
    if (src.includes('/images/')) return 50000; // ~50KB
    return 200000; // ~200KB
  }
};

/**
 * Intersection Observer fabrikası
 * @param {Object} options - Observer seçenekleri
 * @returns {IntersectionObserver} Observer instance
 */
export const createImageObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
};

/**
 * Görsel optimizasyon metrikleri
 * @param {string} originalSrc - Orijinal görsel
 * @param {string} optimizedSrc - Optimize edilmiş görsel
 * @returns {Promise<Object>} Optimizasyon metrikleri
 */
export const getOptimizationMetrics = async (originalSrc, optimizedSrc) => {
  try {
    const [originalSize, optimizedSize] = await Promise.all([
      estimateImageSize(originalSrc),
      estimateImageSize(optimizedSrc)
    ]);
    
    const savings = originalSize - optimizedSize;
    const savingsPercent = originalSize > 0 ? (savings / originalSize * 100) : 0;
    
    return {
      originalSize,
      optimizedSize,
      savings,
      savingsPercent: Math.round(savingsPercent * 100) / 100
    };
  } catch (error) {
    console.error('Error calculating optimization metrics:', error);
    return {
      originalSize: 0,
      optimizedSize: 0,
      savings: 0,
      savingsPercent: 0
    };
  }
};