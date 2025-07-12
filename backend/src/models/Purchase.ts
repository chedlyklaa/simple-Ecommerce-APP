import mongoose from 'mongoose';

export interface IPurchase extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  status: 'pending' | 'confirmed' | 'rejected';
}

const purchaseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

export const Purchase = mongoose.model<IPurchase>('Purchase', purchaseSchema); 