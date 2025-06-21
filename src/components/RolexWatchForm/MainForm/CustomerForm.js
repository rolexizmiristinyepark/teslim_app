/**
 * Müşteri bilgileri form bileşeni
 * Müşteri adı ve teslim edilen kişi input'larını yönetir
 */

import React, { memo } from 'react';

const CustomerForm = memo(({
  formData,
  validationErrors,
  inputClass,
  onChange,
  selectedBrand,
  selectedCategory
}) => {
  // Not: Input background renkleri artık CSS variable'ları ile yönetiliyor (useTheme hook'u)
  
  return (
    <>
      {/* Müşteri */}
      <div className="w-full flex flex-col gap-1 mb-2">
        <label className="font-semibold text-xs text-[#003057]">Müşteri Adı Soyadı</label>
        <input
          required
          className={`input-filled outline-none ${
            validationErrors.musteri ? 'border-red-500' : ''
          }`}
          style={{ 
            backgroundColor: '#F4FCFB',
            border: validationErrors.musteri ? '1px solid #ef4444' : '1px solid #ACBCBF',
            boxShadow: 'none',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '14px',
            width: '100%'
          }}
          id="musteri"
          type="text"
          name="musteri"
          placeholder="Müşteri Adı Soyadı"
          value={formData.musteri}
          data-has-value={formData.musteri ? "true" : "false"}
          onChange={onChange}
        />
        {validationErrors.musteri && (
          <span className="text-xs text-red-500 font-medium" role="alert">
            {validationErrors.musteri}
          </span>
        )}
      </div>

      {/* Teslim Edilen Kişi */}
      <div className="w-full flex flex-col gap-1 mb-2">
        <label className="font-semibold text-xs text-[#003057]">Teslim Edilen Kişi</label>
        <input
          required
          className={`input-filled outline-none ${
            validationErrors.teslimEdilenKisi ? 'border-red-500' : ''
          }`}
          style={{ 
            backgroundColor: '#F4FCFB',
            border: validationErrors.teslimEdilenKisi ? '1px solid #ef4444' : '1px solid #ACBCBF',
            boxShadow: 'none',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '14px',
            width: '100%'
          }}
          id="teslimEdilenKisi"
          type="text"
          name="teslimEdilenKisi"
          placeholder="Teslim Edilen Kişi"
          value={formData.teslimEdilenKisi}
          data-has-value={formData.teslimEdilenKisi ? "true" : "false"}
          onChange={onChange}
        />
        {validationErrors.teslimEdilenKisi && (
          <span className="text-xs text-red-500 font-medium" role="alert">
            {validationErrors.teslimEdilenKisi}
          </span>
        )}
      </div>
    </>
  );
});

CustomerForm.displayName = 'CustomerForm';

export default CustomerForm;
