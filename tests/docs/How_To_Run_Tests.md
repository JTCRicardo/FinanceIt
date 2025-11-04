# How to Run Automated Tests - Step by Step Guide

## 🎯 Quick Start

### Server Tests (Backend API)

```bash
cd server
npm test
```

### Client Tests (React Frontend)

```bash
cd client
npm test
```

---

## 📋 Detailed Instructions

### Option 1: Run Server Tests

**Step 1:** Open terminal and navigate to server directory

```bash
cd server
```

**Step 2:** Run all tests

```bash
npm test
```

**Expected Output:**

```
PASS __tests__/auth.test.js
  TC_SIGNUP_001: User Signup - Valid Account Creation
    ✓ should create account with valid credentials (23 ms)
    ✓ should reject signup with mismatched passwords (2 ms)
    ✓ should reject signup with password too short (1 ms)
  TC_LOGIN_001: User Login - Valid Credentials
    ✓ should login with valid credentials (1 ms)
    ✓ should reject login with invalid password (2 ms)
    ✓ should reject login with invalid email (1 ms)
  TC_LOGIN_EDGE_001: Login Edge Cases
    ✓ should reject all lowercase password (1 ms)
    ✓ should reject all uppercase password (1 ms)
    ✓ should reject password with extra character (1 ms)
    ✓ should reject password with missing character (1 ms)

PASS __tests__/budget.test.js
  TC_BUDGET_001: Budget Entry - Create and Track Budget
    ✓ should create budget entry with valid data (3 ms)
    ✓ should retrieve budget entries (1 ms)
    ✓ should reject budget entry with missing required fields (1 ms)

Test Suites: 2 passed, 2 total
Tests:       13 passed, 13 total
Time:        0.53 s
```

**Step 3 (Optional):** Run in watch mode (auto-reruns on file changes)

```bash
npm run test:watch
```

**Step 4 (Optional):** Generate coverage report

```bash
npm run test:coverage
```

---

### Option 2: Run Client Tests

**Step 1:** Open terminal and navigate to client directory

```bash
cd client
```

**Step 2:** Run tests once

```bash
npm run test:run
```

**Step 3 (Recommended):** Run in watch mode (interactive)

```bash
npm test
```

This opens an interactive watch mode that reruns tests when files change.

**Step 4 (Optional):** Open beautiful test UI

```bash
npm run test:ui
```

This opens a web interface in your browser for viewing tests.

---

## 🚀 Running Both at Once

### Terminal 1 (Server):

```bash
cd server
npm run test:watch
```

### Terminal 2 (Client):

```bash
cd client
npm test
```

---

## 📊 Understanding Test Output

### ✅ PASS (Test Passed)

```
✓ should create account with valid credentials (23 ms)
```

- Test executed successfully
- All assertions passed
- Time taken shown in milliseconds

### ❌ FAIL (Test Failed)

```
✗ should login with valid credentials
  Expected: "Login successful"
  Received: "Invalid credentials"
```

- Test failed
- Shows what was expected vs what was received
- Helps identify the bug

### 📈 Test Summary

```
Test Suites: 2 passed, 2 total
Tests:       13 passed, 13 total
Time:        0.53 s
```

- **Test Suites:** Number of test files
- **Tests:** Total number of individual tests
- **Time:** Total execution time

---

## 🎮 Interactive Commands

### In Watch Mode (Jest):

- Press `a` to run all tests
- Press `f` to run only failed tests
- Press `q` to quit
- Press `p` to filter by filename

### In Watch Mode (Vitest):

- Press `a` to run all tests
- Press `f` to run only failed tests
- Press `q` to quit
- Press `u` to update snapshots

---

## 🔍 Running Specific Tests

### Run tests matching a pattern:

```bash
# Server
cd server
npm test -- --testNamePattern="TC_LOGIN_001"

# Client
cd client
npm test -- -t "TC_LOGIN_001"
```

### Run tests in a specific file:

```bash
# Server
cd server
npm test auth.test.js

# Client
cd client
npm test Login.test.jsx
```

---

## 📝 Example Test Execution Flow

### 1. Run Server Tests:

```bash
$ cd server
$ npm test

> financeit-server@1.0.0 test
> jest

PASS __tests__/auth.test.js
  ✓ should create account with valid credentials
  ✓ should login with valid credentials

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
```

### 2. Run Client Tests:

```bash
$ cd client
$ npm test

> financeit-client@0.1.0 test
> vitest

 ✓ src/__tests__/Login.test.jsx (3)
   ✓ TC_LOGIN_001: should render login form
   ✓ TC_LOGIN_001: should login successfully
   ✓ TC_LOGIN_EDGE_001: should reject invalid password

Test Files  1 passed (1)
     Tests  3 passed (3)
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module"

**Solution:** Make sure dependencies are installed

```bash
cd server && npm install
cd client && npm install
```

### Issue: "Tests not found"

**Solution:** Check file naming - tests should be in `__tests__` folder or end with `.test.js`

### Issue: "Watch mode not working"

**Solution:** Make sure you're in the correct directory and have the right npm scripts

---

## 📚 Summary

**Server Tests:**

- ✅ `npm test` - Run once
- ✅ `npm run test:watch` - Watch mode
- ✅ `npm run test:coverage` - Coverage report

**Client Tests:**

- ✅ `npm test` - Interactive watch mode
- ✅ `npm run test:run` - Run once
- ✅ `npm run test:ui` - Web UI
- ✅ `npm run test:coverage` - Coverage report

**All tests are automated - just run the commands and see results instantly!** 🚀
