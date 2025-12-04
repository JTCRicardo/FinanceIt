import React, { useState, useEffect } from 'react';
import { useClerk, useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

export default function Profile() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Profile state
  const [formData, setFormData] = useState({
    username: user?.username || user?.primaryEmailAddress?.emailAddress?.split('@')[0] || '',
    email: user?.emailAddresses?.[0]?.emailAddress || user?.primaryEmailAddress?.emailAddress || '',
    phone: '',
    bio: '',
    company: ''
  });

  // Load user profile data from backend on mount
  useEffect(() => {
    // Update form data with Clerk user info
    if (user) {
      setFormData(prev => ({
        ...prev,
        username: user?.username || user?.firstName || user?.primaryEmailAddress?.emailAddress?.split('@')[0] || '',
        email: user?.emailAddresses?.[0]?.emailAddress || user?.primaryEmailAddress?.emailAddress || ''
      }));
    }
  }, [user]);

  // Load profile data from backend
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const token = await getToken();
        const response = await fetch('/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setFormData(prev => ({
            ...prev,
            phone: data.phone || '',
            bio: data.bio || '',
            company: data.company || ''
          }));
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    };
    
    if (user) {
      loadUserProfile();
    }
  }, [user, getToken]);

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Check if user is loaded
      if (!user) {
        setSaveMessage('❌ Error: User not loaded. Please refresh the page.');
        setTimeout(() => setSaveMessage(''), 5000);
        setLoading(false);
        return;
      }

      // Get token
      const token = await getToken();
      if (!token) {
        setSaveMessage('❌ Error: Failed to get authentication token.');
        setTimeout(() => setSaveMessage(''), 5000);
        setLoading(false);
        return;
      }

      // Make request
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          phone: formData.phone,
          bio: formData.bio,
          company: formData.company
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsEditing(false);
        setSaveMessage('✅ Profile updated successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setSaveMessage(`❌ Failed to save: ${errorData.message || 'Server error (status ' + response.status + ')'}`);
        setTimeout(() => setSaveMessage(''), 5000);
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setSaveMessage(`❌ Network error: ${err.message || 'Unable to reach server'}`);
      setTimeout(() => setSaveMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // Mock statistics - in real app, fetch from backend
  const stats = [
    { label: 'Budget Entries', value: '47', icon: '💰' },
    { label: 'Inventory Items', value: '128', icon: '📦' },
    { label: 'Total Saved', value: '$12,450', icon: '💵' },
    { label: 'Member Since', value: 'Jan 2024', icon: '📅' }
  ];

  const recentActivity = [
    { action: 'Added budget entry', date: '2 hours ago', type: 'budget' },
    { action: 'Updated inventory log', date: '1 day ago', type: 'inventory' },
    { action: 'Viewed visualizations', date: '3 days ago', type: 'view' },
    { action: 'Exported financial data', date: '1 week ago', type: 'export' }
  ];

  return (
    <div className="profile-page">
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
      <div className="profile-container">
        {saveMessage && (
          <div className="alert-message">{saveMessage}</div>
        )}

        <div className="profile-grid">
          {/* Left Column - Profile Card */}
          <div className="profile-card">
            <div className="profile-avatar-section">
              <div className="profile-avatar-large">
                {user?.username?.charAt(0).toUpperCase() || user?.emailAddresses?.[0]?.emailAddress?.charAt(0).toUpperCase() || 'U'}
              </div>
              <button className="change-photo-btn">Change Photo</button>
            </div>

            <div className="profile-info">
              <h1>{formData.username || 'User'}</h1>
              <p className="profile-username">@{formData.username || 'username'}</p>
              <p className="profile-email">{formData.email}</p>
            </div>

            <div className="profile-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <span className="stat-icon">{stat.icon}</span>
                  <div className="stat-info">
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="profile-actions">
              {!isEditing ? (
                <button className="primary-button" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </button>
              ) : (
                <>
                  <button className="primary-button" onClick={handleSaveProfile} disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button className="secondary-button" onClick={handleCancel} disabled={loading}>
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Column - Profile Details & Activity */}
          <div className="profile-details-column">
            {/* Profile Details */}
            <div className="details-card">
              <div className="card-header">
                <h2>Profile Information</h2>
              </div>
              <div className="card-body">

                {/* Username Field */}
                <div className="profile-field">
                  <label className="field-label">Username</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="field-input"
                      placeholder="Enter username"
                      disabled
                    />
                  ) : (
                    <div className="field-display">{formData.username || 'Not set'}</div>
                  )}
                </div>

                {/* Email Field */}
                <div className="profile-field">
                  <label className="field-label">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    className="field-input"
                    disabled
                  />
                </div>

                {/* Phone Field */}
                <div className="profile-field">
                  <label className="field-label">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="field-input"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <div className="field-display">{formData.phone || 'Not set'}</div>
                  )}
                </div>

                {/* Bio Field */}
                <div className="profile-field">
                  <label className="field-label">Bio</label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="field-textarea"
                      placeholder="Tell us about yourself"
                      rows="3"
                    />
                  ) : (
                    <div className="field-display">{formData.bio || 'Not set'}</div>
                  )}
                </div>

                {/* Company Field */}
                <div className="profile-field">
                  <label className="field-label">Company</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="field-input"
                      placeholder="Enter company name"
                    />
                  ) : (
                    <div className="field-display">{formData.company || 'Not set'}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="details-card">
              <div className="card-header">
                <h2>Recent Activity</h2>
              </div>
              <div className="card-body">
                <div className="activity-list">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <div className={`activity-icon ${activity.type}`}>
                        {activity.type === 'budget' && '💰'}
                        {activity.type === 'inventory' && '📦'}
                        {activity.type === 'view' && '👁️'}
                        {activity.type === 'export' && '📊'}
                      </div>
                      <div className="activity-content">
                        <div className="activity-action">{activity.action}</div>
                        <div className="activity-date">{activity.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
