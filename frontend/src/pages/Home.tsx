import React, { useState, useEffect } from 'react';
import { products, purchases } from '../services/api';
import { Product } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const Home: React.FC = () => {
  const { user } = useAuth();
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await products.getAll();
        setProductList(data);
      } catch (err) {
        setError('Error fetching products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handlePurchase = async (productId: string) => {
    if (!user) return;
    setPurchaseLoading(productId);
    try {
      await purchases.create(productId);
      // Optionally show a success message or update UI
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error creating purchase request');
    } finally {
      setPurchaseLoading(null);
    }
  };

  if (loading) {
    return <div className="text-center mt-6">Loading...</div>;
  }
  if (error) {
    return <div className="card bg-red text-center">{error}</div>;
  }

  return (
    <div>
      <div className="product-list grid" style={{
        gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
        gap: '2rem',
        marginTop: 32,
        marginBottom: 32,
      }}>
        {productList.map((product) => (
          <div key={product._id} className="card shadow" style={{
            background: 'var(--color-card)',
            borderRadius: 16,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            boxShadow: 'var(--shadow-card)',
            border: '1px solid var(--color-border)',
            minHeight: 320,
            transition: 'box-shadow 0.18s',
          }}>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8, color: 'var(--color-primary)' }}>{product.name}</div>
            <div style={{ fontSize: 15, color: '#555', marginBottom: 12 }}>{product.description}</div>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 18 }}>${product.price}</div>
            {user && (
              <button
                className="bg-blue text-light text-bold"
                style={{ border: 'none', borderRadius: 8, padding: '0.6rem 1.2rem', fontWeight: 600, cursor: 'pointer', marginTop: 'auto', transition: 'background 0.2s' }}
                onClick={() => handlePurchase(product._id)}
                disabled={purchaseLoading === product._id}
              >
                {purchaseLoading === product._id ? 'Processing...' : 'Buy Now'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 