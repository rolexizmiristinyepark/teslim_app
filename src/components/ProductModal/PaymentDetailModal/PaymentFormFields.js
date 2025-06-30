/**
 * PaymentFormFields Component
 * Form fields for payment details (type, amount, currency, date)
 */

import { memo } from 'react';
import { PaymentTypeLabels, CurrencySymbols } from '../../../constants/types';

const PaymentFormFields = memo(({ payment, index, onUpdate }) => {
  // Convert Turkish date format to HTML date format
  const toHtmlDate = (turkishDate) => {
    if (!turkishDate) return '';
    try {
      const parts = turkishDate.split('.');
      if (parts.length === 3) {
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        const year = parts[2];
        return `${year}-${month}-${day}`;
      }
      return '';
    } catch {
      return '';
    }
  };

  // Convert HTML date format to Turkish date format
  const toTurkishDate = (htmlDate) => {
    if (!htmlDate) return '';
    const parts = htmlDate.split('-');
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  };

  return (
    <div className="pr-10 pl-1.5 py-1">
      <div className="flex flex-col gap-1.5">
        {/* Payment Type */}
        <div className="w-full flex flex-col gap-0 mb-0">
          <label className="font-normal text-[11px] text-rolex-blue mb-0.5">Ödeme Tipi</label>
          <select
            required
            className="input-filled outline-none bg-mint-50 border border-border-gray shadow-none rounded-lg px-2 py-1 text-xs w-full h-7 leading-tight box-border appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,<svg viewBox='0 0 4 5' xmlns='http://www.w3.org/2000/svg'><path d='m0 1 2 2 2-2' stroke='%23666' fill='none'/></svg>")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 6px center',
              backgroundSize: '10px'
            }}
            value={payment.type}
            onChange={(e) => onUpdate(index, 'type', e.target.value)}
          >
            {Object.entries(PaymentTypeLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {/* Amount and Currency - Same Row */}
        <div className="flex items-end gap-2 mb-0">
          {/* Amount */}
          <div className="flex-1">
            <div className="w-full flex flex-col gap-0 mb-0">
              <label className="font-normal text-[11px] text-rolex-blue mb-0.5">Tutar</label>
              <input
                required
                className="input-filled outline-none bg-mint-50 border border-border-gray shadow-none rounded-lg px-2 py-1 text-xs w-full h-7 leading-tight box-border"
                type="text"
                placeholder="Tutar"
                value={payment.amount}
                data-has-value={payment.amount ? "true" : "false"}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/[^\d]/g, '');
                  onUpdate(index, 'amount', numericValue);
                }}
              />
            </div>
          </div>

          {/* Currency Radio Buttons */}
          <div className="flex flex-col gap-0 mb-0">
            <label className="font-normal text-[11px] text-rolex-blue mb-0.5">Para Birimi</label>
            <div className="flex gap-1 items-center justify-center h-7">
              {Object.entries(CurrencySymbols).map(([key, symbol]) => {
                const isSelected = payment.currency === key;
                return (
                  <label key={key} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name={`currency-${index}`}
                      value={key}
                      checked={isSelected}
                      onChange={() => onUpdate(index, 'currency', key)}
                      className="sr-only"
                    />
                    <span
                      className={`flex items-center justify-center text-[10px] font-normal rounded transition-all bg-mint-50 w-6 h-6 ${
                        isSelected
                          ? 'text-rolex-blue border-2 border-rolex-blue shadow-sm'
                          : 'text-rolex-blue border border-border-gray hover:border-rolex-blue'
                      }`}
                    >
                      {symbol}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Date */}
        <div className="w-full flex flex-col gap-0 mb-0">
          <label className="font-normal text-[11px] text-rolex-blue mb-0.5">Tarih</label>
          <input
            required
            className="input-filled outline-none bg-mint-50 border border-border-gray shadow-none rounded-lg px-2 py-1 text-xs w-full h-7 leading-tight box-border"
            type="date"
            value={toHtmlDate(payment.date)}
            data-has-value={payment.date ? "true" : "false"}
            onChange={(e) => {
              const turkishDate = toTurkishDate(e.target.value);
              if (turkishDate) {
                onUpdate(index, 'date', turkishDate);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
});

PaymentFormFields.displayName = 'PaymentFormFields';

export default PaymentFormFields;