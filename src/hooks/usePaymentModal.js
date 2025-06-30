/**
 * Payment Modal Hook
 * Extracted state management and business logic from PaymentDetailModal
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  PaymentTypes,
  CurrencyTypes,
  CategoryTypes,
  BrandColors,
  CategoryColors,
} from '../constants/types';
import { isCufflinks } from '../utils/brandHelpers';

export const usePaymentModal = ({
  selectedBrand,
  selectedCategory,
  currentDate,
  initialPayments = null,
  onPaymentsChange,
}) => {
  // İlk ödeme state'ini memoize et
  const initialPaymentState = useMemo(
    () =>
      initialPayments && initialPayments.length > 0
        ? initialPayments.map((payment, index) => ({
            ...payment,
            isExpanded: index === initialPayments.length - 1,
          }))
        : [
            {
              id: Date.now().toString(),
              type: PaymentTypes.HAVALE,
              amount: '',
              currency: CurrencyTypes.TL,
              date: currentDate,
              isExpanded: true,
            },
          ],
    [initialPayments, currentDate]
  );

  const [payments, setPayments] = useState(initialPaymentState);
  const [totalCardExpanded, setTotalCardExpanded] = useState(false);

  // initialPayments değiştiğinde local state'i güncelle
  useEffect(() => {
    if (initialPayments && initialPayments.length > 0) {
      const paymentsWithExpanded = initialPayments.map((payment, index) => ({
        ...payment,
        isExpanded: index === initialPayments.length - 1,
      }));
      setPayments(paymentsWithExpanded);
    }
  }, [initialPayments]);

  // Ödeme ekleme fonksiyonu
  const addPayment = useCallback(() => {
    const newPayment = {
      id: Date.now().toString(),
      type: PaymentTypes.HAVALE,
      amount: '',
      currency: CurrencyTypes.TL,
      date: currentDate,
      isExpanded: true,
    };

    setPayments((prev) => {
      const collapsed = prev.map((p) => ({ ...p, isExpanded: false }));
      return [...collapsed, newPayment];
    });
  }, [currentDate]);

  // Ödeme silme fonksiyonu
  const removePayment = useCallback((index) => {
    setPayments((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length > 0) {
        updated[updated.length - 1].isExpanded = true;
      }
      return updated;
    });
  }, []);

  // Ödeme güncelleme fonksiyonu
  const updatePayment = useCallback((index, field, value) => {
    setPayments((prev) =>
      prev.map((payment, i) =>
        i === index ? { ...payment, [field]: value } : payment
      )
    );
  }, []);

  // Ödeme kartını açma/kapama
  const togglePayment = useCallback((index) => {
    setPayments((prev) =>
      prev.map((payment, i) => ({
        ...payment,
        isExpanded: i === index ? !payment.isExpanded : false,
      }))
    );
  }, []);

  // Para birimlerine göre toplam tutarları hesapla
  const totalAmountsByCurrency = useMemo(() => {
    const totals = {};

    payments.forEach((payment) => {
      if (payment.amount && parseFloat(payment.amount) > 0) {
        const currency = payment.currency;
        const amount = parseFloat(payment.amount);
        totals[currency] = (totals[currency] || 0) + amount;
      }
    });

    return totals;
  }, [payments]);

  // Form geçerliliğini kontrol et
  const isValid = useMemo(() => {
    return payments.some(
      (payment) =>
        payment.amount && parseFloat(payment.amount) > 0 && payment.date
    );
  }, [payments]);

  // Toplam tutar metnini oluştur
  const totalText = useMemo(() => {
    const parts = [];

    Object.entries(totalAmountsByCurrency).forEach(([currency, amount]) => {
      parts.push(`${amount.toLocaleString('tr-TR')} ${currency}`);
    });

    return parts.length > 0 ? parts.join(' + ') : '0 ₺';
  }, [totalAmountsByCurrency]);

  // Aktif marka rengini belirle
  const getSubmitButtonColor = useMemo(() => {
    // Rolex Aksesuar (Cufflinks) için mavi
    if (isCufflinks(selectedBrand, selectedCategory)) {
      return CategoryColors[CategoryTypes.AKSESUAR]?.primary || '#003057';
    }

    // Diğer markalar için marka rengini kullan
    const brandColor = BrandColors[selectedBrand];
    return brandColor ? brandColor.primary : '#22c55e'; // Default yeşil
  }, [selectedBrand, selectedCategory]);

  // Clear button için her zaman kırmızı
  const getClearButtonColor = useMemo(() => '#ef4444', []);

  // Parent component'e değişiklikleri bildir
  useEffect(() => {
    if (onPaymentsChange) {
      onPaymentsChange(payments, isValid, totalText);
    }
  }, [payments, isValid, totalText, onPaymentsChange]);

  // Modalın dışına tıklandığında expanded olan kartları kapat
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        !e.target.closest('.payment-card') &&
        !e.target.closest('.total-card')
      ) {
        setPayments((prev) => prev.map((p) => ({ ...p, isExpanded: false })));
        setTotalCardExpanded(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  return {
    payments,
    totalCardExpanded,
    setTotalCardExpanded,
    totalAmountsByCurrency,
    isValid,
    totalText,
    getSubmitButtonColor,
    getClearButtonColor,
    addPayment,
    removePayment,
    updatePayment,
    togglePayment,
  };
};
