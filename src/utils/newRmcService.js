/**
 * Optimize Edilmiş RMC Detayları Servisi
 * - Production-ready debug logging
 * - Cache optimizasyonu
 * - Memoization ile parse optimizasyonu
 * - Error handling iyileştirmesi
 */

// Veri önbelleği
let rmcDataCache = null;
const parseCache = new Map(); // Parse sonuçları için cache

// Configuration
const CONFIG = {
  CSV_PATH: process.env.REACT_APP_RMC_CSV_PATH || `${process.env.PUBLIC_URL}/data/RMC.csv`,
  IS_DEV: process.env.NODE_ENV === 'development',
  MAX_CACHE_SIZE: 100, // Parse cache boyut limiti
};

// Debug logger - sadece development ortamında çalışır
const debugLog = (...args) => {
  if (CONFIG.IS_DEV) {
    // eslint-disable-next-line no-console
    console.log('[RMC DEBUG]', ...args);
  }
};

/**
 * Cache'i temizler - Geliştirme amaçlı
 */
export const clearCache = () => {
  rmcDataCache = null;
  parseCache.clear();
  debugLog('RMC cache ve parse cache temizlendi');
};

/**
 * Cache durumunu kontrol eder
 */
export const getCacheStatus = () => {
  return {
    isCached: rmcDataCache !== null,
    itemCount: rmcDataCache ? rmcDataCache.length : 0,
    parseCacheSize: parseCache.size,
  };
};

/**
 * Parse cache'i boyut limitinde tutar
 */
const maintainCacheSize = () => {
  if (parseCache.size > CONFIG.MAX_CACHE_SIZE) {
    const firstKey = parseCache.keys().next().value;
    parseCache.delete(firstKey);
  }
};

/**
 * CSV header'ları normalize eder ve validate eder
 */
const validateAndNormalizeHeaders = (headers) => {
  const requiredHeaders = [
    'BRAND',
    'CATEGORY',
    'RMC',
    'DETAIL',
    'SIZE',
    'DIAL',
    'BRACELET',
    'FAMILY',
    'PRICE',
  ];
  const normalizedHeaders = headers.map((header) =>
    header.trim().toUpperCase()
  );

  const missingHeaders = requiredHeaders.filter(
    (header) => !normalizedHeaders.includes(header)
  );
  if (missingHeaders.length > 0) {
    debugLog("Eksik CSV header'ları:", missingHeaders);
  }

  return normalizedHeaders;
};

/**
 * CSV satırını optimize edilmiş şekilde parse eder
 */
const parseRow = (values, headers) => {
  const row = {};
  headers.forEach((header, index) => {
    const value = (values[index] || '').trim();

    // Boş string'leri null yap
    if (value === '') {
      row[header] = null;
      return;
    }

    // FAMILY field'ını özel işle
    if (header === 'FAMILY') {
      row[header] = value.trim();
    }
    // PRICE field'ını temizle
    else if (header === 'PRICE') {
      row[header] = value.replace(/€\s*/g, '€').trim();
    }
    // Diğer field'lar
    else {
      row[header] = value;
    }
  });

  return row;
};

/**
 * CSV dosyasını optimize edilmiş şekilde parse eder
 * @param {string} csvText - CSV içeriği
 * @returns {Array} - Parse edilmiş veriler
 */
const parseCSV = (csvText) => {
  // Cache kontrolü
  const cacheKey = csvText.length.toString() + csvText.substring(0, 100);
  if (parseCache.has(cacheKey)) {
    debugLog("Parse cache'den veri kullanılıyor");
    return parseCache.get(cacheKey);
  }

  try {
    // BOM karakterini temizle
    const cleanedText = csvText.replace(/^\uFEFF/, '');

    // Satırlara böl
    const lines = cleanedText.split('\n').filter((line) => line.trim()); // Boş satırları filtrele

    if (lines.length < 2) {
      throw new Error('CSV dosyası geçersiz: Yeterli veri yok');
    }

    // Başlık satırını al ve validate et
    const headers = validateAndNormalizeHeaders(lines[0].split(';'));

    debugLog('CSV başlıkları:', headers);

    // Veri satırlarını paralel olarak işle (büyük dosyalar için)
    const data = [];
    const batchSize = 100; // Batch işleme boyutu

    for (let i = 1; i < lines.length; i += batchSize) {
      const batch = lines.slice(i, i + batchSize);

      batch.forEach((line) => {
        const values = line.split(';').map((value) => value.trim());

        // Satırda yeterli değer yoksa atla
        if (values.length < headers.length) return;

        const row = parseRow(values, headers);
        data.push(row);
      });
    }

    debugLog(`CSV parse edildi. Toplam kayıt: ${data.length}`);

    // Cache'e kaydet
    maintainCacheSize();
    parseCache.set(cacheKey, data);

    return data;
  } catch (error) {
    debugLog('CSV parsing hatası:', error);
    throw new Error(`CSV parse hatası: ${error.message}`);
  }
};

/**
 * CSV dosyasını yükler ve parse eder - Cache ile optimize edilmiş
 * @param {boolean} forceRefresh - Cache'i bypass et
 * @returns {Promise<Array>} - RMC verileri
 */
export const loadRmcData = async (forceRefresh = false) => {
  try {
    // Cache kontrol et
    if (rmcDataCache && !forceRefresh) {
      debugLog(
        "Cache'den veri kullanılıyor, kayıt sayısı:",
        rmcDataCache.length
      );
      return rmcDataCache;
    }

    debugLog('CSV dosyası yükleniyor...');

    // Fetch optimizasyonu: cache busting sadece development'ta
    const timestamp = CONFIG.IS_DEV ? new Date().getTime() : '';
    const url = timestamp ? `${CONFIG.CSV_PATH}?v=${timestamp}` : CONFIG.CSV_PATH;

    const response = await fetch(url, {
      cache: CONFIG.IS_DEV ? 'no-cache' : 'default', // Production'da cache kullan
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvText = await response.text();

    // CSV'yi parse et
    const parsedData = parseCSV(csvText);

    // Cache'e kaydet
    rmcDataCache = parsedData;

    debugLog(`RMC verileri başarıyla yüklendi: ${parsedData.length} kayıt`);

    return parsedData;
  } catch (error) {
    debugLog('RMC verileri yüklenirken hata:', error);
    throw error; // Hataları yukarı fırlat, caller'ın handle etmesini sağla
  }
};

/**
 * RMC koduna göre tam eşleşme arar - Optimize edilmiş
 * @param {string} rmcCode - Aranacak RMC kodu
 * @returns {Promise<Object|null>} - Bulunan kayıt veya null
 */
export const findExactRmcMatch = async (rmcCode) => {
  try {
    if (!rmcCode?.trim()) return null;

    const cleanRmc = rmcCode.trim().toUpperCase();
    const data = await loadRmcData();

    debugLog(`RMC arama: "${cleanRmc}", veri seti boyutu: ${data.length}`);

    // Map kullanarak O(1) arama (büyük data setleri için)
    if (data.length > 1000) {
      if (!rmcDataCache._indexMap) {
        rmcDataCache._indexMap = new Map();
        data.forEach((item) => {
          if (item.RMC) {
            rmcDataCache._indexMap.set(item.RMC.trim().toUpperCase(), item);
          }
        });
        debugLog('RMC index map oluşturuldu');
      }

      const match = rmcDataCache._indexMap.get(cleanRmc);
      if (match) {
        debugLog("Index map'ten eşleşme bulundu:", match);
      }
      return match || null;
    }

    // Küçük data setleri için linear search
    const match = data.find((item) => {
      if (!item.RMC) return false;
      const itemRmc = item.RMC.trim().toUpperCase();
      return itemRmc === cleanRmc;
    });

    if (match) {
      debugLog("Linear search'te eşleşme bulundu:", match);
    }

    return match || null;
  } catch (error) {
    debugLog('RMC tam eşleşme arama hatası:', error);
    throw error;
  }
};

/**
 * RMC baz koduna göre tüm varyasyonları bulur - Optimize edilmiş
 * @param {string} baseRmc - Baz RMC kodu (tire öncesi kısım)
 * @returns {Promise<Array>} - Bulunan varyasyonlar
 */
export const findRmcVariations = async (baseRmc) => {
  try {
    if (!baseRmc?.trim()) return [];

    const cleanBaseRmc = baseRmc.trim().toUpperCase();
    const data = await loadRmcData();

    // Filter işlemini optimize et
    const variations = data.filter((item) => {
      if (!item.RMC) return false;
      return item.RMC.split('-')[0] === cleanBaseRmc;
    });

    debugLog(`${cleanBaseRmc} için ${variations.length} varyasyon bulundu`);
    return variations;
  } catch (error) {
    debugLog('RMC varyasyon arama hatası:', error);
    throw error;
  }
};

/**
 * RMC kodunu analiz eder ve mümkün olan en iyi eşleşmeyi bulur - Optimize edilmiş
 * @param {string} rmcInput - Kullanıcının girdiği RMC
 * @returns {Promise<Object>} - Bulunan bilgiler
 */
export const analyzeRmcInput = async (rmcInput) => {
  try {
    if (!rmcInput?.trim()) {
      return { found: false, data: null, variations: [] };
    }

    const cleanInput = rmcInput.trim().toUpperCase();
    debugLog('RMC Input analizi başlıyor:', cleanInput);

    // Önce tam eşleşme dene
    const exactMatch = await findExactRmcMatch(cleanInput);
    if (exactMatch) {
      debugLog('Tam eşleşme bulundu');
      return {
        found: true,
        type: 'exact',
        data: exactMatch,
        variations: [],
      };
    }

    debugLog('Tam eşleşme bulunamadı, varyasyon araması başlıyor...');

    // Varyasyon araması
    let baseRmc = cleanInput;
    if (cleanInput.includes('-')) {
      baseRmc = cleanInput.split('-')[0];
    }

    const variations = await findRmcVariations(baseRmc);

    if (variations.length > 0) {
      debugLog(`${variations.length} varyasyon bulundu`);
      return {
        found: true,
        type: 'variations',
        data: variations[0],
        variations: variations,
      };
    }

    debugLog('Hiçbir eşleşme bulunamadı');
    return { found: false, data: null, variations: [] };
  } catch (error) {
    debugLog('RMC analiz hatası:', error);
    return { found: false, data: null, variations: [], error: error.message };
  }
};

// Diğer fonksiyonlar (değişiklik olmadan)
export const getModelsByBrand = async (brand) => {
  try {
    if (!brand) return [];
    const data = await loadRmcData();
    return data.filter(
      (item) => item.BRAND && item.BRAND.toUpperCase() === brand.toUpperCase()
    );
  } catch (error) {
    debugLog('Marka modelleri getirme hatası:', error);
    return [];
  }
};

export const getModelsByFamily = async (family) => {
  try {
    if (!family) return [];
    const data = await loadRmcData();
    return data.filter(
      (item) =>
        item.FAMILY && item.FAMILY.toUpperCase() === family.toUpperCase()
    );
  } catch (error) {
    debugLog('Aile modelleri getirme hatası:', error);
    return [];
  }
};

export const getAllFamilies = async () => {
  try {
    const data = await loadRmcData();
    const families = [
      ...new Set(data.map((item) => item.FAMILY).filter((family) => family)),
    ];
    return families.sort();
  } catch (error) {
    debugLog('Aile listesi getirme hatası:', error);
    return [];
  }
};

export const searchRmcData = async (searchTerm) => {
  try {
    if (!searchTerm?.trim()) return [];

    const term = searchTerm.trim().toLowerCase();
    const data = await loadRmcData();

    return data.filter((item) => {
      return (
        (item.RMC && item.RMC.toLowerCase().includes(term)) ||
        (item.FAMILY && item.FAMILY.toLowerCase().includes(term)) ||
        (item.DIAL && item.DIAL.toLowerCase().includes(term)) ||
        (item.BRACELET && item.BRACELET.toLowerCase().includes(term)) ||
        (item.BRAND && item.BRAND.toLowerCase().includes(term))
      );
    });
  } catch (error) {
    debugLog('RMC arama hatası:', error);
    return [];
  }
};

// RMC Service default export - Optimized
const RmcServiceOptimized = {
  loadRmcData,
  findExactRmcMatch,
  findRmcVariations,
  analyzeRmcInput,
  getModelsByBrand,
  getModelsByFamily,
  getAllFamilies,
  searchRmcData,
  clearCache,
  getCacheStatus,
};

export default RmcServiceOptimized;
