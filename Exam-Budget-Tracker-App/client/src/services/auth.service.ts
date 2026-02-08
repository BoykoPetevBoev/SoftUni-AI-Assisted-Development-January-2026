import { requester } from '../api/requester';
import type { User, AuthResponse, LoginRequest, RegisterRequest } from '../types/auth';

export const loginUser = async (
  username: string,
  password: string
): Promise<AuthResponse> => {
  const credentials: LoginRequest = { username, password };
  
  return requester<AuthResponse>('/api/token/', {
    method: 'POST',
    body: JSON.stringify(credentials),
    skipAuth: true,
  });
};

export const registerUser = async (
  username: string,
  email: string,
  password: string,
  passwordConfirm: string
): Promise<User> => {
  const userData: RegisterRequest = {
    username,
    email,
    password,
    password_confirm: passwordConfirm,
  };
  
  return requester<User>('/api/users/register/', {
    method: 'POST',
    body: JSON.stringify(userData),
    skipAuth: true,
  });
};

export const getCurrentUser = async (): Promise<User> => {
  return requester<User>('/api/users/me/', {
    method: 'GET',
  });
};

export const logoutUser = async (refreshToken: string): Promise<{ detail: string }> => {
  return requester<{ detail: string }>('/api/users/logout/', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
};

export const refreshAccessToken = async (refreshToken: string): Promise<{ access: string }> => {
  return requester<{ access: string }>('/api/token/refresh/', {
    method: 'POST',
    body: JSON.stringify({ refresh: refreshToken }),
    skipAuth: true,
  });
};
