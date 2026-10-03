import express from 'express';
import Pizza from '../models/Pizza.js';
import Inventory from '../models/Inventory.js';

const router = express.Router();

// @route   GET /api/pizzas
// @desc    Fetch all preset menu pizzas
router.get('/', async (req, res) => {
  try {
    const pizzas = await Pizza.find({});
    res.json(pizzas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/pizzas/builder-options
// @desc    Fetch available bases, sauces, cheeses, and veggies for custom builder
router.get('/builder-options', async (req, res) => {
  try {
    const inventory = await Inventory.find({});

    const bases = inventory.filter((item) => item.category === 'base');
    const sauces = inventory.filter((item) => item.category === 'sauce');
    const cheeses = inventory.filter((item) => item.category === 'cheese');
    const veggies = inventory.filter((item) => item.category === 'veggie');

    res.json({
      bases,
      sauces,
      cheeses,
      veggies
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;