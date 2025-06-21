/**
 * Lazy Utilities Hook
 * Utility fonksiyonlarının lazy loading ile yönetimi
 */

import { useCallback, useEffect, useRef } from 'react';
import { preloadUtilities, utilityManager } from '../utils/lazyUtils';

/**
 * Lazy utilities yönetimi için hook
 * @param {Object} options - Hook seçenekleri
 * @returns {Object} Utility management functions
 */
export const useLazyUtilities = (options = {}) => {
  const {
    preloadOnMount = false,
    preloadOnIdle = true,
    idleTimeout = 2000,
    enableLogging = process.env.NODE_ENV === 'development'
  } = options;

  const idleTimerRef = useRef(null);
  const mountTimeRef = useRef(Date.now());

  // Component mount olduğunda preload
  useEffect(() => {
    if (preloadOnMount) {
      if (enableLogging) {
        console.log('🚀 Preloading utilities on mount...');
      }
      preloadUtilities.onRmcFocus();
      preloadUtilities.onFormValid();
    }
  }, [preloadOnMount, enableLogging]);

  // Idle durumunda preload
  useEffect(() => {
    if (preloadOnIdle) {
      const startIdleTimer = () => {
        if (idleTimerRef.current) {
          clearTimeout(idleTimerRef.current);
        }
        
        idleTimerRef.current = setTimeout(() => {
          if (enableLogging) {
            console.log('😴 Page idle detected - preloading utilities...');
          }
          preloadUtilities.onPageIdle();
        }, idleTimeout);
      };

      // Mouse ve keyboard aktivitesi için listener'lar
      const resetIdleTimer = () => {
        startIdleTimer();
      };

      // Event listener'ları ekle
      document.addEventListener('mousemove', resetIdleTimer);
      document.addEventListener('keypress', resetIdleTimer);
      document.addEventListener('scroll', resetIdleTimer);
      document.addEventListener('click', resetIdleTimer);

      // İlk timer'ı başlat
      startIdleTimer();

      // Cleanup
      return () => {
        if (idleTimerRef.current) {
          clearTimeout(idleTimerRef.current);
        }
        document.removeEventListener('mousemove', resetIdleTimer);
        document.removeEventListener('keypress', resetIdleTimer);
        document.removeEventListener('scroll', resetIdleTimer);
        document.removeEventListener('click', resetIdleTimer);
      };
    }
  }, [preloadOnIdle, idleTimeout, enableLogging]);

  // RMC Service lazy loader
  const loadRmcService = useCallback(async () => {
    try {
      const { loadRmcService } = await import('../utils/lazyUtils');
      return await loadRmcService();
    } catch (error) {
      if (enableLogging) {
        console.error('❌ Failed to load RMC Service:', error);
      }
      throw error;
    }
  }, [enableLogging]);

  // Payment Helpers lazy loader
  const loadPaymentHelpers = useCallback(async () => {
    try {
      const { loadPaymentHelpers } = await import('../utils/lazyUtils');
      return await loadPaymentHelpers();
    } catch (error) {
      if (enableLogging) {
        console.error('❌ Failed to load Payment Helpers:', error);
      }
      throw error;
    }
  }, [enableLogging]);

  // Advanced Image Utils lazy loader
  const loadAdvancedImageUtils = useCallback(async () => {
    try {
      const { loadAdvancedImageUtils } = await import('../utils/lazyUtils');
      return await loadAdvancedImageUtils();
    } catch (error) {
      if (enableLogging) {
        console.error('❌ Failed to load Advanced Image Utils:', error);
      }
      throw error;
    }
  }, [enableLogging]);

  // Turkish Language Utils lazy loader
  const loadTurkishLanguageUtils = useCallback(async () => {
    try {
      const { loadTurkishLanguageUtils } = await import('../utils/lazyUtils');
      return await loadTurkishLanguageUtils();
    } catch (error) {
      if (enableLogging) {
        console.error('❌ Failed to load Turkish Language Utils:', error);
      }
      throw error;
    }
  }, [enableLogging]);

  // Preload trigger'ları
  const triggerPreload = useCallback((context) => {
    if (enableLogging) {
      console.log(`🎯 Triggering preload for context: ${context}`);
    }
    
    switch (context) {
      case 'rmc-focus':
        preloadUtilities.onRmcFocus();
        break;
      case 'form-valid':
        preloadUtilities.onFormValid();
        break;
      case 'page-idle':
        preloadUtilities.onPageIdle();
        break;
      default:
        if (enableLogging) {
          console.warn(`⚠️ Unknown preload context: ${context}`);
        }
    }
  }, [enableLogging]);

  // Cache yönetimi
  const getCacheStats = useCallback(() => {
    return utilityManager.getCacheStats();
  }, []);

  const clearCache = useCallback((utilityName) => {
    if (utilityName) {
      return utilityManager.clearUtility(utilityName);
    } else {
      utilityManager.clearAll();
      return true;
    }
  }, []);

  const optimizeMemory = useCallback(() => {
    return utilityManager.optimizeMemory();
  }, []);

  // Performance tracking
  const getPerformanceStats = useCallback(() => {
    const uptime = Date.now() - mountTimeRef.current;
    const cacheStats = getCacheStats();
    
    return {
      uptime,
      cacheStats,
      memoryOptimized: optimizeMemory() > 0
    };
  }, [getCacheStats, optimizeMemory]);

  return {
    // Lazy loaders
    loadRmcService,
    loadPaymentHelpers,
    loadAdvancedImageUtils,
    loadTurkishLanguageUtils,
    
    // Preload management
    triggerPreload,
    
    // Cache management
    getCacheStats,
    clearCache,
    optimizeMemory,
    
    // Performance
    getPerformanceStats,
    
    // Utilities
    isPreloadOnMount: preloadOnMount,
    isPreloadOnIdle: preloadOnIdle,
    uptime: () => Date.now() - mountTimeRef.current
  };
};