import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Automatically prefix relative /api calls if a remote backend URL is specified
const configuredApiUrl = import.meta.env.VITE_API_URL;
if (configuredApiUrl && typeof window !== 'undefined') {
  const normalizedBase = configuredApiUrl.replace(/\/$/, '');
  const nativeFetch = window.fetch;
  window.fetch = function (input, init) {
    if (typeof input === 'string' && input.startsWith('/api')) {
      return nativeFetch(`${normalizedBase}${input}`, init);
    }
    return nativeFetch(input, init);
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
