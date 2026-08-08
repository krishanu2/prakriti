import { Component } from 'react';

// Last-resort safety net: if anything in the render tree throws an error we
// didn't anticipate, this catches it and shows a plain, reloadable fallback
// instead of leaving the visitor staring at a blank white page. Uses inline
// styles only (no Tailwind classes, no external state) so it renders
// correctly no matter what else on the page is broken.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Unhandled UI error:', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const isAdmin = this.props.context === 'admin';

    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '32px',
          background: '#F2E9DC',
          color: '#1A1917',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        <p
          style={{
            fontFamily: 'Archivo, system-ui, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
            marginBottom: '12px',
          }}
        >
          Something went wrong.
        </p>
        <p style={{ maxWidth: 420, marginBottom: '24px', color: 'rgba(26,25,23,0.7)', lineHeight: 1.6 }}>
          {isAdmin
            ? "The admin panel hit an unexpected error. Reloading usually fixes it — nothing you've saved is affected."
            : 'This page hit an unexpected error. Reloading usually fixes it.'}
        </p>
        <button
          onClick={this.handleReload}
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 600,
            fontSize: '13px',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: '#1A1917',
            background: 'transparent',
            border: '1.5px solid #1A1917',
            padding: '14px 28px',
            borderRadius: '2px',
            cursor: 'pointer',
          }}
        >
          Reload the page
        </button>
      </div>
    );
  }
}
