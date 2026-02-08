import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { useAuth } from '../hooks/useAuth';
import './Login.scss';

export const Login: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        <LoginForm />

        <div className="login-footer">
          <p className="login-footer-text">
            Don't have an account?{' '}
            <Link to="/register" className="login-link">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
