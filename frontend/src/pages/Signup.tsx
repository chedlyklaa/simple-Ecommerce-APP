import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return;
    }
    setIsLoading(true);
    try {
      await signup(email, password);
      navigate('/');
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
            <span style={{ fontSize: 24, color: 'white', fontWeight: 700 }}>🚀</span>
          </div>
          <h1 style={{
            fontSize: 28,
            fontWeight: 700,
            color: 'var(--color-primary)',
            marginBottom: 8,
            letterSpacing: 0.5
          }}>
            Join Us Today
          </h1>
          <p style={{
            fontSize: 16,
            color: '#666',
            lineHeight: 1.5
          }}>
            Create your account to get started
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1 }}>
          {(error || validationError) && (
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
              {error || validationError}
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

          <div style={{ marginBottom: 20 }}>
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
              placeholder="Create a password"
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
            <div style={{
              fontSize: 12,
              color: '#666',
              marginTop: 4
            }}>
              Must be at least 6 characters long
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'block',
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--color-text)',
              marginBottom: 8
            }}>
              Confirm Password
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              required
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
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
            {isLoading ? 'Création du compte...' : 'Créer un compte'}
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
            Already have an account?
          </p>
          <Link
            to="/login"
            style={{
              color: 'var(--color-primary)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: 14,
              transition: 'color 0.2s'
            }}
          >
            Sign in to your account →
          </Link>
        </div>
      </div>
    </div>
  );
}; 