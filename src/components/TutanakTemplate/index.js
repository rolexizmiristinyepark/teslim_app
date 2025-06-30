/**
 * Refactored TutanakTemplate Component
 * Split from 634 lines to modular components and utilities
 */

import React, { memo } from 'react';

// import {
//   BrandTypes,
//   CategoryTypes,
// } from '../../constants/types';
import { addDirectionSuffix } from '../../utils/stringHelpers';
import { isCufflinks, getProductType, getProductTypeGenitive } from '../../utils/brandHelpers';

import DocumentHeader from './components/DocumentHeader';
import IdCardImageUpload from './components/IdCardImageUpload';
import { generatePaymentText } from './utils/paymentTextGenerator';
import { generateTotalText } from './utils/amountCalculator';
import './styles/printStyles.css';

const TutanakTemplate = memo(
  ({
    formData = {},
    selectedBrand,
    selectedCategory,
    payments = [],
    currentDate,
    _totalAmountsByCurrency = {},
  }) => {
    // Safe formData with fallbacks
    const safeFormData = {
      musteri: '',
      rmc: '',
      seri: '',
      size: '',
      aile: '',
      description: '',
      teslimEdilenKisi: '',
      kadran: '',
      bilezik: '',
      fiyat: '',
      ...formData
    };

    // Product type determination using brand helpers
    const isCufflinksProduct = isCufflinks(selectedBrand, selectedCategory);
    const productType = getProductType(selectedBrand, selectedCategory);
    const productTypeGenitive = getProductTypeGenitive(selectedBrand, selectedCategory);

    // Customer and recipient names
    const customerName = safeFormData.musteri || '';
    const customerNameWithSuffix = addDirectionSuffix(customerName);
    const recipientName = safeFormData.teslimEdilenKisi || customerName;

    // Generate payment texts using utility
    const paymentTexts = generatePaymentText(
      payments,
      currentDate,
      selectedBrand,
      safeFormData,
      customerName,
      customerNameWithSuffix,
      productTypeGenitive,
      isCufflinksProduct
    );

    // Generate total text using utility
    const totalText = generateTotalText(payments);

    return (
      <div
        className="print-page-wrapper bg-mint-50 font-sans text-sm leading-relaxed text-black p-0 shadow-none border-none mx-auto relative overflow-hidden"
        style={{
          width: '210mm',
          height: '297mm'
        }}
      >
        <div
          className="print-container bg-mint-50 h-full relative box-border"
          style={{
            padding: '15mm',
            paddingBottom: '80mm'
          }}
        >
          <DocumentHeader currentDate={currentDate} />

          {/* Main Content */}
          <p>Alıcı - Müşteri <strong>{customerName}</strong> tarafından, KÜLAHÇIOĞLU DIŞ TİCARET LTD. ŞTİ. Adına;</p>

          <br />

          {/* Payment Texts */}
          {paymentTexts.map((text, index) => {
            // Detect payment lines vs description lines
            const isPaymentLine = text.includes('ödeme gerçekleştirilmiştir');
            const isLastPaymentLine = isPaymentLine &&
              (index + 1 >= paymentTexts.length || !paymentTexts[index + 1].includes('ödeme gerçekleştirilmiştir'));

            return (
              <div key={index}>
                <p className="m-0">{text}</p>
                {isLastPaymentLine && <br />}
              </div>
            );
          })}

          <p className="my-2">Toplam: <strong>{totalText}</strong></p>

          <p className="my-2">
            İşbu belge ile; Yukarıda belirtilen özelliklere sahip {productTypeGenitive} tüm yasal ve ticari belgeleriyle birlikte eksiksiz olarak hazırlandığı, müşteri talimatı doğrultusunda {!isCufflinksProduct && 'seri numarası,'} kodu ve fiziksel özelliklerinin kontrol edilip doğrulandığı, herhangi bir eksiklik veya hasar bulunmadığının tespit edildiği, Söz konusu {productType} ve tüm belgelerinin asıl sahibi {customerName} adına, vekili/temsilcisi {addDirectionSuffix(recipientName)} eksiksiz olarak teslim edildiği beyan edilir.
          </p>

          <p className="my-3 font-bold">
            <strong>YUKARIDAKİ {productType.toUpperCase()} VE BELGELERİNİ EKSİKSİZ OLARAK TESLİM ALDIM.</strong>
          </p>

          <p className="my-1">Ad-Soyad: {recipientName}</p>
          <p className="my-1">Tarih: {currentDate}</p>
          <br />
          <p className="my-2">İmza: .....................................................................</p>

          {/* ID Card Upload Area - Fixed in bottom left */}
          <IdCardImageUpload />
        </div>
      </div>
    );
  }
);

TutanakTemplate.displayName = 'TutanakTemplate';

export default TutanakTemplate;