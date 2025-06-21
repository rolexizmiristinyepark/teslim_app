/**
 * RMC kodunun temel formatını kontrol eder
 * CSV'deki RMC ile tam eşleşme kontrolü newRmcService.js'de yapılır
 * Burada sadece boş olup olmadığı kontrol edilir
 *
 * @param {string} rmc - Kontrol edilecek RMC kodu
 * @returns {boolean} RMC girilmiş ise true, değilse false
 */
export const isValidRmcFormat = (rmc) => {
  if (!rmc || typeof rmc !== 'string') {
    return false;
  }

  // Sadece boş olmadığını kontrol et
  const cleanRmc = rmc.trim();
  return cleanRmc.length > 0;
};

/**
 * RMC kodunun tam girilip girilmediğini kontrol eder
 * Tam RMC formatı: XXXXXXXX-XXXX (8 karakter + tire + 4 karakter)
 * CSV'deki RMC ile tam eşleşme kontrolü newRmcService.js'de yapılır
 *
 * @param {string} rmc - Kontrol edilecek RMC kodu
 * @returns {boolean} RMC tam formatında ise true, değilse false
 */
export const isCompleteRmc = (rmc) => {
  if (!rmc || typeof rmc !== 'string') {
    return false;
  }

  const cleanRmc = rmc.trim().toUpperCase();

  // Tam RMC formatı: XXXXXXXX-XXXX (8 karakter + tire + 4 karakter)
  const rmcPattern = /^[A-Z0-9]{8}-[A-Z0-9]{4}$/;
  return rmcPattern.test(cleanRmc);
};

/**
 * String işleme yardımcı fonksiyonları
 * Bu dosya, uygulamada kullanılan metin işleme fonksiyonlarını içerir
 * Özellikle Türkçe karakterlerin doğru işlenmesi için optimize edilmiştir
 */

/**
 * Türkçe karakterleri destekleyerek metni büyük harfe çevirir
 * JavaScript'in standard toUpperCase() metodu Türkçe karakterleri (ı, ğ, ü, ş, ö, ç)
 * bazen yanlış işleyebilir, bu fonksiyon Türkçe locale'u kullanarak doğru dönüşüm sağlar
 *
 * @param {string} text - Büyük harfe çevrilecek metin
 * @returns {string} Türkçe karakterlerle uyumlu büyük harf metni
 *
 * Örnek kullanım:
 * toTurkishUpperCase('ışık şehir öğrenci') → 'IŞIK ŞEHİR ÖĞRENCİ'
 */
export const toTurkishUpperCase = (text) => {
  if (!text) return '';
  return text.toLocaleUpperCase('tr-TR');
};

/**
 * Türkçe karakterleri destekleyerek metni küçük harfe çevirir
 * JavaScript'in standard toLowerCase() metodu Türkçe karakterleri (İ, Ğ, Ü, Ş, Ö, Ç)
 * bazen yanlış işleyebilir, bu fonksiyon Türkçe locale'u kullanarak doğru dönüşüm sağlar
 *
 * @param {string} text - Küçük harfe çevrilecek metin
 * @returns {string} Türkçe karakterlerle uyumlu küçük harf metni
 *
 * Örnek kullanım:
 * toTurkishLowerCase('IŞIK ŞEHİR ÖĞRENCİ') → 'ışık şehir öğrenci'
 */
export const toTurkishLowerCase = (text) => {
  if (!text) return '';
  return text.toLocaleLowerCase('tr-TR');
};

/**
 * Güvenli ve benzersiz ID üretir
 * Bu fonksiyon öncelikle modern tarayıcıların crypto.randomUUID() API'sini kullanmaya çalışır
 * Eğer bu API desteklenmiyorsa, güvenli bir fallback metodu kullanır
 * Üretilen ID'ler form elemanları ve dinamik listeler için kullanılır
 *
 * @returns {string} Benzersiz ID string'i
 *
 * Çıktı örnekleri:
 * 'f47ac10b-58cc-4372-a567-0e02b2c3d479' (crypto.randomUUID)
 * 'k0lm4n5op6' (fallback method)
 */
export const generateId = () => {
  // Modern tarayıcılarda desteklenen crypto.randomUUID() metodunu kontrol et
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback method - timestamp ve random kombinasyonu
  // Bu method eski tarayıcılarda da çalışır ve oldukça güvenilirdir
  // 36'lık sayı sistemi kullanarak kısa ve okunabilir ID'ler üretir
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 15);
};

/**
 * Türkçe dil kurallarına göre bir isme uygun yönelme eki (-e/-a) ekler
 * Bu fonksiyon, Türkçedeki ünlü uyumu kurallarını dikkate alarak
 * bir ismin sonuna doğru yönelme ekini getirir
 *
 * Türkçe Yönelme Eki Kuralları:
 * 1. İnce ünlüler (e, i, ö, ü) ile biten kelimeler: 'ye eki alır
 * 2. Kalın ünlüler (a, ı, o, u) ile biten kelimeler: 'ya eki alır
 * 3. Sessiz harfle biten kelimeler:
 *    - Son ünlü harf ince ise (e, i, ö, ü): 'e eki alır
 *    - Son ünlü harf kalın ise (a, ı, o, u): 'a eki alır
 * 4. Özel isimlerde kesme işareti kullanılır (boşluksuz)
 *
 * @param {string} name - Yönelme eki eklenecek isim
 * @returns {string} İsim + doğru yönelme eki (kesme işaretiyle)
 *
 * Örnek kullanımlar:
 * addDirectionSuffix('Ali') → 'Ali'ye'
 * addDirectionSuffix('Ahmet') → 'Ahmet'e'
 * addDirectionSuffix('Ayşe') → 'Ayşe'ye'
 * addDirectionSuffix('Fatma') → 'Fatma'ya'
 * addDirectionSuffix('Serdar') → 'Serdar'a'
 * addDirectionSuffix('Özgür') → 'Özgür'e'
 * addDirectionSuffix('Oğuz') → 'Oğuz'a'
 * addDirectionSuffix('Sıdıka') → 'Sıdıka'ya'
 */
export const addDirectionSuffix = (name) => {
  if (!name || typeof name !== 'string') {
    return name || '';
  }

  const trimmedName = name.trim();
  if (!trimmedName) return '';

  // Türkçe karakterleri düzgün işlemek için özel dönüşüm
  const turkishToLower = (char) => {
    if (char === 'İ') return 'i';
    if (char === 'I') return 'ı';
    return char.toLocaleLowerCase('tr-TR');
  };

  // Son karakteri al ve Türkçe uyumlu küçük harfe çevir
  const lastChar = turkishToLower(trimmedName.slice(-1));
  const lastWord = trimmedName.split(' ').pop(); // Son kelimeyi al

  // Sesli harfler
  const vowels = ['a', 'ı', 'o', 'u', 'e', 'i', 'ö', 'ü'];
  const hardVowels = ['a', 'ı', 'o', 'u']; // Kalın sesliler
  const softVowels = ['e', 'i', 'ö', 'ü']; // İnce sesliler

  // Son kelimedeki tüm sesli harfleri bul
  const vowelsInWord = [];
  for (let i = 0; i < lastWord.length; i++) {
    const lowerChar = turkishToLower(lastWord[i]);
    if (vowels.includes(lowerChar)) {
      vowelsInWord.push(lowerChar);
    }
  }

  // Son sesli harfi belirle
  const lastVowel = vowelsInWord[vowelsInWord.length - 1];

  // KURAL 1: Sesli harfle biten isimler
  if (vowels.includes(lastChar)) {
    // Kalın ünlüler (a, ı, o, u) ile bitenler → 'ya
    if (hardVowels.includes(lastChar)) {
      return trimmedName + "'ya";
    }
    // İnce ünlüler (e, i, ö, ü) ile bitenler → 'ye
    else if (softVowels.includes(lastChar)) {
      return trimmedName + "'ye";
    }
  }
  // KURAL 2: Sessiz harfle biten isimler
  else {
    if (!lastVowel) {
      // Hiç sesli harf yoksa (çok nadir), varsayılan olarak 'e
      return trimmedName + "'e";
    }

    // Son sesli harf kalın ise → 'a
    if (hardVowels.includes(lastVowel)) {
      return trimmedName + "'a";
    }
    // Son sesli harf ince ise → 'e
    else if (softVowels.includes(lastVowel)) {
      return trimmedName + "'e";
    }
  }

  // Varsayılan (ulaşılmaması gerek)
  return trimmedName + "'e";
};

/**
 * Türkçe dil kurallarına göre bir metinde bitisik yazılmıs kelimeleri düzeltir
 * Bu fonksiyon, belirli kelime kombinasyonlarının arasına bosluk ekler
 * Özellikle template'lerde dinamik değişkenlerin diğer kelimelerle yanlıs birştirilmesi durumlarında kullanılır
 *
 * @param {string} text - Düzeltilecek metin
 * @returns {string} Boslukları düzeltilmis metin
 *
 * Örnek kullanımlar:
 * fixWordSpacing('aitsaatin') → 'ait saatin'
 * fixWordSpacing('numaralısaatin') → 'numaralı saatin'
 * fixWordSpacing('numaralıSAAT') → 'numaralı SAAT'
 * fixWordSpacing('kol düğmesiın') → 'kol düğmesinin'
 * fixWordSpacing('kol düğmesiin bedeli') → 'kol düğmesinin bedeli'
 * fixWordSpacing('SERDAR BENLİ\'e') → 'SERDAR BENLİ\'ye'
 * fixWordSpacing('Müşteri cari hesabına') → 'Müşteri Cari Hesabına'
 */
export const fixWordSpacing = (text) => {
  if (!text || typeof text !== 'string') {
    return text || '';
  }

  try {
    // Bitişik yazılmış kelime çiftlerini düzelt - sadece basit string replace kullan
    let correctedText = text;

    // Saat/aksesuar ile ilişkili bitişik yazımlar - case insensitive
    const replacements = [
      { from: 'aitsaat', to: 'ait saat' },
      { from: 'aitsaatin', to: 'ait saatin' },
      { from: 'AITSAAT', to: 'AIT SAAT' },
      { from: 'AITSAATIN', to: 'AIT SAATIN' },
      { from: 'numaralısaat', to: 'numaralı saat' },
      { from: 'numaralısaatin', to: 'numaralı saatin' },
      { from: 'NUMARALISAAT', to: 'NUMARALI SAAT' },
      { from: 'NUMARALISAATIN', to: 'NUMARALI SAATIN' },
      { from: 'numaralıSAAT', to: 'numaralı SAAT' },
      { from: 'BELGELERİsaat', to: 'BELGELERİ saat' },
      { from: 'BELGELERİsaatin', to: 'BELGELERİ saatin' },

      // Aksesuar ile ilişkili bitişik yazımlar
      { from: 'numaralıaksesuar', to: 'numaralı aksesuar' },
      { from: 'numaralıaksesuarın', to: 'numaralı aksesuarın' },
      { from: 'NUMARALIAKSESUAR', to: 'NUMARALI AKSESUAR' },
      { from: 'NUMARALIAKSESUARıN', to: 'NUMARALI AKSESUARıN' },
      { from: 'numaralıAKSESUAR', to: 'numaralı AKSESUAR' },
      { from: 'BELGELERİaksesuar', to: 'BELGELERİ aksesuar' },
      { from: 'BELGELERİaksesuarın', to: 'BELGELERİ aksesuarın' },

      // Cufflinks için özel düzenlemeler
      { from: ',aksesuar', to: ' aksesuar' },
      { from: ',aksesuarın', to: ' aksesuarın' },
      { from: ',AKSESUAR', to: ' AKSESUAR' },
      { from: ',AKSESUARıN', to: ' AKSESUARıN' },

      // Kol düğmesi ile ilgili düzeltmeler
      { from: 'düğmesiın', to: 'düğmesinin' },
      { from: 'düğmesiin', to: 'düğmesinin' },
      { from: 'cari hesabına', to: 'Cari Hesabına' },
      { from: 'CARI HESABıNA', to: 'CARI HESABıNA' },
    ];

    // Her replacement'ı uygula
    for (const replacement of replacements) {
      if (correctedText.includes(replacement.from)) {
        correctedText = correctedText
          .split(replacement.from)
          .join(replacement.to);
      }
    }

    return correctedText;
  } catch {
    // Hata durumunda orijinal metni döndür
    return text;
  }
};
