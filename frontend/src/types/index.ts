export interface User {
  _id: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  categorie: string;
}

export interface Purchase {
  _id: string;
  user: User | string;
  product: Product | string;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: string;
}

export interface Reclamation {
  _id: string;
  user: User | string;
  message: string;
  status: 'en attente' | 'en cours' | 'fini';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
} 