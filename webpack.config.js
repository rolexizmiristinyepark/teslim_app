/**
 * Webpack Bundle Optimization Configuration
 * Utility chunk'ları için optimize edilmiş bundling stratejisi
 */

const path = require('path');

module.exports = {
  // Bundle splitting optimization
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // RMC Service chunk - En büyük utility
        rmcService: {
          test: /[\\/]utils[\\/]newRmcService\.js/,
          name: 'rmc-service',
          priority: 30,
          chunks: 'all',
          enforce: true
        },
        
        // Payment Helpers chunk - İkinci en büyük utility
        paymentHelpers: {
          test: /[\\/]utils[\\/]paymentHelpers\.js/,
          name: 'payment-helpers',
          priority: 25,
          chunks: 'all',
          enforce: true
        },
        
        // Advanced Image Utils chunk
        advancedImageUtils: {
          test: /[\\/]utils[\\/]imageUtils[\\/]advanced\.js/,
          name: 'advanced-image-utils',
          priority: 20,
          chunks: 'all',
          enforce: true
        },
        
        // Turkish Language Utils chunk
        turkishLanguageUtils: {
          test: /[\\/]utils[\\/]stringHelpers[\\/]turkish\.js/,
          name: 'turkish-language-utils',
          priority: 20,
          chunks: 'all',
          enforce: true
        },
        
        // Core utilities chunk - Sık kullanılan küçük utilities
        coreUtils: {
          test: /[\\/]utils[\\/](dateHelpers|numberHelpers|formValidation|imageUtils[\\/]core|stringHelpers[\\/]core)\.js/,
          name: 'core-utils',
          priority: 15,
          chunks: 'all',
          minChunks: 2
        },
        
        // Lazy loading infrastructure
        lazyUtils: {
          test: /[\\/]utils[\\/]lazyUtils\.js/,
          name: 'lazy-utils-manager',
          priority: 10,
          chunks: 'all',
          enforce: true
        },
        
        // Vendor libraries chunk
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 5,
          chunks: 'all',
          minChunks: 2
        },
        
        // Default chunk
        default: {
          minChunks: 2,
          priority: -10,
          reuseExistingChunk: true
        }
      }
    },
    
    // Runtime chunk optimization
    runtimeChunk: {
      name: 'runtime'
    },
    
    // Module ids optimization
    moduleIds: 'deterministic',
    chunkIds: 'deterministic'
  },
  
  // Performance budgets
  performance: {
    maxAssetSize: 250000, // 250KB
    maxEntrypointSize: 250000, // 250KB
    hints: 'warning'
  },
  
  // Bundle analysis
  stats: {
    chunks: true,
    chunkModules: true,
    chunkOrigins: true,
    modules: false,
    colors: true
  }
};