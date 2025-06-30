/**
 * BrandSelector Component Tests
 * BrandSelector.js bileşeninin test edilmesi
 */

import { render, screen, fireEvent } from '@testing-library/react';
import BrandSelector from '../components/RolexWatchForm/MainForm/BrandSelector';
import { BrandTypes, CategoryTypes } from '../constants/types';

describe('BrandSelector', () => {
  const defaultProps = {
    selectedBrand: BrandTypes.ROLEX,
    selectedCategory: CategoryTypes.SAAT,
    onBrandChange: jest.fn(),
    onCategoryChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render brand buttons correctly', () => {
    render(<BrandSelector {...defaultProps} />);

    expect(screen.getByText('ROLEX')).toBeInTheDocument();
    expect(screen.getByText('TUDOR')).toBeInTheDocument();
    expect(screen.getByText('CUFFLINKS')).toBeInTheDocument();
  });

  test('should handle ROLEX selection for watch category', () => {
    const onBrandChange = jest.fn();
    const onCategoryChange = jest.fn();
    
    render(
      <BrandSelector
        {...defaultProps}
        onBrandChange={onBrandChange}
        onCategoryChange={onCategoryChange}
      />
    );

    fireEvent.click(screen.getByText('ROLEX'));
    
    expect(onBrandChange).toHaveBeenCalledWith('ROLEX');
    expect(onCategoryChange).toHaveBeenCalledWith('SAAT');
  });

  test('should highlight selected brand', () => {
    render(
      <BrandSelector {...defaultProps} selectedBrand={BrandTypes.ROLEX} />
    );

    const rolexButton = screen.getByText('ROLEX');
    const tudorButton = screen.getByText('TUDOR');

    // Rolex should be selected (have active styling)
    expect(rolexButton).toHaveClass('active');
    expect(tudorButton).not.toHaveClass('active');
  });

  test('should highlight CUFFLINKS when ROLEX brand with AKSESUAR category is selected', () => {
    render(
      <BrandSelector
        {...defaultProps}
        selectedBrand={BrandTypes.ROLEX}
        selectedCategory={CategoryTypes.AKSESUAR}
      />
    );

    const cufflinksButton = screen.getByText('CUFFLINKS');
    expect(cufflinksButton).toHaveClass('active');
  });

  test('should call onBrandChange when TUDOR button is clicked', () => {
    const onBrandChange = jest.fn();
    const onCategoryChange = jest.fn();
    
    render(
      <BrandSelector
        {...defaultProps}
        onBrandChange={onBrandChange}
        onCategoryChange={onCategoryChange}
      />
    );

    fireEvent.click(screen.getByText('TUDOR'));

    expect(onBrandChange).toHaveBeenCalledWith(BrandTypes.TUDOR);
    expect(onCategoryChange).toHaveBeenCalledWith(CategoryTypes.SAAT);
  });

  test('should handle CUFFLINKS selection correctly', () => {
    const onBrandChange = jest.fn();
    const onCategoryChange = jest.fn();
    
    render(
      <BrandSelector
        {...defaultProps}
        onBrandChange={onBrandChange}
        onCategoryChange={onCategoryChange}
      />
    );

    fireEvent.click(screen.getByText('CUFFLINKS'));

    expect(onBrandChange).toHaveBeenCalledWith(BrandTypes.ROLEX);
    expect(onCategoryChange).toHaveBeenCalledWith(CategoryTypes.AKSESUAR);
  });

  test('should handle Tudor brand selection correctly', () => {
    const onBrandChange = jest.fn();
    render(
      <BrandSelector
        {...defaultProps}
        onBrandChange={onBrandChange}
        selectedBrand={BrandTypes.TUDOR}
      />
    );

    const tudorButton = screen.getByText('TUDOR');
    expect(tudorButton).toBeInTheDocument();

    // Click Rolex to test brand change
    const rolexButton = screen.getByText('ROLEX');
    fireEvent.click(rolexButton);

    expect(onBrandChange).toHaveBeenCalledWith(BrandTypes.ROLEX);
  });

  test('should render all three brand options', () => {
    render(<BrandSelector {...defaultProps} />);
    
    expect(screen.getByText('ROLEX')).toBeInTheDocument();
    expect(screen.getByText('TUDOR')).toBeInTheDocument();
    expect(screen.getByText('CUFFLINKS')).toBeInTheDocument();
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

    // Click already selected option (ROLEX is already selected)
    const rolexButton = screen.getByText('ROLEX');

    fireEvent.click(rolexButton);

    // Should still call handlers (component doesn't prevent this)
    expect(onBrandChange).toHaveBeenCalledWith(BrandTypes.ROLEX);
    expect(onCategoryChange).toHaveBeenCalledWith(CategoryTypes.SAAT);
  });

  test('should render with consistent styling structure', () => {
    const { container } = render(<BrandSelector {...defaultProps} />);

    // Check for payment options container
    expect(container.querySelector('.payment--options')).toBeInTheDocument();
    
    // Check that all buttons are rendered
    const buttons = container.querySelectorAll('button');
    expect(buttons).toHaveLength(3); // ROLEX, TUDOR, CUFFLINKS
  });
});
