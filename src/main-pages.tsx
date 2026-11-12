import React from 'react';
import { createRoot } from 'react-dom/client';
import PortfolioApp from './components/PortfolioApp';
import './personal.css';

const root = document.getElementById('root');
if (!root) throw new Error('Folio root element was not found.');
createRoot(root).render(<React.StrictMode><PortfolioApp /></React.StrictMode>);
