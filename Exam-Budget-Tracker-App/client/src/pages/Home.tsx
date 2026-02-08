import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import './Home.scss';

export const Home: React.FC = () => {
  const { user, logout } = useAuth();
  const { showSuccess } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      showSuccess('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="home-container">
          <h1 className="home-logo">Budget Tracker</h1>
          <button onClick={handleLogout} className="btn btn-outline">
            Logout
          </button>
        </div>
      </header>

      <main className="home-main">
        <div className="home-container">
          <div className="welcome-section">
            <h2 className="welcome-title">
              Welcome, {user?.username || 'User'}! 👋
            </h2>
            <p className="welcome-text">
              You're successfully logged in to your Budget Tracker account.
            </p>
          </div>

          <div className="user-info-card">
            <h3 className="card-title">Your Profile</h3>
            <div className="info-row">
              <span className="info-label">Username:</span>
              <span className="info-value">{user?.username}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{user?.email}</span>
            </div>
            {user?.first_name && (
              <div className="info-row">
                <span className="info-label">First Name:</span>
                <span className="info-value">{user.first_name}</span>
              </div>
            )}
            {user?.last_name && (
              <div className="info-row">
                <span className="info-label">Last Name:</span>
                <span className="info-value">{user.last_name}</span>
              </div>
            )}
          </div>

          <div className="placeholder-section">
            <h3 className="section-title">Coming Soon</h3>
            <p className="section-text">
              Budget management and transaction tracking features will be added here.
            </p>
            <div className="placeholder-grid">
              <div className="placeholder-card">
                <div className="placeholder-icon">📊</div>
                <h4>Dashboard</h4>
                <p>View your budget overview</p>
              </div>
              <div className="placeholder-card">
                <div className="placeholder-icon">💰</div>
                <h4>Transactions</h4>
                <p>Track income and expenses</p>
              </div>
              <div className="placeholder-card">
                <div className="placeholder-icon">📈</div>
                <h4>Reports</h4>
                <p>Analyze spending patterns</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
