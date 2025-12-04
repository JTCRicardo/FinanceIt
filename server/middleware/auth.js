const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

module.exports = { 
  authenticateToken: ClerkExpressRequireAuth()
};
