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

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    '4xl': '48px',
    '5xl': '64px',
    '6xl': '80px',
  },

  // Font sizes
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
  },

  // Border radius
  borderRadius: {
    none: '0',
    sm: '4px',
    base: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    full: '50%',
  },

  // Z-index scale
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },

  modal: {
    // Modern Modal Styles
    backdrop: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    },
    container: {
      width: '450px',
      height: '650px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
    },
    header: {
      height: '80px',
      padding: '24px 24px 16px 24px',
      borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)',
    },
    body: {
      flex: 1,
      padding: '16px 24px',
      overflowY: 'auto',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      minHeight: '0',
    },
    footer: {
      height: '80px',
      padding: '16px 24px',
      borderTop: '1px solid rgba(0, 0, 0, 0.06)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(255, 255, 255, 0.9) 100%)',
    },
    // Legacy Modal Styles
    legacy: {
      container: {
        display: 'flex',
        position: 'relative',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '400px',
        minWidth: '350px',
      },
      form: {
        padding: '20px',
        paddingBottom: '20px',
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        height: '520px',
        maxHeight: '520px',
        overflow: 'hidden',
      },
    },
  },

  buttons: {
    // Basic button styles
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
    // Branded button styles
    branded: {
      rolex: 'bg-[#145c3a] text-white',
      tudor: 'bg-[#be0300] text-white',
      cufflinks: 'bg-[#003057] text-white',
    },
    // Action button styles
    primary: {
      height: '48px',
      padding: '0 24px',
      backgroundColor: 'var(--rolex-color)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      boxShadow: '0 4px 12px rgba(20, 92, 58, 0.3)',
    },
    secondary: {
      height: '48px',
      padding: '0 24px',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      color: '#64748b',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      backdropFilter: 'blur(10px)',
    },
    // Form specific buttons
    form: {
      transition: 'all 0.2s ease-in',
      position: 'relative',
      overflow: 'hidden',
      zIndex: 1,
      color: '#1f2937',
      padding: '0.6em 1.2em',
      cursor: 'pointer',
      fontSize: '13px',
      borderRadius: '0.4em',
      background: '#f8f9fa',
      border: '1px solid #f8f9fa',
      boxShadow: '6px 6px 12px #d1d5db, -6px -6px 12px #ffffff',
      fontWeight: '600',
      height: '48px',
      width: '100px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      whiteSpace: 'nowrap',
    },
    // Add payment button
    addPayment: {
      height: '40px',
      padding: '0 16px',
      fontSize: '14px',
      fontWeight: '500',
      background: '#ffffff',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      color: '#374151',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      whiteSpace: 'nowrap',
    },
    // FAB styles
    fab: {
      add: {
        position: 'absolute',
        bottom: '24px',
        right: '24px',
        width: '56px',
        height: '56px',
        backgroundColor: 'var(--rolex-color)',
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 32px rgba(20, 92, 58, 0.3)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 10,
      },
      remove: {
        position: 'absolute',
        top: '12px',
        right: '12px',
        width: '32px',
        height: '32px',
        backgroundColor: '#ef4444',
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        color: 'white',
        opacity: '0.8',
        transition: 'all 0.2s ease',
        zIndex: 5,
      },
    },
  },

  forms: {
    // Input styles
    input: {
      base: {
        height: '44px',
        padding: '12px 16px',
        fontSize: '14px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        borderRadius: '12px',
        outline: 'none',
        transition: 'all 0.2s ease',
        backdropFilter: 'blur(10px)',
      },
      focus: {
        borderColor: 'var(--rolex-color)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        boxShadow: '0 0 0 3px rgba(20, 92, 58, 0.1)',
      },
    },
    // Theme classes for inputs
    theme: {
      [BrandTypes.ROLEX]: {
        [CategoryTypes.SAAT]: 'border-transparent focus:border-[#003057]',
        [CategoryTypes.AKSESUAR]: 'border-transparent focus:border-[#003057]',
      },
      [BrandTypes.TUDOR]: 'border-transparent focus:border-[#003057]',
      default: 'border-transparent focus:border-[#003057]',
    },
    // Select dropdown
    select: {
      base: {
        height: '44px',
        padding: '12px 16px',
        fontSize: '14px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        borderRadius: '12px',
        outline: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        backdropFilter: 'blur(10px)',
        backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,<svg viewBox=\'0 0 4 5\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'m0 1 2 2 2-2\' stroke=\'%23666\' fill=\'none\'/></svg>")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 16px center',
        backgroundSize: '12px',
        paddingRight: '44px',
      },
    },
    // Currency radio buttons
    currency: {
      container: {
        display: 'flex',
        gap: '8px',
        marginTop: '4px',
      },
      button: {
        width: '44px',
        height: '44px',
        borderRadius: '12px',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        backdropFilter: 'blur(10px)',
      },
      selected: {
        borderColor: 'var(--rolex-color)',
        backgroundColor: 'rgba(20, 92, 58, 0.1)',
        color: 'var(--rolex-color)',
        boxShadow: '0 0 0 2px rgba(20, 92, 58, 0.1)',
      },
    },
  },

  layout: {
    // Grid classes
    grid: {
      cufflinks: 'grid grid-cols-1 lg:grid-cols-2 gap-4 print:grid-cols-2 print:gap-3',
      watch: 'grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-3 print:gap-4',
    },
    // Print classes
    print: {
      hidden: 'print:hidden',
      visible: 'print:block',
      pageBreak: 'print:break-after-page',
      noShadow: 'print:shadow-none',
      noBorder: 'print:border-none',
      noPadding: 'print:p-0',
    },
  },

  cards: {
    // Payment card styles
    collapsed: {
      height: '60px',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      border: '1px solid rgba(0, 0, 0, 0.08)',
      padding: '16px 20px',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
    },
    expanded: {
      minHeight: '200px',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(15px)',
      borderRadius: '20px',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      padding: '20px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    },
  },

  animations: {
    fadeIn: {
      animation: 'fadeInModal 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    scaleIn: {
      animation: 'scaleInModal 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    slideUp: {
      animation: 'slideUpModal 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  responsive: {
    mobile: {
      maxWidth: '480px',
      container: {
        width: '95vw',
        height: '90vh',
        margin: '5vh auto',
      },
    },
    tablet: {
      maxWidth: '768px',
      container: {
        width: '400px',
        height: '650px',
      },
    },
    desktop: {
      minWidth: '769px',
      container: {
        width: '450px',
        height: '650px',
      },
    },
  },

  // Form container and component styles
  formContainer: {
    // Print view container
    printView: {
      backgroundColor: '#F4FCFB',
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

  // Legacy constants consolidated into THEME
  legacy: {
    // Grid classes
    grid: {
      cufflinks: 'grid grid-cols-1 lg:grid-cols-2 gap-4 print:grid-cols-2 print:gap-3',
      watch: 'grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-3 print:gap-4',
    },
    // Print classes
    print: {
      hidden: 'print:hidden',
      visible: 'print:block',
      pageBreak: 'print:break-after-page',
      noShadow: 'print:shadow-none',
      noBorder: 'print:border-none',
      noPadding: 'print:p-0',
    },
    // Theme classes for input elements
    inputTheme: {
      rolexWatch: 'border-transparent focus:border-[#003057]',
      rolexAccessory: 'border-transparent focus:border-[#003057]', 
      tudor: 'border-transparent focus:border-[#003057]',
      default: 'border-transparent focus:border-[#003057]',
    },
    // Brand colors
    brandColors: {
      rolexGreen: '#145c3a',
      rolexBlue: '#003057',
      tudorRed: '#be0300',
      gold: '#ffc506',
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

// Legacy exports for backward compatibility - All reference THEME object
export const INPUT_THEME_CLASSES = {
  ROLEX_WATCH: THEME.legacy.inputTheme.rolexWatch,
  ROLEX_ACCESSORY: THEME.legacy.inputTheme.rolexAccessory,
  TUDOR: THEME.legacy.inputTheme.tudor,
  DEFAULT: THEME.legacy.inputTheme.default,
};

export const PAYMENT_THEME_CLASSES = INPUT_THEME_CLASSES;

export const BRAND_COLORS = {
  ROLEX_GREEN: THEME.legacy.brandColors.rolexGreen,
  ROLEX_BLUE: THEME.legacy.brandColors.rolexBlue,
  TUDOR_RED: THEME.legacy.brandColors.tudorRed,
  GOLD: THEME.legacy.brandColors.gold,
};

export const PRINT_CLASSES = THEME.legacy.print;
export const GRID_CLASSES = THEME.legacy.grid;

// Helper functions
export const getInputThemeClass = (selectedBrand, selectedCategory) => {
  if (selectedBrand === BrandTypes.ROLEX && selectedCategory === CategoryTypes.SAAT) {
    return THEME.legacy.inputTheme.rolexWatch;
  }
  if (selectedBrand === BrandTypes.ROLEX && selectedCategory === CategoryTypes.AKSESUAR) {
    return THEME.legacy.inputTheme.rolexAccessory;
  }
  if (selectedBrand === BrandTypes.TUDOR) {
    return THEME.legacy.inputTheme.tudor;
  }
  return THEME.legacy.inputTheme.default;
};

export const getPaymentThemeClass = getInputThemeClass;

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

export const getBrandedButtonStyle = (brand, category) => {
  const color = getBrandColor(brand, category);
  return {
    ...THEME.buttons.base,
    borderColor: color,
    color: color,
  };
};
