import React, { useState } from 'react';
import { useClerk, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f6f8fa',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Navigation Bar */}
      <nav style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #d0d7de',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          color: '#24292f' 
        }}>
          <img 
            src="/Photos/FinanceITlogo.png" 
            alt="FinanceIT Logo" 
            style={{ 
              height: '32px', 
              width: 'auto' 
            }} 
          />
          FinanceIT
        </div>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* User Dropdown */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={toggleDropdown}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                fontSize: '14px',
                backgroundColor: 'transparent',
                color: '#24292f',
                border: '1px solid #d0d7de',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#0969da',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {user?.username?.charAt(0).toUpperCase() || user?.emailAddresses?.[0]?.emailAddress?.charAt(0).toUpperCase() || 'U'}
              </div>
              {user?.username || user?.emailAddresses?.[0]?.emailAddress || 'User'}
              <span style={{ fontSize: '12px' }}>▼</span>
            </button>
            
            {showDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: '0',
                marginTop: '4px',
                backgroundColor: 'white',
                border: '1px solid #d0d7de',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                minWidth: '160px',
                zIndex: 1000
              }}>
                <div style={{
                  padding: '8px 0',
                  borderBottom: '1px solid #f6f8fa'
                }}>
                  <div style={{
                    padding: '8px 16px',
                    fontSize: '12px',
                    color: '#656d76',
                    fontWeight: '600'
                  }}>
                    {user?.username || 'User'}
                  </div>
                  <div style={{
                    padding: '0 16px 8px',
                    fontSize: '12px',
                    color: '#656d76'
                  }}>
                    {user?.emailAddresses?.[0]?.emailAddress}
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setShowDropdown(false);
                    // Add settings navigation here
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    fontSize: '14px',
                    backgroundColor: 'transparent',
                    color: '#24292f',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  ⚙️ Settings
                </button>
                <button 
                  onClick={() => {
                    setShowDropdown(false);
                    // Add profile navigation here
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    fontSize: '14px',
                    backgroundColor: 'transparent',
                    color: '#24292f',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  👤 Profile
                </button>
                <div style={{ borderTop: '1px solid #f6f8fa' }}>
                  <button 
                    onClick={handleSignOut}
                    style={{
                      width: '100%',
                      padding: '8px 16px',
                      fontSize: '14px',
                      backgroundColor: 'transparent',
                      color: '#dc3545',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    🚪 Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ padding: '40px 24px' }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {/* Inventory Logging */}
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #d0d7de',
            borderRadius: '8px',
            padding: '24px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
          onMouseOver={(e) => {
            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            e.target.style.transform = 'translateY(0)';
          }}
          >
            <h3 style={{ 
              margin: '0 0 12px 0', 
              fontSize: '1.25rem', 
              fontWeight: '600',
              color: '#24292f'
            }}>
              📦 Inventory Logging
            </h3>
            <p style={{ 
              margin: '0', 
              color: '#656d76', 
              fontSize: '14px',
              lineHeight: '1.5'
            }}>
              Track and manage your business inventory, stock levels, and product movements.
            </p>
          </div>

          {/* Payroll Management */}
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #d0d7de',
            borderRadius: '8px',
            padding: '24px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
          onMouseOver={(e) => {
            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            e.target.style.transform = 'translateY(0)';
          }}
          >
            <h3 style={{ 
              margin: '0 0 12px 0', 
              fontSize: '1.25rem', 
              fontWeight: '600',
              color: '#24292f'
            }}>
              💰 Payroll Management
            </h3>
            <p style={{ 
              margin: '0', 
              color: '#656d76', 
              fontSize: '14px',
              lineHeight: '1.5'
            }}>
              Manage employee salaries, benefits, and payroll processing efficiently.
            </p>
          </div>

          {/* Visualizations */}
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #d0d7de',
            borderRadius: '8px',
            padding: '24px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
          onMouseOver={(e) => {
            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            e.target.style.transform = 'translateY(0)';
          }}
          >
            <h3 style={{ 
              margin: '0 0 12px 0', 
              fontSize: '1.25rem', 
              fontWeight: '600',
              color: '#24292f'
            }}>
              📊 Visualizations
            </h3>
            <p style={{ 
              margin: '0', 
              color: '#656d76', 
              fontSize: '14px',
              lineHeight: '1.5'
            }}>
              Create charts, graphs, and reports to visualize your financial data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
