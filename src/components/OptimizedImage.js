/**
 * Optimized Image Component
 * WebP desteği ve lazy loading ile performans optimizasyonu
 */

import React, { useState, useRef, useEffect, memo } from 'react';
import { THEME } from '../constants/theme';

/**
 * WebP destekli ve lazy loading özellikli resim bileşeni
 * 
 * @param {Object} props - Bileşen özellikleri
 * @param {string} props.src - Resim kaynak yolu (PNG/JPEG)
 * @param {string} props.alt - Alt text
 * @param {string} props.className - CSS class'ları
 * @param {Object} props.style - Inline stil
 * @param {boolean} props.lazy - Lazy loading aktif mi (varsayılan: true)
 * @param {string} props.placeholder - Placeholder resim
 * @param {function} props.onLoad - Yüklenme callback'i
 * @param {function} props.onError - Hata callback'i
 * @param {Object} props.fallback - Fallback resim yolu
 */
const OptimizedImage = memo(({
  src,
  alt = '',
  className = '',
  style = {},
  lazy = true,
  placeholder = null,
  onLoad,
  onError,
  fallback = null,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const [currentSrc, setCurrentSrc] = useState(placeholder);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // WebP desteği kontrolü
  const [supportsWebP, setSupportsWebP] = useState(null);

  useEffect(() => {
    // WebP desteği kontrolü
    const checkWebPSupport = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const webpData = canvas.toDataURL('image/webp');
      setSupportsWebP(webpData.indexOf('image/webp') === 5);
    };

    checkWebPSupport();
  }, []);

  // Intersection Observer setup for lazy loading
  useEffect(() => {
    if (!lazy || isInView) return;

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (observerRef.current) {
            observerRef.current.disconnect();
          }
        }
      });
    };

    observerRef.current = new IntersectionObserver(observerCallback, {
      rootMargin: '50px', // Load image 50px before it comes into view
      threshold: 0.1
    });

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [lazy, isInView]);

  // Image source belirleme
  const getOptimizedSrc = (originalSrc) => {
    if (!originalSrc) return '';

    // Eğer zaten optimized klasöründen geliyorsa direkt kullan
    if (originalSrc.includes('/optimized/')) {
      return originalSrc;
    }

    // WebP desteği varsa WebP version'ını kullan
    if (supportsWebP) {
      // PNG/JPG uzantısını WebP ile değiştir ve optimized klasörüne yönlendir
      const webpSrc = originalSrc
        .replace('/images_cufflinks/', '/optimized/images_cufflinks/')
        .replace('/images/', '/optimized/images/')
        .replace(/\.(png|jpg|jpeg)$/i, '.webp');
      return webpSrc;
    }

    // WebP desteği yoksa optimized PNG kullan
    return originalSrc
      .replace('/images_cufflinks/', '/optimized/images_cufflinks/')
      .replace('/images/', '/optimized/images/');
  };

  // Fallback source belirleme
  const getFallbackSrc = (originalSrc) => {
    if (!originalSrc || fallback) return fallback;
    
    // Optimized olmayan orijinal dosyayı fallback olarak kullan
    return originalSrc;
  };

  // Image load handler
  const handleLoad = () => {
    setIsLoaded(true);
    setIsError(false);
    if (onLoad) onLoad();
  };

  // Image error handler
  const handleError = () => {
    if (!isError && !currentSrc.includes('/optimized/')) {
      // İlk hata: optimized version'ı dene
      setIsError(false);
      setCurrentSrc(getOptimizedSrc(src));
      return;
    }

    if (!isError) {
      // İkinci hata: fallback'e geç
      const fallbackSrc = getFallbackSrc(src);
      if (fallbackSrc && fallbackSrc !== currentSrc) {
        setCurrentSrc(fallbackSrc);
        return;
      }
    }

    // Son hata: error state'i set et
    setIsError(true);
    if (onError) onError();
  };

  // Source'u güncelle
  useEffect(() => {
    if (isInView && src && supportsWebP !== null) {
      const optimizedSrc = getOptimizedSrc(src);
      setCurrentSrc(optimizedSrc);
    }
  }, [isInView, src, supportsWebP]);

  // Loading state styles
  const loadingStyles = {
    ...style,
    opacity: isLoaded ? 1 : 0.7,
    transition: 'opacity 0.3s ease',
    backgroundColor: isLoaded ? 'transparent' : THEME.colors.neutral[100],
  };

  // Error state
  if (isError) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 ${className}`}
        style={{ ...style, minHeight: '100px' }}
        {...props}
      >
        <div className="text-center p-4">
          <svg
            className="mx-auto h-8 w-8 text-gray-400 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-xs text-gray-500">Resim yüklenemedi</p>
        </div>
      </div>
    );
  }

  // Placeholder while not in view (lazy loading)
  if (!isInView) {
    return (
      <div
        ref={imgRef}
        className={`bg-gray-200 animate-pulse ${className}`}
        style={{ ...style, minHeight: '100px' }}
        {...props}
      />
    );
  }

  return (
    <picture>
      {/* WebP source for modern browsers */}
      {supportsWebP && (
        <source
          srcSet={getOptimizedSrc(src)}
          type="image/webp"
        />
      )}
      
      {/* Fallback for browsers that don't support WebP */}
      <img
        ref={imgRef}
        src={currentSrc || src}
        alt={alt}
        className={className}
        style={loadingStyles}
        onLoad={handleLoad}
        onError={handleError}
        loading={lazy ? 'lazy' : 'eager'}
        {...props}
      />
    </picture>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;