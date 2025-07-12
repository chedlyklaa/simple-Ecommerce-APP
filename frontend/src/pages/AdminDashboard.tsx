import React, { useState, useEffect } from 'react';
import { purchases, reclamations } from '../services/api';
import { Purchase, Reclamation } from '../types';

export const AdminDashboard: React.FC = () => {
  const [purchaseList, setPurchaseList] = useState<Purchase[]>([]);
  const [reclamationList, setReclamationList] = useState<Reclamation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'purchases' | 'reclamations'>('purchases');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [purchasesRes, reclamationsRes] = await Promise.all([
        purchases.getAll(),
        reclamations.getAll(),
      ]);
      setPurchaseList(purchasesRes.data);
      setReclamationList(reclamationsRes.data);
    } catch (err) {
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseStatus = async (id: string, status: Purchase['status']) => {
    try {
      await purchases.updateStatus(id, status);
      fetchData();
    } catch (err) {
      setError('Error updating purchase status');
    }
  };

  const handleReclamationStatus = async (id: string, status: Reclamation['status']) => {
    try {
      await reclamations.updateStatus(id, status);
      fetchData();
    } catch (err) {
      setError('Error updating reclamation status');
    }
  };

  const getPurchaseStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { background: '#dcfce7', color: '#166534', border: '#bbf7d0' };
      case 'rejected':
        return { background: '#fef2f2', color: '#dc2626', border: '#fecaca' };
      case 'pending':
        return { background: '#fef3c7', color: '#d97706', border: '#fed7aa' };
      default:
        return { background: '#f3f4f6', color: '#6b7280', border: '#e5e7eb' };
    }
  };

  const getReclamationStatusColor = (status: string) => {
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
      case 'confirmed':
      case 'fini':
        return '✓';
      case 'rejected':
        return '✗';
      case 'pending':
      case 'en attente':
        return '⏳';
      case 'en cours':
        return '⚡';
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
          Loading admin dashboaraad...
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
        borderRadius: 16,
        padding: '2.5rem 1.5rem',
        marginBottom: 32,
        textAlign: 'center',
        boxShadow: '0 4px 24px rgba(124,58,237,0.15)',
        border: '1px solid rgba(124,58,237,0.1)',
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
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 80,
          height: 80,
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%'
        }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 60,
            height: 60,
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            backdropFilter: 'blur(10px)'
          }}>
            <span style={{ fontSize: 24, color: 'white', fontWeight: 700 }}>👑</span>
          </div>
          <h1 style={{ fontSize: 32, color: 'white', marginBottom: 12, letterSpacing: 1, fontWeight: 700 }}>
            Tableau de bord administrateur
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.9)', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
            Gérez les achats et les réclamations clients. Consultez et mettez à jour le statut de toutes les demandes.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: 32
      }}>
        <div style={{
          background: 'var(--color-card)',
          borderRadius: 16,
          padding: 24,
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-card)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📦</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 4 }}>
            {purchaseList.length}
          </div>
          <div style={{ fontSize: 14, color: '#666' }}>Total des achats</div>
        </div>
        <div style={{
          background: 'var(--color-card)',
          borderRadius: 16,
          padding: 24,
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-card)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📝</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 4 }}>
            {reclamationList.length}
          </div>
          <div style={{ fontSize: 14, color: '#666' }}>Total des réclamations</div>
        </div>
        <div style={{
          background: 'var(--color-card)',
          borderRadius: 16,
          padding: 24,
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-card)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#d97706', marginBottom: 4 }}>
            {purchaseList.filter(p => p.status === 'pending').length}
          </div>
          <div style={{ fontSize: 14, color: '#666' }}>Achats en attente</div>
        </div>
        <div style={{
          background: 'var(--color-card)',
          borderRadius: 16,
          padding: 24,
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-card)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#6b7280', marginBottom: 4 }}>
            {reclamationList.filter(r => r.status === 'en attente').length}
          </div>
          <div style={{ fontSize: 14, color: '#666' }}>Réclamations en attente</div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          background: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fecaca',
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
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

      {/* Tab Navigation */}
      <div style={{
        background: 'var(--color-card)',
        borderRadius: 16,
        padding: 8,
        marginBottom: 24,
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        gap: 8
      }}>
        <button
          onClick={() => setActiveTab('purchases')}
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: 12,
            border: 'none',
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: activeTab === 'purchases' ? 'var(--color-primary)' : 'transparent',
            color: activeTab === 'purchases' ? 'white' : 'var(--color-text)'
          }}
        >
          📦 Achats ({purchaseList.length})
        </button>
        <button
          onClick={() => setActiveTab('reclamations')}
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: 12,
            border: 'none',
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: activeTab === 'reclamations' ? 'var(--color-primary)' : 'transparent',
            color: activeTab === 'reclamations' ? 'white' : 'var(--color-text)'
          }}
        >
          📝 Réclamations ({reclamationList.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'purchases' ? (
        <div>
          <h3 style={{
            fontSize: 24,
            fontWeight: 700,
            color: 'var(--color-text)',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <span style={{ fontSize: 20 }}>��</span>
            Gestion des achats
          </h3>
          <div style={{
            display: 'grid',
            gap: '1.5rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))'
          }}>
            {purchaseList.map((purchase) => {
              const statusStyle = getPurchaseStatusColor(purchase.status);
              return (
                <div key={purchase._id} className="card shadow" style={{
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
                    <span style={{ fontSize: 12 }}>{getStatusIcon(purchase.status)}</span>
                    {purchase.status}
                  </div>

                  {/* Purchase Info */}
                  <div style={{ marginBottom: 16, paddingRight: 100 }}>
                    <h4 style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: 'var(--color-primary)',
                      marginBottom: 8
                    }}>
                      {purchase.product && typeof purchase.product === 'object' && purchase.product.name ? purchase.product.name : 'Produit'}
                    </h4>
                    <div style={{
                      fontSize: 14,
                      color: '#666',
                      marginBottom: 8
                    }}>
                      Client : {typeof purchase.user === 'object' ? purchase.user.email : 'Utilisateur'}
                    </div>
                    <div style={{
                      fontSize: 14,
                      color: '#666'
                    }}>
                      Demandé le : {new Date(purchase.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>

                  {/* Price */}
                  {purchase.product && typeof purchase.product === 'object' && purchase.product.price !== undefined && (
                    <div style={{
                      padding: '12px 16px',
                      background: 'var(--color-bg)',
                      borderRadius: 8,
                      border: '1px solid var(--color-border)',
                      marginBottom: 16
                    }}>
                      <span style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: 'var(--color-text)'
                      }}>
                        Prix : {purchase.product.price.toFixed(2)} DT
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {purchase.status === 'pending' && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => handlePurchaseStatus(purchase._id, 'confirmed')}
                        style={{
                          flex: 1,
                          background: '#22c55e',
                          color: 'white',
                          border: 'none',
                          borderRadius: 8,
                          padding: '10px 16px',
                          fontSize: 14,
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'background 0.2s'
                        }}
                      >
                        ✓ Confirmer
                      </button>
                      <button
                        onClick={() => handlePurchaseStatus(purchase._id, 'rejected')}
                        style={{
                          flex: 1,
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: 8,
                          padding: '10px 16px',
                          fontSize: 14,
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'background 0.2s'
                        }}
                      >
                        ✗ Rejeter
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
            {purchaseList.length === 0 && (
              <div className="card text-center" style={{
                background: 'var(--color-card)',
                borderRadius: 16,
                padding: '3rem 2rem',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-card)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: 64, color: 'var(--color-border)', marginBottom: 16 }}>📦</div>
                <h3 style={{ fontSize: 24, fontWeight: 600, color: 'var(--color-text)', marginBottom: 12 }}>
                  Aucun achat pour le moment
                </h3>
                <p style={{ fontSize: 16, color: '#666', maxWidth: 400, margin: '0 auto', lineHeight: 1.6 }}>
                  Lorsqu'un client effectue une demande d'achat, elle apparaîtra ici pour votre révision.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <h3 style={{
            fontSize: 24,
            fontWeight: 700,
            color: 'var(--color-text)',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <span style={{ fontSize: 20 }}>📝</span>
            Gestion des réclamations
          </h3>
          <div style={{
            display: 'grid',
            gap: '1.5rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))'
          }}>
            {reclamationList.map((reclamation) => {
              const statusStyle = getReclamationStatusColor(reclamation.status);
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

                  {/* Reclamation Info */}
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
                    <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
                      Client : {typeof reclamation.user === 'object' ? reclamation.user.email : 'Utilisateur'}
                    </div>
                    <div style={{ fontSize: 14, color: '#666' }}>
                      Soumis le : {new Date(reclamation.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  {/* Status Update */}
                  <div style={{ marginTop: 16 }}>
                    <label style={{
                      display: 'block',
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'var(--color-text)',
                      marginBottom: 8
                    }}>
                      Mettre à jour le statut
                    </label>
                    <select
                      value={reclamation.status}
                      onChange={(e) =>
                        handleReclamationStatus(
                          reclamation._id,
                          e.target.value as Reclamation['status']
                        )
                      }
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: 8,
                        border: '2px solid var(--color-border)',
                        fontSize: 14,
                        background: 'var(--color-bg)',
                        color: 'var(--color-text)',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="en attente">En attente</option>
                      <option value="en cours">En cours</option>
                      <option value="fini">Fini</option>
                    </select>
                  </div>
                </div>
              );
            })}
            {reclamationList.length === 0 && (
              <div className="card text-center" style={{
                background: 'var(--color-card)',
                borderRadius: 16,
                padding: '3rem 2rem',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-card)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: 64, color: 'var(--color-border)', marginBottom: 16 }}>📝</div>
                <h3 style={{ fontSize: 24, fontWeight: 600, color: 'var(--color-text)', marginBottom: 12 }}>
                  No reclamations yet
                </h3>
                <p style={{ fontSize: 16, color: '#666', maxWidth: 400, margin: '0 auto', lineHeight: 1.6 }}>
                  When customers submit reclamations, they will appear here for your review.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 