import React, { memo } from 'react';
import { CUFFLINKS_IMAGES, ROLEX_IMAGE_BASE_URL, IMAGE_FALLBACK_CONFIG, IMAGE_CONTAINER_SIZES } from '../../constants/images';
import { BrandTypes, CategoryTypes } from '../../constants/types';
import OptimizedImage from '../OptimizedImage';

/**
 * Ürün görseli render eden optimize edilmiş component
 * Cufflinks ve saat görselleri için farklı fallback'ler
 */
const ProductImageDisplay = memo(({
  formData,
  selectedBrand,
  selectedCategory
}) => {
  const isRolexAccessory = selectedBrand === BrandTypes.ROLEX && selectedCategory === CategoryTypes.AKSESUAR;
  const isRolexWatch = selectedBrand === BrandTypes.ROLEX && selectedCategory === CategoryTypes.SAAT;

  // Görsel type'ına göre config seç
  const imageType = isRolexAccessory ? 'cufflinks' : 'watch';
  const fallbackConfig = IMAGE_FALLBACK_CONFIG[imageType];
  const containerConfig = IMAGE_CONTAINER_SIZES[imageType];

  // Fallback icon component
  const FallbackIcon = () => (
    <div className={`${containerConfig.container} flex items-center justify-center text-gray-400`}>
      <div className="text-center">
        <div className={`${fallbackConfig.width} ${fallbackConfig.printWidth} bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2 print:mb-2`}>
          <svg className={`${fallbackConfig.iconSize} ${fallbackConfig.printIconSize} text-gray-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="print:text-sm">{fallbackConfig.alt}</p>
      </div>
    </div>
  );

  // Cufflinks görseli
  if (isRolexAccessory) {
    const cufflinksImage = formData.rmc ? CUFFLINKS_IMAGES[formData.rmc] : null;

    return (
      <div className="flex justify-center items-center print:justify-center print:items-center">
        <div className={containerConfig.maxWidth}>
          <div className="p-2 print:p-1">
            {cufflinksImage ? (
              <OptimizedImage
                src={cufflinksImage}
                alt={`${formData.rmc} Cufflinks`}
                className={`${containerConfig.container} object-contain mx-auto`}
                lazy={true}
                fallback={null}
                onError={() => console.log('Cufflinks image failed to load')}
              />
            ) : (
              <FallbackIcon />
            )}
          </div>
        </div>
      </div>
    );
  }

  // Rolex saat görseli
  if (isRolexWatch && formData.rmc) {
    const watchImageUrl = `${ROLEX_IMAGE_BASE_URL}${formData.rmc.toLowerCase()}`;

    return (
      <div className="flex justify-center items-center print:justify-center print:items-center">
        <div className={containerConfig.maxWidth}>
          <div className="p-2 print:p-1">
            <OptimizedImage
              src={watchImageUrl}
              alt={`${formData.rmc} Model`}
              className={`${containerConfig.container} object-contain mx-auto`}
              lazy={true}
              fallback={null}
              onError={() => console.log('Watch image failed to load')}
            />
          </div>
        </div>
      </div>
    );
  }

  // Varsayılan fallback
  return (
    <div className="flex justify-center items-center print:justify-center print:items-center">
      <div className={containerConfig.maxWidth}>
        <div className="p-2 print:p-1">
          <FallbackIcon />
        </div>
      </div>
    </div>
  );
});

ProductImageDisplay.displayName = 'ProductImageDisplay';

export default ProductImageDisplay;
