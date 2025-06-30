/**
 * Error Boundary Component
 * React uygulamasında JavaScript hatalarını yakalayan ve loglayan component
 * Hata durumunda kullanıcı dostu bir fallback UI gösterir
 */

import { Component } from 'react';
// import { THEME } from '../constants/theme';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Hata durumunda state'i güncelle
    return { hasError: true };
  }

  componentDidCatch(_error, errorInfo) {
    // Hata ve hata bilgilerini state'e kaydet
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    this.setState({
      error: error,
      errorInfo: errorInfo,
      errorId: errorId,
    });

    // Hata loglama
    this.logError(error, errorInfo, errorId);
  }

  logError(error, errorInfo, errorId) {
    // Hata bilgisi loglama development ortamında
    if (process.env.NODE_ENV === 'development') {
      // Development ortamında console loglama
      /* eslint-disable no-console */
      console.group(`🚨 Error Boundary Caught Error [${errorId}]`);
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Stack Trace:', error.stack);
      console.error('Component Stack:', errorInfo.componentStack);
      console.error('Timestamp:', new Date().toISOString());
      console.groupEnd();
      /* eslint-enable no-console */
    }

    // Production'da hata raporlama servisi entegrasyonu için
    if (process.env.NODE_ENV === 'production') {
      // Burada hata raporlama servisi (Sentry, LogRocket, etc.) çağrılabilir
      // this.reportErrorToService(error, errorInfo, errorId);
    }
  }

  reportErrorToService(_error, _errorInfo, _errorId) {
    // Hata raporlama servisi entegrasyonu
    // Örnek: Sentry, LogRocket, custom API
    try {
      // fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     errorId,
      //     message: error.message,
      //     stack: error.stack,
      //     componentStack: errorInfo.componentStack,
      //     timestamp: new Date().toISOString(),
      //     userAgent: navigator.userAgent,
      //     url: window.location.href
      //   })
      // });
    } catch (_reportingError) {
      // Error reporting failed
    }
  }

  handleRetry() {
    // Hata durumunu sıfırla ve tekrar dene
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
  }

  handleReload() {
    // Sayfayı yenile
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center border border-gray-200">
            {/* Error Icon */}
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-red-100">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
            </div>

            {/* Error Message */}
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              Bir Hata Oluştu
            </h2>

            <p className="text-sm mb-6 text-gray-600">
              Üzgünüz, uygulamada beklenmeyen bir hata oluştu. Lütfen sayfayı
              yenilemeyi deneyin.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm font-medium mb-2 text-red-600">
                  Teknik Detaylar
                </summary>
                <div className="text-xs p-3 rounded bg-gray-100 text-gray-700">
                  <div className="font-mono mb-2">
                    <strong>Hata:</strong> {this.state.error.message}
                  </div>
                  <div className="font-mono text-xs opacity-75">
                    <strong>ID:</strong> {this.state.errorId}
                  </div>
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
              >
                Tekrar Dene
              </button>

              <button
                onClick={this.handleReload}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 bg-red-600 text-white border-none hover:opacity-90"
              >
                Sayfayı Yenile
              </button>
            </div>

            {/* Support Info */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Sorun devam ederse lütfen teknik destek ile iletişime geçin.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Hata yoksa children'ı render et
    return this.props.children;
  }
}

export default ErrorBoundary;
