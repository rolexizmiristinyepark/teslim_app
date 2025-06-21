# Teslim Tutanağı Form Uygulaması

Bu uygulama, Rolex, Tudor ve Cufflinks ürünleri için profesyonel teslim tutanakları oluşturmak amacıyla geliştirilmiş modern bir React uygulamasıdır.

## 🚀 Özellikler

### Temel Özellikler
- **Çoklu Marka Desteği**: Rolex, Tudor ve Cufflinks ürünleri için özelleştirilmiş form alanları
- **Otomatik Model Tanıma**: RMC kodu girildikinde ürün ailesi ve boyutu otomatik olarak doldurulur
- **Çoklu Ödeme Yönetimi**: Farklı ödeme türleri ve para birimlerini destekler
- **Gerçek Zamanlı Validation**: Anlık form doğrulaması ve hata mesajları
- **Yazdırma Optimizasyonu**: Tutanaklar yazdırma için optimize edilmiş formatta görüntülenir
- **Responsive Tasarım**: Mobil ve masaüstü cihazlarda mükemmel görünüm

### Teknik Özellikler
- **Modern React**: Hooks, Context API ve functional components
- **Performance Optimizasyonu**: useCallback, useMemo ve React.memo kullanımı
- **Accessibility**: WCAG standartlarına uygun erişilebilirlik özellikleri
- **Toast Bildirimleri**: Kullanıcı geri bildirimi için gelişmiş bildirim sistemi
- **Type Safety**: TypeScript benzeri type definitions
- **Clean Architecture**: Modüler ve maintainable kod yapısı

## 🛠️ Teknoloji Stack

- **Frontend Framework**: React 18
- **Styling**: Tailwind CSS 3
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Build Tool**: Create React App

## 📁 Proje Yapısı

```
src/
├── components/          # Yeniden kullanılabilir bileşenler
│   ├── Toast.js
│   ├── FormInputs.js
│   ├── PaymentComponents.js
│   └── TutanakTemplate.js
├── constants/           # Sabit değerler
│   └── types.js
├── data/                # Veri dosyaları
│   └── RMC.csv
├── hooks/              # Custom React hooks
│   ├── useToast.js
│   ├── useFormData.js
│   ├── usePayments.js
│   └── useRmcAnalysis.js
├── images_cufflinks/   # Cufflinks görselleri
│   ├── A1015.png
│   ├── A1018.png
│   └── ...
├── utils/              # Yardımcı fonksiyonlar
│   ├── dateHelpers.js
│   ├── formValidation.js
│   ├── newRmcService.js
│   ├── numberHelpers.js
│   ├── paymentHelpers.js
│   └── stringHelpers.js
├── styles/             # Stil yardımcıları
│   └── styleHelpers.js
├── RolexWatchForm.js   # Ana form bileşeni
├── index.js            # Uygulamanın entry point'i
└── index.css           # Global stiller

public/
├── data/               # Public veri dosyaları
│   └── RMC.csv
└── index.html          # Ana HTML dosyası
```

## 🚀 Kurulum ve Çalıştırma

### Önkoşullar
- Node.js (v14 veya üzeri)
- npm (v6 veya üzeri)

### Kurulum Adımları

1. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

2. **Geliştirme sunucusunu başlatın:**
   ```bash
   npm start
   ```

3. **Tarayıcıda açın:**
   Uygulama otomatik olarak `http://localhost:3000` adresinde açılacaktır.

### Diğer Komutlar

- **Production build oluşturun:**
  ```bash
  npm run build
  ```

- **Testleri çalıştırın:**
  ```bash
  npm test
  ```

- **Kod kalitesi kontrolü:**
  ```bash
  npm run lint
  ```

- **Kod formatlaması:**
  ```bash
  npm run format
  ```

## 📖 Kullanım Kılavuzu

### Form Doldurma

1. **Marka Seçimi**: Rolex, Tudor veya Cufflinks markasını seçin
2. **Müşteri Bilgileri**: Müşteri adı soyadı (zorunlu) ve teslim edilen kişi bilgilerini girin
3. **Ürün Bilgileri**: 
   - RMC (Model kodu) girin - aile ve boyut otomatik doldurulacak
   - Seri numarasını girin (Cufflinks hariç)
4. **Ödeme Bilgileri**:
   - İstediğiniz kadar ödeme ekleyebilirsiniz
   - Her ödeme için tip, tutar, para birimi ve tarih seçin
   - Toplam tutar otomatik hesaplanır

### Tutanak Oluşturma

1. **Form Gönderimi**: "Tutanağı Oluştur ve Göster" butonuna tıklayın
2. **Önizleme**: Oluşturulan tutanağı inceleyin
3. **Düzenleme**: Gerekirse "Düzenle" butonu ile forma geri dönün
4. **Yazdırma**: "Yazdır" butonu ile doğrudan yazdırın veya PDF olarak kaydedin

## 🎨 Özelleştirme

### Marka Ekleme

Yeni bir marka eklemek için:

1. `src/constants/types.js` içindeki `BrandTypes` objesine yeni marka ekleyin
2. `src/constants/models.js` içinde marka için model veritabanı oluşturun
3. Ana form bileşeninde ilgili handler fonksiyonlarını ekleyin

### Stil Değişiklikleri

- Tailwind CSS sınıflarını `src/styles/styleHelpers.js` içinde merkezi olarak yönetebilirsiniz
- `tailwind.config.js` dosyasından global stilleri özelleştirebilirsiniz

## 🔧 Geliştirme Notları

### Performance

- Bileşenler `React.memo` ile optimize edilmiştir
- Event handler'lar `useCallback` ile memoize edilmiştir
- Expensive hesaplamalar `useMemo` ile cache'lenmektedir
- Model veritabanları Map yapısı ile O(1) arama sağlar

### Accessibility

- ARIA labels ve roles kullanımı
- Keyboard navigation desteği
- Screen reader uyumluluğu
- Color contrast compliance

### Browser Support

- Chrome (son 2 versiyon)
- Firefox (son 2 versiyon)
- Safari (son 2 versiyon)
- Edge (son 2 versiyon)

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakabilirsiniz.

## 👨‍💻 Geliştirici

**Serdar Benli**
- Senior Fullstack Developer
- Modern React ve performans optimizasyonu uzmanı

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add some amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 Destek

Herhangi bir sorun veya öneriniz için issue oluşturabilirsiniz.

---

*Bu uygulama, modern web teknolojileri ve best practice'ler kullanılarak geliştirilmiştir. Production-ready ve scalable yapısı ile profesyonel kullanım için uygundur.*
