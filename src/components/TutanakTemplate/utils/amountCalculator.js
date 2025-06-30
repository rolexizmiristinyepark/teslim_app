/**
 * Amount Calculator Utilities
 * Calculates total amounts for different payment types and currencies
 */

import { PaymentTypes } from '../../../constants/types';
import { formatAmount } from './paymentTextGenerator';

/**
 * Calculate total amounts grouped by currency and payment type
 * @param {Array} payments - Array of payment objects
 * @returns {Object} Object with paidAmounts and cariAmounts by currency
 */
export const calculateTotalAmounts = (payments) => {
  const paidAmounts = {};
  const cariAmounts = {};

  payments.forEach(payment => {
    const currency = payment.currency;
    const amount = parseFloat(payment.amount) || 0;

    if (payment.type !== PaymentTypes.CARI) {
      paidAmounts[currency] = (paidAmounts[currency] || 0) + amount;
    } else {
      cariAmounts[currency] = (cariAmounts[currency] || 0) + amount;
    }
  });

  return { paidAmounts, cariAmounts };
};

/**
 * Generate total text display string
 * @param {Array} payments - Array of payment objects
 * @returns {string} Formatted total text (e.g., "10,000 ₺ + 5,000 $ Cari")
 */
export const generateTotalText = (payments) => {
  const { paidAmounts, cariAmounts } = calculateTotalAmounts(payments);
  const parts = [];

  // Add paid amounts
  Object.entries(paidAmounts).forEach(([currency, amount]) => {
    parts.push(formatAmount(amount, currency));
  });

  // Add cari amounts with "Cari" suffix
  Object.entries(cariAmounts).forEach(([currency, amount]) => {
    parts.push(`${formatAmount(amount, currency)} Cari`);
  });

  return parts.length > 0 ? parts.join(' + ') : '0 ₺';
};

/**
 * Calculate total amounts by currency (for summary display)
 * @param {Array} payments - Array of payment objects
 * @returns {Object} Object with currency as key and total amount as value
 */
export const calculateTotalAmountsByCurrency = (payments) => {
  const totals = {};

  payments.forEach(payment => {
    if (payment.amount && parseFloat(payment.amount) > 0) {
      const currency = payment.currency;
      const amount = parseFloat(payment.amount);
      totals[currency] = (totals[currency] || 0) + amount;
    }
  });

  return totals;
};