import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react'; // Added Auth
import './PayrollManagement.css';

export default function PayrollManagement() {
  const navigate = useNavigate();
  const { getToken } = useAuth(); // Get token for API calls
  
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Initialize as empty, we will load from DB
  const [employees, setEmployees] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    position: '',
    salary: '',
    status: 'active',
    startDate: ''
  });

  // 1. FETCH DATA ON LOAD
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = await getToken();
      const response = await fetch('http://localhost:5001/api/payroll', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setEmployees(data.data); // Assuming backend returns { success: true, data: [...] }
      } else {
        // Fallback for demo if backend isn't ready yet, remove this in production
        console.warn('Backend not ready, using empty list'); 
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to load employee data');
    } finally {
      setIsLoading(false);
    }
  };

  const totalPayroll = employees.reduce((sum, emp) => sum + parseFloat(emp.salary || 0), 0);
  const activeEmployees = employees.filter(emp => emp.status === 'active').length;

  const handleOpenModal = (employee = null) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        name: employee.name,
        position: employee.position,
        salary: employee.salary.toString(),
        status: employee.status,
        startDate: employee.startDate ? new Date(employee.startDate).toISOString().split('T')[0] : ''
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        name: '',
        position: '',
        salary: '',
        status: 'active',
        startDate: new Date().toISOString().split('T')[0]
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEmployee(null);
    setFormData({
      name: '',
      position: '',
      salary: '',
      status: 'active',
      startDate: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 2. SAVE (CREATE OR UPDATE)
  const handleSave = async () => {
    if (!formData.name || !formData.position || !formData.salary) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const token = await getToken();
      const payload = {
        ...formData,
        salary: parseFloat(formData.salary)
      };

      let response;
      
      if (editingEmployee) {
        // UPDATE EXISTING
        response = await fetch(`http://localhost:5001/api/payroll/${editingEmployee._id || editingEmployee.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
      } else {
        // CREATE NEW
        response = await fetch('http://localhost:5001/api/payroll', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
      }

      const data = await response.json();

      if (data.success) {
        // Refresh the list from the server to ensure we have the latest data
        await fetchEmployees(); 
        handleCloseModal();
      } else {
        alert('Failed to save employee: ' + data.message);
      }
    } catch (err) {
      console.error('Error saving employee:', err);
      alert('Error saving data');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. DELETE
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const token = await getToken();
        const response = await fetch(`http://localhost:5001/api/payroll/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        const data = await response.json();
        if (data.success) {
          setEmployees(prev => prev.filter(emp => (emp._id || emp.id) !== id));
        } else {
          alert('Failed to delete');
        }
      } catch (err) {
        console.error('Error deleting:', err);
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="payroll-page">
      {/* Navigation Bar */}
      <nav className="payroll-navbar">
        <div className="payroll-nav-brand" onClick={() => navigate('/dashboard')}>
          <img src="/Photos/FinanceITlogo.png" alt="FinanceIT Logo" />
          FinanceIT
        </div>
        <button className="payroll-back-btn" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
      </nav>

      {/* Main Content */}
      <div className="payroll-content">
        <div className="payroll-header">
          <h1>💼 Payroll Management</h1>
          <button className="add-employee-btn" onClick={() => handleOpenModal()}>
            + Add Employee
          </button>
        </div>

        {/* Stats Cards */}
        <div className="payroll-stats">
          <div className="stat-card">
            <h3>Total Employees</h3>
            <div className="stat-value blue">{employees.length}</div>
          </div>
          <div className="stat-card">
            <h3>Active Employees</h3>
            <div className="stat-value green">{activeEmployees}</div>
          </div>
          <div className="stat-card">
            <h3>Monthly Payroll</h3>
            <div className="stat-value">{formatCurrency(totalPayroll / 12)}</div>
          </div>
          <div className="stat-card">
            <h3>Annual Payroll</h3>
            <div className="stat-value">{formatCurrency(totalPayroll)}</div>
          </div>
        </div>

        {/* Error Message */}
        {error && <div className="error-message" style={{color: 'red', textAlign: 'center', marginBottom: '20px'}}>{error}</div>}

        {/* Loading State */}
        {isLoading && employees.length === 0 ? (
           <div style={{textAlign: 'center', padding: '20px'}}>Loading payroll data...</div>
        ) : (
          /* Employee Table */
          <div className="employee-table-container">
            {employees.length > 0 ? (
              <table className="employee-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Position</th>
                    <th>Annual Salary</th>
                    <th>Start Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(employee => (
                    // MongoDB uses _id, falling back to id if necessary
                    <tr key={employee._id || employee.id}> 
                      <td className="employee-name">{employee.name}</td>
                      <td>{employee.position}</td>
                      <td>{formatCurrency(employee.salary)}</td>
                      <td>{new Date(employee.startDate).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge ${employee.status}`}>
                          {employee.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="action-btn edit" 
                          onClick={() => handleOpenModal(employee)}
                        >
                          Edit
                        </button>
                        <button 
                          className="action-btn delete" 
                          onClick={() => handleDelete(employee._id || employee.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <p>No employees found. Click "+ Add Employee" to get started.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</h2>
            
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter employee name"
              />
            </div>

            <div className="form-group">
              <label>Position *</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                placeholder="Enter position"
              />
            </div>

            <div className="form-group">
              <label>Annual Salary *</label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                placeholder="Enter annual salary"
              />
            </div>

            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={handleCloseModal}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleSave} disabled={isLoading}>
                {isLoading ? 'Saving...' : (editingEmployee ? 'Save Changes' : 'Add Employee')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}