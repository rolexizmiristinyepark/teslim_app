import { useState, useCallback } from 'react';

import { BrandTypes } from '../constants/types';
import { toTurkishUpperCase } from '../utils/stringHelpers';

export const useFormData = (initialFormData, selectedBrand) => {
  const [formData, setFormData] = useState(initialFormData);

  /**
   * Seri numarası işleme fonksiyonu
   * Marka bazlı karakter sınırlaması ve formatlaması
   */
  const handleSeriChange = useCallback(
    (value) => {
      let cleanValue;

      if (selectedBrand === BrandTypes.TUDOR) {
        cleanValue = toTurkishUpperCase(
          value.replace(/[^a-zA-Z0-9]/g, '').substring(0, 7)
        );
      } else {
        cleanValue = toTurkishUpperCase(
          value.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)
        );
      }

      setFormData((prev) => ({ ...prev, seri: cleanValue }));
    },
    [selectedBrand]
  );

  /**
   * Size field işleme fonksiyonu
   * Sadece rakamları kabul eder
   */
  const handleSizeChange = useCallback((value) => {
    const numericValue = value.replace(/[^\d]/g, '');
    setFormData((prev) => ({ ...prev, size: numericValue }));
  }, []);

  /**
   * Genel field işleme fonksiyonu
   * Diğer string fieldları için kullanılır
   */
  const handleGeneralFieldChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: toTurkishUpperCase(value) }));
  }, []);

  /**
   * Ana form change handler
   * Field tipine göre doğru işleme fonksiyonunu çağırır
   */
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      switch (name) {
        case 'rmc':
          // RMC değişikliğini debounce ile yap - burada sadece state güncellenir, analiz blur eventında tetiklenir
          setFormData((prev) => ({ ...prev, rmc: toTurkishUpperCase(value) }));
          break;
        case 'seri':
          handleSeriChange(value);
          break;
        case 'size':
          handleSizeChange(value);
          break;
        case 'description':
        case 'kadran':
        case 'bilezik':
          handleGeneralFieldChange(name, value); // Bu alanlar için genel handler
          break;
        case 'fiyat':
          // Fiyat alanı hook içinde değil, dışarıda RMC analizinden güncelleniyor.
          // Burada sadece olası manuel giriş için bir placeholder bırakıyoruz,
          // ancak şu anki mantıkta RMC analizi fiyatı set ediyor.
          // İhtiyaç olursa burası geliştirilebilir.
          break;
        default:
          handleGeneralFieldChange(name, value);
          break;
      }
    },
    [handleSeriChange, handleSizeChange, handleGeneralFieldChange]
  );

  // RMC blur handler'ı hook içinde tutulmayacak, ana bileşende useRmcAnalysis hooku ile birlikte kullanılacak.

  return {
    formData,
    setFormData, // Ana bileşenin form datasını güncellemek için dışa aktarıyoruz
    handleChange,
  };
};
