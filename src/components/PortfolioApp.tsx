'use client';
import { lazy, Suspense, useEffect, useState } from 'react';
import PersonalPortfolio from './PersonalPortfolio';
import { publishedPortfolio } from '../published-portfolio';
const OwnerEditor = lazy(() => import('./OwnerEditor'));
export default function PortfolioApp() {
  const [editing, setEditing] = useState(false);
  useEffect(() => { setEditing(new URLSearchParams(location.search).get('edit') === '1'); }, []);
  return editing ? <Suspense fallback={<p role="status">Yuklanmoqda / Загрузка / Loading…</p>}><OwnerEditor initial={publishedPortfolio} /></Suspense> : <PersonalPortfolio data={publishedPortfolio} />;
}
