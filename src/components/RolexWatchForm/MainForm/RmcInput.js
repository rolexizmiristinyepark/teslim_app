/**
 * RMC giriş ve analiz bileşeni
 * RMC kodu, seri numarası girişi ve analiz sonuçlarını yönetir
 */

import { useMemo, useState, useEffect } from 'react';
import { BrandTypes, CategoryTypes, BrandColors, CategoryColors } from '../../../constants/types';
import { validateSerial, getSerialMinLength } from '../../../utils/formValidation';

const RmcInput = ({
  formData,
  selectedBrand,
  selectedCategory,
  validationErrors,
  inputClass,
  rmcAnalysisResult,
  rmcMessage,
  isProductChecked,
  isRmcValid,
  onRmcChange,
  onChange,
  onProductCheckChange
}) => {
  // Seri input'una dokunulup dokunulmadığını takip et
  const [serialTouched, setSerialTouched] = useState(false);

  // Marka veya kategori değiştiğinde touched state'ini sıfırla
  useEffect(() => {
    setSerialTouched(false);
  }, [selectedBrand, selectedCategory]);
  
  // Not: Input background renkleri artık CSS variable'ları ile yönetiliyor (useTheme hook'u)
  // Seri input'unun gösterilip gösterilmeyeceğini belirle
  const showSeriInput = (
    selectedBrand === BrandTypes.TUDOR ||
    (selectedBrand === BrandTypes.ROLEX && selectedCategory === CategoryTypes.SAAT) ||
    (selectedBrand === BrandTypes.ROLEX && selectedCategory === CategoryTypes.AKSESUAR)
  );

  // Seri numarası validasyonu ve uyarı mesajı
  const serialValidation = useMemo(() => {
    // Seri numarası boşsa
    if (!formData.seri || !formData.seri.trim()) {
      return { isValid: false, message: 'Seri numarası zorunludur' };
    }

    const trimmedSerial = formData.seri.trim();
    const hasLetter = /[a-zA-Z]/.test(trimmedSerial);
    const hasNumber = /[0-9]/.test(trimmedSerial);
    const minLength = getSerialMinLength(selectedBrand, selectedCategory);

    // Karakter sayısı kontrolü
    if (trimmedSerial.length < minLength) {
      return { 
        isValid: false, 
        message: `En az ${minLength} karakter olmalıdır` 
      };
    }

    // Harf kontrolü
    if (!hasLetter) {
      return { 
        isValid: false, 
        message: 'En az 1 harf içermelidir' 
      };
    }

    // Rakam kontrolü
    if (!hasNumber) {
      return { 
        isValid: false, 
        message: 'En az 1 rakam içermelidir' 
      };
    }

    return { isValid: true, message: '' };
  }, [formData.seri, selectedBrand, selectedCategory]);

  return (
    <>
      {/* RMC ve Seri */}
      <div className="input_container mb-2">
        <div className="flex gap-4">
          <div className="w-full flex flex-col gap-1 mb-0">
            <label className="font-semibold text-xs text-[#003057]">RMC</label>
            <input
              required
              className={`input-filled outline-none ${
                validationErrors.rmc || rmcMessage.type === 'error' ? 'border-red-500' : ''
              }`}
              style={{ 
                backgroundColor: '#F4FCFB',
                color: '#243C4C',
                border: (validationErrors.rmc || rmcMessage.type === 'error') ? '1px solid #ef4444' : '1px solid #ACBCBF',
                boxShadow: 'none',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '14px',
                width: '100%'
              }}
              id="rmc"
              type="text"
              name="rmc"
              placeholder="RMC"
              value={formData.rmc || ''}
              data-has-value={formData.rmc ? "true" : "false"}
              onChange={onRmcChange}
            />
          </div>
          {showSeriInput && (
            <div className="w-full flex flex-col gap-1 mb-0">
              <label className="font-semibold text-xs text-[#003057]">SERİ</label>
              <input
              required
              className={`input-filled outline-none ${
              (!serialValidation.isValid && serialTouched) ? 'border-red-500' : 
              validationErrors.seri ? 'border-red-500' : ''
              }`}
              style={{ 
                backgroundColor: '#F4FCFB',
                color: '#243C4C',
                border: ((!serialValidation.isValid && serialTouched) || validationErrors.seri) ? '1px solid #ef4444' : '1px solid #ACBCBF',
                boxShadow: 'none',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '14px',
                width: '100%'
              }}
              id="seri"
              type="text"
              name="seri"
              placeholder="SERİ"
              value={formData.seri}
              data-has-value={formData.seri ? "true" : "false"}
              onChange={onChange}
              onBlur={() => setSerialTouched(true)}
              onFocus={() => setSerialTouched(true)}
              />
            </div>
          )}
        </div>
        {(validationErrors.rmc || (rmcMessage.text && rmcMessage.type === 'error') || validationErrors.seri || (!serialValidation.isValid && serialTouched)) && (
          <div className="mt-1">
            {validationErrors.rmc && (
              <span className="block text-xs text-red-500 font-medium">
                {validationErrors.rmc}
              </span>
            )}
            {rmcMessage.text && rmcMessage.type === 'error' && (
              <span className="block text-xs text-red-500 font-medium">
                {rmcMessage.text}
              </span>
            )}
            {validationErrors.seri && (
              <span className="block text-xs text-red-500 font-medium">
                {validationErrors.seri}
              </span>
            )}
            {/* Seri numarası real-time validasyon uyarısı */}
            {(!serialValidation.isValid && serialTouched) && (
              <span className="block text-xs text-red-500 font-medium">
                {serialValidation.message}
              </span>
            )}
          </div>
        )}
      </div>

      {/* RMC Analiz Sonuçları - Sadece doğru marka/kategori ve hatasız durumlarda görünür */}
      {rmcAnalysisResult && rmcMessage.type !== 'error' && formData.rmc && (
        <div className="input_container mb-2">
        <label className="font-semibold text-xs text-[#003057] mb-2 block">Ürün Detayları</label>
        <div className="card-style" style={{
        padding: '12px',
        borderRadius: '8px',
        backgroundColor: '#F4FCFB'
        }}>
            {/* ROLEX ve TUDOR için detaylar */}
            {rmcAnalysisResult && (selectedBrand === BrandTypes.ROLEX || selectedBrand === BrandTypes.TUDOR) && (
              <>
                {rmcAnalysisResult?.FAMILY && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '6px',
                    fontSize: '12px',
                    backgroundColor: '#F4FCFB',
                    padding: '4px 8px',
                    borderRadius: '4px'
                  }}>
                    <span style={{ color: '#243C4C', fontWeight: '600' }}>Aile:</span>
                    <span
                      style={{
                        color: '#243C4C',
                        fontWeight: '500',
                        maxWidth: '150px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                      title={rmcAnalysisResult.FAMILY}
                    >
                      {rmcAnalysisResult.FAMILY}
                    </span>
                  </div>
                )}
                {rmcAnalysisResult?.SIZE && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '6px',
                    fontSize: '12px',
                    backgroundColor: '#F4FCFB',
                    padding: '4px 8px',
                    borderRadius: '4px'
                  }}>
                    <span style={{ color: '#243C4C', fontWeight: '600' }}>Size:</span>
                    <span
                      style={{
                        color: '#243C4C',
                        fontWeight: '500',
                        maxWidth: '150px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                      title={rmcAnalysisResult.SIZE}
                    >
                      {rmcAnalysisResult.SIZE}
                    </span>
                  </div>
                )}
                {rmcAnalysisResult?.DIAL && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '6px',
                    fontSize: '12px',
                    backgroundColor: '#F4FCFB',
                    padding: '4px 8px',
                    borderRadius: '4px'
                  }}>
                    <span style={{ color: '#243C4C', fontWeight: '600' }}>Kadran:</span>
                    <span style={{
                      color: '#243C4C',
                      fontWeight: '500',
                      maxWidth: '150px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {rmcAnalysisResult.DIAL}
                    </span>
                  </div>
                )}
                {rmcAnalysisResult?.BRACELET && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '6px',
                    fontSize: '12px',
                    backgroundColor: '#F4FCFB',
                    padding: '4px 8px',
                    borderRadius: '4px'
                  }}>
                    <span style={{ color: '#243C4C', fontWeight: '600' }}>Bilezik:</span>
                    <span style={{
                      color: '#243C4C',
                      fontWeight: '500',
                      maxWidth: '150px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {rmcAnalysisResult.BRACELET}
                    </span>
                  </div>
                )}
                {rmcAnalysisResult?.PRICE && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '6px',
                    fontSize: '12px',
                    backgroundColor: '#F4FCFB',
                    padding: '4px 8px',
                    borderRadius: '4px'
                  }}>
                    <span style={{ color: '#243C4C', fontWeight: '600' }}>Fiyat:</span>
                    <span style={{ color: '#243C4C', fontWeight: '700' }}>
                      {rmcAnalysisResult.PRICE}
                    </span>
                  </div>
                )}
              </>
            )}
            {/* CUFFLINKS için açıklama */}
            {selectedBrand === BrandTypes.ROLEX && selectedCategory === CategoryTypes.AKSESUAR && (
              <>
                {rmcAnalysisResult?.DETAIL && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '6px',
                    fontSize: '12px',
                    backgroundColor: '#F4FCFB',
                    padding: '4px 8px',
                    borderRadius: '4px'
                  }}>
                    <span style={{ color: '#243C4C', fontWeight: '600' }}>Açıklama:</span>
                    <span style={{
                      color: '#243C4C',
                      fontWeight: '500',
                      maxWidth: '150px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {rmcAnalysisResult.DETAIL}
                    </span>
                  </div>
                )}
                {rmcAnalysisResult?.PRICE && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '6px',
                    fontSize: '12px',
                    backgroundColor: '#F4FCFB',
                    padding: '4px 8px',
                    borderRadius: '4px'
                  }}>
                    <span style={{ color: '#243C4C', fontWeight: '600' }}>Fiyat:</span>
                    <span style={{ color: '#243C4C', fontWeight: '700' }}>
                      {rmcAnalysisResult.PRICE}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Teslim Edilen Ürünü Kontrol Ettim Checkbox */}
      <div className={`input_container mb-2 brand-${selectedBrand} category-${selectedCategory}`}>
        <label
          className={`approval-checkbox flex items-center p-3 rounded-lg bg-transparent transition-all duration-150 ${
            isRmcValid ? 'cursor-pointer opacity-100' : 'cursor-not-allowed opacity-60'
          }`}
        >
          <input
            type="checkbox"
            checked={isProductChecked}
            disabled={!isRmcValid}
            onChange={(e) => isRmcValid && onProductCheckChange(e.target.checked)}
            className="sr-only"
          />
          <span className="checkmark"></span>
          <span className={`approval-text text-sm font-medium ${
            isRmcValid ? 'text-[#003057]' : 'text-gray-500'
          }`}>
            {isRmcValid ?
              'Teslim edilen ürünü kontrol ettim.' :
              'Önce geçerli RMC kodu girin.'
            }
          </span>
        </label>
      </div>
    </>
  );
};

export default RmcInput;
