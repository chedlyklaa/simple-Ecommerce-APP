import express, { Request, Response } from 'express';
import { Product } from '../models/Product';
import { auth } from '../middleware/auth';
import { requireAdmin } from '../middleware/auth';

const router = express.Router();

// Get all products
router.get('/', async (_req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching products' });
  }
});

// Create product (admin only)
router.post('/', auth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: 'Error creating product' });
  }
});

// Update product (admin only)
router.put('/:id', auth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: 'Error updating product' });
  }
});

// Delete product (admin only)
router.delete('/:id', auth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting product' });
  }
});

export default router; 