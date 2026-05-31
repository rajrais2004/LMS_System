import { z } from 'zod';

const personalDetailsSchema = z.object({
  fullName: z.string().min(3),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/),
  dateOfBirth: z.string().refine((value) => !Number.isNaN(Date.parse(value)), 'Invalid date'),
  monthlySalary: z.number().min(0),
  employmentMode: z.string().min(1),
});

export type PersonalDetailsInput = z.infer<typeof personalDetailsSchema>;

export function evaluateBre(data: PersonalDetailsInput) {
  const birth = new Date(data.dateOfBirth);
  const age = Math.floor((Date.now() - birth.getTime()) / 31557600000);
  const goodAge = age >= 23 && age <= 50;
  const goodSalary = data.monthlySalary >= 25000;
  const validPan = /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(data.pan);
  const employed = data.employmentMode !== 'Unemployed';

  if (!goodAge) {
    return { approved: false, message: 'Borrower must be between 23 and 50 years old.' };
  }
  if (!goodSalary) {
    return { approved: false, message: 'Salary must be at least ₹25,000.' };
  }
  if (!validPan) {
    return { approved: false, message: 'PAN does not match required format.' };
  }
  if (!employed) {
    return { approved: false, message: 'Employment mode cannot be Unemployed.' };
  }

  return { approved: true, message: 'BRE passed. Borrower is eligible for loan application.' };
}

export function validatePersonalDetails(data: any) {
  return personalDetailsSchema.safeParse(data);
}
