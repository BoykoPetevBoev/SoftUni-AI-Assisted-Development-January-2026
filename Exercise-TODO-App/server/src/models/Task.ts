import mongoose, { Schema, Document } from 'mongoose';
import { ITask, TaskStatus } from '../types/task.types';

export interface ITaskDocument extends Omit<ITask, '_id'>, Document {}

const taskSchema = new Schema<ITaskDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: ''
    },
    status: {
      type: String,
      enum: {
        values: Object.values(TaskStatus),
        message: '{VALUE} is not a valid status'
      },
      default: TaskStatus.TODO
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
taskSchema.index({ createdAt: -1 });
taskSchema.index({ status: 1 });

export const Task = mongoose.model<ITaskDocument>('Task', taskSchema);
