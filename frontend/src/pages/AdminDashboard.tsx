import React, { useState, useEffect } from 'react';
import { purchases, reclamations, users as usersApi, products as productsApi } from '../services/api';
import { Purchase, Reclamation, User, Product } from '../types';
// Remove: import { useNavigate } from 'react-router-dom';
// Remove: import { AdminSidebar } from '../components/Layout/AdminSidebar';

export const AdminDashboard: React.FC = () => {
  const [purchaseList, setPurchaseList] = useState<Purchase[]>([]);
  const [reclamationList, setReclamationList] = useState<Reclamation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userList, setUserList] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState('');
  const [activeTab, setActiveTab] = useState<'purchases' | 'reclamations' | 'users' | 'products'>('purchases');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserPasswordConfirm, setNewUserPasswordConfirm] = useState('');
  const [newUserRole, setNewUserRole] = useState<'user' | 'admin'>('admin');
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');
  const [productList, setProductList] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<{ name: string; description: string; price: string; categorie: string; image: File | null }>({ name: '', description: '', price: '', categorie: '', image: null });
  const [productFormError, setProductFormError] = useState('');
  const [productFormLoading, setProductFormLoading] = useState(false);
  const [productFormSuccess, setProductFormSuccess] = useState('');
  const productCategories = [
    'imprimante laser',
  'PRO & PRESS',
  "systémes d'impression"
  ];

  // Remove: const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Fetch current user for self-protection
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload._id);
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'products') fetchProducts();
  }, [activeTab]);

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

  const fetchUsers = async () => {
    setUsersLoading(true);
    setUsersError('');
    try {
      const res = await usersApi.getAll();
      setUserList(res.data);
    } catch (err) {
      setUsersError("Erreur lors du chargement des utilisateurs");
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchProducts = async () => {
    setProductsLoading(true);
    setProductsError('');
    try {
      const res = await productsApi.getAll();
      setProductList(res.data);
    } catch (err) {
      setProductsError("Erreur lors du chargement des produits");
    } finally {
      setProductsLoading(false);
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

  const handleRoleChange = async (id: string, role: 'user' | 'admin') => {
    try {
      await usersApi.updateRole(id, role);
      fetchUsers();
    } catch {
      setUsersError("Erreur lors de la mise à jour du rôle");
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;
    try {
      await usersApi.deleteUser(id);
      fetchUsers();
    } catch {
      setUsersError("Erreur lors de la suppression de l'utilisateur");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;
    try {
      await productsApi.delete(id);
      fetchProducts();
    } catch {
      setProductsError("Erreur lors de la suppression du produit");
    }
  };

  const openProductModal = (product?: Product) => {
    setEditingProduct(product || null);
    setProductForm({
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price?.toString() || '',
      categorie: product?.categorie || productCategories[0],
      image: null
    });
    setProductFormError('');
    setProductFormSuccess('');
    setShowProductModal(true);
  };

  const handleProductFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as any;
    setProductForm(f => ({
      ...f,
      [name]: files ? files[0] : value
    }));
  };

  const handleProductFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductFormError('');
    setProductFormSuccess('');
    if (!productForm.name || !productForm.description || !productForm.price || !productForm.categorie) {
      setProductFormError('Veuillez remplir tous les champs.');
      return;
    }
    if (isNaN(Number(productForm.price)) || Number(productForm.price) <= 0) {
      setProductFormError('Le prix doit être un nombre positif.');
      return;
    }
    setProductFormLoading(true);
    try {
      let imageUrl = editingProduct?.image || '';
      if (productForm.image) {
        const reader = new FileReader();
        await new Promise<void>((resolve, reject) => {
          reader.onloadend = () => {
            imageUrl = reader.result as string;
            resolve();
          };
          reader.onerror = reject;
          reader.readAsDataURL(productForm.image!);
        });
      }
      const payload = {
        name: productForm.name,
        description: productForm.description,
        price: Number(productForm.price),
        categorie: productForm.categorie,
        image: imageUrl
      };
      if (editingProduct) {
        await productsApi.update(editingProduct._id, payload);
        setProductFormSuccess('Produit modifié avec succès !');
      } else {
        await productsApi.create(payload);
        setProductFormSuccess('Produit ajouté avec succès !');
      }
      setShowProductModal(false);
      fetchProducts();
    } catch (err: any) {
      setProductFormError(err?.response?.data?.error || "Erreur lors de l'enregistrement du produit");
    } finally {
      setProductFormLoading(false);
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
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 32 }}>
      {/* Internal Sidebar Navigation */}
      <nav style={{
        minWidth: 200,
        background: 'var(--color-card)',
        borderRadius: 16,
        padding: '32px 0',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        height: '100%',
        position: 'sticky',
        top: 32
      }}>
        <button
          onClick={() => setActiveTab('purchases')}
          style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', fontWeight: 600, fontSize: 17,
            color: activeTab === 'purchases' ? 'white' : 'var(--color-primary)',
            background: activeTab === 'purchases' ? 'linear-gradient(90deg, #a13e97 0%, #7c3aed 100%)' : 'transparent',
            borderRadius: 10, border: 'none', cursor: 'pointer', margin: '0 12px', transition: 'background 0.2s, color 0.2s'
          }}
        >📦 Achats</button>
        <button
          onClick={() => setActiveTab('reclamations')}
          style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', fontWeight: 600, fontSize: 17,
            color: activeTab === 'reclamations' ? 'white' : 'var(--color-primary)',
            background: activeTab === 'reclamations' ? 'linear-gradient(90deg, #a13e97 0%, #7c3aed 100%)' : 'transparent',
            borderRadius: 10, border: 'none', cursor: 'pointer', margin: '0 12px', transition: 'background 0.2s, color 0.2s'
          }}
        >📝 Réclamations</button>
        <button
          onClick={() => setActiveTab('users')}
          style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', fontWeight: 600, fontSize: 17,
            color: activeTab === 'users' ? 'white' : 'var(--color-primary)',
            background: activeTab === 'users' ? 'linear-gradient(90deg, #a13e97 0%, #7c3aed 100%)' : 'transparent',
            borderRadius: 10, border: 'none', cursor: 'pointer', margin: '0 12px', transition: 'background 0.2s, color 0.2s'
          }}
        >👤 Utilisateurs</button>
        <button
          onClick={() => setActiveTab('products')}
          style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', fontWeight: 600, fontSize: 17,
            color: activeTab === 'products' ? 'white' : 'var(--color-primary)',
            background: activeTab === 'products' ? 'linear-gradient(90deg, #a13e97 0%, #7c3aed 100%)' : 'transparent',
            borderRadius: 10, border: 'none', cursor: 'pointer', margin: '0 12px', transition: 'background 0.2s, color 0.2s'
          }}
        >🛒 Produits</button>
      </nav>
      <div style={{ flex: 1, minWidth: 0 }}>
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
            <button
              onClick={() => window.location.href = '/admin/add-product'}
              style={{
                marginTop: 24,
                background: '#a13e97',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                padding: '12px 28px',
                fontWeight: 700,
                fontSize: 18,
                boxShadow: 'var(--shadow-card)',
                cursor: 'pointer',
                transition: 'background 0.2s',
                letterSpacing: 0.5,
                display: 'inline-block'
              }}
            >
              + Ajouter un produit
            </button>
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
        {/* This section is now handled by the internal sidebar */}

        {/* Content */}
        {activeTab === 'users' ? (
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
              <span style={{ fontSize: 20 }}>👤</span>
              Gestion des utilisateurs
            </h3>
            <button
              onClick={() => {
                setShowCreateModal(true);
                setCreateError('');
                setCreateSuccess('');
                setNewUserEmail('');
                setNewUserPassword('');
                setNewUserPasswordConfirm('');
                setNewUserRole('user');
              }}
              style={{
                background: '#a13e97',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                padding: '10px 18px',
                fontWeight: 700,
                fontSize: 16,
                marginBottom: 24,
                cursor: 'pointer',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              + Créer un utilisateur
            </button>
            {showCreateModal && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.25)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  background: 'var(--color-card)',
                  borderRadius: 16,
                  padding: 32,
                  minWidth: 340,
                  boxShadow: '0 8px 32px rgba(124,58,237,0.15)',
                  position: 'relative'
                }}>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: 22, color: '#a13e97', cursor: 'pointer' }}
                    aria-label="Fermer"
                  >
                    ×
                  </button>
                  <h4 style={{ fontSize: 20, fontWeight: 700, marginBottom: 18, color: 'var(--color-primary)' }}>
                    Créer un utilisateur
                  </h4>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    setCreateLoading(true);
                    setCreateError('');
                    setCreateSuccess('');
                    if (newUserPassword !== newUserPasswordConfirm) {
                      setCreateError('Les mots de passe ne correspondent pas.');
                      setCreateLoading(false);
                      return;
                    }
                    try {
                      await usersApi.create({ email: newUserEmail, password: newUserPassword, role: newUserRole });
                      setCreateSuccess('Utilisateur créé avec succès !');
                      setNewUserEmail('');
                      setNewUserPassword('');
                      setNewUserPasswordConfirm('');
                      setNewUserRole('user');
                      fetchUsers();
                    } catch (err: any) {
                      setCreateError(err?.response?.data?.error || "Erreur lors de la création de l'utilisateur");
                    } finally {
                      setCreateLoading(false);
                    }
                  }}>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Email</label>
                      <input
                        type="email"
                        value={newUserEmail}
                        onChange={e => setNewUserEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 15 }}
                      />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Mot de passe</label>
                      <input
                        type="password"
                        value={newUserPassword}
                        onChange={e => setNewUserPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 15 }}
                      />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Confirmer le mot de passe</label>
                      <input
                        type="password"
                        value={newUserPasswordConfirm}
                        onChange={e => setNewUserPasswordConfirm(e.target.value)}
                        required
                        style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 15 }}
                      />
                    </div>
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Rôle</label>
                      <select
                        value={newUserRole}
                        onChange={e => setNewUserRole(e.target.value as 'user' | 'admin')}
                        style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 15 }}
                      >
                        <option value="user">Utilisateur</option>
                        <option value="admin">Administrateur</option>
                      </select>
                    </div>
                    {createError && <div style={{ color: '#dc2626', marginBottom: 12 }}>{createError}</div>}
                    {createSuccess && <div style={{ color: '#22c55e', marginBottom: 12 }}>{createSuccess}</div>}
                    <button
                      type="submit"
                      disabled={createLoading}
                      style={{
                        background: '#a13e97',
                        color: 'white',
                        border: 'none',
                        borderRadius: 8,
                        padding: '10px 18px',
                        fontWeight: 700,
                        fontSize: 16,
                        width: '100%',
                        cursor: createLoading ? 'not-allowed' : 'pointer',
                        opacity: createLoading ? 0.7 : 1
                      }}
                    >
                      {createLoading ? 'Création...' : 'Créer'}
                    </button>
                  </form>
                </div>
              </div>
            )}
            {usersLoading ? (
              <div style={{ textAlign: 'center', padding: 40 }}>Chargement...</div>
            ) : usersError ? (
              <div style={{ color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: 16, marginBottom: 24 }}>{usersError}</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--color-card)', borderRadius: 12, boxShadow: 'var(--shadow-card)' }}>
                  <thead>
                    <tr style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
                      <th style={{ padding: 12, textAlign: 'left' }}>Email</th>
                      <th style={{ padding: 12, textAlign: 'left' }}>Rôle</th>
                      <th style={{ padding: 12, textAlign: 'left' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userList.map((user) => (
                      <tr key={user._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: 12 }}>{user.email}</td>
                        <td style={{ padding: 12, textTransform: 'capitalize' }}>{user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}</td>
                        <td style={{ padding: 12 }}>
                          {user._id !== currentUserId && (
                            <>
                              {user.role === 'user' ? (
                                <button
                                  onClick={() => handleRoleChange(user._id, 'admin')}
                                  style={{ background: '#a13e97', color: 'white', border: 'none', borderRadius: 8, padding: '8px 12px', marginRight: 8, cursor: 'pointer', fontWeight: 600 }}
                                >
                                  Promouvoir admin
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleRoleChange(user._id, 'user')}
                                  style={{ background: '#6366f1', color: 'white', border: 'none', borderRadius: 8, padding: '8px 12px', marginRight: 8, cursor: 'pointer', fontWeight: 600 }}
                                >
                                  Rétrograder utilisateur
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontWeight: 600 }}
                              >
                                Supprimer
                              </button>
                            </>
                          )}
                          {user._id === currentUserId && <span style={{ color: '#a13e97', fontWeight: 600 }}>Vous</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {userList.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>Aucun utilisateur trouvé.</div>}
              </div>
            )}
          </div>
        ) : activeTab === 'purchases' ? (
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
              <span style={{ fontSize: 20 }}>📦</span>
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
        ) : activeTab === 'products' ? (
          <div>
            <h3 style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>🛒</span>
              Gestion des produits
            </h3>
            <button
              onClick={() => openProductModal()}
              style={{ background: '#a13e97', color: 'white', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 700, fontSize: 16, marginBottom: 24, cursor: 'pointer', boxShadow: 'var(--shadow-card)' }}
            >
              + Ajouter un produit
            </button>
            {productsLoading ? (
              <div style={{ textAlign: 'center', padding: 40 }}>Chargement...</div>
            ) : productsError ? (
              <div style={{ color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: 16, marginBottom: 24 }}>{productsError}</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--color-card)', borderRadius: 12, boxShadow: 'var(--shadow-card)' }}>
                  <thead>
                    <tr style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
                      <th style={{ padding: 12, textAlign: 'left' }}>Image</th>
                      <th style={{ padding: 12, textAlign: 'left' }}>Titre</th>
                      <th style={{ padding: 12, textAlign: 'left' }}>Catégorie</th>
                      <th style={{ padding: 12, textAlign: 'left' }}>Prix (DT)</th>
                      <th style={{ padding: 12, textAlign: 'left' }}>Description</th>
                      <th style={{ padding: 12, textAlign: 'left' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productList.map((product) => (
                      <tr key={product._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: 12 }}>
                          {product.image ? <img src={product.image} alt={product.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }} /> : <span style={{ color: '#aaa' }}>Aucune</span>}
                        </td>
                        <td style={{ padding: 12 }}>{product.name}</td>
                        <td style={{ padding: 12 }}>{product.categorie}</td>
                        <td style={{ padding: 12 }}>{product.price.toFixed(2)}</td>
                        <td style={{ padding: 12, maxWidth: 200, whiteSpace: 'pre-line', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.description}</td>
                        <td style={{ padding: 12 }}>
                          <button
                            onClick={() => openProductModal(product)}
                            style={{ background: '#6366f1', color: 'white', border: 'none', borderRadius: 8, padding: '8px 12px', marginRight: 8, cursor: 'pointer', fontWeight: 600 }}
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontWeight: 600 }}
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {productList.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>Aucun produit trouvé.</div>}
              </div>
            )}
            {showProductModal && (
              <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ background: 'var(--color-card)', borderRadius: 16, padding: 32, minWidth: 340, boxShadow: '0 8px 32px rgba(124,58,237,0.15)', position: 'relative', maxHeight: '80vh', overflowY: 'auto' }}>
                  <button
                    onClick={() => setShowProductModal(false)}
                    style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: 22, color: '#a13e97', cursor: 'pointer' }}
                    aria-label="Fermer"
                  >
                    ×
                  </button>
                  <h4 style={{ fontSize: 20, fontWeight: 700, marginBottom: 18, color: 'var(--color-primary)' }}>
                    {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
                  </h4>
                  <form onSubmit={handleProductFormSubmit}>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Titre</label>
                      <input
                        type="text"
                        name="name"
                        value={productForm.name}
                        onChange={handleProductFormChange}
                        required
                        style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 15 }}
                      />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Catégorie</label>
                      <select
                        name="categorie"
                        value={productForm.categorie}
                        onChange={handleProductFormChange}
                        required
                        style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 15 }}
                      >
                        {productCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Prix (DT)</label>
                      <input
                        type="number"
                        name="price"
                        min="0"
                        step="0.01"
                        value={productForm.price}
                        onChange={handleProductFormChange}
                        required
                        style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 15 }}
                      />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Description</label>
                      <textarea
                        name="description"
                        value={productForm.description}
                        onChange={handleProductFormChange}
                        required
                        rows={4}
                        style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 15 }}
                      />
                    </div>
                    <div style={{ marginBottom: 20 }}>
                      <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Image</label>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleProductFormChange}
                        style={{ width: '100%' }}
                      />
                      {editingProduct && editingProduct.image && (
                        <div style={{ marginTop: 8 }}>
                          <img src={editingProduct.image} alt="Produit" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }} />
                        </div>
                      )}
                    </div>
                    {productFormError && <div style={{ color: '#dc2626', marginBottom: 12 }}>{productFormError}</div>}
                    {productFormSuccess && <div style={{ color: '#22c55e', marginBottom: 12 }}>{productFormSuccess}</div>}
                    <button
                      type="submit"
                      disabled={productFormLoading}
                      style={{
                        background: '#a13e97',
                        color: 'white',
                        border: 'none',
                        borderRadius: 8,
                        padding: '10px 18px',
                        fontWeight: 700,
                        fontSize: 16,
                        width: '100%',
                        cursor: productFormLoading ? 'not-allowed' : 'pointer',
                        opacity: productFormLoading ? 0.7 : 1
                      }}
                    >
                      {productFormLoading ? (editingProduct ? 'Modification...' : 'Ajout...') : (editingProduct ? 'Modifier' : 'Ajouter')}
                    </button>
                  </form>
                </div>
              </div>
            )}
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
    </div>
  );
}; 