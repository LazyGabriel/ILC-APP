const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Order = require('../models/Order');
const { sendOrderConfirmation } = require('../utils/email');

// Generate a human-friendly order ID
const generateOrderId = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 900000 + 100000);
  return `ILC-${year}-${random}`;
};

// POST /api/orders — Create new order
router.post('/', async (req, res, next) => {
  try {
    const {
      schoolName, contactName, email, phone,
      address, city, country, zip, vat, notes,
      items, total,
    } = req.body;

    if (!schoolName || !contactName || !email || !phone || !address || !city || !zip) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one item' });
    }

    const orderId = generateOrderId();
    const trackingToken = uuidv4();

    const order = await Order.create({
      orderId, trackingToken,
      schoolName, contactName, email, phone,
      address, city, country: country || 'Czech Republic', zip,
      vat: vat || '', notes: notes || '',
      items, total,
      status: 'pending',
    });

    // Send confirmation email (non-blocking)
    sendOrderConfirmation(order).catch(console.error);

    res.status(201).json({
      success: true,
      orderId: order.orderId,
      trackingToken: order.trackingToken,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/:orderId — Track order by ID + token
router.get('/:orderId', async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { token } = req.query;

    const query = { orderId };
    // Token is optional — if provided it must match (for email tracking link)
    if (token) query.trackingToken = token;

    const order = await Order.findOne(query).select('-trackingToken -__v');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      orderId: order.orderId,
      status: order.status,
      placedOn: order.createdAt,
      schoolName: order.schoolName,
      email: order.email,
      items: order.items,
      total: order.total,
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/orders/:orderId/status — Update order status (admin)
router.patch('/:orderId/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    res.json({ success: true, orderId: order.orderId, status: order.status });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders — List all orders (admin)
router.get('/', async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};
    const orders = await Order.find(query)
      .select('-trackingToken -__v')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    const total = await Order.countDocuments(query);
    res.json({ success: true, orders, total, page: Number(page) });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
