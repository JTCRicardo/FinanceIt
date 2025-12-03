import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import './PayrollDisplay.css';

export default function PayrollDisplay() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [payrollEntries, setPayrollEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [expandedEmployee, setExpandedEmployee] = useState(null);

  useEffect(() => {
    fetchPayrollEntries();
  }, []);

  const fetchPayrollEntries = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      const response = await fetch('http://localhost:5001/api/payroll', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setPayrollEntries(data.data);
      } else {
        setError(data.message || 'Failed to fetch payroll entries');
      }
    } catch (err) {
      console.error('Error fetching payroll entries:', err);
      setError('Failed to fetch payroll entries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this payroll entry?')) {
      return;
    }

    try {
      const token = await getToken();
      const response = await fetch(`http://localhost:5001/api/payroll/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setPayrollEntries(payrollEntries.filter(entry => entry._id !== id));
        alert('Payroll entry deleted successfully!');
      } else {
        alert('Failed to delete payroll entry');
      }
    } catch (err) {
      console.error('Error deleting payroll entry:', err);
      alert('Failed to delete payroll entry. Please try again.');
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return '#10b981';
      case 'Processed':
        return '#3b82f6';
      case 'Pending':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const filteredEntries = filterStatus === 'All' 
    ? payrollEntries 
    : payrollEntries.filter(entry => entry.status === filterStatus);

  // Group payroll entries by employee
  const groupedByEmployee = filteredEntries.reduce((acc, entry) => {
    const key = entry.employeeId;
    if (!acc[key]) {
      acc[key] = {
        employeeName: entry.employeeName,
        employeeId: entry.employeeId,
        position: entry.position,
        entries: []
      };
    }
    acc[key].entries.push(entry);
    return acc;
  }, {});

  const employees = Object.values(groupedByEmployee);

  const totalPayroll = filteredEntries.reduce((sum, entry) => sum + entry.netPay, 0);

  const toggleEmployee = (employeeId) => {
    setExpandedEmployee(expandedEmployee === employeeId ? null : employeeId);
  };

  if (loading) {
    return (
      <div className="payroll-display-page">
        <div className="payroll-container">
          <div className="loading">Loading payroll entries...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="payroll-display-page">
      <div className="payroll-container">
        <div className="payroll-header">
          <div>
            <h1>💼 Payroll Management</h1>
            <p>Manage employee salaries and benefits</p>
          </div>
          <button 
            onClick={() => navigate('/payroll-entry')}
            className="add-entry-btn"
          >
            Add New Payroll
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {payrollEntries.length === 0 ? (
          <div className="no-entries">
            <p>No payroll entries found.</p>
            <button 
              onClick={() => navigate('/payroll-entry')}
              className="add-first-entry-btn"
            >
              Create Your First Payroll Entry
                </button>
              </div>
            ) : (
              <>
                <div className="filter-controls">
                  <label>Filter by Status:</label>
                  <select 
                    value={filterStatus} 
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="filter-select"
                  >
                    <option value="All">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Processed">Processed</option>
                    <option value="Paid">Paid</option>
                  </select>
                  <div className="total-payroll">
                    Total Payroll: {formatCurrency(totalPayroll)}
                  </div>
                </div>
    
                <div className="employee-list">
                  {employees.map((employee) => (
                <div key={employee.employeeId} className="employee-group">
                  <div 
                    className="employee-header"
                    onClick={() => toggleEmployee(employee.employeeId)}
                  >
                    <div className="employee-info">
                      <h3 className="employee-name">{employee.employeeName}</h3>
                      <span className="employee-id">ID: {employee.employeeId}</span>
                      <span className="employee-position">{employee.position}</span>
                    </div>
                    <div className="employee-stats">
                      <span className="entry-count">{employee.entries.length} payroll {employee.entries.length === 1 ? 'entry' : 'entries'}</span>
                      <span className="total-paid">
                        Total: {formatCurrency(employee.entries.reduce((sum, e) => sum + e.netPay, 0))}
                      </span>
                      <span className={`expand-icon ${expandedEmployee === employee.employeeId ? 'expanded' : ''}`}>
                        ▼
                      </span>
                    </div>
                  </div>

                  {expandedEmployee === employee.employeeId && (
                    <div className="payroll-entries">
                      {employee.entries.map((entry) => (
                        <div key={entry._id} className="payroll-entry-card">
                          <div className="entry-header">
                            <div className="entry-date">
                              <strong>{formatDate(entry.paymentDate)}</strong>
                              <span className="pay-period">{entry.payPeriod}</span>
                            </div>
                            <span 
                              className="status-badge"
                              style={{ backgroundColor: getStatusColor(entry.status) }}
                            >
                              {entry.status}
                            </span>
                          </div>

                          <div className="entry-details">
                            <div className="detail-row">
                              <span className="label">Hours Worked:</span>
                              <span className="value">{entry.hoursWorked} hrs @ {formatCurrency(entry.hourlyRate)}/hr</span>
                            </div>
                            <div className="detail-row">
                              <span className="label">Tax Rate:</span>
                              <span className="value">{entry.taxRate}%</span>
                            </div>
                          </div>

                          <div className="entry-amounts">
                            <div className="amount-row">
                              <span className="label">Gross Salary:</span>
                              <span className="value">{formatCurrency(entry.salary)}</span>
                            </div>
                            <div className="amount-row benefits">
                              <span className="label">+ Benefits:</span>
                              <span className="value">{formatCurrency(entry.benefits)}</span>
                            </div>
                            <div className="amount-row deductions">
                              <span className="label">- Tax Deductions:</span>
                              <span className="value">{formatCurrency(entry.deductions)}</span>
                            </div>
                            <div className="amount-row net-pay">
                              <span className="label">Net Pay:</span>
                              <span className="value">{formatCurrency(entry.netPay)}</span>
                            </div>
                          </div>

                          {entry.notes && (
                            <div className="entry-notes">
                              <strong>Notes:</strong> {entry.notes}
                            </div>
                          )}

                          <div className="entry-actions">
                            <button 
                              className="delete-btn"
                              onClick={() => handleDelete(entry._id)}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
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
