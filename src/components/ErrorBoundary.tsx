import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[Folio] Error caught by boundary:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '48px 24px', textAlign: 'center', fontFamily: 'system-ui, sans-serif', color: '#2a3a2c', minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
          <div style={{ maxWidth: 440 }}>
            <h1 style={{ fontSize: 28, marginBottom: 16, letterSpacing: '-1px' }}>Xatolik yuz berdi</h1>
            <p style={{ fontSize: 14, color: '#5c665f', lineHeight: 1.7, marginBottom: 24 }}>
              Portfolio yuklanayotganda kutilmagan xatolik ro‘y berdi. Sahifani qayta yuklang yoki brauzerdagi ma’lumotlarni tozalang.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => location.reload()}
                style={{ padding: '12px 24px', background: '#315d4d', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', font: '14px system-ui' }}
              >
                Sahifani yangilash
              </button>
              <button
                onClick={() => {
                  try {
                    Object.keys(localStorage).filter(k => k.startsWith('folio')).forEach(k => localStorage.removeItem(k));
                  } catch {}
                  location.reload();
                }}
                style={{ padding: '12px 24px', background: 'white', color: '#2a3a2c', border: '1px solid #c6d1c4', borderRadius: 6, cursor: 'pointer', font: '14px system-ui' }}
              >
                Ma’lumotlarni tozalash
              </button>
            </div>
            <details style={{ marginTop: 32, textAlign: 'left', fontSize: 12, color: '#888' }}>
              <summary style={{ cursor: 'pointer' }}>Texnik tafsilotlar</summary>
              <pre style={{ whiteSpace: 'pre-wrap', marginTop: 8, padding: 12, background: '#f5f5f5', borderRadius: 6, overflow: 'auto' }}>
                {this.state.error.message}
              </pre>
            </details>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
