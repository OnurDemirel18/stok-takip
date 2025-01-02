import express from 'express';
import { ReportController } from '../controllers/reportController';
import { auth } from '../middlewares/auth';

const router = express.Router();

router.get('/', auth, ReportController.getReports);
router.get('/download-pdf', auth, ReportController.downloadPdf);
router.get('/download-excel', auth, ReportController.downloadExcel);

export default router; 