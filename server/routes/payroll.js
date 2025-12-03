const express = require('express');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const Payroll = require('../models/Payroll');
const router = express.Router();

// @route   POST /api/payroll
// @desc    Create a new payroll entry
// @access  Private (requires valid Clerk JWT)
router.post('/', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { employeeName, employeeId, position, hoursWorked, hourlyRate, benefits, taxRate, payPeriod, paymentDate, status, notes } = req.body;
    const clerkId = req.auth.userId;

    // Create new payroll entry
    const payroll = new Payroll({
      clerkId,
      employeeName: employeeName.trim(),
      employeeId: employeeId.trim(),
      position: position.trim(),
      hoursWorked: parseFloat(hoursWorked),
      hourlyRate: parseFloat(hourlyRate.toString().replace(/,/g, '')),
      benefits: benefits ? parseFloat(benefits.toString().replace(/,/g, '')) : 0,
      taxRate: taxRate ? parseFloat(taxRate) : 15,
      payPeriod,
      paymentDate: new Date(paymentDate),
      status: status || 'Pending',
      notes: notes ? notes.trim() : ''
    });

    await payroll.save();

    res.status(201).json({
      success: true,
      message: 'Payroll entry created successfully',
      data: payroll
    });

  } catch (error) {
    console.error('Error creating payroll entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payroll entry',
      error: error.message
    });
  }
});

// @route   GET /api/payroll
// @desc    Get all payroll entries for the authenticated user
// @access  Private (requires valid Clerk JWT)
router.get('/', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    
    const payrollEntries = await Payroll
      .find({ clerkId })
      .sort({ paymentDate: -1 }); // Sort by most recent payment date

    res.status(200).json({
      success: true,
      count: payrollEntries.length,
      data: payrollEntries
    });

  } catch (error) {
    console.error('Error fetching payroll entries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payroll entries'
    });
  }
});

// @route   GET /api/payroll/:id
// @desc    Get a single payroll entry by ID
// @access  Private (requires valid Clerk JWT)
router.get('/:id', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const payroll = await Payroll.findOne({ 
      _id: req.params.id, 
      clerkId 
    });

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: 'Payroll entry not found'
      });
    }

    res.status(200).json({
      success: true,
      data: payroll
    });

  } catch (error) {
    console.error('Error fetching payroll entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payroll entry'
    });
  }
});

// @route   PUT /api/payroll/:id
// @desc    Update a payroll entry
// @access  Private (requires valid Clerk JWT)
router.put('/:id', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const { employeeName, employeeId, position, hoursWorked, hourlyRate, benefits, taxRate, payPeriod, paymentDate, status, notes } = req.body;

    const payroll = await Payroll.findOne({ 
      _id: req.params.id, 
      clerkId 
    });

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: 'Payroll entry not found'
      });
    }

    // Update fields
    if (employeeName) payroll.employeeName = employeeName.trim();
    if (employeeId) payroll.employeeId = employeeId.trim();
    if (position) payroll.position = position.trim();
    if (hoursWorked !== undefined) payroll.hoursWorked = parseFloat(hoursWorked);
    if (hourlyRate !== undefined) payroll.hourlyRate = parseFloat(hourlyRate.toString().replace(/,/g, ''));
    if (benefits !== undefined) payroll.benefits = parseFloat(benefits.toString().replace(/,/g, ''));
    if (taxRate !== undefined) payroll.taxRate = parseFloat(taxRate);
    if (payPeriod) payroll.payPeriod = payPeriod;
    if (paymentDate) payroll.paymentDate = new Date(paymentDate);
    if (status) payroll.status = status;
    if (notes !== undefined) payroll.notes = notes.trim();

    await payroll.save();

    res.status(200).json({
      success: true,
      message: 'Payroll entry updated successfully',
      data: payroll
    });

  } catch (error) {
    console.error('Error updating payroll entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payroll entry'
    });
  }
});

// @route   DELETE /api/payroll/:id
// @desc    Delete a payroll entry
// @access  Private (requires valid Clerk JWT)
router.delete('/:id', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    
    const payroll = await Payroll.findOneAndDelete({ 
      _id: req.params.id, 
      clerkId 
    });

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: 'Payroll entry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payroll entry deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting payroll entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete payroll entry'
    });
  }
});

module.exports = router;
