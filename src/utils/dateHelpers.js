/**
 * Tarih işleme yardımcı fonksiyonları
 * Güncellenmiş versiyon - sadece kullanılan fonksiyonlar
 */

import { format } from 'date-fns';

/**
 * Güncel tarihi Türkçe formatında (dd.MM.yyyy) döndürür
 * @returns {string} Bugünün tarihi dd.MM.yyyy formatında
 */
export const getCurrentDate = () => {
  return format(new Date(), 'dd.MM.yyyy');
};
