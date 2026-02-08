import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { ApiError } from '../api/requester';
import './LoginForm.scss';

const loginSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(150, 'Username must not exceed 150 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      await login(data.username, data.password);
      showSuccess('Login successful!');
      navigate('/');
    } catch (err) {
      if (err instanceof ApiError) {
        const errorData = err.data as Record<string, string[] | string>;
        if (errorData.username) {
          setError('username', { message: Array.isArray(errorData.username) ? errorData.username[0] : errorData.username });
        }
        if (errorData.password) {
          setError('password', { message: Array.isArray(errorData.password) ? errorData.password[0] : errorData.password });
        }
        if (errorData.detail) {
          showError(typeof errorData.detail === 'string' ? errorData.detail : errorData.detail[0]);
        } else if (errorData.non_field_errors) {
          showError(Array.isArray(errorData.non_field_errors) ? errorData.non_field_errors[0] : errorData.non_field_errors);
        }
      } else {
        showError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label htmlFor="username" className="form-label">
          Username
        </label>
        <input
          id="username"
          type="text"
          className={`form-input ${errors.username ? 'form-input--error' : ''}`}
          {...register('username')}
          ref={(e) => {
            register('username').ref(e);
            usernameRef.current = e;
          }}
          disabled={isLoading}
          autoComplete="username"
        />
        {errors.username && (
          <span className="form-error">{errors.username.message}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <div className="password-input-wrapper">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            className={`form-input ${errors.password ? 'form-input--error' : ''}`}
            {...register('password')}
            disabled={isLoading}
            autoComplete="current-password"
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
        {errors.password && (
          <span className="form-error">{errors.password.message}</span>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="spinner"></span>
            Logging in...
          </>
        ) : (
          'Login'
        )}
      </button>
    </form>
  );
};
