/**
 * Memoized Theme Hook
 * Tema hesaplamalarını optimize etmek için memoization kullanır
 */

import { useMemo, useCallback, useEffect } from 'react';
import { 
  THEME,
  getBrandColor,
  getInputThemeClass,
  getPaymentThemeClass,
  getBrandedButtonStyle
} from '../constants/theme';
import { BrandTypes, CategoryTypes } from '../constants/types';

/**
 * Tema verilerini memoize eden ve optimize eden hook
 * @param {string} selectedBrand - Seçili marka
 * @param {string} selectedCategory - Seçili kategori
 * @returns {Object} Memoize edilmiş tema verileri
 */
export const useMemoizedTheme = (selectedBrand, selectedCategory) => {
  // Brand color calculation - expensive function
  const brandColor = useMemo(() => {
    return getBrandColor(selectedBrand, selectedCategory);
  }, [selectedBrand, selectedCategory]);

  // Input theme class calculation - string operations
  const inputTheme = useMemo(() => {
    return getInputThemeClass(selectedBrand, selectedCategory);
  }, [selectedBrand, selectedCategory]);

  // Payment theme class calculation
  const paymentTheme = useMemo(() => {
    return getPaymentThemeClass(selectedBrand, selectedCategory);
  }, [selectedBrand, selectedCategory]);

  // Button styles calculation - object creation
  const buttonStyles = useMemo(() => {
    const brandedStyle = getBrandedButtonStyle(selectedBrand, selectedCategory);
    
    return {
      branded: brandedStyle,
      primary: {
        ...THEME.buttons.primary,
        backgroundColor: brandColor,
        boxShadow: `0 4px 12px ${brandColor}30`
      },
      secondary: THEME.buttons.secondary,
      form: THEME.buttons.form
    };
  }, [selectedBrand, selectedCategory, brandColor]);

  // Theme state object - complex computation
  const themeState = useMemo(() => {
    const isRolexWatch = selectedBrand === BrandTypes.ROLEX && selectedCategory === CategoryTypes.SAAT;
    const isRolexAccessory = selectedBrand === BrandTypes.ROLEX && selectedCategory === CategoryTypes.AKSESUAR;
    const isTudor = selectedBrand === BrandTypes.TUDOR;

    return {
      selectedBrand,
      selectedCategory,
      brandColor,
      isRolexWatch,
      isRolexAccessory,
      isTudor,
      brandName: isRolexWatch ? 'Rolex' : isTudor ? 'Tudor' : 'Rolex Cufflinks',
      categoryName: selectedCategory === CategoryTypes.SAAT ? 'Saat' : 'Aksesuar'
    };
  }, [selectedBrand, selectedCategory, brandColor]);

  // CSS variables calculation - DOM manipulation
  const cssVariables = useMemo(() => {
    return {
      '--brand-color': brandColor,
      '--active-border-color': THEME.colors.rolex.blue,
      '--rolex-color': brandColor,
      '--brand-color-light': `${brandColor}20`,
      '--brand-color-dark': `${brandColor}dd`
    };
  }, [brandColor]);

  // Form styling configuration
  const formStyles = useMemo(() => {
    return {
      input: {
        base: THEME.forms.input.base,
        focus: {
          ...THEME.forms.input.focus,
          borderColor: brandColor
        },
        error: {
          ...THEME.forms.input.base,
          borderColor: THEME.colors.status.error,
          backgroundColor: `${THEME.colors.status.error}10`
        }
      },
      select: THEME.forms.select.base,
      currency: {
        ...THEME.forms.currency.button,
        selected: {
          ...THEME.forms.currency.selected,
          borderColor: brandColor,
          backgroundColor: `${brandColor}20`,
          color: brandColor
        }
      }
    };
  }, [brandColor]);

  // Modal configuration based on brand
  const modalConfig = useMemo(() => {
    return {
      container: THEME.modal.container,
      header: {
        ...THEME.modal.header,
        background: `linear-gradient(135deg, ${brandColor}10 0%, ${brandColor}05 100%)`
      },
      body: THEME.modal.body,
      footer: {
        ...THEME.modal.footer,
        borderTopColor: `${brandColor}20`
      }
    };
  }, [brandColor]);

  // Icon styles based on brand
  const iconStyles = useMemo(() => {
    return {
      edit: {
        ...THEME.icons.edit,
        stroke: brandColor
      },
      print: {
        ...THEME.icons.print,
        stroke: THEME.colors.status.success
      },
      delete: THEME.icons.delete,
      brand: {
        stroke: brandColor,
        fill: 'none',
        strokeWidth: 1.5
      }
    };
  }, [brandColor]);

  // Layout configuration
  const layoutConfig = useMemo(() => {
    const isAccessory = selectedCategory === CategoryTypes.AKSESUAR;
    
    return {
      grid: isAccessory ? THEME.layout.grid.cufflinks : THEME.layout.grid.watch,
      container: {
        maxWidth: isAccessory ? '600px' : '800px',
        columns: isAccessory ? 2 : 3,
        gap: isAccessory ? '12px' : '16px'
      },
      spacing: {
        component: isAccessory ? THEME.spacing.md : THEME.spacing.lg,
        section: isAccessory ? THEME.spacing.xl : THEME.spacing['2xl']
      }
    };
  }, [selectedCategory]);

  // Performance configuration
  const performanceConfig = useMemo(() => {
    return {
      shouldUseMemo: true,
      shouldUseCallback: true,
      reRenderThreshold: 100, // ms
      memoizationLevel: 'aggressive'
    };
  }, []);

  // CSS class generator - memoized function
  const getThemeClass = useCallback((element, state = 'default') => {
    const baseClass = `theme-${selectedBrand.toLowerCase()}`;
    const categoryClass = `category-${selectedCategory.toLowerCase()}`;
    const elementClass = `${element}-${state}`;
    
    return `${baseClass} ${categoryClass} ${elementClass}`;
  }, [selectedBrand, selectedCategory]);

  // Style merger - memoized function
  const mergeStyles = useCallback((baseStyles, customStyles = {}) => {
    return {
      ...baseStyles,
      ...customStyles,
      ...cssVariables
    };
  }, [cssVariables]);

  // Theme validator - memoized function
  const validateTheme = useCallback(() => {
    const requiredProps = ['selectedBrand', 'selectedCategory', 'brandColor'];
    const missing = requiredProps.filter(prop => {
      switch (prop) {
        case 'selectedBrand':
          return !selectedBrand;
        case 'selectedCategory':
          return !selectedCategory;
        case 'brandColor':
          return !brandColor;
        default:
          return false;
      }
    });

    return {
      isValid: missing.length === 0,
      missingProps: missing,
      warnings: []
    };
  }, [selectedBrand, selectedCategory, brandColor]);

  // Apply CSS variables to document
  useEffect(() => {
    const root = document.documentElement;
    
    Object.entries(cssVariables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Cleanup on unmount
    return () => {
      Object.keys(cssVariables).forEach(property => {
        root.style.removeProperty(property);
      });
    };
  }, [cssVariables]);

  // Apply body classes for global styling
  useEffect(() => {
    const body = document.body;
    
    // Remove old classes
    body.classList.remove(
      'brand-rolex', 'brand-tudor',
      'category-saat', 'category-aksesuar'
    );

    // Add new classes
    body.classList.add(`brand-${selectedBrand.toLowerCase()}`);
    body.classList.add(`category-${selectedCategory.toLowerCase()}`);

    return () => {
      body.classList.remove(
        `brand-${selectedBrand.toLowerCase()}`,
        `category-${selectedCategory.toLowerCase()}`
      );
    };
  }, [selectedBrand, selectedCategory]);

  return {
    // Core theme data
    themeState,
    brandColor,
    inputTheme,
    paymentTheme,
    
    // Style configurations
    buttonStyles,
    formStyles,
    modalConfig,
    iconStyles,
    layoutConfig,
    
    // CSS integration
    cssVariables,
    
    // Helper functions
    getThemeClass,
    mergeStyles,
    validateTheme,
    
    // Performance
    performanceConfig,
    
    // Quick access
    isRolex: themeState.isRolexWatch || themeState.isRolexAccessory,
    isTudor: themeState.isTudor,
    isAccessory: themeState.isRolexAccessory,
    brandName: themeState.brandName,
    
    // Validation
    validation: validateTheme()
  };
};