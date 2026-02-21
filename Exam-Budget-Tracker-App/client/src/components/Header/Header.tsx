import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import './Header.scss';

export const Header: React.FC = () => {
  const { logout, isAuthenticated } = useAuth();
  const { showSuccess } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      showSuccess('Logged out successfully');
      navigate('/login');
    } catch {
      // Logout errors are handled in AuthContext
    }
  };

  const isActive = (path: string) => location.pathname === path ? '--active' : '';

  return (
    <header className="app-header">
      <div className="app-container">
        <div className="app-header__content">
          <h1 className="app-logo">💶 Budget Tracker</h1>
          <nav className="app-nav">
            <Link to="/" className={`app-nav__link app-nav__link${isActive('/')}`}>
              Home
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/budgets"
                  className={`app-nav__link app-nav__link${isActive('/budgets')}`}
                >
                  Budgets
                </Link>
                <Link
                  to="/account"
                  className={`app-nav__link app-nav__link${isActive('/account')}`}
                >
                  Account
                </Link>
              </>
            )}
          </nav>
        </div>
        {isAuthenticated && (
          <button onClick={handleLogout} className="btn btn-outline">
            Logout
          </button>
        )}
      </div>
    </header>
  );
};
