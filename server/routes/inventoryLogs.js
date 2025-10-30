const express = require('express');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const InventoryLog = require('../models/InventoryLog');
const router = express.Router();

// @route   POST /api/inventory-log
// @access  Private (requires valid Clerk JWT)
router.post('/', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { title, cost, amount, description, date } = req.body;
    const clerkId = req.auth.userId;

    const inventoryLog = new InventoryLog({
      clerkId,
      title: title.trim(),
      cost: parseFloat(cost.toString().replace(/,/g, '')),
      amount: parseInt(amount),
      description: description ? description.trim() : '',
      date: new Date(date)
    });

    await inventoryLog.save();

    res.status(201).json({
      success: true,
      message: 'Inventory log created successfully',
      data: inventoryLog
    });

  } catch (error) {
    console.error('Error creating inventory log:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create inventory log'
    });
  }
});

// ✅ NEW: GET /api/inventory-log
// @access Private (requires valid Clerk JWT)
router.get('/', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const logs = await InventoryLog.find({ clerkId }).sort({ date: -1 });

    res.json({
      success: true,
      data: logs
    });
  } catch (error) {
    console.error('Error fetching inventory logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory logs'
    });
  }
});

module.exports = router;
