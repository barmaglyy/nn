import { createRoot } from 'react-dom/client';

import App from './App';
import AdminApp from './AdminApp';
import { ErrorBoundary } from '@/components/error-boundary';

import './index.css';

createRoot(document.getElementById('root')!, {
  // Keeps caught errors off reportError(), which would raise the dev overlay.
  onCaughtError: (error, errorInfo) => {
    console.error(error, errorInfo.componentStack);
  },
}).render(
  <ErrorBoundary>
    {window.location.pathname.replace(/\/+$/, '').endsWith('/admin') ? <AdminApp /> : <App />}
  </ErrorBoundary>,
);
