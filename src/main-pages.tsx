import React from 'react';
import { createRoot } from 'react-dom/client';
import Studio from './components/Studio';
import '../app/globals.css';

const root = document.getElementById('root');
if (!root) throw new Error('Folio root element was not found.');
createRoot(root).render(<React.StrictMode><Studio /></React.StrictMode>);
