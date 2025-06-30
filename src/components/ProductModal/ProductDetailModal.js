/**
 * Ürün Detay Modal Bileşeni
 * Ürün görseli, detayları ve onay checkbox'ını içerir
 */

import { BrandTypes, CategoryTypes } from '../../constants/types';
import { getProductImageClass } from '../../utils/brandHelpers';

const ProductDetailModal = ({
  formData,
  selectedBrand,
  selectedCategory,
  rmcAnalysisResult,
  rmcMessage,
  isLoadingRmc
}) => {
  // Ürün görseli URL'sini belirle - Sadece tam RMC ve başarılı analiz sonucu varsa
  const getProductImageUrl = () => {
    // Tam RMC ve başarılı analiz kontrolü
    if (!formData.rmc || !rmcAnalysisResult) {
      return null; // Varsayılan görsel gösterilecek
    }

    const rmcLower = formData.rmc.toLowerCase();
    const rmcUpper = formData.rmc.toUpperCase();

    if (selectedBrand === BrandTypes.ROLEX && selectedCategory === CategoryTypes.SAAT) {
      return `https://media.rolex.com/image/upload/q_auto:eco/f_auto/t_v7/c_limit,w_3840/v1/catalogue/2025/upright-c/m${rmcLower}`;
    }
    if (selectedBrand === BrandTypes.TUDOR) {
      return `https://media.tudorwatch.com/image/upload/q_auto/f_auto/t_tdr-cover-watch-zoom/c_limit,w_3840/v1/catalogue/2025/upright-cb-with-drop-shadow/tudor-m${rmcLower}`;
    }
    if (selectedBrand === BrandTypes.ROLEX && selectedCategory === CategoryTypes.AKSESUAR) {
      return `/images_cufflinks/${rmcUpper}.png`;
    }
    return null;
  };

  return (
    <div className="form" style={{ position: 'relative', zIndex: 1 }}>
      {/* Sadece Ürün Görseli */}
      <div className="product-image-container">
        {isLoadingRmc || !formData.rmc || !rmcAnalysisResult || rmcMessage.type === 'error' ? (
          <div className="brand-placeholder">
            <img
              src={`/images/${selectedBrand.toLowerCase()}.png`}
              alt={`${selectedBrand} Logo`}
              className="brand-logo-placeholder auto-shine"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        ) : (
          <>
            <img
              src={getProductImageUrl()}
              alt="Product Image"
              className={`product-image auto-shine ${getProductImageClass(selectedBrand, selectedCategory)}`}
              onError={(e) => {
                // Görsel yüklenemezse varsayılan logo göster
                e.target.style.display = 'none';
                // Varsayılan logo container'ını göster
                const placeholder = e.target.parentElement.querySelector('.brand-placeholder-fallback');
                if (placeholder) {
                  placeholder.style.display = 'block';
                }
              }}
            />

            {/* Görsel yüklenemediğinde gösterilecek fallback */}
            <div className="brand-placeholder-fallback" style={{display: 'none'}}>
              <img
                src={`/images/${selectedBrand.toLowerCase()}.png`}
                alt={`${selectedBrand} Logo`}
                className="brand-logo-placeholder auto-shine"
              />
            </div>

            {/* Marka Simgesi - RMC girilince görünür */}
            <div className="brand-logo-container brand-logo-slide-down">
              <img
                src={`/images/${selectedBrand.toLowerCase()}.png`}
                alt={`${selectedBrand} Logo`}
                className="brand-logo auto-shine"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetailModal;
