import { Request, Response, NextFunction } from 'express';
import { addPayment, findPaymentsByLoan } from '../services/payment.service';
import { recordAudit } from '../services/audit.service';
import { AuthRequest } from '../middleware/auth.middleware';

export async function addPaymentRecord(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { loanId, utr, amount, date } = req.body;
    const payment = await addPayment(loanId, utr, Number(amount), date);
    await recordAudit(req.user!.id, 'RECORD_PAYMENT', loanId, { utr, amount, date });
    res.json({ payment });
  } catch (error) {
    next(error);
  }
}

export async function paymentsForLoan(req: Request, res: Response, next: NextFunction) {
  try {
    const { loanId } = req.params;
    const payments = await findPaymentsByLoan(loanId);
    res.json({ payments });
  } catch (error) {
    next(error);
  }
}
