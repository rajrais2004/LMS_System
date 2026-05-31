import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors';
import {
  comparePassword,
  createToken,
  createUser,
  findUserByEmail,
} from '../services/auth.service';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? ('none' as const) : ('lax' as const),
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const roleCookieOptions = {
  httpOnly: false,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? ('none' as const) : ('lax' as const),
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function authResponse(res: Response, user: any, token: string) {
  res.cookie('token', token, cookieOptions);
  res.cookie('role', user.role, roleCookieOptions);

  return res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new ApiError('Missing required fields', 400);
    }

    const existing = await findUserByEmail(email);

    if (existing) {
      throw new ApiError('Email already registered', 409);
    }

    const user = await createUser({ name, email, password });
    const token = await createToken(user as any);

    return authResponse(res, user, token);
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError('Missing required fields', 400);
    }

    const user = await findUserByEmail(email);

    if (!user) {
      throw new ApiError('Invalid credentials', 401);
    }

    const valid = await comparePassword(password, user.password);

    if (!valid) {
      throw new ApiError('Invalid credentials', 401);
    }

    const token = await createToken(user as any);

    return authResponse(res, user, token);
  } catch (error) {
    next(error);
  }
}

export async function me(req: Request, res: Response) {
  const user = (req as any).user;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  return res.json({ user });
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });

  res.clearCookie('role', {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });

  return res.json({ message: 'Logged out successfully' });
}