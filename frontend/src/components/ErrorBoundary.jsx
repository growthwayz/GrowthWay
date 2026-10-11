import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('GrowthWay ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FAF8F5',
          color: '#111111',
          padding: '24px',
          fontFamily: "'Inter', system-ui, sans-serif",
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '480px',
            backgroundColor: '#FFFFFF',
            padding: '36px',
            borderRadius: '16px',
            border: '1px solid #E5E2DC',
            boxShadow: '0 20px 40px rgba(0,0,0,0.06)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'rgba(92, 158, 49, 0.1)',
              border: '1px solid rgba(92, 158, 49, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              color: '#5C9E31',
              fontSize: '20px',
              fontWeight: 'bold'
            }}>
              ✦
            </div>
            <h2 style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontSize: '22px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              marginBottom: '12px',
              color: '#111111'
            }}>
              Studio Recovery
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#666660',
              lineHeight: 1.6,
              marginBottom: '24px'
            }}>
              A display component encountered a transient rendering refresh. Click below to re-initialize the studio experience.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={this.handleReload}
                style={{
                  backgroundColor: '#111111',
                  color: '#FFFFFF',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  border: 'none'
                }}
              >
                Reload Studio
              </button>
              <a
                href="/"
                style={{
                  backgroundColor: '#FAF8F5',
                  color: '#111111',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  textDecoration: 'none',
                  border: '1px solid #E5E2DC'
                }}
              >
                Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
