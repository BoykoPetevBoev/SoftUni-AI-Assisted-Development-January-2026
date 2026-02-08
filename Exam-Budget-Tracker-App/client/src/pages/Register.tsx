import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RegisterForm } from '../components/RegisterForm';
import { useAuth } from '../hooks/useAuth';
import './Register.scss';

export const Register: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-header">
          <h1 className="register-title">Create Account</h1>
          <p className="register-subtitle">Join us to manage your budget</p>
        </div>

        <RegisterForm />

        <div className="register-footer">
          <p className="register-footer-text">
            Already have an account?{' '}
            <Link to="/login" className="register-link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
