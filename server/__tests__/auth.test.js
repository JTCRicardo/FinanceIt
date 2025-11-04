/**
 * Automated Test Cases for Authentication
 * These tests match the manual test cases TC_SIGNUP_001 and TC_LOGIN_001
 */

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// Import your app (adjust path as needed)
// For now, we'll create a test app structure
const app = express();
app.use(express.json());

// Mock auth routes for testing
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  
  // Validation
  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields required' });
  }
  
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }
  
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' });
  }
  
  // Simulate successful registration
  res.status(201).json({
    message: 'Account created successfully',
    user: { username, email }
  });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Test data validation
  const validEmail = 'jtcricardos@gmail.com';
  const validPassword = 'FinancePass1$';
  
  if (email === validEmail && password === validPassword) {
    res.json({
      message: 'Login successful',
      token: 'mock-jwt-token',
      user: { email }
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

describe('TC_SIGNUP_001: User Signup - Valid Account Creation', () => {
  test('should create account with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'Business',
        email: 'jtcricardos@gmail.com',
        password: 'FinancePass1$',
        confirmPassword: 'FinancePass1$'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Account created successfully');
    expect(response.body.user.email).toBe('jtcricardos@gmail.com');
    expect(response.body.user.username).toBe('Business');
  });
  
  test('should reject signup with mismatched passwords', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'Business',
        email: 'jtcricardos@gmail.com',
        password: 'FinancePass1$',
        confirmPassword: 'DifferentPassword'
      });
    
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Passwords do not match');
  });
  
  test('should reject signup with password too short', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'Business',
        email: 'jtcricardos@gmail.com',
        password: 'Pass1$',
        confirmPassword: 'Pass1$'
      });
    
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Password must be at least 8 characters');
  });
});

describe('TC_LOGIN_001: User Login - Valid Credentials', () => {
  test('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'jtcricardos@gmail.com',
        password: 'FinancePass1$'
      });
    
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful');
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe('jtcricardos@gmail.com');
  });
  
  test('should reject login with invalid password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'jtcricardos@gmail.com',
        password: 'WrongPassword'
      });
    
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid credentials');
  });
  
  test('should reject login with invalid email', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'wrong@email.com',
        password: 'FinancePass1$'
      });
    
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid credentials');
  });
});

describe('TC_LOGIN_EDGE_001: Login Edge Cases', () => {
  test('should reject all lowercase password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'jtcricardos@gmail.com',
        password: 'financepass1$'
      });
    
    expect(response.status).toBe(401);
  });
  
  test('should reject all uppercase password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'jtcricardos@gmail.com',
        password: 'FINANCEPASS1$'
      });
    
    expect(response.status).toBe(401);
  });
  
  test('should reject password with extra character', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'jtcricardos@gmail.com',
        password: 'FinancePass1$X'
      });
    
    expect(response.status).toBe(401);
  });
  
  test('should reject password with missing character', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'jtcricardos@gmail.com',
        password: 'FinancePass1'
      });
    
    expect(response.status).toBe(401);
  });
});

