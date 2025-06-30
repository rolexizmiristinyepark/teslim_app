/**
 * Brand and Category Helper Utilities
 * Simplifies repeated brand/category checking patterns
 */

import { BrandTypes, CategoryTypes } from '../constants/types';

/**
 * Check if the selected brand/category combination is cufflinks
 * @param {string} brand - Selected brand
 * @param {string} category - Selected category
 * @returns {boolean} True if it's cufflinks (Rolex + Aksesuar)
 */
export const isCufflinks = (brand, category) =>
  brand === BrandTypes.ROLEX && category === CategoryTypes.AKSESUAR;

/**
 * Check if the selected brand/category combination is a watch
 * @param {string} brand - Selected brand
 * @param {string} category - Selected category
 * @returns {boolean} True if it's a watch (Tudor or Rolex + Saat)
 */
export const isWatch = (brand, category) =>
  brand === BrandTypes.TUDOR ||
  (brand === BrandTypes.ROLEX && category === CategoryTypes.SAAT);

/**
 * Get product type string based on brand/category
 * @param {string} brand - Selected brand
 * @param {string} category - Selected category
 * @returns {string} Product type ('aksesuar' or 'saat')
 */
export const getProductType = (brand, category) =>
  isCufflinks(brand, category) ? 'aksesuar' : 'saat';

/**
 * Get product type genitive form based on brand/category
 * @param {string} brand - Selected brand
 * @param {string} category - Selected category
 * @returns {string} Product type genitive ('aksesuarın' or 'saatin')
 */
export const getProductTypeGenitive = (brand, category) =>
  isCufflinks(brand, category) ? 'aksesuarın' : 'saatin';

/**
 * Get CSS class name for product image based on brand/category
 * @param {string} brand - Selected brand
 * @param {string} category - Selected category
 * @returns {string} CSS class name for product image
 */
export const getProductImageClass = (brand, category) => {
  if (brand === BrandTypes.ROLEX && category === CategoryTypes.SAAT)
    return 'rolex-watch-image';
  if (brand === BrandTypes.TUDOR) return 'tudor-watch-image';
  if (brand === BrandTypes.ROLEX && category === CategoryTypes.AKSESUAR)
    return 'cufflinks-image';
  return 'default-product-image';
};

/**
 * Get brand display name
 * @param {string} brand - Selected brand
 * @returns {string} Brand display name in uppercase
 */
export const getBrandDisplayName = (brand) => {
  const brandNames = {
    [BrandTypes.ROLEX]: 'ROLEX',
    [BrandTypes.TUDOR]: 'TUDOR',
  };
  return brandNames[brand] || brand.toUpperCase();
};
