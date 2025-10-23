import { useSignUp } from '@clerk/clerk-react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Signup.css';

export default function Signup() {
    const {signUp, setActive } = useSignUp();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      
      // Basic validation
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      if (password.length < 8) {
        setError('Password must be at least 8 characters long');
        return;
      }
      
      try {
        console.log('Attempting signup with:', { email, username });
        const response = await signUp.create({
          emailAddress: email,
          password: password,
          username: username,
        });
        console.log('Clerk signup response:', response);
  
        if (response.status === 'complete') {
          await setActive({ session: response.createdSessionId });
          navigate('/dashboard');
        } else if (response.status === 'missing_requirements') {
          setError('Please check your email to verify your account. If you don\'t receive an email, check your Clerk dashboard settings.');
        } else {
          console.log('Clerk response:', response);
          setError(`Status: ${response.status}. ${response?.errors?.[0]?.longMessage || 'Unexpected response from Clerk.'}`);
        }
      } catch (err) {
        setError(err.errors?.[0]?.longMessage || 'Sign-up failed. Please try again.');
      }
    };
  
    return (
      <div className="signup-page">
        <div className="signup-container">
          <div className="signup-header">
            <h1 className="logo-title">
              <span>💰</span>
              <span className="logo-title-text">FinanceIT</span>
              <span>💰</span>   
            </h1>
            <h2>Create your account</h2>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="signup-button">
              Create account
            </button>
          </form>
          
          <div className="signup-footer">
            <p>Already have an account? <Link to="/">Sign in</Link></p>
          </div>
        </div>
      </div>
    );
  }
  