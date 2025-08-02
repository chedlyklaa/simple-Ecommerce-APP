import React, { useState } from 'react';
import { products } from '../services/api';

const categories = [
  'imprimante laser',
  'PRO & PRESS',
  "systémes d'impression"
];

export const AddProduct: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categorie, setCategorie] = useState(categories[0]);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!name || !description || !price || !categorie || !image) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    if (isNaN(Number(price)) || Number(price) <= 0) {
      setError('Le prix doit être un nombre positif.');
      return;
    }
    setLoading(true);
    try {
      // For now, just use a placeholder for image upload (URL or base64)
      // In production, you would upload the image to a server or cloud storage
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageUrl = reader.result as string;
        await products.create({
          name,
          description,
          price: Number(price),
          categorie,
          image: imageUrl // This assumes backend can handle base64 or URL
        });
        setSuccess('Produit ajouté avec succès !');
        setName('');
        setDescription('');
        setPrice('');
        setCategorie(categories[0]);
        setImage(null);
      };
      reader.readAsDataURL(image);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Erreur lors de l'ajout du produit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', background: 'var(--color-card)', borderRadius: 16, padding: 32, boxShadow: 'var(--shadow-card)' }}>
      <h2 style={{ fontSize: 26, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 24 }}>Ajouter un produit</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Image</label>
          <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} required />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Titre</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 15 }} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Catégorie</label>
          <select value={categorie} onChange={e => setCategorie(e.target.value)} required style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 15 }}>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Prix (DT)</label>
          <input type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 15 }} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={4} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 15 }} />
        </div>
        {error && <div style={{ color: '#dc2626', marginBottom: 12 }}>{error}</div>}
        {success && <div style={{ color: '#22c55e', marginBottom: 12 }}>{success}</div>}
        <button type="submit" disabled={loading} style={{ background: '#a13e97', color: 'white', border: 'none', borderRadius: 8, padding: '12px 24px', fontWeight: 700, fontSize: 16, width: '100%', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Ajout...' : 'Ajouter le produit'}
        </button>
      </form>
    </div>
  );
}; 