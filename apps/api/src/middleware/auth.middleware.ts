import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/errors';

export interface AuthRequest extends Request {
  user?: { id: string; role: string; email: string };
  cookies: Record<string, string>;
  file?: Express.Multer.File;
  body: any;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.token;
  if (!token) {
    return next(new ApiError('Authentication required', 401));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET ?? 'secret');
    req.user = payload as { id: string; role: string; email: string };
    return next();
  } catch (error) {
    return next(new ApiError('Invalid token', 401));
  }
}

export function authorize(allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError('Unauthorized', 403));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError('Forbidden', 403));
    }
    next();
  };
}
