/**
 * RMC giriş ve analiz bileşeni
 * RMC kodu, seri numarası girişi ve analiz sonuçlarını yönetir
 */

import { useMemo, useState, useEffect } from 'react';
import { BrandTypes, CategoryTypes } from '../../../constants/types';
import { getSerialMinLength } from '../../../utils/formValidation';
import { isCufflinks } from '../../../utils/brandHelpers';

const RmcInput = ({
  formData,
  selectedBrand,
  selectedCategory,
  validationErrors,
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
    isCufflinks(selectedBrand, selectedCategory)
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
            <label htmlFor="rmc" className="font-semibold text-xs text-[#003057]">RMC Kodu</label>
            <input
              required
              className={`input-filled outline-none  shadow-none rounded-lg px-3 py-2 text-sm w-full border ${
                validationErrors.rmc || rmcMessage.type === 'error' ? 'border-red-500' : 'border-border-gray'
              }`}
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
              <label htmlFor="seri" className="font-semibold text-xs text-[#003057]">Seri Numarası</label>
              <input
              required
              className={`input-filled outline-none  shadow-none rounded-lg px-3 py-2 text-sm w-full border ${
              (!serialValidation.isValid && serialTouched) ? 'border-red-500' :
              validationErrors.seri ? 'border-red-500' : 'border-border-gray'
              }`}
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
        <div className="card-style p-3 rounded-lg bg-mint-50">
            {/* ROLEX ve TUDOR için detaylar */}
            {rmcAnalysisResult && (selectedBrand === BrandTypes.ROLEX || selectedBrand === BrandTypes.TUDOR) && (
              <>
                {rmcAnalysisResult?.FAMILY && (
                  <div className="flex justify-between mb-1.5 text-xs bg-mint-50 px-2 py-1 rounded">
                    <span className="text-[#003057] font-semibold">Aile:</span>
                    <span
                      className="text-[#003057] font-medium max-w-[150px] whitespace-nowrap overflow-hidden text-ellipsis"
                      title={rmcAnalysisResult.FAMILY}
                    >
                      {rmcAnalysisResult.FAMILY}
                    </span>
                  </div>
                )}
                {rmcAnalysisResult?.SIZE && (
                  <div className="flex justify-between mb-1.5 text-xs bg-mint-50 px-2 py-1 rounded">
                    <span className="text-[#003057] font-semibold">Size:</span>
                    <span
                      className="text-[#003057] font-medium max-w-[150px] whitespace-nowrap overflow-hidden text-ellipsis"
                      title={rmcAnalysisResult.SIZE}
                    >
                      {rmcAnalysisResult.SIZE}
                    </span>
                  </div>
                )}
                {rmcAnalysisResult?.DIAL && (
                  <div className="flex justify-between mb-1.5 text-xs bg-mint-50 px-2 py-1 rounded">
                    <span className="text-[#003057] font-semibold">Kadran:</span>
                    <span className="text-[#003057] font-medium max-w-[150px] whitespace-nowrap overflow-hidden text-ellipsis">
                      {rmcAnalysisResult.DIAL}
                    </span>
                  </div>
                )}
                {rmcAnalysisResult?.BRACELET && (
                  <div className="flex justify-between mb-1.5 text-xs bg-mint-50 px-2 py-1 rounded">
                    <span className="text-[#003057] font-semibold">Bilezik:</span>
                    <span className="text-[#003057] font-medium max-w-[150px] whitespace-nowrap overflow-hidden text-ellipsis">
                      {rmcAnalysisResult.BRACELET}
                    </span>
                  </div>
                )}
                {rmcAnalysisResult?.PRICE && (
                  <div className="flex justify-between mb-1.5 text-xs bg-mint-50 px-2 py-1 rounded">
                    <span className="text-[#003057] font-semibold">Fiyat:</span>
                    <span className="text-[#003057] font-bold">
                      {rmcAnalysisResult.PRICE}
                    </span>
                  </div>
                )}
              </>
            )}
            {/* CUFFLINKS için açıklama */}
            {isCufflinks(selectedBrand, selectedCategory) && (
              <>
                {rmcAnalysisResult?.DETAIL && (
                  <div className="flex justify-between mb-1.5 text-xs bg-mint-50 px-2 py-1 rounded">
                    <span className="text-[#003057] font-semibold">Açıklama:</span>
                    <span className="text-[#003057] font-medium max-w-[150px] whitespace-nowrap overflow-hidden text-ellipsis">
                      {rmcAnalysisResult.DETAIL}
                    </span>
                  </div>
                )}
                {rmcAnalysisResult?.PRICE && (
                  <div className="flex justify-between mb-1.5 text-xs bg-mint-50 px-2 py-1 rounded">
                    <span className="text-[#003057] font-semibold">Fiyat:</span>
                    <span className="text-[#003057] font-bold">
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
