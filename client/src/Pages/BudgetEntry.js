import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import './BudgetEntry.css';

export default function BudgetEntry() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    cost: '',
    amount: '',
    entryType: 'expense', 
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Categories based on entry type
  const expenseCategories = ['Transportation', 'Rent', 'Utilities', 'Other'];
  const incomeCategories = ['Income'];

  const categories = formData.entryType === 'income' ? incomeCategories : expenseCategories;

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'entryType') {
      // Reset category when switching types
      setFormData(prev => ({
        ...prev,
        entryType: value,
        category: ''
      }));
    } else if (name === 'cost') {
      const filteredValue = value.replace(/[^0-9.,]/g, '');
      setFormData(prev => ({ ...prev, [name]: filteredValue }));
    } else if (name === 'amount') {
      const filteredValue = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: filteredValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.title.trim()) {
      setError('Please enter a title');
      setLoading(false);
      return;
    }
    if (!formData.cost || parseFloat(formData.cost.replace(/,/g, '')) <= 0) {
      setError('Please enter a valid cost');
      setLoading(false);
      return;
    }
    if (!formData.amount || parseInt(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      setLoading(false);
      return;
    }
    if (!formData.category) {
      setError('Please select a category');
      setLoading(false);
      return;
    }

    try {
      const token = await getToken();
      
      const response = await fetch('http://localhost:5001/api/budget-entries', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        alert('Budget entry created successfully!');
        setFormData({
          title: '',
          cost: '',
          amount: '',
          entryType: 'expense',
          category: '',
          description: '',
          date: new Date().toISOString().split('T')[0]
        });
      } else {
        setError(data.message || 'Failed to create budget entry');
      }
    } catch (err) {
      console.error('Error creating budget entry:', err);
      setError('Failed to create budget entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="budget-entry-page">
      <div className="budget-entry-container">
        <div className="budget-entry-header">
          <h1>💰 Budget Entry</h1>
          <p>Track your income and expenses</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="budget-entry-form">
          {/* */}
          <div className="form-group">
            <label>Entry Type *</label>
            <div className="entry-type-toggle">
              <button
                type="button"
                className={`type-btn ${formData.entryType === 'expense' ? 'active expense' : ''}`}
                onClick={() => handleChange({ target: { name: 'entryType', value: 'expense' } })}
              >
                💸 Expense
              </button>
              <button
                type="button"
                className={`type-btn ${formData.entryType === 'income' ? 'active income' : ''}`}
                onClick={() => handleChange({ target: { name: 'entryType', value: 'income' } })}
              >
                💵 Income
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder={formData.entryType === 'income' ? 'e.g., Client Payment, Sales' : 'e.g., Supplies, Lights, Rent'}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cost">{formData.entryType === 'income' ? 'Amount in Dollars' : 'Cost in Dollars'} *</label>
            <input
              id="cost"
              type="text"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Quantity *</label>
            <input
              id="amount"
              type="text"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              id="date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Optional description or notes"
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/dashboard')} className="cancel-btn">
              Cancel
            </button>
            <button type="button" onClick={() => navigate('/budget-entries')} className="display-btn">
              Display All Entries
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Creating...' : 'Create Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
