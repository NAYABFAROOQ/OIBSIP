import express from 'express';
import Order from '../models/Order.js';
import Inventory from '../models/Inventory.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/orders
// @desc    Create a new pizza order & decrement inventory
router.post('/', protect, async (req, res) => {
  const { items, deliveryAddress } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No items in order' });
  }

  try {
    let totalAmount = 0;

    // Verify stock & calculate total
    for (const item of items) {
      totalAmount += item.price * (item.quantity || 1);

      // Decrement Base stock
      if (item.base) {
        const baseItem = await Inventory.findOne({ name: item.base });
        if (baseItem && baseItem.stock > 0) {
          baseItem.stock -= 1;
          await baseItem.save();
        }
      }

      // Decrement Sauce stock
      if (item.sauce) {
        const sauceItem = await Inventory.findOne({ name: item.sauce });
        if (sauceItem && sauceItem.stock > 0) {
          sauceItem.stock -= 1;
          await sauceItem.save();
        }
      }

      // Decrement Cheese stock
      if (item.cheese) {
        const cheeseItem = await Inventory.findOne({ name: item.cheese });
        if (cheeseItem && cheeseItem.stock > 0) {
          cheeseItem.stock -= 1;
          await cheeseItem.save();
        }
      }

      // Decrement Veggies stock
      if (item.veggies && Array.isArray(item.veggies)) {
        for (const vegName of item.veggies) {
          const vegItem = await Inventory.findOne({ name: vegName });
          if (vegItem && vegItem.stock > 0) {
            vegItem.stock -= 1;
            await vegItem.save();
          }
        }
      }
    }

    // Create the Order
    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount: Math.round(totalAmount * 100) / 100,
      deliveryAddress,
      orderStatus: 'Order Received',
      paymentStatus: 'Completed', // Simulating successful checkout
      razorpayPaymentId: 'pay_' + Math.random().toString(36).substring(7)
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders/my-orders
// @desc    Get logged in user orders
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order details and real-time status
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;