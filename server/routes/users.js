const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { ClerkExpressRequireAuth, clerkClient } = require('@clerk/clerk-sdk-node');

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      username: user.username,
      email: user.email,
      phone: user.phone || '',
      bio: user.bio || '',
      company: user.company || '',
      isAdmin: user.isAdmin || false
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { email, username, phone, bio, company } = req.body;
    const clerkId = req.auth.userId;
    
    // Try to find and update, or create if doesn't exist
    const user = await User.findOneAndUpdate(
      { clerkId },
      { 
        clerkId,
        email,
        username,
        phone, 
        bio, 
        company
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    
    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    console.error('Error in PUT /api/users/profile:', err);
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
});

// @route   PUT /api/users/set-admin
// @desc    Set user admin status
// @access  Private
router.put('/set-admin', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const { adminCode } = req.body;
    const clerkId = req.auth.userId;
    
    // Validate admin code on server side (secure)
    if (adminCode !== process.env.ADMIN_SECRET_CODE) {
      return res.status(403).json({ message: 'Invalid admin code' });
    }
    
    // Find or create user, then set admin status
    let user = await User.findOne({ clerkId });
    
    if (!user) {
      // Get user info from Clerk to create new user
      const clerkUser = await clerkClient.users.getUser(clerkId);
      const email = clerkUser.emailAddresses?.[0]?.emailAddress;
      const username = clerkUser.username || clerkUser.firstName || email?.split('@')[0];
      
      if (!email) {
        return res.status(400).json({ message: 'No email found for user' });
      }
      
      // Create new user if doesn't exist
      user = new User({
        clerkId,
        email,
        username,
        isAdmin: true
      });
      await user.save();
    } else {
      // Update existing user
      user.isAdmin = true;
      await user.save();
    }
    
    res.json({ message: 'Admin status granted', isAdmin: user.isAdmin });
  } catch (err) {
    console.error('Error in PUT /api/users/set-admin:', err);
    res.status(500).json({ message: 'Error updating admin status', error: err.message });
  }
});

module.exports = router;
