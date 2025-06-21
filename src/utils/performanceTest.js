/**
 * Performance Test Utility
 * Utility chunk'ların yükleme performansını test etmek için
 */

/**
 * Utility yükleme performans testi
 */
export const testUtilityPerformance = async () => {
  console.group('🧪 Utility Performance Test Started');
  const results = {};
  
  try {
    // Test 1: RMC Service Loading
    console.log('🔬 Testing RMC Service loading...');
    const rmcStart = performance.now();
    const { loadRmcService } = await import('./lazyUtils');
    const rmcService = await loadRmcService();
    const rmcTime = performance.now() - rmcStart;
    
    results.rmcService = {
      loadTime: rmcTime,
      success: !!rmcService,
      hasFunction: typeof rmcService.findExactRmcMatch === 'function'
    };
    console.log(`✅ RMC Service: ${rmcTime.toFixed(2)}ms`);
    
    // Test 2: Payment Helpers Loading
    console.log('🔬 Testing Payment Helpers loading...');
    const paymentStart = performance.now();
    const { loadPaymentHelpers } = await import('./lazyUtils');
    const paymentHelpers = await loadPaymentHelpers();
    const paymentTime = performance.now() - paymentStart;
    
    results.paymentHelpers = {
      loadTime: paymentTime,
      success: !!paymentHelpers,
      hasFunction: typeof paymentHelpers.generatePaymentDetailsText === 'function'
    };
    console.log(`✅ Payment Helpers: ${paymentTime.toFixed(2)}ms`);
    
    // Test 3: Advanced Image Utils Loading
    console.log('🔬 Testing Advanced Image Utils loading...');
    const imageStart = performance.now();
    const { loadAdvancedImageUtils } = await import('./lazyUtils');
    const imageUtils = await loadAdvancedImageUtils();
    const imageTime = performance.now() - imageStart;
    
    results.advancedImageUtils = {
      loadTime: imageTime,
      success: !!imageUtils,
      hasFunction: typeof imageUtils.preloadImages === 'function'
    };
    console.log(`✅ Advanced Image Utils: ${imageTime.toFixed(2)}ms`);
    
    // Test 4: Turkish Language Utils Loading
    console.log('🔬 Testing Turkish Language Utils loading...');
    const turkishStart = performance.now();
    const { loadTurkishLanguageUtils } = await import('./lazyUtils');
    const turkishUtils = await loadTurkishLanguageUtils();
    const turkishTime = performance.now() - turkishStart;
    
    results.turkishLanguageUtils = {
      loadTime: turkishTime,
      success: !!turkishUtils,
      hasFunction: typeof turkishUtils.addDirectionSuffix === 'function'
    };
    console.log(`✅ Turkish Language Utils: ${turkishTime.toFixed(2)}ms`);
    
    // Test 5: Cache Performance
    console.log('🔬 Testing cache performance...');
    const cacheStart = performance.now();
    const { getCacheManager } = await import('./cacheManager');
    const cacheManager = getCacheManager();
    const cacheTime = performance.now() - cacheStart;
    
    results.cacheManager = {
      loadTime: cacheTime,
      success: !!cacheManager,
      stats: cacheManager.getStats()
    };
    console.log(`✅ Cache Manager: ${cacheTime.toFixed(2)}ms`);
    
    // Test 6: Second Load (Cache Test)
    console.log('🔬 Testing second load (cache efficiency)...');
    const secondLoadStart = performance.now();
    await loadRmcService(); // Should be instant from cache
    await loadPaymentHelpers();
    const secondLoadTime = performance.now() - secondLoadStart;
    
    results.secondLoad = {
      loadTime: secondLoadTime,
      improvement: rmcTime + paymentTime - secondLoadTime
    };
    console.log(`✅ Second Load: ${secondLoadTime.toFixed(2)}ms (${results.secondLoad.improvement.toFixed(2)}ms faster)`);
    
    // Calculate overall stats
    const totalFirstLoad = rmcTime + paymentTime + imageTime + turkishTime;
    const averageLoadTime = totalFirstLoad / 4;
    const fastestLoad = Math.min(rmcTime, paymentTime, imageTime, turkishTime);
    const slowestLoad = Math.max(rmcTime, paymentTime, imageTime, turkishTime);
    
    results.summary = {
      totalFirstLoadTime: totalFirstLoad,
      averageLoadTime,
      fastestLoad,
      slowestLoad,
      cacheImprovement: results.secondLoad.improvement,
      allSuccessful: Object.values(results).slice(0, 4).every(r => r.success),
      performanceGrade: averageLoadTime < 50 ? 'A' : averageLoadTime < 100 ? 'B' : 'C'
    };
    
    console.group('📊 Performance Test Results:');
    console.log('⏱️ Total First Load Time:', `${totalFirstLoad.toFixed(2)}ms`);
    console.log('📈 Average Load Time:', `${averageLoadTime.toFixed(2)}ms`);
    console.log('🏆 Fastest Load:', `${fastestLoad.toFixed(2)}ms`);
    console.log('🐌 Slowest Load:', `${slowestLoad.toFixed(2)}ms`);
    console.log('⚡ Cache Improvement:', `${results.secondLoad.improvement.toFixed(2)}ms`);
    console.log('🎯 Performance Grade:', results.summary.performanceGrade);
    console.log('✅ All Utilities Loaded:', results.summary.allSuccessful);
    console.groupEnd();
    
  } catch (error) {
    console.error('❌ Performance test failed:', error);
    results.error = error.message;
  }
  
  console.groupEnd();
  return results;
};

/**
 * Bundle size estimation test
 */
export const testBundleSizes = () => {
  console.group('📦 Bundle Size Test');
  
  const estimates = {
    rmcService: '~25KB (newRmcService.js)',
    paymentHelpers: '~15KB (paymentHelpers.js)',
    advancedImageUtils: '~8KB (imageUtils/advanced.js)',
    turkishLanguageUtils: '~10KB (stringHelpers/turkish.js)',
    cacheManager: '~5KB (cacheManager.js)',
    lazyUtils: '~3KB (lazyUtils.js)'
  };
  
  let totalEstimated = 0;
  Object.entries(estimates).forEach(([key, size]) => {
    const sizeNum = parseInt(size.match(/(\d+)KB/)[1]);
    totalEstimated += sizeNum;
    console.log(`📦 ${key}: ${size}`);
  });
  
  console.log(`📊 Total Estimated: ~${totalEstimated}KB`);
  console.log(`💾 Potential Main Bundle Reduction: ~${totalEstimated}KB`);
  console.log(`🎯 Expected Performance Gain: ${totalEstimated > 50 ? 'High' : totalEstimated > 25 ? 'Medium' : 'Low'}`);
  
  console.groupEnd();
  return { estimates, totalEstimated };
};

/**
 * Memory usage test
 */
export const testMemoryUsage = async () => {
  console.group('🧠 Memory Usage Test');
  
  const getMemoryInfo = () => {
    if (performance.memory) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
      };
    }
    return null;
  };
  
  const beforeMemory = getMemoryInfo();
  console.log('📊 Memory Before Loading:', beforeMemory);
  
  // Load all utilities
  try {
    await testUtilityPerformance();
    
    const afterMemory = getMemoryInfo();
    console.log('📊 Memory After Loading:', afterMemory);
    
    if (beforeMemory && afterMemory) {
      const memoryIncrease = afterMemory.used - beforeMemory.used;
      console.log(`📈 Memory Increase: ${memoryIncrease}MB`);
      console.log(`📊 Memory Usage: ${((afterMemory.used / afterMemory.limit) * 100).toFixed(1)}%`);
      
      return {
        before: beforeMemory,
        after: afterMemory,
        increase: memoryIncrease,
        usagePercent: (afterMemory.used / afterMemory.limit) * 100
      };
    }
  } catch (error) {
    console.error('❌ Memory test failed:', error);
  }
  
  console.groupEnd();
  return null;
};

/**
 * Complete performance suite
 */
export const runCompletePerformanceTest = async () => {
  console.group('🚀 Complete Performance Test Suite');
  
  const results = {
    startTime: Date.now(),
    performance: null,
    bundleSizes: null,
    memory: null,
    endTime: null,
    duration: null
  };
  
  try {
    results.performance = await testUtilityPerformance();
    results.bundleSizes = testBundleSizes();
    results.memory = await testMemoryUsage();
    
    results.endTime = Date.now();
    results.duration = results.endTime - results.startTime;
    
    console.log(`⏱️ Test Suite Completed in ${results.duration}ms`);
    
    // Generate summary report
    const report = {
      timestamp: new Date().toISOString(),
      ...results,
      summary: {
        avgLoadTime: results.performance?.summary?.averageLoadTime || 0,
        cacheImprovement: results.performance?.secondLoad?.improvement || 0,
        memoryIncrease: results.memory?.increase || 0,
        estimatedSavings: results.bundleSizes?.totalEstimated || 0,
        overallGrade: results.performance?.summary?.performanceGrade || 'Unknown'
      }
    };
    
    console.group('📋 Final Report Summary:');
    console.log('⚡ Avg Load Time:', `${report.summary.avgLoadTime.toFixed(2)}ms`);
    console.log('💾 Cache Improvement:', `${report.summary.cacheImprovement.toFixed(2)}ms`);
    console.log('🧠 Memory Increase:', `${report.summary.memoryIncrease}MB`);
    console.log('📦 Bundle Savings:', `~${report.summary.estimatedSavings}KB`);
    console.log('🎯 Overall Grade:', report.summary.overallGrade);
    console.groupEnd();
    
    return report;
    
  } catch (error) {
    console.error('❌ Performance test suite failed:', error);
    return { error: error.message };
  }
  
  console.groupEnd();
};

// Export test için development modunda window'a ekle
if (process.env.NODE_ENV === 'development') {
  window.performanceTest = {
    testUtilityPerformance,
    testBundleSizes,
    testMemoryUsage,
    runCompletePerformanceTest
  };
}