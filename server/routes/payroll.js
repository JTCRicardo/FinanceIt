const express = require('express');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const Employee = require('../models/Employee');
const router = express.Router();
// @route   GET /api/payroll
// @access  Private (requires valid Clerk JWT)
router.get('/', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const userId = req.auth.userId; 
    
    const employees = await Employee.find({ userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: employees
    });
  } catch (error) {
    console.error('Error fetching payroll:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payroll data'
    });
  }
});

//add new employee
router.post('/', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { name, position, salary, status, startDate } = req.body;
    const userId = req.auth.userId;

    const employee = new Employee({
      userId,
      name: name.trim(),
      position: position.trim(),
      salary: parseFloat(salary),
      status: status || 'active',
      startDate: startDate ? new Date(startDate) : new Date()
    });

    await employee.save();

    res.status(201).json({
      success: true,
      message: 'Employee added successfully',
      data: employee
    });

  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add employee'
    });
  }
});

//update employee
router.put('/:id', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { id } = req.params;
    const { name, position, salary, status, startDate } = req.body;
    const updatedEmployee = await Employee.findOneAndUpdate(
      { _id: id, userId },
      {
        name: name.trim(),
        position: position.trim(),
        salary: parseFloat(salary),
        status,
        startDate: new Date(startDate)
      },
      { new: true } // Return the updated document
    );

    if (!updatedEmployee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found or unauthorized'
      });
    }

    res.json({
      success: true,
      message: 'Employee updated successfully',
      data: updatedEmployee
    });

  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update employee'
    });
  }
});

//delete employee
router.delete('/:id', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { id } = req.params;

    const deletedEmployee = await Employee.findOneAndDelete({ _id: id, userId });

    if (!deletedEmployee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found or unauthorized'
      });
    }

    res.json({
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