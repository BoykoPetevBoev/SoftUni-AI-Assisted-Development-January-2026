import React from 'react';
import { Header } from '../components/Header';
import { useAuth } from '../hooks/useAuth';
import './Account.scss';

export const Account: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="account-page">
      <Header />

      <main className="account-main">
        <div className="account-container">
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
        </div>
      </main>
    </div>
  );
};
