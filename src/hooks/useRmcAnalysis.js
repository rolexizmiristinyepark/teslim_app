import { useState, useCallback } from 'react';

import { BrandTypes, CategoryTypes } from '../constants/types';
import { loadRmcService } from '../utils/lazyUtils';
import { toTurkishUpperCase } from '../utils/stringHelpers';

/**
 * Marka kodlarını CSV'deki BRAND değerleriyle eşleştir
 */
const BRAND_MAPPING = {
  [BrandTypes.ROLEX]: 'ROLEX',
  [BrandTypes.TUDOR]: 'TUDOR',
};

/**
 * Kategori kodlarını CSV'deki CATEGORY değerleriyle eşleştir
 */
const CATEGORY_MAPPING = {
  [CategoryTypes.SAAT]: 'SAAT',
  [CategoryTypes.AKSESUAR]: 'AKSESUAR',
};

export const useRmcAnalysis = (
  selectedBrand,
  selectedCategory,
  setRmcMessage,
  setRmcAnalysisResult
) => {
  const [isLoadingRmc, setIsLoadingRmc] = useState(false);

  /**
   * Loading durumunu manuel olarak başlat
   */
  const startRmcLoading = useCallback(() => {
    setIsLoadingRmc(true);
  }, []);

  /**
   * Loading durumunu manuel olarak durdur
   */
  const stopRmcLoading = useCallback(() => {
    setIsLoadingRmc(false);
  }, []);

  /**
   * RMC analiz fonksiyonu - Sadece tam eşleşme
   * Girilen RMC kodunu CSV'den tam eşleşme ile kontrol eder
   * Marka/kategori uyumluluğunu kontrol eder
   */
  const analyzeRmc = useCallback(
    async (rmcInput) => {
      if (!rmcInput || !rmcInput.trim()) {
        setRmcMessage({ text: '', type: '' });
        setRmcAnalysisResult(null);
        setIsLoadingRmc(false);
        return {
          rmc: '',
          aile: '',
          size: '',
          kadran: '',
          bilezik: '',
          fiyat: '',
          description: '',
        };
      }

      setIsLoadingRmc(true);
      setRmcMessage({ text: '', type: '' });
      setRmcAnalysisResult(null);

      try {
        // RMC Service'i lazy load et
        const rmcService = await loadRmcService();
        
        // Sadece tam eşleşme ara
        const data = await rmcService.findExactRmcMatch(rmcInput);

        if (data) {
          // eslint-disable-next-line no-console
          console.log('RMC tam eşleşme bulundu:', data);

          // Marka kontrolü
          const expectedBrand = BRAND_MAPPING[selectedBrand];
          const foundBrand = data.BRAND;

          if (
            foundBrand &&
            expectedBrand &&
            foundBrand.toUpperCase() !== expectedBrand.toUpperCase()
          ) {
            const brandNames = { ROLEX: 'Rolex', TUDOR: 'Tudor' };
            const selectedBrandName =
              brandNames[expectedBrand] || expectedBrand;
            const foundBrandName =
              brandNames[foundBrand.toUpperCase()] || foundBrand;

            setRmcMessage({
              text: `Bu RMC kodu ${foundBrandName} markasına ait. Şu anda ${selectedBrandName} seçili.`,
              type: 'error',
            });
            setRmcAnalysisResult(data);
            // Marka hatası olsa da CSV verileri gösterilebilir
            return {
              rmc: toTurkishUpperCase(rmcInput),
              aile: data.FAMILY || '',
              size: data.SIZE || '',
              kadran: data.DIAL || '',
              bilezik: data.BRACELET || '',
              fiyat: data.PRICE || '',
              description: data.DETAIL || '',
            };
          }

          // Kategori kontrolü (sadece ROLEX için)
          const expectedCategory = selectedCategory
            ? CATEGORY_MAPPING[selectedCategory]
            : null;
          const foundCategory = data.CATEGORY;

          if (
            selectedBrand === BrandTypes.ROLEX &&
            expectedCategory &&
            foundCategory &&
            foundCategory.toUpperCase() !== expectedCategory.toUpperCase()
          ) {
            const categoryNames = { SAAT: 'Saat', AKSESUAR: 'Aksesuar' };
            const selectedCategoryName =
              categoryNames[expectedCategory] || expectedCategory;
            const foundCategoryName =
              categoryNames[foundCategory.toUpperCase()] || foundCategory;

            setRmcMessage({
              text: `Bu RMC kodu ${foundCategoryName} kategorisine ait. Şu anda ${selectedCategoryName} kategorisi seçili.`,
              type: 'error',
            });
            setRmcAnalysisResult(data);
            // Kategori hatası olsa da CSV verileri gösterilebilir
            return {
              rmc: toTurkishUpperCase(rmcInput),
              aile: data.FAMILY || '',
              size: data.SIZE || '',
              kadran: data.DIAL || '',
              bilezik: data.BRACELET || '',
              fiyat: data.PRICE || '',
              description: data.DETAIL || '',
            };
          }

          // Başarılı eşleşme
          // eslint-disable-next-line no-console
          console.log('✅ RMC başarılı eşleşme:', data);
          setRmcMessage({ text: '', type: '' });
          setRmcAnalysisResult(data);

          // CSV'den gelen bilgileri kullan
          return {
            rmc: toTurkishUpperCase(rmcInput),
            aile: data.FAMILY || '',
            size: data.SIZE || '',
            kadran: data.DIAL || '',
            bilezik: data.BRACELET || '',
            fiyat: data.PRICE || '',
            description: data.DETAIL || '',
          };
        } else {
          // RMC bulunamadı
          // eslint-disable-next-line no-console
          console.log('RMC bulunamadı:', rmcInput);
          setRmcMessage({
            text: 'RMC kodu bulunamadı. Lütfen doğru kodu girdiğinizden emin olun.',
            type: 'error',
          });
          setRmcAnalysisResult(null);

          return {
            rmc: toTurkishUpperCase(rmcInput),
            aile: '',
            size: '',
            kadran: '',
            bilezik: '',
            fiyat: '',
            description: '',
          };
        }
      } catch (error) {
        console.error('RMC analiz hatası:', error);
        setRmcMessage({
          text: 'RMC analizi sırasında bir hata oluştu.',
          type: 'error',
        });
        setRmcAnalysisResult(null);

        return {
          rmc: toTurkishUpperCase(rmcInput),
          aile: '',
          size: '',
          kadran: '',
          bilezik: '',
          fiyat: '',
          description: '',
        };
      } finally {
        setIsLoadingRmc(false);
      }
    },
    [selectedBrand, selectedCategory, setRmcMessage, setRmcAnalysisResult]
  );

  return {
    isLoadingRmc,
    analyzeRmc,
    startRmcLoading,
    stopRmcLoading,
  };
};
