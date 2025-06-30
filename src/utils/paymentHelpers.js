/**
 * Ödeme ile ilgili yardımcı fonksiyonlar
 * Bu dosya, ödeme detaylarını formatlamak ve özel metinler oluşturmak için kullanılır
 */

// models.js dosyası kaldırıldı, artık newRmcService kullanılıyor
import {
  PaymentTypes,
  PaymentTypeLabels,
  CurrencySymbols,
  IbanList,
  CompanyShortName,
  BrandTypes,
  CategoryTypes,
} from '../constants/types';

import { formatNumber } from './numberHelpers';

/**
 * Türkçe yönelme eki (e/a) oluşturucu - Geliştirilmiş versiyon
 * Bu fonksiyon Türkçe dilbilgisi kurallarına göre doğru yönelme ekini belirler
 * Sadece son sesli harfe bakarak değil, Türkçe ses uyumu kurallarını uygulayarak
 *
 * Türkçe Ses Uyumu Kuralları:
 * - Kalın ünlüler (a, ı, o, u) → "a" yönelme eki
 * - İnce ünlüler (e, i, ö, ü) → "e" yönelme eki
 * - Ünlü ile biten kelimelere "y" harfi eklenir (Ali'ye, Bora'ya)
 *
 * @param {string} word - Yönelme eki eklenecek kelime
 * @returns {string} Uygun yönelme eki (ye, ya, e, a)
 */
const getTurkishDirectiveSuffix = (word) => {
  try {
    if (!word) return 'ye';

    // BENLİ özel durumu - her zaman 'ye' döndür
    if (word.toUpperCase().includes('BENLİ')) {
      return 'ye';
    }

    // Kelimeyi küçük harfe çevir ve Türkçe karakterleri normalize et
    const normalizedWord = word
      .toLowerCase()
      .replace(/ç/g, 'c')
      .replace(/ş/g, 's')
      .replace(/ğ/g, 'g');

    // Son harf ünlü mü kontrol et
    const lastChar = normalizedWord.charAt(normalizedWord.length - 1);
    const isLastCharVowel = 'aeiouıüöü'.includes(lastChar);

    // Kelimedeki son sesli harfi bul
    const vowels = 'aeiouıüöü';
    let lastVowel = null;

    // Kelimeyi sondan başa doğru tara
    for (let i = normalizedWord.length - 1; i >= 0; i--) {
      if (vowels.includes(normalizedWord[i])) {
        lastVowel = normalizedWord[i];
        break;
      }
    }

    // Eğer sesli harf bulunamazsa varsayılan olarak 'ye' döndür
    if (!lastVowel) return 'ye';

    // Ses uyumu kurallarına göre yönelme ekini belirle
    const kalinSesliler = ['a', 'ı', 'o', 'u'];
    const inceSesliler = ['e', 'i', 'ö', 'ü'];

    // Kelime ünlü ile bitiyorsa "y" harfi ekle
    if (isLastCharVowel) {
      if (kalinSesliler.includes(lastVowel)) {
        return 'ya';
      } else {
        return 'ye';
      }
    } else {
      // Kelime ünsüz ile bitiyorsa
      // Özel durum: BENLİ gibi isimler
      if (
        normalizedWord.includes('benli') ||
        inceSesliler.includes(lastVowel)
      ) {
        return 'ye';
      } else if (kalinSesliler.includes(lastVowel)) {
        return 'a';
      } else {
        // Varsayılan durum
        return 'ye';
      }
    }
  } catch {
    // Hata durumunda varsayılan değer
    return 'ye';
  }
};

/**
 * Cari ödeme için özel metin oluşturucu - Güncellenmiş versiyon
 * Bu fonksiyon, "Ödeme 1:" prefixi olmadan direkt cari ödeme metnini döndürür
 * Ayrıca cufflinks için model numarası yerine direkt açıklama kullanır
 *
 * @param {Object} payment - Ödeme objesi
 * @param {Object} formData - Form verileri
 * @param {string} selectedBrand - Seçili marka
 * @returns {string} Cari ödeme metni
 */
export const generateCariPaymentText = (
  payment,
  formData,
  selectedBrand,
  selectedCategory
) => {
  try {
    // Marka belirleme
    const marka = selectedBrand === BrandTypes.ROLEX ? 'Rolex' : 'Tudor';

    // Ürün tipi belirleme
    const urunTipi =
      selectedBrand === BrandTypes.ROLEX &&
      selectedCategory === CategoryTypes.AKSESUAR
        ? 'kol düğmesi'
        : 'saat';

    // Yönelme eki hesaplama - iyileştirilmiş fonksiyon kullanılacak
    const yonelmeEki = getTurkishDirectiveSuffix(formData.musteri);

    // Tutar formatı
    const tutar = `${formatNumber(payment.amount) || '0'} ${CurrencySymbols[payment.currency] || payment.currency}`;

    // Model/açıklama belirleme
    let modelBilgisi;
    if (
      selectedBrand === BrandTypes.ROLEX &&
      selectedCategory === CategoryTypes.AKSESUAR
    ) {
      // Aksesuar için form datasındaki description kullan
      if (formData.description) {
        // "A1018 CUFFLINKS CROWN" formatından "Cufflinks Crown" formatına çevir
        const parts = formData.description.split(' ');
        if (parts.length >= 3) {
          // İlk parça (A1018) ve CUFFLINKS kelimesini atla, geri kalanı al
          const desc = parts.slice(2).join(' ');
          modelBilgisi = desc
            ? 'Cufflinks ' +
              desc.charAt(0).toUpperCase() +
              desc.slice(1).toLowerCase()
            : 'Cufflinks';
        } else {
          modelBilgisi = 'Cufflinks';
        }
      } else {
        modelBilgisi = 'Cufflinks';
      }
    } else {
      // Rolex/Tudor saatler için model kodu kullan
      modelBilgisi = formData.rmc || 'N/A';
    }

    return `${CompanyShortName} tarafından ${marka} marka ${modelBilgisi} ${selectedBrand === BrandTypes.ROLEX && selectedCategory === CategoryTypes.AKSESUAR ? '' : 'ürün koduna sahip, ' + (formData.seri || 'N/A') + ' seri numaralı, ' + (formData.size || 'N/A') + ' çapında ' + (formData.aile || 'N/A') + ' ailesine ait'} ${urunTipi}nin satışı Alıcı-Müşteri ${formData.musteri || 'N/A'}'${yonelmeEki} gerçekleştirilmiş, ancak ${urunTipi}nin bedeli olan KDV dahil ${tutar} Alıcı-Müşteri tarafından ${CompanyShortName}'NE ödenmemiş, işbu ${tutar} Alıcı ${formData.musteri || 'N/A'} Müşteri Cari Hesabına borç kaydedilmiştir.`;
  } catch {
    // Hata durumunda varsayılan metin
    return `${CompanyShortName} tarafından satış gerçekleştirilmiş, tutarı müşteri cari hesabına borcu olarak işlenmektedir.`;
  }
};

/**
 * Havale ödeme metni oluşturucu
 * @param {Object} payment - Ödeme objesi
 * @returns {string} Havale ödeme metni
 */
export const generateHavalePaymentText = (payment) => {
  const iban = IbanList[payment.currency] || 'N/A';
  const tutar = `${formatNumber(payment.amount) || '0'} ${CurrencySymbols[payment.currency] || payment.currency}`;

  return `${payment.date || '__.__.____'} tarihinde IBAN: ${iban} nolu hesaba ${tutar} ödeme yapılmıştır.`;
};

/**
 * Kredi kartı ödeme metni oluşturucu
 * @param {Object} payment - Ödeme objesi
 * @returns {string} Kredi kartı ödeme metni
 */
export const generateKrediKartiPaymentText = (payment) => {
  const tutar = `${formatNumber(payment.amount) || '0'} ${CurrencySymbols[payment.currency] || payment.currency}`;
  const odemeYontemi =
    payment.type === PaymentTypes.KREDI_KARTI ? 'Kredi Kartı' : 'Link';

  return `${payment.date || '__.__.____'} tarihinde ${odemeYontemi} ile ${tutar} ödeme yapılmıştır.`;
};

/**
 * Link ödeme metni oluşturucu (kredi kartı ile aynı format)
 * @param {Object} payment - Ödeme objesi
 * @returns {string} Link ödeme metni
 */
export const generateLinkPaymentText = (payment) => {
  return generateKrediKartiPaymentText(payment);
};

/**
 * Nakit ödeme metni oluşturucu
 * @param {Object} payment - Ödeme objesi
 * @returns {string} Nakit ödeme metni
 */
export const generateNakitPaymentText = (payment) => {
  const tutar = `${formatNumber(payment.amount) || '0'} ${CurrencySymbols[payment.currency] || payment.currency}`;

  return `${payment.date || '__.__.____'} tarihinde nakit olarak ${tutar} ödeme yapılmıştır.`;
};

/**
 * Ödeme detayları metni oluşturucu - Güncellenmiş versiyon
 * Cari ödeme türü için "Ödeme X:" prefix'i kaldırılmış
 * Her ödeme türü için uygun formatı kullanır
 *
 * @param {Array} payments - Ödeme listesi
 * @param {Object} formData - Form verileri (cari ödeme için gerekli)
 * @param {string} selectedBrand - Seçili marka (cari ödeme için gerekli)
 * @returns {string} Formatlanmış ödeme detayları metni
 */
export const generatePaymentDetailsText = (
  payments,
  formData,
  selectedBrand,
  selectedCategory
) => {
  try {
    return payments
      .map((payment, index) => {
        // Yıldız sayısını indekse göre belirliyoruz (index + 1 kadar yıldız)
        const stars = Array(index + 1)
          .fill('*')
          .join('');
        let paymentText = '';

        switch (payment.type) {
          case PaymentTypes.CARI:
            // Cari ödeme için direkt metni kullan, yıldız prefix'i ekle
            paymentText = `${stars} ${generateCariPaymentText(payment, formData, selectedBrand, selectedCategory)}`;
            break;
          case PaymentTypes.HAVALE:
            paymentText = `${stars} ${generateHavalePaymentText(payment)}`;
            break;
          case PaymentTypes.KREDI_KARTI:
            paymentText = `${stars} ${generateKrediKartiPaymentText(payment)}`;
            break;
          case PaymentTypes.LINK:
            paymentText = `${stars} ${generateLinkPaymentText(payment)}`;
            break;
          case PaymentTypes.NAKIT:
            paymentText = `${stars} ${generateNakitPaymentText(payment)}`;
            break;
          default:
            // Varsayılan format
            paymentText = `${stars} ${PaymentTypeLabels[payment.type] || payment.type}: ${formatNumber(payment.amount) || '0'} ${CurrencySymbols[payment.currency] || payment.currency}`;
            if (payment.date) {
              paymentText += ` (${payment.date})`;
            }
            break;
        }

        return paymentText;
      })
      .join('\n\n');
  } catch {
    // Hata durumunda basit bir mesaj
    return 'Bu ödeme için ayrıntılar görüntülenemedi.';
  }
};

/**
 * Toplam tutarları hesaplama fonksiyonu
 * Her para birimi için ayrı ayrı toplar
 * @param {Array} payments - Ödeme listesi
 * @returns {{string: string, byCurrency: Object}} Formatlanmış toplam tutar string'i ve para birimi bazlı tutarlar
 */
export const calculateTotalAmounts = (payments) => {
  const totals = {
    TL: 0,
    EUR: 0,
    USD: 0,
    GBP: 0,
    CHF: 0,
  };

  payments.forEach((payment) => {
    const amount =
      parseFloat(payment.amount?.replace(/\./g, '').replace(',', '.')) || 0;
    if (Object.prototype.hasOwnProperty.call(totals, payment.currency)) {
      totals[payment.currency] += amount;
    }
  });

  // Sıfır olmayan tutarları filtrele
  const nonZeroTotals = {};
  Object.entries(totals).forEach(([currency, amount]) => {
    if (amount > 0) {
      nonZeroTotals[currency] = amount;
    }
  });

  // String formatı oluştur
  const totalParts = [];
  Object.entries(nonZeroTotals).forEach(([currency, amount]) => {
    totalParts.push(
      `${amount.toLocaleString('tr-TR')} ${CurrencySymbols[currency]}`
    );
  });

  const totalString = totalParts.length > 0 ? totalParts.join(' + ') : '0 ₺';

  return {
    string: totalString,
    byCurrency: nonZeroTotals,
  };
};
