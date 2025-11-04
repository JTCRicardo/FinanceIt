/**
 * Automated Test Cases for Login Component
 * These tests match the manual test case TC_LOGIN_001
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Pages/Login';

// Mock Clerk hooks
vi.mock('@clerk/clerk-react', () => ({
  useSignIn: () => ({
    signIn: {
      create: vi.fn(async ({ identifier, password }) => {
        if (identifier === 'jtcricardos@gmail.com' && password === 'FinancePass1$') {
          return {
            status: 'complete',
            createdSessionId: 'mock-session-id'
          };
        }
        throw {
          errors: [{ longMessage: 'Invalid credentials' }]
        };
      })
    }
  }),
  useClerk: () => ({
    signOut: vi.fn()
  })
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('TC_LOGIN_001: User Login - Valid Credentials', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('should render login form', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should login successfully with valid credentials', async () => {
    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'jtcricardos@gmail.com');
    await user.type(passwordInput, 'FinancePass1$');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should show error with invalid credentials', async () => {
    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'jtcricardos@gmail.com');
    await user.type(passwordInput, 'WrongPassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

describe('TC_LOGIN_EDGE_001: Login Edge Cases', () => {
  it('should reject all lowercase password', async () => {
    const user = userEvent.setup();
    
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    await user.type(screen.getByPlaceholderText(/email/i), 'jtcricardos@gmail.com');
    await user.type(screen.getByPlaceholderText(/password/i), 'financepass1$');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});

