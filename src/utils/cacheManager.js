/**
 * Advanced Cache Manager for Utility Functions
 * Gelişmiş cache yönetimi ve optimizasyon
 */

/**
 * Cache stratejileri
 */
const CACHE_STRATEGIES = {
  LRU: 'lru', // Least Recently Used
  LFU: 'lfu', // Least Frequently Used
  TTL: 'ttl', // Time To Live
  HYBRID: 'hybrid' // LRU + TTL kombinasyonu
};

/**
 * Cache entry wrapper
 */
class CacheEntry {
  constructor(key, value, strategy = CACHE_STRATEGIES.HYBRID) {
    this.key = key;
    this.value = value;
    this.strategy = strategy;
    this.createdAt = Date.now();
    this.lastAccessedAt = Date.now();
    this.accessCount = 1;
    this.size = this.estimateSize(value);
    this.ttl = this.getDefaultTTL(key);
  }
  
  estimateSize(value) {
    try {
      // Rough estimation of memory usage
      const str = JSON.stringify(value);
      return str.length * 2; // 2 bytes per character (Unicode)
    } catch {
      return 1000; // Default 1KB estimation
    }
  }
  
  getDefaultTTL(key) {
    // Different TTL for different utilities
    const ttlConfig = {
      rmcService: 10 * 60 * 1000, // 10 minutes - RMC verisi değişebilir
      paymentHelpers: 30 * 60 * 1000, // 30 minutes - Helper functions
      advancedImageUtils: 60 * 60 * 1000, // 1 hour - Static utilities
      turkishLanguageUtils: 60 * 60 * 1000, // 1 hour - Language utils
      coreUtils: 2 * 60 * 60 * 1000 // 2 hours - Core utilities
    };
    
    return ttlConfig[key] || 15 * 60 * 1000; // Default 15 minutes
  }
  
  access() {
    this.lastAccessedAt = Date.now();
    this.accessCount++;
  }
  
  isExpired() {
    if (this.strategy === CACHE_STRATEGIES.TTL || this.strategy === CACHE_STRATEGIES.HYBRID) {
      return Date.now() - this.createdAt > this.ttl;
    }
    return false;
  }
  
  getAge() {
    return Date.now() - this.createdAt;
  }
  
  getIdleTime() {
    return Date.now() - this.lastAccessedAt;
  }
}

/**
 * Advanced Cache Manager
 */
class AdvancedCacheManager {
  constructor(options = {}) {
    this.maxSize = options.maxSize || 50 * 1024 * 1024; // 50MB default
    this.maxEntries = options.maxEntries || 100;
    this.strategy = options.strategy || CACHE_STRATEGIES.HYBRID;
    this.cleanupInterval = options.cleanupInterval || 5 * 60 * 1000; // 5 minutes
    
    this.cache = new Map();
    this.totalSize = 0;
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      cleanups: 0,
      totalRequests: 0
    };
    
    this.startPeriodicCleanup();
  }
  
  startPeriodicCleanup() {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);
  }
  
  get(key) {
    this.stats.totalRequests++;
    
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }
    
    // Check if expired
    if (entry.isExpired()) {
      this.cache.delete(key);
      this.totalSize -= entry.size;
      this.stats.misses++;
      return null;
    }
    
    // Update access info
    entry.access();
    this.stats.hits++;
    
    console.log(`✅ Cache hit for: ${key} (age: ${entry.getAge()}ms, access: ${entry.accessCount})`);
    return entry.value;
  }
  
  set(key, value) {
    // Remove existing entry if present
    if (this.cache.has(key)) {
      const existingEntry = this.cache.get(key);
      this.totalSize -= existingEntry.size;
    }
    
    const entry = new CacheEntry(key, value, this.strategy);
    
    // Check if we need to make space
    this.ensureSpace(entry.size);
    
    this.cache.set(key, entry);
    this.totalSize += entry.size;
    
    console.log(`💾 Cached: ${key} (size: ${entry.size} bytes, total: ${this.totalSize} bytes)`);
    
    return true;
  }
  
  ensureSpace(requiredSize) {
    // Check entry count limit
    while (this.cache.size >= this.maxEntries) {
      this.evictLeastValuable();
    }
    
    // Check size limit
    while (this.totalSize + requiredSize > this.maxSize && this.cache.size > 0) {
      this.evictLeastValuable();
    }
  }
  
  evictLeastValuable() {
    if (this.cache.size === 0) return;
    
    let leastValuableKey = null;
    let leastValuableScore = Infinity;
    
    for (const [key, entry] of this.cache.entries()) {
      const score = this.calculateEvictionScore(entry);
      if (score < leastValuableScore) {
        leastValuableScore = score;
        leastValuableKey = key;
      }
    }
    
    if (leastValuableKey) {
      const evictedEntry = this.cache.get(leastValuableKey);
      this.cache.delete(leastValuableKey);
      this.totalSize -= evictedEntry.size;
      this.stats.evictions++;
      
      console.log(`🗑️ Evicted: ${leastValuableKey} (score: ${leastValuableScore})`);
    }
  }
  
  calculateEvictionScore(entry) {
    const ageWeight = 0.3;
    const accessWeight = 0.4;
    const idleWeight = 0.3;
    
    const maxAge = 60 * 60 * 1000; // 1 hour
    const maxIdle = 30 * 60 * 1000; // 30 minutes
    const maxAccess = 100; // Arbitrary max access count
    
    const ageScore = Math.min(entry.getAge() / maxAge, 1);
    const accessScore = 1 - Math.min(entry.accessCount / maxAccess, 1);
    const idleScore = Math.min(entry.getIdleTime() / maxIdle, 1);
    
    return (ageScore * ageWeight) + (accessScore * accessWeight) + (idleScore * idleWeight);
  }
  
  cleanup() {
    let cleanedCount = 0;
    const now = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.isExpired()) {
        this.cache.delete(key);
        this.totalSize -= entry.size;
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      this.stats.cleanups++;
      console.log(`🧹 Cleaned up ${cleanedCount} expired cache entries`);
    }
    
    return cleanedCount;
  }
  
  has(key) {
    const entry = this.cache.get(key);
    return entry && !entry.isExpired();
  }
  
  delete(key) {
    const entry = this.cache.get(key);
    if (entry) {
      this.cache.delete(key);
      this.totalSize -= entry.size;
      console.log(`🗑️ Manually deleted cache entry: ${key}`);
      return true;
    }
    return false;
  }
  
  clear() {
    const clearedCount = this.cache.size;
    this.cache.clear();
    this.totalSize = 0;
    console.log(`🧹 Cleared all cache entries (${clearedCount} entries)`);
  }
  
  getStats() {
    const hitRate = this.stats.totalRequests > 0 
      ? (this.stats.hits / this.stats.totalRequests) * 100 
      : 0;
    
    return {
      ...this.stats,
      hitRate: Math.round(hitRate * 100) / 100,
      totalEntries: this.cache.size,
      totalSize: this.totalSize,
      avgEntrySize: this.cache.size > 0 ? this.totalSize / this.cache.size : 0,
      memoryUsage: (this.totalSize / this.maxSize) * 100
    };
  }
  
  optimize() {
    console.log('🔧 Starting cache optimization...');
    
    const beforeStats = this.getStats();
    
    // Run cleanup
    const cleanedExpired = this.cleanup();
    
    // Evict least valuable entries if memory usage is high
    if (beforeStats.memoryUsage > 80) {
      const targetReduction = Math.floor(this.cache.size * 0.2); // Remove 20%
      for (let i = 0; i < targetReduction; i++) {
        this.evictLeastValuable();
      }
    }
    
    const afterStats = this.getStats();
    
    console.log('✅ Cache optimization complete:', {
      expiredCleaned: cleanedExpired,
      entriesBefore: beforeStats.totalEntries,
      entriesAfter: afterStats.totalEntries,
      memoryBefore: `${beforeStats.memoryUsage.toFixed(1)}%`,
      memoryAfter: `${afterStats.memoryUsage.toFixed(1)}%`
    });
    
    return {
      before: beforeStats,
      after: afterStats,
      improvement: {
        memoryReduced: beforeStats.memoryUsage - afterStats.memoryUsage,
        entriesRemoved: beforeStats.totalEntries - afterStats.totalEntries
      }
    };
  }
  
  destroy() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    this.clear();
  }
}

// Global cache manager instance
let globalCacheManager = null;

/**
 * Cache manager'ı al veya oluştur
 */
export const getCacheManager = (options = {}) => {
  if (!globalCacheManager) {
    globalCacheManager = new AdvancedCacheManager(options);
    console.log('🚀 Advanced cache manager initialized');
    
    // Development mode'da window'a expose et
    if (process.env.NODE_ENV === 'development') {
      window.cacheManager = globalCacheManager;
    }
  }
  
  return globalCacheManager;
};

/**
 * Utility cache wrapper functions
 */
export const cacheUtility = (key, value) => {
  const manager = getCacheManager();
  return manager.set(key, value);
};

export const getCachedUtility = (key) => {
  const manager = getCacheManager();
  return manager.get(key);
};

export const hasCachedUtility = (key) => {
  const manager = getCacheManager();
  return manager.has(key);
};

export const clearCachedUtility = (key) => {
  const manager = getCacheManager();
  return manager.delete(key);
};

export const optimizeCache = () => {
  const manager = getCacheManager();
  return manager.optimize();
};

export const getCacheStats = () => {
  const manager = getCacheManager();
  return manager.getStats();
};

/**
 * Cache decorator for utility functions
 */
export const withCache = (key, utilityFunction, ttl) => {
  return async (...args) => {
    const cacheKey = `${key}_${JSON.stringify(args)}`;
    
    // Try to get from cache first
    const cached = getCachedUtility(cacheKey);
    if (cached !== null) {
      return cached;
    }
    
    // Execute function and cache result
    try {
      const result = await utilityFunction(...args);
      cacheUtility(cacheKey, result);
      return result;
    } catch (error) {
      console.error(`❌ Error in cached utility ${key}:`, error);
      throw error;
    }
  };
};

// Auto-cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (globalCacheManager) {
      globalCacheManager.destroy();
    }
  });
}