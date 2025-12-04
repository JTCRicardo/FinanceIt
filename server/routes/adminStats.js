const express = require('express');
const router = express.Router();
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const User = require('../models/User');
const BudgetEntry = require('../models/BudgetEntry');
const Payroll = require('../models/Payroll');

// @route   GET /api/admin/stats
// @desc    Get site-wide statistics for admin users
// @access  Private (Admin only)
router.get('/stats', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    
    // Check if user is admin
    const user = await User.findOne({ clerkId });
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    // Get all budget entries from all users
    const allEntries = await BudgetEntry.find({});

    // Get all payroll entries from all users
    const allPayroll = await Payroll.find({});

    // Calculate total revenue (income entries)
    const totalRevenue = allEntries
      .filter(entry => entry.entryType === 'income')
      .reduce((sum, entry) => sum + (entry.cost * entry.amount), 0);

    // Calculate total expenses (expense entries + payroll)
    const budgetExpenses = allEntries
      .filter(entry => entry.entryType === 'expense')
      .reduce((sum, entry) => sum + (entry.cost * entry.amount), 0);
    
    const payrollExpenses = allPayroll
      .reduce((sum, payroll) => sum + (payroll.netPay || 0), 0);
    
    const totalExpenses = budgetExpenses + payrollExpenses;

    // Calculate net profit
    const netProfit = totalRevenue - totalExpenses;

    // Calculate growth rate (comparing last 30 days to previous 30 days)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    // Last 30 days revenue
    const recentRevenue = allEntries
      .filter(entry => entry.entryType === 'income' && entry.date >= thirtyDaysAgo)
      .reduce((sum, entry) => sum + (entry.cost * entry.amount), 0);

    // Previous 30 days revenue
    const previousRevenue = allEntries
      .filter(entry => entry.entryType === 'income' && entry.date >= sixtyDaysAgo && entry.date < thirtyDaysAgo)
      .reduce((sum, entry) => sum + (entry.cost * entry.amount), 0);

    // Calculate growth rate
    const growthRate = previousRevenue > 0 
      ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 
      : 0;

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalExpenses,
        netProfit,
        growthRate: Math.round(growthRate * 10) / 10, // Round to 1 decimal
        totalUsers: await User.countDocuments({}),
        totalEntries: allEntries.length
      }
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch admin statistics', 
      error: error.message 
    });
  }
});

module.exports = router;
