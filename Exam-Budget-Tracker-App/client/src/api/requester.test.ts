import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { requester, ApiError } from './requester';
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from '../utils/tokenStorage';

vi.mock('../utils/tokenStorage', () => ({
  getAccessToken: vi.fn(),
  getRefreshToken: vi.fn(),
  setTokens: vi.fn(),
  clearTokens: vi.fn(),
}));

const createJsonResponse = (data: unknown, ok: boolean = true, status: number = 200) => ({
  ok,
  status,
  headers: {
    get: () => 'application/json',
  },
  json: async () => data,
  text: async () => JSON.stringify(data),
});

describe('requester', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', fetchMock as typeof fetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('adds Authorization header when token exists', async () => {
    vi.mocked(getAccessToken).mockReturnValue('token');

    fetchMock.mockResolvedValue(createJsonResponse({ ok: true }));

    await requester('/api/test', { method: 'GET' });

    const [, options] = fetchMock.mock.calls[0];
    const headers = (options as RequestInit).headers as Record<string, string>;

    expect(headers.Authorization).toBe('Bearer token');
  });

  it('skips Authorization header when skipAuth is true', async () => {
    vi.mocked(getAccessToken).mockReturnValue('token');

    fetchMock.mockResolvedValue(createJsonResponse({ ok: true }));

    await requester('/api/test', { method: 'GET', skipAuth: true });

    const [, options] = fetchMock.mock.calls[0];
    const headers = (options as RequestInit).headers as Record<string, string>;

    expect(headers.Authorization).toBeUndefined();
  });

  it('refreshes token on 401 and retries request', async () => {
    vi.mocked(getAccessToken).mockReturnValue('old');
    vi.mocked(getRefreshToken).mockReturnValue('refresh');

    fetchMock
      .mockResolvedValueOnce(createJsonResponse({ detail: 'Unauthorized' }, false, 401))
      .mockResolvedValueOnce(createJsonResponse({ access: 'new' }))
      .mockResolvedValueOnce(createJsonResponse({ data: 'ok' }));

    const result = await requester<{ data: string }>('/api/test', { method: 'GET' });

    expect(setTokens).toHaveBeenCalledWith('new', 'refresh');
    expect(result.data).toBe('ok');
  });

  it('throws ApiError on network failure', async () => {
    fetchMock.mockRejectedValue(new Error('network'));

    await expect(requester('/api/test', { method: 'GET' })).rejects.toBeInstanceOf(ApiError);
  });

  it('clears tokens when refresh fails', async () => {
    vi.mocked(getAccessToken).mockReturnValue('old');
    vi.mocked(getRefreshToken).mockReturnValue('refresh');

    fetchMock
      .mockResolvedValueOnce(createJsonResponse({ detail: 'Unauthorized' }, false, 401))
      .mockResolvedValueOnce(createJsonResponse({ detail: 'nope' }, false, 400));

    await expect(requester('/api/test', { method: 'GET' })).rejects.toBeInstanceOf(ApiError);
    expect(clearTokens).toHaveBeenCalled();
  });
});
