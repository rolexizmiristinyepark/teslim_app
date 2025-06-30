/**
 * Müşteri bilgileri form bileşeni
 * Müşteri adı ve teslim edilen kişi input'larını yönetir
 */

import { memo } from 'react';

const CustomerForm = memo(({
  formData,
  validationErrors,
  onChange
}) => {
  // Not: Input background renkleri artık CSS variable'ları ile yönetiliyor (useTheme hook'u)

  return (
    <>
      {/* Müşteri */}
      <div className="w-full flex flex-col gap-1 mb-2">
        <label htmlFor="musteri" className="font-semibold text-xs text-[#003057]">Müşteri Adı Soyadı</label>
        <input
          required
          className={`input-filled outline-none shadow-none rounded-lg px-3 py-2 text-sm w-full border ${
            validationErrors.musteri ? 'border-red-500' : 'border-border-gray'
          }`}
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
        <label htmlFor="teslimEdilenKisi" className="font-semibold text-xs text-[#003057]">Teslim Edilen Kişi</label>
        <input
          required
          className={`input-filled outline-none shadow-none rounded-lg px-3 py-2 text-sm w-full border ${
            validationErrors.teslimEdilenKisi ? 'border-red-500' : 'border-border-gray'
          }`}
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
