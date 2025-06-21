import { useState, useCallback, useMemo } from 'react';

import { PaymentTypes, CurrencyTypes } from '../constants/types';
import { formatNumber } from '../utils/numberHelpers';
import { calculateTotalAmounts } from '../utils/paymentHelpers';
import { generateId } from '../utils/stringHelpers';

const createInitialPayment = (currentDate) => ({
  id: generateId(),
  type: PaymentTypes.HAVALE,
  date: currentDate,
  amount: '',
  currency: CurrencyTypes.TL,
});

export const usePayments = (initialCurrentDate) => {
  const [payments, setPayments] = useState(() => [
    createInitialPayment(initialCurrentDate),
  ]);

  /**
   * Ödeme değişikliği handler'ı
   * Ödeme türü değiştiğinde varsayılan para birimini ayarlar
   */
  const handlePaymentChange = useCallback(
    (id, field, value) => {
      if (field === 'type') {
        let defaultCurrency;
        if (
          value === PaymentTypes.HAVALE ||
          value === PaymentTypes.LINK ||
          value === PaymentTypes.KREDI_KARTI
        ) {
          defaultCurrency = CurrencyTypes.TL;
        } else if (
          value === PaymentTypes.CARI ||
          value === PaymentTypes.NAKIT
        ) {
          defaultCurrency = CurrencyTypes.EUR;
        } else {
          defaultCurrency = CurrencyTypes.TL;
        }
        setPayments(
          payments.map((payment) =>
            payment.id === id
              ? { ...payment, [field]: value, currency: defaultCurrency }
              : payment
          )
        );
      } else {
        setPayments(
          payments.map((payment) =>
            payment.id === id ? { ...payment, [field]: value } : payment
          )
        );
      }
    },
    [payments]
  );

  /**
   * Tutar blur handler'ı
   * Kullanıcı alandan çıktığında sayıyı formatlar
   */
  const handleAmountBlur = useCallback(
    (id, value) => {
      if (value) {
        const formattedValue = formatNumber(value);
        setPayments(
          payments.map((payment) =>
            payment.id === id ? { ...payment, amount: formattedValue } : payment
          )
        );
      } else {
        setPayments(
          payments.map((payment) =>
            payment.id === id ? { ...payment, amount: '' } : payment
          )
        );
      }
    },
    [payments]
  );

  /**
   * Yeni ödeme ekleme fonksiyonu
   */
  const addPayment = useCallback(() => {
    setPayments((prev) => [...prev, createInitialPayment(initialCurrentDate)]);
  }, [initialCurrentDate]);

  /**
   * Ödeme silme fonksiyonu - Temiz ve basit
   * Sadece silme işlemi yapar, toast ana bileşende tetiklenir
   */
  const removePayment = useCallback((id) => {
    setPayments((prevPayments) => {
      if (prevPayments.length > 1) {
        return prevPayments.filter((payment) => payment.id !== id);
      } else {
        return prevPayments;
      }
    });
  }, []);

  /**
   * Ödeme sayabilir mi kontrolü
   */
  const canRemovePayment = useCallback(() => {
    return payments.length > 1;
  }, [payments.length]);

  const totals = useMemo(
    () => calculateTotalAmounts(payments),
    [payments]
  );

  return {
    payments,
    setPayments,
    handlePaymentChange,
    handleAmountBlur,
    addPayment,
    removePayment,
    canRemovePayment,
    totalAmount: totals.string,
    totalAmountsByCurrency: totals.byCurrency,
  };
};
