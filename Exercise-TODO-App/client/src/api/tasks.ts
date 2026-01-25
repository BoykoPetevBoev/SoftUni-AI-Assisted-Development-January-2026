import { axiosClient } from './axiosClient';
import { Task, CreateTaskInput, UpdateTaskInput, ApiResponse } from '../types/task.types';

const TASKS_ENDPOINT = '/api/tasks';

export const tasksApi = {
  /**
   * Get all tasks
   */
  getAllTasks: async (): Promise<Task[]> => {
    const response = await axiosClient.get<ApiResponse<Task[]>>(TASKS_ENDPOINT);
    return response.data.data || [];
  },

  /**
   * Create a new task
   */
  createTask: async (input: CreateTaskInput): Promise<Task> => {
    const response = await axiosClient.post<ApiResponse<Task>>(TASKS_ENDPOINT, input);
    if (!response.data.data) {
      throw new Error('Failed to create task');
    }
    return response.data.data;
  },

  /**
   * Update an existing task
   */
  updateTask: async (id: string, input: UpdateTaskInput): Promise<Task> => {
    const response = await axiosClient.patch<ApiResponse<Task>>(
      `${TASKS_ENDPOINT}/${id}`,
      input
    );
    if (!response.data.data) {
      throw new Error('Failed to update task');
    }
    return response.data.data;
  },

  /**
   * Delete a task
   */
  deleteTask: async (id: string): Promise<void> => {
    await axiosClient.delete<ApiResponse<void>>(`${TASKS_ENDPOINT}/${id}`);
  },

  /**
   * Get a single task by ID
   */
  getTaskById: async (id: string): Promise<Task> => {
    const response = await axiosClient.get<ApiResponse<Task>>(`${TASKS_ENDPOINT}/${id}`);
    if (!response.data.data) {
      throw new Error('Task not found');
    }
    return response.data.data;
  },
};
