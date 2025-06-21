/**
 * Advanced Image Utilities
 * Gelişmiş görsel işlemleri - ihtiyaç duyulduğunda lazy load edilir
 */

/**
 * Görsel ön yükleme - opsiyonel performans özelliği
 * @param {Array<string>} sources - Ön yüklenecek görsel kaynakları
 * @returns {Promise<Array>} Yükleme sonuçları
 */
export const preloadImages = (sources) => {
  console.log('🖼️ Preloading images:', sources.length, 'images');
  
  return Promise.allSettled(
    sources.map(src => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          console.log('✅ Preloaded:', src);
          resolve(src);
        };
        img.onerror = () => {
          console.warn('❌ Failed to preload:', src);
          reject(new Error(`Failed to load: ${src}`));
        };
        img.src = src;
      });
    })
  );
};

/**
 * Görsel dosya boyutu tahmin etme - network tabanlı işlem
 * @param {string} src - Görsel kaynağı
 * @returns {Promise<number>} Tahmini dosya boyutu (bytes)
 */
export const estimateImageSize = async (src) => {
  console.log('📏 Estimating image size for:', src);
  
  try {
    const response = await fetch(src, { method: 'HEAD' });
    const contentLength = response.headers.get('content-length');
    const size = contentLength ? parseInt(contentLength, 10) : 0;
    
    console.log('📊 Estimated size:', size, 'bytes');
    return size;
  } catch (error) {
    console.warn('⚠️ Failed to get exact size, using estimation:', error.message);
    
    // Hata durumunda ortalama bir değer döndür
    if (src.includes('/images_cufflinks/')) return 150000; // ~150KB
    if (src.includes('/images/')) return 50000; // ~50KB
    return 200000; // ~200KB
  }
};

/**
 * Intersection Observer fabrikası - gelişmiş lazy loading
 * @param {Function} callback - Observer callback
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
  
  console.log('👁️ Creating image observer with options:', defaultOptions);
  
  return new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        console.log('🎯 Image intersection detected:', entry.target.src || entry.target.dataset.src);
      }
    });
    
    callback(entries, observer);
  }, defaultOptions);
};

/**
 * Görsel optimizasyon metrikleri - analytics ve debugging
 * @param {string} originalSrc - Orijinal görsel
 * @param {string} optimizedSrc - Optimize edilmiş görsel
 * @returns {Promise<Object>} Optimizasyon metrikleri
 */
export const getOptimizationMetrics = async (originalSrc, optimizedSrc) => {
  console.log('📈 Calculating optimization metrics...');
  
  try {
    const [originalSize, optimizedSize] = await Promise.all([
      estimateImageSize(originalSrc),
      estimateImageSize(optimizedSrc)
    ]);
    
    const savings = originalSize - optimizedSize;
    const savingsPercent = originalSize > 0 ? (savings / originalSize * 100) : 0;
    
    const metrics = {
      originalSize,
      optimizedSize,
      savings,
      savingsPercent: Math.round(savingsPercent * 100) / 100,
      compressionRatio: originalSize > 0 ? optimizedSize / originalSize : 1,
      isOptimized: savings > 0
    };
    
    console.log('📊 Optimization metrics:', metrics);
    return metrics;
  } catch (error) {
    console.error('❌ Error calculating optimization metrics:', error);
    return {
      originalSize: 0,
      optimizedSize: 0,
      savings: 0,
      savingsPercent: 0,
      compressionRatio: 1,
      isOptimized: false,
      error: error.message
    };
  }
};

/**
 * Bulk image optimization analysis - büyük veri analizi
 * @param {Array<Object>} imageList - Analiz edilecek görseller
 * @returns {Promise<Object>} Toplu optimizasyon raporu
 */
export const analyzeBulkOptimization = async (imageList) => {
  console.log('🔍 Analyzing bulk optimization for', imageList.length, 'images');
  
  const results = [];
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let processedCount = 0;
  
  for (const image of imageList) {
    try {
      const metrics = await getOptimizationMetrics(image.original, image.optimized);
      results.push({
        ...image,
        metrics
      });
      
      totalOriginalSize += metrics.originalSize;
      totalOptimizedSize += metrics.optimizedSize;
      processedCount++;
      
      // Progress logging
      if (processedCount % 5 === 0) {
        console.log(`📊 Processed ${processedCount}/${imageList.length} images`);
      }
    } catch (error) {
      console.warn('⚠️ Failed to analyze image:', image.original, error);
      results.push({
        ...image,
        metrics: { error: error.message }
      });
    }
  }
  
  const totalSavings = totalOriginalSize - totalOptimizedSize;
  const totalSavingsPercent = totalOriginalSize > 0 ? (totalSavings / totalOriginalSize * 100) : 0;
  
  const summary = {
    totalImages: imageList.length,
    processedImages: processedCount,
    totalOriginalSize,
    totalOptimizedSize,
    totalSavings,
    totalSavingsPercent: Math.round(totalSavingsPercent * 100) / 100,
    averageSavingsPercent: results.reduce((acc, r) => acc + (r.metrics.savingsPercent || 0), 0) / results.length,
    results
  };
  
  console.log('📋 Bulk optimization analysis complete:', summary);
  return summary;
};

/**
 * Image lazy loading performance monitor
 * @param {Element} container - Container element to monitor
 * @returns {Object} Performance monitoring tools
 */
export const createLazyLoadMonitor = (container) => {
  const metrics = {
    totalImages: 0,
    loadedImages: 0,
    failedImages: 0,
    loadTimes: [],
    startTime: performance.now()
  };
  
  const observer = createImageObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const loadStart = performance.now();
        
        metrics.totalImages++;
        
        const originalOnLoad = img.onload;
        const originalOnError = img.onerror;
        
        img.onload = (e) => {
          const loadTime = performance.now() - loadStart;
          metrics.loadedImages++;
          metrics.loadTimes.push(loadTime);
          
          console.log(`⚡ Image loaded in ${loadTime.toFixed(2)}ms:`, img.src);
          
          if (originalOnLoad) originalOnLoad(e);
        };
        
        img.onerror = (e) => {
          metrics.failedImages++;
          console.warn('❌ Image failed to load:', img.src);
          
          if (originalOnError) originalOnError(e);
        };
        
        observer.unobserve(img);
      }
    });
  });
  
  // Monitor all images in container
  const images = container.querySelectorAll('img[data-src], img[loading="lazy"]');
  images.forEach(img => observer.observe(img));
  
  return {
    observer,
    getMetrics: () => ({
      ...metrics,
      averageLoadTime: metrics.loadTimes.length > 0 
        ? metrics.loadTimes.reduce((a, b) => a + b, 0) / metrics.loadTimes.length 
        : 0,
      successRate: metrics.totalImages > 0 
        ? (metrics.loadedImages / metrics.totalImages) * 100 
        : 0,
      totalTime: performance.now() - metrics.startTime
    }),
    destroy: () => observer.disconnect()
  };
};