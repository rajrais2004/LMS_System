import { Request, Response, NextFunction } from 'express';
import { validatePersonalDetails, evaluateBre } from '../services/bre.service';
import { ApiError } from '../utils/errors';
import Application from '../models/Application';
import Loan from '../models/Loan';
import { createLoan } from '../services/loan.service';
import { recordAudit } from '../services/audit.service';
import { AuthRequest } from '../middleware/auth.middleware';

export async function submitPersonalDetails(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const parsed = validatePersonalDetails(req.body);
    if (!parsed.success) throw new ApiError(parsed.error.errors[0].message, 400);
    if (!req.user) throw new ApiError('Unauthorized', 401);
    const bre = evaluateBre(parsed.data);

    const application = await Application.findOneAndUpdate(
      { borrower: req.user.id },
      { borrower: req.user.id, ...parsed.data, breApproved: bre.approved, breMessage: bre.message },
      { upsert: true, new: true }
    );

    await recordAudit(req.user.id, 'SUBMIT_PERSONAL_DETAILS', application._id.toString(), { bre: bre.approved });
    res.json({ application, bre });
  } catch (error) {
    next(error);
  }
}

export async function uploadSlip(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError('Unauthorized', 401);
    const application = await Application.findOne({ borrower: req.user.id });
    if (!application) throw new ApiError('Complete BRE first', 400);
    if (!application.breApproved) throw new ApiError('BRE failed, cannot upload slip', 400);
    if (!req.file) throw new ApiError('File upload failed', 400);

    application.slipUrl = `/uploads/${req.file.filename}`;
    await application.save();
    await recordAudit(req.user.id, 'UPLOAD_SLIP', application._id.toString());
    res.json({ application });
  } catch (error) {
    next(error);
  }
}

export async function submitLoanApplication(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { amount, tenureDays } = req.body;
    if (!req.user) throw new ApiError('Unauthorized', 401);
    const application = await Application.findOne({ borrower: req.user.id });
    if (!application || !application.slipUrl) throw new ApiError('Complete salary slip upload first', 400);
    if (!application.breApproved) throw new ApiError('BRE not approved', 400);

    const loan = await createLoan(req.user.id, application._id.toString(), Number(amount), Number(tenureDays));
    await recordAudit(req.user.id, 'APPLY_LOAN', loan._id.toString(), { amount, tenureDays });
    res.json({ loan });
  } catch (error) {
    next(error);
  }
}

export async function borrowerStatus(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new ApiError('Unauthorized', 401);
    const application = await Application.findOne({ borrower: req.user.id }).lean().exec();
    const loan = await Loan.findOne({ borrower: req.user.id }).lean().exec();
    res.json({ application, loan });
  } catch (error) {
    next(error);
  }
}
