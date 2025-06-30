# Teslim Tutanağı Form Uygulaması

Bu uygulama, Rolex, Tudor ve Cufflinks ürünleri için profesyonel teslim tutanakları oluşturmak amacıyla geliştirilmiş, kurumsal seviye modern React uygulamasıdır. Lüks saat ve aksesuar sektörüne yönelik özel olarak tasarlanmış bir document management sistemidir.

## 🚀 Özellikler

### Temel İş Özellikleri
- **Çoklu Marka Desteği**: Rolex, Tudor ve Cufflinks ürünleri için özelleştirilmiş form alanları ve validasyon kuralları
- **Akıllı RMC Analizi**: CSV veritabanından gerçek zamanlı ürün bilgisi çekme ve otomatik form doldurma
- **Çoklu Para Birimi**: TL, EUR, USD desteği ile esnek ödeme yönetimi
- **Türkçe Dil Desteği**: Türkçe dilbilgisi kuralları ve karakter desteği ile yerelleştirme
- **A4 Yazdırma Optimizasyonu**: Profesyonel belge formatında çıktı alabilme
- **Responsive Modal Sistem**: Üç-aşamalı form işleme süreci

### Teknik Özellikler
- **Modern React 18**: Hooks, Suspense, Error Boundaries ve functional components
- **Performance Engineering**: Lazy loading, memoization, bundle optimization
- **Comprehensive Testing**: %70+ kod coverage ile unit ve integration testleri
- **Accessibility Compliance**: WCAG 2.1 AA standartlarına uygun erişilebilirlik
- **Error Management**: Centralized error handling ve logging sistemi
- **Type Safety**: Constants ve enums ile type-safe development
- **Clean Architecture**: SOLID principles ve modular design patterns

### Güvenlik ve Kalite
- **Security Best Practices**: Input validation, XSS protection, secure defaults
- **Code Quality**: ESLint, Prettier, comprehensive test coverage
- **Bundle Analysis**: Source map explorer ile performans monitoring
- **CI/CD Ready**: Automated testing ve deployment pipeline desteği

## 🛠️ Teknoloji Stack

### Core Technologies
- **Frontend Framework**: React 18.3.1
- **Styling System**: Tailwind CSS 3.4.17 + CSS Custom Properties
- **State Management**: Custom hooks ile local state management
- **Testing Framework**: Jest + React Testing Library
- **Build System**: React Scripts 5.0.1 (Webpack 5)

### Development Tools
- **Code Quality**: ESLint 9.28.0 + Prettier 3.5.3
- **Testing**: Jest + jsdom environment
- **Bundling**: Source Map Explorer for analysis
- **Image Optimization**: Custom imagemin pipeline
- **Date Processing**: date-fns 3.6.0
- **Icons**: Lucide React 0.511.0
- **CSV Processing**: PapaParse 5.5.3

### Infrastructure
- **Node.js**: >=18.0.0
- **Package Manager**: npm >=8.0.0
- **Browser Support**: Modern browsers (ES2015+)
- **Print Support**: Chrome/WebKit print engine optimization

## 📁 Proje Yapısı

```
/
├── public/                          # Statik dosyalar ve veri
│   ├── data/RMC.csv                # Ürün veritabanı
│   ├── images/                     # Marka logoları
│   │   ├── rolex-logo.png
│   │   ├── tudor-logo.png
│   │   └── cufflinks-logo.png
│   ├── images_cufflinks/           # Cufflinks ürün görselleri
│   │   ├── A1015.png → A1037.png
│   │   └── ...
│   ├── optimized/                  # WebP optimize edilmiş görseller
│   └── manifest.json               # PWA manifest
│
├── src/                            # Ana kaynak kod
│   ├── components/                 # React bileşenleri
│   │   ├── ErrorBoundary.js       # Global hata yakalama
│   │   ├── ProductModal/          # Ürün detay modalleri
│   │   │   ├── ProductDetailModal.js     # Ürün görsellemesi
│   │   │   └── PaymentDetailModal/       # Ödeme yönetimi
│   │   │       ├── index.js             # Ana modal bileşeni
│   │   │       ├── PaymentForm.js       # Ödeme formu
│   │   │       ├── PaymentCard.js       # Ödeme kartı UI
│   │   │       ├── TotalAmountCard.js   # Toplam tutar
│   │   │       └── ActionButton.js      # Eylem butonları
│   │   ├── RolexWatchForm/MainForm/     # Ana form bileşenleri
│   │   │   ├── BrandSelector.js         # Marka seçici
│   │   │   ├── CustomerForm.js          # Müşteri bilgileri
│   │   │   └── RmcInput.js             # RMC giriş ve analiz
│   │   └── TutanakTemplate/            # Belge şablonu sistemi
│   │       ├── index.js                # Ana şablon
│   │       ├── ProductInfoGrid.js      # Ürün bilgi tablosu
│   │       ├── PaymentSection.js       # Ödeme bölümü
│   │       ├── SignatureSection.js     # İmza alanı
│   │       ├── components/             # Alt bileşenler
│   │       │   ├── DocumentHeader.js   # Belge başlığı
│   │       │   └── IdCardImageUpload.js # Kimlik yükleme
│   │       ├── styles/printStyles.css  # Yazdırma stilleri
│   │       └── utils/                  # Şablon yardımcıları
│   │           ├── amountCalculator.js
│   │           └── paymentTextGenerator.js
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── useFormData.js         # Form state yönetimi
│   │   ├── usePayments.js         # Ödeme state yönetimi
│   │   ├── useRmcAnalysis.js      # RMC analiz logic
│   │   ├── usePaymentModal.js     # Modal state yönetimi
│   │   └── useTheme.js            # Tema yönetimi
│   │
│   ├── utils/                      # Yardımcı fonksiyonlar
│   │   ├── brandHelpers.js        # Marka işlemleri
│   │   ├── dateHelpers.js         # Tarih işlemleri
│   │   ├── formValidation.js      # Form doğrulama
│   │   ├── numberHelpers.js       # Sayı formatlama
│   │   ├── paymentHelpers.js      # Ödeme hesaplamaları
│   │   ├── stringHelpers.js       # String işlemleri
│   │   └── newRmcService.js       # RMC servisi
│   │
│   ├── constants/                  # Sabit değerler
│   │   ├── types.js               # Tip tanımları
│   │   ├── theme.js               # Tema sabitleri
│   │   ├── api.js                 # API konfigürasyonu
│   │   └── images.js              # Görsel yolları
│   │
│   ├── styles/                     # CSS mimarisi
│   │   ├── variables.css          # CSS custom properties
│   │   ├── base.css               # Temel stiller ve reset
│   │   ├── components.css         # Bileşen stilleri
│   │   ├── layout.css             # Layout ve grid sistemi
│   │   ├── brands.css             # Marka-specific stiller
│   │   └── animations.css         # Animasyon tanımları
│   │
│   ├── __tests__/                  # Test dosyaları
│   │   ├── RolexWatchForm.integration.test.js  # Integration tests
│   │   ├── formValidation.test.js              # Validation tests
│   │   ├── paymentHelpers.test.js              # Payment logic tests
│   │   ├── ErrorBoundary.test.js               # Error handling tests
│   │   └── ...
│   │
│   ├── __mocks__/                  # Test mock'ları
│   │   └── fileMock.js
│   │
│   ├── RolexWatchForm.js          # Ana uygulama bileşeni
│   ├── index.js                   # React app entry point
│   ├── index.css                  # Global stiller
│   └── setupTests.js              # Test konfigürasyonu
│
├── scripts/                        # Build ve utility script'leri
│   └── optimize-images.js         # Görsel optimizasyon
│
├── docs/                          # Dokümantasyon
├── backups/                       # Yedek dosyalar
├── coverage/                      # Test coverage raporları
├── build/                         # Production çıktısı
│
└── Konfigürasyon Dosyaları
    ├── package.json               # NPM dependencies ve scripts
    ├── tailwind.config.js         # Tailwind CSS konfigürasyonu
    ├── postcss.config.js          # PostCSS konfigürasyonu
    ├── jest.config.js             # Jest test konfigürasyonu
    ├── eslint.config.js           # ESLint kuralları
    ├── .prettierrc                # Prettier formatlaması
    └── .gitignore                 # Git ignore kuralları
```

### Mimari Prensipleri

- **Modular Design**: Her bileşen tek bir sorumluluğa sahip
- **Separation of Concerns**: UI, business logic ve data layer ayrımı
- **Reusability**: Ortak bileşenler ve hook'lar
- **Scalability**: Kolayca genişletilebilir yapı
- **Testing**: Her katman için test coverage
- **Performance**: Lazy loading ve memoization stratejileri

## 🚀 Kurulum ve Çalıştırma

### Sistem Gereksinimleri
- **Node.js**: >=18.0.0 (LTS önerilen)
- **npm**: >=8.0.0
- **RAM**: Minimum 4GB (Geliştirme için 8GB önerilen)
- **Disk**: ~500MB (node_modules dahil)

### Hızlı Başlangıç

```bash
# Repository'yi klonlayın
git clone <repository-url>
cd Teslim_Tutanak_Form_App

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm start
```

Uygulama otomatik olarak `http://localhost:3000` adresinde açılacaktır.

### Geliştirme Komutları

#### 🚀 Geliştirme
```bash
npm start                    # Development server (hot reload)
npm run build               # Production build oluştur
npm run eject               # React Scripts'ten çık (dikkatli!)
```

#### 🧪 Test ve Kalite
```bash
npm test                    # Test runner (watch mode)
npm run test:watch          # Test watch mode
npm run test:coverage       # Coverage raporu ile test
npm run test:ci             # CI ortamı için test
npm run test:all            # Tüm kalite kontrolleri
```

#### 🔍 Kod Kalitesi
```bash
npm run lint                # ESLint kontrolü
npm run lint:fix            # ESLint otomatik düzeltme
npm run format              # Prettier formatlaması
```

#### 📊 Analiz ve Optimizasyon
```bash
npm run analyze             # Bundle analizi
npm run analyze:css         # CSS bundle analizi
npm run bundle-stats        # HTML bundle raporu
npm run optimize:images     # Görsel optimizasyonu
```

#### 🔒 Güvenlik ve Bakım
```bash
npm run audit:check         # Güvenlik açığı kontrolü
npm run audit:fix           # Güvenlik açığı düzeltme
npm run security:update     # Güvenlik güncellemeleri
npm run clean:install       # Temiz yükleme
```

#### 💾 Yedekleme ve Kurtarma
```bash
npm run backup:restore      # package.json yedekten geri yükle
```

### Environment Variables

Proje, environment variable'ları destekler. `.env.example` dosyasından kopyalayarak `.env` dosyası oluşturabilirsiniz:

```bash
# API Configuration
REACT_APP_RMC_API_URL=your_api_url_here
REACT_APP_IMAGE_CDN_URL=your_cdn_url_here

# Development Settings
REACT_APP_DEBUG_MODE=false
REACT_APP_MOCK_DATA=false

# Production Settings
GENERATE_SOURCEMAP=false
```

### Performans İpuçları

#### Geliştirme Ortamı
- ESLint hataları geliştirme sırasında console'da gösterilmez (`ESLINT_NO_DEV_ERRORS=true`)
- Hot reload özelliği sayesinde değişiklikler anında görülür
- Chrome/Firefox DevTools React extension kullanımı önerilir

#### Production Build
- Otomatik görsel optimizasyonu (`prebuild` script)
- Bundle analizi için `npm run analyze` kullanın
- Source map'ler production'da devre dışı (güvenlik)

### Docker Desteği (Opsiyonel)

```bash
# Dockerfile oluşturun
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### IDE Konfigürasyonu

#### VS Code Önerilen Extensionlar
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens

#### Önerilen VS Code Settings
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## 📖 Kullanım Kılavuzu

### İş Akışı ve Form Doldurma

#### 1. Marka ve Kategori Seçimi
- **ROLEX**: Rolex saat ürünleri için (otomatik SAAT kategorisi)
- **TUDOR**: Tudor saat ürünleri için (otomatik SAAT kategorisi) 
- **CUFFLINKS**: Rolex aksesuar ürünleri için (otomatik AKSESUAR kategorisi)

#### 2. Müşteri Bilgileri
- **Müşteri Adı Soyadı**: Zorunlu alan, Türkçe karakter desteği
- **Teslim Edilen Kişi**: Opsiyonel alan, müşteriden farklı ise doldurulur

#### 3. Ürün Bilgileri ve RMC Analizi
- **RMC Kodu**: Ürün model kodunu girin
  - Sistem otomatik olarak CSV veritabanından ürün bilgilerini çeker
  - Ürün ailesi ve boyut otomatik doldurulur
  - Geçersiz RMC durumunda uyarı mesajı gösterilir
- **Seri Numarası**: 
  - Rolex: 8+ karakter zorunlu
  - Tudor: 7+ karakter zorunlu
  - Cufflinks: Seri numarası gerekmez
- **Ürün Kontrol Onayı**: Ürün fiziki kontrolünün yapıldığına dair onay

#### 4. Ürün Görsellemesi
- Gerçek zamanlı ürün görseli
- Marka logosundan ürün görsellerine geçiş animasyonu
- Görsel yükleme hataları için fallback mekanizması

#### 5. Ödeme Yönetimi
- **Çoklu Ödeme**: Sınırsız ödeme ekleme imkanı
- **Ödeme Türleri**: Havale, Nakit, Kredi Kartı, Çek
- **Para Birimleri**: TL, EUR, USD
- **Toplam Hesaplama**: Para birimi bazında otomatik hesaplama
- **Ödeme Validasyonu**: Tutar ve tarih kontrolü

#### 6. Belge Oluşturma ve Yazdırma
- **A4 Format**: Profesyonel belge düzeni (210mm x 297mm)
- **Türkçe Dilbilgisi**: Akıllı metin oluşturma (ünlü uyumu, ekler)
- **QR Kod**: Dijital doğrulama için otomatik QR kod
- **İmza Alanları**: Müşteri ve yetkili imza bölümleri
- **Yazdırma Optimizasyonu**: Print media CSS ile optimize edilmiş çıktı

### Hata Yönetimi

#### Form Validasyon Hataları
- **Kırmızı Çerçeve**: Geçersiz alanlar vurgulanır
- **Uyarı Mesajları**: Açıklayıcı hata metinleri
- **Önleyici Validasyon**: Gereksiz API çağrıları engellenir

#### Sistem Hataları
- **Error Boundary**: JavaScript hatalarını yakalar
- **Fallback UI**: Hata durumunda alternatif görünüm
- **Yeniden Deneme**: Otomatik ve manuel yeniden deneme seçenekleri

### Klavye Kısayolları

- **Ctrl/Cmd + Enter**: Form gönderimi (form geçerli ise)
- **Escape**: Modal kapatma
- **Tab**: Form elemanları arası geçiş
- **Ctrl/Cmd + P**: Tutanak yazdırma (tutanak görünümünde)

## 🏗️ Mimari ve Tasarım Desenleri

### React Hook Mimarisi

#### State Management Pattern
```javascript
// Custom hook ile state yönetimi
const useFormData = (initialData, brandContext) => {
  const [formData, setFormData] = useState(initialData);
  
  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);
  
  return { formData, setFormData, handleChange };
};
```

#### Composition Pattern
```javascript
// Bileşen kompozisyonu
const PaymentDetailModal = ({ onPaymentsChange }) => {
  const { payments, addPayment, updatePayment } = usePaymentModal();
  
  return (
    <PaymentForm>
      <PaymentCard />
      <TotalAmountCard />
      <ActionButton />
    </PaymentForm>
  );
};
```

### Performance Optimizasyon Stratejileri

#### Memoization Hierarchy
```javascript
// Component Level
const ProductModal = React.memo(({ product }) => {
  // Hook Level
  const calculatedPrice = useMemo(() => 
    calculateWithTax(product.price), [product.price]
  );
  
  // Handler Level
  const handleClick = useCallback(() => {
    onProductSelect(product.id);
  }, [product.id, onProductSelect]);
});
```

#### Lazy Loading Implementation
```javascript
// Route-based code splitting
const TutanakTemplate = lazy(() => import('./components/TutanakTemplate'));

// Component-based splitting
const ProductImageGallery = lazy(() => 
  import('./components/ProductImageGallery')
);
```

### Error Handling Architecture

#### Error Boundary Strategy
```javascript
// Global error boundary
<ErrorBoundary>
  <App />
</ErrorBoundary>

// Component-specific error boundaries
<ErrorBoundary fallback={<PaymentErrorFallback />}>
  <PaymentDetailModal />
</ErrorBoundary>
```

#### Graceful Degradation
```javascript
// Service fallback pattern
const fetchProductImage = async (rmc) => {
  try {
    return await primaryImageService(rmc);
  } catch {
    return await fallbackImageService(rmc);
  }
};
```

## 🎨 Özelleştirme ve Genişletme

### Marka Ekleme Rehberi

#### 1. Tip Tanımları
```javascript
// src/constants/types.js
export const BrandTypes = {
  ROLEX: 'rolex',
  TUDOR: 'tudor',
  NEW_BRAND: 'new_brand' // Yeni marka ekleme
};
```

#### 2. Tema Konfigürasyonu
```javascript
// src/constants/theme.js
export const BRAND_COLORS = {
  new_brand: '#your-brand-color',
};
```

#### 3. CSV Veri Yapısı
```csv
RMC,Brand,Family,Size,Category,Description
NBD001,new_brand,Collection,42mm,SAAT,New Brand Watch
```

#### 4. Görsel Entegrasyonu
```javascript
// src/constants/images.js
export const BRAND_IMAGES = {
  new_brand: {
    logo: '/images/new-brand-logo.png',
    baseUrl: 'https://cdn.newbrand.com/images/'
  }
};
```

### CSS Mimarisi Özelleştirme

#### Marka-Spesifik Stiller
```css
/* src/styles/brands.css */
.brand-new_brand {
  --brand-color: #your-color;
  --brand-accent: #your-accent;
}

.brand-new_brand .product-card {
  border-color: var(--brand-color);
}
```

#### Responsive Breakpoint Özelleştirme
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'brand-sm': '640px',
      'brand-md': '768px',
      'brand-lg': '1024px',
      'brand-xl': '1280px',
    }
  }
};
```

### API Entegrasyonu

#### RMC Servisi Genişletme
```javascript
// src/utils/newRmcService.js
export const createRmcService = (config) => {
  return {
    analyze: async (rmc) => {
      const response = await fetch(`${config.apiUrl}/rmc/${rmc}`);
      return await response.json();
    },
    validate: (rmc, brand) => {
      return rmc.length >= config.minLength[brand];
    }
  };
};
```

## 🔧 Gelişmiş Geliştirme Konuları

### Performance Monitoring

#### Bundle Analysis
```bash
# Bundle boyutu analizi
npm run analyze

# CSS analizi
npm run analyze:css

# Performans raporları
npm run bundle-stats
```

#### Runtime Performance
```javascript
// Performance tracking
const trackPerformance = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`${name}: ${end - start}ms`);
  return result;
};
```

### Testing Strategy

#### Test Pyramid
```
E2E Tests (Cypress)           [10%]
Integration Tests (RTL)       [20%]
Unit Tests (Jest)             [70%]
```

#### Test Utilities
```javascript
// src/__tests__/utils/testHelpers.js
export const createMockFormData = (overrides = {}) => ({
  musteri: 'Test Müşteri',
  rmc: 'TEST123',
  seri: '12345678',
  ...overrides
});
```

### Accessibility (a11y) Implementation

#### ARIA Patterns
```javascript
// Screen reader friendly form
<form role="form" aria-labelledby="form-title">
  <h2 id="form-title">Teslim Tutanağı</h2>
  <input
    aria-describedby="rmc-help"
    aria-required="true"
    aria-invalid={hasError}
  />
  <div id="rmc-help">RMC kodunu giriniz</div>
</form>
```

#### Keyboard Navigation
```javascript
// Keyboard event handling
const handleKeyDown = useCallback((e) => {
  if (e.key === 'Enter' && e.ctrlKey) {
    handleSubmit();
  }
  if (e.key === 'Escape') {
    closeModal();
  }
}, [handleSubmit, closeModal]);
```

### Güvenlik Best Practices

#### Input Sanitization
```javascript
// XSS Prevention
const sanitizeInput = (input) => {
  return input
    .replace(/[<>]/g, '')
    .trim()
    .substring(0, 100);
};
```

#### Content Security Policy
```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; img-src 'self' data: https:;">
```

### Browser Compatibility

#### Support Matrix
| Browser | Version | Support Level |
|---------|---------|---------------|
| Chrome  | 90+     | Full Support  |
| Firefox | 88+     | Full Support  |
| Safari  | 14+     | Full Support  |
| Edge    | 90+     | Full Support  |
| IE      | 11      | Not Supported |

#### Polyfill Strategy
```javascript
// src/polyfills.js
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
```

## 📊 Test Coverage ve Kalite Metrikleri

### Test Coverage Hedefleri
- **Branches**: ≥70%
- **Functions**: ≥70%
- **Lines**: ≥70%
- **Statements**: ≥70%

### Kod Kalite Skorları
```bash
# Test coverage raporu
npm run test:coverage

# Bundle analizi
npm run analyze

# ESLint skorları
npm run lint
```

### Performance Benchmarks
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Time to Interactive**: <3.0s
- **Bundle Size**: <500KB (gzipped)

## 🚀 Deployment ve Production

### Build Optimization
```bash
# Production build
npm run build

# Build analizi
npm run bundle-stats

# Görsel optimizasyonu
npm run optimize:images
```

### Environment Configuration
```bash
# Production environment variables
REACT_APP_ENV=production
GENERATE_SOURCEMAP=false
REACT_APP_VERSION=$npm_package_version
```

### CDN ve Caching Strategy
```javascript
// Service Worker for caching
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
name: CI/CD Pipeline
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:ci
      - run: npm run lint
      - run: npm run build
```

### Quality Gates
- ✅ All tests pass
- ✅ Coverage ≥70%
- ✅ No ESLint errors
- ✅ Build succeeds
- ✅ Bundle size check

## 🏢 Kurumsal Entegrasyon

### API Gateway Integration
```javascript
// API client configuration
const apiClient = createApiClient({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
  retries: 3
});
```

### Monitoring ve Logging
```javascript
// Error tracking integration
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

### Compliance ve Güvenlik
- **GDPR**: Veri koruma uyumluluğu
- **SOC 2**: Güvenlik standartları
- **OWASP**: Güvenlik en iyi uygulamaları
- **Audit Trail**: İşlem takibi ve loglama

## 📄 Lisans ve Kullanım Koşulları

Bu proje MIT lisansı altında lisanslanmıştır. Ticari ve kişisel kullanım için serbesttir.

### Lisans Detayları
```
MIT License

Copyright (c) 2024 Serdar Benli

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 👨‍💻 Geliştirici ve Ekip

### Lead Developer
**Serdar Benli**
- Senior Fullstack Developer
- React/Node.js Expert
- Performance Optimization Specialist
- 10+ years web development experience

### Teknik Expertise
- **Frontend**: React, TypeScript, Modern CSS
- **Backend**: Node.js, Express, Database Design
- **DevOps**: CI/CD, Docker, AWS
- **Quality**: Testing, Performance, Security

### İletişim
- **Email**: [email protected]
- **LinkedIn**: [linkedin.com/in/serdarbenli](https://linkedin.com/in/serdarbenli)
- **GitHub**: [github.com/serdarbenli](https://github.com/serdarbenli)

## 🤝 Katkıda Bulunma

### Katkı Süreci
1. **Fork**: Repository'yi fork edin
2. **Branch**: Feature branch oluşturun
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Develop**: Değişikliklerinizi yapın
4. **Test**: Testleri çalıştırın
   ```bash
   npm run test:ci
   npm run lint
   ```
5. **Commit**: Conventional commits kullanın
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
6. **Push**: Branch'inizi push edin
7. **PR**: Pull Request oluşturun

### Kod Standartları
- **ESLint**: Kod kalitesi kuralları
- **Prettier**: Kod formatlaması
- **Conventional Commits**: Commit mesaj formatı
- **Testing**: Yeni özellikler için test yazın

### İssue Raporlama
```markdown
**Bug Report Template**
- Environment: [Browser, OS, Node version]
- Steps to Reproduce: [Step by step]
- Expected Behavior: [What should happen]
- Actual Behavior: [What actually happens]
- Screenshots: [If applicable]
```

## 📞 Destek ve Topluluk

### Teknik Destek
- **GitHub Issues**: Bug raporu ve özellik istekleri
- **Stack Overflow**: Teknik sorular için `teslim-tutanak` etiketi
- **Email**: Direkt destek için iletişim

### Topluluk
- **Discord**: Geliştirici topluluğu
- **Reddit**: r/TeslimTutanak
- **Documentation**: Kapsamlı dokümantasyon ve örnekler

### Sık Sorulan Sorular (FAQ)

**Q: Hangi tarayıcılar destekleniyor?**
A: Modern tarayıcılar (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

**Q: Proje production-ready mi?**
A: Evet, kapsamlı test coverage ve güvenlik önlemleri ile production kullanımına hazır.

**Q: Mobil cihazlarda çalışıyor mu?**
A: Evet, responsive tasarım ile tüm cihazlarda optimize edilmiş deneyim.

**Q: Özelleştirme ne kadar esnek?**
A: Modular yapı sayesinde markalar, temalar ve iş kuralları kolayca özelleştirilebilir.

---

## 🌟 Özellikler ve Avantajlar

### ✨ Neden Bu Proje?
- **🏆 Production-Ready**: Kurumsal seviye kalite ve güvenlik
- **⚡ High Performance**: Optimize edilmiş bundle ve loading times
- **🧪 Test Coverage**: %70+ test coverage ile güvenilir kod
- **🌍 Internationalization**: Türkçe yerelleştirme ve çoklu dil desteği
- **📱 Responsive**: Tüm cihazlarda mükemmel kullanıcı deneyimi
- **🔒 Secure**: OWASP security best practices
- **♿ Accessible**: WCAG 2.1 AA uyumlu erişilebilirlik
- **🎨 Customizable**: Modular yapı ile kolay özelleştirme

### 🎯 Kullanım Senaryoları
- **Lüks Saat Satış**: Rolex, Tudor gibi premium markalar
- **Aksesuar Yönetimi**: Cufflinks ve diğer aksesuarlar
- **Belge Yönetimi**: PDF çıktı ve yazdırma sistemi
- **Stok Takibi**: RMC kodu ile ürün tanımlama
- **Ödeme Yönetimi**: Çoklu para birimi ve ödeme türü
- **Müşteri Hizmetleri**: Profesyonel belge oluşturma

*Bu uygulama, modern web teknolojileri ve enterprise-grade best practices kullanılarak geliştirilmiş, production-ready ve scalable bir çözümdür. Lüks saat ve aksesuar sektörünün ihtiyaçlarına özel olarak tasarlanmış olup, kurumsal kullanım için optimize edilmiştir.*

---

**📈 Version 1.0.0** | **🏗️ Built with React 18** | **🚀 Production Ready** | **📱 Mobile Optimized** | **🔒 Secure by Design**
