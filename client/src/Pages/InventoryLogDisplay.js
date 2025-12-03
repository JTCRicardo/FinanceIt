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
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setInventoryLogs(data.data);
      else setError(data.message || 'Failed to fetch logs');
    } catch (err) {
      setError('Failed to fetch logs');
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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const token = await getToken();
      const response = await fetch(`http://localhost:5001/api/inventory-log/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        // Remove from UI immediately
        setInventoryLogs(prev => prev.filter(item => item._id !== id));
      } else {
        alert('Failed to delete item');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting item');
    }
  };

  const handleSoldItems = async () => {
    const item = inventoryLogs.find(log => log._id === selectedItemId);
    if (!item || !quantity || parseInt(quantity) <= 0) {
      setError('Please select an item and enter a valid quantity');
      return;
    }

    // Check frontend stock first
    if (parseInt(quantity) > item.amount) {
      setError(`Only ${item.amount} items in stock!`);
      return;
    }

    const calculated = parseFloat(item.cost) * parseInt(quantity);
    setRevenue(calculated.toFixed(2));
    setSavingTransaction(true);
    setTransactionSuccess(false);

    try {
      const token = await getToken();
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
      if (data.success) {
        setTransactionSuccess(true);
        setError('');
        
    
        setInventoryLogs(prev => prev.map(log => 
          log._id === selectedItemId 
            ? { ...log, amount: data.newStockAmount } 
            : log
        ));

        if (showSalesHistory) await fetchSalesHistory();
        
        setTimeout(() => {
          setTransactionSuccess(false);
          setSelectedItemId('');
          setQuantity('');
          setRevenue(null);
        }, 3000);
      } else {
        setError(data.message || 'Failed to save transaction');
      }
    } catch (err) {
      setError('Failed to save transaction');
    } finally {
      setSavingTransaction(false);
    }
  };

  const fetchSalesHistory = async () => {
    setLoadingHistory(true);
    try {
      const token = await getToken();
      const response = await fetch('http://localhost:5001/api/transactions?type=sale', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setSalesHistory(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const toggleSalesHistory = () => {
    if (!showSalesHistory) {
      setShowSalesHistory(true);
      fetchSalesHistory();
    } else {
      setShowSalesHistory(false);
    }
  };

  if (loading) return <div className="inventory-log-display-page"><div className="loading">Loading...</div></div>;

  return (
    <div className="inventory-log-display-page">
      <div className="inventory-log-container">
        <div className="inventory-log-header">
          <h1>📦 Inventory Manager</h1>
          <div className="header-actions">
            <button onClick={() => navigate('/dashboard')} className="back-btn">Dashboard</button>
            <button onClick={() => navigate('/inventory-log')} className="add-entry-btn">Add New Item</button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="inventory-top-grid">
          <div className="grid-card chart-section">
            <RevenueVisualization inventoryLogs={inventoryLogs} />
          </div>

          <div className="grid-card calculator-section">
            <div className="section-header-with-button">
              <h3>⚡ Quick Sale</h3>
              <button onClick={toggleSalesHistory} className="history-toggle-text">
                {showSalesHistory ? 'Hide History' : 'View History'}
              </button>
            </div>

            {!showSalesHistory ? (
              <div className="calculator-form">
                <select
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                  className="dark-input"
                >
                  <option value="">Select Item Sold...</option>
                  {inventoryLogs.map(log => (
                    <option key={log._id} value={log._id} disabled={log.amount === 0}>
                      {log.title} (${log.cost}) - {log.amount} left
                    </option>
                  ))}
                </select>

                <div className="input-group">
                  <input
                    type="number"
                    placeholder="Qty"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                    className="dark-input"
                  />
                  <button onClick={handleSoldItems} disabled={savingTransaction || !selectedItemId} className="sell-btn">
                    {savingTransaction ? '...' : 'Sell'}
                  </button>
                </div>

                {transactionSuccess && (
                  <div className="success-banner">
                    ✓ Sold for ${revenue}
                  </div>
                )}
              </div>
            ) : (
              <div className="sales-history-compact">
                {loadingHistory ? <p>Loading...</p> : salesHistory.length === 0 ? <p>No sales yet.</p> : (
                  <div className="history-list">
                    {salesHistory.map((sale) => (
                      <div key={sale._id} className="history-item-compact">
                        <div className="hist-main">
                          <span className="hist-title">{sale.itemTitle}</span>
                          <span className="hist-rev">+${sale.totalRevenue.toFixed(2)}</span>
                        </div>
                        <div className="hist-sub">
                          {new Date(sale.date).toLocaleDateString()} • Qty: {sale.quantity}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <h3 className="section-title">Current Inventory</h3>
        {inventoryLogs.length === 0 ? (
          <div className="no-entries">
            <p>No inventory logs found.</p>
          </div>
        ) : (
          <div className="entries-grid">
            {inventoryLogs.map((entry) => (
              <div key={entry._id} className="entry-card compact">
                <div className="entry-header">
                  <h3 className="entry-title">{entry.title}</h3>
                  <span className="entry-cost">{formatCurrency(entry.cost)}</span>
                </div>
                <div className="entry-details-compact">
                  <div className="detail-item">
                    <span className="label">In Stock</span>
                    <span className="value">{entry.amount}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Total Value</span>
                    <span className="value active">${(entry.cost * entry.amount).toFixed(2)}</span>
                  </div>
                </div>
                
                <button 
                  className="delete-item-btn" 
                  onClick={() => handleDelete(entry._id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}