import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'var(--color-card)',
        borderRadius: 20,
        padding: '2.5rem',
        boxShadow: '0 8px 32px rgba(37,99,235,0.12)',
        border: '1px solid rgba(37,99,235,0.1)',
        maxWidth: 420,
        width: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 100,
          height: 100,
          background: 'linear-gradient(45deg, var(--color-primary), var(--color-primary-light))',
          borderRadius: '50%',
          opacity: 0.1
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 80,
          height: 80,
          background: 'linear-gradient(45deg, var(--color-primary-light), var(--color-primary))',
          borderRadius: '50%',
          opacity: 0.1
        }}></div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32, position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 60,
            height: 60,
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 4px 16px rgba(37,99,235,0.2)'
          }}>
            <span style={{ fontSize: 24, color: 'white', fontWeight: 700 }}>🔐</span>
          </div>
          <h1 style={{
            fontSize: 28,
            fontWeight: 700,
            color: 'var(--color-primary)',
            marginBottom: 8,
            letterSpacing: 0.5
          }}>
            Welcome Back
          </h1>
          <p style={{
            fontSize: 16,
            color: '#666',
            lineHeight: 1.5
          }}>
            Sign in to your account to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1 }}>
          {error && (
            <div style={{
              background: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fecaca',
              borderRadius: 12,
              padding: 16,
              marginBottom: 20,
              fontSize: 14,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <span style={{ fontSize: 16 }}>⚠️</span>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block',
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--color-text)',
              marginBottom: 8
            }}>
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: 12,
                border: '2px solid var(--color-border)',
                fontSize: 16,
                background: 'var(--color-bg)',
                color: 'var(--color-text)',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'block',
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--color-text)',
              marginBottom: 8
            }}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: 12,
                border: '2px solid var(--color-border)',
                fontSize: 16,
                background: 'var(--color-bg)',
                color: 'var(--color-text)',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              background: isLoading ? '#a13e97cc' : '#a13e97',
              color: 'white',
              border: 'none',
              borderRadius: 12,
              padding: '16px',
              fontSize: 16,
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background 0.18s, transform 0.2s, box-shadow 0.2s',
              boxShadow: isLoading ? 'none' : '0 2px 8px rgba(161,62,151,0.12)',
            }}
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: 24,
          paddingTop: 24,
          borderTop: '1px solid var(--color-border)',
          position: 'relative',
          zIndex: 1
        }}>
          <p style={{
            fontSize: 14,
            color: '#666',
            marginBottom: 8
          }}>
            Don't have an account?
          </p>
          <Link
            to="/signup"
            style={{
              color: 'var(--color-primary)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: 14,
              transition: 'color 0.2s'
            }}
          >
            Create your account →
          </Link>
        </div>
      </div>
    </div>
  );
}; 