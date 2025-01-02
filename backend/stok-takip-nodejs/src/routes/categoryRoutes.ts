import express from 'express';
import { CategoryController } from '../controllers/categoryController';
import { auth } from '../middlewares/auth';

const router = express.Router();

router.get('/', auth, CategoryController.getAll);
router.post('/', auth, CategoryController.create);
router.delete('/:id', auth, CategoryController.delete);

export default router; 