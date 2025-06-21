import React, { memo } from 'react';
import { PaymentTypeLabels, CurrencySymbols } from '../../constants/types';
import { formatNumber } from '../../utils/numberHelpers';

/**
 * Ödeme bilgilerini gösteren optimize edilmiş component
 */
const PaymentSection = memo(({
  payments,
  totalAmount,
  paymentDetailsText
}) => (
  <div className="mb-6 p-4 border rounded">
    <h2 className="text-xl font-semibold mb-3 text-gray-700">
      Ödeme Bilgileri
    </h2>

    {payments.map((payment, index) => (
      <div key={payment.id} className="mb-2 text-sm">
        <p>
          {PaymentTypeLabels[payment.type] || payment.type} -
          {' '}{formatNumber(payment.amount) || '0'} {CurrencySymbols[payment.currency] || payment.currency}
          {' '}<i>({payment.date})</i>{Array(index + 1).fill('*').join('')}
        </p>
      </div>
    ))}

    <div className="mt-4 pt-2 border-t">
      <p className="text-sm mb-2">
        <strong>Ödeme Detayları:</strong>
      </p>
      <div className="text-xs bg-gray-50 p-3 rounded">
        <pre className="whitespace-pre-wrap mb-3 overflow-auto" style={{ maxHeight: '300px' }}>
          {paymentDetailsText || 'Detay yok.'}
        </pre>
        <div className="border-t pt-2">
          <p className="text-sm font-semibold text-right">
            <strong>TOPLAM: {totalAmount || '0'}</strong>
          </p>
        </div>
      </div>
    </div>
  </div>
);

PaymentSection.displayName = 'PaymentSection';

export default PaymentSection;
