import React, { memo, useMemo } from 'react';
import ProductInfoField from './ProductInfoField';
import { BrandTypes, CategoryTypes, BrandLabels } from '../../constants/types';
import { THEME } from '../../constants/theme';

/**
 * Cufflinks metinini temizler - CUFFLINKS kelimesini kaldırır
 */
const cleanCufflinksText = (text) => {
  if (!text || !text.includes('CUFFLINKS')) return text;

  const cufflinksIndex = text.indexOf('CUFFLINKS');
  if (cufflinksIndex === -1) return text;

  const afterCufflinks = text.substring(cufflinksIndex + 'CUFFLINKS'.length).trim();
  return afterCufflinks ? 'Cufflinks ' + afterCufflinks : 'Cufflinks';
};

/**
 * Ürün bilgilerini grid formatında gösteren optimize edilmiş component
 */
const ProductInfoGrid = memo(({
  formData,
  selectedBrand,
  selectedCategory,
  rmcAnalysisResult
}) => {
  const isRolexAccessory = selectedBrand === BrandTypes.ROLEX && selectedCategory === CategoryTypes.AKSESUAR;
  const showSerialNumber = selectedBrand !== BrandTypes.ROLEX || selectedCategory === CategoryTypes.SAAT;

  // Grid layout'u memoize et
  const gridClass = useMemo(() => {
    return isRolexAccessory ? THEME.legacy.grid.cufflinks : THEME.legacy.grid.watch;
  }, [isRolexAccessory]);

  // Marka adını memoize et
  const brandName = useMemo(() => {
    return selectedBrand === BrandTypes.ROLEX ? 'ROLEX' : BrandLabels[selectedBrand]?.toUpperCase() || 'N/A';
  }, [selectedBrand]);

  // Açıklama metnini memoize et
  const description = useMemo(() => {
    if (!rmcAnalysisResult?.DETAIL) return 'N/A';
    return isRolexAccessory ? cleanCufflinksText(rmcAnalysisResult.DETAIL) : rmcAnalysisResult.DETAIL;
  }, [rmcAnalysisResult?.DETAIL, isRolexAccessory]);

  // Cufflinks için 2x2 kompakt layout
  if (isRolexAccessory) {
    return (
      <div className="grid grid-cols-2 gap-3 print:gap-2">
        <ProductInfoField
          label="MARKA"
          value={brandName}
        />

        <ProductInfoField
          label="MODEL (RMC)"
          value={formData.rmc || 'N/A'}
        />

        <ProductInfoField
          label="FİYAT"
          value={rmcAnalysisResult?.PRICE || '-'}
          bgColor={rmcAnalysisResult?.PRICE ? 'bg-green-50' : 'bg-gray-50'}
          textColor={rmcAnalysisResult?.PRICE ? 'text-green-600' : 'text-gray-600'}
          valueColor={rmcAnalysisResult?.PRICE ? 'text-green-700' : 'text-gray-400'}
          printBorder={rmcAnalysisResult?.PRICE ? 'print:border print:border-gray-200' : 'print:border print:border-gray-200'}
        />

        <ProductInfoField
          label="AÇIKLAMA"
          value={description}
          valueColor={rmcAnalysisResult?.DETAIL ? 'text-black' : 'text-gray-400'}
        />
      </div>
    );
  }

  // Saat için 3 sütun layout
  return (
    <div className="space-y-3 print:space-y-2">
      <ProductInfoField
        label="MARKA"
        value={brandName}
      />

      <ProductInfoField
        label="MODEL (RMC)"
        value={formData.rmc || 'N/A'}
      />

      {showSerialNumber && (
        <ProductInfoField
          label="SERİ NO"
          value={formData.seri || 'N/A'}
        />
      )}

      {rmcAnalysisResult?.PRICE && (
        <ProductInfoField
          label="FİYAT"
          value={rmcAnalysisResult.PRICE}
          bgColor="bg-green-50"
          textColor="text-green-600"
          valueColor="text-green-700"
        />
      )}

      {rmcAnalysisResult?.FAMILY && (
        <ProductInfoField
          label="AİLE"
          value={rmcAnalysisResult.FAMILY.split(' ').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          ).join(' ')}
          bgColor="bg-blue-50"
          textColor="text-blue-600"
          valueColor="text-blue-800"
        />
      )}

      {rmcAnalysisResult?.SIZE && showSerialNumber && (
        <ProductInfoField
          label="KASA ÇAPI"
          value={rmcAnalysisResult.SIZE + 'mm'}
        />
      )}

      {rmcAnalysisResult?.DIAL && (
        <ProductInfoField
          label="KADRAN"
          value={rmcAnalysisResult.DIAL}
        />
      )}

      {rmcAnalysisResult?.BRACELET && (
        <ProductInfoField
          label="BİLEZİK KODU"
          value={rmcAnalysisResult.BRACELET}
        />
      )}

      {rmcAnalysisResult?.DETAIL && (
        <ProductInfoField
          label="AÇIKLAMA"
          value={rmcAnalysisResult.DETAIL}
        />
      )}
    </div>
  );
});

ProductInfoGrid.displayName = 'ProductInfoGrid';

export default ProductInfoGrid;
