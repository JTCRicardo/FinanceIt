import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import './PayrollEntry.css';

export default function PayrollEntry() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    employeeName: '',
    employeeId: '',
    position: '',
    hourlyRate: '',
    taxRate: '15'
  });
  const [formData, setFormData] = useState({
    hoursWorked: '',
    benefits: '',
    payPeriod: '',
    paymentDate: new Date().toISOString().split('T')[0],
    status: 'Pending',
    notes: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const payPeriods = ['Weekly', 'Bi-weekly', 'Monthly', 'Annually'];
  const statuses = ['Pending', 'Processed', 'Paid'];

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = await getToken();
      const response = await fetch('http://localhost:5001/api/employees?status=Active', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setEmployees(data.data);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle numeric fields
    if (['hoursWorked', 'benefits'].includes(name)) {
      const filteredValue = value.replace(/[^0-9.,]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: filteredValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNewEmployeeChange = (e) => {
    const { name, value } = e.target;
    
    if (['hourlyRate', 'taxRate'].includes(name)) {
      const filteredValue = value.replace(/[^0-9.,]/g, '');
      setNewEmployee(prev => ({
        ...prev,
        [name]: filteredValue
      }));
    } else {
      setNewEmployee(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = await getToken();
      const response = await fetch('http://localhost:5001/api/employees', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmployee)
      });

      const data = await response.json();

      if (data.success) {
        alert('Employee created successfully!');
        await fetchEmployees();
        setSelectedEmployee(data.data);
        setShowEmployeeForm(false);
        setNewEmployee({
          employeeName: '',
          employeeId: '',
          position: '',
          hourlyRate: '',
          taxRate: '15'
        });
      } else {
        setError(data.message || 'Failed to create employee');
      }
    } catch (err) {
      console.error('Error creating employee:', err);
      setError('Failed to create employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!selectedEmployee) {
      setError('Please select an employee');
      setLoading(false);
      return;
    }
    if (!formData.hoursWorked || parseFloat(formData.hoursWorked.replace(/,/g, '')) <= 0) {
      setError('Please enter valid hours worked');
      setLoading(false);
      return;
    }
    if (!formData.payPeriod) {
      setError('Please select a pay period');
      setLoading(false);
      return;
    }

    try {
      const token = await getToken();
      
      const payrollData = {
        employeeName: selectedEmployee.employeeName,
        employeeId: selectedEmployee.employeeId,
        position: selectedEmployee.position,
        hoursWorked: formData.hoursWorked,
        hourlyRate: selectedEmployee.hourlyRate,
        benefits: formData.benefits,
        taxRate: selectedEmployee.taxRate,
        payPeriod: formData.payPeriod,
        paymentDate: formData.paymentDate,
        status: formData.status,
        notes: formData.notes
      };
      
      const response = await fetch('http://localhost:5001/api/payroll', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payrollData)
      });

      const data = await response.json();

      if (data.success) {
        alert('Payroll entry created successfully!');
        navigate('/payroll');
      } else {
        setError(data.message || 'Failed to create payroll entry');
      }
    } catch (err) {
      console.error('Error creating payroll entry:', err);
      setError('Failed to create payroll entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const calculateGrossSalary = () => {
    if (!selectedEmployee) return '0.00';
    const hours = parseFloat(formData.hoursWorked.replace(/,/g, '') || 0);
    const rate = parseFloat(selectedEmployee.hourlyRate || 0);
    return (hours * rate).toFixed(2);
  };

  const calculateTaxDeductions = () => {
    if (!selectedEmployee) return '0.00';
    const grossSalary = parseFloat(calculateGrossSalary());
    const taxRate = parseFloat(selectedEmployee.taxRate || 0);
    return ((grossSalary * taxRate) / 100).toFixed(2);
  };

  const calculateNetPay = () => {
    if (!selectedEmployee) return '0.00';
    const grossSalary = parseFloat(calculateGrossSalary());
    const benefits = parseFloat(formData.benefits.replace(/,/g, '') || 0);
    const deductions = parseFloat(calculateTaxDeductions());
    return (grossSalary + benefits - deductions).toFixed(2);
  };

  return (
    <div className="payroll-entry-page">
      <div className="payroll-entry-container">
        <div className="payroll-entry-header">
          <h1>💼 Payroll Entry</h1>
          <p>Manage employee salaries, benefits, and payroll processing</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {!selectedEmployee ? (
          <div className="employee-selection">
            <h3>Step 1: Select or Add Employee</h3>
            
            {employees.length > 0 && (
              <div className="employee-list">
                <h4>Select Existing Employee:</h4>
                <div className="employee-cards">
                  {employees.map((emp) => (
                    <div 
                      key={emp._id} 
                      className="employee-card"
                      onClick={() => setSelectedEmployee(emp)}
                    >
                      <div className="emp-name">{emp.employeeName}</div>
                      <div className="emp-details">
                        <span>ID: {emp.employeeId}</span>
                        <span>{emp.position}</span>
                      </div>
                      <div className="emp-rate">${emp.hourlyRate}/hr</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="add-employee-section">
              {!showEmployeeForm ? (
                <button 
                  className="add-employee-btn"
                  onClick={() => setShowEmployeeForm(true)}
                >
                  + Add New Employee
                </button>
              ) : (
                <form onSubmit={handleCreateEmployee} className="employee-form">
                  <h4>Add New Employee</h4>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Employee Name *</label>
                      <input
                        type="text"
                        name="employeeName"
                        value={newEmployee.employeeName}
                        onChange={handleNewEmployeeChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Employee ID *</label>
                      <input
                        type="text"
                        name="employeeId"
                        value={newEmployee.employeeId}
                        onChange={handleNewEmployeeChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Position *</label>
                    <input
                      type="text"
                      name="position"
                      value={newEmployee.position}
                      onChange={handleNewEmployeeChange}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Hourly Rate ($) *</label>
                      <input
                        type="text"
                        name="hourlyRate"
                        value={newEmployee.hourlyRate}
                        onChange={handleNewEmployeeChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Tax Rate (%)</label>
                      <input
                        type="text"
                        name="taxRate"
                        value={newEmployee.taxRate}
                        onChange={handleNewEmployeeChange}
                      />
                    </div>
                  </div>

                  <div className="button-group">
                    <button 
                      type="button"
                      className="secondary-button"
                      onClick={() => setShowEmployeeForm(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="submit-button"
                      disabled={loading}
                    >
                      {loading ? 'Creating...' : 'Create Employee'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        ) : (
          <div className="payroll-form-container">
            <div className="selected-employee-info">
              <h3>Step 2: Enter Payroll Details</h3>
              <div className="employee-info-card">
                <div>
                  <strong>{selectedEmployee.employeeName}</strong>
                  <span> (ID: {selectedEmployee.employeeId})</span>
                </div>
                <div className="emp-details">
                  <span>{selectedEmployee.position}</span>
                  <span>${selectedEmployee.hourlyRate}/hr</span>
                  <span>Tax: {selectedEmployee.taxRate}%</span>
                </div>
                <button 
                  className="change-employee-btn"
                  onClick={() => setSelectedEmployee(null)}
                >
                  Change Employee
                </button>
              </div>
            </div>

        <form onSubmit={handleSubmit} className="payroll-entry-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="hoursWorked">Hours Worked *</label>
              <input
                id="hoursWorked"
                type="text"
                name="hoursWorked"
                value={formData.hoursWorked}
                onChange={handleChange}
                placeholder="e.g., 40"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="benefits">Benefits ($)</label>
              <input
                id="benefits"
                type="text"
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
          </div>

          {formData.hoursWorked && (
            <>
              <div className="calculation-display">
                <strong>Gross Salary: ${calculateGrossSalary()}</strong>
              </div>
              <div className="calculation-display">
                <strong>Tax Deductions: ${calculateTaxDeductions()}</strong>
              </div>
              <div className="net-pay-display">
                <strong>Net Pay: ${calculateNetPay()}</strong>
              </div>
            </>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="payPeriod">Pay Period *</label>
              <select
                id="payPeriod"
                name="payPeriod"
                value={formData.payPeriod}
                onChange={handleChange}
                required
              >
                <option value="">Select pay period</option>
                {payPeriods.map(period => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="paymentDate">Payment Date *</label>
              <input
                id="paymentDate"
                type="date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes or comments..."
              rows="3"
            />
          </div>

          <div className="button-group">
            <button 
              type="button" 
              className="secondary-button"
              onClick={() => navigate('/payroll')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Payroll Entry'}
            </button>
          </div>
        </form>
          </div>
        )}
      </div>
    </div>
  );
}
