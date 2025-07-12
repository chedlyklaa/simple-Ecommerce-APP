import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={{
      background: 'rgba(161, 62, 151, 0.85)',
      color: '#22223b',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      padding: '0.5rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>
      <div className="container flex justify-between" style={{ alignItems: 'center' }}>
        <div className="flex gap-4" style={{ alignItems: 'center' }}>
          <Link to="/" style={{
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--color-text-light)',
            letterSpacing: 1,
            marginRight: 32,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
          }}>
            <img src="/images/logo/LOGO.png" alt="icare logo" style={{ height: '40px', marginRight: '10px' }} />
            <span className="font-bold text-xl tracking-tight" style={{ color: '#22223b' }}>icare</span>
          </Link>
          <Link to="/" className="text-light text-bold text-sm" style={{ color: '#22223b', marginRight: 8, textDecoration: 'none', padding: '0.3rem 0.7rem', borderRadius: 8, transition: 'background 0.2s' }}>
            Products
          </Link>
          {user && <Link to="/purchases" className="text-light text-bold text-sm" style={{ marginRight: 8, textDecoration: 'none', padding: '0.3rem 0.7rem', borderRadius: 8, transition: 'background 0.2s' }}>My Purchases</Link>}
          {user && <Link to="/reclamations" className="text-light text-bold text-sm" style={{ marginRight: 8, textDecoration: 'none', padding: '0.3rem 0.7rem', borderRadius: 8, transition: 'background 0.2s' }}>Reclamations</Link>}
          {user?.role === 'admin' && (
            <Link 
              to="/admin" 
              style={{ 
                textDecoration: 'none', 
                padding: '0.5rem 1rem', 
                borderRadius: 12, 
                transition: 'all 0.2s',
                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                color: 'white',
                fontWeight: 600,
                fontSize: 14,
                boxShadow: '0 2px 8px rgba(124,58,237,0.3)',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <span style={{ fontSize: 16 }}>👑</span>
              Admin Dashboard
            </Link>
          )}
        </div>
        <div className="flex gap-2" style={{ alignItems: 'center' }}>
          {user ? (
            <>
              <span className="text-light text-sm" style={{ marginRight: 8, fontWeight: 500 }}>{user.email}</span>
              <button onClick={logout} className="bg-white text-primary text-bold" style={{ border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}>Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-light text-bold text-sm" style={{ marginRight: 6, textDecoration: 'none', padding: '0.3rem 0.9rem', borderRadius: 8, transition: 'background 0.2s' }}>Sign in</Link>
              <Link to="/signup" className="bg-white text-primary text-bold" style={{ borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 600, textDecoration: 'none', transition: 'background 0.2s' }}>Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}; 