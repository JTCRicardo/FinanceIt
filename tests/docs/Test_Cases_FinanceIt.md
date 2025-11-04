# FinanceIt - Test Case Documentation

**PROJECT NAME:** FinanceIt  
**PREPARED BY:** FinanceIt Development Team  
**DATE OF CREATION:** October 2025  
**DATE OF REVIEW:** October 2025  
**TEAM NAME:** FinanceIt

---

## Test Case 1: User Signup - Valid Account Creation

**TEST CASE ID:** TC_SIGNUP_001

**TEST CASE DESCRIPTION:** Verify that a new user can successfully create an account with valid credentials.

**PRECONDITION:**

- User has access to the FinanceIt application
- User has a valid email address
- User has not previously created an account with the same email

**TEST STEPS:**

1. Navigate to the FinanceIt application homepage (http://localhost:3000)
2. Click on "Create an account" link
3. Enter a username in the username field
4. Enter a valid email address in the email field
5. Enter a password in the password field (minimum 8 characters)
6. Re-enter the same password in the confirm password field
7. Click the "Create account" button
8. Verify the user is redirected to the dashboard

**TEST DATA:**

- Username: testuser
- Email: testuser@example.com
- Password: TestPass123!
- Confirm Password: TestPass123!

**EXPECTED RESULT:**

- Account is successfully created
- User receives confirmation (if applicable)
- User is automatically redirected to the dashboard page
- No error messages are displayed

**POSTCONDITION:**

- User account exists in the system
- User is logged in and can access the dashboard
- User can navigate to other features (Budget Entry, Inventory Log)

**ACTUAL RESULT:** _(To be filled during test execution)_

**STATUS:** _(To be filled during test execution)_

**COMMENTS:** _(To be filled during test execution)_

---

## Test Case 2: User Login - Valid Credentials

**TEST CASE ID:** TC_LOGIN_001

**TEST CASE DESCRIPTION:** Verify that an existing user can successfully log into their account using valid credentials.

**PRECONDITION:**

- User has already created an account (using Test Case 1)
- User has access to the FinanceIt application
- User has entered at least one data entry (budget entry or inventory log)

**TEST STEPS:**

1. Navigate to the FinanceIt application homepage (http://localhost:3000)
2. Enter the registered email address in the email field
3. Enter the correct password in the password field
4. Click the "Sign In" button
5. Verify the user is redirected to the dashboard
6. Verify that previously entered data (if any) is displayed

**TEST DATA:**

- Email: testuser@example.com
- Password: TestPass123!

**EXPECTED RESULT:**

- User successfully logs in
- User is redirected to the dashboard page
- Previously entered data is visible and accessible
- No error messages are displayed

**POSTCONDITION:**

- User is logged into the system
- User can access all features (Dashboard, Budget Entry, Inventory Log, etc.)
- User session is active

**ACTUAL RESULT:** _(To be filled during test execution)_

**STATUS:** _(To be filled during test execution)_

**COMMENTS:** _(To be filled during test execution)_

---

## Test Case 3: Inventory Log - Create Multiple Items

**TEST CASE ID:** TC_INVENTORY_001

**TEST CASE DESCRIPTION:** Verify that a logged-in user can successfully log multiple inventory items.

**PRECONDITION:**

- User has successfully signed up for an account
- User has successfully logged into the application
- User is on the dashboard page

**TEST STEPS:**

1. Navigate to the Inventory Log page (via dashboard navigation)
2. Enter the first inventory item details:
   - Title: "Tables"
   - Cost: "150.00"
   - Amount: "10"
   - Description: "Restaurant tables"
   - Date: Select current date
3. Click "Submit" or "Save" button
4. Verify success message or confirmation
5. Repeat steps 2-4 for the following items:
   - Item 2: Title "Chairs", Cost "75.00", Amount "20", Description "Restaurant chairs"
   - Item 3: Title "Uniforms", Cost "25.00", Amount "15", Description "Staff uniforms"
   - Item 4: Title "Food Stock", Cost "500.00", Amount "1", Description "Food inventory"
   - Item 5: Title "Drink Stock", Cost "300.00", Amount "1", Description "Beverage inventory"
6. Navigate to Inventory Logs Display page
7. Verify all 5 items are displayed correctly

**TEST DATA:**

- Test Account: testuser@example.com
- Item 1: Tables, Cost: 150.00, Amount: 10
- Item 2: Chairs, Cost: 75.00, Amount: 20
- Item 3: Uniforms, Cost: 25.00, Amount: 15
- Item 4: Food Stock, Cost: 500.00, Amount: 1
- Item 5: Drink Stock, Cost: 300.00, Amount: 1

**EXPECTED RESULT:**

- All 5 inventory items are successfully created
- Each item shows a success confirmation
- All items are stored in the database
- All items are visible in the Inventory Logs Display page
- Data is accurate (correct titles, costs, amounts, descriptions, dates)

**POSTCONDITION:**

- All 5 inventory items are stored in the system
- Items are accessible via the Inventory Logs Display page
- User can view, edit, or delete these items (if functionality exists)

**ACTUAL RESULT:** _(To be filled during test execution)_

**STATUS:** _(To be filled during test execution)_

**COMMENTS:** _(To be filled during test execution)_

---

## Test Case 4: Budget Entry - Create and Track Budget

**TEST CASE ID:** TC_BUDGET_001

**TEST CASE DESCRIPTION:** Verify that a logged-in user can create a budget entry and track budget updates.

**PRECONDITION:**

- User has successfully signed up for an account
- User has successfully logged into the application
- User is on the dashboard page

**TEST STEPS:**

1. Navigate to the Budget Entry page (via dashboard navigation)
2. Fill in the budget entry form:
   - Title: "Monthly Rent"
   - Cost: "1200.00"
   - Amount: "1"
   - Category: Select "Rent" from dropdown
   - Description: "Monthly apartment rent payment"
   - Date: Select current date
3. Click "Submit" or "Save" button
4. Verify success message or confirmation
5. Navigate to Budget Entries Display page
6. Verify the budget entry is displayed correctly
7. Navigate back to Dashboard
8. Verify budget information is updated on the dashboard (if dashboard displays budget summary)

**TEST DATA:**

- Test Account: testuser@example.com
- Title: Monthly Rent
- Cost: 1200.00
- Amount: 1
- Category: Rent
- Description: Monthly apartment rent payment
- Date: Current date

**EXPECTED RESULT:**

- Budget entry is successfully created
- Success confirmation is displayed
- Budget entry is stored in the database
- Budget entry appears in Budget Entries Display page
- Budget information is updated on the dashboard (if applicable)
- Budget tracking calculations are accurate

**POSTCONDITION:**

- Budget entry is stored in the system
- Budget entry is accessible via Budget Entries Display page
- Dashboard reflects updated budget information
- User can create additional budget entries

**ACTUAL RESULT:** _(To be filled during test execution)_

**STATUS:** _(To be filled during test execution)_

**COMMENTS:** _(To be filled during test execution)_

---

## Test Case 5: Login Edge Cases - Invalid Credentials

**TEST CASE ID:** TC_LOGIN_EDGE_001

**TEST CASE DESCRIPTION:** Verify that the system properly rejects invalid login attempts with various error scenarios.

**PRECONDITION:**

- User has already created an account with valid credentials
- Test account exists: Email: testuser@example.com, Password: TestPass123!, Username: testuser

**TEST STEPS:**

1. Navigate to the FinanceIt application homepage
2. Test Case 5a: Attempt login with all lowercase password
   - Enter email: testuser@example.com
   - Enter password: testpass123! (all lowercase)
   - Click "Sign In" button
   - Verify error message is displayed
3. Test Case 5b: Attempt login with all uppercase password
   - Enter email: testuser@example.com
   - Enter password: TESTPASS123! (all uppercase)
   - Click "Sign In" button
   - Verify error message is displayed
4. Test Case 5c: Attempt login with extra character in password
   - Enter email: testuser@example.com
   - Enter password: TestPass123!X (extra character)
   - Click "Sign In" button
   - Verify error message is displayed
5. Test Case 5d: Attempt login with one character missing in password
   - Enter email: testuser@example.com
   - Enter password: TestPass123 (missing character)
   - Click "Sign In" button
   - Verify error message is displayed
6. Test Case 5e: Attempt login using email as username (if applicable)
   - Enter identifier: testuser@example.com
   - Enter password: TestPass123!
   - Click "Sign In" button
   - Verify behavior (may work if system accepts email as identifier)

**TEST DATA:**

- Valid Email: testuser@example.com
- Valid Password: TestPass123!
- Valid Username: testuser
- Invalid Password 1: testpass123! (all lowercase)
- Invalid Password 2: TESTPASS123! (all uppercase)
- Invalid Password 3: TestPass123!X (extra character)
- Invalid Password 4: TestPass123 (missing character)

**EXPECTED RESULT:**

- All invalid login attempts (5a, 5b, 5c, 5d) result in error messages
- User is not logged into the system
- No unauthorized access is granted
- Error messages are clear and informative
- System remains secure (no information leakage about which part is incorrect)

**POSTCONDITION:**

- User remains on the login page
- No user session is created
- System is secure from unauthorized access attempts
- User can still attempt valid login after failed attempts

**ACTUAL RESULT:** _(To be filled during test execution)_

**STATUS:** _(To be filled during test execution)_

**COMMENTS:** _(To be filled during test execution)_

---

## Test Case 6: Signup Edge Cases - Invalid Input Validation

**TEST CASE ID:** TC_SIGNUP_EDGE_001

**TEST CASE DESCRIPTION:** Verify that the system properly rejects invalid signup attempts with various validation scenarios.

**PRECONDITION:**

- User has access to the FinanceIt application
- No account exists with the test email addresses (for invalid email tests)

**TEST STEPS:**

1. Navigate to the FinanceIt application signup page
2. Test Case 6a: Attempt signup with invalid email format (no @ symbol)
   - Enter username: testuser
   - Enter email: invalidemail.com (missing @)
   - Enter password: TestPass123!
   - Enter confirm password: TestPass123!
   - Click "Create account" button
   - Verify error message is displayed
3. Test Case 6b: Attempt signup with invalid email format (no domain extension)
   - Enter username: testuser
   - Enter email: invalidemail@com (missing domain extension)
   - Enter password: TestPass123!
   - Enter confirm password: TestPass123!
   - Click "Create account" button
   - Verify error message is displayed
4. Test Case 6c: Attempt signup with mismatched passwords
   - Enter username: testuser
   - Enter email: testuser@example.com
   - Enter password: TestPass123!
   - Enter confirm password: DifferentPass456! (different password)
   - Click "Create account" button
   - Verify error message is displayed
5. Test Case 6d: Attempt signup with password too short
   - Enter username: testuser
   - Enter email: testuser@example.com
   - Enter password: Pass1$ (less than 8 characters)
   - Enter confirm password: Pass1$
   - Click "Create account" button
   - Verify error message is displayed

**TEST DATA:**

- Invalid Email 1: invalidemail.com (no @ symbol)
- Invalid Email 2: invalidemail@com (no domain extension)
- Valid Email: testuser@example.com
- Valid Password: TestPass123!
- Mismatched Password: DifferentPass456!
- Short Password: Pass1$ (less than 8 characters)
- Username: testuser

**EXPECTED RESULT:**

- All invalid signup attempts (6a, 6b, 6c, 6d) result in error messages
- No account is created for invalid inputs
- Error messages are specific and clear (e.g., "Invalid email format", "Passwords do not match", "Password must be at least 8 characters")
- User is prompted to correct the input fields
- System prevents invalid data from being stored

**POSTCONDITION:**

- No account is created with invalid data
- User remains on the signup page
- Form fields can be corrected and resubmitted
- User can still attempt valid signup after failed attempts

**ACTUAL RESULT:** _(To be filled during test execution)_

**STATUS:** _(To be filled during test execution)_

**COMMENTS:** _(To be filled during test execution)_

---

## Test Case 7: End-to-End Integration - Complete User Workflow

**TEST CASE ID:** TC_INTEGRATION_001

**TEST CASE DESCRIPTION:** Verify that all major features work together seamlessly without conflicts or crashes.

**PRECONDITION:**

- User has a valid email address
- FinanceIt application is accessible
- No existing account with test email

**TEST STEPS:**

1. Execute Test Case 1 (User Signup) - Create account
2. Execute Test Case 2 (User Login) - Log in to verify account works
3. Execute Test Case 3 (Inventory Log) - Create 5 inventory items
4. Execute Test Case 4 (Budget Entry) - Create budget entry
5. Navigate between Dashboard, Budget Entries Display, and Inventory Logs Display
6. Verify all data persists across page navigations
7. Log out from the application
8. Log back in using Test Case 2
9. Verify all previously entered data (inventory items and budget entries) is still accessible
10. Create additional budget entries and inventory items
11. Verify no data conflicts or errors occur

**TEST DATA:**

- All test data from previous test cases (TC_SIGNUP_001, TC_LOGIN_001, TC_INVENTORY_001, TC_BUDGET_001)

**EXPECTED RESULT:**

- All features work without crashing
- Data persists correctly across sessions
- Navigation between pages works smoothly
- No data conflicts occur
- All previously entered data remains accessible after logout/login
- System handles multiple data entries without performance issues
- No errors or system crashes occur

**POSTCONDITION:**

- User account exists with multiple data entries
- All inventory logs are stored and accessible
- All budget entries are stored and accessible
- System is stable and ready for continued use
- User can perform additional operations without issues

**ACTUAL RESULT:** _(To be filled during test execution)_

**STATUS:** _(To be filled during test execution)_

**COMMENTS:** _(To be filled during test execution)_

---

## Test Case 8: Dashboard Navigation and Data Display

**TEST CASE ID:** TC_DASHBOARD_001

**TEST CASE DESCRIPTION:** Verify that the dashboard displays correctly and navigation to all features works properly.

**PRECONDITION:**

- User has successfully signed up for an account
- User has successfully logged into the application
- User has created at least one budget entry and one inventory log entry

**TEST STEPS:**

1. After successful login, verify user lands on the dashboard page
2. Verify dashboard displays user information (username/email)
3. Verify navigation links/buttons are visible:
   - Budget Entry
   - Budget Entries Display
   - Inventory Log
   - Inventory Logs Display
   - Sign Out option
4. Click on "Budget Entry" link/button
5. Verify navigation to Budget Entry page
6. Navigate back to Dashboard
7. Click on "Budget Entries Display" link/button
8. Verify navigation to Budget Entries Display page
9. Verify previously created budget entries are displayed
10. Navigate back to Dashboard
11. Click on "Inventory Log" link/button
12. Verify navigation to Inventory Log page
13. Navigate back to Dashboard
14. Click on "Inventory Logs Display" link/button
15. Verify navigation to Inventory Logs Display page
16. Verify previously created inventory logs are displayed
17. Navigate back to Dashboard
18. Click "Sign Out" option
19. Verify user is logged out and redirected to login page

**TEST DATA:**

- Test Account: testuser@example.com
- At least one budget entry exists
- At least one inventory log exists

**EXPECTED RESULT:**

- Dashboard displays correctly with all navigation options
- All navigation links work properly
- Previously created data is accessible from respective display pages
- Sign out functionality works correctly
- No navigation errors or broken links
- User can seamlessly navigate between all features

**POSTCONDITION:**

- User is logged out
- User is on the login page
- All data remains stored in the system
- User can log back in to access all features

**ACTUAL RESULT:** _(To be filled during test execution)_

**STATUS:** _(To be filled during test execution)_

**COMMENTS:** _(To be filled during test execution)_

---

## Summary

This test case documentation covers:

1. **Core Functionality Tests:**

   - User Signup (TC_SIGNUP_001)
   - User Login (TC_LOGIN_001)
   - Inventory Log Creation (TC_INVENTORY_001)
   - Budget Entry Creation (TC_BUDGET_001)

2. **Edge Case Tests:**

   - Login Edge Cases (TC_LOGIN_EDGE_001)
   - Signup Edge Cases (TC_SIGNUP_EDGE_001)

3. **Integration Tests:**
   - End-to-End Workflow (TC_INTEGRATION_001)
   - Dashboard Navigation (TC_DASHBOARD_001)

All test cases follow best practices:

- Clear and unique test case IDs
- Detailed test steps
- Specific test data
- Expected results
- Preconditions and postconditions
- Easy to understand and execute

These test cases ensure comprehensive coverage of the FinanceIt application's functionality and can be executed by any team member.
