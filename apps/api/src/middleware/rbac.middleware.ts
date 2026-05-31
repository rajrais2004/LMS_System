import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors';
import { AuthRequest } from './auth.middleware';

const rolePages: Record<string, string[]> = {
  ADMIN: ['sales', 'sanction', 'disbursement', 'collection', 'admin'],
  SALES: ['sales'],
  SANCTION: ['sanction'],
  DISBURSEMENT: ['disbursement'],
  COLLECTION: ['collection'],
};

export function enforceRole(moduleName: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError('Unauthorized', 401));
    }
    const allowed = rolePages[req.user.role] || [];
    if (!allowed.includes(moduleName) && req.user.role !== 'ADMIN') {
      return next(new ApiError('Forbidden', 403));
    }
    next();
  };
}
