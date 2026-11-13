'use client';
import { lazy, Suspense, useEffect, useState } from 'react';
import ErrorBoundary from './ErrorBoundary';
import PersonalPortfolio from './PersonalPortfolio';
import { publishedPortfolio } from '../published-portfolio';

const OwnerEditor = lazy(() => import('./OwnerEditor'));

export default function PortfolioApp() {
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const sync = () => {
      setEditing(new URLSearchParams(location.search).get('edit') === '1');
    };
    sync();
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  const handleEdit = () => {
    const url = new URL(location.href);
    url.searchParams.set('edit', '1');
    history.pushState(null, '', url);
    setEditing(true);
  };

  return (
    <ErrorBoundary>
      {editing ? (
        <Suspense fallback={<p role="status">Yuklanmoqda / Загрузка / Loading…</p>}>
          <OwnerEditor initial={publishedPortfolio} />
        </Suspense>
      ) : (
        <PersonalPortfolio data={publishedPortfolio} onEdit={handleEdit} />
      )}
    </ErrorBoundary>
  );
}
