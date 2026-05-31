import { Request, Response, NextFunction } from 'express';
import Application from '../models/Application';
import Loan from '../models/Loan';
import { updateLoanStatus } from '../services/loan.service';
import { recordAudit } from '../services/audit.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { ApiError } from '../utils/errors';

export async function salesList(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const borrowers = await Application.find({}).populate('borrower', 'name email').lean().exec();
    const filtered = borrowers.filter((item) => !item.breApproved || !item.slipUrl);
    res.json({ borrowers: filtered });
  } catch (error) {
    next(error);
  }
}

export async function sanctionList(req: Request, res: Response, next: NextFunction) {
  try {
    const loans = await Loan.find({ status: 'APPLIED' }).populate('borrower', 'name email').lean().exec();
    res.json({ loans });
  } catch (error) {
    next(error);
  }
}

export async function disbursementList(req: Request, res: Response, next: NextFunction) {
  try {
    const loans = await Loan.find({ status: 'SANCTIONED' }).populate('borrower', 'name email').lean().exec();
    res.json({ loans });
  } catch (error) {
    next(error);
  }
}

export async function collectionList(req: Request, res: Response, next: NextFunction) {
  try {
    const loans = await Loan.find({ status: 'DISBURSED' }).populate('borrower', 'name email').lean().exec();
    res.json({ loans });
  } catch (error) {
    next(error);
  }
}

export async function updateLoan(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { loanId, action, reason } = req.body;
    if (!loanId || !action) throw new ApiError('Missing loan ID or action', 400);
    let nextStatus: 'SANCTIONED' | 'REJECTED' | 'DISBURSED';
    let meta = {};

    if (action === 'approve') nextStatus = 'SANCTIONED';
    else if (action === 'reject') nextStatus = 'REJECTED';
    else if (action === 'disburse') nextStatus = 'DISBURSED';
    else throw new ApiError('Unknown action', 400);

    const loan = await updateLoanStatus(loanId, nextStatus, action === 'reject' ? reason : undefined);
    if (!loan) throw new ApiError('Loan not found', 404);
    await recordAudit(req.user!.id, action.toUpperCase(), loanId, { reason });
    res.json({ loan });
  } catch (error) {
    next(error);
  }
}
