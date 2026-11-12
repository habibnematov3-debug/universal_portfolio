import React from 'react';
import { createRoot } from 'react-dom/client';
import PersonalPortfolio from './components/PersonalPortfolio';
import './personal.css';

const root = document.getElementById('root');
if (!root) throw new Error('Folio root element was not found.');
createRoot(root).render(<React.StrictMode><PersonalPortfolio /></React.StrictMode>);
