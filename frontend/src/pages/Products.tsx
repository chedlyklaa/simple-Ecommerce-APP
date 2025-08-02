import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { products, purchases } from '../services/api';
import { Product } from '../types';

export const Products: React.FC = () => {
  const { user } = useAuth();
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);
  const [recentProductId, setRecentProductId] = useState<string | null>(null);
  // Helper to format category labels
  const formatCategory = (cat: string) => {
    const lower = cat.trim().toLowerCase();
    if (lower === 'imprimante laser') return 'Imprimante laser';
    if (lower === 'pro & press') return 'PRO & PRESS';
    if (lower === "systèmes d'impression" || lower === "systemes d'impression") return "Systèmes d'impression";
    return cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
  };
  // Memoize categories and productsByCategory
  const categories = useMemo(() => Array.from(new Set(productList.map((p) => p.categorie))), [productList]);
  const productsByCategory: { [key: string]: Product[] } = {};
  categories.forEach(cat => { productsByCategory[cat] = []; });
  productList.forEach(product => {
    if (!productsByCategory[product.categorie]) productsByCategory[product.categorie] = [];
    productsByCategory[product.categorie].push(product);
  });
  const [activeCat, setActiveCat] = useState(categories[0] || '');
  useEffect(() => {
    if (categories.length > 0 && !categories.includes(activeCat)) {
      setActiveCat(categories[0]);
    }
  }, [categories]);

  useEffect(() => {
    let polling: NodeJS.Timeout;
    const fetchProducts = async () => {
      try {
        const { data } = await products.getAll();
        // If a new product is added, set it as recent
        if (productList.length > 0 && data.length > productList.length) {
          const newProduct = data.find(p => !productList.some(old => old._id === p._id));
          if (newProduct) {
            setRecentProductId(newProduct._id);
            setTimeout(() => setRecentProductId(null), 4000);
          }
        }
        setProductList(data);
      } catch (err) {
        setError('Error fetching products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    polling = setInterval(fetchProducts, 10000);
    return () => clearInterval(polling);
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
      {categories.length === 0 ? (
        <div style={{ color: '#888', fontStyle: 'italic' }}>Aucune catégorie trouvée.</div>
      ) : (
        <>
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
                {formatCategory(cat)}
              </button>
            ))}
          </div>
          {/* Product Grid for Active Category */}
          <div key={activeCat} style={{ width: '100%', marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, color: '#a13e97', margin: '32px 0 16px 0', fontWeight: 700 }}>{formatCategory(activeCat)}</h2>
            <div className="flex" style={{ flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center' }}>
              {(!activeCat || !productsByCategory[activeCat] || productsByCategory[activeCat].length === 0) ? (
                <div style={{ color: '#888', fontStyle: 'italic' }}>Aucun produit dans cette catégorie.</div>
              ) : (
                productsByCategory[activeCat].map((product) => (
                  <div
                    key={product._id}
                    className="card"
                    style={{
                      width: 300,
                      boxShadow: '0 2px 12px rgba(37,99,235,0.07)',
                      border: recentProductId === product._id ? '2px solid #a13e97' : undefined,
                      background: recentProductId === product._id ? '#f3e8ff' : undefined,
                      transition: 'background 0.3s, border 0.3s'
                    }}
                    ref={recentProductId === product._id ? (el => { if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }) : undefined}
                  >
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
        </>
      )}
    </div>
  );
}; 