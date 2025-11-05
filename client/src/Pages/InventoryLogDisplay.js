import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import RevenueVisualization from './RevenueVisualization';
import './InventoryLogDisplay.css';

export default function InventoryLogDisplay() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [inventoryLogs, setInventoryLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Revenue calculator state
  const [selectedItemId, setSelectedItemId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [revenue, setRevenue] = useState(null);

  useEffect(() => {
    fetchInventoryLogs();
  }, []);

  const fetchInventoryLogs = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      const response = await fetch('http://localhost:5001/api/inventory-log', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setInventoryLogs(data.data);
      } else {
        setError(data.message || 'Failed to fetch inventory logs');
      }
    } catch (err) {
      console.error('Error fetching inventory logs:', err);
      setError('Failed to fetch inventory logs. Please try again.');
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

  const handleRevenueCalculation = () => {
    const item = inventoryLogs.find(log => log._id === selectedItemId);
    if (item && quantity) {
      const calculated = parseFloat(item.cost) * parseInt(quantity);
      setRevenue(calculated.toFixed(2));
    }
  };

  if (loading) {
    return (
      <div className="inventory-log-display-page">
        <div className="inventory-log-container">
          <div className="loading">Loading inventory logs...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="inventory-log-display-page">
      <div className="inventory-log-container">
        <div className="inventory-log-header">
          <h1>📦 Inventory Logs</h1>
          <p>All your inventory entries</p>
          <button 
            onClick={() => navigate('/inventory-log')}
            className="add-entry-btn"
          >
            + Add New Log
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Revenue Visualization Chart */}
        <RevenueVisualization inventoryLogs={inventoryLogs} />

        {inventoryLogs.length === 0 ? (
          <div className="no-entries">
            <p>No inventory logs found.</p>
            <button 
              onClick={() => navigate('/inventory-log')}
              className="add-first-entry-btn"
            >
              Create Your First Log
            </button>
          </div>
        ) : (
          <div className="entries-list">
            {inventoryLogs.map((entry) => (
              <div key={entry._id} className="entry-card">
                <div className="entry-header">
                  <h3 className="entry-title">{entry.title}</h3>
                </div>

                <div className="entry-details">
                  <div className="entry-amounts">
                    <div className="cost">
                      <span className="label">Cost:</span>
                      <span className="value">{formatCurrency(entry.cost)}</span>
                    </div>
                    <div className="amount">
                      <span className="label">Quantity:</span>
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

        {/* ✅ Revenue Calculator Section */}
        {inventoryLogs.length > 0 && (
          <div className="revenue-calculator">
            <h3>📈 Calculate Revenue</h3>

            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
            >
              <option value="">Select an item</option>
              {inventoryLogs.map(log => (
                <option key={log._id} value={log._id}>
                  {log.title} (${log.cost})
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
            />

            <button onClick={handleRevenueCalculation}>
              Calculate Revenue
            </button>

            {revenue !== null && (
              <p><strong>Estimated Revenue:</strong> ${revenue}</p>
            )}
          </div>
        )}

        <div className="back-to-dashboard">
          <button 
            onClick={() => navigate('/dashboard')}
            className="back-btn"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
