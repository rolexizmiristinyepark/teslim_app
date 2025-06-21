/**
 * Lazy RMC Input Component
 * RMC input için optimize edilmiş wrapper bileşeni
 */

import React, { memo, useEffect, useState } from 'react';
import { preloadUtilities } from '../utils/lazyUtils';

const LazyRmcInput = memo(({ onFocus, onRmcChange, ...props }) => {
  const [isPreloaded, setIsPreloaded] = useState(false);

  // RMC input'a focus olduğunda service'i preload et
  const handleFocus = (e) => {
    if (!isPreloaded) {
      console.log('🎯 RMC Input focused - preloading RMC service...');
      preloadUtilities.onRmcFocus();
      setIsPreloaded(true);
    }
    
    if (onFocus) {
      onFocus(e);
    }
  };

  // RMC değiştiğinde lazy loading ile analiz yap
  const handleRmcChange = async (e) => {
    const value = e.target.value;
    
    // Eğer değer varsa ve yeterince uzunsa RMC Service'i yükle
    if (value && value.trim().length >= 3) {
      try {
        const { loadRmcService } = await import('../utils/lazyUtils');
        const rmcService = await loadRmcService();
        console.log('✅ RMC Service loaded for analysis');
      } catch (error) {
        console.warn('⚠️ Failed to preload RMC Service:', error);
      }
    }
    
    if (onRmcChange) {
      onRmcChange(e);
    }
  };

  return (
    <input
      {...props}
      onFocus={handleFocus}
      onChange={handleRmcChange}
      placeholder="RMC Kodu (örn: 126334-0001)"
    />
  );
});

LazyRmcInput.displayName = 'LazyRmcInput';

export default LazyRmcInput;