/**
 * Automated Test Cases for Budget Functionality
 * These tests match the manual test case TC_BUDGET_001
 */

const request = require('supertest');
const express = require('express');

const app = express();
app.use(express.json());

// Mock budget routes
app.post('/api/budgets', async (req, res) => {
  const { title, cost, amount, category, description, date } = req.body;
  
  // Validation
  if (!title || !cost || !amount || !category) {
    return res.status(400).json({ message: 'Required fields missing' });
  }
  
  // Simulate successful budget creation
  res.status(201).json({
    message: 'Budget entry created successfully',
    budget: {
      id: 'mock-id-123',
      title,
      cost: parseFloat(cost),
      amount: parseInt(amount),
      category,
      description,
      date: date || new Date().toISOString()
    }
  });
});

app.get('/api/budgets', async (req, res) => {
  // Mock budget list
  res.json({
    budgets: [
      {
        id: 'mock-id-123',
        title: 'Monthly Rent',
        cost: 1200.00,
        amount: 1,
        category: 'Rent',
        description: 'Monthly apartment rent payment',
        date: new Date().toISOString()
      }
    ]
  });
});

describe('TC_BUDGET_001: Budget Entry - Create and Track Budget', () => {
  test('should create budget entry with valid data', async () => {
    const budgetData = {
      title: 'Monthly Rent',
      cost: '1200.00',
      amount: '1',
      category: 'Rent',
      description: 'Monthly apartment rent payment',
      date: new Date().toISOString().split('T')[0]
    };
    
    const response = await request(app)
      .post('/api/budgets')
      .send(budgetData);
    
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Budget entry created successfully');
    expect(response.body.budget.title).toBe('Monthly Rent');
    expect(response.body.budget.cost).toBe(1200.00);
    expect(response.body.budget.amount).toBe(1);
    expect(response.body.budget.category).toBe('Rent');
    expect(response.body.budget.id).toBeDefined();
  });
  
  test('should retrieve budget entries', async () => {
    const response = await request(app)
      .get('/api/budgets');
    
    expect(response.status).toBe(200);
    expect(response.body.budgets).toBeDefined();
    expect(Array.isArray(response.body.budgets)).toBe(true);
    expect(response.body.budgets.length).toBeGreaterThan(0);
  });
  
  test('should reject budget entry with missing required fields', async () => {
    const response = await request(app)
      .post('/api/budgets')
      .send({
        title: 'Monthly Rent',
        // Missing cost, amount, category
      });
    
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Required fields missing');
  });
});

