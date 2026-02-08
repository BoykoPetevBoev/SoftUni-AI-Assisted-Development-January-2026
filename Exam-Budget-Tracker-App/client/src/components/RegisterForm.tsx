import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { handleApiFormError } from '../utils/formErrorHandler';
import './RegisterForm.scss';

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(150, 'Username must not exceed 150 characters')
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        'Username can only contain letters, numbers, underscores, and hyphens'
      ),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Passwords do not match',
    path: ['passwordConfirm'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm: React.FC = () => {
  const { register: registerUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      await registerUser(data.username, data.email, data.password, data.passwordConfirm);
      showSuccess('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      handleApiFormError(err, setError, showError, {
        password_confirm: 'passwordConfirm',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
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
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          id="email"
          type="email"
          className={`form-input ${errors.email ? 'form-input--error' : ''}`}
          {...register('email')}
          disabled={isLoading}
          autoComplete="email"
        />
        {errors.email && (
          <span className="form-error">{errors.email.message}</span>
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
            autoComplete="new-password"
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

      <div className="form-group">
        <label htmlFor="passwordConfirm" className="form-label">
          Confirm Password
        </label>
        <div className="password-input-wrapper">
          <input
            id="passwordConfirm"
            type={showPasswordConfirm ? 'text' : 'password'}
            className={`form-input ${errors.passwordConfirm ? 'form-input--error' : ''}`}
            {...register('passwordConfirm')}
            disabled={isLoading}
            autoComplete="new-password"
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
            aria-label={showPasswordConfirm ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPasswordConfirm ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
        {errors.passwordConfirm && (
          <span className="form-error">{errors.passwordConfirm.message}</span>
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
            Creating account...
          </>
        ) : (
          'Register'
        )}
      </button>
    </form>
  );
};
