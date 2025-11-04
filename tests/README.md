# Testing Documentation

This directory contains comprehensive testing documentation for the FinanceIt project, including both manual and automated testing approaches.

## 📁 Directory Structure

```
tests/
├── README.md (this file)
└── docs/
    ├── Test_Cases_FinanceIt.md
    ├── Test_Cases_FinanceIt_Excel.csv
    ├── How_Test_Cases_Work.md
    ├── Automated_Testing_Setup.md
    ├── Automated_Testing_Complete.md
    └── How_To_Run_Tests.md
```

## 📚 Documentation Files

All testing documentation is located in the [`docs/`](./docs/) subdirectory:

### Manual Testing
- **[Test_Cases_FinanceIt.md](./docs/Test_Cases_FinanceIt.md)** - Complete test case documentation with 8 test scenarios
- **[Test_Cases_FinanceIt_Excel.csv](./docs/Test_Cases_FinanceIt_Excel.csv)** - Test cases in Excel/CSV format for easy import
- **[How_Test_Cases_Work.md](./docs/How_Test_Cases_Work.md)** - Guide explaining how to execute test cases

### Automated Testing
- **[Automated_Testing_Setup.md](./docs/Automated_Testing_Setup.md)** - Overview of automated testing framework setup
- **[Automated_Testing_Complete.md](./docs/Automated_Testing_Complete.md)** - Complete guide to automated testing implementation
- **[How_To_Run_Tests.md](./docs/How_To_Run_Tests.md)** - Step-by-step instructions for running automated tests

## 🚀 Quick Start

### Run Automated Tests

**Server Tests (Backend):**
```bash
cd server
npm test
```

**Client Tests (Frontend):**
```bash
cd client
npm test
```

### Manual Testing

1. Review test cases in [`docs/Test_Cases_FinanceIt.md`](./docs/Test_Cases_FinanceIt.md)
2. Follow the step-by-step instructions
3. Document results in the Excel template or markdown file

## 📊 Test Coverage

### Automated Tests
- ✅ Authentication (Signup, Login, Edge Cases)
- ✅ Budget Entry Creation
- ✅ API Endpoint Testing

**Test Locations:**
- Server tests: `server/__tests__/`
- Client tests: `client/src/__tests__/`

### Manual Tests
- ✅ User Signup & Login
- ✅ Inventory Log Management
- ✅ Budget Tracking
- ✅ Dashboard Navigation
- ✅ Edge Cases & Error Handling
- ✅ Integration Testing

## 🛠️ Testing Frameworks

- **Jest** - Server-side testing (Node.js/Express)
- **Vitest** - Client-side testing (React/Vite)
- **React Testing Library** - Component testing
- **Supertest** - API endpoint testing

## 📝 Contributing

When adding new features:
1. Create corresponding test cases
2. Update test documentation in `docs/`
3. Ensure both automated and manual tests pass

For more details, see the individual documentation files in the [`docs/`](./docs/) directory.
