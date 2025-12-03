const express = require('express');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const Transaction = require('../models/Transaction');

const InventoryLog = require('../models/InventoryLog'); 
const router = express.Router();

// @route   POST /api/transactions
router.post('/', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { itemTitle, unitPrice, quantity, inventoryLogId, date } = req.body;
    const clerkId = req.auth.userId;
    const qtySold = parseInt(quantity);

    // 1. Find the inventory item first
    const inventoryItem = await InventoryLog.findOne({ _id: inventoryLogId, clerkId });

    if (!inventoryItem) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    // 2. Check if enough stock exists
    if (inventoryItem.amount < qtySold) {
      return res.status(400).json({ success: false, message: 'Not enough stock available' });
    }

    // 3. Subtract stock and save inventory
    inventoryItem.amount -= qtySold;
    await inventoryItem.save();

    // 4. Create the Transaction record
    const totalRevenue = parseFloat(unitPrice) * qtySold;

    const transaction = new Transaction({
      clerkId,
      itemTitle: itemTitle.trim(),
      unitPrice: parseFloat(unitPrice),
      quantity: qtySold,
      totalRevenue,
      transactionType: 'sale',
      date: date ? new Date(date) : new Date(),
      inventoryLogId: inventoryLogId || undefined
    });

    await transaction.save();

    res.status(201).json({
      success: true,
      message: 'Transaction created and stock updated',
      data: transaction,
      // Send back new stock amount so frontend can update immediately
      newStockAmount: inventoryItem.amount 
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
router.get('/', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const { type, startDate, endDate } = req.query;
    
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

    res.json({ success: true, data: transactions });

  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch transactions', error: error.message });
  }
});

module.exports = router;