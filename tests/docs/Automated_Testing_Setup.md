# Automated Testing Setup for FinanceIt

## JavaScript Testing Frameworks (Similar to Catch2 for C++)

### **Jest** - The JavaScript Equivalent of Catch2

- **Jest** is the most popular JavaScript testing framework
- Similar to Catch2: Simple syntax, great assertions, test runners
- Works for both frontend (React) and backend (Node.js)

### Comparison:

| Framework  | Language           | Purpose                  |
| ---------- | ------------------ | ------------------------ |
| **Catch2** | C++                | Unit/Integration testing |
| **Jest**   | JavaScript/Node.js | Unit/Integration testing |
| **Mocha**  | JavaScript         | Alternative to Jest      |
| **Vitest** | JavaScript         | Modern, Vite-native      |

---

## Setup for FinanceIt

### For Server (Backend API):

- **Jest** - Test runner and assertions
- **Supertest** - HTTP endpoint testing

### For Client (React Frontend):

- **Jest** + **Vitest** - Test runner (works with Vite)
- **React Testing Library** - Component testing (already installed)
- **@testing-library/user-event** - User interaction simulation

---

## Running Tests

```bash
# Run server tests
cd server
npm test

# Run client tests
cd client
npm test

# Run all tests
npm run test:all  # (we'll add this)
```

---

## Test Output Example

```
PASS  __tests__/auth.test.js
  ✓ TC_LOGIN_001: User can login with valid credentials (45ms)
  ✓ TC_SIGNUP_001: User can create account with valid data (32ms)

PASS  __tests__/budget.test.js
  ✓ TC_BUDGET_001: User can create budget entry (28ms)

Test Suites: 2 passed, 2 total
Tests:       3 passed, 3 total
```

---

## Advantages Over Manual Testing

✅ **Fast** - Runs in seconds  
✅ **Repeatable** - Same test every time  
✅ **Automated** - No human needed  
✅ **CI/CD Integration** - Run on every commit  
✅ **Catches Regressions** - Finds bugs automatically

---

## Next Steps

I'll create automated test cases that match your manual test cases!
