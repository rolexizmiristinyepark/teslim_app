/**
 * Error Boundary Component
 * React uygulamasında JavaScript hatalarını yakalayan ve loglayan component
 * Hata durumunda kullanıcı dostu bir fallback UI gösterir
 */

import React, { Component } from 'react';
import { THEME } from '../constants/theme';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Hata durumunda state'i güncelle
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Hata ve hata bilgilerini state'e kaydet
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.setState({
      error: error,
      errorInfo: errorInfo,
      errorId: errorId
    });

    // Hata loglama
    this.logError(error, errorInfo, errorId);
  }

  logError = (error, errorInfo, errorId) => {
    // Console'a detaylı hata bilgisi
    console.group(`🚨 Error Boundary Caught Error [${errorId}]`);
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Stack Trace:', error.stack);
    console.error('Component Stack:', errorInfo.componentStack);
    console.error('Timestamp:', new Date().toISOString());
    console.groupEnd();

    // Production'da hata raporlama servisi entegrasyonu için
    if (process.env.NODE_ENV === 'production') {
      // Burada hata raporlama servisi (Sentry, LogRocket, etc.) çağrılabilir
      // this.reportErrorToService(error, errorInfo, errorId);
    }
  };

  reportErrorToService = (error, errorInfo, errorId) => {
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
    } catch (reportingError) {
      console.error('Error reporting failed:', reportingError);
    }
  };

  handleRetry = () => {
    // Hata durumunu sıfırla ve tekrar dene
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  handleReload = () => {
    // Sayfayı yenile
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div 
          className="min-h-screen flex items-center justify-center p-4"
          style={{ backgroundColor: THEME.colors.neutral[50] }}
        >
          <div 
            className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center"
            style={{ 
              border: `1px solid ${THEME.colors.neutral[200]}`,
              borderRadius: THEME.borderRadius.xl 
            }}
          >
            {/* Error Icon */}
            <div className="mb-4">
              <div 
                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                style={{ backgroundColor: THEME.colors.status.error + '20' }}
              >
                <svg 
                  width="32" 
                  height="32" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke={THEME.colors.status.error}
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              </div>
            </div>

            {/* Error Message */}
            <h2 
              className="text-xl font-semibold mb-2"
              style={{ color: THEME.colors.neutral[800] }}
            >
              Bir Hata Oluştu
            </h2>
            
            <p 
              className="text-sm mb-6"
              style={{ color: THEME.colors.neutral[600] }}
            >
              Üzgünüz, uygulamada beklenmeyen bir hata oluştu. 
              Lütfen sayfayı yenilemeyi deneyin.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary 
                  className="cursor-pointer text-sm font-medium mb-2"
                  style={{ color: THEME.colors.status.error }}
                >
                  Teknik Detaylar
                </summary>
                <div 
                  className="text-xs p-3 rounded"
                  style={{ 
                    backgroundColor: THEME.colors.neutral[100],
                    color: THEME.colors.neutral[700]
                  }}
                >
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
                className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                style={{
                  backgroundColor: THEME.colors.neutral[100],
                  color: THEME.colors.neutral[700],
                  border: `1px solid ${THEME.colors.neutral[200]}`
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = THEME.colors.neutral[200];
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = THEME.colors.neutral[100];
                }}
              >
                Tekrar Dene
              </button>
              
              <button
                onClick={this.handleReload}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                style={{
                  backgroundColor: THEME.colors.status.error,
                  color: 'white',
                  border: 'none'
                }}
                onMouseEnter={(e) => {
                  e.target.style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = '1';
                }}
              >
                Sayfayı Yenile
              </button>
            </div>

            {/* Support Info */}
            <div className="mt-6 pt-4 border-t" style={{ borderColor: THEME.colors.neutral[200] }}>
              <p 
                className="text-xs"
                style={{ color: THEME.colors.neutral[500] }}
              >
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