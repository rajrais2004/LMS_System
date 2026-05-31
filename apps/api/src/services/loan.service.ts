import Loan, { ILoan } from '../models/Loan';
import Application from '../models/Application';

export function calculateLoan(amount: number, tenureDays: number) {
  const rate = 12;
  const simpleInterest = Number(((amount * rate * tenureDays) / (365 * 100)).toFixed(2));
  const totalRepayment = Number((amount + simpleInterest).toFixed(2));
  return { interestRate: rate, simpleInterest, totalRepayment };
}

export async function createLoan(borrowerId: string, applicationId: string, amount: number, tenureDays: number) {
  const application = await Application.findById(applicationId);
  if (!application) throw new Error('Application not found');
  const calculation = calculateLoan(amount, tenureDays);

  const loan = new Loan({
    borrower: borrowerId,
    application: applicationId,
    amount,
    tenureDays,
    interestRate: calculation.interestRate,
    simpleInterest: calculation.simpleInterest,
    totalRepayment: calculation.totalRepayment,
    status: 'APPLIED',
    totalPaid: 0,
  });

  return loan.save();
}

export async function updateLoanStatus(loanId: string, status: ILoan['status'], reason?: string) {
  return Loan.findByIdAndUpdate(loanId, { status, rejectionReason: reason, ...(status === 'DISBURSED' ? { disbursedAt: new Date() } : {}) }, { new: true }).exec();
}

export async function getOutstanding(loanId: string) {
  const loan = await Loan.findById(loanId).lean().exec();
  if (!loan) return null;
  return Number((loan.totalRepayment - loan.totalPaid).toFixed(2));
}
