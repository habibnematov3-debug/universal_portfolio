import React from 'react';
import { createRoot } from 'react-dom/client';
import ErrorBoundary from './components/ErrorBoundary';
import PortfolioApp from './components/PortfolioApp';
import './personal.css';

const root = document.getElementById('root');
if (!root) throw new Error('Folio root element was not found.');
createRoot(root).render(
  <React.StrictMode>
    <ErrorBoundary>
      <PortfolioApp />
    </ErrorBoundary>
  </React.StrictMode>
);
