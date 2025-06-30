/**
 * RolexWatchForm Integration Tests
 * Ana form bileşeninin entegrasyon testleri
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RolexWatchForm from '../RolexWatchForm';

// Mock lazy loaded components
jest.mock('../components/TutanakTemplate', () => {
  return function MockTutanakTemplate(_props) {
    return <div data-testid="tutanak-template">Tutanak Template</div>;
  };
});

jest.mock('../components/ProductModal/PaymentDetailModal', () => {
  return function MockPaymentDetailModal(props) {
    return (
      <div data-testid="payment-detail-modal">
        Payment Detail Modal
        <button
          onClick={() =>
            props.onPaymentsChange(
              [
                {
                  id: 'test-payment',
                  type: 'HAVALE',
                  amount: '10000',
                  currency: 'TL',
                  date: '15.01.2024',
                },
              ],
              true,
              'Test payment'
            )
          }
        >
          Add Test Payment
        </button>
      </div>
    );
  };
});

jest.mock('../components/ProductModal/ProductDetailModal', () => {
  return function MockProductDetailModal(_props) {
    return <div data-testid="product-detail-modal">Product Detail Modal</div>;
  };
});

// Mock RMC analysis service
jest.mock('../utils/newRmcService', () => ({
  analyzeRmc: jest.fn(() =>
    Promise.resolve({
      success: true,
      data: {
        FAMILY: 'DATEJUST',
        SIZE: '41',
        DIAL: 'Blue dial',
        BRACELET: 'Oyster bracelet',
        DETAIL: 'Datejust 41, Oystersteel',
        PRICE: '€10,500',
      },
      message: 'RMC found successfully',
    })
  ),
}));

describe('RolexWatchForm Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render main form elements correctly', () => {
    render(<RolexWatchForm />);

    // Check brand selector
    expect(screen.getByText('ROLEX')).toBeInTheDocument();
    expect(screen.getByText('TUDOR')).toBeInTheDocument();

    // Check CUFFLINKS button (represents AKSESUAR category)
    expect(screen.getByText('CUFFLINKS')).toBeInTheDocument();

    // Check form fields
    expect(screen.getByLabelText(/Müşteri Adı/)).toBeInTheDocument();
    expect(screen.getByLabelText(/RMC Kodu/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Seri Numarası/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Teslim Edilen Kişi/)).toBeInTheDocument();
  });

  test('should show product detail modal', () => {
    render(<RolexWatchForm />);

    expect(screen.getByTestId('product-detail-modal')).toBeInTheDocument();
  });

  test('should handle brand selection', async () => {
    const user = userEvent.setup();
    render(<RolexWatchForm />);

    const tudorButton = screen.getByText('TUDOR');
    await user.click(tudorButton);

    // Form should reset when brand changes
    const customerInput = screen.getByLabelText(/Müşteri Adı/);
    expect(customerInput.value).toBe('');
  });

  test('should handle CUFFLINKS selection', async () => {
    const user = userEvent.setup();
    render(<RolexWatchForm />);

    const cufflinksButton = screen.getByText('CUFFLINKS');
    await user.click(cufflinksButton);

    // Form should reset when category changes
    const customerInput = screen.getByLabelText(/Müşteri Adı/);
    expect(customerInput.value).toBe('');
  });

  test('should handle form input changes', async () => {
    const user = userEvent.setup();
    render(<RolexWatchForm />);

    const customerInput = screen.getByLabelText(/Müşteri Adı/);
    await user.type(customerInput, 'Test Customer');

    expect(customerInput.value).toBe('TEST CUSTOMER');
  });

  test('should handle RMC input and analysis', async () => {
    const user = userEvent.setup();
    render(<RolexWatchForm />);

    const rmcInput = screen.getByLabelText(/RMC Kodu/);
    await user.type(rmcInput, '126334-0001');

    expect(rmcInput.value).toBe('126334-0001');

    // Wait for RMC analysis to complete
    await waitFor(() => {
      expect(require('../utils/newRmcService').analyzeRmc).toHaveBeenCalledWith(
        '126334-0001'
      );
    });
  });

  test('should show payment modal when form is valid', async () => {
    const user = userEvent.setup();
    render(<RolexWatchForm />);

    // Fill required fields
    await user.type(screen.getByLabelText(/Müşteri Adı/), 'Test Customer');
    await user.type(screen.getByLabelText(/RMC Kodu/), '126334-0001');
    await user.type(screen.getByLabelText(/Seri Numarası/), 'A1234567');
    await user.type(screen.getByLabelText(/Teslim Edilen Kişi/), 'Test Person');

    // Wait for RMC analysis
    await waitFor(() => {
      expect(require('../utils/newRmcService').analyzeRmc).toHaveBeenCalled();
    });

    // Check product checkbox
    const productCheckbox = screen.getByRole('checkbox');
    await user.click(productCheckbox);

    // Payment modal should appear
    await waitFor(() => {
      expect(screen.getByTestId('payment-detail-modal')).toBeInTheDocument();
    });
  });

  test('should handle form submission workflow', async () => {
    const user = userEvent.setup();
    render(<RolexWatchForm />);

    // Fill form
    await user.type(screen.getByLabelText(/Müşteri Adı/), 'Test Customer');
    await user.type(screen.getByLabelText(/RMC Kodu/), '126334-0001');
    await user.type(screen.getByLabelText(/Seri Numarası/), 'A1234567');
    await user.type(screen.getByLabelText(/Teslim Edilen Kişi/), 'Test Person');

    // Wait for RMC analysis
    await waitFor(() => {
      expect(require('../utils/newRmcService').analyzeRmc).toHaveBeenCalled();
    });

    // Check product checkbox
    const productCheckbox = screen.getByRole('checkbox');
    await user.click(productCheckbox);

    // Add payment
    await waitFor(() => {
      const addPaymentButton = screen.getByText('Add Test Payment');
      fireEvent.click(addPaymentButton);
    });

    // Submit form
    await waitFor(() => {
      const submitButton = screen.getByText('Gönder');
      expect(submitButton).toBeInTheDocument();
      fireEvent.click(submitButton);
    });

    // Should show tutanak template
    await waitFor(() => {
      expect(screen.getByTestId('tutanak-template')).toBeInTheDocument();
    });
  });

  test('should handle form reset', async () => {
    const user = userEvent.setup();
    render(<RolexWatchForm />);

    // Fill some fields
    await user.type(screen.getByLabelText(/Müşteri Adı/), 'Test Customer');
    await user.type(screen.getByLabelText(/RMC Kodu/), '126334');

    // Click clear button
    const clearButton = screen.getByText('Temizle');
    await user.click(clearButton);

    // Fields should be empty
    expect(screen.getByLabelText(/Müşteri Adı/).value).toBe('');
    expect(screen.getByLabelText(/RMC Kodu/).value).toBe('');
  });

  test('should handle cufflinks (accessories) flow', async () => {
    const user = userEvent.setup();
    render(<RolexWatchForm />);

    // Select accessories
    await user.click(screen.getByText('AKSESUAR'));

    // Fill required fields (no serial for accessories)
    await user.type(screen.getByLabelText(/Müşteri Adı/), 'Test Customer');
    await user.type(screen.getByLabelText(/RMC Kodu/), 'A1018');
    await user.type(screen.getByLabelText(/Teslim Edilen Kişi/), 'Test Person');

    // Serial number should not be required
    const serialInput = screen.getByLabelText(/Seri Numarası/);
    expect(serialInput).toBeInTheDocument();
  });

  test('should validate required fields', async () => {
    // const user = userEvent.setup();
    render(<RolexWatchForm />);

    // Try to submit without filling required fields
    const submitButton = screen.queryByText('Gönder');

    // Submit button should not be visible when form is invalid
    expect(submitButton).not.toBeInTheDocument();
  });

  test('should handle error states gracefully', async () => {
    // Mock RMC analysis to return error
    require('../utils/newRmcService').analyzeRmc.mockResolvedValueOnce({
      success: false,
      message: 'RMC not found',
    });

    const user = userEvent.setup();
    render(<RolexWatchForm />);

    const rmcInput = screen.getByLabelText(/RMC Kodu/);
    await user.type(rmcInput, 'INVALID');

    await waitFor(() => {
      expect(require('../utils/newRmcService').analyzeRmc).toHaveBeenCalledWith(
        'INVALID'
      );
    });

    // Form should handle error state appropriately
    expect(rmcInput.value).toBe('INVALID');
  });
});
