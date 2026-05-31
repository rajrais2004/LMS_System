import dotenv from 'dotenv';
import path from 'path';
import { connectDatabase } from '../config/db';
import { createUser } from '../services/auth.service';
import User from '../models/User';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const users = [
  { name: 'Admin User', email: 'admin@lms.com', password: 'Pass@123', role: 'ADMIN' },
  { name: 'Sales Operator', email: 'sales@lms.com', password: 'Pass@123', role: 'SALES' },
  { name: 'Sanction Operator', email: 'sanction@lms.com', password: 'Pass@123', role: 'SANCTION' },
  { name: 'Disbursement Operator', email: 'disbursement@lms.com', password: 'Pass@123', role: 'DISBURSEMENT' },
  { name: 'Collection Operator', email: 'collection@lms.com', password: 'Pass@123', role: 'COLLECTION' },
  { name: 'Borrower One', email: 'borrower@lms.com', password: 'Pass@123', role: 'BORROWER' },
];

async function seed() {
  await connectDatabase(process.env.MONGO_URI ?? 'mongodb://localhost:27017/lms');
  await User.deleteMany({ email: { $in: users.map((u) => u.email) } });

  for (const user of users) {
    await createUser(user);
    // eslint-disable-next-line no-console
    console.log(`Created ${user.role}: ${user.email}`);
  }

  process.exit(0);
}

seed().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Seeding failed', error);
  process.exit(1);
});
