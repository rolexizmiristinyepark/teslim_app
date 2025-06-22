/**
 * Lazy Utility Loader
 * Büyük utility fonksiyonları için dynamic import manager
 */

import { getCachedUtility, cacheUtility, hasCachedUtility } from './cacheManager';

// Utility chunk'ları için cache
const utilityCache = new Map();
const loadingPromises = new Map();

/**
 * RMC Service lazy loader - En büyük utility (434 satır)
 * Sadece RMC input'u focus olduğunda yüklenir
 */
export const loadRmcService = async () => {
  const cacheKey = 'rmcService';
  
  // Advanced cache'den kontrol et
  const cachedService = getCachedUtility(cacheKey);
  if (cachedService) {
    console.log('⚡ RMC Service loaded from advanced cache');
    return cachedService;
  }
  
  // Memory cache'den dön
  if (utilityCache.has(cacheKey)) {
    return utilityCache.get(cacheKey);
  }
  
  // Zaten yükleniyorsa, aynı promise'i bekle
  if (loadingPromises.has(cacheKey)) {
    return loadingPromises.get(cacheKey);
  }
  
  console.log('🔄 Loading RMC Service chunk...');
  
  const loadPromise = import('../utils/newRmcService')
    .then(module => {
      const service = module.default || module;
      
      // Her iki cache'e de kaydet
      utilityCache.set(cacheKey, service);
      cacheUtility(cacheKey, service);
      
      loadingPromises.delete(cacheKey);
      console.log('✅ RMC Service chunk loaded and cached successfully');
      return service;
    })
    .catch(error => {
      loadingPromises.delete(cacheKey);
      console.error('❌ Failed to load RMC Service chunk:', error);
      throw error;
    });
    
  loadingPromises.set(cacheKey, loadPromise);
  return loadPromise;
};

/**
 * Payment Helpers lazy loader - İkinci en büyük utility (319 satır)
 * Sadece payment detayları generate edilirken yüklenir
 */
export const loadPaymentHelpers = async () => {
  const cacheKey = 'paymentHelpers';
  
  if (utilityCache.has(cacheKey)) {
    return utilityCache.get(cacheKey);
  }
  
  if (loadingPromises.has(cacheKey)) {
    return loadingPromises.get(cacheKey);
  }
  
  console.log('🔄 Loading Payment Helpers chunk...');
  
  const loadPromise = import('../utils/paymentHelpers')
    .then(module => {
      const helpers = {
        generatePaymentDetailsText: module.generatePaymentDetailsText,
        generateCariPaymentText: module.generateCariPaymentText,
        generateHavalePaymentText: module.generateHavalePaymentText,
        generateKrediKartiPaymentText: module.generateKrediKartiPaymentText,
        calculateTotalAmounts: module.calculateTotalAmounts,
        getTurkishDirectiveSuffix: module.getTurkishDirectiveSuffix
      };
      utilityCache.set(cacheKey, helpers);
      loadingPromises.delete(cacheKey);
      console.log('✅ Payment Helpers chunk loaded successfully');
      return helpers;
    })
    .catch(error => {
      loadingPromises.delete(cacheKey);
      console.error('❌ Failed to load Payment Helpers chunk:', error);
      throw error;
    });
    
  loadingPromises.set(cacheKey, loadPromise);
  return loadPromise;
};


/**
 * Turkish Language Utils lazy loader
 * Sadece Türkçe dil işlemleri gerektiğinde yüklenir
 */
export const loadTurkishLanguageUtils = async () => {
  const cacheKey = 'turkishLanguageUtils';
  
  if (utilityCache.has(cacheKey)) {
    return utilityCache.get(cacheKey);
  }
  
  if (loadingPromises.has(cacheKey)) {
    return loadingPromises.get(cacheKey);
  }
  
  console.log('🔄 Loading Turkish Language Utils chunk...');
  
  const loadPromise = import('../utils/stringHelpers/turkish')
    .then(module => {
      const utils = {
        addDirectionSuffix: module.addDirectionSuffix,
        fixWordSpacing: module.fixWordSpacing,
        toTurkishUpperCase: module.toTurkishUpperCase,
        toTurkishLowerCase: module.toTurkishLowerCase
      };
      utilityCache.set(cacheKey, utils);
      loadingPromises.delete(cacheKey);
      console.log('✅ Turkish Language Utils chunk loaded successfully');
      return utils;
    })
    .catch(error => {
      loadingPromises.delete(cacheKey);
      console.error('❌ Failed to load Turkish Language Utils chunk:', error);
      throw error;
    });
    
  loadingPromises.set(cacheKey, loadPromise);
  return loadPromise;
};

/**
 * Utility preloader - Kullanıcı etkileşimine göre önceden yükleme
 */
export const preloadUtilities = {
  /**
   * RMC input'a focus olurken önceden yükle
   */
  onRmcFocus: () => {
    // Background'da yüklemeyi başlat ama await etme
    loadRmcService().catch(() => {}); // Hataları sessizce yok say
  },
  
  /**
   * Form geçerli olunca payment helpers'ı önceden yükle
   */
  onFormValid: () => {
    loadPaymentHelpers().catch(() => {});
  },
  
  /**
   * Sayfa idle olduğunda gelişmiş utils'leri yükle
   */
  onPageIdle: () => {
    // Sayfa 2 saniye idle kaldıktan sonra yükle
    setTimeout(() => {
      loadTurkishLanguageUtils().catch(() => {});
    }, 2000);
  }
};

/**
 * Cache yönetimi
 */
export const utilityManager = {
  /**
   * Cache istatistikleri
   */
  getCacheStats: () => ({
    cachedUtilities: Array.from(utilityCache.keys()),
    cacheSize: utilityCache.size,
    activeLoading: Array.from(loadingPromises.keys())
  }),
  
  /**
   * Belirli bir utility'yi cache'den temizle
   */
  clearUtility: (utilityName) => {
    utilityCache.delete(utilityName);
    return !utilityCache.has(utilityName);
  },
  
  /**
   * Tüm cache'i temizle
   */
  clearAll: () => {
    utilityCache.clear();
    loadingPromises.clear();
    console.log('🧹 All utility cache cleared');
  },
  
  /**
   * Memory kullanımını optimize et
   */
  optimizeMemory: () => {
    // 10 dakikadan eski cache'leri temizle
    const tenMinutesAgo = Date.now() - (10 * 60 * 1000);
    let cleared = 0;
    
    for (const [key, value] of utilityCache.entries()) {
      if (value._loadTime && value._loadTime < tenMinutesAgo) {
        utilityCache.delete(key);
        cleared++;
      }
    }
    
    console.log(`🗑️ Cleared ${cleared} old utility caches`);
    return cleared;
  }
};

/**
 * Development mode helper
 */
if (process.env.NODE_ENV === 'development') {
  window.utilityManager = utilityManager;
  window.utilityCache = utilityCache;
}