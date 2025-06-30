import React, { memo, useMemo } from 'react';
import { BrandTypes, CategoryTypes } from '../../constants/types';
import { addDirectionSuffix, fixWordSpacing } from '../../utils/stringHelpers';

/**
 * Yasal metin kısmını gösteren optimize edilmiş component
 */
const LegalTextSection = memo(({
  formData,
  selectedBrand,
  selectedCategory
}) => {
  // Yasal metni memoize et - sadece gerekli değerler değiştiğinde yeniden hesapla
  const legalText = useMemo(() => {
    const isRolexAccessory = selectedBrand === BrandTypes.ROLEX && selectedCategory === CategoryTypes.AKSESUAR;
    const productType = isRolexAccessory ? 'aksesuarın' : 'saatin';
    const productType2 = isRolexAccessory ? 'aksesuar' : 'saat';
    const customerName = formData.musteri || 'N/A';
    const recipientName = addDirectionSuffix(formData.teslimEdilenKisi || 'N/A');

    const text = `İşbu belge ile; Yukarıda belirtilen özelliklere sahip ${productType} tüm yasal ve ticari belgeleriyle birlikte eksiksiz olarak hazırlandığı, müşteri talimatı doğrultusunda seri numarası, kodu ve fiziksel özelliklerinin kontrol edilip doğrulandığı, herhangi bir eksiklik veya hasar bulunmadığının tespit edildiği, Söz konusu ${productType2} ve tüm belgelerinin asıl sahibi ${customerName} adına, vekili/temsilcisi ${recipientName} eksiksiz olarak teslim edildiği beyan edilir.`;

    return fixWordSpacing(text);
  }, [formData.musteri, formData.teslimEdilenKisi, selectedBrand, selectedCategory]);

  return (
    <div className="mb-8 text-xs text-gray-600">
      <p>{legalText}</p>
    </div>
  );
});

LegalTextSection.displayName = 'LegalTextSection';

export default LegalTextSection;
