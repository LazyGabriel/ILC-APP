const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  id: String,
  title: String,
  author: String,
  publisher: String,
  language: String,
  level: String,
  price: Number,
  qty: Number,
  cover: String,
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
    },
    trackingToken: {
      type: String,
      unique: true,
      required: true,
    },
    // Customer / institution info
    schoolName: { type: String, required: true },
    contactName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, default: 'Czech Republic' },
    zip: { type: String, required: true },
    vat: { type: String, default: '' },
    notes: { type: String, default: '' },

    // Items
    items: [orderItemSchema],
    total: { type: Number, required: true },

    // Status
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },

    // Invoice
    invoiceSent: { type: Boolean, default: false },
    invoiceNumber: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
