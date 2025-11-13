import React, { useState } from 'react';
import { useClerk, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

export default function Profile() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  // Profile state
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    email: user?.emailAddresses?.[0]?.emailAddress || '',
    phone: user?.phoneNumbers?.[0]?.phoneNumber || '',
    bio: 'Financial enthusiast focused on building better money habits.',
    company: '',
    location: '',
    website: ''
  });

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

  const handleSaveProfile = () => {
    // Here you would typically save to backend/Clerk
    setIsEditing(false);
    setSaveMessage('Profile updated successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      username: user?.username || '',
      email: user?.emailAddresses?.[0]?.emailAddress || '',
      phone: user?.phoneNumbers?.[0]?.phoneNumber || '',
      bio: 'Financial enthusiast focused on building better money habits.',
      company: '',
      location: '',
      website: ''
    });
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
              <h1>{formData.firstName || formData.username || 'User'} {formData.lastName || ''}</h1>
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
                  <button className="primary-button" onClick={handleSaveProfile}>
                    Save Changes
                  </button>
                  <button className="secondary-button" onClick={handleCancel}>
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
                <div className="form-group">
                  <label>First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter first name"
                    />
                  ) : (
                    <div className="form-value">{formData.firstName || 'Not set'}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter last name"
                    />
                  ) : (
                    <div className="form-value">{formData.lastName || 'Not set'}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Username</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Enter username"
                    />
                  ) : (
                    <div className="form-value">{formData.username || 'Not set'}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <div className="form-value">{formData.email}</div>
                  {isEditing && <small className="form-hint">Email cannot be changed here</small>}
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <div className="form-value">{formData.phone || 'Not set'}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Bio</label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself"
                      rows="3"
                    />
                  ) : (
                    <div className="form-value">{formData.bio || 'No bio yet'}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Company</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Enter company name"
                    />
                  ) : (
                    <div className="form-value">{formData.company || 'Not set'}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Enter your location"
                    />
                  ) : (
                    <div className="form-value">{formData.location || 'Not set'}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Website</label>
                  {isEditing ? (
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                    />
                  ) : (
                    <div className="form-value">{formData.website || 'Not set'}</div>
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
