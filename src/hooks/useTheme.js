import { useMemo, useEffect } from 'react';

import {
  THEME,
  getBrandColor,
  getInputThemeClass,
} from '../constants/theme';
import { BrandTypes, CategoryTypes } from '../constants/types';

/**
 * Basitleştirilmiş tema yönetimi hook'u
 * Sadece aktif marka border rengini günceller
 */
export const useTheme = (selectedBrand, selectedCategory) => {
  const themeData = useMemo(() => {
    // Input class belirleme
    const inputClass = getInputThemeClass(selectedBrand, selectedCategory);

    // Brand color belirleme
    const brandColor = getBrandColor(selectedBrand, selectedCategory);

    // Aktif border rengini belirle - hep aynı renk
    const activeBorderColor = THEME.colors.rolex.blue; // tüm input'lar için aynı renk

    return {
      inputClass,
      brandColor,
      activeBorderColor,
    };
  }, [selectedBrand, selectedCategory]);

  // CSS variable'ı güncelle - sadece border rengi ve body class'ları
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // CSS variable güncelle
    root.style.setProperty('--active-border-color', themeData.activeBorderColor);

    // Body'den önceki class'ları temizle
    body.classList.remove(
      'brand-rolex', 'brand-tudor',
      'category-saat', 'category-aksesuar'
    );

    // Yeni class'ları ekle
    if (selectedBrand === BrandTypes.ROLEX) {
      body.classList.add('brand-rolex');
      if (selectedCategory === CategoryTypes.SAAT) {
        body.classList.add('category-saat');
      } else if (selectedCategory === CategoryTypes.AKSESUAR) {
        body.classList.add('category-aksesuar');
      }
    } else if (selectedBrand === BrandTypes.TUDOR) {
      body.classList.add('brand-tudor');
    }
  }, [themeData.activeBorderColor, selectedBrand, selectedCategory]);

  return themeData;
};
