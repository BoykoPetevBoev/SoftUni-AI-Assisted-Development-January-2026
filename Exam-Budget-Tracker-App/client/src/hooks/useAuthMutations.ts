import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { loginUser, registerUser, getCurrentUser, logoutUser } from '../services/auth.service';
import type { User } from '../types/auth';

// Mutation hook for login
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      loginUser(username, password),
  });
};

// Mutation hook for registration
export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: ({
      username,
      email,
      password,
      passwordConfirm,
    }: {
      username: string;
      email: string;
      password: string;
      passwordConfirm: string;
    }) => registerUser(username, email, password, passwordConfirm),
  });
};

// Query hook for fetching current user
export const useFetchCurrentUser = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['auth', 'currentUser'],
    queryFn: getCurrentUser,
    enabled,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

// Mutation hook for logout
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (refreshToken: string) => logoutUser(refreshToken),
    onSuccess: () => {
      // Clear the current user query cache
      queryClient.removeQueries({ queryKey: ['auth', 'currentUser'] });
    },
    onError: () => {
      // Even on error, clear the cache for logout
      queryClient.removeQueries({ queryKey: ['auth', 'currentUser'] });
    },
  });
};

// Hook to invalidate current user query (useful for manual auth state updates)
export const useInvalidateCurrentUser = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['auth', 'currentUser'] });
};

// Hook to set current user in cache (useful for after login)
export const useSetCurrentUserCache = () => {
  const queryClient = useQueryClient();
  return (user: User) => {
    queryClient.setQueryData(['auth', 'currentUser'], user);
  };
};
