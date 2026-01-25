import { Task } from '../models/Task';
import { CreateTaskDTO, UpdateTaskDTO, ITask } from '../types/task.types';

export class TaskService {
  /**
   * Get all tasks, sorted by creation date (newest first)
   */
  async getAllTasks(): Promise<ITask[]> {
    try {
      const tasks = await Task.find().sort({ createdAt: -1 }).lean();
      return tasks.map(task => ({
        ...task,
        _id: task._id.toString()
      })) as ITask[];
    } catch (error) {
      throw new Error(`Failed to fetch tasks: ${(error as Error).message}`);
    }
  }

  /**
   * Create a new task
   */
  async createTask(taskData: CreateTaskDTO): Promise<ITask> {
    try {
      const task = new Task(taskData);
      const savedTask = await task.save();
      return savedTask.toJSON() as unknown as ITask;
    } catch (error) {
      if ((error as any).name === 'ValidationError') {
        throw new Error(`Validation failed: ${(error as Error).message}`);
      }
      throw new Error(`Failed to create task: ${(error as Error).message}`);
    }
  }

  /**
   * Update an existing task
   */
  async updateTask(id: string, updates: UpdateTaskDTO): Promise<ITask | null> {
    try {
      const task = await Task.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      );

      if (!task) {
        return null;
      }

      return task.toJSON() as unknown as ITask;
    } catch (error) {
      if ((error as any).name === 'ValidationError') {
        throw new Error(`Validation failed: ${(error as Error).message}`);
      }
      if ((error as any).name === 'CastError') {
        throw new Error('Invalid task ID format');
      }
      throw new Error(`Failed to update task: ${(error as Error).message}`);
    }
  }

  /**
   * Delete a task
   */
  async deleteTask(id: string): Promise<boolean> {
    try {
      const result = await Task.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      if ((error as any).name === 'CastError') {
        throw new Error('Invalid task ID format');
      }
      throw new Error(`Failed to delete task: ${(error as Error).message}`);
    }
  }

  /**
   * Get a single task by ID
   */
  async getTaskById(id: string): Promise<ITask | null> {
    try {
      const task = await Task.findById(id).lean();
      if (!task) {
        return null;
      }
      return {
        ...task,
        _id: task._id.toString()
      } as ITask;
    } catch (error) {
      if ((error as any).name === 'CastError') {
        throw new Error('Invalid task ID format');
      }
      throw new Error(`Failed to fetch task: ${(error as Error).message}`);
    }
  }
}

export const taskService = new TaskService();
