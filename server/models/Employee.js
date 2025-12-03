const mongoose = require('mongoose');

// Merged schema supporting both user approaches
const employeeSchema = new mongoose.Schema({
  // User ID - support both clerkId and userId
  clerkId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: String,
    index: true
  },
  // Employee Name - support both naming conventions
  employeeName: {
    type: String,
    trim: true,
    maxlength: 100
  },
  name: {
    type: String,
    trim: true
  },
  // Employee ID (unique per user)
  employeeId: {
    type: String,
    trim: true,
    maxlength: 50
  },
  // Position/Role
  position: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  // Compensation - support both hourlyRate and salary
  hourlyRate: {
    type: Number,
    min: 0
  },
  salary: {
    type: Number,
    min: 0
  },
  // Tax Rate (for payroll calculations)
  taxRate: {
    type: Number,
    default: 15,
    min: 0,
    max: 100
  },
  // Status - normalize to support both formats
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'active', 'inactive'],
    default: 'Active'
  },
  // Start Date (when employee joined)
  startDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to ensure unique employee IDs per user
employeeSchema.index({ clerkId: 1, employeeId: 1 }, { unique: true, sparse: true });

// Virtual to get effective name
employeeSchema.virtual('effectiveName').get(function() {
  return this.employeeName || this.name;
});

// Virtual to get effective user ID
employeeSchema.virtual('effectiveUserId').get(function() {
  return this.clerkId || this.userId;
});

module.exports = mongoose.model('Employee', employeeSchema);
