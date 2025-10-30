const mongoose = require('mongoose');

const inventoryLogSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    index: true // For faster queries by user
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  date: {
    type: Date,
    required: true
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Index for efficient queries by user and date
inventoryLogSchema.index({ clerkId: 1, date: -1 });

module.exports = mongoose.model('InventoryLog', inventoryLogSchema);

