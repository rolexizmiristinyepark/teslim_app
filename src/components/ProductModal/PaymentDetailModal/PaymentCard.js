/**
 * PaymentCard Component
 * Individual payment card with expand/collapse functionality
 */

import React, { memo } from 'react';
import { PaymentTypeLabels, CurrencySymbols } from '../../../constants/types';
import ActionButton from './ActionButton';
import PaymentFormFields from './PaymentFormFields';

const PaymentCard = memo(({
  payment,
  index,
  isLast,
  canRemove,
  onToggle,
  onUpdate,
  onRemove,
  onAdd
}) => {
  const handleCardClick = (e) => {
    e.stopPropagation();
    if (!payment.isExpanded) {
      onToggle(index);
    }
  };

  return (
    <div
      className="payment-card card-style flex flex-col relative w-full cursor-pointer bg-mint-50 border border-border-gray shadow-none rounded-lg p-1.5 m-0"
      style={{
        cursor: payment.isExpanded ? 'default' : 'pointer',
        minHeight: payment.isExpanded ? 'auto' : '24px' // Yükseklik 24px yapıldı
      }}
      onClick={handleCardClick}
    >
      {/* Action buttons - Only visible when expanded */}
      {payment.isExpanded && (
        <div className="absolute top-2 right-1.5 flex gap-1 items-center z-10">
          {canRemove && (
            <ActionButton
              type="remove"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(index);
              }}
              title="Ödemeyi Sil"
            />
          )}

          {isLast && (
            <ActionButton
              type="add"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onAdd();
              }}
              title="Ödeme Ekle"
            />
          )}
        </div>
      )}

      {/* Minimized View */}
      {!payment.isExpanded && (
        <div className="flex items-center justify-between py-0.5 px-1.5 w-full">
          {/* Date - Left */}
          <div className="text-xs font-normal text-gray-700 flex-none w-20 text-left">
            {payment.date || '-'}
          </div>

          {/* Payment Type - Center */}
          <div className="text-xs font-normal text-gray-700 flex-1 text-center px-1">
            {PaymentTypeLabels[payment.type]}
          </div>

          {/* Amount - Right */}
          <div className={`text-xs font-normal flex-none w-20 text-right ${
            payment.amount ? 'text-green-500' : 'text-gray-300'
          }`}>
            {payment.amount
              ? `${parseInt(payment.amount).toLocaleString('tr-TR')} ${CurrencySymbols[payment.currency]}`
              : '-'
            }
          </div>

          {/* Buttons - Far Right */}
          <div className="flex gap-1 items-center flex-none w-12 justify-end ml-2">
            {isLast && (
              <ActionButton
                type="add"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd();
                }}
                title="Ödeme Ekle"
              />
            )}

            {canRemove && (
              <ActionButton
                type="remove"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(index);
                }}
                title="Ödemeyi Sil"
              />
            )}
          </div>
        </div>
      )}

      {/* Expanded View */}
      {payment.isExpanded && (
        <PaymentFormFields
          payment={payment}
          index={index}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
});

PaymentCard.displayName = 'PaymentCard';

export default PaymentCard;