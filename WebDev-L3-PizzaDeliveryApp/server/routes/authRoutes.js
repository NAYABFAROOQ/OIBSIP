import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const cleanEmail = email ? email.trim().toLowerCase() : '';

  try {
    // Guaranteed Demo Admin Access
    if (cleanEmail === 'admin@pizzadelivery.com' && password === 'admin123') {
      let admin = await User.findOne({ email: cleanEmail });
      if (!admin) {
        admin = await User.create({
          name: 'System Admin',
          email: cleanEmail,
          password: 'admin123',
          role: 'admin',
          isVerified: true
        });
      }
      return res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: 'admin',
        token: generateToken(admin._id)
      });
    }

    const user = await User.findOne({ email: cleanEmail }).select('+password');
    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    }

    return res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const cleanEmail = email ? email.trim().toLowerCase() : '';

  try {
    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email: cleanEmail,
      password,
      role: 'user',
      isVerified: true
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

export default router;