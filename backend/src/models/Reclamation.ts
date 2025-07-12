import mongoose from 'mongoose';

export interface IReclamation extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  message: string;
  status: 'en attente' | 'en cours' | 'fini';
}

const reclamationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['en attente', 'en cours', 'fini'],
    default: 'en attente',
  },
}, {
  timestamps: true,
});

export const Reclamation = mongoose.model<IReclamation>('Reclamation', reclamationSchema); 