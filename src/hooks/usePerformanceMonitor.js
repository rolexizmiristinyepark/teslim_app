/**
 * Performance Monitoring Hook
 * React bileşenlerinin performansını izlemek ve optimize etmek için
 */

import { useRef, useEffect, useCallback, useMemo, useState } from 'react';

/**
 * Performance monitoring hook
 * @param {string} componentName - İzlenecek bileşen adı
 * @param {Object} options - Monitoring seçenekleri
 * @returns {Object} Performance metrikleri ve helper fonksiyonları
 */
export const usePerformanceMonitor = (componentName, options = {}) => {
  const {
    enableLogging = process.env.NODE_ENV === 'development',
    trackRenders = true,
    trackProps = true,
    trackHooks = true,
    threshold = 16, // 16ms = 60fps
    sampleSize = 100
  } = options;

  // Performance tracking references
  const renderCountRef = useRef(0);
  const lastRenderTimeRef = useRef(performance.now());
  const renderTimesRef = useRef([]);
  const propsHistoryRef = useRef([]);
  const hooksHistoryRef = useRef([]);
  const mountTimeRef = useRef(null);

  // Performance state
  const [performanceData, setPerformanceData] = useState({
    renderCount: 0,
    averageRenderTime: 0,
    slowRenders: 0,
    lastRenderDuration: 0
  });

  // Initialize mount time
  useEffect(() => {
    if (!mountTimeRef.current) {
      mountTimeRef.current = performance.now();
    }
  }, []);

  // Track render timing
  const trackRender = useCallback(() => {
    if (!trackRenders) return;

    const now = performance.now();
    const renderDuration = now - lastRenderTimeRef.current;
    
    renderCountRef.current += 1;
    lastRenderTimeRef.current = now;
    
    // Store render times (keep only recent samples)
    renderTimesRef.current.push(renderDuration);
    if (renderTimesRef.current.length > sampleSize) {
      renderTimesRef.current.shift();
    }

    // Calculate metrics
    const averageRenderTime = renderTimesRef.current.reduce((a, b) => a + b, 0) / renderTimesRef.current.length;
    const slowRenders = renderTimesRef.current.filter(time => time > threshold).length;

    // Update performance data
    setPerformanceData({
      renderCount: renderCountRef.current,
      averageRenderTime: Math.round(averageRenderTime * 100) / 100,
      slowRenders,
      lastRenderDuration: Math.round(renderDuration * 100) / 100
    });

    // Log performance warning if needed
    if (enableLogging && renderDuration > threshold) {
      console.warn(
        `🐌 Slow render detected in ${componentName}: ${renderDuration.toFixed(2)}ms (threshold: ${threshold}ms)`
      );
    }
  }, [componentName, enableLogging, threshold, trackRenders, sampleSize]);

  // Track component re-renders
  useEffect(() => {
    trackRender();
  });

  // Props change detector
  const trackPropsChange = useCallback((props) => {
    if (!trackProps) return { changed: [], unchanged: [] };

    const prevProps = propsHistoryRef.current[propsHistoryRef.current.length - 1];
    if (!prevProps) {
      propsHistoryRef.current.push(props);
      return { changed: Object.keys(props), unchanged: [] };
    }

    const changed = [];
    const unchanged = [];

    Object.keys(props).forEach(key => {
      if (props[key] !== prevProps[key]) {
        changed.push(key);
      } else {
        unchanged.push(key);
      }
    });

    // Store props history
    propsHistoryRef.current.push(props);
    if (propsHistoryRef.current.length > 10) {
      propsHistoryRef.current.shift();
    }

    if (enableLogging && changed.length > 0) {
      console.log(`📊 Props changed in ${componentName}:`, changed);
    }

    return { changed, unchanged };
  }, [componentName, enableLogging, trackProps]);

  // Hook dependency tracker
  const trackHookDependencies = useCallback((hookName, dependencies) => {
    if (!trackHooks) return false;

    const key = `${componentName}-${hookName}`;
    const prevDeps = hooksHistoryRef.current[key];
    
    if (!prevDeps) {
      hooksHistoryRef.current[key] = dependencies;
      return true; // First run
    }

    const hasChanged = dependencies.some((dep, index) => dep !== prevDeps[index]);
    
    if (hasChanged) {
      hooksHistoryRef.current[key] = dependencies;
      
      if (enableLogging) {
        console.log(`🔄 Hook dependencies changed in ${componentName}.${hookName}`);
      }
    }

    return hasChanged;
  }, [componentName, enableLogging, trackHooks]);

  // Performance report generator
  const generateReport = useCallback(() => {
    const now = performance.now();
    const uptime = mountTimeRef.current ? now - mountTimeRef.current : 0;
    
    return {
      component: componentName,
      uptime: Math.round(uptime),
      renderCount: renderCountRef.current,
      averageRenderTime: performanceData.averageRenderTime,
      slowRenders: performanceData.slowRenders,
      lastRenderDuration: performanceData.lastRenderDuration,
      renderTimes: [...renderTimesRef.current],
      slowRenderRate: renderTimesRef.current.length > 0 
        ? Math.round((performanceData.slowRenders / renderTimesRef.current.length) * 100) 
        : 0,
      propsChangeHistory: propsHistoryRef.current.length,
      performance: {
        excellent: performanceData.averageRenderTime < 8,
        good: performanceData.averageRenderTime < 16,
        poor: performanceData.averageRenderTime >= 16,
        critical: performanceData.averageRenderTime >= 32
      }
    };
  }, [componentName, performanceData]);

  // Performance grade calculator
  const getPerformanceGrade = useMemo(() => {
    const { averageRenderTime, slowRenders } = performanceData;
    const slowRenderRate = renderTimesRef.current.length > 0 
      ? (slowRenders / renderTimesRef.current.length) * 100 
      : 0;

    if (averageRenderTime < 4 && slowRenderRate < 5) return 'A+';
    if (averageRenderTime < 8 && slowRenderRate < 10) return 'A';
    if (averageRenderTime < 12 && slowRenderRate < 15) return 'B';
    if (averageRenderTime < 16 && slowRenderRate < 25) return 'C';
    if (averageRenderTime < 24 && slowRenderRate < 40) return 'D';
    return 'F';
  }, [performanceData]);

  // Optimization suggestions
  const getOptimizationSuggestions = useMemo(() => {
    const suggestions = [];
    const { averageRenderTime, slowRenders, renderCount } = performanceData;

    if (averageRenderTime > 16) {
      suggestions.push('Consider using React.memo() to prevent unnecessary re-renders');
    }

    if (slowRenders > renderCount * 0.2) {
      suggestions.push('High number of slow renders detected. Check for expensive computations');
    }

    if (renderCount > 100 && averageRenderTime > 8) {
      suggestions.push('Component re-renders frequently. Consider useMemo/useCallback optimizations');
    }

    if (renderTimesRef.current.some(time => time > 100)) {
      suggestions.push('Critical performance issue detected. Component blocking UI thread');
    }

    return suggestions;
  }, [performanceData]);

  // Profiler function for measuring specific operations
  const profileOperation = useCallback((operationName, operation) => {
    const start = performance.now();
    const result = operation();
    const duration = performance.now() - start;

    if (enableLogging && duration > 1) {
      console.log(`⏱️ ${componentName}.${operationName}: ${duration.toFixed(2)}ms`);
    }

    return { result, duration };
  }, [componentName, enableLogging]);

  // Memory usage tracker (if available)
  const getMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
      };
    }
    return null;
  }, []);

  // Performance warning checker
  const checkPerformanceWarnings = useCallback(() => {
    const warnings = [];
    const { averageRenderTime, slowRenders, renderCount } = performanceData;

    if (averageRenderTime > 32) {
      warnings.push({
        level: 'critical',
        message: `Average render time (${averageRenderTime}ms) exceeds critical threshold`,
        suggestion: 'Immediate optimization required'
      });
    } else if (averageRenderTime > 16) {
      warnings.push({
        level: 'warning',
        message: `Average render time (${averageRenderTime}ms) affects 60fps target`,
        suggestion: 'Consider performance optimizations'
      });
    }

    if (renderCount > 0 && slowRenders / renderCount > 0.3) {
      warnings.push({
        level: 'warning',
        message: `High slow render rate: ${Math.round((slowRenders / renderCount) * 100)}%`,
        suggestion: 'Optimize render-heavy operations'
      });
    }

    return warnings;
  }, [performanceData]);

  return {
    // Core metrics
    performanceData,
    performanceGrade: getPerformanceGrade,
    
    // Tracking functions
    trackPropsChange,
    trackHookDependencies,
    profileOperation,
    
    // Analysis
    generateReport,
    getOptimizationSuggestions,
    checkPerformanceWarnings,
    getMemoryUsage,
    
    // Quick checks
    isPerformant: performanceData.averageRenderTime < threshold,
    hasSlowRenders: performanceData.slowRenders > 0,
    renderCount: performanceData.renderCount,
    
    // Utilities
    reset: () => {
      renderCountRef.current = 0;
      renderTimesRef.current = [];
      propsHistoryRef.current = [];
      hooksHistoryRef.current = [];
      setPerformanceData({
        renderCount: 0,
        averageRenderTime: 0,
        slowRenders: 0,
        lastRenderDuration: 0
      });
    }
  };
};