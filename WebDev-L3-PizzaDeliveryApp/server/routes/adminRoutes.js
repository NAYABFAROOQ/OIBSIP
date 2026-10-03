import express from 'express';
import Order from '../models/Order.js';
import Inventory from '../models/Inventory.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication & admin-only check to all routes in this file
router.use(protect, adminOnly);

// @route   GET /api/admin/inventory
// @desc    View current inventory levels & low stock flags
router.get('/inventory', async (req, res) => {
  try {
    const inventory = await Inventory.find({}).sort({ category: 1, name: 1 });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/admin/inventory/:id
// @desc    Manually update inventory stock count
router.put('/inventory/:id', async (req, res) => {
  const { stock, price } = req.body;

  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    if (stock !== undefined) item.stock = stock;
    if (price !== undefined) item.price = price;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admin/orders
// @desc    View all orders across all users
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/admin/orders/:id/status
// @desc    Update order status ('Order Received' -> 'In Kitchen' -> 'Sent to Delivery' -> 'Delivered')
router.put('/orders/:id/status', async (req, res) => {
  const { status } = req.body;

  const validStatuses = ['Order Received', 'In Kitchen', 'Sent to Delivery', 'Delivered'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid order status' });
  }

  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;