import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loginUser, registerUser, getCurrentUser, logoutUser, refreshAccessToken } from './auth.service';
import * as requesterModule from '../api/requester';

vi.mock('../api/requester', () => ({
  requester: vi.fn(),
}));

describe('auth.service', () => {
  const requester = vi.mocked(requesterModule.requester);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loginUser sends correct payload', async () => {
    requester.mockResolvedValue({ access: 'a', refresh: 'r' });

    const result = await loginUser('user', 'pass');

    expect(result).toEqual({ access: 'a', refresh: 'r' });
    expect(requester).toHaveBeenCalledWith('/api/token/', {
      method: 'POST',
      body: JSON.stringify({ username: 'user', password: 'pass' }),
      skipAuth: true,
    });
  });

  it('registerUser sends correct payload', async () => {
    requester.mockResolvedValue({ id: 1 });

    await registerUser('user', 'user@example.com', 'pass', 'pass');

    expect(requester).toHaveBeenCalledWith('/api/users/register/', {
      method: 'POST',
      body: JSON.stringify({
        username: 'user',
        email: 'user@example.com',
        password: 'pass',
        password_confirm: 'pass',
      }),
      skipAuth: true,
    });
  });

  it('getCurrentUser calls correct endpoint', async () => {
    requester.mockResolvedValue({ id: 1 });

    await getCurrentUser();

    expect(requester).toHaveBeenCalledWith('/api/users/me/', { method: 'GET' });
  });

  it('logoutUser sends refresh token', async () => {
    requester.mockResolvedValue({ detail: 'ok' });

    await logoutUser('refresh');

    expect(requester).toHaveBeenCalledWith('/api/users/logout/', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: 'refresh' }),
    });
  });

  it('refreshAccessToken sends refresh token', async () => {
    requester.mockResolvedValue({ access: 'new' });

    await refreshAccessToken('refresh');

    expect(requester).toHaveBeenCalledWith('/api/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: 'refresh' }),
      skipAuth: true,
    });
  });
});
