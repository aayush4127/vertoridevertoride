import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Client-side unhandled rejection guard to prevent console errors
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    console.warn('[Verrto Ride Client Guard] Handled async rejection:', event.reason);
    event.preventDefault();
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
