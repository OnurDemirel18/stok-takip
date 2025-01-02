import express from 'express';
import { DashboardController } from '../controllers/dashboardController';
import { auth } from '../middlewares/auth';

const router = express.Router();

router.get('/stats', auth, DashboardController.getStats);

export default router; 