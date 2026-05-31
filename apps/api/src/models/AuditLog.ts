import mongoose, { Schema, model } from 'mongoose';

export interface IAuditLog extends mongoose.Document {
  user: string;
  action: string;
  loan?: string;
  meta?: Record<string, any>;
}

const AuditLogSchema = new Schema<IAuditLog>({
  user: { type: Schema.Types.ObjectId as any, ref: 'User', required: true },
  action: { type: String, required: true },
  loan: { type: Schema.Types.ObjectId as any, ref: 'Loan' },
  meta: { type: Schema.Types.Mixed },
}, { timestamps: true });

export default model<IAuditLog>('AuditLog', AuditLogSchema);
