/**
 * Uygulama genelinde kullanılan sabit değerlerin tanımlamaları
 * Bu dosya, type-like constant'ları ve şirket bilgilerini içerir
 * Uygulamanın çeşitli yerlerinde tutarlı değer kullanımını sağlar
 */

// Ödeme türleri - Desteklenen ödeme yöntemlerini tanımlar
export const PaymentTypes = {
  HAVALE: 'havale',
  KREDI_KARTI: 'kredi_karti',
  LINK: 'link',
  CARI: 'cari',
  NAKIT: 'nakit',
};

// Para birimi türleri - Desteklenen para birimlerini tanımlar
export const CurrencyTypes = {
  TL: 'TL',
  EUR: 'EUR',
  USD: 'USD',
};

// Marka türleri - Desteklenen saat markalarını tanımlar
export const BrandTypes = {
  ROLEX: 'rolex',
  TUDOR: 'tudor',
};

// Kategori türleri - Ürün kategorilerini tanımlar
export const CategoryTypes = {
  SAAT: 'saat',
  AKSESUAR: 'aksesuar',
};

// Para birimi etiketleri ve sembolleri - UI'da gösterim için kullanılır
export const CurrencySymbols = {
  [CurrencyTypes.TL]: '₺',
  [CurrencyTypes.EUR]: '€',
  [CurrencyTypes.USD]: '$',
};

// Ödeme türleri için Türkçe etiketler - UI'da gösterim için kullanılır
export const PaymentTypeLabels = {
  [PaymentTypes.HAVALE]: 'Havale',
  [PaymentTypes.KREDI_KARTI]: 'Kredi Kartı',
  [PaymentTypes.LINK]: 'Link',
  [PaymentTypes.CARI]: 'Cari',
  [PaymentTypes.NAKIT]: 'Nakit',
};

// Marka etiketleri - UI'da gösterim için kullanılır
export const BrandLabels = {
  [BrandTypes.ROLEX]: 'ROLEX',
  [BrandTypes.TUDOR]: 'TUDOR',
};

// Kategori etiketleri - UI'da gösterim için kullanılır
export const CategoryLabels = {
  [CategoryTypes.SAAT]: 'SAAT',
  [CategoryTypes.AKSESUAR]: 'AKSESUAR',
};

// IBAN listesi - Havale ödemeleri için kullanılan banka hesap bilgileri
export const IbanList = {
  [CurrencyTypes.TL]: 'TR760006200010000006292310',
  [CurrencyTypes.EUR]: 'TR540006200010000009083008',
  [CurrencyTypes.USD]: 'TR810006200010000009083007',
};

// Şirket bilgileri - Teslim eden taraf için sabit bilgiler
export const CompanyInfo = {
  name: 'KÜLAHÇIOĞLU DIŞ TİCARET VE SANAYİ LİMİTED ŞİRKETİ',
  address:
    'Talatpaşa Bulvarı Kültür Mahallesi Alayunt Apt. No:7 Kapı No:3 35220 Konak/İzmir',
  phone: '02322030305',
  email: 'muhasebe@kulahcioglu.com',
  taxOffice: 'Hasan Tahsin',
  taxNumber: '6050284231',
  branch: 'İstinyepark-06',
};

// Şirket bilgilerinin kısaltılmış versiyonu - cari ödeme metinleri için
export const CompanyShortName = 'KÜLAHÇIOĞLU DIŞ TİCARET VE SAN. LTD. ŞTİ.';

// Marka renkleri - Input arkaplanları için soft renkler
export const BrandColors = {
  [BrandTypes.ROLEX]: {
    primary: '#145c3a',
    soft: '#f0f9f4',
  },
  [BrandTypes.TUDOR]: {
    primary: '#be0300',
    soft: '#fef2f2',
  },
};

// Kategori renkleri - Aksesuar (Cufflinks) için mavi tonları
export const CategoryColors = {
  [CategoryTypes.SAAT]: {},
  [CategoryTypes.AKSESUAR]: {
    primary: '#003057',
    soft: '#eff6ff',
  },
};
