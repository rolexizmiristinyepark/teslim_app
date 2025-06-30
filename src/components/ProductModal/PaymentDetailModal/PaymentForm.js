/**
 * Payment Form Component
 * Extracted form logic and UI from PaymentDetailModal
 */

import React from 'react';
import PaymentCard from './PaymentCard';
import TotalAmountCard from './TotalAmountCard';

const PaymentForm = ({
  payments,
  totalAmountsByCurrency,
  totalCardExpanded,
  onTogglePayment,
  onUpdatePayment,
  onRemovePayment,
  onAddPayment,
  onToggleTotalCard
}) => {
  // Payment cards container classes - modal'ın tüm genişliğini kullan
  const paymentCardsClasses = 'flex flex-col gap-1.5 flex-1 overflow-y-auto mb-0 pr-0.5 pb-1.5 items-stretch justify-start w-full h-auto';
  const paymentCardsMinHeight = { minHeight: '150px' };

  return (
    <div className={paymentCardsClasses} style={paymentCardsMinHeight}>
      {payments.map((payment, index) => (
        <PaymentCard
          key={payment.id}
          payment={payment}
          index={index}
          isLast={index === payments.length - 1}
          canRemove={payments.length > 1}
          onToggle={onTogglePayment}
          onUpdate={onUpdatePayment}
          onRemove={onRemovePayment}
          onAdd={onAddPayment}
        />
      ))}

      {/* Total Amount Card */}
      <TotalAmountCard
        totalAmountsByCurrency={totalAmountsByCurrency}
        isExpanded={totalCardExpanded}
        onToggle={onToggleTotalCard}
      />
    </div>
  );
};

export default PaymentForm;