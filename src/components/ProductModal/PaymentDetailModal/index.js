/**
 * Optimized Payment Detail Modal - Refactored version
 * Split from 799 lines to modular components with custom hook
 */

import React from 'react';

// import { getPaymentThemeClass } from '../../../constants/theme';
import { usePaymentModal } from '../../../hooks/usePaymentModal';
import PaymentForm from './PaymentForm';

const PaymentDetailModal = ({
  selectedBrand,
  selectedCategory,
  currentDate,
  isProductChecked,
  payments: initialPayments = null,
  onPaymentsChange
}) => {
  // Use custom hook for state management
  const {
    payments,
    totalCardExpanded,
    setTotalCardExpanded,
    totalAmountsByCurrency,
    addPayment,
    removePayment,
    updatePayment,
    togglePayment
  } = usePaymentModal({
    selectedBrand,
    selectedCategory,
    currentDate,
    initialPayments,
    onPaymentsChange
  });

  // Theme class'ını memoize et
  // const themeClass = useMemo(() =>
  //   getPaymentThemeClass(selectedBrand, selectedCategory),
  //   [selectedBrand, selectedCategory]
  // );

  // Modal container classes - diğer modallarla aynı boyut
  const modalContainerClasses = 'flex relative justify-center w-full max-w-sm min-w-80';

  if (!isProductChecked) {
    return null;
  }

  return (
    <div className={modalContainerClasses}>
      <div
        className="form bg-transparent"
        style={{
          width: '100%',
          height: 'auto',
          borderRadius: '16px',
          padding: '10px',
          paddingBottom: '4px',
          maxHeight: 'none',
          overflow: 'visible',
          border: 'none',
          boxShadow: 'none'
        }}
      >
        {/* Payment Form */}
        <PaymentForm
          payments={payments}
          totalAmountsByCurrency={totalAmountsByCurrency}
          totalCardExpanded={totalCardExpanded}
          onTogglePayment={togglePayment}
          onUpdatePayment={updatePayment}
          onRemovePayment={removePayment}
          onAddPayment={addPayment}
          onToggleTotalCard={setTotalCardExpanded}
        />
      </div>
    </div>
  );
};

export default PaymentDetailModal;