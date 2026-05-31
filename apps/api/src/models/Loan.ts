import mongoose, { Schema, model } from 'mongoose';

export interface ILoan extends mongoose.Document {
  borrower: string;
  application: string;
  amount: number;
  tenureDays: number;
  interestRate: number;
  simpleInterest: number;
  totalRepayment: number;
  status: 'APPLIED' | 'SANCTIONED' | 'REJECTED' | 'DISBURSED' | 'CLOSED';
  rejectionReason?: string;
  disbursedAt?: Date;
  totalPaid: number;
}

const LoanSchema = new Schema<ILoan>({
  borrower: { type: Schema.Types.ObjectId as any, ref: 'User', required: true },
  application: { type: Schema.Types.ObjectId as any, ref: 'Application', required: true },
  amount: { type: Number, required: true },
  tenureDays: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  simpleInterest: { type: Number, required: true },
  totalRepayment: { type: Number, required: true },
  status: { type: String, required: true, default: 'APPLIED' },
  rejectionReason: { type: String },
  disbursedAt: { type: Date },
  totalPaid: { type: Number, required: true, default: 0 },
}, { timestamps: true });

export default model<ILoan>('Loan', LoanSchema);
