import React, { useState, useEffect } from 'react';
import { purchases } from '../services/api';
import { Purchase } from '../types';

export const Purchases: React.FC = () => {
  const [purchaseList, setPurchaseList] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const { data } = await purchases.getMine();
        setPurchaseList(data);
      } catch (err) {
        setError('Error fetching purchases');
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  const getStatusColor = (status: string) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '✓';
      case 'rejected':
        return '✗';
      case 'pending':
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
          Loading your purchases...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-red text-center" style={{
        background: '#fef2f2',
        color: '#dc2626',
        border: '1px solid #fecaca',
        borderRadius: 12,
        padding: 24,
        margin: '32px 0',
        fontSize: 16,
        fontWeight: 500
      }}>
        {error}
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
          Historique de mes achats
        </h1>
        <p style={{
          fontSize: 18,
          color: 'var(--color-text)',
          maxWidth: 600,
          margin: '0 auto',
          lineHeight: 1.6
        }}>
          Suivez toutes vos demandes d'achat et leur statut actuel. Les administrateurs examineront et mettront à jour le statut de vos commandes.
        </p>
      </div>

      {/* Purchase List */}
      <div style={{ marginBottom: 32 }}>
        {purchaseList.length > 0 ? (
          <div style={{
            display: 'grid',
            gap: '1.5rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))'
          }}>
            {purchaseList.map((purchase) => {
              const statusStyle = getStatusColor(purchase.status);
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

                  {/* Product Info */}
                  <div style={{ marginBottom: 16 }}>
                    {/* Product Image */}
                    {typeof purchase.product === 'object' && (
                      <div style={{
                        width: '100%',
                        height: 200,
                        borderRadius: 12,
                        overflow: 'hidden',
                        marginBottom: 16,
                        background: 'var(--color-bg)',
                        border: '1px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {purchase.product.image ? (
                          <img 
                            src={purchase.product.image} 
                            alt={purchase.product.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform 0.2s'
                            }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.parentElement!.innerHTML = `
                                <div style="
                                  display: flex;
                                  flex-direction: column;
                                  align-items: center;
                                  justify-content: center;
                                  color: #999;
                                  font-size: 14px;
                                  text-align: center;
                                  padding: 20px;
                                ">
                                  <div style="font-size: 48px; margin-bottom: 8px;">📦</div>
                                  <div>No image available</div>
                                </div>
                              `;
                            }}
                          />
                        ) : (
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#999',
                            fontSize: 14,
                            textAlign: 'center',
                            padding: 20,
                            width: '100%',
                            height: '100%'
                          }}>
                            <div style={{ fontSize: 48, marginBottom: 8 }}>📦</div>
                            <div>No image available</div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <h3 style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: 'var(--color-primary)',
                      marginBottom: 8,
                      paddingRight: 100
                    }}>
                      {typeof purchase.product === 'object' ? purchase.product.name : 'Product'}
                    </h3>
                    <div style={{
                      fontSize: 15,
                      color: '#666',
                      marginBottom: 12
                    }}>
                      Requested on {new Date(purchase.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>

                  {/* Price and Details */}
                  {typeof purchase.product === 'object' && (
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
                        fontSize: 16,
                        fontWeight: 600,
                        color: 'var(--color-text)'
                      }}>
                        Prix : {purchase.product.price.toFixed(2)} DT
                      </span>
                      <span style={{
                        fontSize: 14,
                        color: '#666',
                        fontStyle: 'italic'
                      }}>
                        ID : {purchase._id.slice(-8)}
                      </span>
                    </div>
                  )}

                  {/* Status Timeline */}
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
                      Suivi de la commande
                    </div>
                    <div style={{
                      fontSize: 13,
                      color: '#666',
                      lineHeight: 1.5
                    }}>
                      {purchase.status === 'pending' && 'Votre commande est en cours de révision par notre équipe...'}
                      {purchase.status === 'confirmed' && 'Votre commande a été confirmée et est en cours de traitement !'}
                      {purchase.status === 'rejected' && 'Votre commande n’a pas été approuvée. Veuillez contacter le support pour plus d’informations.'}
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
              📦
            </div>
            <h3 style={{
              fontSize: 24,
              fontWeight: 600,
              color: 'var(--color-text)',
              marginBottom: 12
            }}>
              Aucun achat pour le moment
            </h3>
            <p style={{
              fontSize: 16,
              color: '#666',
              maxWidth: 400,
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              Commencez vos achats pour voir votre historique ici. Parcourez nos produits et effectuez votre première demande d'achat !
            </p>
          </div>
        )}
      </div>
    </div>
  );
}; 