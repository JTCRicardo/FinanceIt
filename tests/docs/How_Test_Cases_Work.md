# How Test Cases Work - A Practical Guide

## What Are Test Cases?

Test cases are **step-by-step instructions** that tell you exactly how to test your application to make sure it works correctly. Think of them as a checklist or recipe for verifying that your FinanceIt app does what it's supposed to do.

---

## Structure of Each Test Case

Each test case follows a specific structure with these key sections:

### 1. **TEST CASE ID** (e.g., TC_SIGNUP_001)

- A unique identifier for tracking and referencing
- Helps organize and find specific tests

### 2. **TEST CASE DESCRIPTION**

- Brief explanation of what you're testing
- Answers: "What feature are we verifying?"

### 3. **PRECONDITION**

- What must be true BEFORE you start testing
- Example: "User must have a valid email address"
- **Important**: You must meet these conditions before starting!

### 4. **TEST STEPS**

- Step-by-step instructions (numbered 1, 2, 3...)
- **You follow these exactly** as written
- Like following a recipe

### 5. **TEST DATA**

- Specific values to enter (usernames, passwords, amounts, etc.)
- **Use exactly these values** so tests are consistent

### 6. **EXPECTED RESULT**

- What SHOULD happen if everything works correctly
- This is your "success criteria"

### 7. **POSTCONDITION**

- What the system state should be AFTER the test
- Example: "User account now exists in database"

### 8. **ACTUAL RESULT** (You fill this in)

- What actually happened when you ran the test
- Write down what you observed

### 9. **STATUS** (You fill this in)

- ✅ **PASS** - Everything worked as expected
- ❌ **FAIL** - Something didn't work correctly
- ⚠️ **BLOCKED** - Couldn't test due to issues

### 10. **COMMENTS** (You fill this in)

- Any notes, issues, or observations
- Screenshots, error messages, etc.

---

## How to Execute a Test Case - Step by Step

### Example: Running Test Case TC_SIGNUP_001

**Before You Start:**

1. ✅ Check PRECONDITIONS:

   - Do you have access to http://localhost:3000?
   - Do you have a valid email?
   - Is the app running?

2. ✅ Prepare your TEST DATA:
   - Username: testuser
   - Email: testuser@example.com
   - Password: TestPass123!

**Now Execute the Steps:**

1. **Open your browser** → Go to http://localhost:3000

   - **Did it work?** ✅ Write down what you see

2. **Click "Create an account" link**

   - **Did it work?** ✅ Did you see the signup form?

3. **Enter username: "testuser"**

   - **Did it work?** ✅ Can you type in the field?

4. **Enter email: "testuser@example.com"**

   - **Did it work?** ✅ Does the form accept it?

5. **Enter password: "TestPass123!"**

   - **Did it work?** ✅ Can you type it?

6. **Enter confirm password: "TestPass123!"**

   - **Did it work?** ✅ Same password entered?

7. **Click "Create account" button**

   - **Did it work?** ✅ What happened?

8. **Check if redirected to dashboard**
   - **Did it work?** ✅ Are you on the dashboard?

**After Execution:**

1. **Compare ACTUAL vs EXPECTED:**

   - Expected: "User redirected to dashboard"
   - Actual: "User was redirected to dashboard" ✅ MATCH = PASS
   - OR: "Error message appeared" ❌ NO MATCH = FAIL

2. **Fill in ACTUAL RESULT:**

   ```
   User was successfully redirected to dashboard.
   No error messages appeared. Account created successfully.
   ```

3. **Fill in STATUS:**

   - If everything matched expected → ✅ **PASS**
   - If something didn't work → ❌ **FAIL**

4. **Fill in COMMENTS (if needed):**
   ```
   Test executed successfully. Dashboard loaded in 2 seconds.
   User can see all navigation options.
   ```

---

## Real-World Example: Testing Login

### Test Case: TC_LOGIN_001

**Scenario:** You already created an account, now you want to test logging in.

**Step-by-Step Execution:**

1. **Open browser** → http://localhost:3000

   - ✅ Page loads - Login form visible

2. **Enter email:** testuser@example.com

   - ✅ Email field accepts input

3. **Enter password:** TestPass123!

   - ✅ Password field accepts input (shows dots)

4. **Click "Sign In"**

   - ✅ Button clicked, loading spinner appears

5. **Wait for redirect**

   - ✅ After 1 second, redirected to /dashboard

6. **Check dashboard**
   - ✅ Dashboard loads with user info
   - ✅ Previously created budget entries visible

**Filling Out Results:**

**ACTUAL RESULT:**

```
User successfully logged in with valid credentials.
Redirected to dashboard in 1.2 seconds.
Dashboard displays all previous data entries correctly.
```

**STATUS:** ✅ **PASS**

**COMMENTS:**

```
Login works perfectly. No performance issues.
All navigation links on dashboard are functional.
```

---

## What Happens When Tests Pass vs Fail?

### ✅ **PASS** - Test Successful

- Everything worked as expected
- Actual result matches expected result
- Feature is working correctly
- **Action:** Mark as PASS, move to next test

### ❌ **FAIL** - Test Failed

- Something didn't work as expected
- Actual result doesn't match expected result
- **Example Failures:**
  - Error message appeared when it shouldn't
  - Page didn't load
  - Button didn't work
  - Data wasn't saved
  - Wrong page displayed

**Action:**

1. Document what went wrong in ACTUAL RESULT
2. Take screenshot if possible
3. Note the exact error message
4. Mark as FAIL
5. Report to developers to fix

### Example of a FAIL:

**TEST CASE:** TC_LOGIN_001

**EXPECTED RESULT:**

- User successfully logs in
- Redirected to dashboard

**ACTUAL RESULT:**

```
Error message appeared: "Invalid credentials"
User was NOT redirected to dashboard
User remained on login page
```

**STATUS:** ❌ **FAIL**

**COMMENTS:**

```
Login failed even though credentials were correct.
Screenshot saved: login_error_2025-10-22.png
Error message: "Invalid credentials"
Possible issue: Database connection or authentication service
```

---

## Testing Workflow

### Complete Testing Process:

1. **Preparation:**

   - ✅ Start your app (npm run dev)
   - ✅ Open browser
   - ✅ Have test data ready

2. **Execute Test:**

   - ✅ Follow TEST STEPS exactly
   - ✅ Use TEST DATA exactly
   - ✅ Observe what happens

3. **Document Results:**

   - ✅ Write ACTUAL RESULT
   - ✅ Mark STATUS (PASS/FAIL)
   - ✅ Add COMMENTS if needed

4. **Review:**
   - ✅ If PASS → Move to next test
   - ✅ If FAIL → Document issue, fix if possible, retest

---

## Tips for Effective Testing

### ✅ **DO:**

- Follow steps in order
- Use exact test data provided
- Document everything you observe
- Take screenshots of errors
- Test one thing at a time
- Be thorough and detailed

### ❌ **DON'T:**

- Skip steps
- Use different test data
- Assume it works - verify everything
- Test multiple features at once
- Forget to document issues

---

## Example: Complete Test Case Execution Log

### Test Case: TC_INVENTORY_001 - Create Inventory Items

**Date:** October 22, 2025  
**Tester:** Test Team Member  
**Environment:** Chrome Browser, Windows 11

**Execution Log:**

1. ✅ Opened http://localhost:3000
2. ✅ Logged in successfully
3. ✅ Navigated to Inventory Log page
4. ✅ Entered first item: Tables, Cost: 150.00, Amount: 10
5. ✅ Clicked Submit
6. ✅ Success message appeared: "Inventory item created successfully"
7. ✅ Repeated for items 2-5
   - Item 2 (Chairs): ✅ Created
   - Item 3 (Uniforms): ✅ Created
   - Item 4 (Food Stock): ✅ Created
   - Item 5 (Drink Stock): ✅ Created
8. ✅ Navigated to Inventory Logs Display page
9. ✅ Verified all 5 items visible
10. ✅ Verified data accuracy (titles, costs, amounts all correct)

**ACTUAL RESULT:**

```
All 5 inventory items created successfully.
Each item showed success confirmation.
All items visible in Inventory Logs Display page.
Data is accurate: Tables (150.00, 10), Chairs (75.00, 20),
Uniforms (25.00, 15), Food Stock (500.00, 1), Drink Stock (300.00, 1).
Total time: 3 minutes.
```

**STATUS:** ✅ **PASS**

**COMMENTS:**

```
Inventory logging feature works perfectly.
All items saved correctly to database.
Display page loads quickly and shows correct data.
No bugs found.
```

---

## Why Test Cases Matter

1. **Quality Assurance:** Ensures your app works correctly
2. **Documentation:** Records what was tested
3. **Regression Testing:** Catch bugs when adding new features
4. **Team Communication:** Clear instructions for anyone to test
5. **Bug Tracking:** Identifies issues systematically
6. **Confidence:** Know your app works before deployment

---

## Common Questions

**Q: Do I need to test everything every time?**
A: For development, test new features. For releases, test all critical paths.

**Q: What if a step doesn't work?**
A: Document it in ACTUAL RESULT, mark as FAIL, note what went wrong.

**Q: Can I modify test steps?**
A: Generally no - use exact steps. If app changes, update test cases.

**Q: How long should testing take?**
A: Varies by test. Simple login: 2-3 minutes. Complex workflows: 10-15 minutes.

**Q: What if I find a bug?**
A: Document it thoroughly, take screenshots, note steps to reproduce, mark test as FAIL.

---

## Summary

Test cases are your **quality assurance checklist**. They:

- ✅ Guide you through testing systematically
- ✅ Ensure you test all important features
- ✅ Document what works and what doesn't
- ✅ Help catch bugs before users do
- ✅ Provide clear, repeatable instructions

**Remember:** The goal is to find out if your app works correctly, not to prove it works. If something fails, that's valuable information to fix it!
