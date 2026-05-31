import mongoose, { Schema, model } from 'mongoose';

export interface IPayment extends mongoose.Document {
  loan: string;
  utr: string;
  amount: number;
  date: Date;
}

const PaymentSchema = new Schema<IPayment>({
  loan: { type: Schema.Types.ObjectId as any, ref: 'Loan', required: true },
  utr: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
}, { timestamps: true });

export default model<IPayment>('Payment', PaymentSchema);
