/**
 * AuthGuard Component
 * API key ile giriş koruması sağlar
 * localStorage'da API key saklar
 */

import React, { useState, useEffect } from 'react';

// API key'i localStorage'dan al
const getStoredApiKey = () => {
  return localStorage.getItem('teslim_app_api_key');
};

// API key'i localStorage'a kaydet
const storeApiKey = (key) => {
  localStorage.setItem('teslim_app_api_key', key);
};

// API key'i localStorage'dan sil
const clearApiKey = () => {
  localStorage.removeItem('teslim_app_api_key');
};

// Doğru API key (production'da environment variable kullanılmalı)
const VALID_API_KEY = 'ROLEX_TESLIM_2024';

const AuthGuard = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Component mount olduğunda localStorage'ı kontrol et
  useEffect(() => {
    const storedKey = getStoredApiKey();
    if (storedKey && storedKey === VALID_API_KEY) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();

    if (apiKey === VALID_API_KEY) {
      storeApiKey(apiKey);
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Geçersiz API key. Lütfen tekrar deneyin.');
      setApiKey('');
    }
  };

  // Logout handler
  const handleLogout = () => {
    clearApiKey();
    setIsAuthenticated(false);
    setApiKey('');
  };

  // Loading state
  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingBox}>
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Authenticated - show app
  if (isAuthenticated) {
    return (
      <>
        {children}
        <button
          onClick={handleLogout}
          style={styles.logoutButton}
          title="Çıkış Yap"
        >
          🔓 Çıkış
        </button>
      </>
    );
  }

  // Not authenticated - show login form
  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <div style={styles.header}>
          <img
            src="/teslim_app/images/rolex.png"
            alt="Rolex"
            style={styles.logo}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <h1 style={styles.title}>Teslim Tutanağı Sistemi</h1>
          <p style={styles.subtitle}>Giriş yapmak için API key gereklidir</p>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="apiKey" style={styles.label}>
              API Key
            </label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setError('');
              }}
              placeholder="API key girin"
              style={styles.input}
              autoComplete="off"
              autoFocus
            />
          </div>

          {error && (
            <div style={styles.error}>
              ⚠️ {error}
            </div>
          )}

          <button type="submit" style={styles.button}>
            🔐 Giriş Yap
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Rolex İzmir İstinyepark
          </p>
        </div>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
    padding: '20px',
  },
  loginBox: {
    background: '#FFFFFF',
    borderRadius: '8px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
    padding: '40px',
    maxWidth: '420px',
    width: '100%',
  },
  loadingBox: {
    background: '#FFFFFF',
    borderRadius: '8px',
    padding: '40px',
    textAlign: 'center',
    color: '#1A1A2E',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  logo: {
    height: '60px',
    marginBottom: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '400',
    color: '#1A1A2E',
    margin: '0 0 8px 0',
    fontFamily: "'Playfair Display', serif",
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    margin: '0',
  },
  form: {
    marginTop: '30px',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '400',
    color: '#1A1A2E',
    marginBottom: '8px',
    letterSpacing: '0.5px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '14px',
    border: '1px solid #E8E8E8',
    borderRadius: '2px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    fontFamily: "'Montserrat', sans-serif",
  },
  button: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    fontWeight: '400',
    color: '#FFFFFF',
    background: '#1A1A2E',
    border: 'none',
    borderRadius: '2px',
    cursor: 'pointer',
    transition: 'background 0.2s',
    letterSpacing: '0.5px',
    fontFamily: "'Montserrat', sans-serif",
  },
  error: {
    padding: '12px',
    background: '#FEF2F2',
    border: '1px solid #FCA5A5',
    borderRadius: '2px',
    color: '#991B1B',
    fontSize: '13px',
    marginBottom: '20px',
  },
  footer: {
    marginTop: '30px',
    textAlign: 'center',
    borderTop: '1px solid #E8E8E8',
    paddingTop: '20px',
  },
  footerText: {
    fontSize: '12px',
    color: '#999',
    margin: '0',
  },
  logoutButton: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '8px 16px',
    fontSize: '12px',
    fontWeight: '400',
    color: '#FFFFFF',
    background: '#1A1A2E',
    border: 'none',
    borderRadius: '2px',
    cursor: 'pointer',
    transition: 'background 0.2s',
    letterSpacing: '0.5px',
    zIndex: 9999,
    fontFamily: "'Montserrat', sans-serif",
  },
};

export default AuthGuard;
