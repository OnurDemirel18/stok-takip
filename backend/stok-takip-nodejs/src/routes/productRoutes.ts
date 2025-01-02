import express from 'express';
import { ProductController } from '../controllers/productController';
import { auth } from '../middlewares/auth';

const router = express.Router();

router.get('/search', auth, ProductController.search);

router.get('/', auth, ProductController.getAll);
router.post('/', auth, ProductController.create);
router.put('/:id', auth, ProductController.update);
router.delete('/:id', auth, ProductController.delete);

export default router; 