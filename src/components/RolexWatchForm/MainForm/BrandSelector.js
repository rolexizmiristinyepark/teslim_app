/**
 * Marka seçim bileşeni
 * ROLEX (Saat), TUDOR ve CUFFLINKS markalarının seçimini yönetir
 */

import React, { memo, useMemo, useCallback } from 'react';
import { BrandTypes, CategoryTypes } from '../../../constants/types';

const BrandSelector = memo(({
  selectedBrand,
  selectedCategory,
  onBrandChange,
  onCategoryChange
}) => {
  // Buton aktif durum kontrolü - memoized
  const buttonStates = useMemo(() => ({
    isRolexActive: selectedBrand === BrandTypes.ROLEX && selectedCategory === CategoryTypes.SAAT,
    isTudorActive: selectedBrand === BrandTypes.TUDOR,
    isCufflinksActive: selectedBrand === BrandTypes.ROLEX && selectedCategory === CategoryTypes.AKSESUAR
  }), [selectedBrand, selectedCategory]);

  // Handler'lar - memoized with useCallback
  const handleRolexClick = useCallback(() => {
    onBrandChange(BrandTypes.ROLEX);
    onCategoryChange(CategoryTypes.SAAT);
  }, [onBrandChange, onCategoryChange]);

  const handleTudorClick = useCallback(() => {
    onBrandChange(BrandTypes.TUDOR);
    onCategoryChange(CategoryTypes.SAAT); // Tudor her zaman saat kategorisi
  }, [onBrandChange, onCategoryChange]);

  const handleCufflinksClick = useCallback(() => {
    onBrandChange(BrandTypes.ROLEX);
    onCategoryChange(CategoryTypes.AKSESUAR);
  }, [onBrandChange, onCategoryChange]);

  return (
    <div className="payment--options">
      <button
        type="button"
        name="rolex"
        className={buttonStates.isRolexActive ? 'active' : ''}
        onClick={handleRolexClick}
      >
        ROLEX
      </button>
      <button
        type="button"
        name="tudor"
        className={buttonStates.isTudorActive ? 'active' : ''}
        onClick={handleTudorClick}
      >
        TUDOR
      </button>
      <button
        type="button"
        name="cufflinks"
        className={buttonStates.isCufflinksActive ? 'active' : ''}
        onClick={handleCufflinksClick}
      >
        CUFFLINKS
      </button>
    </div>
  );
});

BrandSelector.displayName = 'BrandSelector';

export default BrandSelector;
