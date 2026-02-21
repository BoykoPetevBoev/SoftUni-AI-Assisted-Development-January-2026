import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Header } from '../components/Header';
import './Home.scss';

export const Home: React.FC = () => {
  const { user } = useAuth();

  // Mock data for demonstration
  const balance = 5250.75;
  const income = 8500.00;
  const expenses = 3249.25;

  return (
    <div className="home-page">
      <Header />

      <main className="home-main">
        <div className="home-container">
          {/* Welcome Section */}
          <div className="welcome-section">
            <h2 className="welcome-title">
              Welcome back, {user?.username || 'User'}
            </h2>
            <p className="welcome-text">
              Manage and track your finances with elegance and ease
            </p>
          </div>

          {/* Stats Grid - Balance, Income, Expenses */}
          <div className="stats-grid">
            {/* Total Balance Card */}
            <div className="stat-card stat-card--primary">
              <div className="stat-label">Total Balance</div>
              <div className="stat-value">${balance.toFixed(2)}</div>
              <div className="stat-change positive">↑ +$500 this month</div>
            </div>

            {/* Income Card */}
            <div className="stat-card stat-card--success">
              <div className="stat-label">Total Income</div>
              <div className="stat-value">${income.toFixed(2)}</div>
              <div className="stat-change positive">↑ +$1,200 vs last month</div>
            </div>

            {/* Expenses Card */}
            <div className="stat-card stat-card--error">
              <div className="stat-label">Total Expenses</div>
              <div className="stat-value">${expenses.toFixed(2)}</div>
              <div className="stat-change negative">↓ -$400 vs last month</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h3 className="quick-actions-title">Quick Actions</h3>
            <div className="quick-actions-grid">
              <button className="action-button">
                <span className="action-icon">➕</span>
                Add Transaction
              </button>
              <button className="action-button">
                <span className="action-icon">📊</span>
                View Reports
              </button>
              <button className="action-button">
                <span className="action-icon">🏷️</span>
                Manage Categories
              </button>
              <button className="action-button">
                <span className="action-icon">⚙️</span>
                Settings
              </button>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="user-info-card">
            <h3 className="card-title">Account Information</h3>
            <div className="info-row">
              <span className="info-label">Username</span>
              <span className="info-value">{user?.username}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email</span>
              <span className="info-value">{user?.email}</span>
            </div>
            {user?.first_name && (
              <div className="info-row">
                <span className="info-label">First Name</span>
                <span className="info-value">{user.first_name}</span>
              </div>
            )}
            {user?.last_name && (
              <div className="info-row">
                <span className="info-label">Last Name</span>
                <span className="info-value">{user.last_name}</span>
              </div>
            )}
          </div>

          {/* Coming Soon Features */}
          <div className="placeholder-section">
            <h3 className="section-title">Feature Highlights</h3>
            <p className="section-text">
              Fully-featured budget management and transaction tracking coming soon. Stay tuned!
            </p>
            <div className="placeholder-grid">
              <div className="placeholder-card">
                <div className="placeholder-icon">📊</div>
                <h4>Smart Dashboard</h4>
                <p>Beautiful analytics and insights at a glance</p>
              </div>
              <div className="placeholder-card">
                <div className="placeholder-icon">💳</div>
                <h4>Transaction Tracking</h4>
                <p>Organize income and expenses by category</p>
              </div>
              <div className="placeholder-card">
                <div className="placeholder-icon">📈</div>
                <h4>Detailed Reports</h4>
                <p>Analyze spending patterns and trends</p>
              </div>
              <div className="placeholder-card">
                <div className="placeholder-icon">🎯</div>
                <h4>Budget Goals</h4>
                <p>Set and track your financial targets</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
