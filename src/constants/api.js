/**
 * API Configuration with Environment Variables
 * Environment variables kullanarak dış kaynak URL'lerini yönetir
 */

// Environment variables'ı fallback değerlerle al
const getEnvVar = (name, fallback) => {
  const value = process.env[name];
  if (!value && process.env.REACT_APP_DEBUG_MODE === 'true') {
    console.warn(`Environment variable ${name} not found, using fallback: ${fallback}`);
  }
  return value || fallback;
};

// Fallback URL'ler - environment variable yoksa kullanılır
const FALLBACK_URLS = {
  ROLEX: 'https://media.rolex.com/image/upload/q_auto:eco,f_auto,c_limit,w_1920/v1/rolexcom/collection/watches/m',
  TUDOR: 'https://media.tudorwatch.com/image/upload/q_auto:eco,f_auto,c_limit,w_1920/v1/tudorcom/collection/watches/tudor-m',
  CUFFLINKS: '/images_cufflinks'
};

// Environment variables'ı oku
const ROLEX_BASE_URL = getEnvVar('REACT_APP_ROLEX_IMAGE_URL', FALLBACK_URLS.ROLEX);
const TUDOR_BASE_URL = getEnvVar('REACT_APP_TUDOR_IMAGE_URL', FALLBACK_URLS.TUDOR);
const CUFFLINKS_PATH = getEnvVar('REACT_APP_CUFFLINKS_IMAGE_PATH', FALLBACK_URLS.CUFFLINKS);

// Image URL'leri environment variable'lardan oluştur
export const IMAGE_URLS = {
  ROLEX: (rmc) => `${ROLEX_BASE_URL}${rmc}`,
  TUDOR: (rmc) => `${TUDOR_BASE_URL}${rmc}`,
  CUFFLINKS: (rmc) => `${CUFFLINKS_PATH}/${rmc}.png`,
};

// Environment bilgilerini export et (debugging için)
export const ENV_CONFIG = {
  ROLEX_BASE_URL,
  TUDOR_BASE_URL,
  CUFFLINKS_PATH,
  DEBUG_MODE: process.env.REACT_APP_DEBUG_MODE === 'true',
  LOGGING_ENABLED: process.env.REACT_APP_ENABLE_LOGGING === 'true',
  APP_NAME: getEnvVar('REACT_APP_APP_NAME', 'Teslim Tutanak Form App'),
  APP_VERSION: getEnvVar('REACT_APP_VERSION', '1.0.0'),
};
