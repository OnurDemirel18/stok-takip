import express from 'express';
import { StockMoveController } from '../controllers/stockMoveController';
import { auth } from '../middlewares/auth';

const router = express.Router();

router.get('/', auth, StockMoveController.getAll);
router.post('/', auth, StockMoveController.create);

export default router; 