import React from 'react';

export const Footer: React.FC = () => (
  <footer className="footer" style={{
    background: 'var(--color-bg-dark)',
    color: 'var(--color-text)',
    padding: '1.2rem 0',
    marginTop: 48,
    borderTop: '1px solid var(--color-border)',
    fontSize: 15,
    textAlign: 'center',
    letterSpacing: 0.2,
    boxShadow: '0 -2px 8px rgba(37,99,235,0.04)'
  }}>
    <div className="container">
      <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>E-Commerce</span> &copy; {new Date().getFullYear()} &mdash; All rights reserved.
    </div>
  </footer>
); 