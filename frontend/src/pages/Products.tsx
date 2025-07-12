import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { products, purchases } from '../services/api';
import { Product } from '../types';

// Helper to assign category based on product name
const getCategorie = (name: string) => {
  if (
    name.includes('ITS L1300') ||
    name.includes('Bizhub 4000i')
  ) return 'Imprimante laser';
  if (
    name.includes('AccurioLabel 230') ||
    name.includes('Accurio Press C4065') ||
    name.includes('AccurioPrint 2100')
  ) return 'PRO & PRESS';
  if (
    name.includes('Bizhub 225i') ||
    name.includes('bizhub 4020i') ||
    name.includes('bizhub C257i') ||
    name.includes('bizhub C3321i')
  ) return "Systèmes d'impression";
  return 'Autres';
};

// Group products by category
const categories = [
  'Imprimante laser',
  'PRO & PRESS',
  "Systèmes d'impression"
];

export const Products: React.FC = () => {
  const { user } = useAuth();
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);
  const [activeCat, setActiveCat] = useState(categories[0]);
  const productsByCategory: { [key: string]: Product[] } = {};
  categories.forEach(cat => { productsByCategory[cat] = []; });
  productList.forEach(product => {
    const cat = getCategorie(product.name);
    if (!productsByCategory[cat]) productsByCategory[cat] = [];
    productsByCategory[cat].push(product);
  });

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
      // Show success message or update UI
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error creating purchase request');
    } finally {
      setPurchaseLoading(null);
    }
  };

  if (loading) {
    return <div className="text-center mt-6">Chargement...</div>;
  }
  if (error) {
    return <div className="card bg-red text-center">{error}</div>;
  }

  return (
    <div>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)',
        borderRadius: 12,
        padding: '2.5rem 1.5rem',
        marginBottom: 32,
        textAlign: 'center',
        boxShadow: '0 4px 24px rgba(37,99,235,0.08)'
      }}>
        <h1 style={{ fontSize: 32, color: '#2563eb', marginBottom: 8, letterSpacing: 1 }}>Bienvenue dans la boutique</h1>
        <p style={{ fontSize: 18, color: '#222', maxWidth: 600, margin: '0 auto' }}>
          Découvrez notre sélection de produits. Cliquez sur "Acheter" pour demander un achat. Les administrateurs peuvent confirmer votre commande après votre demande.
        </p>
      </div>
      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 32 }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            style={{
              padding: '12px 28px',
              borderRadius: 16,
              border: 'none',
              fontSize: 18,
              fontWeight: 700,
              background: activeCat === cat ? '#a13e97' : '#f7f7fa',
              color: activeCat === cat ? '#fff' : '#a13e97',
              boxShadow: activeCat === cat ? '0 2px 12px rgba(161,62,151,0.12)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.18s',
              outline: activeCat === cat ? '2px solid #a13e97' : 'none',
            }}
          >
            {cat}
          </button>
        ))}
      </div>
      {/* Product Grid for Active Category */}
      <div key={activeCat} style={{ width: '100%', marginBottom: 32 }}>
        <h2 style={{ fontSize: 24, color: '#a13e97', margin: '32px 0 16px 0', fontWeight: 700 }}>{activeCat}</h2>
        <div className="flex" style={{ flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center' }}>
          {productsByCategory[activeCat].length === 0 ? (
            <div style={{ color: '#888', fontStyle: 'italic' }}>Aucun produit dans cette catégorie.</div>
          ) : (
            productsByCategory[activeCat].map((product) => (
              <div key={product._id} className="card" style={{ width: 300, boxShadow: '0 2px 12px rgba(37,99,235,0.07)' }}>
                {product.image && (
                  <img src={product.image} alt={product.name} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />
                )}
                <h3 className="text-lg text-bold mb-2" style={{ color: '#2563eb' }}>{product.name}</h3>
                <p className="text-sm mb-2" style={{ minHeight: 40 }}>{product.description}</p>
                <div className="flex justify-between mt-2">
                  <span className="text-lg text-bold">Prix : {product.price.toFixed(2)} DT</span>
                  {user && (
                    <button onClick={() => handlePurchase(product._id)} disabled={purchaseLoading === product._id}>
                      {purchaseLoading === product._id ? 'Demande en cours...' : 'Acheter'}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}; 