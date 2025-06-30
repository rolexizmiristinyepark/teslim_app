import React, { memo } from 'react';

/**
 * Tek bir ürün bilgi kutusunu render eden optimize edilmiş component
 */
const ProductInfoField = memo(({
  label,
  value,
  bgColor = 'bg-gray-50',
  textColor = 'text-gray-600',
  valueColor = 'text-black',
  printBg = 'print:bg-white',
  printBorder = 'print:border print:border-gray-200'
}) => (
  <div className={`${bgColor} ${printBg} ${printBorder} p-3 rounded print:p-2`}>
    <p className={`text-xs ${textColor} mb-1 print:text-xs print:mb-0 print:font-medium print:text-black`}>
      {label}
    </p>
    <p
      className={`font-semibold text-sm print:text-sm print:font-bold ${valueColor} print:text-black truncate whitespace-nowrap overflow-hidden`}
      title={value}
    >
      {value}
    </p>
  </div>
));

ProductInfoField.displayName = 'ProductInfoField';

export default ProductInfoField;
