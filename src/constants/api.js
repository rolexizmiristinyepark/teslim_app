/**
 * API Configuration with Environment Variables
 * Environment variables kullanarak dış kaynak URL'lerini yönetir
 */

// Environment variables'ı fallback değerlerle al
const getEnvVar = (name, fallback) => {
  const value = process.env[name];
  if (!value && process.env.REACT_APP_DEBUG_MODE === 'true') {
    // Environment variable not found - using fallback
  }
  return value || fallback;
};

// Environment bilgilerini export et (debugging için)
export const ENV_CONFIG = {
  APP_NAME: getEnvVar('REACT_APP_APP_NAME', 'Teslim Tutanak Form App'),
  APP_VERSION: getEnvVar('REACT_APP_VERSION', '1.0.0'),
};
