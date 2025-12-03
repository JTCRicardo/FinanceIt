const express = require('express');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const Transaction = require('../models/Transaction');
const router = express.Router();

// @route   POST /api/transactions
// @desc    Create a new transaction (sale)
// @access  Private
router.post('/', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { itemTitle, unitPrice, quantity, inventoryLogId, date } = req.body;
    const clerkId = req.auth.userId;

    console.log('Creating transaction:', {
      clerkId,
      itemTitle,
      unitPrice,
      quantity,
      inventoryLogId,
      date
    });

    const totalRevenue = parseFloat(unitPrice) * parseInt(quantity);

    const transaction = new Transaction({
      clerkId,
      itemTitle: itemTitle.trim(),
      unitPrice: parseFloat(unitPrice),
      quantity: parseInt(quantity),
      totalRevenue,
      transactionType: 'sale',
      date: date ? new Date(date) : new Date(),
      inventoryLogId: inventoryLogId || undefined
    });

    await transaction.save();
    console.log('Transaction saved successfully:', transaction);

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: transaction
    });

  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create transaction',
      error: error.message
    });
  }
});

// @route   GET /api/transactions
// @desc    Get all transactions for the authenticated user
// @access  Private
router.get('/', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const { type, startDate, endDate } = req.query;
    
    console.log('Fetching transactions for user:', clerkId, 'with filters:', { type, startDate, endDate });
    
    const filter = { clerkId };
    if (type) filter.transactionType = type;
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction
      .find(filter)
      .sort({ date: -1, createdAt: -1 });

    console.log(`Found ${transactions.length} transactions`);

    res.json({
      success: true,
      data: transactions
    });

  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions',
      error: error.message
    });
  }
});

// @route   GET /api/transactions/test
// @desc    Test transactions route
// @access  Public
router.get('/test', (req, res) => {
  res.json({ message: 'Transactions route is working!' });
});

module.exports = router;
