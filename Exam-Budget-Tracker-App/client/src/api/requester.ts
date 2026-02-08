import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '../utils/tokenStorage';

const API_BASE_URL = 'http://localhost:8000';

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, data: unknown, message?: string) {
    super(message || 'API Error');
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      clearTokens();
      return null;
    }

    const data = await response.json();
    if (data.access && refreshToken) {
      setTokens(data.access, refreshToken);
      return data.access;
    }

    return null;
  } catch {
    clearTokens();
    return null;
  }
}

export async function requester<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { skipAuth = false, ...requestOptions } = options;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Merge with any provided headers
  if (requestOptions.headers) {
    const providedHeaders = requestOptions.headers as Record<string, string>;
    Object.assign(headers, providedHeaders);
  }

  // Add Authorization header if not skipped and token exists
  if (!skipAuth) {
    const accessToken = getAccessToken();
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  try {
    let response = await fetch(url, {
      ...requestOptions,
      headers,
    });

    // Handle 401 - try to refresh token
    if (response.status === 401 && !skipAuth) {
      const newAccessToken = await refreshAccessToken();
      
      if (newAccessToken) {
        // Retry the request with new token
        headers['Authorization'] = `Bearer ${newAccessToken}`;
        response = await fetch(url, {
          ...requestOptions,
          headers,
        });
      } else {
        // Refresh failed, clear tokens and throw error
        clearTokens();
        throw new ApiError(401, { detail: 'Authentication required' }, 'Unauthorized');
      }
    }

    // Parse response
    const contentType = response.headers.get('content-type');
    let data: unknown;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Handle non-OK responses
    if (!response.ok) {
      throw new ApiError(
        response.status,
        data,
        typeof data === 'string' ? data : JSON.stringify(data)
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle network errors
    throw new ApiError(0, { detail: 'Network error' }, 'Failed to connect to server');
  }
}
