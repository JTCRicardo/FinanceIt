const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    index: true
  },
  employeeName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  employeeId: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  position: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  hourlyRate: {
    type: Number,
    required: true,
    min: 0
  },
  taxRate: {
    type: Number,
    default: 15,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, {
  timestamps: true
});

// Compound index to ensure unique employee IDs per user
employeeSchema.index({ clerkId: 1, employeeId: 1 }, { unique: true });

module.exports = mongoose.model('Employee', employeeSchema);
