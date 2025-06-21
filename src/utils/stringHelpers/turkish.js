/**
 * Turkish Language Utilities
 * Gelişmiş Türkçe dil işlemleri - ihtiyaç duyulduğunda lazy load edilir
 */

/**
 * Türkçe dil kurallarına göre bir isme uygun yönelme eki (-e/-a) ekler
 * Karmaşık Türkçe gramer kuralları
 * @param {string} name - Yönelme eki eklenecek isim
 * @returns {string} İsim + doğru yönelme eki (kesme işaretiyle)
 */
export const addDirectionSuffix = (name) => {
  console.log('🇹🇷 Processing Turkish direction suffix for:', name);
  
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

  let suffix = '';

  // KURAL 1: Sesli harfle biten isimler
  if (vowels.includes(lastChar)) {
    // Kalın ünlüler (a, ı, o, u) ile bitenler → 'ya
    if (hardVowels.includes(lastChar)) {
      suffix = "'ya";
    }
    // İnce ünlüler (e, i, ö, ü) ile bitenler → 'ye
    else if (softVowels.includes(lastChar)) {
      suffix = "'ye";
    }
  }
  // KURAL 2: Sessiz harfle biten isimler
  else {
    if (!lastVowel) {
      // Hiç sesli harf yoksa (çok nadir), varsayılan olarak 'e
      suffix = "'e";
    } else {
      // Son sesli harf kalın ise → 'a
      if (hardVowels.includes(lastVowel)) {
        suffix = "'a";
      }
      // Son sesli harf ince ise → 'e
      else if (softVowels.includes(lastVowel)) {
        suffix = "'e";
      }
    }
  }

  const result = trimmedName + suffix;
  console.log('✅ Turkish suffix result:', result);
  return result;
};

/**
 * Türkçe dil kurallarına göre metinde bitişik yazılmış kelimeleri düzeltir
 * Karmaşık kelime düzeltme algoritması
 * @param {string} text - Düzeltilecek metin
 * @returns {string} Boşlukları düzeltilmiş metin
 */
export const fixWordSpacing = (text) => {
  console.log('🔧 Fixing Turkish word spacing for:', text);
  
  if (!text || typeof text !== 'string') {
    return text || '';
  }

  try {
    // Bitişik yazılmış kelime çiftlerini düzelt
    let correctedText = text;

    // Saat/aksesuar ile ilişkili bitişik yazımlar - case insensitive
    const replacements = [
      // Saat düzeltmeleri
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

      // Aksesuar düzeltmeleri
      { from: 'numaralıaksesuar', to: 'numaralı aksesuar' },
      { from: 'numaralıaksesuarın', to: 'numaralı aksesuarın' },
      { from: 'NUMARALIAKSESUAR', to: 'NUMARALI AKSESUAR' },
      { from: 'NUMARALIAKSESUARıN', to: 'NUMARALI AKSESUARıN' },
      { from: 'numaralıAKSESUAR', to: 'numaralı AKSESUAR' },
      { from: 'BELGELERİaksesuar', to: 'BELGELERİ aksesuar' },
      { from: 'BELGELERİaksesuarın', to: 'BELGELERİ aksesuarın' },

      // Cufflinks özel düzenlemeleri
      { from: ',aksesuar', to: ' aksesuar' },
      { from: ',aksesuarın', to: ' aksesuarın' },
      { from: ',AKSESUAR', to: ' AKSESUAR' },
      { from: ',AKSESUARıN', to: ' AKSESUARıN' },

      // Genel düzeltmeler
      { from: 'düğmesiın', to: 'düğmesinin' },
      { from: 'düğmesiin', to: 'düğmesinin' },
      { from: 'cari hesabına', to: 'Cari Hesabına' },
      { from: 'CARI HESABıNA', to: 'CARI HESABıNA' },
    ];

    let fixedCount = 0;

    // Her replacement'ı uygula
    for (const replacement of replacements) {
      if (correctedText.includes(replacement.from)) {
        correctedText = correctedText
          .split(replacement.from)
          .join(replacement.to);
        fixedCount++;
      }
    }

    console.log(`✅ Fixed ${fixedCount} word spacing issues`);
    return correctedText;
  } catch (error) {
    console.warn('⚠️ Error in fixWordSpacing:', error);
    // Hata durumunda orijinal metni döndür
    return text;
  }
};

/**
 * Gelişmiş Türkçe büyük harf dönüşümü
 * Özel isimler ve kurallar dahil
 * @param {string} text - Dönüştürülecek metin
 * @param {Object} options - Dönüşüm seçenekleri
 * @returns {string} Dönüştürülmüş metin
 */
export const advancedTurkishUpperCase = (text, options = {}) => {
  const { preserveProperNouns = true, handleAbbreviations = true } = options;
  
  if (!text) return '';
  
  console.log('🔤 Advanced Turkish upper case conversion:', text);
  
  let result = text.toLocaleUpperCase('tr-TR');
  
  // Özel isimler korunacaksa
  if (preserveProperNouns) {
    // Yaygın özel isimleri tanı ve koru
    const properNouns = ['Rolex', 'Tudor', 'Cufflinks', 'GMT', 'Master'];
    
    properNouns.forEach(noun => {
      const upperNoun = noun.toLocaleUpperCase('tr-TR');
      if (result.includes(upperNoun)) {
        // Eğer tamamen büyük harfse, orijinal case'i koru
        result = result.replace(new RegExp(upperNoun, 'g'), noun);
      }
    });
  }
  
  console.log('✅ Advanced conversion result:', result);
  return result;
};

/**
 * Gelişmiş Türkçe küçük harf dönüşümü
 * Özel durumlar ve kurallar dahil
 * @param {string} text - Dönüştürülecek metin
 * @param {Object} options - Dönüşüm seçenekleri
 * @returns {string} Dönüştürülmüş metin
 */
export const advancedTurkishLowerCase = (text, options = {}) => {
  const { preserveProperNouns = true } = options;
  
  if (!text) return '';
  
  console.log('🔤 Advanced Turkish lower case conversion:', text);
  
  let result = text.toLocaleLowerCase('tr-TR');
  
  // Özel isimler korunacaksa
  if (preserveProperNouns) {
    // Yaygın özel isimlerin ilk harfini büyük tut
    const properNouns = ['rolex', 'tudor', 'cufflinks'];
    
    properNouns.forEach(noun => {
      const capitalizedNoun = noun.charAt(0).toLocaleUpperCase('tr-TR') + noun.slice(1);
      result = result.replace(new RegExp(`\\b${noun}\\b`, 'gi'), capitalizedNoun);
    });
  }
  
  console.log('✅ Advanced conversion result:', result);
  return result;
};

/**
 * Türkçe metin analizi
 * Metin hakkında dilbilimsel bilgiler
 * @param {string} text - Analiz edilecek metin
 * @returns {Object} Analiz sonuçları
 */
export const analyzeTurkishText = (text) => {
  if (!text) return null;
  
  console.log('📊 Analyzing Turkish text:', text);
  
  const words = text.trim().split(/\s+/);
  const vowels = ['a', 'ı', 'o', 'u', 'e', 'i', 'ö', 'ü'];
  const hardVowels = ['a', 'ı', 'o', 'u'];
  const softVowels = ['e', 'i', 'ö', 'ü'];
  
  let vowelCount = 0;
  let hardVowelCount = 0;
  let softVowelCount = 0;
  let consonantCount = 0;
  
  // Her karakteri analiz et
  for (const char of text.toLowerCase()) {
    if (vowels.includes(char)) {
      vowelCount++;
      if (hardVowels.includes(char)) hardVowelCount++;
      if (softVowels.includes(char)) softVowelCount++;
    } else if (/[a-zçğıöşü]/.test(char)) {
      consonantCount++;
    }
  }
  
  const analysis = {
    wordCount: words.length,
    characterCount: text.length,
    vowelCount,
    consonantCount,
    hardVowelCount,
    softVowelCount,
    vowelHarmony: hardVowelCount > 0 && softVowelCount > 0 ? 'mixed' : 
                   hardVowelCount > softVowelCount ? 'hard' : 'soft',
    averageWordLength: words.length > 0 ? text.replace(/\s/g, '').length / words.length : 0,
    complexity: vowelCount + consonantCount > 50 ? 'high' : 
                vowelCount + consonantCount > 20 ? 'medium' : 'low'
  };
  
  console.log('📋 Turkish text analysis complete:', analysis);
  return analysis;
};