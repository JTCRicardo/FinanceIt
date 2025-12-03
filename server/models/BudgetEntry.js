const mongoose = require('mongoose');

const budgetEntrySchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    index: true 
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

  entryType: {
    type: String,
    enum: ['income', 'expense'],
    default: 'expense'
  },
  category: {
    type: String,
    required: true,
    enum: ['Transportation', 'Rent', 'Utilities', 'Other', 'Income']
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
  timestamps: true 
});

budgetEntrySchema.index({ clerkId: 1, date: -1 });

module.exports = mongoose.model('BudgetEntry', budgetEntrySchema);