import { Router, Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import * as authController from '../controllers/auth.controller';
import * as borrowerController from '../controllers/borrower.controller';
import * as dashboardController from '../controllers/dashboard.controller';
import * as paymentController from '../controllers/payment.controller';
import * as auditController from '../controllers/audit.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();
const upload = multer({
  storage: multer.diskStorage({
    destination: function (_req, _file, cb) {
      cb(null, 'uploads');
    },
    filename: function (_req, file, cb) {
      const timestamp = Date.now();
      cb(null, `${timestamp}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req: Request, file, cb: FileFilterCallback) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
    cb(null, allowed.includes(file.mimetype));
  },
});

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authenticate, authController.me);

router.post('/borrower/personal-details', authenticate, authorize(['BORROWER']), borrowerController.submitPersonalDetails);
router.post('/borrower/upload-slip', authenticate, authorize(['BORROWER']), upload.single('slip'), borrowerController.uploadSlip);
router.post('/borrower/apply', authenticate, authorize(['BORROWER']), borrowerController.submitLoanApplication);
router.get('/borrower/status', authenticate, authorize(['BORROWER']), borrowerController.borrowerStatus);

router.get('/dashboard/sales', authenticate, authorize(['SALES', 'ADMIN']), dashboardController.salesList);
router.get('/dashboard/sanction', authenticate, authorize(['SANCTION', 'ADMIN']), dashboardController.sanctionList);
router.get('/dashboard/disbursement', authenticate, authorize(['DISBURSEMENT', 'ADMIN']), dashboardController.disbursementList);
router.get('/dashboard/collection', authenticate, authorize(['COLLECTION', 'ADMIN']), dashboardController.collectionList);
router.post('/dashboard/loan-action', authenticate, authorize(['ADMIN', 'SANCTION', 'DISBURSEMENT']), dashboardController.updateLoan);

router.post('/payments', authenticate, authorize(['COLLECTION', 'ADMIN']), paymentController.addPaymentRecord);
router.get('/payments/:loanId', authenticate, authorize(['COLLECTION', 'ADMIN', 'BORROWER', 'ADMIN']), paymentController.paymentsForLoan);

router.get('/audit', authenticate, authorize(['ADMIN']), auditController.auditLogs);

export default router;
