import React, { memo } from 'react';

/**
 * İmza bölümünü gösteren optimize edilmiş component
 */
const SignatureSection = memo(({
  formData,
  currentDate
}) => (
  <>
    <div className="mt-16 text-sm">
      <div>
        <p className="font-medium">TESLİM ALAN</p>
        <p className="mt-1 text-xs">
          Ad-Soyad: {formData.teslimEdilenKisi || formData.musteri || '________________________'}
        </p>
        <p className="mt-1 text-xs">Tarih: {currentDate}</p>
        <div className="mt-8 border-b border-gray-400"></div>
        <p className="mt-1 text-xs">(İmza)</p>
      </div>
    </div>

    <div className="mt-12 text-center text-xs text-gray-400 print:hidden">
      <p>
        Belge Oluşturma Tarihi: {new Date().toLocaleString('tr-TR')}
      </p>
    </div>
  </>
));

SignatureSection.displayName = 'SignatureSection';

export default SignatureSection;
