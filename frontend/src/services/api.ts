import axios from 'axios';
import { User, Product, Purchase, Reclamation } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const auth = {
  login: (email: string, password: string) =>
    api.post<{ user: User; token: string }>('/auth/login', { email, password }),
  
  signup: (email: string, password: string) =>
    api.post<{ user: User; token: string }>('/auth/signup', { email, password }),
  
  getCurrentUser: () => api.get<User>('/auth/me'),
};

// Products API
export const products = {
  getAll: () => api.get<Product[]>('/products'),
  
  create: (data: Omit<Product, '_id'>) =>
    api.post<Product>('/products', data),
  
  update: (id: string, data: Partial<Product>) =>
    api.put<Product>(`/products/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/products/${id}`),
};

// Purchases API
export const purchases = {
  getAll: () => api.get<Purchase[]>('/purchases'),
  
  getMine: () => api.get<Purchase[]>('/purchases/my'),
  
  create: (productId: string) =>
    api.post<Purchase>('/purchases', { productId }),
  
  updateStatus: (id: string, status: Purchase['status']) =>
    api.patch<Purchase>(`/purchases/${id}/status`, { status }),
};

// Reclamations API
export const reclamations = {
  getAll: () => api.get<Reclamation[]>('/reclamations'),
  
  getMine: () => api.get<Reclamation[]>('/reclamations/my'),
  
  create: (message: string) =>
    api.post<Reclamation>('/reclamations', { message }),
  
  updateStatus: (id: string, status: Reclamation['status']) =>
    api.patch<Reclamation>(`/reclamations/${id}/status`, { status }),
};

export default api; 