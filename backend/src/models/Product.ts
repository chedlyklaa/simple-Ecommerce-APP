import mongoose from 'mongoose';

export interface IProduct extends mongoose.Document {
  name: string;
  description: string;
  price: number;
  image?: string;
  categorie: string;
}

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  image: {
    type: String,
  },
  categorie: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export const Product = mongoose.model<IProduct>('Product', productSchema); 