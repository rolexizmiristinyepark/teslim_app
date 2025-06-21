/**
 * Bundle Analyzer Utility
 * Chunk yükleme performansını analiz etmek için
 */

/**
 * Chunk loading performance monitor
 */
class ChunkLoadingMonitor {
  constructor() {
    this.loadedChunks = new Map();
    this.loadingTimes = new Map();
    this.failedChunks = new Set();
    this.startTime = performance.now();
    
    // Webpack chunk loading event'lerini dinle
    this.setupWebpackListeners();
  }
  
  setupWebpackListeners() {
    // Webpack'in __webpack_require__ global'ini dinle
    if (typeof window !== 'undefined' && window.__webpack_require__) {
      const originalRequire = window.__webpack_require__;
      
      window.__webpack_require__ = (chunkId) => {
        const loadStart = performance.now();
        
        try {
          const result = originalRequire(chunkId);
          const loadTime = performance.now() - loadStart;
          
          this.recordChunkLoad(chunkId, loadTime, true);
          return result;
        } catch (error) {
          this.recordChunkLoad(chunkId, 0, false);
          throw error;
        }
      };
    }
  }
  
  recordChunkLoad(chunkId, loadTime, success) {
    const timestamp = performance.now();
    
    if (success) {
      this.loadedChunks.set(chunkId, {
        loadTime,
        timestamp,
        size: this.estimateChunkSize(chunkId)
      });
      this.loadingTimes.set(chunkId, loadTime);
      
      console.log(`📦 Chunk loaded: ${chunkId} in ${loadTime.toFixed(2)}ms`);
    } else {
      this.failedChunks.add(chunkId);
      console.error(`❌ Chunk failed to load: ${chunkId}`);
    }
  }
  
  estimateChunkSize(chunkId) {
    // Chunk boyutunu tahmin et (gerçek uygulamada webpack stats'tan alınabilir)
    const sizeEstimates = {
      'rmc-service': 25000, // ~25KB
      'payment-helpers': 15000, // ~15KB
      'advanced-image-utils': 8000, // ~8KB
      'turkish-language-utils': 10000, // ~10KB
      'core-utils': 5000, // ~5KB
      'lazy-utils-manager': 3000 // ~3KB
    };
    
    return sizeEstimates[chunkId] || 5000; // Default 5KB
  }
  
  getAnalytics() {
    const totalUptime = performance.now() - this.startTime;
    const loadedChunksList = Array.from(this.loadedChunks.entries());
    const loadingTimesList = Array.from(this.loadingTimes.values());
    
    return {
      totalUptime: Math.round(totalUptime),
      totalChunksLoaded: this.loadedChunks.size,
      totalChunksFailed: this.failedChunks.size,
      averageLoadTime: loadingTimesList.length > 0 
        ? loadingTimesList.reduce((a, b) => a + b, 0) / loadingTimesList.length 
        : 0,
      fastestLoad: loadingTimesList.length > 0 ? Math.min(...loadingTimesList) : 0,
      slowestLoad: loadingTimesList.length > 0 ? Math.max(...loadingTimesList) : 0,
      totalEstimatedSize: loadedChunksList.reduce((total, [_, data]) => total + data.size, 0),
      chunks: Object.fromEntries(loadedChunksList),
      failedChunks: Array.from(this.failedChunks),
      performance: this.calculatePerformanceGrade(loadingTimesList)
    };
  }
  
  calculatePerformanceGrade(loadingTimes) {
    if (loadingTimes.length === 0) return 'N/A';
    
    const averageTime = loadingTimes.reduce((a, b) => a + b, 0) / loadingTimes.length;
    const slowChunks = loadingTimes.filter(time => time > 100).length;
    const slowChunkRate = slowChunks / loadingTimes.length;
    
    if (averageTime < 10 && slowChunkRate < 0.1) return 'A+';
    if (averageTime < 25 && slowChunkRate < 0.2) return 'A';
    if (averageTime < 50 && slowChunkRate < 0.3) return 'B';
    if (averageTime < 100 && slowChunkRate < 0.5) return 'C';
    if (averageTime < 200 && slowChunkRate < 0.7) return 'D';
    return 'F';
  }
  
  generateReport() {
    const analytics = this.getAnalytics();
    
    console.group('📊 Bundle Loading Performance Report');
    console.log('🕐 Total Uptime:', `${analytics.totalUptime}ms`);
    console.log('📦 Chunks Loaded:', analytics.totalChunksLoaded);
    console.log('❌ Chunks Failed:', analytics.totalChunksFailed);
    console.log('⚡ Average Load Time:', `${analytics.averageLoadTime.toFixed(2)}ms`);
    console.log('🏆 Fastest Load:', `${analytics.fastestLoad.toFixed(2)}ms`);
    console.log('🐌 Slowest Load:', `${analytics.slowestLoad.toFixed(2)}ms`);
    console.log('💾 Total Size Loaded:', `${(analytics.totalEstimatedSize / 1024).toFixed(1)}KB`);
    console.log('🎯 Performance Grade:', analytics.performance);
    
    if (Object.keys(analytics.chunks).length > 0) {
      console.group('📦 Individual Chunks:');
      Object.entries(analytics.chunks).forEach(([chunkId, data]) => {
        console.log(`  ${chunkId}: ${data.loadTime.toFixed(2)}ms (${(data.size / 1024).toFixed(1)}KB)`);
      });
      console.groupEnd();
    }
    
    if (analytics.failedChunks.length > 0) {
      console.group('❌ Failed Chunks:');
      analytics.failedChunks.forEach(chunkId => {
        console.error(`  ${chunkId}`);
      });
      console.groupEnd();
    }
    
    console.groupEnd();
    
    return analytics;
  }
  
  exportReport() {
    const analytics = this.getAnalytics();
    const report = {
      timestamp: new Date().toISOString(),
      ...analytics
    };
    
    // JSON olarak export et
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bundle-performance-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    console.log('📁 Performance report exported');
    return report;
  }
}

// Global monitor instance
let globalMonitor = null;

/**
 * Bundle analyzer'ı başlat
 */
export const startBundleAnalyzer = () => {
  if (!globalMonitor) {
    globalMonitor = new ChunkLoadingMonitor();
    console.log('🔍 Bundle analyzer started');
    
    // Development mode'da window'a expose et
    if (process.env.NODE_ENV === 'development') {
      window.bundleAnalyzer = globalMonitor;
    }
  }
  
  return globalMonitor;
};

/**
 * Performans raporu al
 */
export const getBundleAnalytics = () => {
  if (!globalMonitor) {
    console.warn('⚠️ Bundle analyzer not started. Call startBundleAnalyzer() first.');
    return null;
  }
  
  return globalMonitor.getAnalytics();
};

/**
 * Performans raporu oluştur ve logla
 */
export const generateBundleReport = () => {
  if (!globalMonitor) {
    console.warn('⚠️ Bundle analyzer not started. Call startBundleAnalyzer() first.');
    return null;
  }
  
  return globalMonitor.generateReport();
};

/**
 * Performans raporunu export et
 */
export const exportBundleReport = () => {
  if (!globalMonitor) {
    console.warn('⚠️ Bundle analyzer not started. Call startBundleAnalyzer() first.');
    return null;
  }
  
  return globalMonitor.exportReport();
};

/**
 * Bundle loading event'leri için custom hook
 */
export const useBundleAnalyzer = () => {
  const monitor = globalMonitor || startBundleAnalyzer();
  
  return {
    getAnalytics: () => monitor.getAnalytics(),
    generateReport: () => monitor.generateReport(),
    exportReport: () => monitor.exportReport()
  };
};

// Auto-start in development
if (process.env.NODE_ENV === 'development') {
  startBundleAnalyzer();
}