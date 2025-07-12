import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from './src/models/Product';
import { User } from './src/models/User';

// Load env variables
dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://chedlyklaa:chedlyklaa@cluster0.3rsmm.mongodb.net/ahmedapp?retryWrites=true&w=majority&appName=Cluster0';

const products = [
  {
    name: 'Imprimante ITS L1300 - Couleur A3',
    description: 'Imprimante couleur professionnelle format A3 avec haute qualité d\'impression et grande capacité de papier. Idéale pour les bureaux et studios graphiques.',
    price: 1299.99,
    image: '/images/products/Imprimantes Couleur A3 IMPRIMANTE ITS L1300.jpg',
    categorie: 'imprimante laser',
  },
  {
    name: 'Bizhub 4000i - Noir et Blanc A4',
    description: 'Imprimante multifonction noir et blanc haute vitesse avec impression, numérisation, copie et fax. Parfaite pour les environnements de travail intensifs.',
    price: 899.99,
    image: '/images/products/Imprimantes Noir et Blanc A4 Bizhub 4000i.png',
    categorie: 'imprimante laser',
  },
  {
    name: 'AccurioLabel 230 - Impression d\'étiquettes',
    description: 'Système d\'impression d\'étiquettes professionnel avec haute précision et grande variété de supports. Solution complète pour l\'étiquetage industriel.',
    price: 2499.99,
    image: '/images/products/PRESS Impression d\'étiquettes AccurioLabel 230.jpg',
    categorie: 'PRO & PRESS',
  },
  {
    name: 'Accurio Press C4065 - PRO Couleur',
    description: 'Presse numérique couleur professionnelle avec impression recto-verso automatique et finition avancée. Pour les impressions commerciales de haute qualité.',
    price: 15999.99,
    image: '/images/products/PRO couleur Accurio Press C4065.png',
    categorie: 'PRO & PRESS',
  },
  {
    name: 'AccurioPrint 2100 - PRO Noir et Blanc',
    description: 'Presse numérique noir et blanc haute performance avec système de finition intégré. Idéale pour les impressions en volume et la production documentaire.',
    price: 8999.99,
    image: '/images/products/PRO Noir et blanc AccurioPrint 2100.png',
    categorie: 'PRO & PRESS',
  },
  {
    name: 'Konica Minolta Bizhub 225i - Noir et Blanc',
    description: 'Imprimante multifonction compacte noir et blanc avec interface intuitive et connectivité réseau avancée. Parfaite pour les petits bureaux.',
    price: 599.99,
    image: '/images/products/konica minolta Bizhub 225i noir et blanc.png',
    categorie: "systémes d'impression",
  },
  {
    name: 'Konica Minolta Bizhub 4020i - Noir et Blanc',
    description: 'Imprimante multifonction noir et blanc haute vitesse avec sécurité renforcée et gestion documentaire avancée. Pour les entreprises de taille moyenne.',
    price: 1299.99,
    image: '/images/products/konica minolta bizhub 4020i noir et blanc.png',
    categorie: "systémes d'impression",
  },
  {
    name: 'Konica Minolta Bizhub C257i - Couleur',
    description: 'Imprimante multifonction couleur avec impression de qualité photo et système de gestion des couleurs avancé. Idéale pour les créatifs et designers.',
    price: 1899.99,
    image: '/images/products/konica minolta bizhub C257i couleur.jpg',
    categorie: "systémes d'impression",
  },
  {
    name: 'Konica Minolta Bizhub C3321i - Couleur',
    description: 'Imprimante multifonction couleur haute performance avec impression recto-verso automatique et finition professionnelle. Pour les environnements de production.',
    price: 2499.99,
    image: '/images/products/konica minolta bizhub C3321i couleur.png',
    categorie: "systémes d'impression",
  },
];

const adminUser = {
  email: 'admin@example.com',
  password: 'admin123', // Will be hashed by the User model
  role: 'admin',
};

async function seed() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding (ahmedapp database).');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({ email: adminUser.email });

    // Insert products
    await Product.insertMany(products);
    console.log('Inserted products.');

    // Insert admin user
    await User.create(adminUser);
    console.log('Inserted admin user (email: admin@example.com, password: admin123)');

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed(); 