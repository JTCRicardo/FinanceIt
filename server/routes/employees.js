const express = require('express');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const Employee = require('../models/Employee');
const router = express.Router();

// @route   POST /api/employees
// @desc    Create a new employee
// @access  Private
router.post('/', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { employeeName, employeeId, position, hourlyRate, taxRate, status } = req.body;
    const clerkId = req.auth.userId;

    const employee = new Employee({
      clerkId,
      employeeName: employeeName.trim(),
      employeeId: employeeId.trim(),
      position: position.trim(),
      hourlyRate: parseFloat(hourlyRate.toString().replace(/,/g, '')),
      taxRate: taxRate ? parseFloat(taxRate) : 15,
      status: status || 'Active'
    });

    await employee.save();

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee
    });

  } catch (error) {
    console.error('Error creating employee:', error);
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'Employee ID already exists'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to create employee',
        error: error.message
      });
    }
  }
});

// @route   GET /api/employees
// @desc    Get all employees for the authenticated user
// @access  Private
router.get('/', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const { status } = req.query;
    
    const filter = { clerkId };
    if (status) filter.status = status;

    const employees = await Employee
      .find(filter)
      .sort({ employeeName: 1 });

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });

  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employees'
    });
  }
});

// @route   GET /api/employees/:id
// @desc    Get a single employee by ID
// @access  Private
router.get('/:id', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const employee = await Employee.findOne({ 
      _id: req.params.id, 
      clerkId 
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      data: employee
    });

  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee'
    });
  }
});

// @route   PUT /api/employees/:id
// @desc    Update an employee
// @access  Private
router.put('/:id', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const { employeeName, employeeId, position, hourlyRate, taxRate, status } = req.body;

    const employee = await Employee.findOne({ 
      _id: req.params.id, 
      clerkId 
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    if (employeeName) employee.employeeName = employeeName.trim();
    if (employeeId) employee.employeeId = employeeId.trim();
    if (position) employee.position = position.trim();
    if (hourlyRate !== undefined) employee.hourlyRate = parseFloat(hourlyRate.toString().replace(/,/g, ''));
    if (taxRate !== undefined) employee.taxRate = parseFloat(taxRate);
    if (status) employee.status = status;

    await employee.save();

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: employee
    });

  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update employee'
    });
  }
});

// @route   DELETE /api/employees/:id
// @desc    Delete an employee
// @access  Private
router.delete('/:id', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    
    const employee = await Employee.findOneAndDelete({ 
      _id: req.params.id, 
      clerkId 
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete employee'
    });
  }
});

module.exports = router;
