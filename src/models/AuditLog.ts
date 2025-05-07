import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAuditLog extends Document {
  userId: mongoose.Types.ObjectId;
  action: string;
  taskId?: mongoose.Types.ObjectId;
  details?: any;
  timestamp: Date;
}

const AuditLogSchema: Schema<IAuditLog> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  taskId: { type: Schema.Types.ObjectId, ref: 'Task' },
  details: { type: Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now },
});

const AuditLog: Model<IAuditLog> = mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);

export default AuditLog; 