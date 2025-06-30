/**
 * TotalAmountCard Component
 * Displays total amounts grouped by currency
 */

import { memo } from 'react';
import { CurrencyTypes, CurrencySymbols } from '../../../constants/types';

const TotalAmountCard = memo(({ totalAmountsByCurrency, isExpanded, onToggle }) => {
  const hasSingleCurrency = Object.keys(totalAmountsByCurrency).length === 1;

  const getCurrencyLabel = (currency) => {
    const labels = {
      [CurrencyTypes.TL]: 'TRY',
      [CurrencyTypes.USD]: 'USD',
      [CurrencyTypes.EUR]: 'EUR',
      [CurrencyTypes.GBP]: 'GBP',
      [CurrencyTypes.CHF]: 'CHF'
    };
    return labels[currency] || currency;
  };

  if (Object.keys(totalAmountsByCurrency).length === 0) {
    return null;
  }

  return (
    <div
      className="total-card card-style relative w-full flex flex-col cursor-pointer rounded-lg p-1.5 m-0 shadow-none mt-3 bg-white border border-border-gray"
      style={{
        cursor: isExpanded ? 'default' : 'pointer',
        minHeight: isExpanded ? 'auto' : '24px'
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (!isExpanded) {
          onToggle(true);
        }
      }}
    >
      {/* Minimized View */}
      {!isExpanded && (
        <div className="flex items-center justify-between py-0.5 px-1.5 w-full">
          {/* Title - Left */}
          <div className="text-xs font-bold text-[#003057] flex-none text-left">
            TOPLAM
          </div>

          {/* Total Amount - Right aligned */}
          <div className="text-xs font-bold text-green-500 flex-1 text-right px-2.5">
            {hasSingleCurrency ? (
              Object.entries(totalAmountsByCurrency).map(([currency, amount]) => (
                <span key={currency}>
                  {amount.toLocaleString('tr-TR')} {CurrencySymbols[currency]}
                </span>
              ))
            ) : (
              <span>Detaylar için tıklayın</span>
            )}
          </div>
        </div>
      )}

      {/* Expanded View */}
      {isExpanded && (
        <div className="p-2.5">
          {/* Title */}
          <div className="text-xs font-bold text-green-500 mb-2 text-center">
            TOPLAM DETAYLARI
          </div>

          {/* Currency Details */}
          <div className="flex flex-col gap-1.5">
            {Object.entries(totalAmountsByCurrency).map(([currency, amount]) => (
              <div
                key={currency}
                className="flex justify-between items-center px-3 py-1.5 bg-green-50 rounded-md border border-green-500"
              >
                <span className="text-xs font-semibold text-green-800">
                  {getCurrencyLabel(currency)}
                </span>
                <span className="text-xs font-bold text-green-600">
                  {amount.toLocaleString('tr-TR')} {CurrencySymbols[currency]}
                </span>
              </div>
            ))}
          </div>

          {/* Close note */}
          <div className="text-[9px] text-gray-500 text-center mt-2 italic">
            Kapatmak için dışarı tıklayın
          </div>
        </div>
      )}
    </div>
  );
});

TotalAmountCard.displayName = 'TotalAmountCard';

export default TotalAmountCard;