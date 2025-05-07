import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description: string;
  dueDate: Date;
  status: 'pending' | 'in-progress' | 'completed';
  createdBy: mongoose.Types.ObjectId;
  assignedTo: mongoose.Types.ObjectId;
  recurring?: boolean;
  recurrenceType?: 'daily' | 'weekly' | 'monthly' | null;
  recurrenceEndDate?: Date | null;
}

const TaskSchema: Schema<ITask> = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recurring: { type: Boolean, default: false },
  recurrenceType: { type: String, enum: ['daily', 'weekly', 'monthly', null], default: null },
  recurrenceEndDate: { type: Date, default: null },
}, {
  timestamps: true,
});

const Task: Model<ITask> = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default Task;
