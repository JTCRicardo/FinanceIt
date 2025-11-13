import React, { useState } from 'react';
import { useClerk, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

export default function Settings() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  // Settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [inventoryAlerts, setInventoryAlerts] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSaveSettings = () => {
    // Here you would typically save to backend
    setSaveMessage('Settings saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const renderGeneralSettings = () => (
    <div className="settings-section">
      <h2>General Settings</h2>
      
      <div className="setting-item">
        <label>Currency</label>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="USD">USD - US Dollar</option>
          <option value="EUR">EUR - Euro</option>
          <option value="GBP">GBP - British Pound</option>
          <option value="CAD">CAD - Canadian Dollar</option>
          <option value="AUD">AUD - Australian Dollar</option>
        </select>
      </div>

      <div className="setting-item">
        <label>Language</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </select>
      </div>

      <div className="setting-item">
        <label>Theme</label>
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto</option>
        </select>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="settings-section">
      <h2>Notifications</h2>
      
      <div className="setting-item toggle">
        <div>
          <label>Email Notifications</label>
          <p className="setting-description">Receive email updates about your account activity</p>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={(e) => setEmailNotifications(e.target.checked)}
          />
          <span className="slider"></span>
        </label>
      </div>

      <div className="setting-item toggle">
        <div>
          <label>Budget Alerts</label>
          <p className="setting-description">Get notified when you're approaching budget limits</p>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={budgetAlerts}
            onChange={(e) => setBudgetAlerts(e.target.checked)}
          />
          <span className="slider"></span>
        </label>
      </div>

      <div className="setting-item toggle">
        <div>
          <label>Inventory Alerts</label>
          <p className="setting-description">Receive notifications about low inventory levels</p>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={inventoryAlerts}
            onChange={(e) => setInventoryAlerts(e.target.checked)}
          />
          <span className="slider"></span>
        </label>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="settings-section">
      <h2>Security</h2>
      
      <div className="setting-item">
        <label>Change Password</label>
        <button className="secondary-button">Update Password</button>
      </div>

      <div className="setting-item toggle">
        <div>
          <label>Two-Factor Authentication</label>
          <p className="setting-description">Add an extra layer of security to your account</p>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={twoFactorEnabled}
            onChange={(e) => setTwoFactorEnabled(e.target.checked)}
          />
          <span className="slider"></span>
        </label>
      </div>

      <div className="setting-item">
        <label>Active Sessions</label>
        <button className="secondary-button">View All Sessions</button>
      </div>
    </div>
  );

  const renderDataSettings = () => (
    <div className="settings-section">
      <h2>Data & Privacy</h2>
      
      <div className="setting-item">
        <label>Export Data</label>
        <p className="setting-description">Download all your financial data</p>
        <button className="secondary-button">Export to CSV</button>
      </div>

      <div className="setting-item">
        <label>Delete Account</label>
        <p className="setting-description">Permanently delete your account and all associated data</p>
        <button className="danger-button">Delete Account</button>
      </div>
    </div>
  );

  return (
    <div className="settings-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-brand" onClick={() => navigate('/dashboard')}>
          <img src="/Photos/FinanceITlogo.png" alt="FinanceIT Logo" />
          FinanceIT
        </div>
        <div className="nav-user">
          <button onClick={toggleDropdown} className="user-button">
            <div className="user-avatar">
              {user?.username?.charAt(0).toUpperCase() || user?.emailAddresses?.[0]?.emailAddress?.charAt(0).toUpperCase() || 'U'}
            </div>
            {user?.username || user?.emailAddresses?.[0]?.emailAddress || 'User'}
            <span>▼</span>
          </button>
          
          {showDropdown && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <div className="dropdown-username">{user?.username || 'User'}</div>
                <div className="dropdown-email">{user?.emailAddresses?.[0]?.emailAddress}</div>
              </div>
              <button onClick={() => { setShowDropdown(false); navigate('/settings'); }} className="dropdown-item">
                ⚙️ Settings
              </button>
              <button onClick={() => { setShowDropdown(false); navigate('/profile'); }} className="dropdown-item">
                👤 Profile
              </button>
              <button onClick={() => { setShowDropdown(false); navigate('/dashboard'); }} className="dropdown-item">
                🏠 Dashboard
              </button>
              <div className="dropdown-divider"></div>
              <button onClick={handleSignOut} className="dropdown-item danger">
                🚪 Sign Out
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="settings-container">
        <div className="settings-header">
          <h1>Settings</h1>
          <p>Manage your account preferences and settings</p>
        </div>

        <div className="settings-content">
          {/* Sidebar */}
          <div className="settings-sidebar">
            <button
              className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              <span className="tab-icon">⚙️</span>
              General
            </button>
            <button
              className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <span className="tab-icon">🔔</span>
              Notifications
            </button>
            <button
              className={`tab-button ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <span className="tab-icon">🔒</span>
              Security
            </button>
            <button
              className={`tab-button ${activeTab === 'data' ? 'active' : ''}`}
              onClick={() => setActiveTab('data')}
            >
              <span className="tab-icon">📊</span>
              Data & Privacy
            </button>
          </div>

          {/* Settings Panel */}
          <div className="settings-panel">
            {activeTab === 'general' && renderGeneralSettings()}
            {activeTab === 'notifications' && renderNotificationSettings()}
            {activeTab === 'security' && renderSecuritySettings()}
            {activeTab === 'data' && renderDataSettings()}

            <div className="settings-actions">
              {saveMessage && <div className="save-message">{saveMessage}</div>}
              <button className="primary-button" onClick={handleSaveSettings}>
                Save Changes
              </button>
              <button className="secondary-button" onClick={() => navigate('/dashboard')}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
