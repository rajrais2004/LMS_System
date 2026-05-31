import AuditLog from '../models/AuditLog';

export async function recordAudit(userId: string, action: string, loanId?: string, meta?: Record<string, any>) {
  const entry = new AuditLog({ user: userId, action, loan: loanId, meta });
  return entry.save();
}

export async function getAuditLogs() {
  return AuditLog.find().sort({ createdAt: -1 }).populate('user', 'name role').lean().exec();
}
