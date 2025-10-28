const express = require('express');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const BudgetEntry = require('../models/BudgetEntry');
const router = express.Router();

// @route   POST /api/budget-entries
// @desc    Create a new budget entry
// @access  Private (requires valid Clerk JWT)
router.post('/', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { title, cost, amount, category, description, date } = req.body;
    const clerkId = req.auth.userId;

    // Create new budget entry
    const budgetEntry = new BudgetEntry({
      clerkId,
      title: title.trim(),
      cost: parseFloat(cost.toString().replace(/,/g, '')), // Remove commas and convert to number
      amount: parseInt(amount),
      category,
      description: description ? description.trim() : '',
      date: new Date(date)
    });

    await budgetEntry.save();

    res.status(201).json({
      success: true,
      message: 'Budget entry created successfully',
      data: budgetEntry
    });

  } catch (error) {
    console.error('Error creating budget entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create budget entry'
    });
  }
});

// @route   GET /api/budget-entries
// @desc    Get all budget entries for the authenticated user
// @access  Private (requires valid Clerk JWT)
router.get('/', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    
    const budgetEntries = await BudgetEntry
      .find({ clerkId })
      .sort({ date: -1, createdAt: -1 }); // Most recent first

    res.json({
      success: true,
      data: budgetEntries
    });

  } catch (error) {
    console.error('Error fetching budget entries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch budget entries'
    });
  }
});

module.exports = router;
