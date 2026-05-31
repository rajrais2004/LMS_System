import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors';
import { comparePassword, createToken, createUser, findUserByEmail } from '../services/auth.service';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) throw new ApiError('Missing required fields', 400);
    const existing = await findUserByEmail(email);
    if (existing) throw new ApiError('Email already registered', 409);
    const user = await createUser({ name, email, password });
    const token = await createToken(user as any);
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.cookie('role', user.role, { sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new ApiError('Missing required fields', 400);
    const user = await findUserByEmail(email);
    if (!user) throw new ApiError('Invalid credentials', 401);
    const valid = await comparePassword(password, user.password);
    if (!valid) throw new ApiError('Invalid credentials', 401);
    const token = await createToken(user as any);
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.cookie('role', user.role, { sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
}

export async function me(req: Request, res: Response) {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ message: 'Unauthorized' });
  res.json({ user });
}
