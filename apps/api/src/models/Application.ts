import mongoose, { Schema, model } from 'mongoose';

export interface IApplication extends mongoose.Document {
  borrower: string;
  fullName: string;
  pan: string;
  dateOfBirth: Date;
  monthlySalary: number;
  employmentMode: string;
  breApproved: boolean;
  breMessage: string;
  slipUrl?: string;
}

const ApplicationSchema = new Schema<IApplication>({
  borrower: { type: Schema.Types.ObjectId as any, ref: 'User', required: true },
  fullName: { type: String, required: true },
  pan: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  monthlySalary: { type: Number, required: true },
  employmentMode: { type: String, required: true },
  breApproved: { type: Boolean, required: true },
  breMessage: { type: String, required: true },
  slipUrl: { type: String },
}, { timestamps: true });

export default model<IApplication>('Application', ApplicationSchema);
