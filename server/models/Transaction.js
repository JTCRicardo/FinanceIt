const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    index: true
  },
  itemTitle: {
    type: String,
    required: true,
    trim: true
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  totalRevenue: {
    type: Number,
    required: true,
    min: 0
  },
  transactionType: {
    type: String,
    enum: ['sale', 'expense'],
    default: 'sale'
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  inventoryLogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InventoryLog',
    required: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
transactionSchema.index({ clerkId: 1, date: -1 });
transactionSchema.index({ clerkId: 1, transactionType: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
