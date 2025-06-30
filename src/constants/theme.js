/**
 * Consolidated Theme Configuration
 * All style constants unified in a single THEME object
 */

import { BrandTypes, CategoryTypes } from './types';

// Tüm style constant'ları tek dosyada topla
export const THEME = {
  colors: {
    rolex: {
      green: '#145c3a',
      blue: '#003057',
      saat: '#145c3a',
      aksesuar: '#003057',
    },
    tudor: {
      red: '#be0300',
    },
    brand: {
      [BrandTypes.ROLEX]: {
        [CategoryTypes.SAAT]: '#145c3a',
        [CategoryTypes.AKSESUAR]: '#003057',
      },
      [BrandTypes.TUDOR]: '#be0300',
    },
    accent: {
      gold: '#ffc506',
      green: '#059669',
      blue: '#003057',
    },
    status: {
      success: '#10b981',
      error: '#dc2626',
      warning: '#f59e0b',
      info: '#3b82f6',
    },
    neutral: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },

  // Border radius (sadece kullanılan)
  borderRadius: {
    xl: '20px',
  },

  buttons: {
    // Basic button styles (sadece kullanılan)
    base: {
      height: '44px',
      padding: '0 16px',
      fontSize: '14px',
      fontWeight: '500',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      border: '1px solid transparent',
    },
  },

  layout: {
    // Grid classes
    grid: {
      cufflinks:
        'grid grid-cols-1 lg:grid-cols-2 gap-4 print:grid-cols-2 print:gap-3',
      watch:
        'grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-3 print:gap-4',
    },
  },

  // Form container and component styles
  formContainer: {
    // Print view container
    printView: {
      backgroundColor: 'transparent', // Inherit mint green from body
      boxShadow: 'none',
      border: 'none',
    },
    // Main form container
    main: {
      position: 'relative',
    },
    // Form content area
    content: {
      position: 'relative',
      zIndex: 1,
    },
  },

  // Icon styles for action buttons
  icons: {
    edit: {
      stroke: '#003057',
      color: '#003057',
    },
    print: {
      stroke: '#145c3a',
      color: '#145c3a',
    },
    delete: {
      stroke: '#be0300',
      color: '#be0300',
    },
  },
};

// Sadece kullanılan helper fonksiyonlar
export const getBrandColor = (brand, category) => {
  if (brand === BrandTypes.ROLEX && category === CategoryTypes.SAAT) {
    return THEME.colors.brand[BrandTypes.ROLEX][CategoryTypes.SAAT];
  }
  if (brand === BrandTypes.ROLEX && category === CategoryTypes.AKSESUAR) {
    return THEME.colors.brand[BrandTypes.ROLEX][CategoryTypes.AKSESUAR];
  }
  if (brand === BrandTypes.TUDOR) {
    return THEME.colors.brand[BrandTypes.TUDOR];
  }
  return THEME.colors.rolex.blue;
};

// Payment theme class helper - inline implementation
export const getPaymentThemeClass = (_selectedBrand, _selectedCategory) => {
  // Tüm input'lar aynı border style kullanıyor
  return 'border-transparent focus:border-[#003057]';
};
