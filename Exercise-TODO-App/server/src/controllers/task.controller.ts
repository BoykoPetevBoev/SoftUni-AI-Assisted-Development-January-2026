import { Request, Response, NextFunction } from 'express';
import { taskService } from '../services/task.service';
import { CreateTaskDTO, UpdateTaskDTO } from '../types/task.types';

export class TaskController {
  /**
   * GET /api/tasks - Get all tasks
   */
  async getAllTasks(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tasks = await taskService.getAllTasks();
      res.status(200).json({
        success: true,
        data: tasks,
        count: tasks.length
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/tasks - Create a new task
   */
  async createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const taskData: CreateTaskDTO = req.body;

      // Validation
      if (!taskData.title || taskData.title.trim().length === 0) {
        res.status(400).json({
          success: false,
          error: 'Title is required'
        });
        return;
      }

      const task = await taskService.createTask(taskData);
      res.status(201).json({
        success: true,
        data: task,
        message: 'Task created successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/tasks/:id - Update a task
   */
  async updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      const updates: UpdateTaskDTO = req.body;

      // Validate that at least one field is being updated
      if (Object.keys(updates).length === 0) {
        res.status(400).json({
          success: false,
          error: 'No update fields provided'
        });
        return;
      }

      const task = await taskService.updateTask(id, updates);

      if (!task) {
        res.status(404).json({
          success: false,
          error: 'Task not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: task,
        message: 'Task updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/tasks/:id - Delete a task
   */
  async deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      const deleted = await taskService.deleteTask(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Task not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/tasks/:id - Get a single task
   */
  async getTaskById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params as { id: string };
      const task = await taskService.getTaskById(id);

      if (!task) {
        res.status(404).json({
          success: false,
          error: 'Task not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: task
      });
    } catch (error) {
      next(error);
    }
  }
}

export const taskController = new TaskController();
