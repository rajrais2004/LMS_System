import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createToken(user: IUser & { _id: any }) {
  return jwt.sign({ id: user._id.toString(), role: user.role, email: user.email }, process.env.JWT_SECRET ?? 'secret', { expiresIn: '7d' });
}

export async function findUserByEmail(email: string) {
  return User.findOne({ email }).exec();
}

export async function createUser(data: { name: string; email: string; password: string; role?: string }) {
  const password = await hashPassword(data.password);
  const user = new User({ name: data.name, email: data.email.toLowerCase(), password, role: data.role ?? 'BORROWER' });
  return user.save();
}
