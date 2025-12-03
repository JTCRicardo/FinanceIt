const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    index: true // For faster queries by user
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
  hoursWorked: {
    type: Number,
    required: true,
    min: 0
  },
  hourlyRate: {
    type: Number,
    required: true,
    min: 0
  },
  salary: {
    type: Number,
    min: 0
  },
  benefits: {
    type: Number,
    default: 0,
    min: 0
  },
  taxRate: {
    type: Number,
    default: 15, // Default 15% tax rate
    min: 0,
    max: 100
  },
  deductions: {
    type: Number,
    min: 0
  },
  netPay: {
    type: Number,
    min: 0
  },
  payPeriod: {
    type: String,
    required: true,
    enum: ['Weekly', 'Bi-weekly', 'Monthly', 'Annually']
  },
  paymentDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Processed', 'Paid'],
    default: 'Pending'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Index for efficient queries by user and payment date
payrollSchema.index({ clerkId: 1, paymentDate: -1 });

// Calculate salary, deductions, and net pay before saving
payrollSchema.pre('save', function(next) {
  // Calculate gross salary from hours and hourly rate
  this.salary = this.hoursWorked * this.hourlyRate;
  
  // Calculate tax deductions (taxRate is a percentage)
  this.deductions = (this.salary * this.taxRate) / 100;
  
  // Calculate net pay
  this.netPay = this.salary + this.benefits - this.deductions;
  
  next();
});

module.exports = mongoose.model('Payroll', payrollSchema);
