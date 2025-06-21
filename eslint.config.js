const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        performance: 'readonly',
        PerformanceObserver: 'readonly',
        fetch: 'readonly',
        crypto: 'readonly',
        // Node.js globals
        process: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        // React globals
        React: 'readonly',
      },
    },
    rules: {
      // Kullanılmayan değişkenler için uyarı
      'no-unused-vars': ['warn', {
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_|^e$',
        ignoreRestSiblings: true
      }],
      // Console.log'ları production'da kaldırmayı unutmamak için  
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // Boş satırlar ve trailing space'ler - KRİTİK KURAL!
      'no-trailing-spaces': 'error',
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      // Temel kod kalitesi kuralları
      'no-undef': 'error',
      'no-redeclare': 'error', 
      'no-dupe-keys': 'error',
      'no-unreachable': 'warn',
      'no-var': 'error',
      'prefer-const': 'error',
      // React friendly kurallar
      'no-unused-expressions': ['error', { 
        allowShortCircuit: true, 
        allowTernary: true 
      }],
      // Object.prototype methods
      'no-prototype-builtins': 'warn',
    },
  },
  {
    files: ['**/*.config.js', 'public/**/*.js'],
    languageOptions: {
      sourceType: 'script',
      globals: {
        module: 'writable',
        require: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
      },
    },
  },
];
