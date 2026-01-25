import React, { useState, useMemo } from 'react';
import { Task, TaskStatus, CreateTaskInput, UpdateTaskInput } from '../types/task.types';
import { useGetTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../hooks/useTasks';
import { useToast } from '../components/Toast';
import { TaskCard } from '../components/TaskCard';
import { TaskModal } from '../components/TaskModal';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import './TasksPage.css';

type FilterType = 'all' | TaskStatus;

export const TasksPage: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const { showToast } = useToast();
  const { data: tasks = [], isLoading } = useGetTasks();

  const createMutation = useCreateTask(
    () => {
      showToast('Task created successfully!', 'success');
      setIsCreateModalOpen(false);
    },
    (error) => {
      showToast(error.message || 'Failed to create task', 'error');
    }
  );

  const updateMutation = useUpdateTask(
    () => {
      showToast('Task updated successfully!', 'success');
      setEditingTask(null);
    },
    (error) => {
      showToast(error.message || 'Failed to update task', 'error');
    }
  );

  const deleteMutation = useDeleteTask(
    () => {
      showToast('Task deleted successfully!', 'success');
      setDeletingTask(null);
    },
    (error) => {
      showToast(error.message || 'Failed to delete task', 'error');
    }
  );

  const filteredTasks = useMemo(() => {
    if (filter === 'all') return tasks;
    return tasks.filter((task) => task.status === filter);
  }, [tasks, filter]);

  const handleCreateTask = (input: CreateTaskInput) => {
    createMutation.mutate(input);
  };

  const handleUpdateTask = (input: UpdateTaskInput) => {
    if (editingTask) {
      updateMutation.mutate({ id: editingTask._id, updates: input });
    }
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateMutation.mutate({ id: taskId, updates: { status: newStatus } });
  };

  const handleDeleteTask = () => {
    if (deletingTask) {
      deleteMutation.mutate(deletingTask._id);
    }
  };

  const getEmptyStateConfig = () => {
    switch (filter) {
      case TaskStatus.TODO:
        return {
          title: 'No To Do Tasks',
          message: 'You have no tasks in your to do list. Create a new task to get started!',
          icon: '📝',
        };
      case TaskStatus.IN_PROGRESS:
        return {
          title: 'No Tasks In Progress',
          message: 'You have no tasks currently in progress. Start working on a task!',
          icon: '⚡',
        };
      case TaskStatus.COMPLETED:
        return {
          title: 'No Completed Tasks',
          message: 'You haven\'t completed any tasks yet. Keep working!',
          icon: '✨',
        };
      default:
        return {
          title: 'No Tasks Yet',
          message: 'Get started by creating your first task!',
          icon: '📋',
        };
    }
  };

  const filterCounts = useMemo(() => {
    return {
      all: tasks.length,
      [TaskStatus.TODO]: tasks.filter((t) => t.status === TaskStatus.TODO).length,
      [TaskStatus.IN_PROGRESS]: tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length,
      [TaskStatus.COMPLETED]: tasks.filter((t) => t.status === TaskStatus.COMPLETED).length,
    };
  }, [tasks]);

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <div className="header-content">
          <h1 className="page-title">My Tasks</h1>
          <button
            className="btn btn-primary create-btn"
            onClick={() => setIsCreateModalOpen(true)}
          >
            + Create Task
          </button>
        </div>

        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
            <span className="filter-count">{filterCounts.all}</span>
          </button>
          <button
            className={`filter-tab ${filter === TaskStatus.TODO ? 'active' : ''}`}
            onClick={() => setFilter(TaskStatus.TODO)}
          >
            To Do
            <span className="filter-count">{filterCounts[TaskStatus.TODO]}</span>
          </button>
          <button
            className={`filter-tab ${filter === TaskStatus.IN_PROGRESS ? 'active' : ''}`}
            onClick={() => setFilter(TaskStatus.IN_PROGRESS)}
          >
            In Progress
            <span className="filter-count">{filterCounts[TaskStatus.IN_PROGRESS]}</span>
          </button>
          <button
            className={`filter-tab ${filter === TaskStatus.COMPLETED ? 'active' : ''}`}
            onClick={() => setFilter(TaskStatus.COMPLETED)}
          >
            Completed
            <span className="filter-count">{filterCounts[TaskStatus.COMPLETED]}</span>
          </button>
        </div>
      </div>

      <div className="tasks-content">
        {isLoading ? (
          <LoadingSkeleton />
        ) : filteredTasks.length === 0 ? (
          <EmptyState {...getEmptyStateConfig()} />
        ) : (
          <div className="tasks-grid">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={setEditingTask}
                onDelete={setDeletingTask}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>

      <TaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
        isLoading={createMutation.isPending}
      />

      <TaskModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSubmit={handleUpdateTask}
        task={editingTask || undefined}
        isLoading={updateMutation.isPending}
      />

      <DeleteConfirmationModal
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={handleDeleteTask}
        taskTitle={deletingTask?.title || ''}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
