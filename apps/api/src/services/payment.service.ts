import Loan from '../models/Loan';
import Payment from '../models/Payment';

export async function addPayment(loanId: string, utr: string, amount: number, date: string) {
  const loan = await Loan.findById(loanId);
  if (!loan) throw new Error('Loan not found');

  if (loan.status !== 'DISBURSED') {
    throw new Error('Payments can only be recorded for disbursed loans.');
  }

  const outstanding = Number((loan.totalRepayment - loan.totalPaid).toFixed(2));
  if (amount > outstanding) {
    throw new Error('Payment exceeds outstanding balance.');
  }

  const payment = new Payment({ loan: loanId, utr, amount, date: new Date(date) });
  await payment.save();

  loan.totalPaid += amount;
  if (loan.totalPaid >= loan.totalRepayment) {
    loan.totalPaid = loan.totalRepayment;
    loan.status = 'CLOSED';
  }
  await loan.save();

  return payment;
}

export async function findPaymentsByLoan(loanId: string) {
  return Payment.find({ loan: loanId }).sort({ date: -1 }).lean().exec();
}
