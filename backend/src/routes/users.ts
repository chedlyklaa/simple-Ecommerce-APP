import express from 'express';
import { User } from '../models/User';
import { auth, requireAdmin } from '../middleware/auth';

const router = express.Router();

// GET /api/users - List all users (admin only)
router.get('/', auth, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/users - Create a new user (admin only)
router.post('/', auth, requireAdmin, async (req, res) => {
  const { email, password, role = 'admin' } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Rôle invalide' });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email déjà utilisé' });
    }
    const user = new User({ email, password, role });
    await user.save();
    const userObj = user.toObject();
    delete userObj["password"];
    res.status(201).json(userObj);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
  }
});

// PATCH /api/users/:id/role - Update user role (admin only)
router.patch('/:id/role', auth, requireAdmin, async (req, res) => {
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true, context: 'query' }
    ).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/users/:id - Delete user (admin only)
router.delete('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 