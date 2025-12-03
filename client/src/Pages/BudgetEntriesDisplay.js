import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import './BudgetEntriesDisplay.css';

export default function BudgetEntriesDisplay() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [budgetEntries, setBudgetEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBudgetEntries();
  }, []);

  const fetchBudgetEntries = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      const response = await fetch('http://localhost:5001/api/budget-entries', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setBudgetEntries(data.data);
      } else {
        setError(data.message || 'Failed to fetch budget entries');
      }
    } catch (err) {
      console.error('Error fetching budget entries:', err);
      setError('Failed to fetch budget entries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="budget-entries-display-page">
        <div className="budget-entries-container">
          <div className="loading">Loading budget entries...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="budget-entries-display-page">
      <div className="budget-entries-container">
        <div className="budget-entries-header">
          <h1>💰 Budget Entries</h1>
          <p>All your budget entries</p>
          <button 
            onClick={() => navigate('/budget-entry')}
            className="add-entry-btn"
          >
            Add New Entry
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {budgetEntries.length === 0 ? (
          <div className="no-entries">
            <p>No budget entries found.</p>
            <button 
              onClick={() => navigate('/budget-entry')}
              className="add-first-entry-btn"
            >
              Create Your First Entry
            </button>
          </div>
        ) : (
          <div className="entries-list">
            {budgetEntries.map((entry) => (
              <div key={entry._id} className="entry-card">
                <div className="entry-header">
                  <h3 className="entry-title">{entry.title}</h3>
                  <span className="entry-category">{entry.category}</span>
                </div>
                
                <div className="entry-details">
                  <div className="entry-amounts">
                    <div className="cost">
                      <span className="label">Cost:</span>
                      <span className="value">{formatCurrency(entry.cost)}</span>
                    </div>
                    <div className="amount">
                      <span className="label">Amount:</span>
                      <span className="value">{entry.amount}</span>
                    </div>
                  </div>
                  
                  <div className="entry-meta">
                    <span className="entry-date">{formatDate(entry.date)}</span>
                    {entry.description && (
                      <p className="entry-description">{entry.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="back-to-dashboard">
          <button 
            onClick={() => navigate('/dashboard')}
            className="back-btn"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
