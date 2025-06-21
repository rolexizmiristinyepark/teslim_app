/**
 * ErrorBoundary Component Tests
 * ErrorBoundary.js bileşeninin test edilmesi
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../components/ErrorBoundary';

// Test için hata fırlatan dummy component
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error for ErrorBoundary');
  }
  return <div>No Error</div>;
};

// Console.error'ı mock'la - test sırasında error loglarını engellemek için
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('No Error')).toBeInTheDocument();
  });

  test('should render error UI when there is an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Bir Hata Oluştu')).toBeInTheDocument();
    expect(screen.getByText(/Üzgünüz, uygulamada beklenmeyen bir hata oluştu/)).toBeInTheDocument();
  });

  test('should show error details in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Teknik Detaylar')).toBeInTheDocument();
    
    process.env.NODE_ENV = originalEnv;
  });

  test('should hide error details in production mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.queryByText('Teknik Detaylar')).not.toBeInTheDocument();
    
    process.env.NODE_ENV = originalEnv;
  });

  test('should have retry button that resets error state', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Error UI should be visible
    expect(screen.getByText('Bir Hata Oluştu')).toBeInTheDocument();

    // Click retry button
    const retryButton = screen.getByText('Tekrar Dene');
    fireEvent.click(retryButton);

    // Re-render with no error
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    // Should show normal content again
    expect(screen.getByText('No Error')).toBeInTheDocument();
  });

  test('should have reload button that calls window.location.reload', () => {
    // Mock window.location.reload
    const mockReload = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true
    });

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const reloadButton = screen.getByText('Sayfayı Yenile');
    fireEvent.click(reloadButton);

    expect(mockReload).toHaveBeenCalled();
  });

  test('should log error details when error occurs', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const consoleGroupSpy = jest.spyOn(console, 'group').mockImplementation(() => {});
    const consoleGroupEndSpy = jest.spyOn(console, 'groupEnd').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(consoleGroupSpy).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Error:', expect.any(Error));
    expect(consoleGroupEndSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
    consoleGroupSpy.mockRestore();
    consoleGroupEndSpy.mockRestore();
  });

  test('should display correct Turkish error messages', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Bir Hata Oluştu')).toBeInTheDocument();
    expect(screen.getByText(/Üzgünüz, uygulamada beklenmeyen bir hata oluştu/)).toBeInTheDocument();
    expect(screen.getByText(/Lütfen sayfayı yenilemeyi deneyin/)).toBeInTheDocument();
    expect(screen.getByText('Tekrar Dene')).toBeInTheDocument();
    expect(screen.getByText('Sayfayı Yenile')).toBeInTheDocument();
  });

  test('should have support information', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Sorun devam ederse lütfen teknik destek ile iletişime geçin/)).toBeInTheDocument();
  });

  test('should handle multiple errors correctly', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // First error
    expect(screen.getByText('Bir Hata Oluştu')).toBeInTheDocument();

    // Reset and cause another error
    const retryButton = screen.getByText('Tekrar Dene');
    fireEvent.click(retryButton);

    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Should still show error UI
    expect(screen.getByText('Bir Hata Oluştu')).toBeInTheDocument();
  });
});