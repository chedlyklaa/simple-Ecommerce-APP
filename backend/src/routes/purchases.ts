import express, { Request, Response } from 'express';
import { Purchase } from '../models/Purchase';
import { auth } from '../middleware/auth';
import { requireAdmin } from '../middleware/auth';

const router = express.Router();

interface AuthRequest extends Request {
  user?: any;
}

// Get user's purchases
router.get('/my', auth, async (req: AuthRequest, res: Response) => {
  try {
    const purchases = await Purchase.find({ user: req.user._id })
      .populate('product')
      .sort({ createdAt: -1 });
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching purchases' });
  }
});

// Create purchase request
router.post('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const purchase = new Purchase({
      user: req.user._id,
      product: req.body.productId,
      status: 'pending'
    });
    await purchase.save();
    res.status(201).json(purchase);
  } catch (err) {
    res.status(400).json({ error: 'Error creating purchase request' });
  }
});

// Get all purchases (admin only)
router.get('/', auth, requireAdmin, async (_req: Request, res: Response) => {
  try {
    const purchases = await Purchase.find()
      .populate('user', 'email')
      .populate('product')
      .sort({ createdAt: -1 });
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching purchases' });
  }
});

// Update purchase status (admin only)
router.patch('/:id/status', auth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const purchase = await Purchase.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('product');

    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    res.json(purchase);
  } catch (err) {
    res.status(400).json({ error: 'Error updating purchase status' });
  }
});

export default router; 