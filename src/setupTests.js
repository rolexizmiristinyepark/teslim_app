/**
 * Jest and React Testing Library Setup
 * Bu dosya tüm testler çalışmadan önce otomatik olarak yüklenir
 */

import '@testing-library/jest-dom';

// Environment variables mock'u
const mockEnvVars = {
  REACT_APP_ROLEX_IMAGE_URL: 'https://media.rolex.com/image/upload/q_auto:eco,f_auto,c_limit,w_1920/v1/rolexcom/collection/watches/m',
  REACT_APP_TUDOR_IMAGE_URL: 'https://media.tudorwatch.com/image/upload/q_auto:eco,f_auto,c_limit,w_1920/v1/tudorcom/collection/watches/tudor-m',
  REACT_APP_CUFFLINKS_IMAGE_PATH: '/images_cufflinks',
  REACT_APP_APP_NAME: 'Teslim Tutanak Form App',
  REACT_APP_VERSION: '1.0.0',
  REACT_APP_DEBUG_MODE: 'false',
  REACT_APP_ENABLE_LOGGING: 'false'
};

// Process.env mock'lama
Object.keys(mockEnvVars).forEach(key => {
  if (!process.env[key]) {
    process.env[key] = mockEnvVars[key];
  }
});

// Console error/warning'leri test sırasında sessizleştir
/* eslint-disable no-console */
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning:') || args[0].includes('React does not recognize'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Environment variable')
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});
/* eslint-enable no-console */

// ResizeObserver mock - JSDOM'da eksik
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Window.matchMedia mock
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Window.scrollTo mock
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn(),
});

// Window.print mock
Object.defineProperty(window, 'print', {
  writable: true,
  value: jest.fn(),
});

// Fetch mock (API çağrıları için)
global.fetch = jest.fn();

// Date mock - consistent test sonuçları için
const mockDate = new Date('2024-01-15T10:00:00.000Z');
const originalDate = Date;

beforeEach(() => {
  global.Date = jest.fn((...args) => {
    if (args.length === 0) {
      return mockDate;
    }
    return new originalDate(...args);
  });
  global.Date.now = jest.fn(() => mockDate.getTime());
  global.Date.UTC = originalDate.UTC;
  global.Date.parse = originalDate.parse;
});

afterEach(() => {
  global.Date = originalDate;
  jest.clearAllMocks();
});

// Custom test utilities
export const createMockFormData = (overrides = {}) => ({
  musteri: 'Test Müşteri',
  rmc: '126334',
  seri: 'TEST123',
  size: '40',
  aile: 'Datejust',
  description: 'Test açıklama',
  teslimEdilenKisi: 'Test Kişi',
  kadran: 'Blue',
  bilezik: 'Oyster',
  fiyat: '50000',
  ...overrides
});

export const createMockRmcResult = (overrides = {}) => ({
  FAMILY: 'DATEJUST',
  SIZE: '41',
  DIAL: 'Blue dial',
  BRACELET: 'Oyster bracelet',
  DETAIL: 'Datejust 41, Oystersteel',
  PRICE: '€10,500',
  ...overrides
});

export const createMockPayment = (overrides = {}) => ({
  id: 'test-payment-1',
  type: 'HAVALE',
  date: '15.01.2024',
  amount: '10000',
  currency: 'TL',
  ...overrides
});