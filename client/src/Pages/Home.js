import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();

  // Generate money icons for animation
  const moneyIcons = ['💵', '💰', '💸', '💴', '💶', '💷', '🪙'];
  const fallingMoney = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    icon: moneyIcons[Math.floor(Math.random() * moneyIcons.length)],
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 4 + Math.random() * 2
  }));

  return (
    <div className="home-page">
      {/* Falling money animation */}
      <div className="money-rain">
        {fallingMoney.map(money => (
          <div
            key={money.id}
            className="money-icon"
            style={{
              left: `${money.left}%`,
              animationDelay: `${money.delay}s`,
              animationDuration: `${money.duration}s`
            }}
          >
            {money.icon}
          </div>
        ))}
      </div>

      <nav className="navbar">
        <div className="nav-brand" onClick={() => navigate('/') }>
          <img src="/Photos/FinanceITlogo.png" alt="FinanceIT Logo" />
          FinanceIT
        </div>
        <div className="nav-actions">
          <button className="secondary-button" onClick={() => navigate('/login')}>Login</button>
          <button className="primary-button" onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
      </nav>

      <main className="home-content">
        <h1>Welcome to FinanceIT</h1>
        <p className="subtitle">Make finances simple.</p>

        {/* Features Section */}
        <div className="features-section">
          <div className="feature-box">
            <div className="feature-icon">💰</div>
            <h3>Budget Entry</h3>
            <p>Track your income and expenses with detailed budget entries and categories. Stay on top of your spending habits and financial goals.</p>
          </div>

          <div className="feature-box">
            <div className="feature-icon">📦</div>
            <h3>Inventory Logging</h3>
            <p>Track and manage your business inventory, stock levels, and product movements. Never lose track of what you have in stock.</p>
          </div>

          <div className="feature-box">
            <div className="feature-icon">💼</div>
            <h3>Payroll Management</h3>
            <p>Manage employee salaries, benefits, and payroll processing efficiently. Streamline your payment workflows with ease.</p>
          </div>

          <div className="feature-box">
            <div className="feature-icon">📊</div>
            <h3>Visualizations</h3>
            <p>Create charts, graphs, and reports to visualize your financial data. Make informed decisions with clear insights.</p>
          </div>
        </div>
      </main>

      <footer className="home-footer">
        <span>© {new Date().getFullYear()} FinanceIT</span>
      </footer>
    </div>
  );
}
