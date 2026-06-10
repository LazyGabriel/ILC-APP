const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');
const { sendContactNotification } = require('../utils/email');

// POST /api/contact — Submit contact form
router.post('/', async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address' });
    }

    // Save to DB
    const msg = await ContactMessage.create({ name, email, subject, message });

    // Notify admin (non-blocking)
    sendContactNotification({ name, email, subject, message }).catch(console.error);

    res.status(201).json({ success: true, message: 'Message received. We will get back to you soon!' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
