import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import './InventoryLog.css';

export default function InventoryLog() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    cost: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0] // Today's date
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle cost field - only allow numbers, periods, and commas
    if (name === 'cost') {
      const filteredValue = value.replace(/[^0-9.,]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: filteredValue
      }));
    }
    // Handle amount field - only allow whole numbers
    else if (name === 'amount') {
      const filteredValue = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: filteredValue
      }));
    }
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
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

    try {
      // Get JWT token from Clerk
      const token = await getToken();
      
      // Send data to backend API
      const response = await fetch('http://localhost:5001/api/inventory-log', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        alert('Inventory logged successfully!');
        setFormData({
          title: '',
          cost: '',
          amount: '',
          description: '',
          date: new Date().toISOString().split('T')[0]
        });
      } else {
        setError(data.message || 'Failed to log inventory ');
      }
    } catch (err) {
      console.error('Error logging inventory', err);
      setError('Failed logging inventory. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inventory-log-page">
      <div className="inventory-log-container">
        <div className="inventory-log-header">
          <h1>📦 Inventory Log</h1>
          <p>Track and manage your inventory items</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="inventory-log-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Books, Chocolate, Water"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cost">1 item Sales Price (Dollars)</label>
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
            <label htmlFor="amount">Amount *</label>
            <input
              id="amount"
              type="text"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0"
              required
            />
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
            <button type="button" onClick={() => navigate('/inventory-logs')} className="display-btn">
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
