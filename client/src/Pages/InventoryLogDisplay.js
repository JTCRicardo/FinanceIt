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
  const [savingTransaction, setSavingTransaction] = useState(false);
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [showSalesHistory, setShowSalesHistory] = useState(false);
  const [salesHistory, setSalesHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

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

  const handleSoldItems = async () => {
    const item = inventoryLogs.find(log => log._id === selectedItemId);
    if (!item || !quantity || parseInt(quantity) <= 0) {
      setError('Please select an item and enter a valid quantity');
      return;
    }

    const calculated = parseFloat(item.cost) * parseInt(quantity);
    setRevenue(calculated.toFixed(2));
    setSavingTransaction(true);
    setTransactionSuccess(false);

    try {
      const token = await getToken();
      
      console.log('Sending transaction:', {
        itemTitle: item.title,
        unitPrice: item.cost,
        quantity: parseInt(quantity),
        inventoryLogId: item._id
      });
      
      const response = await fetch('http://localhost:5001/api/transactions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemTitle: item.title,
          unitPrice: item.cost,
          quantity: parseInt(quantity),
          inventoryLogId: item._id,
          date: new Date().toISOString()
        })
      });

      const data = await response.json();
      console.log('Transaction response:', data);

      if (data.success) {
        setTransactionSuccess(true);
        setError('');
        // Immediately update sales history if showing
        if (showSalesHistory) {
          await fetchSalesHistory();
        }
        // Reset after 3 seconds
        setTimeout(() => {
          setTransactionSuccess(false);
          setSelectedItemId('');
          setQuantity('');
          setRevenue(null);
        }, 3000);
      } else {
        setError(data.message || 'Failed to save transaction');
        console.error('Transaction failed:', data);
      }
    } catch (err) {
      console.error('Error saving transaction:', err);
      setError('Failed to save transaction. Please try again.');
    } finally {
      setSavingTransaction(false);
    }
  };

  const fetchSalesHistory = async () => {
    setLoadingHistory(true);
    try {
      const token = await getToken();
      
      console.log('Fetching sales history...');
      const response = await fetch('http://localhost:5001/api/transactions?type=sale', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      console.log('Sales history response:', data);

      if (data.success) {
        setSalesHistory(data.data);
      } else {
        console.error('Failed to fetch sales history:', data.message);
      }
    } catch (err) {
      console.error('Error fetching sales history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const toggleSalesHistory = () => {
    if (!showSalesHistory) {
      // Fetch history immediately when toggling to show
      setShowSalesHistory(true);
      fetchSalesHistory();
    } else {
      setShowSalesHistory(false);
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
            Add New Log
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

        {/* ✅ Sold Items Section */}
        {inventoryLogs.length > 0 && (
          <div className="revenue-calculator">
            <div className="section-header-with-button">
              <h3>📈 Record Sold Items</h3>
              <button 
                onClick={toggleSalesHistory}
                className="history-toggle-btn"
              >
                {showSalesHistory ? '✕ Hide History' : '📜 View Sales History'}
              </button>
            </div>

            {!showSalesHistory ? (
              <>
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
                  placeholder="Enter quantity sold"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                />

                <button onClick={handleSoldItems} disabled={savingTransaction}>
                  {savingTransaction ? 'Saving...' : 'Record Sale'}
                </button>

                {transactionSuccess && (
                  <p className="success-message">
                    <strong>✓ Sale recorded successfully!</strong> Revenue: ${revenue}
                  </p>
                )}
                
                {revenue !== null && !transactionSuccess && (
                  <p><strong>Sale Revenue:</strong> ${revenue}</p>
                )}
              </>
            ) : (
              <div className="sales-history">
                {loadingHistory ? (
                  <p className="loading-history">Loading sales history...</p>
                ) : salesHistory.length === 0 ? (
                  <p className="no-history">No sales recorded yet.</p>
                ) : (
                  <div className="history-list">
                    {salesHistory.map((sale) => (
                      <div key={sale._id} className="history-item">
                        <div className="history-item-header">
                          <h4>{sale.itemTitle}</h4>
                          <span className="history-revenue">${sale.totalRevenue.toFixed(2)}</span>
                        </div>
                        <div className="history-item-details">
                          <span>Qty: {sale.quantity}</span>
                          <span>Unit Price: ${sale.unitPrice.toFixed(2)}</span>
                          <span className="history-date">{formatDate(sale.date)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
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
