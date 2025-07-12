import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { auth } from '../middleware/auth';

const router = express.Router();

// Register
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const user = new User({ email, password });
    await user.save();

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET!);
    res.status(201).json({ user, token });
  } catch (err: any) {
    console.error('Signup error:', err);
    res.status(400).json({ error: err.message || 'Error creating user' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    const isMatch = await user.comparePassword(password);
    console.log(isMatch);
    if (!isMatch) {
      console.log('Invalid login credentials');
      return res.status(401).json({ error: 'Invalid login credentials' });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET!);
    console.log(token);
    res.json({ user, token });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(400).json({ error: err.message || 'Error logging in' });
  }
});

// Get current user
router.get('/me', auth, async (req: Request & { user?: any }, res: Response) => {
  res.json(req.user);
});

export default router; 