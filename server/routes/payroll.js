const express = require('express');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');
const router = express.Router();

// =============================================
// PAYROLL ENTRY ROUTES (Your Implementation)
// =============================================

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
// @desc    Get all payroll entries OR employees (supports both)
// @access  Private (requires valid Clerk JWT)
router.get('/', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { type } = req.query; // ?type=entries or ?type=employees
    
    // If requesting employees specifically (teammate's implementation)
    if (type === 'employees') {
      const employees = await Employee.find({ 
        $or: [{ clerkId: userId }, { userId: userId }]
      }).sort({ createdAt: -1 });

      return res.json({
        success: true,
        data: employees
      });
    }
    
    // Default: Return payroll entries (your implementation)
    const payrollEntries = await Payroll
      .find({ clerkId: userId })
      .sort({ paymentDate: -1 }); // Sort by most recent payment date

    res.status(200).json({
      success: true,
      count: payrollEntries.length,
      data: payrollEntries
    });

  } catch (error) {
    console.error('Error fetching payroll data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payroll data'
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
// @desc    Update a payroll entry OR employee (detects which model)
// @access  Private (requires valid Clerk JWT)
router.put('/:id', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { id } = req.params;
    
    // Check if this is an employee update (teammate's approach) or payroll update (your approach)
    const isEmployeeUpdate = req.body.name || req.body.salary || req.body.startDate;
    
    if (isEmployeeUpdate) {
      // Employee update (teammate's implementation)
      const { name, position, salary, status, startDate } = req.body;
      const updatedEmployee = await Employee.findOneAndUpdate(
        { _id: id, $or: [{ clerkId: userId }, { userId: userId }] },
        {
          name: name?.trim(),
          position: position?.trim(),
          salary: salary ? parseFloat(salary) : undefined,
          status,
          startDate: startDate ? new Date(startDate) : undefined
        },
        { new: true }
      );

      if (!updatedEmployee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found or unauthorized'
        });
      }

      return res.json({
        success: true,
        message: 'Employee updated successfully',
        data: updatedEmployee
      });
    }

    // Payroll entry update (your implementation)
    const { employeeName, employeeId, position, hoursWorked, hourlyRate, benefits, taxRate, payPeriod, paymentDate, status, notes } = req.body;

    const payroll = await Payroll.findOne({ 
      _id: id, 
      clerkId: userId 
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
    console.error('Error updating payroll/employee:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update'
    });
  }
});

// @route   DELETE /api/payroll/:id
// @desc    Delete a payroll entry OR employee (detects which model)
// @access  Private (requires valid Clerk JWT)
router.delete('/:id', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { id } = req.params;
    
    // Try deleting as payroll entry first
    const payroll = await Payroll.findOneAndDelete({ 
      _id: id, 
      clerkId: userId 
    });

    if (payroll) {
      return res.status(200).json({
        success: true,
        message: 'Payroll entry deleted successfully'
      });
    }

    // Try deleting as employee (teammate's implementation)
    const deletedEmployee = await Employee.findOneAndDelete({ 
      _id: id, 
      $or: [{ clerkId: userId }, { userId: userId }]
    });

    if (deletedEmployee) {
      return res.json({
        success: true,
        message: 'Employee deleted successfully'
      });
    }

    return res.status(404).json({
      success: false,
      message: 'Record not found or unauthorized'
    });

  } catch (error) {
    console.error('Error deleting:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete'
    });
  }
});

module.exports = router;
