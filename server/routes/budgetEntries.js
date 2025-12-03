const express = require('express');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const BudgetEntry = require('../models/BudgetEntry');
const router = express.Router();

// @route   POST /api/budget-entries
router.post('/', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { title, cost, amount, category, description, date, entryType } = req.body;
    const clerkId = req.auth.userId;

    const budgetEntry = new BudgetEntry({
      clerkId,
      title: title.trim(),
      cost: parseFloat(cost.toString().replace(/,/g, '')),
      amount: parseInt(amount),
      entryType: entryType || 'expense', 
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
// ... (Keep your existing GET route, it is perfect)
router.get('/', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const budgetEntries = await BudgetEntry
      .find({ clerkId })
      .sort({ date: -1, createdAt: -1 });

    res.json({ success: true, data: budgetEntries });
  } catch (error) {
    console.error('Error fetching budget entries:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch budget entries' });
  }
});

module.exports = router;