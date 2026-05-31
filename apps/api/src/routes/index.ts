import { Router, Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import fs from 'fs';
import path from 'path';

import * as authController from '../controllers/auth.controller';
import * as borrowerController from '../controllers/borrower.controller';
import * as dashboardController from '../controllers/dashboard.controller';
import * as paymentController from '../controllers/payment.controller';
import * as auditController from '../controllers/audit.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

const uploadDir = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: function (_req, _file, cb) {
      cb(null, uploadDir);
    },
    filename: function (_req, file, cb) {
      const timestamp = Date.now();
      const safeName = file.originalname.replace(/\s+/g, '-');
      cb(null, `${timestamp}-${safeName}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req: Request, file, cb: FileFilterCallback) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png'];

    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Only PDF, JPG, and PNG files are allowed'));
    }

    cb(null, true);
  },
});

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authenticate, authController.me);

router.post(
  '/borrower/personal-details',
  authenticate,
  authorize(['BORROWER']),
  borrowerController.submitPersonalDetails
);

router.post(
  '/borrower/upload-slip',
  authenticate,
  authorize(['BORROWER']),
  upload.single('slip'),
  borrowerController.uploadSlip
);

router.post(
  '/borrower/apply',
  authenticate,
  authorize(['BORROWER']),
  borrowerController.submitLoanApplication
);

router.get(
  '/borrower/status',
  authenticate,
  authorize(['BORROWER']),
  borrowerController.borrowerStatus
);

router.get(
  '/dashboard/sales',
  authenticate,
  authorize(['SALES', 'ADMIN']),
  dashboardController.salesList
);

router.get(
  '/dashboard/sanction',
  authenticate,
  authorize(['SANCTION', 'ADMIN']),
  dashboardController.sanctionList
);

router.get(
  '/dashboard/disbursement',
  authenticate,
  authorize(['DISBURSEMENT', 'ADMIN']),
  dashboardController.disbursementList
);

router.get(
  '/dashboard/collection',
  authenticate,
  authorize(['COLLECTION', 'ADMIN']),
  dashboardController.collectionList
);

router.post(
  '/dashboard/loan-action',
  authenticate,
  authorize(['ADMIN', 'SANCTION', 'DISBURSEMENT']),
  dashboardController.updateLoan
);

router.post(
  '/payments',
  authenticate,
  authorize(['COLLECTION', 'ADMIN']),
  paymentController.addPaymentRecord
);

router.get(
  '/payments/:loanId',
  authenticate,
  authorize(['COLLECTION', 'ADMIN', 'BORROWER']),
  paymentController.paymentsForLoan
);

router.get('/audit', authenticate, authorize(['ADMIN']), auditController.auditLogs);

export default router;