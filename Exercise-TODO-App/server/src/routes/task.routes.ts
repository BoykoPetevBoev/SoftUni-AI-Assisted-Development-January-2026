import { Router } from 'express';
import { taskController } from '../controllers/task.controller';

const router = Router();

// GET /api/tasks - Get all tasks
router.get('/', taskController.getAllTasks.bind(taskController));

// POST /api/tasks - Create a new task
router.post('/', taskController.createTask.bind(taskController));

// GET /api/tasks/:id - Get a single task
router.get('/:id', taskController.getTaskById.bind(taskController));

// PATCH /api/tasks/:id - Update a task
router.patch('/:id', taskController.updateTask.bind(taskController));

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', taskController.deleteTask.bind(taskController));

export default router;
