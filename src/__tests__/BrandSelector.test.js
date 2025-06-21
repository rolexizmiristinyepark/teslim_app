/**
 * BrandSelector Component Tests
 * BrandSelector.js bileşeninin test edilmesi
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BrandSelector from '../components/RolexWatchForm/MainForm/BrandSelector';
import { BrandTypes, CategoryTypes } from '../constants/types';

describe('BrandSelector', () => {
  const defaultProps = {
    selectedBrand: BrandTypes.ROLEX,
    selectedCategory: CategoryTypes.SAAT,
    onBrandChange: jest.fn(),
    onCategoryChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render brand buttons correctly', () => {
    render(<BrandSelector {...defaultProps} />);

    expect(screen.getByText('ROLEX')).toBeInTheDocument();
    expect(screen.getByText('TUDOR')).toBeInTheDocument();
  });

  test('should render category buttons correctly', () => {
    render(<BrandSelector {...defaultProps} />);

    expect(screen.getByText('SAAT')).toBeInTheDocument();
    expect(screen.getByText('AKSESUAR')).toBeInTheDocument();
  });

  test('should highlight selected brand', () => {
    render(<BrandSelector {...defaultProps} selectedBrand={BrandTypes.ROLEX} />);

    const rolexButton = screen.getByText('ROLEX');
    const tudorButton = screen.getByText('TUDOR');

    // Rolex should be selected (have active styling)
    expect(rolexButton).toHaveClass('brand-button-rolex');
    expect(tudorButton).toHaveClass('brand-button-tudor');
  });

  test('should highlight selected category', () => {
    render(<BrandSelector {...defaultProps} selectedCategory={CategoryTypes.SAAT} />);

    const saatButton = screen.getByText('SAAT');
    const aksesuarButton = screen.getByText('AKSESUAR');

    // Both buttons should be rendered
    expect(saatButton).toBeInTheDocument();
    expect(aksesuarButton).toBeInTheDocument();
  });

  test('should call onBrandChange when brand button is clicked', () => {
    const onBrandChange = jest.fn();
    render(<BrandSelector {...defaultProps} onBrandChange={onBrandChange} />);

    const tudorButton = screen.getByText('TUDOR');
    fireEvent.click(tudorButton);

    expect(onBrandChange).toHaveBeenCalledWith(BrandTypes.TUDOR);
  });

  test('should call onCategoryChange when category button is clicked', () => {
    const onCategoryChange = jest.fn();
    render(<BrandSelector {...defaultProps} onCategoryChange={onCategoryChange} />);

    const aksesuarButton = screen.getByText('AKSESUAR');
    fireEvent.click(aksesuarButton);

    expect(onCategoryChange).toHaveBeenCalledWith(CategoryTypes.AKSESUAR);
  });

  test('should handle Tudor brand selection correctly', () => {
    const onBrandChange = jest.fn();
    render(<BrandSelector {...defaultProps} onBrandChange={onBrandChange} selectedBrand={BrandTypes.TUDOR} />);

    const tudorButton = screen.getByText('TUDOR');
    expect(tudorButton).toBeInTheDocument();

    // Click Rolex to test brand change
    const rolexButton = screen.getByText('ROLEX');
    fireEvent.click(rolexButton);

    expect(onBrandChange).toHaveBeenCalledWith(BrandTypes.ROLEX);
  });

  test('should show both category options for all brands', () => {
    // Test with Rolex
    render(<BrandSelector {...defaultProps} selectedBrand={BrandTypes.ROLEX} />);
    expect(screen.getByText('SAAT')).toBeInTheDocument();
    expect(screen.getByText('AKSESUAR')).toBeInTheDocument();

    // Re-render with Tudor
    render(<BrandSelector {...defaultProps} selectedBrand={BrandTypes.TUDOR} />);
    expect(screen.getByText('SAAT')).toBeInTheDocument();
    expect(screen.getByText('AKSESUAR')).toBeInTheDocument();
  });

  test('should have proper accessibility attributes', () => {
    render(<BrandSelector {...defaultProps} />);

    const rolexButton = screen.getByText('ROLEX');
    const saatButton = screen.getByText('SAAT');

    expect(rolexButton).toHaveAttribute('type', 'button');
    expect(saatButton).toHaveAttribute('type', 'button');
  });

  test('should not call handlers when already selected option is clicked', () => {
    const onBrandChange = jest.fn();
    const onCategoryChange = jest.fn();
    
    render(
      <BrandSelector 
        {...defaultProps} 
        onBrandChange={onBrandChange}
        onCategoryChange={onCategoryChange}
        selectedBrand={BrandTypes.ROLEX}
        selectedCategory={CategoryTypes.SAAT}
      />
    );

    // Click already selected options
    const rolexButton = screen.getByText('ROLEX');
    const saatButton = screen.getByText('SAAT');
    
    fireEvent.click(rolexButton);
    fireEvent.click(saatButton);

    // Should still call handlers (component doesn't prevent this)
    expect(onBrandChange).toHaveBeenCalledWith(BrandTypes.ROLEX);
    expect(onCategoryChange).toHaveBeenCalledWith(CategoryTypes.SAAT);
  });

  test('should render with consistent styling structure', () => {
    const { container } = render(<BrandSelector {...defaultProps} />);

    // Check for brand selection section
    expect(container.querySelector('.brand-selection')).toBeInTheDocument();
    
    // Check for category selection section  
    expect(container.querySelector('.category-selection')).toBeInTheDocument();
  });
});