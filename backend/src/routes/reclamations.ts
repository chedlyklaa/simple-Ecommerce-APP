import express, { Request, Response } from 'express';
import { Reclamation } from '../models/Reclamation';
import { auth } from '../middleware/auth';
import { requireAdmin } from '../middleware/auth';

const router = express.Router();

interface AuthRequest extends Request {
  user?: any;
}

// Get user's reclamations
router.get('/my', auth, async (req: AuthRequest, res: Response) => {
  try {
    const reclamations = await Reclamation.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(reclamations);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching reclamations' });
  }
});

// Create reclamation
router.post('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const reclamation = new Reclamation({
      user: req.user._id,
      message: req.body.message,
      status: 'en attente'
    });
    await reclamation.save();
    res.status(201).json(reclamation);
  } catch (err) {
    res.status(400).json({ error: 'Error creating reclamation' });
  }
});

// Get all reclamations (admin only)
router.get('/', auth, requireAdmin, async (_req: Request, res: Response) => {
  try {
    const reclamations = await Reclamation.find()
      .populate('user', 'email')
      .sort({ createdAt: -1 });
    res.json(reclamations);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching reclamations' });
  }
});

// Update reclamation status (admin only)
router.patch('/:id/status', auth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!['en attente', 'en cours', 'fini'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const reclamation = await Reclamation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('user', 'email');

    if (!reclamation) {
      return res.status(404).json({ error: 'Reclamation not found' });
    }

    res.json(reclamation);
  } catch (err) {
    res.status(400).json({ error: 'Error updating reclamation status' });
  }
});

export default router; 