/**
 * Uygulamanın entry point'i
 * Bu dosya React uygulamasını DOM'a mount eder
 */

import React from 'react';
import ReactDOM from 'react-dom/client';

import ErrorBoundary from './components/ErrorBoundary';
import RolexWatchForm from './RolexWatchForm';
import './index.css';

// Uygulamayı root element'e mount et
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <RolexWatchForm />
    </ErrorBoundary>
  </React.StrictMode>
);
