import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks';
import { Task, CreateTaskInput, UpdateTaskInput } from '../types/task.types';

const TASKS_QUERY_KEY = ['tasks'];

/**
 * Hook to fetch all tasks
 */
export const useGetTasks = () => {
  return useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: tasksApi.getAllTasks,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });
};

/**
 * Hook to create a new task
 */
export const useCreateTask = (onSuccess?: () => void, onError?: (error: Error) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTaskInput) => tasksApi.createTask(input),
    onSuccess: (newTask) => {
      // Optimistically update the cache
      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (old = []) => [newTask, ...old]);
      // Invalidate to refetch and ensure consistency
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });
};

/**
 * Hook to update a task
 */
export const useUpdateTask = (onSuccess?: () => void, onError?: (error: Error) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateTaskInput }) =>
      tasksApi.updateTask(id, updates),
    onMutate: async ({ id, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });

      // Snapshot previous value
      const previousTasks = queryClient.getQueryData<Task[]>(TASKS_QUERY_KEY);

      // Optimistically update
      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (old = []) =>
        old.map((task) =>
          task._id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
        )
      );

      return { previousTasks };
    },
    onError: (error: Error, _variables, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, context.previousTasks);
      }
      onError?.(error);
    },
    onSuccess: () => {
      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      onSuccess?.();
    },
  });
};

/**
 * Hook to delete a task
 */
export const useDeleteTask = (onSuccess?: () => void, onError?: (error: Error) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tasksApi.deleteTask(id),
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });

      // Snapshot previous value
      const previousTasks = queryClient.getQueryData<Task[]>(TASKS_QUERY_KEY);

      // Optimistically remove task
      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (old = []) =>
        old.filter((task) => task._id !== id)
      );

      return { previousTasks };
    },
    onError: (error: Error, _id, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, context.previousTasks);
      }
      onError?.(error);
    },
    onSuccess: () => {
      // Invalidate to ensure consistency
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      onSuccess?.();
    },
  });
};
