/**
 * Görsel URL'leri ve image yapılandırmaları
 * Hard-coded değerlerin merkezi yönetimi
 */

// Cufflinks görselleri
export const CUFFLINKS_IMAGES = {
  A1015: process.env.PUBLIC_URL + '/images_cufflinks/A1015.png',
  A1018: process.env.PUBLIC_URL + '/images_cufflinks/A1018.png',
  A1019: process.env.PUBLIC_URL + '/images_cufflinks/A1019.png',
  A1025: process.env.PUBLIC_URL + '/images_cufflinks/A1025.png',
  A1028: process.env.PUBLIC_URL + '/images_cufflinks/A1028.png',
  A1029: process.env.PUBLIC_URL + '/images_cufflinks/A1029.png',
  A1035: process.env.PUBLIC_URL + '/images_cufflinks/A1035.png',
  A1038: process.env.PUBLIC_URL + '/images_cufflinks/A1038.png',
  A1039: process.env.PUBLIC_URL + '/images_cufflinks/A1039.png',
};

// Rolex görsel URL base
export const ROLEX_IMAGE_BASE_URL =
  'https://media.rolex.com/image/upload/q_auto:eco/f_auto/t_v7/c_limit,w_3200/v1/catalogue/2025/upright-c/m';

// Görsel fallback component props
export const IMAGE_FALLBACK_CONFIG = {
  cufflinks: {
    width: 'w-12 h-12',
    iconSize: 'w-6 h-6',
    printWidth: 'print:w-10 print:h-10',
    printIconSize: 'print:w-5 print:h-5',
    alt: 'Cufflinks',
  },
  watch: {
    width: 'w-16 h-16',
    iconSize: 'w-8 h-8',
    printWidth: 'print:w-12 print:h-12',
    printIconSize: 'print:w-6 print:h-6',
    alt: 'Ürün Görseli',
  },
};

// Görsel container boyutları
export const IMAGE_CONTAINER_SIZES = {
  cufflinks: {
    container: 'w-full h-48 print:h-40',
    maxWidth: 'max-w-xs print:max-w-xs print:w-full',
  },
  watch: {
    container: 'w-full h-64 print:h-48',
    maxWidth: 'max-w-xs print:max-w-xs print:w-full',
  },
};
