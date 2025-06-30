/**
 * Payment Text Generator Utilities
 * Generates payment-related text for the tutanak document
 */

import { PaymentTypes, CurrencyTypes, BrandTypes } from '../../../constants/types';

// IBAN constants for different currencies
const IBAN_MAP = {
  [CurrencyTypes.TL]: 'TR760006200010000006292310',
  [CurrencyTypes.EUR]: 'TR540006200010000009083008',
  [CurrencyTypes.USD]: 'TR810006200010000009083007'
};

// Format amount with currency symbol
export const formatAmount = (amount, currency) => {
  if (!amount) return '0';
  const formattedAmount = parseFloat(amount).toLocaleString('tr-TR');
  const symbols = {
    [CurrencyTypes.TL]: '₺',
    [CurrencyTypes.USD]: '$',
    [CurrencyTypes.EUR]: '€',
    [CurrencyTypes.GBP]: '£',
    [CurrencyTypes.CHF]: 'CHF'
  };
  const symbol = symbols[currency] || currency;
  return `${formattedAmount} ${symbol}`;
};

// Generate payment text for individual payment
const generateIndividualPaymentText = (payment, currentDate) => {
  const amount = formatAmount(payment.amount, payment.currency);
  const date = payment.date || currentDate;

  switch (payment.type) {
    case PaymentTypes.HAVALE: {
      const iban = IBAN_MAP[payment.currency] || '';
      return `${date} tarihinde IBAN: ${iban} nolu hesaba ${amount} ödeme gerçekleştirilmiştir.`;
    }
    case PaymentTypes.KREDI_KARTI:
      return `${date} tarihinde Kredi Kartı ile ${amount} ödeme gerçekleştirilmiştir.`;
    case PaymentTypes.LINK:
      return `${date} tarihinde Link ile ${amount} ödeme gerçekleştirilmiştir.`;
    default:
      return `${date} tarihinde ${payment.type} ile ${amount} ödeme gerçekleştirilmiştir.`;
  }
};

// Generate sale completion text
const generateSaleCompletionText = (selectedBrand, formData, isCufflinks) => {
  if (isCufflinks) {
    return `İşbu ödeme ile, ${selectedBrand.toUpperCase()} marka ${formData.rmc || ''} ürün koduna sahip, ${formData.seri || ''} seri numaralı, ${formData.description || ''} aksesuarın satışı gerçekleştirilmiştir.`;
  } else {
    return `İşbu ödeme ile, ${selectedBrand.toUpperCase()} marka ${formData.rmc || ''} ürün koduna sahip, ${formData.seri || ''} seri numaralı, ${formData.size || ''} mm çapında ${formData.aile || ''} ailesine ait bir saatin satışı gerçekleştirilmiştir.`;
  }
};

// Generate partial payment text
const generatePartialPaymentText = (amount, customerName, isCufflinks) => {
  if (isCufflinks) {
    return `Aksesuarın kalan bedeli olan KDV dahil ${amount} Alıcı-Müşteri tarafından KÜLAHÇIOĞLU DIŞ TİCARET VE SAN. LTD. ŞTİ.'NE ödenmemiş, işbu ${amount} Alıcı ${customerName} - Müşteri Cari Hesabına borç kaydedilmiştir.`;
  } else {
    return `Saatin kalan bedeli olan KDV dahil ${amount} Alıcı-Müşteri tarafından KÜLAHÇIOĞLU DIŞ TİCARET VE SAN. LTD. ŞTİ.'NE ödenmemiş, işbu ${amount} Alıcı ${customerName} - Müşteri Cari Hesabına borç kaydedilmiştir.`;
  }
};

// Generate full credit payment text
const generateFullCreditPaymentText = (selectedBrand, formData, productTypeGenitive, customerNameWithSuffix, customerName, amount, isCufflinks) => {
  if (isCufflinks) {
    const brandName = selectedBrand === BrandTypes.ROLEX ? 'ROLEX' :
                     selectedBrand === BrandTypes.TUDOR ? 'TUDOR' : 'CUFFLINKS';
    return `KÜLAHÇIOĞLU DIŞ TİCARET VE SAN. LTD. ŞTİ. tarafından ${brandName} ${formData.rmc || ''} ürün koduna sahip, ${formData.description || ''} ${productTypeGenitive} satışı Alıcı-Müşteri ${customerNameWithSuffix} gerçekleştirilmiş, ancak ${productTypeGenitive} bedeli olan KDV dahil ${amount} Alıcı-Müşteri tarafından KÜLAHÇIOĞLU DIŞ TİCARET VE SAN. LTD. ŞTİ.'NE ödenmemiş, işbu ${amount} Alıcı ${customerName} - Müşteri Cari Hesabına borç kaydedilmiştir.`;
  } else {
    const brandName = selectedBrand === BrandTypes.ROLEX ? 'ROLEX' :
                     selectedBrand === BrandTypes.TUDOR ? 'TUDOR' : selectedBrand;
    return `KÜLAHÇIOĞLU DIŞ TİCARET VE SAN. LTD. ŞTİ. tarafından ${brandName} ${formData.rmc || ''} ürün koduna sahip, ${formData.seri || ''} seri numaralı, ${formData.size || ''}mm çapında ${formData.aile || ''} ailesine ait ${productTypeGenitive} satışı Alıcı-Müşteri ${customerNameWithSuffix} gerçekleştirilmiş, ancak ${productTypeGenitive} bedeli olan KDV dahil ${amount} Alıcı-Müşteri tarafından KÜLAHÇIOĞLU DIŞ TİCARET VE SAN. LTD. ŞTİ.'NE ödenmemiş, işbu ${amount} Alıcı ${customerName} - Müşteri Cari Hesabına borç kaydedilmiştir.`;
  }
};

// Main payment text generator function
export const generatePaymentText = (
  payments,
  currentDate,
  selectedBrand,
  formData,
  customerName,
  customerNameWithSuffix,
  productTypeGenitive,
  isCufflinks
) => {
  const texts = [];

  // Separate payment types
  const nonCariPayments = payments.filter(p => p.type !== PaymentTypes.CARI);
  const cariPayments = payments.filter(p => p.type === PaymentTypes.CARI);

  // Add individual payment texts
  nonCariPayments.forEach((payment) => {
    const paymentText = generateIndividualPaymentText(payment, currentDate);
    texts.push(paymentText);
  });

  // Add sale completion text if there are non-cari payments
  if (nonCariPayments.length > 0) {
    const saleText = generateSaleCompletionText(selectedBrand, formData, isCufflinks);
    texts.push(saleText);
  }

  // Add cari payment texts
  cariPayments.forEach((payment) => {
    const amount = formatAmount(payment.amount, payment.currency);

    if (nonCariPayments.length > 0) {
      // Partial payment situation
      const partialText = generatePartialPaymentText(amount, customerName, isCufflinks);
      texts.push(partialText);
    } else {
      // Full credit payment
      const fullCreditText = generateFullCreditPaymentText(
        selectedBrand,
        formData,
        productTypeGenitive,
        customerNameWithSuffix,
        customerName,
        amount,
        isCufflinks
      );
      texts.push(fullCreditText);
    }
  });

  return texts;
};