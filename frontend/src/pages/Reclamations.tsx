import React, { useState, useEffect } from 'react';
import { reclamations } from '../services/api';
import { Reclamation } from '../types';

export const Reclamations: React.FC = () => {
  const [reclamationList, setReclamationList] = useState<Reclamation[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReclamations();
  }, []);

  const fetchReclamations = async () => {
    try {
      const { data } = await reclamations.getMine();
      setReclamationList(data);
    } catch (err) {
      setError('Error fetching reclamations');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    try {
      await reclamations.create(message);
      setMessage('');
      fetchReclamations();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error creating reclamation');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fini':
        return { background: '#dcfce7', color: '#166534', border: '#bbf7d0' };
      case 'en cours':
        return { background: '#fef3c7', color: '#d97706', border: '#fed7aa' };
      case 'en attente':
        return { background: '#f3f4f6', color: '#6b7280', border: '#e5e7eb' };
      default:
        return { background: '#f3f4f6', color: '#6b7280', border: '#e5e7eb' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'fini':
        return '✓';
      case 'en cours':
        return '⚡';
      case 'en attente':
        return '⏳';
      default:
        return '•';
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        fontSize: 18,
        color: 'var(--color-text)',
        fontWeight: 500
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16
        }}>
          <div style={{
            width: 40,
            height: 40,
            border: '3px solid var(--color-border)',
            borderTop: '3px solid var(--color-primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          Loading your reclamations...
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)',
        borderRadius: 16,
        padding: '2.5rem 1.5rem',
        marginBottom: 32,
        textAlign: 'center',
        boxShadow: '0 4px 24px rgba(37,99,235,0.08)',
        border: '1px solid rgba(37,99,235,0.1)'
      }}>
        <h1 style={{
          fontSize: 32,
          color: 'var(--color-primary)',
          marginBottom: 12,
          letterSpacing: 1,
          fontWeight: 700
        }}>
          Customer Support
        </h1>
        <p style={{
          fontSize: 18,
          color: 'var(--color-text)',
          maxWidth: 600,
          margin: '0 auto',
          lineHeight: 1.6
        }}>
          Submit reclamations for any issues you encounter. Our support team will review and update the status of your requests.
        </p>
      </div>

      {/* Submit Reclamation Form */}
      <div className="card shadow" style={{
        background: 'var(--color-card)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 32,
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-card)'
      }}>
        <h3 style={{
          fontSize: 24,
          fontWeight: 700,
          color: 'var(--color-primary)',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <span style={{ fontSize: 20 }}>📝</span>
          Submit a New Reclamation
        </h3>
        <form onSubmit={handleSubmit}>
          <textarea 
            rows={4} 
            value={message} 
            onChange={e => setMessage(e.target.value)} 
            placeholder="Describe your issue, concern, or feedback in detail..." 
            required 
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              fontSize: 16,
              fontFamily: 'inherit',
              resize: 'vertical',
              minHeight: 120,
              background: 'var(--color-bg)',
              color: 'var(--color-text)',
              transition: 'border-color 0.2s'
            }}
          />
          {error && (
            <div style={{
              background: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fecaca',
              borderRadius: 8,
              padding: 12,
              marginTop: 12,
              fontSize: 14,
              fontWeight: 500
            }}>
              {error}
            </div>
          )}
          <button 
            type="submit" 
            disabled={submitting || !message.trim()}
            style={{
              background: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              padding: '12px 24px',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: 16,
              transition: 'background 0.2s',
              opacity: (submitting || !message.trim()) ? 0.6 : 1
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Reclamation'}
          </button>
        </form>
      </div>

      {/* Reclamations List */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{
          fontSize: 24,
          fontWeight: 700,
          color: 'var(--color-text)',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <span style={{ fontSize: 20 }}>📋</span>
          Your Reclamations ({reclamationList.length})
        </h3>
        
        {reclamationList.length > 0 ? (
          <div style={{
            display: 'grid',
            gap: '1.5rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))'
          }}>
            {reclamationList.map((reclamation) => {
              const statusStyle = getStatusColor(reclamation.status);
              return (
                <div key={reclamation._id} className="card shadow" style={{
                  background: 'var(--color-card)',
                  borderRadius: 16,
                  padding: 24,
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-card)',
                  transition: 'box-shadow 0.18s, transform 0.18s',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Status Badge */}
                  <div style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    borderRadius: 20,
                    fontSize: 14,
                    fontWeight: 600,
                    background: statusStyle.background,
                    color: statusStyle.color,
                    border: `1px solid ${statusStyle.border}`,
                    textTransform: 'capitalize'
                  }}>
                    <span style={{ fontSize: 12 }}>{getStatusIcon(reclamation.status)}</span>
                    {reclamation.status}
                  </div>

                  {/* Message */}
                  <div style={{ marginBottom: 16, paddingRight: 100 }}>
                    <div style={{
                      fontSize: 16,
                      color: 'var(--color-text)',
                      lineHeight: 1.6,
                      marginBottom: 12,
                      fontWeight: 500
                    }}>
                      {reclamation.message}
                    </div>
                  </div>

                  {/* Date and Details */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: 'var(--color-bg)',
                    borderRadius: 8,
                    border: '1px solid var(--color-border)'
                  }}>
                    <span style={{
                      fontSize: 14,
                      color: '#666',
                      fontWeight: 500
                    }}>
                      Submitted on {new Date(reclamation.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <span style={{
                      fontSize: 12,
                      color: '#999',
                      fontStyle: 'italic'
                    }}>
                      ID: {reclamation._id.slice(-8)}
                    </span>
                  </div>

                  {/* Status Description */}
                  <div style={{
                    marginTop: 16,
                    padding: '12px 16px',
                    background: 'var(--color-bg)',
                    borderRadius: 8,
                    border: '1px solid var(--color-border)'
                  }}>
                    <div style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'var(--color-text)',
                      marginBottom: 8
                    }}>
                      Current Status
                    </div>
                    <div style={{
                      fontSize: 13,
                      color: '#666',
                      lineHeight: 1.5
                    }}>
                      {reclamation.status === 'en attente' && 'Your reclamation is waiting to be reviewed by our support team...'}
                      {reclamation.status === 'en cours' && 'Our support team is currently working on your reclamation...'}
                      {reclamation.status === 'fini' && 'Your reclamation has been resolved! Thank you for your patience.'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card text-center" style={{
            background: 'var(--color-card)',
            borderRadius: 16,
            padding: '3rem 2rem',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-card)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: 64,
              color: 'var(--color-border)',
              marginBottom: 16
            }}>
              📝
            </div>
            <h3 style={{
              fontSize: 24,
              fontWeight: 600,
              color: 'var(--color-text)',
              marginBottom: 12
            }}>
              No reclamations yet
            </h3>
            <p style={{
              fontSize: 16,
              color: '#666',
              maxWidth: 400,
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              Submit your first reclamation above if you have any issues or concerns with your purchases.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}; 