import { Request, Response, NextFunction } from 'express';
import { getAuditLogs } from '../services/audit.service';

export async function auditLogs(req: Request, res: Response, next: NextFunction) {
  try {
    const logs = await getAuditLogs();
    res.json({ logs });
  } catch (error) {
    next(error);
  }
}
